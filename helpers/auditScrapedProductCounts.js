const pool = require("../configs/postgresql.config");
const sendEmailWithEJSTemplate = require("../utils/sendEmail");

const THRESHOLD = 0.8; // alert when today < 80% of yesterday

function getAlertRecipients() {
  return process.env.USER_MAIL ? [process.env.USER_MAIL] : [];
}

/**
 * After daily scrapes finish, compare today's product counts vs yesterday
 * per website. Email admins for any site under 80% of yesterday's count.
 */
const auditScrapedProductCounts = async () => {
  console.log("[scrape-count-audit] Checking product counts vs yesterday...");

  const { rows } = await pool.query(`
    WITH counts AS (
      SELECT
        website,
        COUNT(*) FILTER (
          WHERE last_checked >= CURRENT_DATE
            AND last_checked < CURRENT_DATE + 1
        ) AS today_count,
        COUNT(*) FILTER (
          WHERE last_checked >= CURRENT_DATE - 1
            AND last_checked < CURRENT_DATE
        ) AS yesterday_count
      FROM product
      GROUP BY website
    )
    SELECT
      website,
      yesterday_count::int AS yesterday_count,
      today_count::int AS today_count,
      ROUND(
        100.0 * today_count / NULLIF(yesterday_count, 0),
        1
      ) AS pct_of_yesterday
    FROM counts
    WHERE yesterday_count > 0
    ORDER BY website;
  `);

  const failing = rows.filter(
    (row) => Number(row.today_count) < THRESHOLD * Number(row.yesterday_count)
  );

  if (failing.length === 0) {
    console.log(
      `[scrape-count-audit] OK — all ${rows.length} websites scraped >= 80% of yesterday`
    );
    return { ok: true, failing: [], all: rows };
  }

  const recipients = getAlertRecipients();
  if (recipients.length === 0) {
    console.error(
      "[scrape-count-audit] Failing sites found but no USER_MAIL configured"
    );
    console.error(
      "[scrape-count-audit] Failing:",
      failing.map(
        (r) =>
          `${r.website}: ${r.today_count}/${r.yesterday_count} (${r.pct_of_yesterday}%)`
      )
    );
    return { ok: false, failing, all: rows, emailed: false };
  }

  const subject = `[PricePort Domestic] Scrape count alert — ${failing.length} website(s) under 80%`;
  const emailData = {
    checkedAt: new Date().toISOString(),
    thresholdPct: Math.round(THRESHOLD * 100),
    failing,
    all: rows,
  };

  await Promise.all(
    recipients.map((to) =>
      sendEmailWithEJSTemplate(
        to,
        subject,
        `/../views/scrape-count-alert.ejs`,
        emailData
      )
    )
  );

  console.log(
    `[scrape-count-audit] Alert emailed to ${recipients.join(", ")} for ${failing.length} website(s)`
  );
  failing.forEach((r) => {
    console.log(
      `  - ${r.website}: today=${r.today_count}, yesterday=${r.yesterday_count}, ${r.pct_of_yesterday}%`
    );
  });

  return { ok: false, failing, all: rows, emailed: true };
};

module.exports = auditScrapedProductCounts;

const pool = require("../configs/postgresql.config");
const sendEmailWithEJSTemplate = require("../utils/sendEmail");

const THRESHOLD = 0.8; // alert when today < 80% of yesterday

function getAlertRecipients() {
  return process.env.USER_MAIL ? [process.env.USER_MAIL] : [];
}


const auditScrapedProductCounts = async () => {
  console.log(
    "[scrape-count-audit] Checking product counts vs yesterday (Auckland days)..."
  );

  const { rows } = await pool.query(`
    WITH nz AS (
      SELECT (now() AT TIME ZONE 'Pacific/Auckland')::date AS today_nz
    ),
    counts AS (
      SELECT
        p.website,
        COUNT(*) FILTER (
          WHERE (p.last_checked AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific/Auckland')::date
                = nz.today_nz
        ) AS today_count,
        COUNT(*) FILTER (
          WHERE (p.last_checked AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific/Auckland')::date
                = nz.today_nz - 1
        ) AS yesterday_count
      FROM product p
      CROSS JOIN nz
      GROUP BY p.website
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

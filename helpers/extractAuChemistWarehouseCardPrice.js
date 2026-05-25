/**
 * Browser-side price extractor for AU Chemist Warehouse PLP cards.
 * Must stay a plain function so its source can be passed into `page.evaluate`.
 *
 * Price column: `div.flex.flex-col[class*="min-h"]` under `mt-space-heading-body`.
 * The site can leave stale numbers in some nodes while `innerText` on the stack
 * already shows "$29.99 … $76.01 Off RRP". We combine:
 *   - min of `[data-cy="dollar-string"]` in the stack outside `.text-brand-red`
 *   - min of all `$…` amounts in stack text **before** "Off RRP"
 * then take the overall minimum (same stack, responsive dupes: min across stacks).
 */
function extractAuChemistWarehouseCardPrice(product) {
  const isStruck = (el) => {
    let node = el;
    for (let i = 0; i < 5; i++) {
      if (!node) break;
      const s = window.getComputedStyle(node);
      if (s.textDecorationLine && s.textDecorationLine.includes("line-through")) {
        return true;
      }
      const c = node.getAttribute("class") || "";
      if (c.includes("line-through")) return true;
      node = node.parentElement;
    }
    return false;
  };

  const inSavingsRow = (el) => !!el.closest(".text-brand-red");

  const notRenderable = (el) => {
    let node = el;
    for (let i = 0; i < 12; i++) {
      if (!node) break;
      if (node.hasAttribute("hidden")) return true;
      if (node.getAttribute("aria-hidden") === "true") return true;
      const cls = node.getAttribute("class") || "";
      if (/\bsr-only\b/.test(cls)) return true;
      const s = window.getComputedStyle(node);
      if (s.display === "none" || s.visibility === "hidden") return true;
      if (parseFloat(s.opacity) === 0) return true;
      node = node.parentElement;
    }
    return false;
  };

  const bumpDollarsFromString = (str, bestRef) => {
    const re = /\$\s*(\d+(?:\.\d+)?)/g;
    let m;
    while ((m = re.exec(str)) !== null) {
      const v = parseFloat(m[1]);
      if (Number.isFinite(v) && v < bestRef.v) bestRef.v = v;
    }
  };

  /** One number per visible price stack: structured + visible text before "Off RRP". */
  const shelfBestFromStack = (stack) => {
    if (notRenderable(stack)) return null;
    const bestRef = { v: Infinity };

    stack.querySelectorAll('[data-cy="dollar-string"]').forEach((el) => {
      if (el.closest(".text-brand-red")) return;
      if (notRenderable(el) || isStruck(el)) return;
      bumpDollarsFromString(el.textContent || "", bestRef);
    });

    const beforeOff = (stack.innerText || "").split(/\s*Off\s*RRP/i)[0];
    bumpDollarsFromString(beforeOff, bestRef);

    return bestRef.v === Infinity ? null : bestRef.v;
  };

  const headingBody =
    product.querySelector("div.mt-space-heading-body") || product;

  const stacks = headingBody.querySelectorAll(
    'div.flex.flex-col[class*="min-h"]'
  );

  const shelfValues = [];
  stacks.forEach((stack) => {
    const v = shelfBestFromStack(stack);
    if (v !== null) shelfValues.push(v);
  });

  if (shelfValues.length) {
    return `$${Math.min(...shelfValues).toFixed(2)}`;
  }

  /** Fallback: heading block, same rules without stack boundary. */
  const bestRef = { v: Infinity };
  headingBody.querySelectorAll('[data-cy="dollar-string"]').forEach((el) => {
    if (el.closest(".text-brand-red")) return;
    if (notRenderable(el) || isStruck(el)) return;
    bumpDollarsFromString(el.textContent || "", bestRef);
  });
  const hbBeforeOff = (headingBody.innerText || "").split(/\s*Off\s*RRP/i)[0];
  bumpDollarsFromString(hbBeforeOff, bestRef);

  if (bestRef.v !== Infinity) {
    return `$${bestRef.v.toFixed(2)}`;
  }

  const legacy = headingBody.querySelector(
    "p.text-colour-title-light.headline-xl"
  );
  if (legacy && !notRenderable(legacy) && !isStruck(legacy)) {
    const t = legacy.textContent.trim();
    const m = t.match(/\$\s*(\d+(?:\.\d+)?)/);
    if (m) return `$${parseFloat(m[1]).toFixed(2)}`;
    return t || null;
  }

  return null;
}

module.exports = extractAuChemistWarehouseCardPrice;

// Marking and number formatting. Shared by the app (js/app.js) and the
// question checker (tools/check-questions.js), so both always agree.
(function () {
  'use strict';
  // Rounds half away from zero, avoiding floating-point slips such as 1.005 → 1.00.
  function roundTo(x, dp) {
    const sign = x < 0 ? -1 : 1;
    const abs = Math.abs(x);
    if (String(abs).includes('e')) return sign * Math.round(abs * Math.pow(10, dp)) / Math.pow(10, dp);
    return sign * Number(Math.round(Number(abs + 'e' + dp)) + 'e-' + dp);
  }
  const same = (a, b) => Math.abs(a - b) < 1e-9;

  // Accepts "1,000", " -4.5 ", "−1000" (typographic minus). Returns null if not a number.
  function parseAnswer(raw) {
    const s = String(raw ?? '').trim().replace(/[−–]/g, '-').replace(/[,\s]/g, '');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    const dec = s.includes('.') ? s.split('.')[1].length : 0;
    return { value: Number(s), decimals: dec };
  }

  function formatNumber(n, dp) {
    const opts = dp != null ? { minimumFractionDigits: dp, maximumFractionDigits: dp } : { maximumFractionDigits: 6 };
    const v = dp != null ? roundTo(n, dp) : Math.round(n * 1e9) / 1e9;
    return v.toLocaleString('en-GB', opts).replace('-', '−');
  }
  const withUnit = (text, unit) => unit === '%' ? `${text}%` : `${text} ${unit}`;
  function formatAnswer(q) {
    if (q.answerType === 'time') return q.expected;
    return withUnit(formatNumber(q.expected, q.dp), q.unit);
  }
  // Accepts 09:30, 9:30, 9.30 or 0930.
  const normaliseTime = t => {
    const m = String(t || '').trim().match(/^(\d{1,2})[:.h]?(\d{2})$/);
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return '';
    return `${m[1].padStart(2, '0')}:${m[2]}`;
  };

  function evaluate(q, a) {
    if (q.answerType === 'time') {
      const ok = normaliseTime(a.value) === q.expected;
      return { correct: ok, numericOk: ok, unitOk: true };
    }
    const parsed = parseAnswer(a.value);
    const unitOk = a.unit === q.unit;
    if (!parsed) return { correct: false, numericOk: false, unitOk };
    const v = parsed.value;
    let numericOk = false, moreDp = false, roundingIssue = false, signIssue = false;

    if (typeof q.tolerance === 'number' && q.tolerance > 0) {
      numericOk = Math.abs(v - q.expected) <= q.tolerance;          // legacy option, use sparingly
    } else if (q.dp != null) {
      const target = roundTo(q.expected, q.dp);
      if (same(v, target)) numericOk = true;
      else if (!q.strictRounding && parsed.decimals > q.dp && same(v, roundTo(q.expected, parsed.decimals))) { numericOk = true; moreDp = true; }
      else if (Math.abs(v - q.expected) < 2 * Math.pow(10, -q.dp)) roundingIssue = true;
      if (!numericOk && same(-v, target)) signIssue = true;
    } else {
      numericOk = same(v, q.expected);
      if (!numericOk && same(-v, q.expected)) signIssue = true;
    }
    return { correct: numericOk && unitOk, numericOk, unitOk, moreDp, roundingIssue, signIssue };
  }

  NUMERACY.engine = { roundTo, same, parseAnswer, formatNumber, withUnit, formatAnswer, normaliseTime, evaluate };
})();

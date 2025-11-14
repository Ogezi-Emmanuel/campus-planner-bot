// Utility for currency conversion and formatting to West African CFA franc (XOF)
// Fetches USD→XOF rate and caches it in localStorage for 12 hours.

export async function getUsdToXofRate() {
  const cacheKey = 'fx:USD_XOF';
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (
        cached && typeof cached.rate === 'number' && typeof cached.timestamp === 'number' &&
        Date.now() - cached.timestamp < 12 * 60 * 60 * 1000 // 12 hours
      ) {
        return cached.rate;
      }
    }
  } catch (_) {}

  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=XOF');
    if (!res.ok) throw new Error('Failed to fetch rate');
    const json = await res.json();
    const rate = json && json.rates && json.rates.XOF ? Number(json.rates.XOF) : null;
    if (!rate || Number.isNaN(rate)) throw new Error('Invalid rate');
    localStorage.setItem(cacheKey, JSON.stringify({ rate, timestamp: Date.now() }));
    return rate;
  } catch (err) {
    // Fallback approximate rate if API fails; keeps UI functional.
    // Consider prompting user or logging telemetry if precision is critical.
    const fallback = 600; // XOF per USD (approx.)
    return fallback;
  }
}

export function toCFA(amountUSD, rate) {
  const num = Number(amountUSD);
  if (Number.isNaN(num)) return 'CFA 0.00';
  const converted = Math.round(num * Number(rate) * 100) / 100;
  return `CFA ${converted.toFixed(2)}`;
}
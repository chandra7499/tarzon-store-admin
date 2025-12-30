export function dateOut(promo) {
  if (!promo) return "";

  // Case 1: Firestore Timestamp {_seconds, _nanoseconds}
  if (typeof promo === "object" && "_seconds" in promo) {
    const ms =
      promo._seconds * 1000 + Math.floor(promo._nanoseconds / 1_000_000);
    return new Date(ms).toISOString().slice(0, 10);
  }

  // Case 2: Already a string (YYYY-MM-DD)
  if (typeof promo === "string" && promo.length <= 10) {
    return promo;
  }

  // Case 3: JS Date object
  if (promo instanceof Date) {
    return promo.toISOString().slice(0, 10);
  }

  // Case 4: Timestamp in ms
  if (typeof promo === "number") {
    return new Date(promo).toISOString().slice(0, 10);
  }

  return "";
}

// safeJson: safely stringify objects that contain BigInt values
// - JSON.stringify throws on BigInt, which Prisma often returns (e.g., IDs, elo)
// - This recursively converts all BigInt values to strings
// - Use this before returning JSON responses from API routes
//
// Example:
//   return new Response(safeJson({ data }), { status: 200 });
export function safeJson(data) {
  const convertBigIntsAndDates = (obj) => {
    if (Array.isArray(obj)) return obj.map(convertBigIntsAndDates);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          typeof v === "bigint"
            ? v.toString() // Convert BigInt to string
            : v instanceof Date
            ? v.toISOString() // Convert Date to ISO string
            : convertBigIntsAndDates(v), // Recursively process nested objects
        ])
      );
    }
    return obj;
  };

  return JSON.stringify(convertBigIntsAndDates(data));
}

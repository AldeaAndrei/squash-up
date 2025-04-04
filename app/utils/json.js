// safeJson: safely stringify objects that contain BigInt values
// - JSON.stringify throws on BigInt, which Prisma often returns (e.g., IDs, elo)
// - This recursively converts all BigInt values to strings
// - Use this before returning JSON responses from API routes
//
// Example:
//   return new Response(safeJson({ data }), { status: 200 });
export function safeJson(data) {
  const convertBigInts = (obj) => {
    if (Array.isArray(obj)) return obj.map(convertBigInts);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          typeof v === "bigint" ? v.toString() : convertBigInts(v),
        ])
      );
    }
    return obj;
  };

  return JSON.stringify(convertBigInts(data));
}

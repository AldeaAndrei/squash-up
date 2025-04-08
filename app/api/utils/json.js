// safeJson: safely stringify objects that contain BigInt values
// - JSON.stringify throws on BigInt, which Prisma often returns (e.g., IDs, elo)
// - This recursively converts all BigInt values to strings
// - Use this before returning JSON responses from API routes
//
// Example:
//   return new Response(safeJson({ data }), { status: 200 });
export function safeJson(data) {
  const convertBigIntsAndDates = (value) => {
    if (typeof value === "bigint") {
      return value.toString(); // Convert BigInt to string
    }

    if (value instanceof Date) {
      return value.toISOString(); // Convert Date to ISO string
    }

    // If it's an object, recursively process all properties
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map(convertBigIntsAndDates); // Recursively process array
      }

      const newObj = {};
      for (const [key, val] of Object.entries(value)) {
        newObj[key] = convertBigIntsAndDates(val); // Recursively process object properties
      }
      return newObj;
    }

    return value; // Return primitive values as is
  };

  return JSON.stringify(convertBigIntsAndDates(data));
}

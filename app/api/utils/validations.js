export function validateId(id) {
  if (id === undefined || id === null || id === "") {
    return { success: false, error: "ID is required and cannot be empty." };
  }

  const num = Number(id);

  if (!Number.isInteger(num) || num <= 0) {
    return { success: false, error: "ID must be a positive integer." };
  }

  return { success: true, error: "" };
}

export function sanitizeInput(input: string) {
  return input.replace(/[^a-zA-Z0-9 ]/g, "");
}

export function invalidInput(input: string) {
  const regex = /^[a-zA-Z0-9 ]*$/;
  return !regex.test(input);
}

export function invalidDisplayName(input: string) {
  const regex = /^[a-zA-Z0-9_ ]*$/;
  return !regex.test(input);
}

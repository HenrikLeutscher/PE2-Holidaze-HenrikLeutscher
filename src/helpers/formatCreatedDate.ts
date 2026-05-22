export function formatCreatedDate(createdDate: string): string {
  const date = new Date(createdDate);
  return date.toLocaleDateString();
}

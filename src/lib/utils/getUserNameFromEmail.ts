export function getUserNameFromEmail(email: string): string {
  const parts = email.split("@");

  if (parts.length > 0) {
    return parts[0];
  }

  return "";
}

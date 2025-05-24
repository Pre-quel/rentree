export function generatePasteId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function isValidPasteId(id: string): boolean {
  return /^[a-z0-9]{1,20}$/.test(id);
}
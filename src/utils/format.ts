/** Returns up to 2 uppercase initials from a full name. */
export const getInitials = (name: string, length = 2): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, length);

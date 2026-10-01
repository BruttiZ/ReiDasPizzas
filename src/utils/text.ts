export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const slug = (name: string) => normalize(name).replace(/[^a-z0-9]+/g, '-');

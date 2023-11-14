export const isEmptyObject = (obj: object): boolean => {
  if (!obj) return true;
  return obj && Object.keys(obj).length === 0;
};

export function convertTime(timestamp: number | undefined): string {
  if (timestamp == undefined) return '';
  let date = new Date(timestamp * 1000).toLocaleString();
  return date;
}

export function formatTime(s: number | undefined): string {
  if (s == undefined) return '';
  return new Date(s * 1e3).toISOString().slice(-13, -5);
}

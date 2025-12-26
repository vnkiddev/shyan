
export const padPageNumber = (page: number, padding: number): string => {
  return page.toString().padStart(padding, '0');
};

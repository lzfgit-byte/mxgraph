export const graphEmitsArr = [
  'loaded',
  'sidebarLoaded',
  'cellClicked',
  'cellBlur',
  'graphChanged',
  'graphClick',
] as const;

export type GraphEmitsType = (emit: (typeof graphEmitsArr)[number], ...args: any[]) => void;

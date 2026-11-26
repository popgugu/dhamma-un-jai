export const SHEET_BASE = '';

export const GIDS = {
  categories: '1431877312',
  groups: '1503668028',
  items: '789514967',
  sources: '823718542',
  cardClips: '1584556397',
} as const;

export type SheetTabKey = keyof typeof GIDS;

export function buildSheetCsvUrl(gid: string, base: string = SHEET_BASE): string {
  return `${base}?gid=${gid}&single=true&output=csv`;
}

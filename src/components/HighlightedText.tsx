import { Fragment } from 'react';
import { findMatchRanges } from '../utils/search';

interface HighlightedTextProps {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const ranges = findMatchRanges(text, query);
  if (ranges.length === 0) {
    return <>{text}</>;
  }

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.start > cursor) {
      parts.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    parts.push({
      text: text.slice(range.start, range.end),
      highlighted: true,
    });
    cursor = range.end;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlighted: false });
  }

  return (
    <>
      {parts.map((part, idx) =>
        part.highlighted ? (
          <mark
            key={idx}
            className="bg-[#C8963E]/22 dark:bg-[#DFB15E]/28 text-inherit rounded-sm px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <Fragment key={idx}>{part.text}</Fragment>
        )
      )}
    </>
  );
}

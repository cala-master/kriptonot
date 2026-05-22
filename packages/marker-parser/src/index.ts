export const MASKED_MARKER_PATTERN = /\[\[masked:([a-z0-9-]+)\]\]/g;

export interface MaskedMarkerReference {
  fragmentId: string;
  rawMarker: string;
  start: number;
  end: number;
}

export interface MarkerParseError {
  reason: "malformed-marker";
  rawText: string;
}

export interface MarkerParseResult {
  plainText: string;
  references: MaskedMarkerReference[];
  errors: MarkerParseError[];
}

export function formatMaskedMarker(fragmentId: string): string {
  return `[[masked:${fragmentId}]]`;
}

export function parseMaskedMarkers(body: string): MarkerParseResult {
  const references: MaskedMarkerReference[] = [];

  for (const match of body.matchAll(MASKED_MARKER_PATTERN)) {
    const rawMarker = match[0];
    const fragmentId = match[1];
    const start = match.index ?? 0;

    references.push({
      fragmentId,
      rawMarker,
      start,
      end: start + rawMarker.length
    });
  }

  const malformedMarkerStart = "[[masked";
  let malformedLikeMarker = false;
  let searchIndex = body.indexOf(malformedMarkerStart);

  while (searchIndex !== -1) {
    const markerEnd = body.indexOf("]]", searchIndex);
    const candidate = markerEnd === -1
      ? body.slice(searchIndex)
      : body.slice(searchIndex, markerEnd + 2);

    if (!MASKED_MARKER_PATTERN.test(candidate)) {
      malformedLikeMarker = true;
      break;
    }

    MASKED_MARKER_PATTERN.lastIndex = 0;
    searchIndex = body.indexOf(malformedMarkerStart, searchIndex + malformedMarkerStart.length);
  }

  MASKED_MARKER_PATTERN.lastIndex = 0;

  return {
    plainText: body,
    references,
    errors: malformedLikeMarker
      ? [{ reason: "malformed-marker", rawText: body }]
      : []
  };
}

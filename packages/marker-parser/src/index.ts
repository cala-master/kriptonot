export const MASKED_MARKER_PATTERN = /\[\[masked:([a-z0-9-]+)\]\]/g;

export interface MaskedMarkerReference {
  fragmentId: string;
  rawMarker: string;
}

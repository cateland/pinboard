import * as eq from "fp-ts/lib/Eq";
import * as ord from "fp-ts/lib/Ord";
import * as option from "fp-ts/lib/Option";
import * as array from "fp-ts/lib/Array";

import { v4 as uuidv4 } from "uuid";
import { HighlightArea } from "@react-pdf-viewer/highlight";

export const ANNOTATION = "ANNOTATION";

export interface Annotation {
  _tag: typeof ANNOTATION;
  id: string;
  // The note content
  content: option.Option<string>;
  // The list of highlight areas
  highlightAreas: HighlightArea[];
  // The selected text
  quote: string;
}

export function create(
  highlightAreas: HighlightArea[],
  quote: string,
  content?: string
): Annotation {
  return {
    _tag: ANNOTATION,
    id: uuidv4(),
    content: option.fromNullable(content),
    highlightAreas,
    quote,
  };
}

export const eqAnnotation = eq.getStructEq<Annotation>({
  _tag: eq.eqString,
  id: eq.eqString,
  content: option.getEq(eq.eqString),
  highlightAreas: array.getEq(
    eq.getStructEq<HighlightArea>({
      height: eq.eqNumber,
      left: eq.eqNumber,
      pageIndex: eq.eqNumber,
      top: eq.eqNumber,
      width: eq.eqNumber,
    })
  ),
  quote: eq.eqString,
});

export const byQuote: ord.Ord<Annotation> = ord.contramap(
  (annotation: Annotation) => annotation.quote
)(ord.ordString);

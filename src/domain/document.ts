import * as eq from "fp-ts/lib/Eq";
import * as ord from "fp-ts/lib/Ord";

import { v4 as uuidv4 } from "uuid";

export const PDF = "PDF";

export interface Pdf {
  _tag: typeof PDF;
  id: string;
  name: string;
  url: string;
}

export function createPdf(name: string, url: string): Pdf {
  return { _tag: PDF, id: uuidv4(), name, url };
}

export const eqPdf = eq.getStructEq<Pdf>({
  _tag: eq.eqString,
  id: eq.eqString,
  name: eq.eqString,
  url: eq.eqString,
});

export const byName: ord.Ord<Pdf> = ord.contramap((pdf: Pdf) => pdf.name)(
  ord.ordString
);

export type Document = Pdf;

export type ArrayOfDocument = Array<Document>;

import * as eq from "fp-ts/lib/Eq";
import * as ord from "fp-ts/lib/Ord";
import * as option from "fp-ts/lib/Option";

import { v4 as uuidv4 } from "uuid";
export const ENTITY = "ENTITY";

export interface Entity {
  _tag: typeof ENTITY;
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: option.Option<string>;
}

export function create(
  firstName: string,
  lastName: string,
  pictureUrl?: string
): Entity {
  return {
    _tag: ENTITY,
    id: uuidv4(),
    firstName,
    lastName,
    pictureUrl: option.fromNullable(pictureUrl),
  };
}

export const eqEntity = eq.getStructEq<Entity>({
  _tag: eq.eqString,
  id: eq.eqString,
  firstName: eq.eqString,
  lastName: eq.eqString,
  pictureUrl: option.getEq(eq.eqString),
});

export const byFirstName: ord.Ord<Entity> = ord.contramap(
  (entity: Entity) => entity.firstName
)(ord.ordString);

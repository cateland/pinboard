/**
 * Some rules of the graph could not be enforced with solely with types so this
 * modules should only expose that satisfy this graph rules
 * - An Entity could only be attached to an Annotation
 * - An Annotation could only be attached to a Document
 * - An Annotation should only exist if attached to a Document
 */
import * as eq from "fp-ts/lib/Eq";
import * as ord from "fp-ts/lib/Ord";
import * as set from "fp-ts/lib/Set";
import * as array from "fp-ts/lib/Array";
import * as graph from "alga-ts";
import * as entity from "../entity";
import * as document from "../document";
import { pipe } from "fp-ts/lib/pipeable";
import * as annotation from "../annotation";

export type MyVertex = entity.Entity | document.Pdf | annotation.Annotation;

export type DAEGraph = graph.Graph<MyVertex>;

export function isPdf(data: MyVertex): data is document.Pdf {
  return data._tag === document.PDF;
}
export function isEntity(data: MyVertex): data is entity.Entity {
  return data._tag === entity.ENTITY;
}

export function isAnnotation(data: MyVertex): data is annotation.Annotation {
  return data._tag === annotation.ANNOTATION;
}

/** Used by graph to know if a vertex already exist */
const eqVertex: eq.Eq<MyVertex> = {
  equals: (x, y) => {
    if (isPdf(x) && isPdf(y)) {
      document.eqPdf.equals(x, y);
    } else if (isEntity(x) && isEntity(y)) {
      entity.eqEntity.equals(x, y);
    } else if (isAnnotation(x) && isAnnotation(y)) {
      annotation.eqAnnotation.equals(x, y);
    }
    return false;
  },
};

const G = graph.getInstanceFor(eqVertex);

export const vertexSet = G.vertexSet;

export const edgeSet = G.edgeSet;

/** Add an isolated document's vertex */
export function addDocument(doc: document.Pdf) {
  return (daeGraph: DAEGraph) => {
    return G.connect<MyVertex>(daeGraph, G.vertex(doc));
  };
}

/** Add an isolated entity's vertex */
export function addEntity(entity: entity.Entity) {
  return (daeGraph: DAEGraph) => {
    return G.connect<MyVertex>(daeGraph, G.vertex(entity));
  };
}

/** Attach an annotation to a document */
export function attachAnnotation(annotation: annotation.Annotation) {
  return (doc: document.Pdf) => {
    return (daeGraph: DAEGraph) => {
      return G.overlay(G.edge<MyVertex>(annotation, doc), daeGraph);
    };
  };
}

/** Attach an entity to an annotation */
export function attachEntity(entity: entity.Entity) {
  return (annotation: annotation.Annotation) => {
    return (daeGraph: DAEGraph) => {
      return G.overlay(G.edge<MyVertex>(entity, annotation), daeGraph);
    };
  };
}

/** Filter graph for documents */
export function getDocumentNodes(daeGraph: DAEGraph): Array<document.Pdf> {
  const documentSet = pipe(
    daeGraph,
    G.vertexSet,
    set.filter((x) => x._tag === document.PDF)
  ) as Set<document.Pdf>;
  return set.toArray(document.byName)(documentSet);
}

/** Filter graph for annotations */
export function getAnnotationNodes(
  daeGraph: DAEGraph
): Array<annotation.Annotation> {
  const documentSet = pipe(
    daeGraph,
    G.vertexSet,
    set.filter((x) => x._tag === annotation.ANNOTATION)
  ) as Set<annotation.Annotation>;
  return pipe(documentSet, set.toArray(annotation.byQuote));
}

/** Filter graph for entities */
export function getEntityNodes(daeGraph: DAEGraph) {
  const entitySet = pipe(
    daeGraph,
    G.vertexSet,
    set.filter((x) => x._tag === entity.ENTITY)
  ) as Set<entity.Entity>;
  return pipe(entitySet, set.toArray(entity.byFirstName));
}

/** Return an array of annotation attached toa document */
export function getDocumentAnnotations(document: document.Pdf) {
  return (daeGraph: DAEGraph) => {
    return pipe(
      daeGraph,
      G.edgeSet,
      set.filter((edge) => edge[1] === document),
      set.map(annotation.eqAnnotation)(
        (edge) => edge[0] as annotation.Annotation
      ),
      set.toArray(annotation.byQuote)
    );
  };
}

/** Return an array of entity attached to an annotation */
export function getAnnotationEntities(annotation: annotation.Annotation) {
  return (daeGraph: DAEGraph) => {
    return pipe(
      daeGraph,
      G.edgeSet,
      set.filter((edge) => edge[1] === annotation),
      set.map(entity.eqEntity)((edge) => edge[0] as entity.Entity),
      set.toArray(entity.byFirstName)
    );
  };
}

export function findDocById(id: string) {
  return function (daeGraph: DAEGraph) {
    return pipe(
      daeGraph,
      getDocumentNodes,
      array.findFirst((doc) => doc.id === id)
    );
  };
}

export function findEntityById(id: string) {
  return function (daeGraph: DAEGraph) {
    return pipe(
      daeGraph,
      getEntityNodes,
      array.findFirst((entity) => entity.id === id)
    );
  };
}

export const vertextById: ord.Ord<MyVertex> = ord.contramap(
  (vertex: MyVertex) => vertex.id
)(ord.ordString);

export const edgeBySourceId: ord.Ord<[MyVertex, MyVertex]> = ord.contramap(
  ([vertex, _]: [MyVertex, MyVertex]) => vertex.id
)(ord.ordString);

/** Default graph for app startup */

const doc1 = document.createPdf(
  "A Conflict-Free Replicated JSON Datatype",
  "https://arxiv.org/pdf/1608.03960.pdf"
);

const doc2 = document.createPdf(
  "Learning to Optimize DAG Scheduling in HeterogeneousEnvironment",
  "https://arxiv.org/pdf/2103.06980.pdf"
);

const doc3 = document.createPdf(
  "Gas Dynamics in the Galaxy: Total Mass Distribution and the Bar Pattern Speed",
  "https://arxiv.org/pdf/2103.10342.pdf"
);

const annotation1 = annotation.create(
  [
    {
      height: 1.5782854230544756,
      left: 32.409603948810144,
      pageIndex: 0,
      top: 11.912766849429927,
      width: 14.592785602587151,
    },
  ],
  "Martin Kleppmann",
  "Paper author"
);

const entity1 = entity.create(
  "Kleppmann",
  "Martin",
  "https://thispersondoesnotexist.com/image"
);

export const initialGraph = G.overlay<MyVertex>(
  G.overlay(G.vertex(doc2), G.vertex(doc3)),
  G.overlay<MyVertex>(
    G.edge(<MyVertex>annotation1, doc1),
    G.edge<MyVertex>(entity1, annotation1)
  )
);

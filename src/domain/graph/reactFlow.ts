/**
 * This module purpose is to handle transformation from daeGraph to something
 * consumable by reactFlow
 */
import dagre from "dagre";
import * as set from "fp-ts/lib/Set";
import * as array from "fp-ts/lib/Array";
import * as eq from "fp-ts/lib/Eq";
import * as ord from "fp-ts/lib/Ord";

import { pipe } from "fp-ts/lib/function";
import { Elements, isNode, Position } from "react-flow-renderer";

import * as daeGraph from "../../domain/graph/daeGraph";

interface Edge {
  id: string;
}

const position = { x: 0, y: 0 };

const eqEdge = eq.contramap<string, Edge>((edge) => edge.id)(eq.eqString);

const ordEdgeById: ord.Ord<Edge> = ord.contramap((edge: Edge) => edge.id)(
  ord.ordString
);

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 250;

export function toReactFlowLayouted(
  graph: daeGraph.DAEGraph,
  direction = "TB"
) {
  const nodes = pipe(
    graph,
    daeGraph.vertexSet,
    set.toArray(daeGraph.vertextById),
    array.map((vertex) => {
      if (daeGraph.isPdf(vertex)) {
        return { id: vertex.id, type: "documentSink", data: vertex, position };
      } else if (daeGraph.isAnnotation(vertex)) {
        return { id: vertex.id, type: "annotation", data: vertex, position };
      }
      return { id: vertex.id, type: "entitySource", data: vertex, position };
    })
  );

  const edges = pipe(
    graph,
    daeGraph.edgeSet,
    set.map(eqEdge)(([vertex1, vertex2]) => ({
      id: `${vertex1.id}-${vertex2.id}`,
      source: vertex1.id,
      target: vertex2.id,
      animated: true,
    })),
    set.toArray(ordEdgeById)
  );

  const elements = [...nodes, ...edges] as Elements<daeGraph.MyVertex>;
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slighltiy different position
      // to notify react flow about the change. More over we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
}

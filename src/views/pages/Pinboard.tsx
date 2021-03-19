import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { Layout } from "antd";

import * as daeGraph from "../../domain/graph/daeGraph";
import { EntitySource } from "../components/graph/EntitySource";
import { Annotation } from "../components/graph/Annotation";
import { DocumentSink } from "../components/graph/DocumentSink";
import { toReactFlowLayouted } from "../../domain/graph/reactFlow";

interface PinboardProps {
  pinboard: daeGraph.DAEGraph;
}

export function Pinboard({ pinboard }: PinboardProps) {
  const layoutedGraph = toReactFlowLayouted(pinboard);

  return (
    <Layout style={{ marginTop: 64, padding: 24 }}>
      <ReactFlow
        nodesConnectable={false}
        nodeTypes={{
          entitySource: EntitySource,
          annotation: Annotation,
          documentSink: DocumentSink,
        }}
        elements={layoutedGraph}
        style={{ height: "100%" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </Layout>
  );
}

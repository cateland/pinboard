import { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { Card } from "antd";

import * as document from "../../../domain/document";

interface EntitySource {
  data: document.Document;
}

export const DocumentSink = memo(({ data }: EntitySource) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Card hoverable style={{ width: 200, height: 200, overflow: "scroll" }}>
        <p>{data.name}</p>
      </Card>
    </>
  );
});

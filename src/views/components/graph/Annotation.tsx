import { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { Card } from "antd";

import * as option from "fp-ts/lib/Option";
import * as annotation from "../../../domain/annotation";
import { pipe } from "fp-ts/lib/function";

interface EntitySource {
  data: annotation.Annotation;
}

export const Annotation = memo(({ data }: EntitySource) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      <Card hoverable style={{ width: 200, height: 200, overflow: "hidden" }}>
        <p>
          <strong>quote : </strong>
          {data.quote}
        </p>
        {pipe(
          data.content,
          option.fold(
            () => null,
            (content) => (
              <p>
                <strong>annotation : </strong>
                {content}
              </p>
            )
          )
        )}
      </Card>
    </>
  );
});

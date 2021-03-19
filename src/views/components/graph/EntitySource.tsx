import { memo } from "react";
import { Handle, Position } from "react-flow-renderer";
import { Card } from "antd";

import * as option from "fp-ts/lib/Option";
import * as entity from "../../../domain/entity";
const { Meta } = Card;

interface EntitySourceProps {
  data: entity.Entity;
}

export const EntitySource = memo(({ data }: EntitySourceProps) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      <Card
        hoverable
        style={{ width: 200, height: 200 }}
        cover={
          <div
            style={{
              height: 100,
              background: option.isSome(data.pictureUrl)
                ? `url(${data.pictureUrl.value})`
                : "url(https://s2.qwant.com/thumbr/0x380/f/9/85e0e606ee8c9899cc496ca30374e1badc54e7994f6082daa9223e412137c3/blank-portrait.png?u=https%3A%2F%2Fgladstoneentertainment.com%2Fwp-content%2Fuploads%2F2018%2F08%2Fblank-portrait.png&q=0&b=1&p=0&a=1)",
              backgroundSize: "cover",
            }}
          />
        }
      >
        <Meta title={data.firstName} description={data.lastName} />
      </Card>
    </>
  );
});

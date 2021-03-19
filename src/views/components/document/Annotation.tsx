import { useState } from "react";
import { Button, Card, Space, Tag, Select, Tooltip } from "antd";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

import * as option from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

import * as annotation from "../../../domain/annotation";
import * as entity from "../../../domain/entity";
import * as daeGraph from "../../../domain/graph/daeGraph";
import { HighlightArea } from "@react-pdf-viewer/highlight";
import { CreateEntity } from "./CreateEntity";

const { Option } = Select;

interface AnnotationProps {
  annotation: annotation.Annotation;
  pinboard: daeGraph.DAEGraph;
  jumpToHighlightArea: (area: HighlightArea) => void;
  updatePinboard: (pinboard: daeGraph.DAEGraph) => void;
}

export function Annotation({
  annotation,
  pinboard,
  jumpToHighlightArea,
  updatePinboard,
}: AnnotationProps) {
  const attachedEntities = daeGraph.getAnnotationEntities(annotation)(pinboard);
  const allEntities = daeGraph.getEntityNodes(pinboard);
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>(
    allEntities[0]?.id
  );
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const onCreate = (entity: entity.Entity) => {
    updatePinboard(daeGraph.attachEntity(entity)(annotation)(pinboard));
    setVisible(false);
  };

  function handleEntityAttachment() {
    if (selectedEntity) {
      const entity = daeGraph.findEntityById(selectedEntity)(pinboard);
      if (option.isSome(entity)) {
        updatePinboard(
          daeGraph.attachEntity(entity.value)(annotation)(pinboard)
        );
      }
    }
  }
  return (
    <Card
      title={annotation.quote}
      extra={
        <Space direction="horizontal">
          <Tooltip title="edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => alert("not implemented")}
            />
          </Tooltip>
          <Tooltip title="delete">
            <Button
              shape="circle"
              icon={<CloseCircleOutlined />}
              onClick={() => alert("not implemented")}
            />
          </Tooltip>
          <Tooltip title="jump to">
            <Button
              shape="circle"
              icon={<ArrowRightOutlined />}
              onClick={() => jumpToHighlightArea(annotation.highlightAreas[0])}
            />
          </Tooltip>
        </Space>
      }
      key={annotation.id}
    >
      <p>
        <strong>quote : </strong>
        {annotation.quote}
      </p>
      {pipe(
        annotation.content,
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
      <Space direction="vertical">
        <strong>attached entities : </strong>
        <div>
          {attachedEntities.map((entity) => (
            <Tag
              key={entity.id}
              closable
              onClose={() => alert("not implemented")}
            >{`${entity.firstName} ${entity.lastName}`}</Tag>
          ))}
        </div>
        <Space direction="horizontal">
          <Select
            defaultValue={selectedEntity}
            style={{ width: 120 }}
            onChange={setSelectedEntity}
          >
            {allEntities.map((entity) => (
              <Option
                key={entity.id}
                value={entity.id}
              >{`${entity.firstName} ${entity.lastName}`}</Option>
            ))}
          </Select>
          <Button onClick={handleEntityAttachment} type="primary">
            Attach entity
          </Button>
        </Space>
        <Button type="primary" onClick={showModal}>
          create entity
        </Button>
        <CreateEntity
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          onCreate={onCreate}
        />
      </Space>
    </Card>
  );
}

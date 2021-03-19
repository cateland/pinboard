import { Fragment, useState } from "react";
import { Worker, Viewer, Position, Tooltip } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";
import {
  highlightPlugin,
  RenderHighlightTargetProps,
  RenderHighlightContentProps,
  RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import { Layout, Button, Space } from "antd";
import { ProfileOutlined } from "@ant-design/icons";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { CreateAnnotation } from "./CreateAnnotation";
import { Annotation } from "./Annotation";
import * as document from "../../../domain/document";
import * as annotation from "../../../domain/annotation";
import * as daeGraph from "../../../domain/graph/daeGraph";

const { Sider } = Layout;

interface FileSubMenuProps {
  pinboard: daeGraph.DAEGraph;
  doc: document.Pdf;
  updatePinboard: (pinboard: daeGraph.DAEGraph) => void;
}

export function DocumentDisplay({
  pinboard,
  updatePinboard,
  doc,
}: FileSubMenuProps) {
  const annotations = daeGraph.getDocumentAnnotations(doc)(pinboard);

  const [message, setMessage] = useState<string | undefined>(undefined);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[1], // Thumbnails tab
    ],
  });
  const searchPluginInstance = searchPlugin({});

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button
            onClick={props.toggle}
            type="primary"
            shape="circle"
            icon={<ProfileOutlined />}
            size="large"
          />
        }
        content={() => <div style={{ width: "100px" }}>Add annotation</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    const createNote = () => {
      const note = annotation.create(
        props.highlightAreas,
        props.selectedText,
        message
      );

      updatePinboard(daeGraph.attachAnnotation(note)(doc)(pinboard));
      // reset message and close the form
      setMessage(undefined);
      props.cancel();
    };

    return (
      <CreateAnnotation
        setMessage={setMessage}
        cancel={props.cancel}
        createNote={createNote}
        selectionRegion={props.selectionRegion}
      />
    );
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {annotations.map((note) => (
        <Fragment key={note.quote}>
          {note.highlightAreas
            // Filter all highlights on the current page
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
              />
            ))}
        </Fragment>
      ))}
    </div>
  );
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });
  const { jumpToHighlightArea } = highlightPluginInstance;
  return (
    <Layout
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
      }}
    >
        <Sider
          width="400"
          style={{ height: "100%" }}
          theme="light"
          className="site-layout-background"
        >
          <Space
            direction="vertical"
            style={{ width: "100%", padding: "0 4px" }}
          >
            {annotations.map((annotation) => (
              <Annotation
                key={annotation.id}
                annotation={annotation}
                jumpToHighlightArea={jumpToHighlightArea}
                pinboard={pinboard}
                updatePinboard={updatePinboard}
              />
            ))}
          </Space>
        </Sider>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
          <Viewer
            fileUrl={doc.url}
            plugins={[
              defaultLayoutPluginInstance,
              searchPluginInstance,
              highlightPluginInstance,
            ]}
          />
        </Worker>
    </Layout>
  );
}

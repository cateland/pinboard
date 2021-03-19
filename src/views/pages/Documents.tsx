import { useState } from "react";
import { pipe } from "fp-ts/lib/function";
import * as option from "fp-ts/lib/Option";
import { Layout, Input, Space, Button } from "antd";
import { DocumentList } from "../components/document/DocumentList";
import { DocumentDisplay } from "../components/document/DocumentDisplay";
import * as daeGraph from "../../domain/graph/daeGraph";

const { Content, Sider } = Layout;
const { Search } = Input;

interface DocumentsProps {
  pinboard: daeGraph.DAEGraph;
  updatePinboard: (pinboard: daeGraph.DAEGraph) => void;
}

export function Documents({ pinboard, updatePinboard }: DocumentsProps) {
  const docs = daeGraph.getDocumentNodes(pinboard);
  const [activeFile, setActiveFile] = useState<string>(docs[0].id);
  const [_, setSearchKeyword] = useState("");
  const foundDocument = daeGraph.findDocById(activeFile)(pinboard);

  return (
    <Layout style={{ marginTop: 64 }}>
      <Sider width={200} theme="light">
        <Space style={{ width: "100%", padding: "0 4px" }} direction="vertical">
          <Search
            style={{ marginTop: "8px" }}
            placeholder="not implemented"
            onSearch={setSearchKeyword}
            enterButton
          />
          <DocumentList
            docs={docs}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />
          <Button type="primary" onClick={() => {alert('not implemented')}} style={{width: '100%'}}>Add new document</Button>
        </Space>
      </Sider>
      <Content className="site-layout-background">
        {pipe(
          foundDocument,
          option.fold(
            () => null,
            (doc) => (
              <DocumentDisplay
                doc={doc}
                pinboard={pinboard}
                updatePinboard={updatePinboard}
              />
            )
          )
        )}
      </Content>
    </Layout>
  );
}

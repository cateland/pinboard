import { Menu } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

import * as document from "../../../domain/document";

interface DocumentListProps {
  docs: document.ArrayOfDocument;
  setActiveFile: (activeFile: string) => void;
  activeFile: null | string;
}

export function DocumentList({
  docs,
  activeFile,
  setActiveFile,
}: DocumentListProps) {
  function handleClick(id: string) {
    return () => {
      setActiveFile(id);
    };
  }
  const selectedKeys = activeFile ? [activeFile] : [];
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={selectedKeys}
      style={{ height: "100%", borderRight: 0 }}
    >
      {docs.map((doc) => {
        return (
          <Menu.Item
            key={doc.id}
            icon={<FilePdfOutlined />}
            onClick={handleClick(doc.id)}
          >
            {doc.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

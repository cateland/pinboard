import { HighlightArea } from "@react-pdf-viewer/highlight";
import { Button } from "antd";

interface CreateAnnotationProps {
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  cancel: () => void;
  createNote: () => void;
  selectionRegion: HighlightArea;
}

export function CreateAnnotation({
  setMessage,
  cancel,
  createNote,
  selectionRegion,
}: CreateAnnotationProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0, 0, 0, .3)",
        borderRadius: "2px",
        padding: "8px",
        position: "absolute",
        left: `${selectionRegion.left}%`,
        top: `${selectionRegion.top + selectionRegion.height}%`,
        zIndex: 1,
      }}
    >
      <div>
        <textarea
          rows={3}
          style={{
            border: "1px solid rgba(0, 0, 0, .3)",
          }}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "8px",
        }}
      >
        <div style={{ marginRight: "8px" }}>
          <Button onClick={createNote} type="primary">
            Create
          </Button>
        </div>
        <Button onClick={cancel}>Cancel</Button>
      </div>
    </div>
  );
}

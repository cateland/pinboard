import { Modal, Form, Input } from "antd";
import * as entity from "../../../domain/entity";

interface CreateEntityProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (entity: entity.Entity) => void;
}

export function CreateEntity({
  visible,
  onCreate,
  onCancel,
}: CreateEntityProps) {
  const [form] = Form.useForm<{
    firstName: string;
    lastName: string;
    pictureUrl: string;
  }>();
  return (
    <Modal
      visible={visible}
      title="Create a new Entity"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(
              entity.create(
                values.firstName,
                values.lastName,
                values.pictureUrl === "" ? undefined : values.pictureUrl
              )
            );
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
      >
        <Form.Item
          label="firstName"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="lastName"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="pictureUrl" name="pictureUrl">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

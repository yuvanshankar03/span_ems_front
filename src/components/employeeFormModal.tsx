import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import type { Employee } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Employee) => Promise<void>;
  initialValues?: Employee;
}

export default function EmployeeFormModal({ open, onClose, onSubmit, initialValues }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values as Employee);
      form.resetFields();
      onClose();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      open={open}
      title={initialValues ? "Edit Employee" : "Add Employee"}
      okText={initialValues ? "Update" : "Create"}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Enter employee name" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ssn" label="SSN" rules={[{ required: true, message: "Enter SSN" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address1" label="Address Line 1" rules={[{ required: true, message: "Enter address" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address2" label="Address Line 2">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true, message: "Enter city" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true, message: "Enter state" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="zip" label="Zip Code" rules={[{ required: true, message: "Enter zip code" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true, message: "Enter country" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

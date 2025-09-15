import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { Employee } from "../types";
import utils from "../hooks/util";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Employee) => Promise<void>;
  initialValues?: Employee;
}

function EmployeeFormModal({ open, onClose, onSubmit, initialValues }: Props) {
  const [form] = Form.useForm();
  const {COUNTRIES, US_STATES} = utils

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || { country: "USA" });
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
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter employee name" },
            { min: 3, message: "Name must be at least 3 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="ssn"
          label="SSN"
          rules={[
            { required: true, message: "Please enter SSN" },
            {
              pattern: /^\d{3}-\d{2}-\d{4}$/,
              message: "SSN must be in format XXX-XX-XXXX",
            },
          ]}
        >
          <Input placeholder="123-45-6789" />
        </Form.Item>

        <Form.Item
          name="address1"
          label="Address Line 1"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="address2" label="Address Line 2">
          <Input />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "Please enter city" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          rules={[{ required: true, message: "Please select state" }]}
        >
          <Select placeholder="Select state">
            {US_STATES.map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="zip"
          label="Zip Code"
          rules={[
            { required: true, message: "Please enter zip code" },
            {
              pattern: /^\d{5,6}$/,
              message: "Zip code must be 5 or 6 digits",
            },
          ]}
        >
          <Input placeholder="12345 or 641605" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: "Please select country" }]}
        >
          <Select placeholder="Select country" defaultValue="USA">
            {COUNTRIES.map((country) => (
              <Option key={country} value={country}>
                {country}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EmployeeFormModal;

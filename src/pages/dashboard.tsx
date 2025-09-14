import { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm, Input } from "antd";
import { SearchOutlined, LogoutOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { employeeService } from "../services/employeeService";
import { useAuth } from "../contexts/AuthContext";
import type { Employee } from "../types";
import EmployeeFormModal from "../components/employeeFormModal";
import { useNavigate } from "react-router-dom";
import utils from "../hooks/util";

const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = utils.useDebounce(searchText, 500);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees(debouncedSearch);
  }, [debouncedSearch]);

  const loadEmployees = async (name?: string) => {
    setLoading(true);
    try {
      const data = await employeeService.getAll({ name });
      setEmployees(data);
    } catch {
      message.error("Error loading employees");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (employee: Employee) => {
    try {
      await employeeService.create(employee);
      message.success("Employee created successfully");
      setModalOpen(false);
      loadEmployees(debouncedSearch);
    } catch {
      message.error("Failed to create employee");
    }
  };

  const handleUpdate = async (employee: Employee) => {
    if (!editingEmployee) return;
    try {
      await employeeService.update(editingEmployee.id!, employee);
      message.success("Employee updated successfully");
      setModalOpen(false);
      setEditingEmployee(null);
      loadEmployees(debouncedSearch);
    } catch {
      message.error("Failed to update employee");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await employeeService.delete(id);
      message.success("Employee deleted");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch {
      message.error("Failed to delete employee");
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
    message.success("Signed out successfully");
  };

  // Ant Design Table search configuration
  const getColumnSearchProps = (dataIndex: keyof Employee) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: () => (
      <SearchOutlined style={{ color: searchText ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: Employee) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) || false,
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", ...getColumnSearchProps("name") },
    { title: "SSN", dataIndex: "ssn", key: "ssn"},
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingEmployee(record);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this employee?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id!)}
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingEmployee(null);
              setModalOpen(true);
            }}
          >
            Add Employee
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleSignOut}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Sign Out
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
        }}
        scroll={{ x: 800 }}
      />

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleUpdate : handleCreate}
        initialValues={editingEmployee || undefined}
      />
    </div>
  );
};

export default Dashboard;

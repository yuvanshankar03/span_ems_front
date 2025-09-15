import { useEffect, useState } from "react";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined, LogoutOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { employeeService } from "../services/employeeService";
import { useAuth } from "../contexts/AuthContext";
import type { Employee } from "../types";
import EmployeeFormModal from "../components/employeeFormModal";
import { useNavigate } from "react-router-dom";
import utils from "../hooks/util";
import { useToast } from "../contexts/toastContext";

const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchText, setSearchText] = useState("");

  const debouncedSearch = utils.useDebounce(searchText, 500);

  const { logout } = useAuth();
  const { showToast } = useToast();
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
      showToast("Error loading employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (employee: Employee) => {
    try {
      await employeeService.create(employee);
      showToast("Employee created successfully", "success");
      setModalOpen(false);
      loadEmployees(debouncedSearch);
    } catch {
      showToast("Failed to create employee", "error");
    }
  };

  const handleUpdate = async (employee: Employee) => {
    if (!editingEmployee) return;
    try {
      await employeeService.update(editingEmployee.id!, employee);
      showToast("Employee updated successfully", "success");
      setModalOpen(false);
      setEditingEmployee(null);
      loadEmployees(debouncedSearch);
    } catch {
      showToast("Failed to update employee", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await employeeService.delete(id);
      showToast("Employee deleted", "success");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch {
      showToast("Failed to delete employee", "error");
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
    showToast("Signed out successfully", "info");
  };

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
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingEmployee(record); setModalOpen(true); }}>
            Edit
          </Button>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id!)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingEmployee(null); setModalOpen(true); }}>
            Add Employee
          </Button>
          <Button icon={<LogoutOutlined />} onClick={handleSignOut} className="bg-red-500 text-white hover:bg-red-600">
            Sign Out
          </Button>
        </Space>
      </div>

      <Table rowKey="id" columns={columns} dataSource={employees} loading={loading} pagination={{ pageSize: 5 }} />

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
        onSubmit={editingEmployee ? handleUpdate : handleCreate}
        initialValues={editingEmployee || undefined}
      />
    </div>
  );
};

export default Dashboard;

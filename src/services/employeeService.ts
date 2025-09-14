import { api } from "./api";
import type { Employee } from "../types";

export const employeeService = {
 getAll: async (filter?: { name?: string }) => {
    const params: any = {};
    if (filter?.name) params.name = filter.name;
    const res = await api.get<Employee[]>("/api/v1/employees", { params });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get<Employee>(`/api/v1/employee/${id}`);
    return res.data;
  },

  create: async (employee: Omit<Employee, "id">) => {
    const res = await api.post<Employee>("/api/v1/employee", employee);
    return res.data;
  },

  update: async (id: number, employee: Partial<Employee>) => {
    const res = await api.put<Employee>(`/api/v1/employee/${id}`, employee);
    return res.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/v1/employee/${id}`);
  },
};

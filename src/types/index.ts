export interface Employee {
  id: number;
  name: string;
  ssn: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Employer {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

export interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (employer: Employer) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
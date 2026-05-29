export interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'driver' | 'admin' | 'ceo';
  branchId?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'pending';
  joinDate?: string;
  lastLogin?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  contact: string;
  totalStudents: number;
  totalInstructors: number;
  totalDrivers: number;
  monthlyRevenue: number;
}

export interface AuthContextType {
  user: UserType | null;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  branches: Branch[];
  allUsers: UserType[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface StatsData {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  change?: number;
  trend?: 'up' | 'down';
}

export type Role = 'resident' | 'guest' | 'agent' | 'admin';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  unitNumber?: number;
  employeeId?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  contact?: string;
  active: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  notes?: string;
  quantity: number;
  status: BookingStatus;
  createdAt: string;
  handledBy?: string;
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#F9A825',
  confirmed: '#2E7D32',
  completed: '#1565C0',
  cancelled: '#C62828',
  rejected: '#C62828',
};

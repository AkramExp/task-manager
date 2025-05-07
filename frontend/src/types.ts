export interface NotificationType {
  _id: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority?: string;
  status?: string;
  assignedTo?: { _id: string; name: string; email: string };
  createdBy?: { _id: string; name: string; email: string };
  createdAt?: string;
}

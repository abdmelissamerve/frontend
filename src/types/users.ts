interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  timezone: string;
  registerProvider: string;
}

export type { User };

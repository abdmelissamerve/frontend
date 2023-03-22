export interface User {
  id: string;
  photo_url: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  registered_from: string;
  register_provider: string;
  [key: string]: any;
}

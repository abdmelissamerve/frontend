import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const loginItems = [
  {
    id: 'login',
    label: 'Login',
    path: '/login',
    icon: <LoginIcon />
  },
  {
    id: 'register',
    label: 'Register',
    path: '/register',
    icon: <AppRegistrationIcon />
  }
];

export { loginItems };

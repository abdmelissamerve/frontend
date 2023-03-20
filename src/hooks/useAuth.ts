import { useContext } from 'react';
import { AuthContext } from 'src/contexts/FirebaseAuthContext';

export const useAuth = () => useContext(AuthContext);

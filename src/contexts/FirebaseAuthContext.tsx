import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import firebase from 'src/utils/firebase';
import PropTypes from 'prop-types';
import { apiInstance } from '@/api-config/api';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: any | null;
}

interface AuthContextValue extends AuthState {
  method: 'Firebase';
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthStateChangedAction = {
  type: 'AUTH_STATE_CHANGED';
  payload: {
    isAuthenticated: boolean;
    user: any | null;
  };
};

type Action = AuthStateChangedAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const reducer = (state: AuthState, action: Action): AuthState => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

export const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'Firebase',
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  sendPasswordResetEmail: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        user.getIdToken().then(async (idToken) => {
          let userObj = {
            uid: user.uid,
            email: user.email,
            photo_url: user.photoURL,
            name: user.displayName,
            role: 'user',
            is_active: false,
            id: null
          };
          try {
            const response = await apiInstance.fetchCurrentUser();
            console.log(response);
            userObj = {
              ...userObj,
              id: response.data.user.id,
              photo_url: response.data.user.photo_URL
                ? response.data.user.photo_URL
                : user.photoURL,
              name: response.data.user.firstName + ' ' + response.data.user.lastName,
              role: response.data.user.role,
            };
          } catch (err) {
            console.error(err);
          }

          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: true,
              user: userObj
            }
          });
        });
      } else {
        sessionStorage.removeItem('access_token');
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    });
  }, [dispatch]);

  const signInWithEmailAndPassword = (
    email: string,
    password: string
  ): Promise<any> =>
    firebase.auth().signInWithEmailAndPassword(email, password);

  const signInWithGoogle = (): Promise<any> => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<any> =>
    firebase.auth().createUserWithEmailAndPassword(email, password);

  const logout = async (): Promise<void> => {
    await firebase.auth().signOut();
  };

  const sendPasswordResetEmail = async (email: string): Promise<any> => {
    firebase.auth().sendPasswordResetEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Firebase',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout,
        sendPasswordResetEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
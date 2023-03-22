import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import { User } from 'src/models/user';
import firebase from 'src/utils/firebase';
import PropTypes from 'prop-types';
import { fetchCurrentUser } from 'src/services/users';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
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
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthStateChangedAction = {
  type: 'AUTH_STATE_CHANGED';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
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
  logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    // firebase.auth().onIdTokenChanged((user) => {
    //   if (user) {
    //     user.getIdToken().then(function (idToken) {
    //       sessionStorage.setItem('access_token', idToken);
    //     });
    //     (async () => {
    //       try {
    //         const response = await fetchCurrentUser();
    //         dispatch({
    //           type: 'AUTH_STATE_CHANGED',
    //           payload: {
    //             isAuthenticated: true,
    //             user: {
    //               id: user.uid,
    //               jobtitle: 'Lead Developer',
    //               photo_url: response.data.photo_url,
    //               email: user.email,
    //               first_name: response.data.first_name,
    //               last_name: response.data.last_name,
    //               is_superuser: response.data.is_superuser,
    //               is_active: response.data.is_active,
    //               registered_from: response.data.registered_from,
    //               register_provider: response.data.register_provider
    //             }
    //           }
    //         });
    //       } catch (e) {
    //         console.error(e);
    //       }
    //     })();
    //   } else {
    //     sessionStorage.removeItem('access_token');
    //     dispatch({
    //       type: 'AUTH_STATE_CHANGED',
    //       payload: {
    //         isAuthenticated: false,
    //         user: null
    //       }
    //     });
    //   }
    // });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async (idToken) => {
          const response = await fetchCurrentUser();
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              isAuthenticated: true,
              user: {
                id: response.data.id,
                jobtitle: 'Lead Developer',
                photo_url: response.data.photo_url,
                email: response.data.email,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                is_superuser: response.data.is_superuser,
                role: response.data.role,
                is_active: response.data.is_active,
                registered_from: response.data.registered_from,
                register_provider: response.data.register_provider
              }
            }
          });
        });
      } else {
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Firebase',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout
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

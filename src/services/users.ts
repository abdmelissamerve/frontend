import type { User } from '@/types';
import { apiInstance } from '@/api-config/api';
import firebase from 'src/utils/firebase';

async function addUsers(data: any) {
  const response = await apiInstance.addUsers(data);
  return response;
}

async function getUsers(data: any) {
    const response = await apiInstance.getUsers(data);
    return response;
}

async function updateUser(data: User, id: string) {
  const response = await apiInstance.updateUser(data, id);
  return response;
}

async function updateCurrentUser(data: any) {
  const response = await apiInstance.updateCurrentUser(data);
  return response;
}

async function fetchCurrentUser() {
  const response = await apiInstance.fetchCurrentUser();
  return response;
}

async function deleteUser(id: number) {
  const response = await apiInstance.deleteUser(id);
  return response;
}

async function resetPassword(email: string) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch((err) => {
      const responseError = {
        code: err.code,
        message: err.message
      };
      return responseError;
    });
}

const usersConverter: any = {
  toApi: (user: User) => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      timezone: user.timezone,
      registerProvider: user.registerProvider
    };
  },
  fromApi: (item: any) => {
    return {
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      isActive: item.is_active,
      timezone: item.timezone,
      registerProvider: item.registerProvider
    };
  }
};

export {
  getUsers,
  updateUser,
  addUsers,
  deleteUser,
  resetPassword,
  updateCurrentUser,
  fetchCurrentUser
};

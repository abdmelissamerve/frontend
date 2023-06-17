import { apiInstance } from "@/api-config/api";
import firebase from "src/utils/firebase";

async function getUsers(data: any) {
    const response = await apiInstance.getUsers(data);
    return response;
}

async function resetPassword(email: string) {
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .catch((err) => {
            const responseError = {
                code: err.code,
                message: err.message,
            };
            return responseError;
        });
}

async function fetchCurrentUser() {
    const response = await apiInstance.fetchCurrentUser();
    return response;
}

async function addUser(data: any) {
    const response = await apiInstance.addUser(data);
    return response;
}

async function updateUser(data: any, id: number) {
    const response = await apiInstance.updateUser(data, id);
    return response;
}

async function deleteUser(id: number) {
    const response = await apiInstance.deleteUser(id);
    return response;
}

export { getUsers, resetPassword, fetchCurrentUser, addUser, updateUser, deleteUser };

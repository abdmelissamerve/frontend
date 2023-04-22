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

export { getUsers, resetPassword };

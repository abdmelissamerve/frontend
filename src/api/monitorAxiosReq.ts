import firebase from "src/utils/firebase";

export const requestsCallbackMonitor = (response: any) => {
    if (response.status === 401 && response.config.url !== "/login") {
        return;
    }
};
export const getCurrentUserAuthorization = async (request: any) => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        const token = await currentUser.getIdToken();
        request.headers.Authorization = `Bearer ${token}`;
    }
};

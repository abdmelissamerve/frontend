import { apiInstance } from "@/api-config/api";

async function addTask(data: any) {
    const response = await apiInstance.addUserTask(data);
    return response;
}

async function getTasks(data: any) {
    const response = await apiInstance.getUserTasks(data);
    return response;
}

async function getTaskById(id: number) {
    const response = await apiInstance.getUserTaskById(id);
    return response;
}

async function updateTask(id: number, data: any) {
    const response = await apiInstance.updateUserTask(id, data);
    return response;
}

async function deleteTask(id: number) {
    const response = await apiInstance.deleteUserTask(id);
    return response;
}

export { addTask, getTasks, getTaskById, updateTask, deleteTask };

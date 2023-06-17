import { apiInstance } from "@/api-config/api";

async function addTask(data: any) {
    const response = await apiInstance.addAdminTask(data);
    return response;
}

async function getTasks(data: any) {
    const response = await apiInstance.getAdminTasks(data);
    return response;
}

async function getTaskById(id: number) {
    const response = await apiInstance.getAdminTaskById(id);
    return response;
}

async function updateTask(data: any, id: number) {
    const response = await apiInstance.updateAdminTask(data, id);
    return response;
}

async function deleteTask(id: number) {
    const response = await apiInstance.deleteAdminTask(id);
    return response;
}

export { addTask, getTasks, getTaskById, updateTask, deleteTask };

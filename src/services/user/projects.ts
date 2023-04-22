import { apiInstance } from "@/api-config/api";

async function getProjects(data: any) {
    const response = await apiInstance.getUserProjects(data);
    return response;
}

async function getProjectById(id: number) {
    const response = await apiInstance.getUserProjectById(id);
    return response;
}

async function addProject(data: any) {
    const response = await apiInstance.addUserProject(data);
    return response;
}

async function updateProject(id: number, data: any) {
    const response = await apiInstance.updateUserProject(id, data);
    return response;
}

async function deleteProject(id: number) {
    const response = await apiInstance.deleteUserProject(id);
    return response;
}

export { getProjects, getProjectById, addProject, updateProject, deleteProject };

import { apiInstance } from "@/api-config/api";

async function getProjects(data: any) {
    const response = await apiInstance.getAdminProjects(data);
    return response;
}

async function getProjectById(id: number) {
    const response = await apiInstance.getAdminProjectById(id);
    return response;
}

async function addProject(data: any) {
    const response = await apiInstance.addAdminProject(data);
    return response;
}

async function updateProject(data: any, id: number) {
    const response = await apiInstance.updateAdminProject(data, id);
    return response;
}

async function deleteProject(id: number) {
    const response = await apiInstance.deleteAdminProject(id);
    return response;
}

export { getProjects, getProjectById, addProject, updateProject, deleteProject };

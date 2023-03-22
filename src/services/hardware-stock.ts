import { apiInstance } from '@/api-config/api';

async function getAllHardwareStock(data: any) {
  const response = await apiInstance.getAllHardwareStock(data);
  return response.data;
}

async function getTechnicianHardware(data: any) {
  const response = await apiInstance.getTechnicianHardware(data);
  return response.data;
}

async function getHardware(hardware_id: any) {
  const response = await apiInstance.getHardware(hardware_id);
  return response.data;
}

async function addWorkerHardware(data: number) {
  const response = await apiInstance.addWorkerHardware(data);
  return response;
}

async function assignHardwareToTechnician(data: any) {
  const response = await apiInstance.assignHardwareToTechnician(data);
  return response;
}

async function updateWorkerHardware(id: number, data: any) {
  const response = await apiInstance.updateWorkerHardware(id, data);
  return response;
}

async function getHardwareStatistics() {
  const response = await apiInstance.getHardwareStatistics();
  return response.data;
}

async function getTechnicianHardwareStatistics() {
  const response = await apiInstance.getTechnicianHardwareStatistics();
  return response.data;
}

async function deleteWorkerHardware(id: number) {
  return await apiInstance.deleteWorkerHardware(id);
}

async function finishInstallHardware(hardware_id: number, data: any) {
  const response = await apiInstance.finishInstallHardware(hardware_id, data);
  return response;
}

export {
  getAllHardwareStock,
  getHardware,
  addWorkerHardware,
  assignHardwareToTechnician,
  updateWorkerHardware,
  getHardwareStatistics,
  finishInstallHardware,
  deleteWorkerHardware,
  getTechnicianHardware,
  getTechnicianHardwareStatistics
};

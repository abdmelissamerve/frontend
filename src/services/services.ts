import { apiInstance } from '@/api-config/api';

async function getOrganisationServices(id: any, data: any) {
  const response = await apiInstance.getOrganisationServices(id, data);
  return response;
}

async function addService(id: any, data: any) {
  const response = await apiInstance.addService(id, data);
  return response;
}

async function updateService(data: any, organisation_id: any, service_id: any) {
  const response = await apiInstance.updateService(
    data,
    organisation_id,
    service_id
  );
  return response;
}

async function deleteService(organisation_id: any, service_id: any) {
  const response = await apiInstance.deleteService(organisation_id, service_id);
  return response;
}

export { getOrganisationServices, addService, updateService, deleteService };

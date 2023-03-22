import { apiInstance } from '@/api-config/api';

async function getOrganisations(data: any) {
  const response = await apiInstance.getOrganisations(data);
  return response.data;
}

async function addOrganisation(data: any) {
  const organisationData = {
    name: data.name,
    website: data.website,
    logo_url: data.logo_url
  };
  const response = await apiInstance.addOrganisation(
    organisationData,
    data.email,
    data.role
  );
  return response.data;
}

async function updateOrganisation(data: any, id: any) {
  const response = await apiInstance.updateOrganisation(data, id);
  return response.data;
}

async function deleteOrganisation(id: any) {
  const response = await apiInstance.deleteOrganisation(id);
  return response;
}

async function getOrganisation(id: any) {
  const response = await apiInstance.getOrganisation(id);
  return response;
}
////////////////
async function getOrganisationMembers(data: any) {
  const response = await apiInstance.getOrganisationMembers(data);
  return response.data;
}

async function sendInvitation(data: any) {
  const response = await apiInstance.sendInvitation(data);
  return response;
}

async function updateMembership(data: any) {
  const response = await apiInstance.updateMembership(data);
  return response;
}

async function removeMember(data: any) {
  const response = await apiInstance.removeMember(data);
  return response;
}

async function cancelInvitation(data: any) {
  const response = await apiInstance.cancelInvitation(data);
  return response;
}

export {
  getOrganisations,
  addOrganisation,
  updateOrganisation,
  deleteOrganisation,
  getOrganisationMembers,
  getOrganisation,
  sendInvitation,
  updateMembership,
  removeMember,
  cancelInvitation
};

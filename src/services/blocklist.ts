import { apiInstance } from '@/api-config/api';

async function getBlockListOrganisation(data: any) {
  const response = await apiInstance.getBlockListOrganisation(data);
  return response.data;
}

async function addBlockListOrganisation(data: any) {
  const response = await apiInstance.addBlockListOrganisation(data);
  return response.data;
}

async function updateBlocklistOrganisation(data: any, id: string) {
  const response = await apiInstance.updateBlockListOrganisation(data, id);
  return response.data;
}

async function deleteBlocklistOrganistion(id: string) {
  await apiInstance.deleteBlockListOrganisation(id);
}

//////////////

async function getBlockLists(data: any) {
  const payload = {
    search: data.search,
    order_by: data.order_by,
    search_type: data.search_type,
    skip: data.skip,
    limit: data.limit,
    is_disabled: data.is_disabled
  };
  const response = await apiInstance.getBlockLists(payload, data.orgId);
  return response.data;
}

async function addBlockList(data: any, orgId: string) {
  const response = await apiInstance.addBlockList(data, orgId);
  return response.data;
}

async function updateBlocklist(data: any, orgId: string, id: string) {
  const response = await apiInstance.updateBlockList(data, orgId, id);
  return response.data;
}

async function deleteBlocklist(orgId: string, id: string) {
  await apiInstance.deleteBlockList(orgId, id);
}

////////////

async function getBlockListsReports(data: any) {
  const response = await apiInstance.getBlockListsReports(data);
  return response.data;
}

export {
  getBlockListOrganisation,
  addBlockListOrganisation,
  updateBlocklistOrganisation,
  deleteBlocklistOrganistion,
  getBlockLists,
  addBlockList,
  updateBlocklist,
  deleteBlocklist,
  getBlockListsReports
};

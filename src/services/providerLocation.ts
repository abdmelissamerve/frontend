import { apiInstance } from '@/api-config/api';
import { ProviderLocation } from '@/types';

async function getProviderLocations(providerId: number) {
  const response = await apiInstance.getProviderLocations(providerId);
  return response;
}

async function deleteProviderLocation(providerId: string, locationId: number) {
  await apiInstance.deleteProviderLocation(providerId, locationId);
}
async function addProviderLocation(providerId: number, data: any) {
  return await apiInstance.addProviderLocation(providerId, data);
}

const providerLocationConverter = {
  toApi: (providerLocation: ProviderLocation) => {
    return {
      id: providerLocation.id,
      continent: providerLocation.continent,
      country: providerLocation.country,
      city: providerLocation.city,
      data_center: providerLocation.dataCenter
    };
  },
  fromApi: (item: any) => {
    return {
      id: item.id,
      continent: item.continent,
      country: item.country,
      city: item.city,
      dataCenter: item.data_center
    };
  }
};

export { getProviderLocations, deleteProviderLocation, addProviderLocation };

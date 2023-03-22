import type { Provider } from '@/types';
import { apiInstance } from '@/api-config/api';

async function getProviders(data: any) {
  const response = await apiInstance.getProviders(data);
  let results = [];
  response.data.forEach((element) => {
    results.push(providerConverter.fromApi(element));
  });
  return results;
}

async function addProvider(data: any) {
  const response = await apiInstance.addProvider(data);
  return response;
}

async function updateProvider(data: any, id: string) {
  const response = await apiInstance.updateProvider(data, id);
  return response;
}

async function deleteProvider(id: string) {
  await apiInstance.deleteProvider(id);
}

const providerConverter = {
  toApi: (provider: Provider) => {
    return {
      id: provider.id,
      name: provider.name,
      site: provider.site,
      login_link: provider.loginLink,
      affiliate_link: provider.affiliateLink
    };
  },
  fromApi: (item: any) => {
    return {
      id: item.id,
      name: item.name,
      site: item.site,
      loginLink: item.login_link,
      affiliateLink: item.affiliate_link,
      workerCount: item.worker_count,
      locationCount: item.location_count,
      description: item.description,
      services: item.services,
      logo: item.logo,
      password: item.password,
      published: item.page_published,
      statistics: item.statistics?.statistics,
      changes: item.changes
    };
  }
};

export { getProviders, addProvider, updateProvider, deleteProvider };

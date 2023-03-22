import { apiInstance } from '@/api-config/api';

async function getWhoIsReports(data: any) {
  const response = await apiInstance.getWhoIsReports(data);
  return response.data;
}

export { getWhoIsReports };

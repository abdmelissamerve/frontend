import type { Worker } from '@/types';

import { apiInstance } from '@/api-config/api';

async function getWorkers(data: any) {
  const response = await apiInstance.getWorkers(data);
  let results = {
    workersCount: response.data.workers_count,
    disabledCount: response.data.disabled_count,
    ipv4Count: response.data.ipv4_count,
    ipv6Count: response.data.ipv6_count,
    workers: []
  };
  response.data.workers.forEach((element) => {
    results.workers.push(workerConverter.fromApi(element));
  });
  return results;
}

async function addWorker(data: Worker) {
  const response: any = await apiInstance.addWorker(data);
  if (response?.statusCode === 400)
    throw new Error('Ip address already exists');

  const result = workerConverter.fromApi(response);
  return result;
}

async function updateWorker(data: any, id: number) {
  const response = await apiInstance.updateWorker(data, id);
  return response;
}

async function deleteWorker(id: number) {
  const response = await apiInstance.deleteWorker(id);
  return response;
}

async function deployWorker(id: number) {
  const response = await apiInstance.deployWorker(id);
  return response;
}

const workerConverter = {
  toApi: (worker: Worker) => {
    return {
      id: worker.id,
      ipv4: worker.ipv4,
      ipv6: worker.ipv6,
      port: worker.port,
      latitude: worker.latitude,
      longitude: worker.longitude,
      payment_date: worker.paymentDate,
      payment_recurrence: worker.paymentRecurrence,
      currency: worker.currency,
      price: worker.price
    };
  },
  fromApi: (item: any) => {
    return {
      id: item.id,
      ipv4: item.ipv4,
      ipv6: item.ipv6,
      port: item.port,
      private_ipv4: item.private_ipv4,
      latitude: item.location.coordinates?.latitude,
      longitude: item.location.coordinates?.longitude,
      city: item.location.city,
      continent: item.location.continent,
      country: item.location.country,
      dataCenter: item.location.data_center,
      location: item.location,
      provider: item.location.provider.name,
      providerData: item.location.provider,
      paymentDate: item.payment_date,
      paymentRecurrence: item.payment_recurrence,
      currency: item.currency,
      price: item.price,
      asn: item.asn,
      disabled: item.disabled
    };
  }
};

export {
  getWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  deployWorker,
  workerConverter
};

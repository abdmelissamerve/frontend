import { type ApisauceInstance, create, type ApiResponse } from 'apisauce';
import { getGeneralApiProblem } from './api-problem';
import { type ApiConfig, DEFAULT_API_CONFIG } from './api-config';

import type { User, Worker, Provider } from '../types';

import {
  requestsCallbackMonitor,
  getCurrentUserAuthorization
} from './monitorAxiosReq';

import type {
  Auth,
  GetRegisterResult,
  GetProvidersResult,
  AddWorkerResult,
  GetWorkersResult,
  GetMaxMindResult,
  UpdateWorkersResult
} from './api.types';

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce!: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup(): void {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    this.apisauce.addMonitor(requestsCallbackMonitor);
    this.apisauce.addAsyncRequestTransform(getCurrentUserAuthorization);
  }

  /**
   * Gets a list of repos.
   */

  // auth with providers

  // async register(data: object): Promise<GetRegisterResult> {
  //   const response: ApiResponse<Auth> = await this.apisauce.post(
  //     '/auth/register',

  //     data,
  //     { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
  //   );
  //   if (!response.ok) {
  //     const problem = getGeneralApiProblem(response);
  //     if (problem) throw problem;
  //   }
  //   try {
  //     if (!response.data) {
  //       throw Error;
  //     }
  //     return { kind: 'ok', data: response.data };
  //   } catch {
  //     return { kind: 'bad-data' };
  //   }
  // }
  //////////////////////////

  // add worker
  async addWorker(data: any): Promise<AddWorkerResult> {
    const accessToken = sessionStorage.getItem('access_token');
    const response: ApiResponse<any> = await this.apisauce.post(
      'admin/workers/',
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      if (!response.data) {
        throw Error;
      }
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  // get workers
  async getWorkers(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response: ApiResponse<any> = await this.apisauce.get(
      'admin/workers/',
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      if (!response.data) {
        throw Error;
      }
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  // update workers
  async updateWorker(data: any, id: number): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response: ApiResponse<any> = await this.apisauce.patch(
      `admin/workers/${id}/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      if (!response.data) {
        throw Error;
      }
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  // delete worker
  async deleteWorker(id: number): Promise<null> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.delete(`admin/workers/${id}/`, {}, {});

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return null;
  }

  // deploy_worker
  async deployWorker(id: number): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.post(
      `admin/workers/deploy/${id}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        timeout: 1000 * 60 * 3
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    return response;
  }

  // max mind
  async getMaxMindData(ip: string): Promise<GetMaxMindResult> {
    const accessToken = sessionStorage.getItem('access_token');
    const response: ApiResponse<any> = await this.apisauce.get(
      `/thirdparty/maxmind/${ip}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      if (!response.data) {
        throw Error;
      }
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'server' };
    }
  }

  async getBigData(ip: string): Promise<any> {
    const accessToken = getAccessToken();
    const response: ApiResponse<any> = await this.apisauce.get(
      `/thirdparty/bigdata/${ip}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'server' };
    }
  }

  /////////////////////
  // providers

  async addProvider(data: Provider): Promise<any> {
    // test
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.post('admin/providers/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    try {
      return response.data;
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getProviders(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response: ApiResponse<any> = await this.apisauce.get(
      'admin/providers/',
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      if (!response.data) {
        throw Error;
      }
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async updateProvider(data: any, id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(`admin/providers/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    try {
      return response.data;
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async deleteProvider(id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.delete(
      `admin/providers/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return response.data;
    } catch {
      return { kind: 'bad-data' };
    }
  }

  ///////////////
  /////////////
  async getAllLocations(data: object): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await this.apisauce.get(`/locations`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
      return [];
    }
    try {
      return response.data;
    } catch {
      return { kind: 'server' };
    }
  }

  //////////////
  async addProviderLocation(providerId: number, data: any): Promise<any> {
    const response = await this.apisauce.post(
      `admin/providers/${providerId}/locations/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  //
  async getProviderLocations(providerId: number): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await this.apisauce.get(
      `admin/providers/${providerId}/locations/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
      return [];
    }
    try {
      return response.data;
    } catch {
      return { kind: 'server' };
    }
  }

  async deleteProviderLocation(
    providerId: string,
    locationId: number
  ): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.delete(
      `admin/providers/${providerId}/locations/${locationId}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      return response.data;
    } catch {
      return { kind: 'server' };
    }
  }

  async updateProviderLocation(
    providerId: string,
    locationId: number,
    data: {
      continent: string;
      country: string;
      city: string;
      dataCenter: string;
    }
  ): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(
      `admin/providers/${providerId}/locations/${locationId}/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      return response.data;
    } catch {
      return { kind: 'server' };
    }
  }

  // blockLists organisation

  async getBlockListOrganisation(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.get(
      'admin/blocklist_organisations/',
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async addBlockListOrganisation(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.post(
      'admin/blocklist_organisations/',
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async updateBlockListOrganisation(data: any, id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(
      `admin/blocklist_organisations/${id}/`,
      data,
      {}
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async deleteBlockListOrganisation(id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await this.apisauce.delete(
      `admin/blocklist_organisations/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'server' };
    }
  }

  ////

  async getBlockLists(data: any, orgId: number): Promise<any> {
    const response = await this.apisauce.get(
      `admin/blocklist_organisations/${orgId}/blocklists/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async addBlockList(data: any, orgId: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.post(
      `admin/blocklist_organisations/${orgId}/blocklists/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async updateBlockList(data: any, orgId: string, id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(
      `admin/blocklist_organisations/${orgId}/blocklists/${id}/`,
      data,
      {}
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async deleteBlockList(orgId: string, id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.delete(
      `admin/blocklist_organisations/${orgId}/blocklists/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  ////

  async getBlockListsReports(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.get(
      `admin/blocklists/reports/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  // users
  async addUsers(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.post('admin/users/add_user/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 5000
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return response.data;
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getUsers(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.get('admin/users/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
      return [];
    }
    try {
      return response.data;
    } catch {
      return { kind: 'server' };
    }
  }

  async updateUser(data: User, id: string): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(`admin/users/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async updateCurrentUser(data: any): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.patch(`profile/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async fetchCurrentUser(): Promise<any> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.get(`profile/`, {}, {});
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async deleteUser(id: number): Promise<null> {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await this.apisauce.delete(`admin/users/${id}/`, {}, {});

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return null;
  }

  //whois
  async getWhoIsReports(data: any): Promise<any> {
    const response = await this.apisauce.get(`admin/whois/reports/`, data, {});
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  //////////
  async requestAnswer(answer: any, id: number): Promise<any> {
    const response = await this.apisauce.patch(
      `request_response/${id}/`,
      answer,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return { kind: 'ok', data: response.data };
  }

  //organisations
  async getOrganisations(data: any): Promise<any> {
    const response = await this.apisauce.get(`admin/organisations/`, data, {});
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async addOrganisation(data: any, email: string, role: string): Promise<any> {
    const response = await this.apisauce.post(
      `admin/organisations/`,
      { obj_in: data, email: email, role: role },
      {}
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async deleteOrganisation(id: any): Promise<any> {
    const response = await this.apisauce.delete(
      `admin/organisations/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok' };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async updateOrganisation(data: any, id: any): Promise<any> {
    const response = await this.apisauce.patch(
      `admin/organisations/${id}/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getOrganisation(id: any): Promise<any> {
    const response = await this.apisauce.get(
      `admin/organisations/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);

      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getOrganisationServices(id: any, data: any): Promise<any> {
    const response = await this.apisauce.get(
      `organisations/${id}/services/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  /////////////////
  //Members
  async sendInvitation(data: any): Promise<any> {
    const response = await this.apisauce.post(
      `admin/organisations/${data.organisation_id}/invite-member/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  ///////////////////
  async updateMembership(data: any): Promise<any> {
    const response = await this.apisauce.patch(
      `admin/organisations/${data.organisation_id}/members/${data.user_id}/`,
      data.role,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  /////////////////////
  async removeMember(data: any): Promise<any> {
    const response = await this.apisauce.delete(
      `admin/organisations/${data.organisation_id}/members/${data.user_id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return null;
  }

  ///////////////////
  async getOrganisationMembers(data: any): Promise<any> {
    const response = await this.apisauce.get(
      `admin/organisations/${data.id}/members/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  ////////////////////////
  async cancelInvitation(data: any): Promise<null> {
    const response = await this.apisauce.delete(
      `admin/organisations/${data.organisation_id}/invitations/${data.id}/`,
      {},
      {}
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return null;
  }

  // HARDWARE STOCK
  async getAllHardwareStock(data: any): Promise<any> {
    const response = await this.apisauce.get(
      `admin/worker_hardware/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getTechnicianHardware(data: any): Promise<any> {
    const response = await this.apisauce.get(
      `technician/worker_hardware/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getTechnicianHardwareStatistics(): Promise<any> {
    const response = await this.apisauce.get(
      `technician/worker_hardware/statistics/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getHardware(hardware_id: number): Promise<any> {
    const response = await this.apisauce.get(
      `technician/worker_hardware/${hardware_id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async addWorkerHardware(data: any): Promise<void> {
    const response = await this.apisauce.post(
      `admin/worker_hardware/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
  }

  async updateWorkerHardware(id: number, data: any): Promise<void> {
    const response = await this.apisauce.patch(
      `admin/worker_hardware/${id}/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
  }

  async assignHardwareToTechnician(data: any): Promise<void> {
    const response = await this.apisauce.post(
      `admin/worker_hardware/assign/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
  }

  async getHardwareStatistics(): Promise<any> {
    const response = await this.apisauce.get(
      `admin/worker_hardware/statistics/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
    try {
      return { kind: 'ok', data: response.data };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async finishInstallHardware(hardware_id: number, data: any): Promise<void> {
    const response = await this.apisauce.patch(
      `technician/worker_hardware/${hardware_id}/`,
      data,
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw { ...problem, data: response.data };
    }
  }

  async deleteWorkerHardware(id: number): Promise<null> {
    const response = await this.apisauce.delete(
      `admin/worker_hardware/${id}/`,
      {},
      {}
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw problem;
    }
    return null;
  }
}

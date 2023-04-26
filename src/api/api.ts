import { create } from "apisauce";
import { getGeneralApiProblem } from "./api-problem";
import { DEFAULT_API_CONFIG } from "./api-config";
import type { ApisauceInstance } from "apisauce";
import type { ApiConfig } from "./api-config";
import { requestsCallbackMonitor, getCurrentUserAuthorization } from "./monitorAxiosReq";
import axios from "axios";
import { identity } from "@casl/ability/dist/types/utils";

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
                Accept: "application/vnd.github.v3+json",
            },
        });
        this.apisauce.addMonitor(requestsCallbackMonitor);
        this.apisauce.addAsyncRequestTransform(getCurrentUserAuthorization);
    }

    //AUTH
    async registerUser(data: object): Promise<any> {
        const response = await this.apisauce.post(`/auth/register/`, data, {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });

        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw { ...problem, data: response.data };
        }
        try {
            return { kind: "ok", data: response.data };
        } catch {
            return { kind: "server" };
        }
    }

    async fetchCurrentUser(): Promise<any> {
        const response = await this.apisauce.get(`/user/profile/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        try {
            return { kind: "ok", data: response.data };
        } catch {
            return { kind: "bad-data" };
        }
    }

    async changePassword(data: any): Promise<any> {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${data.apiKey}`,
            { oobCode: data.oobCode, newPassword: data.newPassword },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 5000,
            }
        );

        return { kind: "ok", data: response };
    }

    async sendVerificationCode(): Promise<any> {
        console.log("sendVerificationCode");
        const response = await this.apisauce.post(`/auth/sendVerificationCode/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        try {
            return { kind: "ok", data: response.data };
        } catch {
            return { kind: "server" };
        }
    }

    async verifyCode(code: number): Promise<any> {
        const response = await this.apisauce.post(`/auth/verifyCode/`, { code: code }, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        try {
            return { kind: "ok", data: response.data };
        } catch {
            return { kind: "server" };
        }
    }
    /////////////////////////////////////////////////////
    //ADMIN
    //users
    async getUsers(data: any): Promise<any> {
        const response = await this.apisauce.get("/admin/users/", data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }
    //projects
    async getAdminProjects(data: any): Promise<any> {
        const response = await this.apisauce.get(`/admin/projects/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async addAdminProject(data: any): Promise<any> {
        const response = await this.apisauce.post(`/admin/projects/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async getAdminProjectById(id: number): Promise<any> {
        const response = await this.apisauce.get(`/admin/projects/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async updateAdminProject(id: number, data: any): Promise<any> {
        const response = await this.apisauce.put(`/admin/projects/${id}/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async deleteAdminProject(id: number): Promise<any> {
        const response = await this.apisauce.delete(`/admin/projects/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    //tasks
    async getAdminTasks(data: any): Promise<any> {
        const response = await this.apisauce.get(`/admin/tasks/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async getAdminTaskById(id: number): Promise<any> {
        const response = await this.apisauce.get(`/admin/tasks/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async addAdminTask(data: any): Promise<any> {
        const response = await this.apisauce.post(`/admin/tasks/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async updateAdminTask(id: number, data: any): Promise<any> {
        const response = await this.apisauce.put(`/admin/tasks/${id}/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async deleteAdminTask(id: number): Promise<any> {
        const response = await this.apisauce.delete(`/admin/tasks/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    /////////////////////////////////////////////////////
    //USER
    //projects
    async getUserProjects(data: any): Promise<any> {
        const response = await this.apisauce.get(`/user/projects/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async getUserProjectById(id: number): Promise<any> {
        const response = await this.apisauce.get(`/user/projects/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async addUserProject(data: any): Promise<any> {
        const response = await this.apisauce.post(`/user/projects/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async updateUserProject(id: number, data: any): Promise<any> {
        const response = await this.apisauce.put(`/user/projects/${id}/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async deleteUserProject(id: number): Promise<any> {
        const response = await this.apisauce.delete(`/user/projects/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    //tasks
    async getUserTasks(data: any): Promise<any> {
        const response = await this.apisauce.get(`/user/tasks/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async getUserTaskById(id: number): Promise<any> {
        const response = await this.apisauce.get(`/user/tasks/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async addUserTask(data: any): Promise<any> {
        const response = await this.apisauce.post(`/user/tasks/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async updateUserTask(id: number, data: any): Promise<any> {
        const response = await this.apisauce.put(`/user/tasks/${id}/`, data, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    async deleteUserTask(id: number): Promise<any> {
        const response = await this.apisauce.delete(`/user/tasks/${id}/`, {}, {});
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) return problem;
            return [];
        }
        try {
            return response.data;
        } catch {
            return { kind: "server" };
        }
    }

    /////////////////////////////////////////////////////
}

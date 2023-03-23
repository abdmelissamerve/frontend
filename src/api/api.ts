import { create } from "apisauce";
import { getGeneralApiProblem } from "./api-problem";
import { DEFAULT_API_CONFIG } from "./api-config";
import type { ApisauceInstance } from "apisauce";
import type { ApiConfig } from "./api-config";
import { requestsCallbackMonitor, getCurrentUserAuthorization } from "./monitorAxiosReq";
import qs from "qs";
import axios from "axios";

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

    async registerUser(data: object): Promise<any> {
        const response = await this.apisauce.post(`/auth/register/`, data, {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });

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

    async sendEmail(data: object): Promise<any> {
        const response = await this.apisauce.post("send_email/", data, {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        return { kind: "ok", data: response.data };
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
    async sendEmailCode(data: object): Promise<any> {
        const response = await this.apisauce.post("send_token/", data, {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        return { kind: "ok", data: response.data };
    }
    async compareCodes(data: object): Promise<any> {
        const response = await this.apisauce.post("decode_token/", data, {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
        if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) throw problem;
        }
        return { kind: "ok", data: response.data };
    }
}

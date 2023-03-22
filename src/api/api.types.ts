import type { Provider, User, Worker } from '../types';
import type { GeneralApiProblem } from './api-problem';

export interface Auth {
  access_token: string;
  user: User;
}

export type GetWorkersResult =
  | { kind: 'ok'; data: Worker[] }
  | GeneralApiProblem;

export type GetProvidersResult =
  | { kind: 'ok'; data: Provider[] }
  | GeneralApiProblem;

export type GetRegisterResult = { kind: 'ok'; data: Auth } | GeneralApiProblem;

export type AddWorkerResult = { kind: 'ok'; data: Worker } | GeneralApiProblem;

export type GetMaxMindResult =
  | { kind: 'ok'; data: { city: string; country: string; continent: string } }
  | GeneralApiProblem;

export type UpdateWorkersResult =
  | { kind: 'ok'; data: Worker }
  | GeneralApiProblem;

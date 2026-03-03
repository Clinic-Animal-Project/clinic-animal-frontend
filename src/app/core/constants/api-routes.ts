import { environment } from "@environments/environment";

const base = environment.gatewayUrl;
const srv = environment.services;

export const API_ROUTES = {
  AUTH: `${base}${srv.auth}`,
  MASTER: `${base}${srv.master}`,
  PROCESO: `${base}${srv.proceso}`,
};
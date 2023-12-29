import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  console.log("getUserIdFromRequest", request.user, typeof request.user);
  return request.user?.id;
}

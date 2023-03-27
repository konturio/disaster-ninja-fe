import jwtDecode from 'jwt-decode';
import { noop } from '@reatom/core';
import { userStateAtom } from '~core/auth/atoms/userState';
import { LOCALSTORAGE_AUTH_KEY } from './apiClient';
import type { JWTData, LocalAuthToken } from '~core/api_client/types';
import type { ApiClient } from '~core/api_client';

export type AuthSuccessResponse = {
  token: string;
  refreshToken: string;
  jwtData: JWTData;
};

export class AuthService {
  private readonly storage: WindowLocalStorage['localStorage'] = globalThis.localStorage;
  private token = '';
  private refreshToken = '';
  private tokenExpirationDate: Date | undefined;
  private checkTokenPromise: Promise<boolean> | undefined;
  public expiredTokenCallback?: () => void;

  getLocalAuthToken(callback: () => void): LocalAuthToken | undefined {
    this.expiredTokenCallback = callback;
    const authStr = this.storage.getItem(LOCALSTORAGE_AUTH_KEY);
    if (authStr) {
      const { token, refreshToken } = JSON.parse(authStr);
      if (token && refreshToken) {
        const jwtData = this.setAuth(token, refreshToken);
        if (typeof jwtData === 'string') {
          this.resetAuth();
        }
        return { token, refreshToken, jwtData };
      }
    }
  }
  private setAuth(token: string, refreshToken: string): JWTData | string {
    let decodedToken: JWTData | undefined;

    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      return "Can't decode token!";
    }

    if (decodedToken && decodedToken.exp) {
      const expiringDate = new Date(decodedToken.exp * 1000);
      if (expiringDate > new Date()) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.tokenExpirationDate = expiringDate;
        this.storage.setItem(
          LOCALSTORAGE_AUTH_KEY,
          JSON.stringify({ token, refreshToken }),
        );
        return decodedToken;
      } else {
        return 'Wrong token expire time!';
      }
    }

    return 'Wrong data received!';
  }
  private resetAuth() {
    this.token = '';
    this.refreshToken = '';
    this.tokenExpirationDate = undefined;
    this.storage.removeItem(LOCALSTORAGE_AUTH_KEY);
  }

  private async checkTokenIsExpired(): Promise<boolean> {
    if (!this.checkTokenPromise) {
      // eslint-disable-next-line no-async-promise-executor
      this.checkTokenPromise = new Promise<boolean>(async (resolve) => {
        // if token has less then 5 minutes lifetime, refresh it
        if (this.tokenExpirationDate) {
          const diffTime = this.tokenExpirationDate.getTime() - new Date().getTime();
          if (diffTime < 0) {
            this.resetAuth();
            if (this.expiredTokenCallback) {
              this.expiredTokenCallback();
            }
            resolve(false);
            return false;
          }
          const minutes5 = 1000 * 60 * 5;
          if (diffTime < minutes5) {
            const refreshResult = await this.refreshAuthToken();
            if (refreshResult && typeof refreshResult !== 'string') {
              resolve(true);
              return true;
            }
            if (this.expiredTokenCallback) {
              this.expiredTokenCallback();
            }
            resolve(false);
            return false;
          }
          resolve(true);
          return true;
        }

        if (this.expiredTokenCallback) {
          this.expiredTokenCallback();
        }
        resolve(false);
        return false;
      });
    }

    const res = await this.checkTokenPromise;
    this.checkTokenPromise = undefined;
    return res;
  }
}

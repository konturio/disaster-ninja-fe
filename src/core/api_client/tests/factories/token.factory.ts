import { base64UrlEncode, base64UrlDecode } from '../utils/base64';

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export class TokenFactory {
  static createToken(payload: Partial<JwtPayload> = {}): string {
    const defaultPayload: JwtPayload = {
      exp: 9999999999,
      iat: 1700000000,
      ...payload,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(defaultPayload));
    // Note: In tests we don't need a valid signature
    const signature = 'JDdqWq4ClLhHhg4Z7sBpQ7gk8lQ7FK7wvZhfV9v9w_k';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static createExpiredToken(): string {
    return this.createToken({
      exp: 1700000000,
      iat: 1600000000,
    });
  }

  static createRefreshToken(): string {
    return this.createToken();
  }

  static modifyTokenPayload(token: string, payload: Partial<JwtPayload>): string {
    const parts = token.split('.');
    const currentPayload = JSON.parse(base64UrlDecode(parts[1]));
    const newPayload = { ...currentPayload, ...payload };
    parts[1] = base64UrlEncode(JSON.stringify(newPayload));
    return parts.join('.');
  }

  static setTokenExpiration(token: string, exp: number): string {
    return this.modifyTokenPayload(token, { exp });
  }

  static decodeToken(token: string): JwtPayload {
    const parts = token.split('.');
    return JSON.parse(base64UrlDecode(parts[1]));
  }
}

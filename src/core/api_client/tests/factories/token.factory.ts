import { SignJWT, decodeJwt } from 'jose';

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

// Secret key for test tokens
const SECRET = new TextEncoder().encode('test-secret');

export class TokenFactory {
  static async createToken(payload: Partial<JwtPayload> = {}): Promise<string> {
    const defaultPayload: JwtPayload = {
      exp: 9999999999,
      iat: 1700000000,
      ...payload,
    };

    return new SignJWT(defaultPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(SECRET);
  }

  static async createExpiredToken(): Promise<string> {
    return this.createToken({
      exp: 1700000000,
      iat: 1600000000,
    });
  }

  static async createRefreshToken(): Promise<string> {
    return this.createToken();
  }

  static async modifyTokenPayload(
    token: string,
    payload: Partial<JwtPayload>,
  ): Promise<string> {
    const currentPayload = decodeJwt(token);
    const newPayload = { ...currentPayload, ...payload };
    return this.createToken(newPayload);
  }

  static async setTokenExpiration(token: string, exp: number): Promise<string> {
    return this.modifyTokenPayload(token, { exp });
  }

  static decodeToken(token: string): JwtPayload {
    return decodeJwt(token);
  }
}

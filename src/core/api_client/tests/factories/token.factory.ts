import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

export class TokenFactory {
  private static readonly SECRET = new TextEncoder().encode('test-secret');

  static async createToken(payload: Partial<JWTPayload> = {}): Promise<string> {
    const defaultPayload: JWTPayload = {
      exp: 9999999999,
      iat: 1700000000,
      ...payload,
    };

    return new SignJWT({ ...defaultPayload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(defaultPayload.iat || 1700000000)
      .setExpirationTime(defaultPayload.exp || 9999999999)
      .sign(this.SECRET);
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
    payload: Partial<JWTPayload>,
  ): Promise<string> {
    const { payload: currentPayload } = await jwtVerify(token, this.SECRET);
    const newPayload = { ...currentPayload, ...payload } as JWTPayload;

    return new SignJWT({ ...newPayload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(newPayload.iat || 1700000000)
      .setExpirationTime(newPayload.exp || 9999999999)
      .sign(this.SECRET);
  }

  static async setTokenExpiration(token: string, exp: number): Promise<string> {
    return this.modifyTokenPayload(token, { exp });
  }

  static async decodeToken(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, this.SECRET);
    return payload;
  }
}

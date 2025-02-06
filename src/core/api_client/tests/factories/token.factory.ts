import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

export class TokenFactory {
  private static readonly SECRET = new TextEncoder().encode('test-secret');

  static async createToken(payload: Partial<JWTPayload> = {}): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const defaultPayload: JWTPayload = {
      exp: now + 3600, // 1 hour from now
      iat: now,
      ...payload,
    };

    return new SignJWT({ ...defaultPayload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(defaultPayload.iat!)
      .setExpirationTime(defaultPayload.exp!)
      .sign(this.SECRET);
  }

  static async createExpiredToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return this.createToken({
      exp: now - 1000, // Expired 1000 seconds ago
      iat: now - 3600, // Created 1 hour ago
    });
  }

  static async createRefreshToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return this.createToken({
      exp: now + 7200, // 2 hours from now
      iat: now,
    });
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

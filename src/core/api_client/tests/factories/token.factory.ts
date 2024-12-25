import { SignJWT, jwtVerify } from 'jose';

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export class TokenFactory {
  private static readonly SECRET = new TextEncoder().encode('test-secret');

  static async createToken(payload: Partial<JwtPayload> = {}): Promise<string> {
    const defaultPayload: JwtPayload = {
      exp: 9999999999,
      iat: 1700000000,
      ...payload,
    };

    return new SignJWT({ ...defaultPayload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(defaultPayload.iat)
      .setExpirationTime(defaultPayload.exp)
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
    payload: Partial<JwtPayload>,
  ): Promise<string> {
    const { payload: currentPayload } = await jwtVerify(token, this.SECRET);
    const newPayload = { ...currentPayload, ...payload } as JwtPayload;

    return new SignJWT({ ...newPayload })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(newPayload.iat)
      .setExpirationTime(newPayload.exp)
      .sign(this.SECRET);
  }

  static async setTokenExpiration(token: string, exp: number): Promise<string> {
    return this.modifyTokenPayload(token, { exp });
  }

  static async decodeToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.SECRET);
    return payload as JwtPayload;
  }
}

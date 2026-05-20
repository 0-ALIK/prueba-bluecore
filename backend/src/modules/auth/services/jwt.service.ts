import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
}

export class JwtService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  generate(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as SignOptions);
  }

  verify(token: string): JwtPayload | string {
    return jwt.verify(token, this.secret) as JwtPayload | string;
  }
}
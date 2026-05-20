import bcrypt from 'bcrypt';

export class HashService {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
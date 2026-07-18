import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Knex } from 'knex';
import { UnauthorizedError } from '../../common/errors';
import { env } from '../../config/env';
import { JwtPayload, LoginResponse } from './auth.types';

interface HrUserRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export class AuthService {
  constructor(private readonly db: Knex) {}

  public async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.db<HrUserRecord>('hr_users').where({ email }).first();

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: JwtPayload = { id: user.id, email: user.email };

    const signOptions: jwt.SignOptions = {
      expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    };
    const token = jwt.sign(payload, env.jwt.secret, signOptions);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { BaseController } from '../../common/utils/BaseController';
import { AuthService } from './auth.service';
import { LoginRequestBody } from './auth.types';

export class AuthController extends BaseController<AuthService> {
  constructor(service: AuthService) {
    super(service);
  }

  public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginRequestBody;
    const result = await this.service.login(email, password);
    res.status(200).json(result);
  });
}

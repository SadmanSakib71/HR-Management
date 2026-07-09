import { BaseController } from '../../common/utils/BaseController';
import { AuthService } from './auth.service';

export class AuthController extends BaseController<AuthService> {
  constructor(service: AuthService) {
    super(service);
  }
}

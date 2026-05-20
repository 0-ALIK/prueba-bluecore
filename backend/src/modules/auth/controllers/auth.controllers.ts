import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private readonly authService = new AuthService();

  public register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    return res.status(201).json(result);
  };

  public login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    return res.status(200).json(result);
  };
}
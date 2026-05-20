import { Request, Response } from 'express';
import { CreditApplicationService } from '../services/credit-application.service';

export class CreditApplicationController {
  private readonly creditApplicationService = new CreditApplicationService();

  public create = async (req: Request, res: Response) => {
    const result = await this.creditApplicationService.create(req.body);
    return res.status(201).json(result);
  };

  public getById = async (req: Request, res: Response) => {
    const result = await this.creditApplicationService.getById(req.params.id as string);
    return res.status(200).json(result);
  };

  public getAll = async (req: Request, res: Response) => {
    const result = await this.creditApplicationService.getAll((req as any).validatedQuery);
    return res.status(200).json(result);
  };

  public updateStatus = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await this.creditApplicationService.updateStatus({
      id: req.params.id as string,
      status: req.body.status,
      comment: req.body.comment,
      userId: user.sub,
    });
    return res.status(200).json(result);
  };
}

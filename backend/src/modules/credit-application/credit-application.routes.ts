import { Router } from 'express';
import { createCreditApplicationSchema } from './schemas/create-credit-application.schema';
import { getCreditApplicationSchema } from './schemas/get-credit-application.schema';
import { getAllCreditApplicationsSchema } from './schemas/get-all-credit-applications.schema';
import { updateCreditApplicationStatusBodySchema } from './schemas/update-credit-application-status.schema';
import { asyncHandler } from '../../shared/middlewares/async-handler.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authMiddleware } from '../auth/middlewares/auth.middleware';
import { CreditApplicationController } from './controllers/credit-application.controller';

export class CreditApplicationRoutes {
  public static get routes(): Router {
    const router = Router();
    const creditApplicationController = new CreditApplicationController();

    router.post(
      '/',
      validate(createCreditApplicationSchema),
      asyncHandler(creditApplicationController.create),
    );

    router.get(
      '/',
      authMiddleware,
      validate(getAllCreditApplicationsSchema, 'query'),
      asyncHandler(creditApplicationController.getAll),
    );

    router.get(
      '/:id',
      authMiddleware,
      validate(getCreditApplicationSchema, 'params'),
      asyncHandler(creditApplicationController.getById),
    );

    router.patch(
      '/:id/status',
      authMiddleware,
      validate(updateCreditApplicationStatusBodySchema),
      asyncHandler(creditApplicationController.updateStatus),
    );

    return router;
  }
}

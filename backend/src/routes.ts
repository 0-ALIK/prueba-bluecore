import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { CreditApplicationRoutes } from "./modules/credit-application/credit-application.routes";

export class Routes {
	public static get routes(): Router {
		const router = Router();

		router.use("/auth", AuthRoutes.routes);
		router.use("/credit-applications", CreditApplicationRoutes.routes);

		return router;
	}
}
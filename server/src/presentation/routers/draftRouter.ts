import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { baseHeader, baseHeaderWithToken, baseHeaderWithDeviceId } from "../../infrastructure/validations/headerValidations";
import { Middleware } from "../../application/middlewares";
import { DraftController } from "../../application/controllers/draftController";
import { createDraftValidationBody, createDraftValidationParam, deleteDraftValidationParam, downloadDraftValidationParam, getAllDraftValidationParam, getAllDraftValidationQuery, getByIdDraftValidationParam, updateDraftValidationBody, updateDraftValidationParam } from "../../infrastructure/validations/draftValidations";
@injectable()
export class DraftRouter {
  private routeProvider: Router;
  private draftController: DraftController;
  private middleware: Middleware
  private validationBuilder: ValidationBuilder;
  private validations: Record<string, (req: Request, res: Response, next: NextFunction) => void> = {};
  constructor(
    @inject(Types.DraftController) controller: DraftController,
    @inject(Types.ValidationBuilder) validationBuilder: ValidationBuilder,
    @inject(Types.Middleware) middleware: Middleware
  ) {
    this.routeProvider = Router();
    this.draftController = controller;
    this.validationBuilder = validationBuilder;
    this.middleware = middleware;

    this.validations['create'] = this.validationBuilder.build(baseHeaderWithToken, createDraftValidationBody, undefined, createDraftValidationParam);
    this.validations['update'] = this.validationBuilder.build(baseHeaderWithToken, updateDraftValidationBody, undefined, updateDraftValidationParam);
    this.validations['delete'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, deleteDraftValidationParam);
    this.validations['getById'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, getByIdDraftValidationParam);
    this.validations['getAll'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getAllDraftValidationQuery, getAllDraftValidationParam);
  }
  matchControllerToRouter = () => {
    this.routeProvider.post("/api/v1/:user/drafts/create", this.validations['create'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.draftController.CreateDraft);
    this.routeProvider.patch("/api/v1/:user/drafts/update/:draft", this.validations['update'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.draftController.UpdateDraft);
    this.routeProvider.delete("/api/v1/:user/drafts/delete/:draft", this.validations['delete'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.draftController.DeleteDraft);
    this.routeProvider.get("/api/v1/:user/drafts/:draft/get", this.validations['getById'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.draftController.GetDraftById);
    this.routeProvider.get("/api/v1/:user/drafts/list", this.validations['getAll'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.draftController.GetDraftAll)
  }
  getRouterProvider = (): Router => {
    return this.routeProvider;
  }
}

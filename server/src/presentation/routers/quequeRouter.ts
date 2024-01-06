import { Request, Response, NextFunction, Router } from "express";
import { inject, injectable } from "inversify";
import { Middleware } from "../../application/middlewares";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { Types } from "../../domain/models/ioc.types";
import { baseHeaderWithToken } from "../../infrastructure/validations/headerValidations";
import { QuequeController } from "../../application/controllers/quequeController";
import {
  addCustomersBody,
  addCustomersParam,
  createQuequeBody,
  createQuequeParam,
  deleteFileBody,
  deleteFileParam,
  deleteQuequeParam,
  getAllQuequeParam,
  getAllQuequeQuery,
  getByIdQuequeParam,
  getItemsQuequeParam,
  getItemsQuequeQuery,
  pauseQueueParam,
  removeCustomersBody,
  removeCustomersParam,
  startQueueAgainBody,
  startQueueAgainParam,
  updateQuequeBody,
  updateQuequeParam
} from "../../infrastructure/validations/queque";


@injectable()
export class QuequeRouter {
  private routeProvider: Router;
  private quequeController: QuequeController
  private middleware: Middleware
  private validationBuilder: ValidationBuilder
  private validations: Record<string, (req: Request, res: Response, next: NextFunction) => void> = {};

  constructor(
    @inject(Types.QuequeController) controller: QuequeController,
    @inject(Types.ValidationBuilder) validationBuilder: ValidationBuilder,
    @inject(Types.Middleware) middleware: Middleware
  ) {
    this.routeProvider = Router();
    this.quequeController = controller;
    this.validationBuilder = validationBuilder;
    this.middleware = middleware;
    this.validations['createQueque'] = this.validationBuilder.build(baseHeaderWithToken, createQuequeBody, undefined, createQuequeParam);
    this.validations['deleteQueque'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, deleteQuequeParam);
    this.validations['updateQueque'] = this.validationBuilder.build(baseHeaderWithToken, updateQuequeBody, undefined, updateQuequeParam)
    this.validations['getById'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, getByIdQuequeParam);
    this.validations['getAll'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getAllQuequeQuery, getAllQuequeParam);
    this.validations['deleteFile'] = this.validationBuilder.build(baseHeaderWithToken, deleteFileBody, undefined, deleteFileParam);
    this.validations['pause-queue'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, pauseQueueParam);
    this.validations['start-queue-again'] = this.validationBuilder.build(baseHeaderWithToken, startQueueAgainBody, undefined, startQueueAgainParam);
    this.validations['queue-items'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getItemsQuequeQuery, getItemsQuequeParam);
    this.validations['add-customers'] = this.validationBuilder.build(baseHeaderWithToken, addCustomersBody, undefined, addCustomersParam);
    this.validations['remove-customer'] = this.validationBuilder.build(baseHeaderWithToken, removeCustomersBody, undefined, removeCustomersParam);

  }

  matchControllerToRouter = () => {
    this.routeProvider.get("/api/v1/:user/queque/list", this.validations['getAll'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.GetAllQueque);
    this.routeProvider.get("/api/v1/:user/queque/:queque", this.validations['getById'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.GetById);
    this.routeProvider.get("/api/v1/:user/queque/:queque/items", this.validations['queue-items'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.GetQueueItems);
    this.routeProvider.post("/api/v1/:user/queque/create", this.validations['createQueque'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.quequeUseCases.uploadManager.array('files', 5), this.quequeController.CreateQueque); this.routeProvider.delete("/api/v1/:user/queque/delete/:queque", this.validations['deleteQueque'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.DeleteQueque);
    this.routeProvider.put("/api/v1/:user/queque/update/:queque/content", this.validations['updateQueque'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.UpdateQuequeContent);
    this.routeProvider.post("/api/v1/:user/queque/delete/:queque/file", this.validations['deleteFile'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.DeleteQuequeFile);
    this.routeProvider.post("/api/v1/:user/queue/pause/:queue", this.validations['pause-queue'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.PauseQueue);
    this.routeProvider.post("/api/v1/:user/queue/start-again/:queue", this.validations['start-queue-again'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.StartQueueAgain);
    this.routeProvider.post("/api/v1/:user/queue/:queue/add-customer", this.validations['add-customers'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.AddCustomersToQueue);
    this.routeProvider.post("/api/v1/:user/queue/:queue/remove-customer", this.validations['remove-customer'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.quequeController.RemoveCustomerFromQueue);


    // add -extra file
    // remove file from queue
    // add new customer
    // remove from customer queue
    // get queue items as CUSTOMER (queueid, customername, customer lastname)
  }

  getRouterProvider = () => {
    return this.routeProvider;
  }
}

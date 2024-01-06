import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { CustomerController } from "../../application/controllers/customerController";
import { Middleware } from "../../application/middlewares";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { Types } from "../../domain/models/ioc.types";
import { baseHeaderWithToken } from "../../infrastructure/validations/headerValidations";
import { updateProfileBody } from "../../infrastructure/validations/profileValidations";
import { addCustomerBody, addCustomerParam, addMultipleCustomerBody, addToBlackListParam, addToGrayListParam, addToGroupBody, addToGroupParam, createGroupBody, createGroupParams, deleteCustomerParam, deleteGroupParam, getBlackListParam, getBlackListQuery, getCustomerById, getCustomersParam, getCustomersQuery, getGrayListParam, getGrayListQuery, getGroupById, getGroupCustomersParam, getGroupCustomersQuery, getGroupsParam, getGroupsQuery, removeFromBlackListParam, removeFromGrayListParam, removeFromGroupBody, removeFromGroupParam, updateCustomerBody, updateCustomerParam, updategroupBody, updategroupParam } from "../../infrastructure/validations/customerValidations";

@injectable()
export class CustomerRouter {
  private routeProvider: Router;
  private customerController: CustomerController;
  private middleware: Middleware;
  private validationBuilder: ValidationBuilder;
  private validations: Record<string, (req: Request, res: Response, next: NextFunction) => void> = {};

  constructor(
    @inject(Types.CustomerController) controller: CustomerController,
    @inject(Types.ValidationBuilder) validationBuilder: ValidationBuilder,
    @inject(Types.Middleware) middleware: Middleware
  ) {
    this.routeProvider = Router();
    this.customerController = controller;
    this.validationBuilder = validationBuilder;
    this.middleware = middleware;

    this.validations['createGroup'] = this.validationBuilder.build(baseHeaderWithToken, createGroupBody, undefined, createGroupParams);
    this.validations['addCustomer'] = this.validationBuilder.build(baseHeaderWithToken, addCustomerBody, undefined, addCustomerParam);
    this.validations['addMultipleCustomer'] = this.validationBuilder.build(baseHeaderWithToken, addMultipleCustomerBody, undefined, addCustomerParam);
    this.validations['deleteGroup'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, deleteGroupParam);
    this.validations['deleteCustomer'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, deleteCustomerParam);
    this.validations['updateGroup'] = this.validationBuilder.build(baseHeaderWithToken, updategroupBody, undefined, updategroupParam);
    this.validations['updateCustomer'] = this.validationBuilder.build(baseHeaderWithToken, updateCustomerBody, undefined, updateCustomerParam);
    this.validations['addBlackList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, addToBlackListParam);
    this.validations['addGrayList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, addToGrayListParam);
    this.validations['removeBlackList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, removeFromBlackListParam);
    this.validations['removeGrayList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, removeFromGrayListParam);
    this.validations['addToGroup'] = this.validationBuilder.build(baseHeaderWithToken, addToGroupBody, undefined, addToGroupParam);
    this.validations['removeFromGroup'] = this.validationBuilder.build(baseHeaderWithToken, removeFromGroupBody, undefined, removeFromGroupParam);
    this.validations['getCustomers'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getCustomersQuery, getCustomersParam);
    this.validations['getBlackList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getBlackListQuery, getBlackListParam);
    this.validations['getGrayList'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getGrayListQuery, getGrayListParam);
    this.validations['getGroups'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getGroupsQuery, getGroupsParam);
    this.validations['getGroupCustomers'] = this.validationBuilder.build(baseHeaderWithToken, undefined, getGroupCustomersQuery, getGroupCustomersParam);
    this.validations['getGroupById'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, getGroupById);
    this.validations['getCustomerById'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, getCustomerById);
    
  }
  matchControllerToRouter = () => {
    // customers
    this.routeProvider.post('/api/v1/:user/customers/create', this.validations['addCustomer'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.addCustomer);
    this.routeProvider.post('/api/v1/:user/customers/bulk/create', this.validations['addMultipleCustomer'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.addMultipleCustomer);
    this.routeProvider.delete('/api/v1/:user/customers/delete/:customer', this.validations['deleteCustomer'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.deleteCustomer);
    this.routeProvider.put('/api/v1/:user/customers/update/:customer', this.validations['updateCustomer'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.updateCustomer);
    this.routeProvider.get('/api/v1/:user/customers/', this.validations['getCustomers'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.getCustomers);
    this.routeProvider.get('/api/v1/:user/customers/:customer', this.validations['getCustomerById'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.GetCustomerByID);

    // groups
    this.routeProvider.post('/api/v1/:user/groups/create', this.validations['createGroup'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.createGroup);
    this.routeProvider.delete('/api/v1/:user/groups/delete/:group', this.validations['deleteGroup'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.deleteGroup);
    this.routeProvider.put('/api/v1/:user/groups/update/:group', this.validations['updateGroup'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.updateGroup);
    this.routeProvider.get('/api/v1/:user/groups/get', this.validations['getGroups'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.getGroups);
    this.routeProvider.get('/api/v1/:user/groups/single/:group', this.validations['getGroupById'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.GetGroupByID);

    this.routeProvider.post('/api/v1/:user/customers/groups/add/:group', this.validations['addToGroup'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.addToGroup);
    this.routeProvider.post('/api/v1/:user/customers/groups/remove/:group', this.validations['removeFromGroup'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.removeFromGroup);
    this.routeProvider.get('/api/v1/:user/customers/groups/:group', this.validations['getGroupCustomers'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.getGroupCustomer);

    // blacklist
    this.routeProvider.post('/api/v1/:user/blacklist/customers/add/:customer', this.validations['addBlackList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.addToBlackList);
    this.routeProvider.post('/api/v1/:user/blacklist/customers/remove/:customer', this.validations['removeBlackList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.removeFromBLackList);
    this.routeProvider.get('/api/v1/:user/blacklist/customers', this.validations['getBlackList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.getBlackList);

    //graylist
    this.routeProvider.post('/api/v1/:user/graylist/customers/remove/:customer', this.validations['removeBlackList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.removeFromGrayList);
    this.routeProvider.post('/api/v1/:user/graylist/customers/add/:customer', this.validations['addGrayList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.addToGrayList);
    this.routeProvider.get('/api/v1/:user/graylist/customers', this.validations['getGrayList'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.customerController.getGrayList);

    //group customers



  }

  getRouterProvider = () => {
    return this.routeProvider;
  }
}

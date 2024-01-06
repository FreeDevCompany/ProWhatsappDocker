import { inject, injectable } from "inversify";
import { CustomerUseCases } from "../useCases/customerUseCases";
import { Types } from "../../domain/models/ioc.types";
import { ErrorHandler } from "../utilities/errorHandler";
import { Request, Response } from "express";

@injectable()
export class CustomerController {
  private customerUseCaseService: CustomerUseCases;
  constructor(
    @inject(Types.CustomerUseCases) _service: CustomerUseCases
  ) {
    this.customerUseCaseService = _service;
  }

  public GetGroupByID = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user as string;
    let groupId = req.params.group as string;
    let response = await this.customerUseCaseService.getGroupById({ userId, groupId });
    return res.status(response.status_code as number).json(response);
  })
  public GetCustomerByID = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user as string;
    let customerId = req.params.customer as string;
    let response = await this.customerUseCaseService.getCustomerById({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public createGroup = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let groupName = req.body.groupName;
    let userId = req.params.user as string;
    let response = await this.customerUseCaseService.createGroup({ userId, groupName });
    return res.status(response.status_code as number).json(response);
  })

  public addCustomer = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let { name, lastName, phone } = req.body;
    let userId = req.params.user;
    let response = await this.customerUseCaseService.addNewCustomer({ userId, name, lastName, phone });
    return res.status(response.status_code as number).json(response);
  })
  public addMultipleCustomer =  ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let customers:Array<{ name: string, lastName: string, phone: string }> = req.body;
    let userId = req.params.user;
    let response = await this.customerUseCaseService.addMultipleCustomers({userId, customers});
    return res.status(response.status_code as number).json(response);
  })
  public deleteCustomer = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let response = await this.customerUseCaseService.deleteCustomer({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public deleteGroup = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let groupId = req.params.group;
    let response = await this.customerUseCaseService.deleteGroup({ userId, groupId });
    return res.status(response.status_code as number).json(response);
  })
  public updateCustomer = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let { name, lastName, phone } = req.body;
    let response = await this.customerUseCaseService.updateCustomer({ userId, customerId, name, lastName, phone });
    return res.status(response.status_code as number).json(response);
  })
  public updateGroup = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let groupId = req.params.group;
    let groupName = req.body.groupName;
    let response = await this.customerUseCaseService.updateGroup({ userId: userId, group: groupId, groupName: groupName });
    return res.status(response.status_code as number).json(response);
  })
  public addToBlackList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let response = await this.customerUseCaseService.addToBlackList({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public addToGrayList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let response = await this.customerUseCaseService.addToGrayList({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public removeFromGrayList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let response = await this.customerUseCaseService.removeFromGrayList({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public removeFromBLackList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let customerId = req.params.customer;
    let response = await this.customerUseCaseService.removeFromBlackList({ userId, customerId });
    return res.status(response.status_code as number).json(response);
  })
  public addToGroup = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let groupId = req.params.group;
    let customers = req.body.customers;
    let response = await this.customerUseCaseService.addToGroup({ userId, customers, groupId });
    return res.status(response.status_code as number).json(response);
  })
  public removeFromGroup = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let groupId = req.params.group;
    let customerId = req.body.customerId;
    let response = await this.customerUseCaseService.removeFromGroup({ userId, customerId, groupId });
    return res.status(response.status_code as number).json(response);
  })

  public getCustomers = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let page = req.query.page as unknown as number;
    let perPage = req.query.perpage as unknown as number;
    let response = await this.customerUseCaseService.getCustomers({ userId, page, perPage });
    return res.status(response.status_code as number).json(response);
  })

  public getBlackList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let page = req.query.page as unknown as number;
    let perPage = req.query.perpage as unknown as number;
    let response = await this.customerUseCaseService.getBlackLists({ userId, page, perPage });
    return res.status(response.status_code as number).json(response);
  })
  public getGrayList = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let page = req.query.page as unknown as number;
    let perPage = req.query.perpage as unknown as number;
    let response = await this.customerUseCaseService.getGrayLists({ userId, page, perPage });
    return res.status(response.status_code as number).json(response);
  })
  public getGroups = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let page = req.query.page as unknown as number;
    let perPage = req.query.perpage as unknown as number;
    let response = await this.customerUseCaseService.getGroups({ userId, page, perPage });
    return res.status(response.status_code as number).json(response);
  })
  public getGroupCustomer = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let userId = req.params.user;
    let groupId = req.params.group;
    let page = req.query.page as unknown as number;
    let perPage = req.query.perpage as unknown as number;
    let response = await this.customerUseCaseService.getGroupCustomers({ userId, groupId, page, perPage });
    return res.status(response.status_code as number).json(response);
  })
}

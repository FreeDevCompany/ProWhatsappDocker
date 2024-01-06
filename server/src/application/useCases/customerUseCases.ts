import { inject, injectable } from "inversify";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { Types } from "../../domain/models/ioc.types";
import {ICustomer, ICustomerResponse} from "../../domain/models/customers.types";
import { generateResponse } from "../utilities/responseHelper";
import mongoose from "mongoose";
import { ICustomerGroup } from "../../domain/models/customerGroup.types";
import { IPaginationResponse, IResponse } from "../../domain/http/baseResponse.types";
import { LinkHelper } from "../utilities/linkHelper";
import { customerRequestType } from "../../domain/http/Requests.types/customer";
@injectable()
export class CustomerUseCases {
  private repositoryService: RepositoryService
  private loggerService: LoggerService
  constructor(
    @inject("RepositoryService") repositoryService: RepositoryService,
    @inject(Types.LoggerService) loggerService: LoggerService) {
    this.repositoryService = repositoryService;
    this.loggerService = loggerService;
  }
  createGroup = async (body: customerRequestType["CREATE_GROUP"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);
    let foundGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, groupName: body.groupName });
    if (foundGroup) return generateResponse<{}>({}, "The group already created.", "", 400);
    await this.repositoryService.customerGroupRepository.create({
      groupName: body.groupName,
      userId: body.userId,
      updatedAt: new Date()
    } as ICustomerGroup)
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] created a new group.`);
    return generateResponse<{}>({}, "New group created.", "", 200);
  }
  addNewCustomer = async (body: customerRequestType["ADD_CUSTOMER"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);
    let matchedPhone = await this.repositoryService.customerRepository.findOne({ userId: body.userId, phone: body.phone });
    if (matchedPhone) return generateResponse<{}>({}, "There is a customer associated with this number.", "", 404);

    await this.repositoryService.customerRepository.create({
      userId: body.userId,
      name: body.name,
      lastName: body.lastName,
      phone: body.phone
    } as ICustomer);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] added a new customer. `);
    return generateResponse<{}>({}, "Customer was added.", "GET_CUSTOMERS", 201);
  }
  addMultipleCustomers = async (body: customerRequestType["ADD_MULTIPLE_CUSTOMER"]) => {
    const user = await this.repositoryService.userRepository.getById(body.userId);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 404);
    const model = this.repositoryService.customerRepository.getModel();
    const exists_data = await model.find({phone: {$in: body.customers.map(item => item.phone)}})
    const new_data = body.customers.filter(item => !exists_data.find(exists => exists.phone === item.phone))
    await model.insertMany(new_data);
    this.loggerService.Log(LogType.INFO, LogLocation.all, `[${body.userId}] has inserted many customers. | Count => ${new_data.length}`);
    return generateResponse<{saved_count: number}>({saved_count: new_data.length}, "Customers has been added to the system", "", 201);    
  }
  deleteCustomer = async (body: customerRequestType["DELETE_CUSTOMER"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let isFound = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId) });
    if (!isFound) return generateResponse<{}>({}, "No such customer could be found.", "", 400);
    await this.repositoryService.customerRepository.delete(body.customerId);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] deleted a customer [${body.customerId}]. `);
    return generateResponse<{}>({}, "Customer was deleted.", "", 200);
  }
  deleteGroup = async (body: customerRequestType["DELETE_GROUP"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let isHaveGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.groupId) });
    if (!isHaveGroup) return generateResponse<{}>({}, "No such group could be found.", "", 400);
    await this.repositoryService.customerGroupRepository.delete(body.groupId);
    let updateAllGroupUsers = await this.repositoryService.customerRepository.getModel().updateMany({ userId: body.userId, groupId: body.groupId }, { $set: { groupId: '' } });
    if (!updateAllGroupUsers) 
    {
      this.loggerService.Log(LogType.ERROR, LogLocation.all, "[INTERNAL SERVER ERROR | DELETE CUSTOMER]");
      return generateResponse<{}>({}, "Internal Server Error", "", 500);
    }
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] deleted group => [${body.groupId}]`);
    return generateResponse<{}>({}, "Group Successfully Deleted.", "", 200);
  }

  updateCustomer = async (body: customerRequestType["UPDATE_CUSTOMER"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let found = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId) });
    if (!found) return generateResponse<{}>({}, "There is a customer associated with this number.", "", 404);
    found.phone = body.phone;
    found.name = body.name;
    found.lastName = body.lastName;
    await this.repositoryService.customerRepository.update(found._id as unknown as string, found);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] updated a customer => [${body.customerId}]`);
    return generateResponse<{}>({}, "Successfully updated.", "", 200);
  }
  updateGroup = async (body: customerRequestType["UPDATE_GROUP"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let isHaveGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.group) });
    if (!isHaveGroup) return generateResponse<{}>({}, "No such group could be found.", "", 400);
    isHaveGroup.groupName = body.groupName;
    isHaveGroup.updatedAt = new Date();
    await this.repositoryService.customerGroupRepository.update(body.group, isHaveGroup);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] updated a group => [${body.group}]`);
    return generateResponse<{}>({}, "Successfully Updated.", "", 200);
  }


  addToBlackList = async (body: customerRequestType["ADD_TO_BL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let found = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId), registeredBlackList: false });
    if (!found) return generateResponse<{}>({}, "The Customer could not be found.", "", 404);
    if (found.registeredBlackList) return generateResponse<{}>({}, "The Customer already blacklisted.", "", 400);
    if (found.registeredGrayList)
      found.registeredGrayList = false;
    found.registeredBlackList = true;

    await this.repositoryService.customerRepository.update(found._id as unknown as string, found);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] blacklisted customer [${body.customerId}]. `);
    return generateResponse<{}>({}, "The Customer has been blacklisted.", "", 200);
  }

  addToGrayList = async (body: customerRequestType["ADD_TO_GL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let found = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId), registeredGrayList: false });
    if (!found) return generateResponse<{}>({}, "There is a customer could not be found.", "", 404);
    if (found.registeredGrayList) return generateResponse<{}>({}, "The Customer already graylisted.", "", 400);
    if (found.registeredBlackList)
      found.registeredBlackList = false;
    found.registeredGrayList = true;
    await this.repositoryService.customerRepository.update(found._id as unknown as string, found);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] graylisted customer [${body.customerId}]. `);
    return generateResponse<{}>({}, "The Customer has been graylisted.", "", 200);
  }

  removeFromBlackList = async (body: customerRequestType["REMOVE_FROM_BL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let found = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId), registeredBlackList: true });
    if (!found) return generateResponse<{}>({}, "This customer not in black list.", "", 404);
    found.registeredBlackList = false;
    await this.repositoryService.customerRepository.update(found._id as unknown as string, found);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] remove from blacklist customer [${body.customerId}]. `);
    return generateResponse<{}>({}, "The Customer has been removed black list.", "", 200);
  }

  removeFromGrayList = async (body: customerRequestType["REMOVE_FROM_GL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let found = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId), registeredGrayList: true });
    if (!found) return generateResponse<{}>({}, "This customer not in gray list.", "", 404);
    found.registeredGrayList = false;
    await this.repositoryService.customerRepository.update(found._id as unknown as string, found);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] remove from graylisted customer [${body.customerId}]. `);
    return generateResponse<{}>({}, "The Customer has been removed gray list.", "", 200);
  }

  addToGroup = async (body: customerRequestType["ADD_TO_GR"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);
  
    let foundGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.groupId) });
    if (!foundGroup) return generateResponse<{}>({}, "Such a group could not be found", "", 404);
  
    // body.customers dizisindeki tüm customerId'lar için promise oluştur
    const promises = body.customers.map(async (customerId) => {
      let foundCustomer = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(customerId) });
  
      if (foundCustomer) {
        foundCustomer.groupId = body.groupId;
        foundCustomer.updatedAt = new Date();
        await this.repositoryService.customerRepository.update(customerId, foundCustomer);
        this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] added customer [${customerId}] to a group [${body.groupId}].`);
      } else {
        // Eğer customer bulunamazsa, isteğe bağlı olarak bir işlem yapabilirsiniz.
        this.loggerService.Log(LogType.WARNING, LogLocation.all,`Customer [${customerId}] not found for user [${body.userId}]`);
      }
    });
  
    // Tüm promiselerin tamamlanmasını bekleyin
    await Promise.all(promises);
  
    return generateResponse<{}>({}, "The Customers added to the group.", "", 200);
  }

  removeFromGroup = async (body: customerRequestType["REMOVE_FROM_GR"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let foundCustomer = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId), groupId: body.groupId });
    if (!foundCustomer) return generateResponse<{}>({}, "There is a customer could not be found.", "", 404);
    let foundGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.groupId) });
    if (!foundGroup) return generateResponse<{}>({}, "Such a group could not be found", "", 404);
    foundCustomer.groupId = null;
    foundCustomer.updatedAt = new Date();
    await this.repositoryService.customerRepository.update(body.customerId, foundCustomer);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `User [${body.userId}] removed customer [${body.customerId}] to a group [${body.groupId}].`);
    return generateResponse<{}>({}, "The Customer was removed from group.", "", 200);
  }

  getGroupById = async (body: customerRequestType["GET_GROUP_BY_ID"]): Promise<IResponse<ICustomerGroup> | IResponse<{}>> => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let foundGroup = await this.repositoryService.customerGroupRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.groupId) });
    if (!foundGroup) return generateResponse<{}>({}, "Such a group could not be found", "", 404);
    return generateResponse<ICustomerGroup>(foundGroup, "Success", "", 200);
  }
  getCustomerById = async (body: customerRequestType["GET_CUSTOMER_BY_ID"]): Promise<IResponse<ICustomer> | IResponse<{}>> => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let foundCustomer = await this.repositoryService.customerRepository.findOne({ userId: body.userId, _id: new mongoose.Types.ObjectId(body.customerId) });
    if (!foundCustomer) return generateResponse<{}>({}, "There is a customer could not be found.", "", 404);
    return generateResponse<ICustomerResponse>({
      id: foundCustomer._id.toString(),
      phone: foundCustomer.phone,
      name: foundCustomer.lastName,
      lastName: foundCustomer.lastName,
      groupId: foundCustomer.groupId
    }, "Success", "", 200);
  }


  getCustomers = async (body: customerRequestType["GET_CUSTOMERS"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let paginateData = await this.repositoryService.customerRepository.findMultiple(body.page, body.perPage, { userId: body.userId, registeredBlackList: false, registeredGrayList: false });
    if (!paginateData) return {
      data: [],
      requirement: "",
      status_code: 200,
      message: "Failure",
      meta: {
        page: 0,
        perpage: 0,
        totalPages: 0,
        totalItems: 0,
        links: []
      }
    }
    let totalPage = Math.ceil(paginateData.totalItems / body.perPage)
    let response: IPaginationResponse<ICustomerResponse> = {
      data: paginateData.data.map((item) => ({
        id: item._id.toString(),
        groupId: item.groupId,
        phone: item.phone,
        name: item.name,
        lastName: item.lastName
      })),
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: paginateData.currentPage as number,
        perpage: paginateData.perPage as number,
        totalPages: paginateData.totalPage,
        totalItems: paginateData.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, 'customers', totalPage, body.page, body.perPage)
      }
    }
    return response;
  }
  getBlackLists = async (body: customerRequestType["GET_BL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let paginateData = await this.repositoryService.customerRepository.findMultiple(body.page, body.perPage, { userId: body.userId, registeredBlackList: true });
    if (!paginateData) return {
      data: [],
      requirement: "",
      status_code: 200,
      message: "Failure",
      meta: {
        page: 0,
        perpage: 0,
        totalPages: 0,
        totalItems: 0,
        links: []
      }
    }
    let totalPage = paginateData.data.length === body.perPage ? 1 : Math.ceil(paginateData.data.length / body.perPage)
    let response: IPaginationResponse<ICustomerResponse> = {
      data: paginateData.data.map((item) => ({
        id: item._id.toString(),
        groupId: item.groupId,
        phone: item.phone,
        name: item.name,
        lastName: item.lastName
      })),
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: paginateData.currentPage as number,
        perpage: paginateData.perPage as number,
        totalPages: paginateData.totalPage,
        totalItems: paginateData.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, 'blaclist/customers', totalPage, body.page, body.perPage)
      }
    }
    return response;
  }
  getGrayLists = async (body: customerRequestType["GET_GL"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let paginateData = await this.repositoryService.customerRepository.findMultiple(body.page, body.perPage, { userId: body.userId, registeredGrayList: true });
    if (!paginateData) return {
      data: [],
      requirement: "",
      status_code: 200,
      message: "Failure",
      meta: {
        page: 0,
        perpage: 0,
        totalPages: 0,
        totalItems: 0,
        links: []
      }
    }
    let totalPage = paginateData.data.length === body.perPage ? 1 : Math.ceil(paginateData.data.length / body.perPage)
    let response: IPaginationResponse<ICustomerResponse> = {
      data: paginateData.data.map((item) => ({
        id: item._id.toString(),
        groupId: item.groupId,
        phone: item.phone,
        name: item.name,
        lastName: item.lastName
      })),
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: paginateData.currentPage as number,
        perpage: paginateData.perPage as number,
        totalPages: paginateData.totalPage,
        totalItems: paginateData.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, 'graylist/customers', totalPage, body.page, body.perPage),
      }
    }
    return response;
  }
  getGroups = async (body: customerRequestType["GET_GROUPS"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let paginateData = await this.repositoryService.customerGroupRepository.findMultiple(body.page, body.perPage, { userId: body.userId });
    if (!paginateData) return {
      data: [],
      requirement: "",
      status_code: 200,
      message: "Failure",
      meta: {
        page: 0,
        perpage: 0,
        totalPages: 0,
        totalItems: 0,
        links: []
      }
    }
    let totalPage = paginateData.data.length === body.perPage ? 1 : Math.ceil(paginateData.data.length / body.perPage)
    let response: IPaginationResponse<ICustomerGroup> = {
      data: paginateData.data,
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: paginateData.currentPage as number,
        perpage: paginateData.perPage as number,
        totalPages: paginateData.totalPage,
        totalItems: paginateData.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, 'groups/get', totalPage, body.page, body.perPage)
      }
    }
    return response;
  }
  getGroupCustomers = async (body: customerRequestType["GET_GROUP_CUSTOMERS"]) => {
    let foundUser = await this.repositoryService.userRepository.getById(body.userId);
    if (!foundUser) return generateResponse<{}>({}, "Invalid User", "", 404);

    let paginateData = await this.repositoryService.customerRepository.findMultiple(body.page, body.perPage, { userId: body.userId, groupId: body.groupId, registeredBlackList: false, registeredGrayList: false });
    if (!paginateData) return {
      data: [],
      requirement: "",
      status_code: 200,
      message: "Failure",
      meta: {
        page: 0,
        perpage: 0,
        totalPages: 0,
        totalItems: 0,
        links: []
      }
    }
    let totalPage = paginateData.data.length === body.perPage ? 1 : Math.ceil(paginateData.data.length / body.perPage)
    let response: IPaginationResponse<ICustomerResponse> = {
      data: paginateData.data.map((item) => ({
        id: item._id.toString(),
        groupId: item.groupId,
        phone: item.phone,
        name: item.name,
        lastName: item.lastName
      })),
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: paginateData.currentPage as number,
        perpage: paginateData.perPage as number,
        totalPages: paginateData.totalPage,
        totalItems: paginateData.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, `customers/groups/${body.groupId}`, totalPage, body.page, body.perPage)
      }
    }
    return response;
  }


}

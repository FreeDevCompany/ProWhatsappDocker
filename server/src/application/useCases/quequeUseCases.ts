import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import globalConfig, { fileLimit } from "../../domain/logic/config";
import mongoose from "mongoose";
import { IPaginationResponse, IResponse } from "../../domain/http/baseResponse.types";
import { generateResponse } from "../utilities/responseHelper";
import { IQueque, QUEUE_STATUS } from "../../domain/models/queque.types";
import { LinkHelper } from "../utilities/linkHelper";
import { IQuequeItem } from "../../domain/models/quequeItem.types";
import multer from "multer";
import * as fs from "fs";
import path from "path";
import { FileHelper } from "../utilities/fileHelper";
import { quequeRequestTypes } from "../../domain/http/Requests.types/queque";
import { AnyBulkWriteOperation } from "mongodb";

// eklenen dosyaları listeleme
// dosya silme işlemini yapma
//
@injectable()
export class QuequeUseCases {

  /**
   *
   */
  private repositoryService: RepositoryService;
  private loggerService: LoggerService;
  private storage: any;
  public uploadManager: any;
  private fileInfo: any = null;

  constructor(
    @inject("RepositoryService") repositoryService: RepositoryService,
    @inject(Types.LoggerService) _loggerService: LoggerService) {
    this.repositoryService = repositoryService;
    this.loggerService = _loggerService;
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        if (this.fileInfo && this.fileInfo.id) {
          let quequeId = this.fileInfo.id;
          let filePath = this.fileInfo.path;
          if (!fs.existsSync(filePath))
            fs.mkdirSync(filePath);
          cb(null, filePath);
        }
        else {
          let quequeId = new mongoose.Types.ObjectId();
          let filePath = `${globalConfig.baseOsPath}home/.sandbox/${quequeId.toString()}`;
          this.fileInfo = { path: filePath, id: quequeId };
          if (!fs.existsSync(filePath))
            fs.mkdirSync(filePath);
          cb(null, filePath);
        }

      },
      filename: (req, file, cb) => {
        if (file) {
          cb(null, file.originalname);
        }
      }
    })
    this.uploadManager = multer(
      {
        storage: this.storage,
        limits: fileLimit,
        fileFilter: (req, file, cb) => {
          if (file) {
            if (file.size > fileLimit.fileSize) {
              cb(new Error("File size limit exceeded."));
            } else
              cb(null, true);
          }
        }
      });
  }

  createQueque = async (body: quequeRequestTypes["CREATE_QUEQUE"]): Promise<IResponse<{}>> => {
    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    const quequeFound = await this.repositoryService.quequeRepository.findOne({ quequeTitle: body.quequeTitle });
    if (quequeFound) {
      if (this.fileInfo && this.fileInfo.id) {
        const filePath = `${globalConfig.baseOsPath}home/.sandbox/${this.fileInfo.id}`;
        function deleteFolderRecursive(directoryPath) {
          if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file) => {
              const curPath = path.join(directoryPath, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
              } else {
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(directoryPath);
          }
        }
        deleteFolderRecursive(filePath)

      }
      return generateResponse<{}>({}, "The Queque already created", "", 400)
    };
    let beginTime = await this.repositoryService.automationSettingsRepo.findOne({ userId: body.userId });
    const conflictQueue = await this.repositoryService.quequeRepository.findOne({
      userId: body.userId, sessionId: body.sessionId, startDate: beginTime.beginTime,
      status: { $in: [QUEUE_STATUS.PENDING, QUEUE_STATUS.IN_PROGRESS, QUEUE_STATUS.PAUSED] }
    });
    if (conflictQueue) {
      this.loggerService.Log(
        LogType.WARNING,
        LogLocation.all,
        `[${body.userId}] user try to create queue but it will be conflict other queue, CONFLICTED QUEUE => [${conflictQueue._id.toString()}]`);
      return generateResponse<{}>({}, "You have to choose different time or another whatsapp account for these queue", "", 400);
    }
    if (((body.customers) || (body.groupId))) {

      if (beginTime) {
        let createdQueque = await this.repositoryService.quequeRepository.create({
          _id: this.fileInfo ? this.fileInfo.id : new mongoose.Types.ObjectId(),
          quequeTitle: body.quequeTitle,
          quequeMessage: body.quequeMessage,
          userId: body.userId,
          sessionId: body.sessionId,
          status: QUEUE_STATUS.PENDING,
          startDate: beginTime.beginTime
        })
        let quequeItems: Array<IQuequeItem> = [];
        if (body.groupId) {
          const isHaveGroup = await this.repositoryService.customerGroupRepository.getById(body.groupId);
          if (!isHaveGroup) return;
          const groupUsers = await this.repositoryService.customerRepository.getModel().find({
            userId: body.userId,
            groupId: body.groupId
          });
          groupUsers.map(item => {
            quequeItems.push({
              customerId: item._id as unknown as string,
              quequeId: createdQueque._id as unknown as string,
              spendCredit: false,
            })
          })
        }
        if (body.customers) {
          if (body.customers.length > 0) {
            body.customers.map(item => {
              let data = {
                customerId: item,
                quequeId: createdQueque._id as unknown as string,
                spendCredit: false,
              }
              if (!quequeItems.includes(data))
                quequeItems.push()
            })
          }
        }
        
        const credit = await this.repositoryService.creditRepository.findOne({ userId: body.userId });
        const totalUnspendItems = await this.repositoryService.quequeRepository.getTotalQueueItemCountForNotSpendCredit(body.userId);
        if (credit.totalAmount < (totalUnspendItems + quequeItems.length)) {
          this.loggerService.Log(LogType.WARNING, LogLocation.consoleAndFile, `[${body.userId}] trying to create queue but he/she doesn't have enough credit`);
          return generateResponse<{}>({}, "You don't have enough credit", "BUY_CREDIT", 400);
        }
        await this.repositoryService.quequeItemRepoistory.getModel().insertMany(quequeItems);
        this.loggerService.Log(LogType.INFO, LogLocation.all, `[${body.userId}] => Created New Queque`);
        this.fileInfo = undefined;
        return generateResponse<{}>({}, "The Queque Successfully created", "", 201);
      }
      else {
        return generateResponse<{}>({}, "You must choose begin time of queue", "", 400);
      }

    }
    else {
      if (this.fileInfo && this.fileInfo.id) {
        const filePath = `${globalConfig.baseOsPath}home/.sandbox/${this.fileInfo.id}`;
        this.deleteFolderRecursive(filePath)
      }
      this.loggerService.Log(LogType.WARNING, LogLocation.all, `[${body.userId}] trying to create queue without any customers`);
      return generateResponse<{}>({}, "You can't create queue without choosing a customer", "CHOOSE_CUSTOMER", 400);
    }

  }
  updateQuequeContent = async (body: quequeRequestTypes["UPDATE_QUEQUE_CONTENT"]) => {

    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    const quequeFound = await this.repositoryService.quequeRepository.findOne({ _id: new mongoose.Types.ObjectId(body.quequeId) });
    if (!quequeFound) return generateResponse<{}>({}, "The Queque could not be found.", "", 400);

    if (quequeFound.status === QUEUE_STATUS.IN_PROGRESS || quequeFound.status === QUEUE_STATUS.COMPLETED || quequeFound.status === QUEUE_STATUS.PAUSED)
      return generateResponse<{}>({}, "The queque can't updated. The system sending messages to queque. ", "", 400);
    quequeFound.quequeTitle = body.quequeTitle;
    quequeFound.quequeMessage = body.quequeMessage;
    quequeFound.updatedAt = new Date();
    let updated = await this.repositoryService.quequeRepository.update(body.quequeId, quequeFound);
    this.loggerService.Log(LogType.INFO, LogLocation.all, `[${body.userId}] => Updated  Queque [${body.quequeId}]`);
    return generateResponse<IQueque>(updated, "Successfully updated.", "", 200);

  }

  addCustomerToQueue = async (body: quequeRequestTypes["ADD_CUSTOMER_TO_QUEQUE"]) => {
    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    const quequeFound = await this.repositoryService.quequeRepository.findOne({ _id: new mongoose.Types.ObjectId(body.quequeId), userId: body.userId });
    if (!quequeFound) return generateResponse<{}>({}, "The Queque could not be found.", "", 400);
    if (quequeFound.status === QUEUE_STATUS.COMPLETED || quequeFound.status === QUEUE_STATUS.IN_PROGRESS)
      return generateResponse<{}>({}, "The queque can't updated. The system sending messages to queque or the queue completed. ", "", 400);

    let model = this.repositoryService.quequeItemRepoistory.getModel();
    const updateOperations = body.customers.map(item => ({
      updateOne: {
        filter: { quequeId: body.quequeId, customerId: item },
        update: {
          $set: {
            quequeId: body.quequeId,
            message_status: '',
            spendCredit: false,
          }
        },
        upsert: true
      }
    } as AnyBulkWriteOperation<IQuequeItem>));

    await model.bulkWrite(updateOperations);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] add customer to [${body.quequeId}]`);
    return generateResponse<{}>({}, "Customers added to queue successfully", "", 200);
  }
  removeCustomerFromQueue = async (body: quequeRequestTypes["REMOVE_CUSTOMER_FROM_QUEQUE"]) => {
    const userFound = await this.repositoryService.userRepository.getById(body.user);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    const quequeFound = await this.repositoryService.quequeRepository.findOne({ _id: new mongoose.Types.ObjectId(body.queue), userId: body.user });
    if (!quequeFound) return generateResponse<{}>({}, "The Queque could not be found.", "", 400);
    if (quequeFound.status === QUEUE_STATUS.COMPLETED || quequeFound.status === QUEUE_STATUS.IN_PROGRESS || quequeFound.status === QUEUE_STATUS.PAUSED)
      return generateResponse<{}>({}, "The queque can't updated. The system sending messages to queque or the queue completed. ", "", 400);

    const found = await this.repositoryService.quequeItemRepoistory.findOne({ quequeId: body.queue, customerId: body.customer });
    if (found) {
      await this.repositoryService.quequeItemRepoistory.delete(found._id.toString());
      this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.user}] has been removed customer from [${body.queue}]`);
      return generateResponse<{}>({}, "Customer has been removed from queue successfully", "", 200);
    }
    else {
      return generateResponse<{}>({}, "This customer not found in this queue", "", 404);
    }
  }
  deleteQueque = async (body: quequeRequestTypes["DELETE_QUEQUE"]) => {
    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    const quequeFound = await this.repositoryService.quequeRepository.findOne({ _id: new mongoose.Types.ObjectId(body.quequeId) });
    if (!quequeFound) return generateResponse<{}>({}, "The Queque could not be found.", "", 400);

    if (quequeFound.status !== QUEUE_STATUS.PENDING) return generateResponse<{}>({}, "The queque can't deleted. The system sending messages to queque. ", "", 400);
    this.deleteFolderRecursive(`${globalConfig.baseOsPath}home/.sandbox/${quequeFound._id.toString()}`);
    await this.repositoryService.quequeItemRepoistory.getModel().deleteMany({ quequeId: body.quequeId });
    await this.repositoryService.quequeRepository.delete(body.quequeId);
    this.loggerService.Log(LogType.WARNING, LogLocation.consoleAndFile, `The queue Deleted ${quequeFound._id as unknown as string}`);
    return generateResponse<{}>({}, "The Queque has been deleted!", "", 200);
  }
  getAllQueque = async (body: quequeRequestTypes["GET_ALL_QUEQUE"]) => {

    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);
    let userQueque;
    if (body.state && body.state === 'active') {
      userQueque = await this.repositoryService.quequeRepository.findMultiple(body.page, body.perpage, {
        userId: body.userId,
        status: { $in: [QUEUE_STATUS.IN_PROGRESS, QUEUE_STATUS.PAUSED, QUEUE_STATUS.PENDING] }
      });
    }
    else if (body.state && body.state === 'completed') {
      userQueque = await this.repositoryService.quequeRepository.findMultiple(body.page, body.perpage, {
        userId: body.userId,
        status: { $in: QUEUE_STATUS.COMPLETED }
      });
    }
    else
      userQueque = await this.repositoryService.quequeRepository.findMultiple(body.page, body.perpage, { userId: body.userId });

    if (!userQueque) return {
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
    let response: IPaginationResponse<IQueque> = {
      data: userQueque.data,
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: userQueque.currentPage as number,
        perpage: userQueque.perPage as number,
        totalPages: userQueque.totalPage,
        totalItems: userQueque.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.userId, 'queque/list', userQueque.totalPage, body.page, body.perpage)
      }
    }
    return response;
  }

  getById = async (body: quequeRequestTypes["GET_BY_ID"]) => {

    const userFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!userFound) return generateResponse<{}>({}, "Invalid User", "", 404);

    const singleQueque = await this.repositoryService.quequeRepository.findOne({
      userId: body.userId,
      _id: new mongoose.Types.ObjectId(body.quequeId)
    });
    if (!singleQueque) return generateResponse<{}>({}, "There is no queque.", "", 404);
    const filePath = `${globalConfig.baseOsPath}home/.sandbox/${singleQueque._id.toString()}/`;
    let files;
    if (FileHelper.checkExists(filePath)) {
      files = await FileHelper.getFileNamesInPath(filePath).then((result) => {
        return result;
      }).catch((err) => {
        return [];
      });
    }

    return generateResponse<{
      quequeDetail: IQueque,
      files: []
    }>({
      quequeDetail: singleQueque,
      files: files ? files : []
    }, "Success", "", 200);

  }

  deleteQuequeFile = async (body: quequeRequestTypes["DELETE_FILE"]) => {
    const isQuequeExists = await this.repositoryService.quequeRepository.findOne({
      userId: body.user,
      _id: new mongoose.Types.ObjectId(body.queque)
    });
    if (!isQuequeExists) return generateResponse<{}>({}, "There is no queque", "", 404);
    const filePath = `${globalConfig.baseOsPath}home/.sandbox/${isQuequeExists._id.toString()}/`;
    const isHaveFiles = await FileHelper.getFileNamesInPath(filePath);
    if (isHaveFiles.length == 0) return generateResponse<{}>({}, "There is no files in this queque", "WRONG_OPERATION", 404);
    const matchedFileName = isHaveFiles.some(file => file.file_name === body.file);
    if (!matchedFileName) return generateResponse<{}>({}, "This file does not contain in this queque", "", 404);
    FileHelper.deleteFile(filePath + body.file).
      catch((err) => {
        this.loggerService.Log(LogType.ERROR, LogLocation.consoleAndFile, `INTERNAL SERVER ERROR | FILE DELETE OPERATION`);
        return generateResponse<{}>({}, "File could not be deleted.", "", 500);
      });
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `The queue file [${body.file}] has been deleted...`);
    return generateResponse<{}>({}, "File has been deleted.", "", 200);

  }
  pauseQueue = async (body: quequeRequestTypes["PAUSE_QUEUE"]) => {
    let is_queue_exists = await this.repositoryService.quequeRepository.findOne({
      _id: new mongoose.Types.ObjectId(body.queue),
      userId: body.user
    });
    if (!is_queue_exists)
      return generateResponse<{}>({}, "Queue could not found", "", 404);
    if (is_queue_exists.status !== QUEUE_STATUS.IN_PROGRESS) {
      this.loggerService.Log(
        LogType.WARNING,
        LogLocation.consoleAndFile,
        `[${body.user}] trying to pause this queue but the queue state is [${is_queue_exists.status}]`);
      return generateResponse<{}>({}, "You can't pause this queue", "", 400);
    }
    is_queue_exists.status = QUEUE_STATUS.PAUSED;
    const updatedQueue = await this.repositoryService.quequeRepository.update(body.queue, is_queue_exists);
    if (updatedQueue) {
      this.loggerService.Log(
        LogType.INFO,
        LogLocation.consoleAndFile,
        `Queue => [${body.queue}] has been paused by [${body.user}]`);
      return generateResponse<{}>({}, "The queue has been paused successfully", "", 200);
    }
  }
  startQueueAgain = async (body: quequeRequestTypes["START_QUEUE_AGAIN"]) => {
    let is_queue_exists = await this.repositoryService.quequeRepository.findOne({
      _id: new mongoose.Types.ObjectId(body.queue),
      userId: body.user
    });
    if (!is_queue_exists)
      return generateResponse<{}>({}, "Queue could not found", "", 404);
    if (is_queue_exists.status !== QUEUE_STATUS.PAUSED) {
      this.loggerService.Log(
        LogType.WARNING,
        LogLocation.consoleAndFile,
        `[${body.user}] trying to start this queue again but the queue state is [${is_queue_exists.status}]`);
      return generateResponse<{}>({}, "You can't start this queue", "", 400);
    }
    const conflictQueue = await this.repositoryService.quequeRepository.findOne({
      userId: body.user, startDate: body.startDate,
      status: { $in: [QUEUE_STATUS.PENDING, QUEUE_STATUS.IN_PROGRESS, QUEUE_STATUS.PAUSED] }
    });
    if (conflictQueue) {
      this.loggerService.Log(
        LogType.WARNING,
        LogLocation.all,
        `[${body.user}] user try to activate queue again but it will be conflict other queue, CONFLICTED QUEUE => [${conflictQueue._id.toString()}]`);
      return generateResponse<{}>({}, "You have to choose different time or another whatsapp account for activate this queue", "", 400);
    }
    is_queue_exists.status = QUEUE_STATUS.IN_PROGRESS;
    is_queue_exists.startDate = body.startDate;
    const updatedQueue = await this.repositoryService.quequeRepository.update(body.queue, is_queue_exists);
    if (updatedQueue) {
      this.loggerService.Log(
        LogType.INFO,
        LogLocation.consoleAndFile,
        `Queue => [${body.queue}] has been pending status again by [${body.user}]`);
      return generateResponse<{}>({}, "The queue has been activated successfully.", "", 200);
    }
  }
  getQuequeItems = async (body: quequeRequestTypes["GET_QUEUE_ITEMS"]) => {
    let is_queue_exists = await this.repositoryService.quequeRepository.findOne({
      _id: new mongoose.Types.ObjectId(body.queue),
      userId: body.user
    });
    if (!is_queue_exists)
      return generateResponse<{}>({}, "Queue could not found", "", 404);
    let items = await this.repositoryService.quequeItemRepoistory.findMultiple(
      body.page,
      body.perpage,
      { quequeId: is_queue_exists._id.toString() });
    items.data = await Promise.all(
      items.data.map(async (item) => {
        const customerInfo = await this.repositoryService.customerRepository.findOne({
          _id: new mongoose.Types.ObjectId(item.customerId.toString())
        });

        return {
          ...(item as any)._doc,
          customerInfo: {
            name: customerInfo.name,
            lastName: customerInfo.lastName
            // Diğer customer bilgilerini ekleyebilirsiniz.
          }
        };
      })
    );
    let response: IPaginationResponse<any> = {
      data: items.data,
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: items.currentPage as number,
        perpage: items.perPage as number,
        totalPages: items.totalPage,
        totalItems: items.totalItems,
        links: LinkHelper.GeneratePaginateLink(body.user, `queque/${is_queue_exists._id.toString()}`, items.totalPage, body.page, body.perpage)
      }
    }
    return response;
  }
  deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = path + '/' + file;

        if (fs.lstatSync(curPath).isDirectory()) {
          // Klasörse, tekrar deleteFolderRecursive fonksiyonunu çağırarak içeriğini sil
          this.deleteFolderRecursive(curPath);
        } else {
          // Dosyaysa, sil
          fs.unlinkSync(curPath);
        }
      });

      // Klasörü sil
      fs.rmdirSync(path);
    }
  }

}

import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import mongoose from "mongoose";
import { IPaginationResponse, IResponse } from "../../domain/http/baseResponse.types";
import { generateResponse } from "../utilities/responseHelper";
import { IMessageDraft } from "../../domain/models/messageDrafts.types";
import { LinkHelper } from "../utilities/linkHelper";
import {draftRequestType} from "../../domain/http/Requests.types/draft";
@injectable()
export class DraftUseCases {

    /**
     *
     */
    private repositoryService: RepositoryService;
    private loggerService: LoggerService;
    constructor(
        @inject("RepositoryService") repositoryService: RepositoryService,
        @inject(Types.LoggerService) _loggerService: LoggerService) {
        this.repositoryService = repositoryService;
        this.loggerService = _loggerService;
    }
    createDraft = async (body: draftRequestType["CREATE_DRAFT"]):
        Promise<IResponse<{}>> => {
        const user = await this.repositoryService.userRepository.getById(body.userId);
        if (!user) return generateResponse<{}>({}, "The unknown user.", "", 400);
        const isFound = await this.repositoryService.messageDraftRepository.findOne({
            userId: body.userId, messageTitle: body.title
        });
        if (isFound) return generateResponse<{}>({}, "The Draft Already exists", "", 400);
        const messageBody = await this.repositoryService.messageDraftRepository.create({
            userId: body.userId,
            text: body.text,
            title: body.title,
        });
        
        this.loggerService.Log(LogType.INFO,
            LogLocation.consoleAndFile,
            `[${body.userId}] => has been created draft [${messageBody._id.toString()}]`);

        return generateResponse<{
            messageBody: IMessageDraft,
        }>({
            messageBody: messageBody,
        }, "Successfully Created.", "GET_DRAFT", 201);
    }

   
    deleteDraft = async (body: draftRequestType["DELETE_DRAFT"]): Promise<IResponse<{}>> => {
        const isFoundMessage = await this.repositoryService.messageDraftRepository.findOne({
            _id: new mongoose.Types.ObjectId(body.draftId),
            userId: body.userId
        })
        if (isFoundMessage)
        {
            await this.repositoryService.messageDraftRepository.delete(body.draftId);
            this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] has been deleted a draft => [${isFoundMessage._id.toHexString()}]`);
            return generateResponse<{}>({}, "The Draft has been deleted", "", 200);
        }
        return generateResponse<{}>({}, "Draft could not be found.", "", 404);
    }

    updateDraft = async (body: draftRequestType["UPDATE_DRAFT"]): Promise<IResponse<{}>> => {
        const isFoundMessage = await this.repositoryService.messageDraftRepository.findOne({
            _id: new mongoose.Types.ObjectId(body.draftId),
            userId: body.userId
        })
        if (!isFoundMessage) return generateResponse<{}>({}, "Draft could not found", "", 404);
        isFoundMessage.text = body.message;
        isFoundMessage.title = body.messageTitle;
        const updatedVal = await this.repositoryService.messageDraftRepository.update(isFoundMessage._id as unknown as string, isFoundMessage);
        this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${body.userId}] has been updated a draft => [${isFoundMessage._id.toHexString()}]`);
        return generateResponse<IMessageDraft>(updatedVal, "Draft has been updated.", "GET_ALL_DRAFTS", 200);
    }

    getDraftByID = async (body: draftRequestType["GET_DRAFT_BY_ID"]): Promise<IResponse<{}>> => {
        const isFoundMessage = await this.repositoryService.messageDraftRepository.findOne({userId: body.userId, _id: new mongoose.Types.ObjectId(body.draftId)});
        if(!isFoundMessage) return generateResponse<{}>({},"The Draft could not be found!", "", 400);
        return generateResponse<{
            id: string,
            title: string,
            text: string,
        }>({
            id: isFoundMessage._id as unknown as string,
            title: isFoundMessage.title,
            text: isFoundMessage.text
        }, "Success", "", 200);
    }
    getAllDrafts = async (body: draftRequestType["GET_DRAFTS"]): Promise<IPaginationResponse<{}>> => {
        const paginateData = await this.repositoryService.messageDraftRepository.findMultiple(body.page, body.perPage, {
            userId: body.userId
        });
        if (!paginateData) return {
            data: [],
            requirement: "",
            status_code: 200,
            message: "Failure",
            meta: {
                page: 0,
                perpage: 0,
                totalItems: 0,
                totalPages: 0,
                links: []
            }
        }
        let response: IPaginationResponse<{
            id: string,
            title: string,
        }> = {
            data: paginateData.data.map((item) => ({ id: item._id as unknown as string, title: item.title })),
            requirement: "",
            status_code: 200,
            message: "Success",
            meta: {
                page: paginateData.currentPage as number,
                perpage: paginateData.perPage as number,
                totalPages: paginateData.totalPage,
                totalItems: paginateData.totalItems,
                links: LinkHelper.GeneratePaginateLink(body.userId, `drafts/list`, paginateData.totalPage, body.page, body.perPage)
            }
        }
        return response;
    }
}
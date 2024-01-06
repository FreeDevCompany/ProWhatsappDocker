import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { DraftUseCases } from "../useCases/draftsUseCases";
import { ErrorHandler } from "../utilities/errorHandler";
import { Request, Response } from "express";

@injectable()
export class DraftController {
    private draftUseCases: DraftUseCases;

    constructor(
        @inject(Types.DraftUseCases) _service: DraftUseCases
    ) {

        this.draftUseCases = _service;

    }

    CreateDraft = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
        const userId: string = req.params.user;
        const text: string = req.body.text;
        const title: string = req.body.title;
        const response = await this.draftUseCases.createDraft({userId, text, title});
        return res.status(response.status_code as unknown as number).send(response);
    })

    DeleteDraft =  ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
        const draftId: string = req.params.draft;
        const userId: string = req.params.user;
        const response = await this.draftUseCases.deleteDraft({userId, draftId});
        return res.status(response.status_code as unknown as number).send(response);
    })
    UpdateDraft =  ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
        const draftId: string = req.params.draft;
        const userId: string = req.params.user;
        const messageTitle: string = req.body.title;
        const message: string = req.body.message;
        const response = await this.draftUseCases.updateDraft({userId, draftId, messageTitle, message});
        return res.status(response.status_code as unknown as number).send(response);
    })
    GetDraftById = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
        const draftId: string = req.params.draft;
        const userId: string = req.params.user;
        const response = await this.draftUseCases.getDraftByID({userId, draftId});
        return res.status(response.status_code as unknown as number).send(response);
    })
    GetDraftAll = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
        const userId: string = req.params.user;
        let page = req.query.page as unknown as number;
        let perPage = req.query.perpage as unknown as number;
        const response = await this.draftUseCases.getAllDrafts({userId, page, perPage});
        return res.status(response.status_code as unknown as number).send(response);
    })
}
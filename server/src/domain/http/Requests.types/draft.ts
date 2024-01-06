
interface ICreateDraftReq
{
    userId: string;
    text: string;
    title: string;
}
interface IDeleteDraftReq {
    userId: string;
    draftId: string;
}

interface IUpdateDraftReq {
    userId: string;
    draftId: string;
    messageTitle: string;
    message: string;
}

interface IGetDraftByIdReq {
    userId: string;
    draftId: string;
}
interface IGetAllDraftsReq {
    userId: string;
    page:number;
    perPage: number;
}


export type draftRequestType = {
    CREATE_DRAFT: ICreateDraftReq;
    DELETE_DRAFT: IDeleteDraftReq
    UPDATE_DRAFT: IUpdateDraftReq;
    GET_DRAFT_BY_ID: IGetDraftByIdReq;
    GET_DRAFTS: IGetAllDraftsReq;
}
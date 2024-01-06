
interface ICreateQuequeReq {
    userId: string;
    quequeTitle: string;
    quequeMessage: string;
    customers?: Array<string>;
    groupId?: string;
    sessionId: string;
}

interface IUpdateQuequeContentReq {
    userId: string;
    quequeId: string;
    quequeTitle: string;
    quequeMessage: string;
}

interface IAddCustomerToQueque {
    userId: string;
    quequeId: string;
    customers?: Array<string>;
}

interface IDeleteQuequeReq {
    userId: string;
    quequeId: string;
}
interface IGetAllQueque {
    userId: string;
    page: number;
    perpage: number;
    state: string;
}

interface IGetQuequeByID {
    userId: string;
    quequeId: string;
}

interface IDeleteFile {
  file: string;
  user: string;
  queque: string;
}

interface IPauseQueue {
    user: string;
    queue: string;
}
interface IStartQueueAgain {
    user: string;
    queue: string;
    startDate: Date;
}
interface IGetQueueItems {
    user: string,
    queue: string,
    page: number,
    perpage: number,
}
interface IAddQuequeCustomer {
    user: string;
    queue: string;
    customers: Array<{customer: string, operation: 'add' | 'delete'}>
}
interface IRemoveFromQueue {
    user: string;
    queue: string;
    customer: string;
}
export type quequeRequestTypes = {
    CREATE_QUEQUE: ICreateQuequeReq;
    UPDATE_QUEQUE_CONTENT: IUpdateQuequeContentReq;
    DELETE_QUEQUE: IDeleteQuequeReq;
    GET_ALL_QUEQUE: IGetAllQueque;
    GET_BY_ID: IGetQuequeByID;
    ADD_CUSTOMER_TO_QUEQUE: IAddCustomerToQueque;
    REMOVE_CUSTOMER_FROM_QUEQUE: IRemoveFromQueue;
    DELETE_FILE: IDeleteFile;
    PAUSE_QUEUE: IPauseQueue;
    START_QUEUE_AGAIN: IStartQueueAgain;
    GET_QUEUE_ITEMS: IGetQueueItems;
};

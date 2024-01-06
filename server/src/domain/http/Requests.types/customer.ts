
interface ICreateGroupRequest {
    userId: string;
    groupName: string;
}

interface IAddNewCustomerRequest {
    userId: string;
    name: string;
    lastName: string;
    phone: string;
}
interface IDeleteCustomerRequest {
    userId: string;
    customerId: string;
}
interface IDeleteGroupRequest {
    userId: string;
    groupId: string;
}
interface IUpdateCustomerRequest {
    userId: string;
    customerId: string;
    name: string;
    lastName: string;
    phone: string;
}
interface IUpdateGroupRequest {
    userId: string;
    group: string;
    groupName: string;
}
interface IAddBlackListRequest {
    userId: string;
    customerId: string;
}
interface IAddToGrayListRequest {
    userId: string;
    customerId: string;
}
interface IAddToGroupReq {
    userId: string;
    customers: Array<string>;
    groupId: string;
}
interface IRemoveFromBlackListReq {
    userId: string;
    customerId: string;
}
interface IRemoveFromGrayListReq {
    userId:string;
    customerId: string;
}

interface IRemoveFromGroupReq {
    userId: string;
    customerId: string;
    groupId: string;
}

interface IGetGroupByIdReq {
    userId: string;
    groupId: string;
}
interface IGetCustomerByIdReq {
    userId: string;
    customerId: string;
}

interface IGetCustomersReq {
    userId: string;
    page: number;
    perPage: number;
}
interface IGetBLReq {
    userId: string;
    page: number;
    perPage: number;
}
interface IGetGLReq {
    userId: string;
    page: number;
    perPage: number;
}

interface IGetGroupsReq {
    userId: string;
    page: number;
    perPage: number;
}

interface IGetGroupCustomersReq {
    userId: string;
    groupId: string;
    page: number;
    perPage: number;
}
interface IAddMultipleCustomer {
    userId: string;
    customers: Array<{name: string, lastName: string, phone: string}>;
}
export type customerRequestType = {
    CREATE_GROUP: ICreateGroupRequest;
    ADD_CUSTOMER: IAddNewCustomerRequest;
    ADD_MULTIPLE_CUSTOMER: IAddMultipleCustomer;
    DELETE_CUSTOMER: IDeleteCustomerRequest;
    DELETE_GROUP: IDeleteGroupRequest;
    UPDATE_CUSTOMER: IUpdateCustomerRequest;
    UPDATE_GROUP: IUpdateGroupRequest;
    ADD_TO_BL: IAddBlackListRequest;
    ADD_TO_GR: IAddToGroupReq;
    ADD_TO_GL: IAddToGrayListRequest;
    REMOVE_FROM_BL: IRemoveFromBlackListReq;
    REMOVE_FROM_GL: IRemoveFromGrayListReq;
    REMOVE_FROM_GR: IRemoveFromGroupReq;
    GET_GROUP_BY_ID: IGetGroupByIdReq;
    GET_CUSTOMER_BY_ID: IGetCustomerByIdReq;
    GET_CUSTOMERS: IGetCustomersReq;
    GET_BL: IGetBLReq;
    GET_GL: IGetGLReq;
    GET_GROUPS: IGetGroupsReq;
    GET_GROUP_CUSTOMERS: IGetGroupCustomersReq;

}



interface IGetUserDetailsRequest {
  token: string;
}
interface IUpdateUserDetailsRequest {
  avatar: string;
  firstName: string;
  lastName: string;
}

interface IUpdateAutomationSettingsRequest {
  beginTime: Date,
  min_message_delay: number,
  max_message_delay: number,
}

interface IGetAutomationSettings {
  id: string;

}

interface IGetActiveSessions {
  id: string;
  page: number;
  perpage: number;
}
interface IDeleteSession {
  user: string;
  session: string;
  password: string;
}
export type profileRequestTypes = {
  GET_USER_DETAIL: IGetUserDetailsRequest;
  UPDATE_DETAIL: IUpdateUserDetailsRequest;
  UPDATE_AUTOMATION_SETTINGS: IUpdateAutomationSettingsRequest;
  GET_AUTOMATION_SETTINGS: IGetAutomationSettings;
  GET_ACTIVE_SESSIONS: IGetActiveSessions;
  DELETE_SESSION: IDeleteSession;
}

interface ISignUpRequest {
  avatar: string,
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface ILoginRequest {
  user_agent: string;
  email: string;
  password: string;
}
interface IResetSessionLoginRequest {
  id: string;
  user_agent: string;
}

interface IResetPasswordRequest {
  id: string,
  currentPassword: string;
  newPassword: string;
}

interface IVerifyEmailReuqest {
  userId: string;
  email_hash: string;
}

interface IForgotPasswordGetLinkRequest {
  email: string;
  user_agent: string;
}

interface IForgotPasswordConfirmRequest {
  token: string;
  password: string;
  user_agent: string;
}

interface IUpdateProfileRequest {
  avatar: string;
  firstName: string;
  lastName: string;
}
interface ILogoutRequest {
  token: string;
}

interface IFreezeAccount {
  user: string;
  password: string;
}

interface IReactivateAccount {
  user: string;
}

interface IDeleteAccount {
  user: string;
  password: string;
}
interface IReactivateAccountConfirm {
  user: string;
  code: string;
}
export type userRequestTypes = {
  REGISTER: ISignUpRequest,
  VERIFY_EMAIL: IVerifyEmailReuqest,
  LOGIN: ILoginRequest,
  RESET_PASSWORD: IResetPasswordRequest,
  FORGOT_PASSWORD_LINK: IForgotPasswordGetLinkRequest,
  FORGOT_PASSWORD_CONFIRM: IForgotPasswordConfirmRequest,
  UPDATE_PROFILE: IUpdateProfileRequest,
  RESET_SESSION_LOGIN: IResetSessionLoginRequest
  LOGOUT: ILogoutRequest
  FREEZE_ACCOUNT: IFreezeAccount,
  REACTIVATE_ACCOUNT: IReactivateAccount,
  DELETE_ACCOUNT: IDeleteAccount
  REACTIVATE_ACCOUNT_CONFIRM: IReactivateAccountConfirm
}

interface ISignUpRequest {
    avatar: Buffer,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;

}

interface ILoginRequest {
    email: string;
    password: string;
}

interface IResetPasswordRequest {
    id: string,
    currentPassword: string;
    newPassword: string;
}

interface IVerifyEmailReuqest {
    email_hash: string;
}

interface IForgotPasswordGetLinkRequest {
    email: string;
}

interface IForgotPasswordConfirmRequest {
    password: string;
}

interface IUpdateProfileRequest {
    avatar: string;
    firstName: string;
    lastName: string;
}

export type userRequestTypes = {
    signUp: ISignUpRequest,
    verifyEmail: IVerifyEmailReuqest,
    login: ILoginRequest,
    resetPassword: IResetPasswordRequest,
    forgotPasswordLink: IForgotPasswordGetLinkRequest,
    forgotPasswordConfirm: IForgotPasswordConfirmRequest,
    updateProfile: IUpdateProfileRequest
}
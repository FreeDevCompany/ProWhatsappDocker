import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { AuthenticationUseCases } from "../useCases/authenticationUseCases";
import {  Request, Response } from "express";
import { userRequestTypes } from "../../domain/http/Requests.types/user";

@injectable()
export class AuthController {

    private useCaseService: AuthenticationUseCases;
    constructor(@inject(Types.UserUseCases) _service: AuthenticationUseCases) {
        this.useCaseService = _service;
    }

    public SignUp = async (req: Request<{}, {}, userRequestTypes['signUp']>, res: Response) => {
        let signUpBody = req.body as userRequestTypes['signUp'];
        let response = await this.useCaseService.createUser(signUpBody);
        // email kayıtlı kullanıcı hata mesajı
        // telefon kayıtlı kullanıcı hata mesajı
        // kaydedildi. success mesajı (e mail verification) (next step)
        res.status(response.status_code as number).send(response);
    }
    public VerifyEmail = async (req: Request, res: Response) => {
        const { userId } = req.params;
        let response = await this.useCaseService.verifyEmail(userId);
        res.status(response.status_code as unknown as number).send(response);
    }

    public Login = async (req: Request<{ }, {}, userRequestTypes['login']>, res: Response) => {
        const device_id = req.headers['x-device-id'] as string;
        const { email, password } = req.body;
        let response = await this.useCaseService.Login(device_id, email, password);
        res.status(response.status_code as unknown as number).send(response);
    }

    public ResetPassword = async (req: Request<{}, {}, userRequestTypes['resetPassword']>, res: Response) => {
        const { id, currentPassword, newPassword } = req.body;
        let response = await this.useCaseService.resetPassword(id, currentPassword, newPassword);
        res.status(response.status_code as number).send(response);
    }

    public ForgotPasswordLink = async (req: Request<{}, {}, userRequestTypes['forgotPasswordLink']>, res: Response) => {
        const { email } = req.body;
        let response = await this.useCaseService.getForgotPasswordLink(email);
        res.status(response.status_code as number).send(response);
    }

    public ForgotPasswordConfirm = async (req: Request<{ userId: string, deviceId: string }, {}, userRequestTypes['forgotPasswordConfirm']>, res: Response) => {
        const { userId, deviceId } = req.params;
        const password = req.body.password;
        let response = await this.useCaseService.getForgotPasswordConfirm(userId, password);
        res.status(response.status_code as number).send(response);
    }


    public OtpVerification = async (req: Request, res: Response) => {
    }



}

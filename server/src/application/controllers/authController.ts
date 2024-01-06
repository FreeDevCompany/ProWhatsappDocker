import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { AuthenticationUseCases } from "../useCases/authenticationUseCases"
import { Request, Response } from "express";
import { userRequestTypes } from "../../domain/http/Requests.types/user";
import { ErrorHandler } from "../utilities/errorHandler";

@injectable()
export class AuthController {

  private useCaseService: AuthenticationUseCases;
  constructor(
    @inject(Types.UserUseCases) _service: AuthenticationUseCases) {
    this.useCaseService = _service;
  }

  /**
   * This method register operation for the user who wants to use this otomation applciation
   * This method called from register endpoint and the methods want to specific data from the new user.
   * @param avatar: string
   * @param firstName: string
   * @param lastName: string
   * @param email: string
   * @param password: string
   * @param phone: string
   * @param areaCode: string (not integrated == feature)
   * 
   */
  public SignUp = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['REGISTER']>, res: Response) => {
    let signUpBody = req.body as userRequestTypes['REGISTER'];
    let response = await this.useCaseService.registerUser(signUpBody);
    return res.status(response.status_code as number).json(response);
  })
  public VerifyEmail = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const email_hash = decodeURIComponent(req.query.hash as string);
    let response = await this.useCaseService.verifyEmail({ userId: id, email_hash });
    return res.status(response.status_code as unknown as number).json(response);
  })

  public Login = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['LOGIN']>, res: Response) => {
    const user_agent = req.headers['user-agent'] as string;
    const { email, password } = req.body;
    let response = await this.useCaseService.Login({ user_agent: user_agent, email: email, password: password });
    return res.status(response.status_code as unknown as number).json(response);
  })
  public Logout = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['LOGOUT']>, res: Response) => {
    const token = req.headers['x-token'] as string;
    let response = await this.useCaseService.logOut({ token });
    return res.status(response.status_code as unknown as number).json(response);
  })

  public ResetSessionAndLogin = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['RESET_SESSION_LOGIN']>, res: Response) => {
    const user_agent = req.headers['user-agent'] as string;
    const { id } = req.body;
    let response = await this.useCaseService.resetSessionAndLogin({ id, user_agent });
    return res.status(response.status_code as unknown as number).json(response);
  })
  public ResetPassword = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['RESET_PASSWORD']>, res: Response) => {
    const { id, currentPassword, newPassword } = req.body;
    let response = await this.useCaseService.resetPassword({ id, currentPassword, newPassword });
    return res.status(response.status_code as number).json(response);
  })

  public ForgotPasswordLink = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{}, {}, userRequestTypes['FORGOT_PASSWORD_LINK']>, res: Response) => {
    const { email } = req.body;
    const user_agent = req.headers['user-agent'] as string;
    let response = await this.useCaseService.getForgotPasswordLink({ email, user_agent });
    return res.status(response.status_code as number).json(response);
  })

  public ForgotPasswordConfirm = ErrorHandler.UnhandledExceptionHanlder(async (req: Request<{ token: string }, {}, userRequestTypes['FORGOT_PASSWORD_CONFIRM']>, res: Response) => {
    const token = decodeURIComponent(req.params.token as string)
    const password = req.body.password;
    const user_agent = req.headers['user-agent'] as string;
    let response = await this.useCaseService.getForgotPasswordConfirm({ token, password, user_agent });
    return res.status(response.status_code as number).json(response);
  })
  public OtpVerification = async (req: Request, res: Response) => {
    return null;
  }

  public FreezeAccount = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let user = req.params.user;
    let password = req.body.password;
    const response = await this.useCaseService.freezeAccount({ user: user, password: password });
    return res.status(response.status_code as unknown as number).send(response);
  })

  public ReactivateAccount = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let user = req.params.user;
    const response = await this.useCaseService.reactivateAccountLink({ user });
    return res.status(response.status_code as unknown as number).send(response);
  })
  public ReactivateAccountConfirm = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let user = req.params.user;
    let code = req.params.code;
    const response = await this.useCaseService.reactivateAccountConfirm({ user: user, code: code });
    return res.status(response.status_code as unknown as number).send(response);
  })
  public DeleteAccount = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let user = req.params.user;
    let password = req.body.password;
    const response = await this.useCaseService.deleteAccount({ user:user, password: password });
    return res.status(response.status_code as unknown as number).send(response);
  })


}

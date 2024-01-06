import { inject, injectable } from "inversify";
import { ProfileUseCases } from "../useCases/profileUseCases";
import { Types } from "../../domain/models/ioc.types";
import { Request, Response } from "express";
import { ErrorHandler } from "../utilities/errorHandler";

@injectable()
export class ProfileController {
  private profileUseCaseService: ProfileUseCases;

  constructor(@inject(Types.profileUseCases) _service: ProfileUseCases) {
    this.profileUseCaseService = _service;
  }

  getUserDetails = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let token = req.headers['x-token'] as string;
    let response = await this.profileUseCaseService.getUserDetails({
      token: (token && token.split(' ')[1])
    });
    return res.status(response.status_code as unknown as number).json(response);

  });


  updateUserDetails = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let id = req.params.user as string;
    let response = await this.profileUseCaseService.updateUserDetails(id, req.body);
    return res.status(response.status_code as number).json(response);
  })
  getActiveSessions = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let id = req.params.user as string;
    let { perpage, page } = req.query;
    let response = await this.profileUseCaseService.getActiveSessions({ id: id, page: page as unknown as number, perpage: perpage as unknown as number });
    return res.status(response.status_code as number).json(response);
  })
  getAutomationSettings = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let id = req.params.user as string;
    let response = await this.profileUseCaseService.getAutomationSettings({ id });
    return res.status(response.status_code as number).json(response);
  })

  updateAutomationSettings = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let id = req.params.user as string;
    let body = req.body;
    let response = await this.profileUseCaseService.updateAutomationSettings(id, body);
    return res.status(response.status_code as number).json(response);
  })

  deleteSession = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    let { user } = req.params;
    let { session, password } = req.body;
    const response = await this.profileUseCaseService.deleteSession({ user: user, session: session, password: password });
    return res.status(response.status_code as number).json(response);
  })

}

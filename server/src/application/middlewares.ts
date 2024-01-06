import { NextFunction, Request, Response } from "express";
import { jwtHandler } from "../infrastructure/services/jwtHandler.class";
import { inject, injectable } from "inversify";
import { Types } from "./../domain/models/ioc.types";
import { LogLocation, LogType, LoggerService } from "../infrastructure/services/loggerService.class";
import { ICacheService } from "../domain/logic/cacheManager.types.";
import { CacheService } from "../infrastructure/cacheManagement/redisService";
import { HashHelper } from "./utilities/hashHelper";
import { RepositoryService } from "../infrastructure/services/repositoryService.class";
import { generateResponse } from "./utilities/responseHelper";
import { IResponse } from "../domain/http/baseResponse.types";


@injectable()
export class Middleware {

  private loggerService: LoggerService
  private cacheService: ICacheService<{ token: string }>
  private repositoryService: RepositoryService;
  constructor(
    @inject(Types.LoggerService) loggerServ: LoggerService,
    @inject("ICacheService") cacheService: CacheService<{ token: string }>,
    @inject("RepositoryService") repoService: RepositoryService) {
    this.loggerService = loggerServ;
    this.cacheService = cacheService;
    this.repositoryService = repoService;
  }
  verifySession = async (req: Request, res: Response, next: NextFunction) => {
    //todo: refactor verify session middleware
    try {
      const authHeader = req.headers['x-token'] as string;
      const user_agent = req.headers['user-agent'] as string;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        throw new Error("Unauthorized");
      }

      const decodedToken: any = jwtHandler.verifyToken(token);
      if (!decodedToken) {
        throw new Error("Unauthorized");
      }

      const cacheToken = await this.cacheService.getCacheItem(decodedToken.id);
      const statement = await HashHelper.compare(user_agent, decodedToken.deviceId);
      if (cacheToken.token === token && statement) {
        next(); // Doğrulama başarılı, sonraki middleware'e geçin
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      res.status(401).json({
        data: {},
        message: "Unauthorized",
        requirement: "LOGIN_REQUIRED",
        status_code: 401
      });
    }
  }

  verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['x-token'] as string;
    if (!token) {
      // unauthorized
      res.status(401).send({
        data: {},
        message: "Unauthorized",
        requirement: "LOGIN_REQUIRED",
        status_code: 401
      })
    }

    try {
      const decodedToken = jwtHandler.verifyToken(token);
      if (decodedToken) {
        next();
      }
      else
        res.status(401).send({ data: {}, message: "Unauthorized", requirement: "LOGIN_REQUIRED", status_code: 401 });
    }
    catch (err) {
      res.status(401).send({
        data: {},
        message: "Unauthorized",
        requirement: "LOGIN_REQUIRED",
        status_code: 401
      })
    }

  }
  isFrozenAccount = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.params.user;
    const user = await this.repositoryService.userRepository.getById(userId);
    let response: IResponse<{}>;
    if (!user) {
      response = generateResponse<{}>({}, "Invlid User", "", 404);
      res.status(response.status_code as unknown as number).send(response);
    }
    else {
      if (user.frozenAccount && user.frozenAccount === true) {

        response = generateResponse<{}>({}, "Frozen Account", "", 401);
        res.status(response.status_code as unknown as number).send(response);
        this.loggerService.Log(LogType.WARNING, LogLocation.consoleAndFile,
          `[${userId}] try to requesting server. But this account is the frozen account`
        )
      }
      else
        next();
    }
  }
}
export class GateWayMiddleware {
  static verifyGateWay = (req: Request, res: Response, next: NextFunction) => {
    let gateWay = req.headers['x-api-gateway'];
    if (!gateWay && process.env.GATEWAY_SECRET_KEY !== gateWay)
      res.status(500).json({
        data: {},
        message: "Invalid API Key. Unknown client.",
        requirement: "",
        status_code: 403
      });
    else
      next();
  }
}

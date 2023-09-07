import { NextFunction, Request, Response } from "express";
import { jwtHandler } from "../infrastructure/services/jwtHandler.class";
import { inject, injectable } from "inversify";
import { Types } from "./../domain/models/ioc.types";
import { UserRepository } from "../infrastructure/repositories/userRepository.class";
import { LoggerService } from "../infrastructure/services/loggerService.class";

@injectable()
export class Middleware {

    private userRepository: UserRepository
    private loggerService: LoggerService
    constructor(
        @inject(Types.IRepository) userRepo: UserRepository,
        @inject(Types.LoggerService) loggerServ: LoggerService) {
        this.userRepository = userRepo;
        this.loggerService = loggerServ;
    }
    verifySession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers['x-token'] as string;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token)
                res.status(401).send({
                    data: {},
                    message: "Unauthorized",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 401
                })
            let foundUser = await this.userRepository.findUserWithToken(token);
            if (!foundUser) {
                res.status(401).send({
                    data: {},
                    message: "Unauthorized",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 401
                })
            }
            else {
                let currentDate = new Date()
                if (currentDate > foundUser.activeSession.expireDate)
                    res.status(401).send({
                        data: {},
                        message: "Your session has expired. Please login again.",
                        requirement: "LOGIN_REQURIRED",
                        status_code: 401,
                    })
            }
            next();
        }
        catch (error) {
            res.status(500).send({
                data: {},
                message: "INTERNAL SERVER ERROR",
                requirement: "",
                staus_code: 500
            })
        }
    }

    verifyToken = (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers['x-token'] as string;
        if (!token)
        {
            // unauthorized
        }

        jwtHandler.verifyToken(token);
    }
}
export class GateWayMiddleware {
    static verifyGateWay = (req: Request, res: Response, next: NextFunction) => {
        let gateWay = req.headers['x-api-gateway'];
        if (!gateWay && process.env.GATEWAY_SECRET_KEY !== gateWay)
            throw new Error()
        next();
    }
}
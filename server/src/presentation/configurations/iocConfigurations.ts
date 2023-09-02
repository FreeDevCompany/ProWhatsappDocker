import { Container } from "inversify";
import { DbContext } from "../../infrastructure/repositories/dbContext.class";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { IUserDto, userSchema } from "../../domain/models/user.types";
import { IRepository } from "../../domain/repositories/repository.types";
import { UserRepository } from "../../infrastructure/repositories/userRepository.class";
import { AuthenticationUseCases } from "../../application/useCases/authenticationUseCases";
import { AuthController } from "../../application/controllers/authController";
import { AuthRouter } from "../routers/authRouter";
import { Router } from "express";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { Middleware } from "../../application/middlewares";
import { LoggerService } from "../../infrastructure/services/loggerService.class";
import { FileLogger, DbLogger, ConsoleLogger } from "../../infrastructure/logManagement/logger";
import { ILogger } from "../../domain/logger/logger";
import 'reflect-metadata';
export class BuildGateway {

    static BuildAuthRoute(container: Container): Router
    {
        container.bind<IDbContext<IUserDto>>(Types.IDbContext).toDynamicValue((context) => {
            const tableName = "User";
            let ct = new DbContext(tableName, userSchema);
            ct.InitializeConfiguration(tableName, userSchema);
            return ct;
        })
        container.bind<IRepository<IUserDto>>(Types.IRepository).to(UserRepository)
        container.bind<AuthenticationUseCases>(Types.UserUseCases).to(AuthenticationUseCases);
        container.bind<AuthController>(Types.UserController).to(AuthController);
        container.bind<AuthRouter>(Types.AuthRouter).to(AuthRouter);
        container.bind<Middleware>(Types.Middleware).to(Middleware);
        container.bind<ValidationBuilder>(Types.ValidationBuilder).to(ValidationBuilder);
        const authRouter = container.resolve<AuthRouter>(AuthRouter);
        authRouter.matchControllerToRouter()
        return authRouter.getRouterProvider();
    }
    
    static BuildLogger(container: Container)
    {
        container.bind<ILogger>(Types.ILogger).to(FileLogger).whenTargetNamed('fileLogger');
        container.bind<ILogger>(Types.ILogger).to(DbLogger).whenTargetNamed('dbLogger');
        container.bind<ILogger>(Types.ILogger).to(ConsoleLogger).whenTargetNamed('consoleLogger');
        container.bind<LoggerService>(Types.LoggerService).to(LoggerService);
    }
    static BuildAdminRoute(container: Container): Router
    {
        return null;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildGateway = void 0;
const dbContext_class_1 = require("../../infrastructure/repositories/dbContext.class");
const ioc_types_1 = require("../../domain/models/ioc.types");
const user_types_1 = require("../../domain/models/user.types");
const userRepository_class_1 = require("../../infrastructure/repositories/userRepository.class");
const authenticationUseCases_1 = require("../../application/useCases/authenticationUseCases");
const authController_1 = require("../../application/controllers/authController");
const authRouter_1 = require("../routers/authRouter");
const validationBuilder_1 = require("../../infrastructure/services/validationBuilder");
const middlewares_1 = require("../../application/middlewares");
require("reflect-metadata");
const logger_1 = require("../../infrastructure/logManagement/logger");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const redisService_1 = require("../../infrastructure/cacheManagement/redisService");
const profileUseCases_1 = require("../../application/useCases/profileUseCases");
const profileController_1 = require("../../application/controllers/profileController");
const profileRouter_1 = require("../routers/profileRouter");
class BuildGateway {
    static BuildAuthRoute(container) {
        container.bind(ioc_types_1.Types.UserUseCases).to(authenticationUseCases_1.AuthenticationUseCases);
        container.bind(ioc_types_1.Types.UserController).to(authController_1.AuthController);
        container.bind(ioc_types_1.Types.AuthRouter).to(authRouter_1.AuthRouter);
        const authRouter = container.resolve(authRouter_1.AuthRouter);
        authRouter.matchControllerToRouter();
        return authRouter.getRouterProvider();
    }
    static BuildServices(container) {
        container.bind(ioc_types_1.Types.ValidationBuilder).to(validationBuilder_1.ValidationBuilder);
        container.bind(ioc_types_1.Types.Middleware).to(middlewares_1.Middleware);
    }
    static BuildProfileRoute(container) {
        container.bind(ioc_types_1.Types.profileUseCases).to(profileUseCases_1.ProfileUseCases);
        container.bind(ioc_types_1.Types.profileController).to(profileController_1.ProfileController);
        container.bind("ProfileRouter").to(profileRouter_1.ProfileRouter);
        const profileRouter = container.resolve(profileRouter_1.ProfileRouter);
        profileRouter.matchControllerToRouter();
        return profileRouter.getRouterProvider();
    }
    static BuildRepositories(container) {
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue((context) => {
            const tableName = "User";
            let ct = new dbContext_class_1.DbContext(tableName, user_types_1.userSchema);
            ct.InitializeConfiguration(tableName, user_types_1.userSchema);
            return ct;
        });
        container.bind(ioc_types_1.Types.IRepository).to(userRepository_class_1.UserRepository);
        container.bind("ICacheService").to((redisService_1.CacheService));
    }
    static BuildLogger(container) {
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.ConsoleLogger).whenTargetNamed("consoleLogger");
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.FileLogger).whenTargetNamed("fileLogger");
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.DbLogger).whenTargetNamed("dbLogger");
        container.bind(ioc_types_1.Types.LoggerService).to(loggerService_class_1.LoggerService);
    }
    static BuildAdminRoute(container) {
        return null;
    }
}
exports.BuildGateway = BuildGateway;
//# sourceMappingURL=iocConfigurations.js.map
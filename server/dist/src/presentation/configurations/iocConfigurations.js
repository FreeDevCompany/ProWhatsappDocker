"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayBuilder = void 0;
require("reflect-metadata");
const dbContext_class_1 = require("../../infrastructure/repositories/dbContext.class");
const ioc_types_1 = require("../../domain/models/ioc.types");
const user_types_1 = require("../../domain/models/user.types");
const userRepository_class_1 = require("../../infrastructure/repositories/userRepository.class");
const authenticationUseCases_1 = require("../../application/useCases/authenticationUseCases");
const authController_1 = require("../../application/controllers/authController");
const authRouter_1 = require("../routers/authRouter");
const validationBuilder_1 = require("../../infrastructure/services/validationBuilder");
const middlewares_1 = require("../../application/middlewares");
const logger_1 = require("../../infrastructure/logManagement/logger");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const redisService_1 = require("../../infrastructure/cacheManagement/redisService");
const profileUseCases_1 = require("../../application/useCases/profileUseCases");
const profileController_1 = require("../../application/controllers/profileController");
const profileRouter_1 = require("../routers/profileRouter");
const roles_types_1 = require("../../domain/models/roles.types");
const roles_class_1 = require("../../infrastructure/repositories/roles.class");
const autoMationSettings_types_1 = require("../../domain/models/autoMationSettings.types");
const automationSettings_class_1 = require("../../infrastructure/repositories/automationSettings.class");
const extraNumbers_types_1 = require("../../domain/models/extraNumbers.types");
const extraPhoneNumbers_class_1 = require("../../infrastructure/repositories/extraPhoneNumbers.class");
const repositoryService_class_1 = require("../../infrastructure/services/repositoryService.class");
const credits_types_1 = require("../../domain/models/credits.types");
const credits_class_1 = require("../../infrastructure/repositories/credits.class");
const customers_types_1 = require("../../domain/models/customers.types");
const customer_class_1 = require("../../infrastructure/repositories/customer.class");
const customerGroup_types_1 = require("../../domain/models/customerGroup.types");
const customerGroup_class_1 = require("../../infrastructure/repositories/customerGroup.class");
const customerUseCases_1 = require("../../application/useCases/customerUseCases");
const customerController_1 = require("../../application/controllers/customerController");
const customerRouter_1 = require("../routers/customerRouter");
const mediaDrafts_types_1 = require("../../domain/models/mediaDrafts.types");
const mediaDrafts_class_1 = require("../../infrastructure/repositories/mediaDrafts.class");
const messageDrafts_types_1 = require("../../domain/models/messageDrafts.types");
const messageDraft_class_1 = require("../../infrastructure/repositories/messageDraft.class");
const draftsUseCases_1 = require("../../application/useCases/draftsUseCases");
const draftController_1 = require("../../application/controllers/draftController");
const draftRouter_1 = require("../routers/draftRouter");
const queque_types_1 = require("../../domain/models/queque.types");
const queque_class_1 = require("../../infrastructure/repositories/queque.class");
const quequeUseCases_1 = require("../../application/useCases/quequeUseCases");
const quequeController_1 = require("../../application/controllers/quequeController");
const quequeRouter_1 = require("../routers/quequeRouter");
const quequeItem_types_1 = require("../../domain/models/quequeItem.types");
const quequeItem_class_1 = require("../../infrastructure/repositories/quequeItem.class");
const WebSocketController_1 = require("../../application/controllers/WebSocketController");
const whatsappService_1 = require("../../infrastructure/services/whatsappService");
const creditTransaction_types_1 = require("../../domain/models/creditTransaction.types");
const creditTransaction_class_1 = require("../../infrastructure/repositories/creditTransaction.class");
class GatewayBuilder {
    static BuildAuthRoute(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Authentication Route service....");
        container.bind(ioc_types_1.Types.UserUseCases).to(authenticationUseCases_1.AuthenticationUseCases);
        container.bind(ioc_types_1.Types.UserController).to(authController_1.AuthController);
        container.bind(ioc_types_1.Types.AuthRouter).to(authRouter_1.AuthRouter);
        const authRouter = container.resolve(authRouter_1.AuthRouter);
        authRouter.matchControllerToRouter();
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Authentication Service Successfully Build...");
        return authRouter.getRouterProvider();
    }
    static BuildCustomerRoute(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Customer Route service....");
        container.bind(ioc_types_1.Types.CustomerUseCases).to(customerUseCases_1.CustomerUseCases);
        container.bind(ioc_types_1.Types.CustomerController).to(customerController_1.CustomerController);
        container.bind("CustomerRouter").to(customerRouter_1.CustomerRouter);
        const customerRouter = container.resolve(customerRouter_1.CustomerRouter);
        customerRouter.matchControllerToRouter();
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Customer Route Service Successfully Build...");
        return customerRouter.getRouterProvider();
    }
    static BuildDraftRoutes(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Draft Route service....");
        container.bind(ioc_types_1.Types.DraftUseCases).to(draftsUseCases_1.DraftUseCases);
        container.bind(ioc_types_1.Types.DraftController).to(draftController_1.DraftController);
        container.bind("DraftRouter").to(draftRouter_1.DraftRouter);
        const router = container.resolve(draftRouter_1.DraftRouter);
        router.matchControllerToRouter();
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Draft Route Service Successfully Build...");
        return router.getRouterProvider();
    }
    static BuildQuequeRoutes(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Queue Route service....");
        container.bind(ioc_types_1.Types.QuequeUseCases).to(quequeUseCases_1.QuequeUseCases);
        container.bind(ioc_types_1.Types.QuequeController).to(quequeController_1.QuequeController);
        container.bind("QuequeRouter").to(quequeRouter_1.QuequeRouter);
        const router = container.resolve(quequeRouter_1.QuequeRouter);
        router.matchControllerToRouter();
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Queue Service Successfully Build...");
        return router.getRouterProvider();
    }
    static BuildServices(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building External Services....");
        container.bind(ioc_types_1.Types.ValidationBuilder).to(validationBuilder_1.ValidationBuilder);
        container.bind("RepositoryService").to(repositoryService_class_1.RepositoryService);
        container.bind(ioc_types_1.Types.Middleware).to(middlewares_1.Middleware);
        container.bind("ICacheService").to((redisService_1.CacheService));
        container.bind(ioc_types_1.Types.WhatsappService).to(whatsappService_1.WhatsappService);
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "External Services Successfully Build...");
    }
    static BuildSocketServer(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Socket Services....");
        container.bind(ioc_types_1.Types.WebSocketController).to(WebSocketController_1.WebSocketController);
        const socketController = container.resolve(WebSocketController_1.WebSocketController);
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Socket Services Successfully Build...");
        return socketController;
    }
    static BuildProfileRoute(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Profile Route Services....");
        container.bind(ioc_types_1.Types.profileUseCases).to(profileUseCases_1.ProfileUseCases);
        container.bind(ioc_types_1.Types.profileController).to(profileController_1.ProfileController);
        container.bind("ProfileRouter").to(profileRouter_1.ProfileRouter);
        const profileRouter = container.resolve(profileRouter_1.ProfileRouter);
        profileRouter.matchControllerToRouter();
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Profile Route Service Successfully Build...");
        return profileRouter.getRouterProvider();
    }
    static BuildRepositories(container, logger) {
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Building Repositories Services....");
        // user repo
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            let db = new dbContext_class_1.DbContext("User", user_types_1.userSchema);
            return db;
        }).whenTargetNamed("userDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("Role", roles_types_1.roleSchema);
        }).whenTargetNamed("rolesDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("ExtraPhoneNumber", extraNumbers_types_1.extraNumberSchema);
        }).whenTargetNamed("extraPhoneDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("AutomationSettings", autoMationSettings_types_1.automationSettingsSchema);
        }).whenTargetNamed("automationDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("Credit", credits_types_1.creditSchema);
        }).whenTargetNamed("creditDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("Customer", customers_types_1.customerSchema);
        }).whenTargetNamed("customerDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("CustomerGroup", customerGroup_types_1.customerGroupSchema);
        }).whenTargetNamed("customerGroupDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("MediaDrafts", mediaDrafts_types_1.mediaSchema);
        }).whenTargetNamed("mediaDraftDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("MessageDrafts", messageDrafts_types_1.messageSchema);
        }).whenTargetNamed("messageDraftDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("Queques", queque_types_1.quequeSchema);
        }).whenTargetNamed("quequeDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("QuequeItems", quequeItem_types_1.quequeItemSchema);
        }).whenTargetNamed("quequeItemDbContext");
        container.bind(ioc_types_1.Types.IDbContext).toDynamicValue(ctx => {
            return new dbContext_class_1.DbContext("CreditTransactions", creditTransaction_types_1.creditTransactionSchema);
        }).whenTargetNamed("creditTransactionsDbContext");
        container.bind(ioc_types_1.Types.IRepository).to(userRepository_class_1.UserRepository).whenTargetNamed("userRepository");
        container.bind(ioc_types_1.Types.IRepository).to(roles_class_1.RoleRepository).whenTargetNamed("roleRepository");
        container.bind(ioc_types_1.Types.IRepository).to(extraPhoneNumbers_class_1.ExtraPhoneNumbersRepository).whenTargetNamed("extraPhoneRepo");
        container.bind(ioc_types_1.Types.IRepository).to(automationSettings_class_1.AutomationSettingsRepository).whenTargetNamed("automationSettingsRepo");
        container.bind(ioc_types_1.Types.IRepository).to(credits_class_1.CreditsRepository).whenTargetNamed("creditRepository");
        container.bind(ioc_types_1.Types.IRepository).to(customer_class_1.CustomerRepository).whenTargetNamed("customerRepository");
        container.bind(ioc_types_1.Types.IRepository).to(customerGroup_class_1.CustomerGroupRepository).whenTargetNamed("customerGroupRepository");
        container.bind(ioc_types_1.Types.IRepository).to(mediaDrafts_class_1.MediaDraftRepository).whenTargetNamed("mediaDraftRepository");
        container.bind(ioc_types_1.Types.IRepository).to(messageDraft_class_1.MessageDraftRepository).whenTargetNamed("messageDraftRepository");
        container.bind(ioc_types_1.Types.IRepository).to(queque_class_1.QuequeRepository).whenTargetNamed("quequeRepository");
        container.bind(ioc_types_1.Types.IRepository).to(quequeItem_class_1.QuequeItemRepository).whenTargetNamed("quequeItemRepository");
        container.bind(ioc_types_1.Types.IRepository).to(creditTransaction_class_1.CreditTransactionsRepository).whenTargetNamed("creditTransactionRepository");
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Repositories Service Successfully Build...");
    }
    static BuildLogger(container) {
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.ConsoleLogger).whenTargetNamed("consoleLogger");
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.FileLogger).whenTargetNamed("fileLogger");
        container.bind(ioc_types_1.Types.ILogger).to(logger_1.DbLogger).whenTargetNamed("dbLogger");
        container.bind(ioc_types_1.Types.LoggerService).to(loggerService_class_1.LoggerService);
        const logger = container.get(ioc_types_1.Types.LoggerService);
        logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, "Logger Service Successfully Build...");
        return logger;
    }
    static BuildAdminRoute(container) {
        return null;
    }
}
exports.GatewayBuilder = GatewayBuilder;
//# sourceMappingURL=iocConfigurations.js.map
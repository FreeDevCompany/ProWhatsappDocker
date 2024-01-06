import 'reflect-metadata';
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
import { ConsoleLogger, DbLogger, FileLogger } from "../../infrastructure/logManagement/logger";
import { ILogger } from "../../domain/logger/logger";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { CacheService } from "../../infrastructure/cacheManagement/redisService";
import { ICacheService } from "../../domain/logic/cacheManager.types.";
import { ProfileUseCases } from "../../application/useCases/profileUseCases";
import { ProfileController } from "../../application/controllers/profileController";
import { ProfileRouter } from "../routers/profileRouter";
import { IRole, roleSchema } from "../../domain/models/roles.types";
import { RoleRepository } from "../../infrastructure/repositories/roles.class";
import { IAutomationSettings, automationSettingsSchema } from "../../domain/models/autoMationSettings.types";
import { AutomationSettingsRepository } from "../../infrastructure/repositories/automationSettings.class";
import { IExtraNumber, extraNumberSchema } from "../../domain/models/extraNumbers.types";
import { ExtraPhoneNumbersRepository } from "../../infrastructure/repositories/extraPhoneNumbers.class";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import { ICredit, creditSchema } from '../../domain/models/credits.types';
import { CreditsRepository } from '../../infrastructure/repositories/credits.class';
import { ICustomer } from '../../domain/models/customers.types';
import { customerSchema } from '../../domain/models/customers.types';
import { CustomerRepository } from '../../infrastructure/repositories/customer.class';
import { ICustomerGroup, customerGroupSchema } from '../../domain/models/customerGroup.types';
import { CustomerGroupRepository } from '../../infrastructure/repositories/customerGroup.class';
import { CustomerUseCases } from '../../application/useCases/customerUseCases';
import { CustomerController } from '../../application/controllers/customerController';
import { CustomerRouter } from '../routers/customerRouter';
import { IMediaDraft, mediaSchema } from '../../domain/models/mediaDrafts.types';
import { MediaDraftRepository } from '../../infrastructure/repositories/mediaDrafts.class';
import { messageSchema, IMessageDraft } from '../../domain/models/messageDrafts.types';
import { MessageDraftRepository } from '../../infrastructure/repositories/messageDraft.class';
import { DraftUseCases } from '../../application/useCases/draftsUseCases';
import { DraftController } from '../../application/controllers/draftController';
import { DraftRouter } from '../routers/draftRouter';
import { IQueque, quequeSchema } from '../../domain/models/queque.types';
import { QuequeRepository } from '../../infrastructure/repositories/queque.class';
import { QuequeUseCases } from '../../application/useCases/quequeUseCases';
import { QuequeController } from '../../application/controllers/quequeController';
import { QuequeRouter } from '../routers/quequeRouter';
import { IQuequeItem } from '../../domain/models/quequeItem.types';
import { quequeItemSchema } from '../../domain/models/quequeItem.types';
import { QuequeItemRepository } from '../../infrastructure/repositories/quequeItem.class';
import { WebSocketController } from '../../application/controllers/WebSocketController';
import { WhatsappService } from "../../infrastructure/services/whatsappService";
import { ICreditTransaction, creditTransactionSchema } from '../../domain/models/creditTransaction.types';
import { CreditTransactionsRepository } from '../../infrastructure/repositories/creditTransaction.class';

export class GatewayBuilder {

  static BuildAuthRoute(container: Container, logger: LoggerService): Router {
    logger.Log(LogType.INFO, LogLocation.console, "Building Authentication Route service....")
    container.bind<AuthenticationUseCases>(Types.UserUseCases).to(AuthenticationUseCases);
    container.bind<AuthController>(Types.UserController).to(AuthController);
    container.bind<AuthRouter>(Types.AuthRouter).to(AuthRouter);
    const authRouter = container.resolve<AuthRouter>(AuthRouter);
    authRouter.matchControllerToRouter()
    logger.Log(LogType.INFO, LogLocation.console, "Authentication Service Successfully Build...")
    return authRouter.getRouterProvider();
  }

  static BuildCustomerRoute(container: Container, logger: LoggerService): Router {
    logger.Log(LogType.INFO, LogLocation.console, "Building Customer Route service....")
    container.bind<CustomerUseCases>(Types.CustomerUseCases).to(CustomerUseCases);
    container.bind<CustomerController>(Types.CustomerController).to(CustomerController);
    container.bind<CustomerRouter>("CustomerRouter").to(CustomerRouter);
    const customerRouter = container.resolve<CustomerRouter>(CustomerRouter);
    customerRouter.matchControllerToRouter()
    logger.Log(LogType.INFO, LogLocation.console, "Customer Route Service Successfully Build...")

    return customerRouter.getRouterProvider();
  }

  static BuildDraftRoutes(container: Container, logger: LoggerService): Router {
    logger.Log(LogType.INFO, LogLocation.console, "Building Draft Route service....")
    container.bind<DraftUseCases>(Types.DraftUseCases).to(DraftUseCases);
    container.bind<DraftController>(Types.DraftController).to(DraftController);
    container.bind<DraftRouter>("DraftRouter").to(DraftRouter);
    const router = container.resolve<DraftRouter>(DraftRouter);
    router.matchControllerToRouter();
    logger.Log(LogType.INFO, LogLocation.console, "Draft Route Service Successfully Build...")
    return router.getRouterProvider();
  }

  static BuildQuequeRoutes(container: Container, logger: LoggerService): Router {
    logger.Log(LogType.INFO, LogLocation.console, "Building Queue Route service....")
    container.bind<QuequeUseCases>(Types.QuequeUseCases).to(QuequeUseCases);
    container.bind<QuequeController>(Types.QuequeController).to(QuequeController);
    container.bind<QuequeRouter>("QuequeRouter").to(QuequeRouter);
    const router = container.resolve<QuequeRouter>(QuequeRouter);
    router.matchControllerToRouter();
    logger.Log(LogType.INFO, LogLocation.console, "Queue Service Successfully Build...")
    return router.getRouterProvider();
  }

  static BuildServices(container: Container, logger: LoggerService) {
    logger.Log(LogType.INFO, LogLocation.console, "Building External Services....")
    container.bind<ValidationBuilder>(Types.ValidationBuilder).to(ValidationBuilder);
    container.bind<RepositoryService>("RepositoryService").to(RepositoryService);
    container.bind<Middleware>(Types.Middleware).to(Middleware);
    container.bind<ICacheService<{ token: string }>>("ICacheService").to(CacheService<{ token: string }>);
    container.bind<WhatsappService>(Types.WhatsappService).to(WhatsappService);
    logger.Log(LogType.INFO, LogLocation.console, "External Services Successfully Build...")
  }

  static BuildSocketServer(container: Container, logger: LoggerService) {
    logger.Log(LogType.INFO, LogLocation.console, "Building Socket Services....")
    container.bind<WebSocketController>(Types.WebSocketController).to(WebSocketController);
    const socketController = container.resolve<WebSocketController>(WebSocketController);
    logger.Log(LogType.INFO, LogLocation.console, "Socket Services Successfully Build...")
    return socketController;
  }

  static BuildProfileRoute(container: Container, logger: LoggerService): Router {
    logger.Log(LogType.INFO, LogLocation.console, "Building Profile Route Services....")
    container.bind<ProfileUseCases>(Types.profileUseCases).to(ProfileUseCases);
    container.bind<ProfileController>(Types.profileController).to(ProfileController);
    container.bind<ProfileRouter>("ProfileRouter").to(ProfileRouter);
    const profileRouter = container.resolve<ProfileRouter>(ProfileRouter);
    profileRouter.matchControllerToRouter()
    logger.Log(LogType.INFO, LogLocation.console, "Profile Route Service Successfully Build...")
    return profileRouter.getRouterProvider();
  }

  static BuildRepositories(container: Container, logger: LoggerService) {
    logger.Log(LogType.INFO, LogLocation.console, "Building Repositories Services....")
    // user repo
    container.bind<IDbContext<IUserDto>>(Types.IDbContext).toDynamicValue(ctx => {
      let db = new DbContext<IUserDto>("User", userSchema);
      return db;
    }).whenTargetNamed("userDbContext");
    container.bind<IDbContext<IRole>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IRole>("Role", roleSchema);
    }).whenTargetNamed("rolesDbContext");
    container.bind<IDbContext<IExtraNumber>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IExtraNumber>("ExtraPhoneNumber", extraNumberSchema);
    }).whenTargetNamed("extraPhoneDbContext");
    container.bind<IDbContext<IAutomationSettings>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IAutomationSettings>("AutomationSettings", automationSettingsSchema);
    }).whenTargetNamed("automationDbContext");
    container.bind<IDbContext<ICredit>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<ICredit>("Credit", creditSchema);
    }).whenTargetNamed("creditDbContext");

    container.bind<IDbContext<ICustomer>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<ICustomer>("Customer", customerSchema);
    }).whenTargetNamed("customerDbContext");
    container.bind<IDbContext<ICustomer>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<ICustomer>("CustomerGroup", customerGroupSchema);
    }).whenTargetNamed("customerGroupDbContext");
    container.bind<IDbContext<IMediaDraft>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IMediaDraft>("MediaDrafts", mediaSchema);
    }).whenTargetNamed("mediaDraftDbContext");

    container.bind<IDbContext<IMessageDraft>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IMessageDraft>("MessageDrafts", messageSchema);
    }).whenTargetNamed("messageDraftDbContext");

    container.bind<IDbContext<IQueque>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IQueque>("Queques", quequeSchema);
    }).whenTargetNamed("quequeDbContext");

    container.bind<IDbContext<IQuequeItem>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<IQuequeItem>("QuequeItems", quequeItemSchema);
    }).whenTargetNamed("quequeItemDbContext");

    container.bind<IDbContext<ICreditTransaction>>(Types.IDbContext).toDynamicValue(ctx => {
      return new DbContext<ICreditTransaction>("CreditTransactions", creditTransactionSchema);
    }).whenTargetNamed("creditTransactionsDbContext");

    container.bind<IRepository<IUserDto>>(Types.IRepository).to(UserRepository).whenTargetNamed("userRepository");
    container.bind<IRepository<IRole>>(Types.IRepository).to(RoleRepository).whenTargetNamed("roleRepository");
    container.bind<IRepository<IExtraNumber>>(Types.IRepository).to(ExtraPhoneNumbersRepository).whenTargetNamed("extraPhoneRepo");
    container.bind<IRepository<IAutomationSettings>>(Types.IRepository).to(AutomationSettingsRepository).whenTargetNamed("automationSettingsRepo");
    container.bind<IRepository<ICredit>>(Types.IRepository).to(CreditsRepository).whenTargetNamed("creditRepository");
    container.bind<IRepository<ICustomer>>(Types.IRepository).to(CustomerRepository).whenTargetNamed("customerRepository");
    container.bind<IRepository<ICustomerGroup>>(Types.IRepository).to(CustomerGroupRepository).whenTargetNamed("customerGroupRepository");
    container.bind<IRepository<IMediaDraft>>(Types.IRepository).to(MediaDraftRepository).whenTargetNamed("mediaDraftRepository");
    container.bind<IRepository<IMessageDraft>>(Types.IRepository).to(MessageDraftRepository).whenTargetNamed("messageDraftRepository");
    container.bind<IRepository<IQueque>>(Types.IRepository).to(QuequeRepository).whenTargetNamed("quequeRepository");
    container.bind<IRepository<IQuequeItem>>(Types.IRepository).to(QuequeItemRepository).whenTargetNamed("quequeItemRepository");
    container.bind<IRepository<ICreditTransaction>>(Types.IRepository).to(CreditTransactionsRepository).whenTargetNamed("creditTransactionRepository");
    logger.Log(LogType.INFO, LogLocation.console, "Repositories Service Successfully Build...")
  }

  static BuildLogger(container: Container) {
    container.bind<ILogger>(Types.ILogger).to(ConsoleLogger).whenTargetNamed("consoleLogger");
    container.bind<ILogger>(Types.ILogger).to(FileLogger).whenTargetNamed("fileLogger");
    container.bind<ILogger>(Types.ILogger).to(DbLogger).whenTargetNamed("dbLogger");
    container.bind<LoggerService>(Types.LoggerService).to(LoggerService);
    const logger = container.get<LoggerService>(Types.LoggerService);
    logger.Log(LogType.INFO, LogLocation.console, "Logger Service Successfully Build...")
    return logger;
  }

  static BuildAdminRoute(container: Container): Router {
    return null;
  }
}

import 'reflect-metadata';
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/userRepository.class";
import { RoleRepository } from "../repositories/roles.class";
import { ExtraPhoneNumbersRepository } from "../repositories/extraPhoneNumbers.class";
import { AutomationSettingsRepository } from "../repositories/automationSettings.class";
import { Types } from "../../domain/models/ioc.types";
import { CreditsRepository } from '../repositories/credits.class';
import { CustomerRepository } from '../repositories/customer.class';
import { CustomerGroupRepository } from '../repositories/customerGroup.class';
import { MediaDraftRepository } from '../repositories/mediaDrafts.class';
import { MessageDraftRepository } from '../repositories/messageDraft.class';
import { QuequeRepository } from '../repositories/queque.class';
import { QuequeItemRepository } from '../repositories/quequeItem.class';
import { CreditTransactionsRepository } from '../repositories/creditTransaction.class';
@injectable()
export class RepositoryService {
    userRepository: UserRepository;
    roleRepository: RoleRepository;
    extraPhoneRepo: ExtraPhoneNumbersRepository;
    automationSettingsRepo: AutomationSettingsRepository;
    creditRepository: CreditsRepository;
    customerRepository: CustomerRepository;
    customerGroupRepository: CustomerGroupRepository;
    mediaDraftRepository: MediaDraftRepository;
    messageDraftRepository: MessageDraftRepository
    quequeRepository: QuequeRepository;
    quequeItemRepoistory: QuequeItemRepository
    creditTransactionRepository: CreditTransactionsRepository
    constructor(
        @inject(Types.IRepository) @named("userRepository") userRepository: UserRepository,
        @inject(Types.IRepository) @named("roleRepository") roleRepository: RoleRepository,
        @inject(Types.IRepository) @named("extraPhoneRepo") extraPhoneRepo: ExtraPhoneNumbersRepository,
        @inject(Types.IRepository) @named("automationSettingsRepo") automationSettingsRepo: AutomationSettingsRepository,
        @inject(Types.IRepository) @named("creditRepository") creditRepository: CreditsRepository,
        @inject(Types.IRepository) @named("customerRepository") customerRepository: CustomerRepository,
        @inject(Types.IRepository) @named("customerGroupRepository") customerGroupRepository: CustomerGroupRepository,
        @inject(Types.IRepository) @named("mediaDraftRepository") mediaDraftRepository: MediaDraftRepository,
        @inject(Types.IRepository) @named("messageDraftRepository") messageDraftRepository: MessageDraftRepository,
        @inject(Types.IRepository) @named("quequeRepository") quequeRepository: QuequeRepository,
        @inject(Types.IRepository) @named("quequeItemRepository") quequeItemRepository: QuequeItemRepository,
        @inject(Types.IRepository) @named("creditTransactionRepository") creditTransactionRepository: CreditTransactionsRepository
        ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.extraPhoneRepo = extraPhoneRepo;
        this.automationSettingsRepo = automationSettingsRepo;
        this.creditRepository = creditRepository;
        this.customerRepository = customerRepository;
        this.customerGroupRepository = customerGroupRepository;
        this.mediaDraftRepository = mediaDraftRepository;
        this.messageDraftRepository = messageDraftRepository;
        this.quequeRepository = quequeRepository;
        this.quequeItemRepoistory = quequeItemRepository;
        this.creditTransactionRepository = creditTransactionRepository;
    }
}
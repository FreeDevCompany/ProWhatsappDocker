import { inject, injectable } from "inversify";
import { QuequeUseCases } from "../useCases/quequeUseCases";
import { Types } from "../../domain/models/ioc.types";
import { ErrorHandler } from "../utilities/errorHandler";
import { Request, Response } from "express";

@injectable()
export class QuequeController {
  public quequeUseCases: QuequeUseCases;

  constructor(@inject(Types.QuequeUseCases) _servie: QuequeUseCases) {
    this.quequeUseCases = _servie;
  }

  CreateQueque = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
   try{
    const userId: string = req.params.user;
    const { title, message, sessionId, customers, groupId }: { title: string, message: string, sessionId: string, customers: [string], groupId?: string } = req.body;
    const response = await this.quequeUseCases.createQueque({ userId: userId, quequeTitle: title, quequeMessage: message, sessionId: sessionId, customers: customers, groupId: groupId });
    return res.status(response.status_code as unknown as number).send(response);
   }
   catch(err)
   {
    console.log(err);
   }
  });

  UpdateQuequeContent = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const userId: string = req.params.user;
    const quequeId: string = req.params.queque;
    const title: string = req.body.title;
    const message: string = req.body.message;
    const response = await this.quequeUseCases.updateQuequeContent({ userId, quequeId, quequeTitle: title, quequeMessage: message });
    return res.status(response.status_code as unknown as number).send(response);
  });

  DeleteQueque = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queque = req.params.queque;
    const response = await this.quequeUseCases.deleteQueque({ userId: user, quequeId: queque });
    return res.status(response.status_code as unknown as number).send(response);
  });
  GetAllQueque = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const userId: string = req.params.user;
    const page = req.query.page;
    const perpage = req.query.perpage;
    const state = req.query.state;
    const response = await this.quequeUseCases.getAllQueque({ userId: userId, page: page as unknown as number, perpage: perpage as unknown as number, state: state as string });
    return res.status(response.status_code as unknown as number).send(response);
  });

  GetById = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queque = req.params.queque;
    const response = await this.quequeUseCases.getById({ userId: user, quequeId: queque });
    return res.status(response.status_code as unknown as number).send(response);
  });

  DeleteQuequeFile = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queque = req.params.queque;
    const file = req.body.file;
    const response = await this.quequeUseCases.deleteQuequeFile({ user: user, queque: queque, file: file });
    return res.status(response.status_code as unknown as number).send(response);
  })
  PauseQueue = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queue;
    const response = await this.quequeUseCases.pauseQueue({user: user, queue: queue});
    return res.status(response.status_code as number).send(response);
  }) 
  StartQueueAgain = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queue;
    const startDate = req.body.startDate;
    const response = await this.quequeUseCases.startQueueAgain({user: user, queue: queue, startDate: startDate});
    return res.status(response.status_code as number).send(response);
  })
  GetQueueItems = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queque;
    const data = req.query;
    const response = await this.quequeUseCases.getQuequeItems({
      user: user,
      queue: queue,
      page: data.page as unknown as number,
      perpage: data.perpage as unknown as number,
    });
    return res.status(response.status_code as number).send(response);
  })
  AddCustomersToQueue = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queue;
    const {customers} = req.body;
    const response = await this.quequeUseCases.addCustomerToQueue({
      quequeId: queue,
      userId: user,
      customers: customers
    })
    return res.status(response.status_code as number).send(response);
  })
  RemoveCustomerFromQueue = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queque;
    const {customer} = req.body;
    const response = await this.quequeUseCases.removeCustomerFromQueue({
      customer: customer,
      queue: queue,
      user: user
    });
    return res.status(response.status_code as number).send(response);
  })
  deleteQueueFile = ErrorHandler.UnhandledExceptionHanlder(async (req: Request, res: Response) => {
    const user = req.params.user;
    const queue = req.params.queque;
    const data = req.body;
    const response = await this.quequeUseCases.deleteQuequeFile({
      file: data.file,
      queque: queue,
      user: user
    });
    return res.status(response.status_code as number).send(response);
  })
}


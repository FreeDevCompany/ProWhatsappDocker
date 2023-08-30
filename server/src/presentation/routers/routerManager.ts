import { Router } from "express";
import IRouterManager from "../../domain/http/router.types";

class RouterManager implements IRouterManager
{
    routers: Record<string, Router>;
    registerRouter = (name: string, router: Router): void => {
        this.routers[name] = router;
    }

    getRouter = (name: string): Router | undefined => {
        return this.routers[name] ? this.routers[name] : undefined;
    }

}
let routerManager: RouterManager = SingletonFactory.createInstance<RouterManager>(RouterManager);
export {routerManager};
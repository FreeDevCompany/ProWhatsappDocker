import { Router } from "express";

interface IRouterManager {
    routers: Record<string, Router>;
    registerRouter: (name: string, router: Router) => void;
    getRouter: (name: string) => Router | undefined;
}
export default IRouterManager;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonFactory = void 0;
class SingletonFactory {
    static createInstance(constructor) {
        return new constructor();
    }
}
exports.SingletonFactory = SingletonFactory;
//# sourceMappingURL=singleton.type.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashHelper = void 0;
const argon2_1 = __importDefault(require("argon2"));
class HashHelper {
}
exports.HashHelper = HashHelper;
_a = HashHelper;
HashHelper.encrypt = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield argon2_1.default.hash(password);
});
HashHelper.compare = (sendedPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield argon2_1.default.verify(hashedPassword, sendedPassword);
});
//# sourceMappingURL=hashHelper.js.map
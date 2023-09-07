"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = void 0;
const generateResponse = (data, message, requirement, status_code) => {
    const response = {
        data: data,
        message: message,
        requirement: requirement,
        status_code: status_code
    };
    return response;
};
exports.generateResponse = generateResponse;
//# sourceMappingURL=responseHelper.js.map
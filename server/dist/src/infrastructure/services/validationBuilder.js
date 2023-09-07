"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationBuilder = void 0;
const inversify_1 = require("inversify");
let ValidationBuilder = class ValidationBuilder {
    constructor() {
        this.validator = {};
    }
    addHeader(headerSchema) {
        this.validator.headers = headerSchema;
    }
    addBody(bodySchema) {
        this.validator.body = bodySchema;
    }
    addQuery(querySchema) {
        this.validator.query = querySchema;
    }
    addParams(paramsSchema) {
        this.validator.params = paramsSchema;
    }
    build(headers, body, query, params) {
        this.validator = {};
        this.addHeader(headers);
        this.addBody(body);
        this.addParams(params);
        this.addQuery(query);
        let tempValidation = this.validator;
        return (req, res, next) => {
            const { headers, body, params, query } = tempValidation;
            if (headers) {
                let result = headers.validate(req.headers);
                if (result.error)
                    res.status(400).send({ message: "Invalid headers", details: result.error.details });
            }
            else if (body) {
                let result = body.validate(req.body);
                if (result.error)
                    res.status(400).send({ message: "Invalid body", details: result.error.details });
            }
            else if (query) {
                let result = query.validate(req.query);
                if (result.error)
                    res.status(400).send({ message: "Invalid query", details: result.error.details });
            }
            else if (params) {
                let result = params.validate(req.params);
                if (result.error)
                    res.status(400).send({ message: "Invalid params", details: result.error.details });
            }
            else {
                next();
            }
        };
    }
};
exports.ValidationBuilder = ValidationBuilder;
exports.ValidationBuilder = ValidationBuilder = __decorate([
    (0, inversify_1.injectable)()
], ValidationBuilder);
//# sourceMappingURL=validationBuilder.js.map
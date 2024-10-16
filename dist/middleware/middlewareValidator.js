"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareValidator = void 0;
const express_validator_1 = require("express-validator");
exports.middlewareValidator = [
    (0, express_validator_1.query)('page').optional().isNumeric().withMessage('Page debe ser un número.'),
    (0, express_validator_1.query)('limit').optional().isNumeric().withMessage('Limit debe ser un número.'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array().map(error => ({
                    msg: error.msg,
                })),
            });
        }
        else {
            next();
        }
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        }
        catch (err) {
            console.error("Error occurred in controller:", err);
            next(err);
        }
    };
};
exports.default = catchAsync;

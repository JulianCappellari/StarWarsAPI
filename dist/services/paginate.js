"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = async (model, filter, page, limit) => {
    try {
        const data = await model.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await model.countDocuments(filter);
        return { data, total };
    }
    catch (error) {
        throw new Error(`Error paginating results: ${error.message}`);
    }
};
exports.paginate = paginate;

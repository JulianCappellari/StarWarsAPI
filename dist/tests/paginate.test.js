"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginate_1 = require("../services/paginate");
describe('paginate', () => {
    let mockModel;
    beforeEach(() => {
        mockModel = {
            find: jest.fn(),
            countDocuments: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return paginated data and total count', async () => {
        const mockData = [{ name: 'Example 1' }, { name: 'Example 2' }];
        const mockTotal = 2;
        mockModel.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockData),
        });
        mockModel.countDocuments.mockResolvedValue(mockTotal);
        const result = await (0, paginate_1.paginate)(mockModel, {}, 1, 10);
        expect(result).toEqual({ data: mockData, total: mockTotal });
    });
    it('should handle errors thrown by the model', async () => {
        const errorMessage = 'Database error';
        mockModel.find.mockImplementation(() => {
            throw new Error(errorMessage);
        });
        await expect((0, paginate_1.paginate)(mockModel, {}, 1, 10)).rejects.toThrow(`Error paginating results: ${errorMessage}`);
    });
    it('should handle errors when counting documents', async () => {
        const errorMessage = 'Count error';
        mockModel.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        });
        mockModel.countDocuments.mockRejectedValue(new Error(errorMessage));
        await expect((0, paginate_1.paginate)(mockModel, {}, 1, 10)).rejects.toThrow(`Error paginating results: ${errorMessage}`);
    });
});

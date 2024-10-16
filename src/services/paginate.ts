export const paginate = async (model: any, filter: any, page: number, limit: number) => {
  try {
    const data = await model.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
      
    const total = await model.countDocuments(filter);

    return { data, total };
  } catch (error) {
    throw new Error(`Error paginating results: ${(error as Error).message}`);
  }
};

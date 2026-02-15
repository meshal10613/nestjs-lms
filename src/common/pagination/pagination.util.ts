import { Model } from 'mongoose';
import { IPaginationOptions, IPaginatedResponse } from './pagination.interface';

export async function paginate<T>(
    model: Model<T>,
    filter: any = {},
    options: IPaginationOptions = {},
    populate?: any,
    select?: string,
): Promise<IPaginatedResponse<T>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const sort = options.sort || '-createdAt';

    const skip = (page - 1) * limit;

    let query = model.find(filter).sort(sort).skip(skip).limit(limit);

    if (select) {
        query = query.select(select);
    }

    if (populate) {
        query = query.populate(populate);
    }

    const [data, total] = await Promise.all([
        query,
        model.countDocuments(filter),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data,
    };
}

export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface IPaginatedResponse<T> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    data: T[];
}

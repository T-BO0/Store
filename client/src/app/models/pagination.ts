export interface MetaData {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResponse<T> {
    items: T;
    metaData: MetaData;
    constructor(items:T, metaData: MetaData){
        this.items = items;
        this.metaData = metaData;
    }
}
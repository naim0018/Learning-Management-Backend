import { Query } from "mongoose";

export class QueryBuilder<T> {
    public queryModel: Query<T[], T>;
    public query: Record<string, string>;
    private countQuery: any; // filtered query for meta

    constructor(queryModel: Query<T[], T>, query: Record<string, string>) {
        this.queryModel = queryModel;
        this.query = query;
        this.countQuery = queryModel; // initialize count query
    }

    filter(): this {
        const filter = { ...this.query };
        const excludeFild = ["searchTerm", "sort", "fields", "page", "limit"];
        for (const value of excludeFild) delete filter[value];

        this.queryModel = this.queryModel.find(filter);
        this.countQuery = this.queryModel; // filtered query
        return this;
    }

    search(searchableFild: string[]): this {
        const searchTerm = this.query.searchTerm || "";
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFild.map(fild => ({
                    [fild]: { $regex: searchTerm, $options: "i" }
                }))
            };
            this.queryModel = this.queryModel.find(searchQuery);
            this.countQuery = this.queryModel; // filtered + search query
        }
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.queryModel = this.queryModel.sort(sort);
        return this;
    }

    select(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.queryModel = this.queryModel.select(fields);
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.queryModel = this.queryModel.limit(limit).skip(skip);
        return this;
    }

    build() {
        return this.queryModel;
    }

    async getMeta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 12;

        // Use filtered query for counting
        const totalDocumtnt = await this.countQuery.model.countDocuments(this.countQuery.getFilter());
        const totalPage = Math.ceil(totalDocumtnt / limit);

        return { page, limit, total: totalDocumtnt, totalPage };
    }
}

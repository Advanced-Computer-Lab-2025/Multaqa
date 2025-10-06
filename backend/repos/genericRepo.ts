import { Model, Document, FilterQuery, Query } from "mongoose";
// Helper to apply populate logic to a query
function applyPopulate<T>(
  query: Query<any, T>,
  populate?: string | string[]
): Query<any, T> {
  if (populate) {
    if (Array.isArray(populate)) {
      for (const field of populate) {
        query = query.populate(field);
      }
    } else {
      query = query.populate(populate);
    }
  }
  return query;
}

export default class GenericRepository<T extends Document> {
  private readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(
    id: string,
    options: { populate?: string | string[] } = {}
  ): Promise<T | null> {
    let query = this.model.findById(id);
    query = applyPopulate(query, options.populate);
    return await query.exec();
  }

  async findAll(
    filter = {},
    options: { populate?: string | string[] } = {}
  ): Promise<T[]> {
    let query = this.model.find(filter);
    query = applyPopulate(query, options.populate);
    return await query.exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async findOne(
    filter: FilterQuery<T>,
    options: { populate?: string | string[] } = {}
  ): Promise<T | null> {
    let query = this.model.findOne(filter);
    query = applyPopulate(query, options.populate);
    return await query.exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return result !== null;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}

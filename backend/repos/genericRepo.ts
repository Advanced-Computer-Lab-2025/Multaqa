import { Model, Document, FilterQuery, Query } from "mongoose";

export default class GenericRepository<T extends Document> {
  private readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Helper to apply select logic to a query
  applySelect<T>(
    query: Query<any, T>,
    select?: string | string[]
  ): Query<any, T> {
    if (select) {
      if (Array.isArray(select)) {
        query = query.select(select.join(" "));
      } else {
        query = query.select(select);
      }
    }
    return query;
  }

  // Helper to apply populate logic to a query
  applyPopulate<T>(
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

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (err) {
      throw err;
    }
  }

  async findById(
    id: string,
    options: { populate?: string | string[]; select?: string | string[] } = {}
  ): Promise<T | null> {
    try {
      let query = this.model.findById(id);
      query = this.applyPopulate(query, options.populate);
      query = this.applySelect(query, options.select);
      return await query.exec();
    } catch (err) {
      throw err;
    }
  }

  async findAll(
    filter = {},
    options: { populate?: string | string[]; select?: string | string[] } = {}
  ): Promise<T[]> {
    try {
      let query = this.model.find(filter);
      query = this.applyPopulate(query, options.populate);
      query = this.applySelect(query, options.select);
      return await query.exec();
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    options: { populate?: string | string[]; select?: string | string[] } = {}
  ): Promise<T | null> {
    try {
      let query = this.model.findOne(filter);
      query = this.applyPopulate(query, options.populate);
      query = this.applySelect(query, options.select);
      return await query.exec();
    } catch (err) {
      throw err;
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter);
      return result !== null;
    } catch (err) {
      throw err;
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (err) {
      throw err;
    }
  }
}

import { Model } from "mongoose";
import { IEvent } from "../interfaces/event.interface";

export class EventRepo {
  private model: Model<IEvent>;

  constructor(model: Model<IEvent>) {
    this.model = model;
  }

  async getFilteredEvents(query?: {
    search?: string;
    type?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    sort?: boolean;
  }): Promise<IEvent[]> {
    const pipeline: any[] = [];

    //filters
    const initialMatch: any = {};

    if (query?.type) initialMatch.type = query.type;
    if (query?.location) initialMatch.location = query.location;
    if (query?.startDate) initialMatch.event_start_date = { $gte: new Date(query.startDate) };
    if (query?.endDate) initialMatch.event_end_date = { $lte: new Date(query.endDate) };

    if (Object.keys(initialMatch).length > 0) {
      pipeline.push({ $match: initialMatch });
    }

    //  Lookup professors (get professor details from their ids found in associatedProfs field in workshop)
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "associatedProfs",
        foreignField: "_id",
        as: "associatedProfs"
      }
    });

    //  Search filter
    if (query?.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { event_name: searchRegex },
            {
              type: "workshop",
              $or: [
                { "associatedProfs.firstName": searchRegex },
                { "associatedProfs.lastName": searchRegex }
              ]
            }
          ]
        }
      });
    }

    //  Format professor data (display only their names and emails)
    pipeline.push({
      $addFields: {
        associatedProfs: {
          $cond: {
            if: { $eq: ["$type", "workshop"] },
            then: {
              $map: {
                input: "$associatedProfs",
                as: "prof",
                in: {
                  firstName: "$$prof.firstName",
                  lastName: "$$prof.lastName",
                  email: "$$prof.email"
                }
              }
            },
            else: "$$REMOVE"
          }
        }
      }
    });

    //  Sorting
    if (query?.sort) {
      pipeline.push({ $sort: { event_start_date: 1 } });
    }

    return this.model.aggregate(pipeline).exec();
  }
}

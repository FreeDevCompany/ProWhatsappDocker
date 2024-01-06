import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import 'reflect-metadata';
import { IQueque } from "../../domain/models/queque.types";

@injectable()
export class QuequeRepository extends RepositoryBase<IQueque>
{
    constructor(@inject(Types.IDbContext) @named("quequeDbContext") quequeDbContext: IDbContext<IQueque>)
    {
        super(quequeDbContext);
    }
    async getTotalQueueItemCountForNotSpendCredit(userId): Promise<number>
    {
      const result = await this.dbContext.model.aggregate([
        {
          "$match": {
            "userId": "6588024357a5e877ffda1c93",
            "status": {
              "$in": ["PENDING", "IN_PROGRESS", "PAUSED"]
            }
          }
        },
        {
          "$lookup": {
            "from": "quequeitems",
            "let": { "quequeId": { "$toString": "$_id" } },
            "pipeline": [
              {
                "$match": {
                  "$expr": {
                    "$eq": [ "$quequeId", "$$quequeId" ]
                  }
                }
              },
              {
                "$match": {
                  "spendCredit": 0
                }
              }
            ],
            "as": "quequeItems"
          }
        },
        {
          "$project": {
            "_id": 1,
            "userId": 1,
            "status": 1,
            "totalQuequeItems": {
              "$size": "$quequeItems"
            }
          }
        }
      ]
      );
      let totalCount = 0;
      if (result.length > 0)
      {
        result.map((item) => {
          totalCount += item.totalQuequeItems
        })
      }
      return totalCount;
    }
}
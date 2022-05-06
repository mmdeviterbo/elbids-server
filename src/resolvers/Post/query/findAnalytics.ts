import { Analytics, CATEGORY } from '../../../types';
import { UserInputError } from 'apollo-server-express';

export default async function findAnalytics(_, args, context): Promise<Analytics>{
  try{
    let res: Analytics = {}
    
    res.users_count = await context.users.count()
    res.posts_count = await context.posts.count()
    res.sold_count = await context.posts.find({ archived: true }).count()
    
    let bid_total_cost = await context.items.aggregate([
      {
        $lookup:{
          localField: "post_id",
          from: "posts",
          foreignField: "_id",
          as:"postsRes"
        }
      },
      {
        $project: { postRes : 0 }
      },
      {
        $match:{ "postsRes.archived" : true, "postsRes.category": CATEGORY.BID }
      },
      {
        $group:{
          _id: null,
          current_bid: { $sum: "$current_bid"}
        }
      },
      {
        $project: { "total_cost": "$current_bid" }
      }
    ]).toArray()
    

    let sale_total_cost = await context.items.aggregate([
      {
        $lookup:{
          localField: "post_id",
          from: "posts",
          foreignField: "_id",
          as:"postsRes"
        }
      },
      {
        $project: { postRes : 0 }
      },
      {
        $match:{ "postsRes.archived" : true, "postsRes.category": CATEGORY.SALE }
      },
      {
        $group:{
          _id: null,
          starting_price: { $sum: "$starting_price"}
        }
      },
      {
        $project: { "total_cost": "$starting_price" }
      }
    ]).toArray()
    res.total_cost = bid_total_cost[0]?.total_cost+sale_total_cost[0]?.total_cost|| 0
    return res

  }catch(err){
    throw new UserInputError('Failed to retrieve analytics')
  }
}
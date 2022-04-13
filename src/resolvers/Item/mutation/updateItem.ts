import { ItemUpdateArgs } from "../../../types"
import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'bson';

const updateItem=async(_, args: ItemUpdateArgs, context): Promise<void>=>{
  const { _id, post_id, title, description, reason, date_updated, current_bid, date_first_bid, date_latest_bid, buyer_id } = args

  const updateItemArgs: ItemUpdateArgs = {}
  if(title) updateItemArgs.title = title
  if(description) updateItemArgs.description = description
  if(reason) updateItemArgs.reason = reason
  if(current_bid) updateItemArgs.current_bid = current_bid 
  if(date_updated) updateItemArgs.date_updated = date_updated
  if(date_first_bid) updateItemArgs.date_first_bid = date_first_bid
  if(date_latest_bid) updateItemArgs.date_latest_bid = date_latest_bid
  if(buyer_id) updateItemArgs.buyer_id = new ObjectId(buyer_id)

  try{
    let res = await context.items.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: {...updateItemArgs} }
    )

    if(!current_bid){ //for sale
      await context.posts.findOneAndUpdate(
        { _id: new ObjectId(post_id) },
        { $set: { archived: true } }
      )
    }

    return res.value
  }catch(err){
    throw new UserInputError('Failed to update item')
  }

}
export default updateItem

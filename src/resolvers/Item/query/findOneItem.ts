import { ObjectId } from 'bson';
export default async function findOneItem(parent, args, context){
  return await context.items.findOne({post_id : new ObjectId(parent._id)})
  //parent here is the 'posts' collection
}
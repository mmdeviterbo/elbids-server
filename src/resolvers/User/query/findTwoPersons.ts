import { ObjectId } from 'bson'

export default async function findTwoPersons(parent, args, context){
  if(parent){
    let userIds: ObjectId[]
    if(parent?.user_ids) userIds = parent.user_ids.map((userId: string)=>new ObjectId(userId))
    
    if(userIds?.length>0){
      return await context.users.find({
        _id : { $in: [ ...userIds ] }
      }).toArray()
    }
  }
  return null
}
import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'
import { ConversationType, InsertOneConversationArgs } from '../../../types'

const insertOneConversation=async(_, args: InsertOneConversationArgs, context): Promise<ConversationType>=>{
  const { _id, user_ids } = args

  if(!_id){
    throw new UserInputError('No conversation_id. Failed to insert conversation')
  }

  let tempUsersIds: ObjectId[] = user_ids?.map((user_id: ObjectId)=>new ObjectId(user_id))
  let tempUsersIdsReversed: ObjectId[] = [...tempUsersIds].reverse()

  let insertArgs: ConversationType = {
     _id: new ObjectId(_id),
     user_ids: [ ...tempUsersIds ],
     date_created: new Date().toString(),
     deleted: false,
  }
  try{
    let isExist = await context.conversations.findOne({
      $or:[
        { user_ids: [ ...tempUsersIds ] },
        { user_ids: [ ...tempUsersIdsReversed ] },
      ],
      deleted: false
    })
    if(!isExist){
      let res = await context.conversations.insertOne({ ...insertArgs})
      if(res.insertedId) return insertArgs
    }    
    return null
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default insertOneConversation
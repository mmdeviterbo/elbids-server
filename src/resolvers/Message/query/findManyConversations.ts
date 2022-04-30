import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'
import { ConversationType, FindManyConversationArgs } from '../../../types'
const findManyConversation=async(_, args, context): Promise<ConversationType[]>=>{
  const { user_ids } = args

  if(user_ids?.length<=0){
    throw new UserInputError('No conversation_id and user_ids found. Failed to find many conversations')
  }
  let userObjectIds: ObjectId[] = user_ids?.map((userId: string)=>new ObjectId(userId)) 

  try{
    let res = await context.conversations.find({ 
      user_ids: { $in: [... userObjectIds] },
    }).toArray()
    return res
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default findManyConversation
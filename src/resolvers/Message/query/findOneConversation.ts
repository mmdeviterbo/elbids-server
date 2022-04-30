import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'
import { ConversationType, FindOneMessagesArgs } from '../../../types'
const findOneCoversation=async(_, args: FindOneMessagesArgs, context): Promise<ConversationType>=>{
  const { _id, user_ids } = args

  if(!_id && user_ids?.length===0){
    throw new UserInputError('No conversation_id and users. Failed to find one conversation')
  }

  let findOneMessagesArgs: FindOneMessagesArgs = {}
  if(_id) findOneMessagesArgs._id = new ObjectId(_id)
  else if(user_ids) findOneMessagesArgs.user_ids = user_ids?.map((user_id: ObjectId)=> new ObjectId(user_id))

  try{
    return await context.conversations.findOne({ 
      ...findOneMessagesArgs,
      deleted: false 
    })
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default findOneCoversation
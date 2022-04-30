import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'
import { MessageType, FindManyMessagesArgs } from '../../../types'
const findManyMessages=async(_, args: FindManyMessagesArgs, context): Promise<MessageType[]>=>{
  const { conversation_id } = args

  if(!conversation_id){
    throw new UserInputError('No conversation_id found. Failed to find many messages')
  }

  try{
    let res = await context.messages.find({ conversation_id: new ObjectId(conversation_id) }).toArray()
    return res
  }catch(err){
    throw new UserInputError('Failed to update post')
  }
}
export default findManyMessages
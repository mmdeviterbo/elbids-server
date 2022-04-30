import { ObjectId } from 'bson'
import { UserInputError } from 'apollo-server-express'
import { MessageType, InsertManyMessagesArgs } from '../../../types'

const insertOneMessage=async(_, args: InsertManyMessagesArgs, context):Promise<MessageType>=>{
  const { conversation_id, user_id, message} = args

  if(!conversation_id || !user_id || !message){
    throw new UserInputError('No conversation_id, user_id, or message is given. Failed to insert message')
  }

  
  let insertArgs: MessageType = {
    conversation_id: new ObjectId(conversation_id),
    user_id: new ObjectId(user_id),
    message,
    date_created: new Date().toString()
  }

  try{
    let res = await context.messages.insertOne({ ...insertArgs })
    return { _id: res.insertedId, ...insertArgs}
  }catch(err){
    throw new UserInputError('Failed to inser message')
  }
}
export default insertOneMessage
import { UserInputError } from 'apollo-server-express'
import { Notification } from '../../../types'
import { ObjectId } from 'bson';

export default async function updateManyNotifications(_, args, context): Promise<Notification>{
  const {
    user_id,
  } = args

  if(!user_id) {
    throw new UserInputError('Unauthorized access')
  }
  try{
    await context.notifications.updateMany(
      { user_id: new ObjectId(user_id) },
      { $set: { read: true }},
    )
    return await context.notifications.find({user_id: new ObjectId(user_id)}).toArray()
  }catch(err){
    return null
  }
}
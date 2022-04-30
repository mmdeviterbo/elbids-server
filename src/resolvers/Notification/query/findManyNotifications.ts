import { UserInputError } from 'apollo-server-express'
import { FindManyNotification, STATUS } from '../../../types'
import { ObjectId } from 'bson';
import checkBoughtSoldNotifications from './checkBoughtSoldNotifications';

export default async function findManyNotifications(_, args: FindManyNotification, context){
  const {
		user_id,
  } = args

  if(!user_id){
    throw new UserInputError('Unauthorized access')
  }

  await checkBoughtSoldNotifications(_, {user_id}, context)


  let res = await context.notifications.find({
    user_id : new ObjectId(user_id)
  }).toArray()

  return res
}
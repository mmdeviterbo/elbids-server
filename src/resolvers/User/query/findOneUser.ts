import { UserFindOneArgs } from '../../../types'
import { ObjectId } from 'bson'

export default async function findOneUser(parent, args, context){
  if(parent){
    let userId
    if(parent?.user_id) userId = parent.user_id
    else if(parent?.seller_id) userId = parent?.seller_id
    else if(parent?.buyer_id) userId = parent?.buyer_id
    else if(parent?.user_id) userId = parent?.user_id
    
    if(userId){
      return await context.users.findOne({ _id : new ObjectId( userId )})
    }
  }

  const {
    email,
    _id,
    status,
    deactivated,
    banned,
    report_count,
    notification_count,
    id,
    admin,
    following_ids,
    favorite_ids
  } = args
  if(!email && !_id) return null

  let userArgs: UserFindOneArgs = {}
  if(email) userArgs.email = email              //option 1 identifier/key
  else if(_id) userArgs._id = new ObjectId(_id) //option 2 identifier/key
  
  if(status) userArgs.status = status
  if(deactivated) userArgs.deactivated = deactivated
  if(banned) userArgs.banned = banned
  if(report_count) userArgs.report_count = report_count
  if(notification_count) userArgs.notification_count = notification_count
  if(id) userArgs.id = new ObjectId(id)
  if(admin) userArgs.admin = admin
  if(following_ids) userArgs.following_ids = following_ids
  if(favorite_ids) userArgs.favorite_ids = favorite_ids
  
  return await context.users.findOne({...userArgs})
}
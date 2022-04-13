import { UserFindOneArgs } from '../../../types'
import { ObjectId } from 'bson'

export default async function findOneUser(parent, args, context){
  if(parent){
    return await context.users.findOne({ _id : new ObjectId( parent.user_id )})
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
    like_ids
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
  if(like_ids) userArgs.like_ids = like_ids
  
  return await context.users.findOne({...userArgs})
}
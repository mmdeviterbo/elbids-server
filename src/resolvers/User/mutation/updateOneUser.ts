import { UserInputError } from 'apollo-server-express'
import { ObjectId } from 'bson'
import { UserUpdateArgs, User } from '../../../types'

export default async(_, args: UserUpdateArgs, context)=>{
  const {
    _id,
    email,
    status,
    deactivated,
    banned,
    report_count,
    notification_count,
    id,
    admin,
    following_id,
    like_id
  } = args


  let updatedUser: UserUpdateArgs = {}
  if(status) updatedUser.status = status
  if(deactivated) updatedUser.deactivated = deactivated
  if(banned) updatedUser.banned = banned
  if(report_count) updatedUser.report_count = report_count
  if(notification_count) updatedUser.notification_count = notification_count
  if(id) updatedUser.id = new ObjectId(id)
  if(admin) updatedUser.admin = admin

  try{
    let resfindUser: User
    if(email) resfindUser = await context?.users?.findOne({ email })
    else if(_id) resfindUser = await context?.users?.findOne({ _id : new ObjectId(_id) })
    else throw new UserInputError('No email and _id were given')

    //following_id
    if(following_id){
      let tempRes = await context?.users?.findOne({ email, following_ids: new ObjectId(following_id)})

      if(!tempRes){
        await context?.users?.updateOne(
          { email },
          { $addToSet: { following_ids: new ObjectId(following_id) } }
        )
      }
      else{
        await context?.users?.updateOne(
          { email },
          { $pull: { following_ids: new ObjectId(following_id) } }
        )
      }
    }
    
    //like_id
    if(like_id){
      let tempRes = await context?.users?.findOne({ email, like_ids: new ObjectId(like_id)})

      if(!tempRes){
        await context?.users?.updateOne(
          { email },
          { $addToSet: { like_ids: new ObjectId(like_id) } }
        )
      }
      else{
        await context?.users?.updateOne(
          { email },
          { $pull: { like_ids: new ObjectId(like_id) } }
        )
      }
    }
  
    const resUpdateUser = await context?.users?.findOneAndUpdate({ email },{ $set:{ ...updatedUser }})
    return resUpdateUser.value
  }catch(err){
    throw new UserInputError('Invalid user')
  }
}
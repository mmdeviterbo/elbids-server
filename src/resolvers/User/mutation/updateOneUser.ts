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
    favorite_id,
    isFavorite,
    isFollow,
    password
  } = args

  let updatedUser: UserUpdateArgs = {}
  if(status) updatedUser.status = status
  if(deactivated===true || deactivated===false) updatedUser.deactivated = deactivated
  if(banned===true || banned===false) updatedUser.banned = banned
  if(notification_count) updatedUser.notification_count = notification_count
  if(id) updatedUser.id = new ObjectId(id)
  if(admin===true || admin===false) updatedUser.admin = admin
  if(password) updatedUser.password = password


  try{
    if(!email && !_id) throw new UserInputError('No email nor _id was given')

    //following_id
    if(following_id){
      if(isFollow){
        await context?.users?.updateOne(
          { $or: [ { _id: new ObjectId(_id) }, { email } ] },
          { $addToSet: { following_ids: new ObjectId(following_id) } }
        )
      }
      else{
        await context?.users?.updateOne(
          { $or: [ { _id: new ObjectId(_id) }, { email } ] },
          { $pull: { following_ids: new ObjectId(following_id) } }
          )
      }
    }
      
    //favorite_id
    if(favorite_id){
      if(isFavorite){
        await context?.users?.updateOne(
          { $or: [ { _id: new ObjectId(_id) }, { email } ] },
          { $addToSet: { favorite_ids: new ObjectId(favorite_id) } }
        )
      }
      else{
        await context?.users?.updateOne(
          { $or: [ { _id: new ObjectId(_id) }, { email } ] },
          { $pull: { favorite_ids: new ObjectId(favorite_id) } }
        )
      }
    }
    
    //report_count
    if(report_count){
      await context.users.updateOne(
        { $or: [{_id : new ObjectId(_id)}, { email }]},
        { $inc: { report_count }}
      )
    }

    if(Object.values(updatedUser).length>0){
      let resUpdateUser = await context?.users?.findOneAndUpdate(
        { $or: [ { _id: new ObjectId(_id) }, { email } ] },
        { $set:{ ...updatedUser }}
      )
      return resUpdateUser?.value
    }else return await context?.users?.findOne({ 
      $or: [ { _id: new ObjectId(_id) }, { email } ]
    })
    
  }catch(err){
    throw new UserInputError('Invalid user')
  }
}
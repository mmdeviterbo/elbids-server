import { Item, Post, TIMER_OPTIONS } from '../types'
import { ObjectId } from 'bson';
import { Db } from 'mongodb'
var Countdown = require('countdown-js')

const getLengthTime=(timer: TIMER_OPTIONS): number =>{
  let lengthTime: number = 0
  if(timer === TIMER_OPTIONS.FIFTEEN_SECONDS) lengthTime = 17000    //mil   
  else if(timer === TIMER_OPTIONS.TWELVE_HOURS) lengthTime = 43200000    //mil   
  else if(timer === TIMER_OPTIONS.ONE_DAY) lengthTime = 86400000    //mil
  else if(timer === TIMER_OPTIONS.TWO_DAYS) lengthTime = 172800000  //mil
  else if(timer === TIMER_OPTIONS.FIVE_DAYS) lengthTime = 432000000 //mil
  return lengthTime
}


const isTimerFinished=(item: Item): boolean =>{
  let res: boolean = false

  let date_first_bid: number = new Date(item.date_first_bid).getTime()
  let lengthTime: number = getLengthTime(item.timer) 
  let end: Date = new Date(lengthTime + date_first_bid)
  let time = Countdown.timer(end, function() {}, function() {})
  const {days, hours, minutes, seconds} = time.getTimeRemaining()
  if(days<0 && hours<0 && minutes<0 && seconds<0) res = true
  
  return res
}

export default async(db: Db): Promise<void>=>{
  let context = {
    items: db.collection('items'),
    posts: db.collection('posts')
  }

  let items =  await context.items.find({
    date_first_bid: { $ne: null },
    additional_bid: { $gt: 0 }
  }).toArray()

  let posts = await context.posts.aggregate([
    {
      $lookup:{
        localField: "seller_id",
        from: "users",
        foreignField:"_id",
        as: "asUser"
      }
    },
    {
      $match: { "asUser.deactivated": false, "asUser.banned": false, deleted: false, archived: false }
    },
    {
      $project: { asUser: 0 }
    }
  ]).toArray()
  
  // start of checking the archives
  let bidItems = []
  items.forEach((item)=>{
    posts.forEach((post: Post)=>{
      if(post._id.equals(item.post_id)) bidItems.push(item)
    })
  })

  let bidItemsIds: ObjectId[] = []
  bidItems.forEach(async(item: Item): Promise<void>=>{
    if(isTimerFinished(item)) bidItemsIds.push(item?.post_id)
  })

  if(bidItemsIds.length){
    await context.posts.updateMany(
      { _id : { $in: [...bidItemsIds] } },
      { $set: { archived : true} },
    )
  }
}
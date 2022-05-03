import { UserInputError } from 'apollo-server-express';
import { CATEGORY, Item, DATE_FORMAT, PostFilter, TIMER_OPTIONS, Post } from '../../../types'
import { ObjectId } from 'bson';
import formatDate from '../../../_utils/formatDate'
var Countdown = require('countdown-js')

//ONLY archived: true here (all sold posts)
const getLengthTime=(timer: TIMER_OPTIONS): number =>{
  let lengthTime: number = 0
  if(timer === TIMER_OPTIONS.FIFTEEN_SECONDS) lengthTime = 17000    //mil   
  else if(timer === TIMER_OPTIONS.TWELVE_HOURS) lengthTime = 43200000    //mil   
  else if(timer === TIMER_OPTIONS.ONE_DAY) lengthTime = 86400000    //mil
  else if(timer === TIMER_OPTIONS.TWO_DAYS) lengthTime = 172800000  //mil
  else if(timer === TIMER_OPTIONS.FIVE_DAYS) lengthTime = 432000000 //mil
  return lengthTime
}

export default async function findManyPosts(_, args: PostFilter, context){
  try{
    const {min_price, max_price, timer, category, search, tags, date_range} = args
    let values = Object.values(args)
    let isFiltered: boolean = values?.find((value)=>value!==null)? true : false
    
    let valuesFiltered = values.filter((value)=>value!==null)

    if(isFiltered){
      if(valuesFiltered?.length===1 && valuesFiltered[0]==="ANY") isFiltered = false
    }

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

    let clonePosts = [...posts]

    if(isFiltered){
      let items: Item[] =  await context.items.aggregate([
        {
          $lookup:{
            localField: "post_id",
            from: "posts",
            foreignField:"_id",
            as:"postsRes"
          }
        },
        {
          $match: { "postsRes.archived" : false, "postsRes.deleted" : false}
        },
        {
          $project: { postsRes: 0, gallery_id: 0 }
        }
      ]).toArray()
    
      if(search){
        items = items.filter((item: Item)=>item.title.toLowerCase().includes(search.toLowerCase()))
      }

      if(search){
        let tempSearch: string = search.toLowerCase()
        let tempItems: Item[] = [...items]
        items.length = 0

        let title, description, reason
        for(let i=0;i<tempItems.length;i++){
          title = tempItems[i].title?.replace(/\s/g,'').toLowerCase()
          description = tempItems[i].description?.replace(/\s/g,'').toLowerCase()
          reason = tempItems[i].reason?.replace(/\s/g,'').toLowerCase()

          let tempTags: string[] = tempItems[i].tags.map((tag: string)=>tag.replace("#elbids","").toLowerCase())
          if(title.includes(tempSearch)) items.push(tempItems[i])
          else if(description.includes(tempSearch)) items.push(tempItems[i])
          else if(reason.includes(tempSearch)) items.push(tempItems[i])
          else if(tempTags && tempTags.length){
            if(tempTags.some((tag:string)=>search.includes(tag))) items.push(tempItems[i])
          }
        }
      }
      
      if(min_price){
        if(category===CATEGORY.BID) items = items.filter((item: Item)=>item.current_bid>=min_price)
        else if(category===CATEGORY.SALE) items = items.filter((item: Item)=>item.starting_price>=min_price)
        else if(category===CATEGORY.ANY) {
          let tempItems: Item[] = [...items]
          items.length = 0
          for(let i=0;i<tempItems.length;i++){
            if(tempItems[i].current_bid!==0 && tempItems[i].current_bid>=min_price){ //bid
              items.push(tempItems[i])
            }else if(tempItems[i].current_bid===0 && tempItems[i].starting_price>=min_price){ //sale
              items.push(tempItems[i])
            }
          }
        }
      }
      if(max_price){
        if(category===CATEGORY.BID) items = items.filter((item: Item)=>item.current_bid<=max_price)
        else if(category===CATEGORY.SALE) items = items.filter((item: Item)=>item.starting_price<=max_price)
        else if(category===CATEGORY.ANY) {
          let tempItems: Item[] = [...items]
          items.length = 0
          for(let i=0;i<tempItems.length;i++){
            if(tempItems[i].current_bid!==0 && tempItems[i].current_bid<=max_price) items.push(tempItems[i])
            else if(tempItems[i].current_bid===0 && tempItems[i].starting_price<=max_price) items.push(tempItems[i])
          }
        }
      }
      if(date_range){
        let fromDate: number = new Date(date_range.split('-')[0]).getTime()
        let toDate: number = new Date(date_range.split('-')[1]).getTime()

        let tempItems: Item[] = [...items]
        items.length = 0
        tempItems.forEach((item: Item): void =>{
          let checkDate: number = new Date(formatDate(item.date_created, DATE_FORMAT.DATE)).getTime()
          if(checkDate>=fromDate && checkDate<=toDate) items.push(item)
        })
      }

      if(timer){
        let sortlengthTime: number = getLengthTime(timer)
        let tempItems: Item[] = [...items]
        items.length = 0

        tempItems.forEach((item: Item): void =>{
          if(item.date_first_bid && item.additional_bid !== 0){
            let date_first_bid: number = new Date(item.date_first_bid).getTime()
            let lengthTime: number = getLengthTime(item.timer) 
            let end: Date = new Date(lengthTime + date_first_bid)
            let time = Countdown.timer(end, function() {}, function() {})
            const {days, hours, minutes, seconds} = time.getTimeRemaining()
            if(days>=0 && hours>=0 && minutes>=0 && seconds>=0){
              let mil = days*86400000 + hours*3600000 + minutes*60000 + seconds*1000
              if(mil<=sortlengthTime) items.push(item)
            }
          }
        })
      }
      
      if(tags?.length){
        let tempTags: string[] = tags[0].split('-').splice(1)
        let tempItems: Item[] = [...items]
        items.length = 0

        for(let i=0;i<tempItems.length;i++){
          if(tempTags.some((tag: string)=>tempItems[i].tags.includes(tag))) items.push(tempItems[i])
        }
      }

      let categoryFilter: CATEGORY[] = [category]
      if(!category || category===CATEGORY.ANY){
        categoryFilter = [CATEGORY.BID, CATEGORY.SALE]
      }

      //after filtering
      let postIds: ObjectId[] = []
      items.map((item: Item)=>postIds.push(new ObjectId(item.post_id)))
      posts =  await context.posts.find({
        _id: { $in: [...postIds] },
        category: { $in: [...categoryFilter]},
        deleted: false,
        archived: false
      }).toArray()
    }else posts = [...clonePosts] //if no filtering is applied
    return posts
  }catch(err){
    throw new UserInputError('Failed to retrieve posts')
  }
}
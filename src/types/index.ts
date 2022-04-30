import { ObjectId, Binary } from 'bson'

export enum STATUS{
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  WAITING = 'WAITING',
  REJECTED = 'REJECTED'
}

export enum DATE_FORMAT{
  DATE_HOUR = 'DATE_HOUR',
  DATE = 'DATE',
}

export enum TIMER_OPTIONS{
  NA = 'NULL',
  FIFTEEN_SECONDS = '15 seconds',
  TWELVE_HOURS = '12 hours',
  ONE_DAY = '1 day',
  TWO_DAYS = '2 days',
  FIVE_DAYS = '5 days',
}

export enum CATEGORY{
  ANY="ANY",
  BID="BID",
  SALE="SALE"
}

export enum CART_ACTIVITIES{
  MYPOST="MYPOST",
  BOUGHT="BOUGHT",
  FOLLOWING="FOLLOWING",
  FAVORITE="FAVORITE",
}

export enum NOTIFICATION_TYPE{
  BOUGHT="BOUGHT",
  SOLD="SOLD",
  FOLLOWING="FOLLOWING"
}

export enum MESSAGE_REASON{
  BUYER="BUYER",
  SELLER="SELLER",
  READ="READ"
}

export interface Gallery{
  _id?: ObjectId
  data?: Binary[]
}

export interface User{
  __typename?: string
  _id?: ObjectId
  email: string
  first_name: string
  last_name: string
  full_name: string
  imageUrl: string
  date_created: string
  status: STATUS
  token: string
  id?: ObjectId
  id_image?: Gallery
  admin?:Boolean
  deactivated?: Boolean	  
  banned?: Boolean	      
  report_count?: Number
  notification_count?: Number
  password?: string

  following_ids?: ObjectId[]
  favorite_ids?: ObjectId[]
}

export interface UserFindOneArgs{
  email?: string
  _id?: ObjectId
  status?: STATUS
  deactivated?: Boolean	  
  banned?: Boolean	      
  report_count?: Number
  notification_count?: Number
  id?: ObjectId
  admin?:Boolean
  following_ids?: ObjectId[]
  favorite_ids?: ObjectId[]
}

export interface UserFindManyArgs{
  status?: STATUS
  deactivated?: Boolean	  
  banned?: Boolean	      
  admin?:Boolean
}

export interface UserUpdateArgs{
  _id?: ObjectId
  email?: string
  status?: STATUS
  deactivated?: Boolean	  
  banned?: Boolean	      
  report_count?: Number
  notification_count?: Number
  id?: ObjectId
  admin?:Boolean
  following_id?: ObjectId
  favorite_id?: ObjectId
  isFavorite?: Boolean
  isFollow?: Boolean
  password?: string
}

export interface Item{
  _id?: ObjectId
  post_id: ObjectId
  title: string
  description: string
  reason: string

  starting_price: number
  additional_bid: number
  current_bid: number
  timer: TIMER_OPTIONS
  date_first_bid?: string
  date_latest_bid?: string
  buyer_id?: ObjectId
  buyer?: User
  
  gallery?: Gallery
  gallery_id: ObjectId
  tags: string[]
  date_created: string
  date_updated?: string
}

export interface ItemUpdateArgs{
  _id?: ObjectId
  post_id?: ObjectId
  title?: string
  description?: string
  reason?: string
  date_updated?: string
  current_bid?: number
  date_first_bid?: string
  date_latest_bid?: string
  buyer_id?: ObjectId
}

export interface Post{
  _id: ObjectId
  seller_id: ObjectId          //current user
  seller?: User
  category: CATEGORY
  item_id?: ObjectId
  item: Item
  deleted: Boolean
  archived: Boolean
}

export interface PostUpdateArgs{
  _id?: ObjectId
  deleted?: Boolean
  archived?: Boolean
  category?: String
}

export interface PostFilter{
  search?: string
  min_price?: number
  max_price?: number
  tags?: [string]
  timer?: TIMER_OPTIONS
  date_range?: string	    
  category?: CATEGORY
}

export interface SummaryReportArgs{
  _id?: ObjectId
  archived?: boolean
  timer?: TIMER_OPTIONS
  category?: CATEGORY
}

export interface Comment{
  _id: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  content: string
  deleted?: Boolean
}

export interface InsertCommentArgs{
  user_id : ObjectId
  post_id : ObjectId
  content : string
  deleted : Boolean
}

export interface CookieArgs{
  _id: ObjectId
  email: string,
  full_name: string,
  token: string
}

export interface FindCartPostsArgs{
  email: string
  _id: ObjectId
}


export interface MessageType{         //list of messages between two people
  _id?: ObjectId
  conversation_id: ObjectId
  user_id: ObjectId
  user?: User
  message: string
  date_created?: string
}

export interface ConversationType{    //list of people
  _id?: ObjectId
  user_ids?: ObjectId[]
  users?: User[]
  message?: MessageType
  date_created?: string
  deleted?: boolean
}

export interface FindManyConversationArgs{    //list of people
  _id?: ObjectId
  user_ids: ObjectId[]
}

export interface FindOneMessagesArgs{    
  _id?: ObjectId
  user_ids?: ObjectId[]
}

export interface FindOneConversationArgs{    
  _id?: ObjectId
  user_ids?: ObjectId[]
}


export interface FindManyMessagesArgs{    
  conversation_id?: ObjectId
}

export interface InsertManyMessagesArgs{    
  conversation_id: ObjectId
  user_id: ObjectId
  message: string
}

export interface InsertOneConversationArgs{  
  _id: ObjectId
  user_ids: ObjectId[]
}

export interface Notification{
  _id?: ObjectId
  post_id: ObjectId
  post?: Post
  user_id: ObjectId
  read: boolean
  type: string	
  date_created: String
}

export interface InsertOneNotification{
  post_id: ObjectId
  user_id: ObjectId
  read?: boolean
  type: string
  current_bid?: number
  date_created?: string

}

export interface FindManyNotification{
  user_id: ObjectId
}
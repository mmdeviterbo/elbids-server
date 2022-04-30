import { Db } from 'mongodb'

//context.users.find()

export default (db : Db)=>{
    return{
        assets: db.collection('assets'),
        gallery: db.collection('gallery'),
        users : db.collection('users'),
        items : db.collection('items'),
        posts : db.collection('posts'),
        comments : db.collection('comments'),
        ids : db.collection('ids'),
        conversations : db.collection('conversations'),
        messages : db.collection('messages'),
        notifications : db.collection('notifications'),
    }
}

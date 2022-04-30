import { gql } from 'apollo-server-express'

const typeDefs = gql`
	type Gallery{
		_id: ID
		data: [String]
	}

  type User{
		_id: ID
	  email : String!
    first_name : String!
  	last_name : String!
	  full_name: String!
		imageUrl: String!
		date_created : String!
		status: String!
		token: String!
		id: ID
		id_image: Gallery
		admin: Boolean
		deactivated : Boolean	  #is deactivated
	  banned : Boolean	      #is dismissed
	  report_count : Int	    #if report count > 5, banned : true
  	notification_count: Int
		password: String

		following_ids: [ID]
	  favorite_ids: [ID]
	}

	type Item{
		_id: ID
		post_id: ID!
		title: String!
		description: String!
		reason: String!

		starting_price: Int!
		additional_bid: Int!
		current_bid: Int!
		timer: String!
		date_first_bid: String
		date_latest_bid: String
		buyer_id: ID
		buyer: User

		gallery: Gallery
		gallery_id:ID!
		tags: [String!]!
		date_created : String!
		date_updated  : String
	}

	input ItemInput{
		_id: ID
		post_id: ID!
		title: String!
		description: String!
		reason: String!

		starting_price: Int!
		additional_bid: Int!
		current_bid: Int!
		timer: String!
		date_first_bid: String
		date_latest_bid: String
		buyer_id: ID

		gallery_id:ID!
		tags: [String!]!
		date_created : String!
		date_updated  : String
	}

	type Post{
		_id: ID!
		seller_id : ID!
		seller: User
		category: String!
		item_id: ID
		item: Item!
		deleted : Boolean!
		archived: Boolean!	#item already bought
	}

	type Comment{
		_id: ID
		user_id : ID!
		user: User
		post_id : ID!
		content : String!
		deleted : Boolean
	}


	type Message{         #list of messages between two people
  	_id: ID
	  conversation_id: ID!
	  user_id: ID!
  	user: User
  	message: String!
  	date_created: String
	}

	type Conversation{    #list of people
  	_id: ID!
		user_ids:  [ID]
		users: [User]
		message: [Message]
  	date_created: String
  	deleted: Boolean
	}

	type Notification{
		_id: ID!
		post_id: ID!
		post: Post
		user_id: ID!
		read: Boolean!
		current_bid: Int
		type: String!	#bought, sold, following
		date_created: String!
	}

	type Query{
		findOneUser(
			email: String
			_id: ID
		): User
		
		findManyUsers(
			email: String!,
			status: String,
			deactivated: Boolean,
			banned: Boolean,
			admin: Boolean
		): [User]

		findManyPosts(
			search: String, 
			min_price: Int,
			max_price: Int,
			tags: [String], 
			timer: String,
			date_range: String					#to find time remaining
			category: String
		): [Post]

		findSummaryReportPosts(
			_id: ID!
  		archived: Boolean
  		timer: String
  		category: String			
		): [Post]

		findOnePost(
			_id: ID!
			deleted : Boolean
			archived: Boolean
		):Post

		findManyFavorites(
			email: String!
			_id: ID!
		): [Post]
		
		findManyBought(
			email: String!
			_id: ID!
		):[Post]

		findManyFollowing(
			email: String!
			_id: ID!
		):[Post]

		findManyMyPosts(
			email: String!
			_id: ID!
		):[Post]

		findManyComments(
			post_id: ID!
		): [Comment]

		findOneGallery(
			_id: ID!
		): Gallery

		findOneConversation(
			_id: ID
			user_ids: [ID!]!
		): Conversation

		findManyConversations(
			user_ids: [ID!]!
		): [Conversation]

		findManyMessages(
			conversation_id: ID!
		): [Message]

		findManyNotifications(
			user_id: ID!
		): [Notification]

	}

	type Mutation{
		insertOneUser(
			email: String!
  		full_name: String! 
  		first_name: String! 
  		last_name: String! 
  		imageUrl: String! 
  		status: String!
			date_created: String!
  		deactivated: Boolean
  		banned:Boolean
  		report_count:Int
  		notification_count:Int
			token: String!
			admin: Boolean
		): User

		updateOneUser(
			_id: ID
			email: String
			status: String
  		deactivated: Boolean
  		banned:Boolean
  		report_count:Int
  		notification_count:Int
			id: ID
			admin: Boolean
			following_id: ID
			favorite_id: ID
			isFavorite: Boolean
    	isFollow: Boolean
			password: String
		): User

		insertPost(
			_id: ID!
			seller_id : ID!
			category: String!
			item_id: ID
			item: ItemInput!
			deleted : Boolean!
			archived: Boolean!
		): Post

		updatePost(
			_id: ID
			deleted: Boolean
			archived: Boolean
			category: String
		): Post

		updateItem(
			_id: ID
			post_id: ID
			title: String
			description: String
			reason: String
			date_updated: String
			current_bid: Int
			date_first_bid: String
			date_latest_bid: String
			buyer_id: ID
			following_ids: [ID]
		): Item

		insertOneComment(
			user_id : ID!
  		post_id : ID!
  		content : String!
  		deleted : Boolean!
		): Comment

		updateOnePost(
			_id: ID
    	archived: Boolean
    	deleted: Boolean
		): Post

		deleteOnePost(
			_id: ID!
		): Post

		insertOneConversation(
			_id: ID!
			user_ids: [ID!]!
		): Conversation

		insertOneMessage(
  		conversation_id: ID!
  		user_id: ID!
  		message: String!
		): Message

		updateManyNotifications(
			user_id: ID!
		): Notification
	}
`
export default typeDefs
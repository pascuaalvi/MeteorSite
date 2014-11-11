Posts = new Mongo.Collection('post');

Posts.deny({
	insert: function (userId,doc) {
		// Deny posting if there is no user logged in
		return !(!! userId);
	},
	update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    console.log("Array: "+_.without(fieldNames, 'url', 'title').length);
	return (_.without(fieldNames, 'url', 'title').length > 0); 
	}
});

Posts.allow({
	update: function(userId,doc){
		return isAuthorOf(userId,doc);
	},
	remove: function(userId,doc){
		return isAuthorOf(userId,doc);
	}
});

Meteor.methods({
postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, { 
    // postAttributes is a property of the post, 
    // describing its attributes and their respective datatypes
      title: String,
      url: String,
      author: String,
      flagged: Boolean,
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url}); 
    if (postWithSameLink) {
		return {
			// If an existing link is found, 
			// the insert is cancelled. We are then redirected to the match.
			postExists: true, 
			_id: postWithSameLink._id
		} 
	}

	var user = Meteor.user();
	var post = _.extend(postAttributes, {
		userId: user._id, 
		author: user.username, 
		submitted: new Date()
	});
	var postId = Posts.insert(post);

	return { _id: postId }; 
	}
});

Meteor.methods({
deletePost: function() {
	console.log('Deleting Post!');
    Posts.remove({
    	_id: this._id
    });
	}
});
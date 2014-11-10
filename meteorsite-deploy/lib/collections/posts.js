Posts = new Mongo.Collection('post');

Posts.deny({
	insert: function (userid,doc) {
		// Deny posting if there is no user logged in
		return !(!! userid);
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
Posts = new Mongo.Collection('post');

Posts.deny({
	insert: function (userId,doc) {
		// Deny posting if there is no user logged in
		return !(!! userId);
	},
	update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    var errors = validatePost(post)
		return errors.title || errors.url;
	}
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
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

      var errors = validatePost(postAttributes);
  	if (errors.title || errors.url)
  		throw new Meteor.Error('invalid-post','You must set a title and URL for your post');

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
  		submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
  	});

  	var postId = Posts.insert(post);

  	return { _id: postId };
  },

  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);
    var post = Posts.findOne(postId);

    var affected = Posts.update({
      _id: postId,
      upvoters: {
        $ne: this.userId
        // $ne is js doc selector for Not Equal, in this case it's the user id
      }
    },
    {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});

validatePost = function (post) {
	var errors = {};
	if (!post.title)
		errors.title = "Please fill in a headline";
	if (!post.url)
		errors.url = "Please fill in a URL";
		return errors;
}

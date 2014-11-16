Meteor.publish('posts', function (author) {
	if(author != null){
		return Posts.find({ flagged:false,author:author });
	}
	else{
		return Posts.find({flagged:false});
	}
});

Meteor.publish('comments', function(postId) {
	check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId, read:false});
});
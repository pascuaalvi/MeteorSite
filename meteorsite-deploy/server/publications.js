Meteor.publish('posts', function (author) {
	if(author != null){
		return Posts.find({ flagged:false,author:author });
	}
	else{
		return Posts.find({flagged:false});
	}
});
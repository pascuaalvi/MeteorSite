Template.postItem.helpers({
domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
isAuthorOfPost: function(){
		var isAuthorOf = (this.userId === Meteor.userId());
		return isAuthorOf;
	},
commentsCount: function() {
		return Comments.find({postId: this._id}).count(); 
	}
});

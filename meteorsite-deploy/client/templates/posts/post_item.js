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
		return Posts.find(this._id).fetch()[0].commentsCount;
	}
});

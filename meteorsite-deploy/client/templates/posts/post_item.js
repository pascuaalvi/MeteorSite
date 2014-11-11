Template.postItem.helpers({
domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
isAuthorOfPost: function(){
		var isAuthorOf = (this.author == Meteor.users.find().fetch()[0].username);
		return isAuthorOf;
	}
});

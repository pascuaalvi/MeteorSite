Template.postDelete.events = {
	'click #confirmed': function(){
		Posts.remove({_id:this._id});

		Router.go('postsList');
	},
	'click #cancelled': function(){
		Router.go('postsList');
	}
}
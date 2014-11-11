Template.postDelete.events = {
	'click #confirmed': function(){
		Posts.remove({_id:this._id});

		Meteor.call('deletePost', function(error, result) { 
  		// display the error to the user and abort
			if (error) {
				return alert(error.reason);
			}		
    	});

		Router.go('postsList');
	},
	'click #cancelled': function(){
		Router.go('postsList');
	}
}
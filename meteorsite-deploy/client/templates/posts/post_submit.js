Template.postSubmit.events({ 
	'submit form': function(e) {
    e.preventDefault();

	var post = {
		url: $(e.target).find('[name=url]').val(), 
		title: $(e.target).find('[name=title]').val(),
		author: Meteor.users.find().fetch()[0].username ,
		flagged:false
	};

	/** 
	  * Rather than inserting directly into the Posts collection, 
	  * we’ll call a Method named postInsert
	  *
	post._id = Posts.insert(post);
    Router.go('postPage', post);
  	*/

  	Meteor.call('postInsert', post, function(error, result) { 
  		// display the error to the user and abort
		if (error) {
			return alert(error.reason);
		}
      	Router.go('postPage', {_id: result._id});
    });
  	}
});
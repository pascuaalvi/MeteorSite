Template.postSubmit.events({ 
	'submit form': function(e) {
    e.preventDefault();

	var post = {
	url: $(e.target).find('[name=url]').val(), title: $(e.target).find('[name=title]').val(),
	author: Meteor.users.find().fetch()[0].username ,flagged:false
	};

	post._id = Posts.insert(post);
    Router.go('postPage', post);
  	}
});
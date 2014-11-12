Router.configure ({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function() { 
		return [Meteor.subscribe('posts'),Meteor.subscribe('comments'), Meteor.subscribe('notifications')];
	}
});

Router.route('postsList',{path:'/'});

Router.route('postPage', {
        path: '/posts/:_id',
        data: function() { return Posts.findOne(this.params._id); }
    });

Router.route('postSubmit', {
		path: '/submit'
	});

Router.route('postDelete', {
		path: '/delete/:_id',
		data: function() { return Posts.findOne(this.params._id); }
	});

Router.route('/posts/:_id/edit', {
		name: 'postEdit',
		data: function() { return Posts.findOne(this.params._id); }
	});

var requireLoginDelete = function() { 
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) { 
			// if there are latency issues in this transaction, render the Loading template
			this.render(this.loadingTemplate);
		} 
		else {
			// if the user is not logged in, render the Access Denied template 
			this.render('accessDenied');
		}
	}
	else {
		// otherwise don't hold up the rest of hooks or our route/action function from running
		if (Meteor.user) {};

		this.next(); 
		// The route action in this case is rendering of the postSubmit template.
	}	
}

var requireLoginSubmit = function() { 
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) { 
			// if there are latency issues in this transaction, render the Loading template
			this.render(this.loadingTemplate);
		} 
		else {
			// if the user is not logged in, render the Access Denied template 
			this.render('accessDenied');
		}
	}
	else {
		// otherwise don't hold up the rest of hooks or our route/action function from running
		this.next(); 
		// The route action in this case is rendering of the postSubmit template.
	}	
}

Router.onBeforeAction('dataNotFound',{only:'postPage'});
Router.onBeforeAction(requireLoginDelete,{only:'postDelete'});
Router.onBeforeAction(requireLoginSubmit,{only:'postSubmit'});
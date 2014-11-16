Router.configure ({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function() {
		return [Meteor.subscribe('posts'),Meteor.subscribe('notifications')];
	}
});
Router.map( function() {
	this.route('postPage', {
	        path: '/posts/:_id',
	        waitOn: function() {
						return Meteor.subscribe('comments', this.params._id);
					},
	        data: function() { return Posts.findOne(this.params._id); }
	    });

	this.route('postSubmit', {
			path: '/submit'
		});

	this.route('postDelete', {
			path: '/delete/:_id',
			data: function() { return Posts.findOne(this.params._id); }
		});

	this.route('/posts/:_id/edit', {
			name: 'postEdit',
			data: function() { return Posts.findOne(this.params._id); }
		});

	this.route('postsList',{path:'/'});
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
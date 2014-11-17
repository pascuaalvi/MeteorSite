Router.configure ({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function() {
		return [Meteor.subscribe('notifications')];
	}
});

PostsListController = RouteController.extend({
	template: 'postsList',
	increment: 5,
	postsLimit: function() {
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function() {
		return {sort: {submitted: -1}, limit: this.postsLimit()};
	},
	waitOn: function() {
		return Meteor.subscribe('posts', this.findOptions());
	},
	posts: function() {
		return Posts.find({}, this.findOptions());
	},
	data: function() {
		var hasMore = this.posts().count() === this.postsLimit();
		var nextPath = this.route.path({
			postsLimit: this.postsLimit() + this.increment
		});
		return {
		posts: this.posts(),
		nextPath: hasMore ? nextPath : null
		};
	}
});

Router.map( function() {
	this.route('/posts/:_id', {
	        name: 'postPage',
	        waitOn: function() {
						var postsLimit = parseInt(this.params.postsLimit) || 5;
						return [
							Meteor.subscribe('comments', this.params._id),
							Meteor.subscribe('posts', {
								sort: {submitted: -1},
								limit: postsLimit
							})
							];
					},
	        data: function() { return Posts.findOne(this.params._id); }
	    });

	this.route('/submit', {
			name: 'postSubmit'
		});
//
	this.route('/posts/:_id/delete', {
			name: 'postDelete',
			waitOn: function() {
				var postsLimit = parseInt(this.params.postsLimit) || 5;
					return Meteor.subscribe('posts', {
						sort: {submitted: -1},
						limit: postsLimit
					});
			},
			data: function() { return Posts.findOne(this.params._id); }
		});

	this.route('/posts/:_id/edit', {
			name: 'postEdit',
			waitOn: function() {
				var postsLimit = parseInt(this.params.postsLimit) || 5;
					return Meteor.subscribe('posts', {
						sort: {submitted: -1},
						limit:postsLimit
					});
			},
			data: function() { return Posts.findOne(this.params._id); }
		});

	// Rerouted to controller
	this.route('/:postsLimit?',{
			name:'postsList'
		});
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
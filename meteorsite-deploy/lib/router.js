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
		return {sort: this.sort, limit: this.postsLimit()};
	},
	subscriptions: function() {
		this.postsSub = Meteor.subscribe('posts', this.findOptions());
	},
	posts: function() {
		return Posts.find({}, this.findOptions());
	},
	data: function() {
		var hasMore = this.posts().count() === this.postsLimit();
		return {
		posts: this.posts(),
		ready: this.postsSub.ready,
		nextPath: hasMore ? this.nextPath() : null
		};
	}
});

NewPostsController = PostsListController.extend({
	sort: {submitted: -1, _id: -1},
	nextPath: function() {
	return Router.routes.newPosts.path({
			postsLimit: this.postsLimit() + this.increment
		});
	}
});

BestPostsController = PostsListController.extend({
	sort: {votes: -1, submitted: -1, _id: -1},
	nextPath: function() {
		return Router.routes.bestPosts.path({
			postsLimit: this.postsLimit() + this.increment
		});
	}
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.map( function() {
	this.route('/posts/:_id', {
	        name: 'postPage',
	        waitOn: function() {
						return [
							Meteor.subscribe('singlePost', this.params._id),
							Meteor.subscribe('comments', this.params._id)
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
				return Meteor.subscribe('singlePost', this.params._id);
			},
			data: function() { return Posts.findOne(this.params._id); }
		});

	this.route('/posts/:_id/edit', {
			name: 'postEdit',
			waitOn: function() {
				return Meteor.subscribe('singlePost', this.params._id);
			},
			data: function() { return Posts.findOne(this.params._id); }
		});

	this.route('/new/:postsLimit?',{
			name:'newPosts'
		});

	this.route('/best/:postsLimit?',{
			name:'bestPosts'
		});

	// Redundant as the '/new/:postsLimit?'
	// is now the default setting of the website
	// Under the guise of '/'
	/*
	this.route('/:postsLimit?',{
			name:'postsList'
		});
	*/
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
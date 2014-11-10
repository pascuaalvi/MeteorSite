Router.configure ({
	layoutTemplate: "layout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.route('postsList',{path:'/'});

Router.route('postPage', {
        path: '/posts/:_id',
        data: function() { return Posts.findOne(this.params._id); }
    });

Router.route('/submit', {name: 'postSubmit'});

Router.onBeforeAction('dataNotFound',{only:'postPage'})
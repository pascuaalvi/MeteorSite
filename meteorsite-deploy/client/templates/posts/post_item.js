var POST_HEIGHT = 80;
var Positions = new Mongo.Collection(null); // null as it is non-sub/pub able

Template.postItem.helpers({
domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
isAuthorOfPost: function(){
		var isAuthorOf = (this.userId === Meteor.userId());
		return isAuthorOf;
	},
commentsCount: function() {
		return Posts.find(this._id).fetch()[0].commentsCount;
	},
upvotedClass: function() {
  var userId = Meteor.userId();
  if (userId && !_.include(this.upvoters, userId)) {
    return 'btn-primary upvoteable';
  }
  else {
    return 'disabled'; }
  },
attributes: function() {
    var post = _.extend({}, Positions.findOne({postId: this._id}), this);
    var newPosition = post._rank * POST_HEIGHT; // New position according to rank
    var attributes = {};

    if (_.isUndefined(post.position)) {
      attributes.class = 'post invisible';
      // This is to hide any new posts
    }
    else{
      // When the rankings are updated using the helper function,
      //  the element will receive the animate css-class.
      // Due to its 'opacity: 1;' value, it will fade in a gradient from 0 to 1.
      var offset = post.position - newPosition;
      // This will calculate the relative distance of the element from the destination
      //  to its current position.
      attributes.style = "top: " + offset + "px";
      if (offset === 0)
      attributes.class = "post animate"
    }

    Meteor.setTimeout(function() {
      Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
    });
    return attributes;
  }
});

Template.postItem.events({
  'click .upvoteable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
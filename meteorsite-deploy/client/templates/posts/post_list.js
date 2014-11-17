Template.postsList.helpers({
  postsWithRank: function() {
    return this.posts.map(function(post, index, cursor) {
      // Adds the _rank property to each post (document)
      post._rank = index;
      return post;
    });
  }
});
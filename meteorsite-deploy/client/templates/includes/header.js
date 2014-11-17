Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    // The 'arguments' parameter in the following function is a way of
    //  passing an unspecified number of anonymous parameters to a function.

    var args = Array.prototype.slice.call(arguments, 0);
    // Array that contain sets of 3 things:
    //  - The current route
    //  - The route being tested (either newPosts or bestPosts)
    //  - The Spacebar Object for placeholding

    args.pop();
    // Gets rid of the hash at the end of the Spacebar object

    var active = _.any(args, function(name) {
      // For each set, find out if the current route is equal to the tested route
      return Router.current() && Router.current().route.getName() === name
    });


    //  If so, then the tested route is active, and its css-class is changed accordingly
    //  Vice versa.

    return active && 'active'; }
    // Returns false if false, returns 'active' if true.
});
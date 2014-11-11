isAuthorOf = function(userid,doc){
		var isAuthorOf = (doc.author === Meteor.user().username);
		console.log(doc.author +" ? "+ Meteor.user().username);
		console.log('isAuthorOf: '+ isAuthorOf + ', ' + 'IsLoggedIn: '+ (!! userid));
		return (!! userid) && isAuthorOf;
	}
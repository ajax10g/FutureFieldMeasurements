(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Users;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/perak_user-roles/packages/perak_user-roles.js                                     //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
(function () {                                                                                // 1
                                                                                              // 2
//////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                      //    // 4
// packages/perak:user-roles/both/collections/users.js                                  //    // 5
//                                                                                      //    // 6
//////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                        //    // 8
Users = Meteor.users;                                                                   // 1  // 9
                                                                                        // 2  // 10
Users.isInRole = function (userId, role) {                                              // 3  // 11
  var user = Users.findOne({_id: userId});                                              // 4  // 12
  return !!(user && user.roles && user.roles.indexOf(role) != -1);                      // 5  // 13
};                                                                                      // 6  // 14
                                                                                        // 7  // 15
Users.isInRoles = function (userId, roleList) {                                         // 8  // 16
	var user = Users.findOne({_id: userId});                                               // 9  // 17
	if(!user || !user.roles) {                                                             // 10
		return false;                                                                         // 11
	}                                                                                      // 12
                                                                                        // 13
	var granted = _.intersection(roleList, user.roles);                                    // 14
	if(!granted || granted.length == 0) {                                                  // 15
		return false;                                                                         // 16
	}                                                                                      // 17
	return true;                                                                           // 18
};                                                                                      // 19
                                                                                        // 20
Users.isAdmin = function (userId) {                                                     // 21
  return Users.isInRole(userId, "admin");                                               // 22
};                                                                                      // 23
                                                                                        // 24
Users.isAdminOrInRole = function (userId, role) {                                       // 25
  return Users.isInRole(userId, "admin") || Users.isInRole(userId, role);               // 26
};                                                                                      // 27
                                                                                        // 28
//////////////////////////////////////////////////////////////////////////////////////////    // 37
                                                                                              // 38
}).call(this);                                                                                // 39
                                                                                              // 40
                                                                                              // 41
                                                                                              // 42
                                                                                              // 43
                                                                                              // 44
                                                                                              // 45
(function () {                                                                                // 46
                                                                                              // 47
//////////////////////////////////////////////////////////////////////////////////////////    // 48
//                                                                                      //    // 49
// packages/perak:user-roles/server/collections/users.js                                //    // 50
//                                                                                      //    // 51
//////////////////////////////////////////////////////////////////////////////////////////    // 52
                                                                                        //    // 53
// If you want to modify the rights on user updates                                     // 1  // 54
// then add a new allow rule in your app.                                               // 2  // 55
                                                                                        // 3  // 56
Users.allow({                                                                           // 4  // 57
	// doesn't allow insert or removal of users from untrusted code                        // 5  // 58
    update: function (userId, doc, fieldNames, modifier) {                              // 6  // 59
        return Users.isAdmin(userId)                                                    // 7  // 60
        		// only admins can update user roles via the client                           // 8  // 61
        		|| (doc._id === userId && !_.contains(fieldNames, 'roles'));                  // 9  // 62
    }                                                                                   // 10
});                                                                                     // 11
//////////////////////////////////////////////////////////////////////////////////////////    // 65
                                                                                              // 66
}).call(this);                                                                                // 67
                                                                                              // 68
                                                                                              // 69
                                                                                              // 70
                                                                                              // 71
                                                                                              // 72
                                                                                              // 73
(function () {                                                                                // 74
                                                                                              // 75
//////////////////////////////////////////////////////////////////////////////////////////    // 76
//                                                                                      //    // 77
// packages/perak:user-roles/server/publications/admin_user.js                          //    // 78
//                                                                                      //    // 79
//////////////////////////////////////////////////////////////////////////////////////////    // 80
                                                                                        //    // 81
Meteor.publish("admin_user", function(_id){                                             // 1  // 82
	return Users.isAdmin(this.userId) ? Users.find({_id: _id}) : this.ready();             // 2  // 83
});                                                                                     // 3  // 84
                                                                                        // 4  // 85
//////////////////////////////////////////////////////////////////////////////////////////    // 86
                                                                                              // 87
}).call(this);                                                                                // 88
                                                                                              // 89
                                                                                              // 90
                                                                                              // 91
                                                                                              // 92
                                                                                              // 93
                                                                                              // 94
(function () {                                                                                // 95
                                                                                              // 96
//////////////////////////////////////////////////////////////////////////////////////////    // 97
//                                                                                      //    // 98
// packages/perak:user-roles/server/publications/admin_users.js                         //    // 99
//                                                                                      //    // 100
//////////////////////////////////////////////////////////////////////////////////////////    // 101
                                                                                        //    // 102
Meteor.publish("admin_users", function() {                                              // 1  // 103
	return Users.isAdmin(this.userId) ? Meteor.users.find({}, {fields: {profile: 1, roles: 1, emails: 1}}) : this.ready();
});                                                                                     // 3  // 105
                                                                                        // 4  // 106
//////////////////////////////////////////////////////////////////////////////////////////    // 107
                                                                                              // 108
}).call(this);                                                                                // 109
                                                                                              // 110
                                                                                              // 111
                                                                                              // 112
                                                                                              // 113
                                                                                              // 114
                                                                                              // 115
(function () {                                                                                // 116
                                                                                              // 117
//////////////////////////////////////////////////////////////////////////////////////////    // 118
//                                                                                      //    // 119
// packages/perak:user-roles/server/publications/current_user_data.js                   //    // 120
//                                                                                      //    // 121
//////////////////////////////////////////////////////////////////////////////////////////    // 122
                                                                                        //    // 123
Meteor.publish("current_user_data", function () {                                       // 1  // 124
	return Meteor.users.find( { _id: this.userId }, { fields: {profile: 1 , roles: 1} } ); // 2  // 125
});                                                                                     // 3  // 126
                                                                                        // 4  // 127
//////////////////////////////////////////////////////////////////////////////////////////    // 128
                                                                                              // 129
}).call(this);                                                                                // 130
                                                                                              // 131
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['perak:user-roles'] = {
  Users: Users
};

})();

//# sourceMappingURL=perak_user-roles.js.map

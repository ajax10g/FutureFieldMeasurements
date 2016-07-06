(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
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
(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/perak:user-roles/both/collections/users.js                                  //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
Users = Meteor.users;                                                                   // 1
                                                                                        // 2
Users.isInRole = function (userId, role) {                                              // 3
  var user = Users.findOne({_id: userId});                                              // 4
  return !!(user && user.roles && user.roles.indexOf(role) != -1);                      // 5
};                                                                                      // 6
                                                                                        // 7
Users.isInRoles = function (userId, roleList) {                                         // 8
	var user = Users.findOne({_id: userId});                                               // 9
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
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/perak:user-roles/server/collections/users.js                                //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// If you want to modify the rights on user updates                                     // 1
// then add a new allow rule in your app.                                               // 2
                                                                                        // 3
Users.allow({                                                                           // 4
	// doesn't allow insert or removal of users from untrusted code                        // 5
    update: function (userId, doc, fieldNames, modifier) {                              // 6
        return Users.isAdmin(userId)                                                    // 7
        		// only admins can update user roles via the client                           // 8
        		|| (doc._id === userId && !_.contains(fieldNames, 'roles'));                  // 9
    }                                                                                   // 10
});                                                                                     // 11
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/perak:user-roles/server/publications/admin_user.js                          //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
Meteor.publish("admin_user", function(_id){                                             // 1
	return Users.isAdmin(this.userId) ? Users.find({_id: _id}) : this.ready();             // 2
});                                                                                     // 3
                                                                                        // 4
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/perak:user-roles/server/publications/admin_users.js                         //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
Meteor.publish("admin_users", function() {                                              // 1
	return Users.isAdmin(this.userId) ? Meteor.users.find({}, {fields: {profile: 1, roles: 1, emails: 1}}) : this.ready();
});                                                                                     // 3
                                                                                        // 4
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/perak:user-roles/server/publications/current_user_data.js                   //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
Meteor.publish("current_user_data", function () {                                       // 1
	return Meteor.users.find( { _id: this.userId }, { fields: {profile: 1 , roles: 1} } ); // 2
});                                                                                     // 3
                                                                                        // 4
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['perak:user-roles'] = {}, {
  Users: Users
});

})();

//# sourceMappingURL=perak_user-roles.js.map

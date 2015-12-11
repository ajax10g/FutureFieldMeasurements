(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/ethercat.js                                      //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Ethercat.allow({                                                       // 1
	insert: function (userId, doc) {                                      // 2
		return Ethercat.userCanInsert(userId, doc);                          // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return Ethercat.userCanUpdate(userId, doc);                          // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return Ethercat.userCanRemove(userId, doc);                          // 11
	}                                                                     //
});                                                                    //
                                                                       //
Ethercat.before.insert(function (userId, doc) {                        // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
Ethercat.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
Ethercat.before.remove(function (userId, doc) {});                     // 33
                                                                       //
Ethercat.after.insert(function (userId, doc) {});                      // 37
                                                                       //
Ethercat.after.update(function (userId, doc, fieldNames, modifier, options) {});
                                                                       //
Ethercat.after.remove(function (userId, doc) {});                      // 45
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercat.js.map

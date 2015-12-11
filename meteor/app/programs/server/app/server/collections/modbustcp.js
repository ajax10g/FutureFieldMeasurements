(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/modbustcp.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
ModbusTcp.allow({                                                      // 1
	insert: function (userId, doc) {                                      // 2
		return ModbusTcp.userCanInsert(userId, doc);                         // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return ModbusTcp.userCanUpdate(userId, doc);                         // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return ModbusTcp.userCanRemove(userId, doc);                         // 11
	}                                                                     //
});                                                                    //
                                                                       //
ModbusTcp.before.insert(function (userId, doc) {                       // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
ModbusTcp.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
ModbusTcp.before.remove(function (userId, doc) {});                    // 33
                                                                       //
ModbusTcp.after.insert(function (userId, doc) {});                     // 37
                                                                       //
ModbusTcp.after.update(function (userId, doc, fieldNames, modifier, options) {});
                                                                       //
ModbusTcp.after.remove(function (userId, doc) {});                     // 45
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcp.js.map

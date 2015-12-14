(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/modbustcpread.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
ModbusTcpRead.allow({                                                  // 1
	insert: function (userId, doc) {                                      // 2
		return ModbusTcpRead.userCanInsert(userId, doc);                     // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return ModbusTcpRead.userCanUpdate(userId, doc);                     // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return ModbusTcpRead.userCanRemove(userId, doc);                     // 11
	}                                                                     //
});                                                                    //
                                                                       //
ModbusTcpRead.before.insert(function (userId, doc) {                   // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
ModbusTcpRead.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
ModbusTcpRead.before.remove(function (userId, doc) {});                // 33
                                                                       //
ModbusTcpRead.after.insert(function (userId, doc) {});                 // 37
                                                                       //
ModbusTcpRead.after.update(function (userId, doc, fieldNames, modifier, options) {});
                                                                       //
ModbusTcpRead.after.remove(function (userId, doc) {});                 // 45
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcpread.js.map

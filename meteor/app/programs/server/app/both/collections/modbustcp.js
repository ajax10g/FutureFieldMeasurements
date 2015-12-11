(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/modbustcp.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.ModbusTcp = new Mongo.Collection("modbustcp");                    // 1
                                                                       //
this.ModbusTcp.userCanInsert = function (userId, doc) {                // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.ModbusTcp.userCanUpdate = function (userId, doc) {                // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.ModbusTcp.userCanRemove = function (userId, doc) {                // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcp.js.map

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/modbustcpread.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.ModbusTcpRead = new Mongo.Collection("modbustcpread");            // 1
                                                                       //
this.ModbusTcpRead.userCanInsert = function (userId, doc) {            // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.ModbusTcpRead.userCanUpdate = function (userId, doc) {            // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.ModbusTcpRead.userCanRemove = function (userId, doc) {            // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcpread.js.map

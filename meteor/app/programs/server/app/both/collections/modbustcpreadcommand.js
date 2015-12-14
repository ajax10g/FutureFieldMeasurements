(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/modbustcpreadcommand.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.ModbusTcpReadCommand = new Mongo.Collection("modbustcpreadcommand");
                                                                       //
this.ModbusTcpReadCommand.userCanInsert = function (userId, doc) {     // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.ModbusTcpReadCommand.userCanUpdate = function (userId, doc) {     // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.ModbusTcpReadCommand.userCanRemove = function (userId, doc) {     // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcpreadcommand.js.map

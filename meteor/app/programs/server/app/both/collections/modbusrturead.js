(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/modbusrturead.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.ModbusRtuRead = new Mongo.Collection("modbusrturead");            // 1
                                                                       //
this.ModbusRtuRead.userCanInsert = function (userId, doc) {            // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.ModbusRtuRead.userCanUpdate = function (userId, doc) {            // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.ModbusRtuRead.userCanRemove = function (userId, doc) {            // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbusrturead.js.map

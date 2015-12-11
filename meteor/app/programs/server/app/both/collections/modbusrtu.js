(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/modbusrtu.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.ModbusRtu = new Mongo.Collection("modbusrtu");                    // 1
                                                                       //
this.ModbusRtu.userCanInsert = function (userId, doc) {                // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.ModbusRtu.userCanUpdate = function (userId, doc) {                // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.ModbusRtu.userCanRemove = function (userId, doc) {                // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbusrtu.js.map

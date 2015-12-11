(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/ethercatunits.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.EthercatUnits = new Mongo.Collection("ethercatunits");            // 1
                                                                       //
this.EthercatUnits.userCanInsert = function (userId, doc) {            // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.EthercatUnits.userCanUpdate = function (userId, doc) {            // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.EthercatUnits.userCanRemove = function (userId, doc) {            // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercatunits.js.map

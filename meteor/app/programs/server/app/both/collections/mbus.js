(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/mbus.js                                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.Mbus = new Mongo.Collection("mbus");                              // 1
                                                                       //
this.Mbus.userCanInsert = function (userId, doc) {                     // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.Mbus.userCanUpdate = function (userId, doc) {                     // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.Mbus.userCanRemove = function (userId, doc) {                     // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=mbus.js.map

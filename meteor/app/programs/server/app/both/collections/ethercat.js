(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/ethercat.js                                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.Ethercat = new Mongo.Collection("ethercat");                      // 1
                                                                       //
this.Ethercat.userCanInsert = function (userId, doc) {                 // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.Ethercat.userCanUpdate = function (userId, doc) {                 // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.Ethercat.userCanRemove = function (userId, doc) {                 // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercat.js.map

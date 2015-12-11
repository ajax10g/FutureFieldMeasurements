(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/signals.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.Signals = new Mongo.Collection("signals");                        // 1
                                                                       //
this.Signals.userCanInsert = function (userId, doc) {                  // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.Signals.userCanUpdate = function (userId, doc) {                  // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.Signals.userCanRemove = function (userId, doc) {                  // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=signals.js.map

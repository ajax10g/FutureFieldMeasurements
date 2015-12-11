(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/onewire.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.OneWire = new Mongo.Collection("onewire");                        // 1
                                                                       //
this.OneWire.userCanInsert = function (userId, doc) {                  // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.OneWire.userCanUpdate = function (userId, doc) {                  // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.OneWire.userCanRemove = function (userId, doc) {                  // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=onewire.js.map

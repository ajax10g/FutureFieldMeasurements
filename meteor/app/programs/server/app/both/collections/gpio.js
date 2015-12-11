(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// both/collections/gpio.js                                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.Gpio = new Mongo.Collection("gpio");                              // 1
                                                                       //
this.Gpio.userCanInsert = function (userId, doc) {                     // 3
	return true;                                                          // 4
};                                                                     //
                                                                       //
this.Gpio.userCanUpdate = function (userId, doc) {                     // 7
	return true;                                                          // 8
};                                                                     //
                                                                       //
this.Gpio.userCanRemove = function (userId, doc) {                     // 11
	return true;                                                          // 12
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=gpio.js.map

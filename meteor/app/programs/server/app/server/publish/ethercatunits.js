(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/ethercatunits.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("ethercatunits", function () {                          // 1
    return EthercatUnits.find();                                       // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercatunits.js.map

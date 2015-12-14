(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/modbustcpread.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("modbustcpread", function () {                          // 1
    return ModbusTcpRead.find();                                       // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcpread.js.map

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/modbusrturead.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("modbusrturead", function () {                          // 1
    return ModbusRtuRead.find();                                       // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbusrturead.js.map

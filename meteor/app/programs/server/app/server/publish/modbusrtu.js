(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/modbusrtu.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("modbusrtu", function () {                              // 1
    return ModbusRtu.find();                                           // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbusrtu.js.map

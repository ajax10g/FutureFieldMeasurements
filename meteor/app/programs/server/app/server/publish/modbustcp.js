(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/modbustcp.js                                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("modbustcp", function () {                              // 1
    return ModbusTcp.find();                                           // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcp.js.map

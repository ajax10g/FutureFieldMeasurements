(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publish/modbustcpreadcommand.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Meteor.publish("modbustcpreadcommand", function () {                   // 1
    return ModbusTcpReadCommand.find();                                // 2
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=modbustcpreadcommand.js.map

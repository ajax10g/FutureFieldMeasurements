(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/ethercat.js                                      //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Ethercat.allow({                                                       // 1
  insert: function (userId, doc) {                                     // 2
    return Ethercat.userCanInsert(userId, doc);                        // 3
  },                                                                   //
                                                                       //
  update: function (userId, doc, fields, modifier) {                   // 6
    return Ethercat.userCanUpdate(userId, doc);                        // 7
  },                                                                   //
                                                                       //
  remove: function (userId, doc) {                                     // 10
    return Ethercat.userCanRemove(userId, doc);                        // 11
  }                                                                    //
});                                                                    //
                                                                       //
Ethercat.before.insert(function (userId, doc) {                        // 15
  doc.createdAt = new Date();                                          // 16
  doc.createdBy = userId;                                              // 17
  doc.modifiedAt = doc.createdAt;                                      // 18
  doc.modifiedBy = doc.createdBy;                                      // 19
                                                                       //
  if (!doc.createdBy) doc.createdBy = userId;                          // 22
});                                                                    //
                                                                       //
function getEthercatValue(_in) {                                       // 25
  //console.log(_in);                                                  //
  var values = Ethercat.findOne();                                     // 27
  if (values) {                                                        // 28
    var memory = [];                                                   // 29
    values.message.obytes.forEach(function (o, i) {                    // 30
      memory.push(o);                                                  // 31
    });                                                                //
    values.message.ibytes.forEach(function (o, i) {                    // 33
      memory.push(o);                                                  // 34
    });                                                                //
                                                                       //
    var oby = _in.offsetbyte;                                          // 37
    var obi = _in.offsetbit;                                           // 38
    var bl = _in.bitlength;                                            // 39
                                                                       //
    var nofBytesWithOffset = Math.ceil((bl + obi) / 8);                // 41
    var nofBitsWithOffset = (bl + obi) % 8;                            // 42
                                                                       //
    //Group affected bytes into an int                                 //
    var appendedMemory = 0;                                            // 45
    for (var i = 0; i < nofBytesWithOffset; i++) {                     // 46
      appendedMemory += memory[oby + i] << 8 * i;                      // 47
    }                                                                  //
                                                                       //
    var mask = 1;                                                      // 50
    for (var i = 1; i < bl; i++) {                                     // 51
      //append ones                                                    //
      mask = mask << 1;                                                // 52
      mask += 1;                                                       // 53
    }                                                                  //
                                                                       //
    for (var i = 0; i < obi; i++) {                                    // 56
      //append zeros                                                   //
      mask = mask << 1;                                                // 57
    }                                                                  //
    return (appendedMemory & mask) >> obi;                             // 59
  } else {                                                             //
    throw new Meteor.Error("No EtherCat data available.");             // 61
  }                                                                    //
}                                                                      //
                                                                       //
Ethercat.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};                                 // 66
  modifier.$set.modifiedAt = new Date();                               // 67
  modifier.$set.modifiedBy = userId;                                   // 68
});                                                                    //
                                                                       //
Ethercat.before.remove(function (userId, doc) {});                     // 73
                                                                       //
Ethercat.after.insert(function (userId, doc) {});                      // 77
                                                                       //
Ethercat.after.update(function (userId, doc, fieldNames, modifier, options) {
  console.log("Ethercat - afterUpdate");                               // 82
  var esignals = Signals.find({ bus: "ethercat" });                    // 83
  esignals.forEach(function (sig, i) {                                 // 84
    var val = getEthercatValue(sig);                                   // 85
    Signals.update(sig._id, { $set: { value: sig.scale * (val + sig.offsetA) + sig.offsetB, raw: val, timestamp: doc.message.time } });
  });                                                                  //
});                                                                    //
                                                                       //
Ethercat.after.remove(function (userId, doc) {});                      // 90
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercat.js.map

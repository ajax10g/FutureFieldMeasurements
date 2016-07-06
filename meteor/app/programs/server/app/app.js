var require = meteorInstall({"lib":{"number_utils.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// lib/number_utils.js                                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.isFloat = function (n) {                                                                                    // 1
    return n === +n && n !== (n | 0);                                                                            // 2
};                                                                                                               // 3
                                                                                                                 //
this.isInteger = function (n) {                                                                                  // 5
    return n === +n && n === (n | 0);                                                                            // 6
};                                                                                                               // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_utils.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// lib/object_utils.js                                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
/*                                                                                                               //
   Returns property value, where property name is given as path.                                                 //
                                                                                                                 //
   Example:                                                                                                      //
                                                                                                                 //
       getPropertyValue("x.y.z", {x: { y: { z: 123}}});                                                          //
*/                                                                                                               //
                                                                                                                 //
this.getPropertyValue = function (propertyName, obj) {                                                           // 9
	return propertyName.split('.').reduce(function (o, i) {                                                         // 10
		return o[i];                                                                                                   // 10
	}, obj);                                                                                                        // 10
};                                                                                                               // 11
                                                                                                                 //
/*                                                                                                               //
   converts properties in format { "x.y": "z" } to { x: { y: "z" } }                                             //
*/                                                                                                               //
                                                                                                                 //
this.deepen = function (o) {                                                                                     // 18
	var oo = {},                                                                                                    // 19
	    t,                                                                                                          // 19
	    parts,                                                                                                      // 19
	    part;                                                                                                       // 19
	for (var k in o) {                                                                                              // 20
		t = oo;                                                                                                        // 21
		parts = k.split('.');                                                                                          // 22
		var key = parts.pop();                                                                                         // 23
		while (parts.length) {                                                                                         // 24
			part = parts.shift();                                                                                         // 25
			t = t[part] = t[part] || {};                                                                                  // 26
		}                                                                                                              // 27
		t[key] = o[k];                                                                                                 // 28
	}                                                                                                               // 29
	return oo;                                                                                                      // 30
};                                                                                                               // 31
                                                                                                                 //
/*                                                                                                               //
	Function converts array of objects to csv, tsv or json string                                                   //
                                                                                                                 //
	exportFields: list of object keys to export (array of strings)                                                  //
	fileType: can be "json", "csv", "tsv" (string)                                                                  //
*/                                                                                                               //
                                                                                                                 //
this.convertArrayOfObjects = function (data, exportFields, fileType) {                                           // 40
	data = data || [];                                                                                              // 41
	fileType = fileType || "csv";                                                                                   // 42
	exportFields = exportFields || [];                                                                              // 43
                                                                                                                 //
	var str = "";                                                                                                   // 45
	// export to JSON                                                                                               //
	if (fileType == "json") {                                                                                       // 47
                                                                                                                 //
		var tmp = [];                                                                                                  // 49
		_.each(data, function (doc) {                                                                                  // 50
			var obj = {};                                                                                                 // 51
			_.each(exportFields, function (field) {                                                                       // 52
				obj[field] = doc[field];                                                                                     // 53
			});                                                                                                           // 54
			tmp.push(obj);                                                                                                // 55
		});                                                                                                            // 56
                                                                                                                 //
		str = JSON.stringify(tmp);                                                                                     // 58
	}                                                                                                               // 59
                                                                                                                 //
	// export to CSV or TSV                                                                                         //
	if (fileType == "csv" || fileType == "tsv") {                                                                   // 62
		var columnSeparator = "";                                                                                      // 63
		if (fileType == "csv") {                                                                                       // 64
			columnSeparator = ",";                                                                                        // 65
		}                                                                                                              // 66
		if (fileType == "tsv") {                                                                                       // 67
			columnSeparator = "\t";                                                                                       // 68
		}                                                                                                              // 69
                                                                                                                 //
		_.each(exportFields, function (field, i) {                                                                     // 71
			if (i > 0) {                                                                                                  // 72
				str = str + columnSeparator;                                                                                 // 73
			}                                                                                                             // 74
			str = str + "\"" + field + "\"";                                                                              // 75
		});                                                                                                            // 76
		str = str + "\r\n";                                                                                            // 77
                                                                                                                 //
		_.each(data, function (doc) {                                                                                  // 79
			_.each(exportFields, function (field, i) {                                                                    // 80
				if (i > 0) {                                                                                                 // 81
					str = str + columnSeparator;                                                                                // 82
				}                                                                                                            // 83
                                                                                                                 //
				var value = getPropertyValue(field, doc) + "";                                                               // 85
				value = value.replace(/"/g, '""');                                                                           // 86
				if (typeof value == "undefined") str = str + "\"\"";else str = str + "\"" + value + "\"";                    // 87
			});                                                                                                           // 91
			str = str + "\r\n";                                                                                           // 92
		});                                                                                                            // 93
	}                                                                                                               // 94
                                                                                                                 //
	return str;                                                                                                     // 96
};                                                                                                               // 97
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"string_utils.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// lib/string_utils.js                                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.escapeRegEx = function (string) {                                                                           // 1
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");                                                   // 2
};                                                                                                               // 3
                                                                                                                 //
this.replaceSubstrings = function (string, find, replace) {                                                      // 5
	return string.replace(new RegExp(escapeRegEx(find), 'g'), replace);                                             // 6
};                                                                                                               // 7
                                                                                                                 //
this.joinStrings = function (stringArray, join) {                                                                // 9
	var sep = join || ", ";                                                                                         // 10
	var res = "";                                                                                                   // 11
	_.each(stringArray, function (str) {                                                                            // 12
		if (str) {                                                                                                     // 13
			if (res) res = res + sep;                                                                                     // 14
			res = res + str;                                                                                              // 16
		}                                                                                                              // 17
	});                                                                                                             // 18
	return res;                                                                                                     // 19
};                                                                                                               // 20
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"both":{"collections":{"ethercat.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/ethercat.js                                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.Ethercat = new Mongo.Collection("ethercat");                                                                // 1
                                                                                                                 //
this.Ethercat.userCanInsert = function (userId, doc) {                                                           // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.Ethercat.userCanUpdate = function (userId, doc) {                                                           // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.Ethercat.userCanRemove = function (userId, doc) {                                                           // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ethercatunits.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/ethercatunits.js                                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.EthercatUnits = new Mongo.Collection("ethercatunits");                                                      // 1
                                                                                                                 //
this.EthercatUnits.userCanInsert = function (userId, doc) {                                                      // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.EthercatUnits.userCanUpdate = function (userId, doc) {                                                      // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.EthercatUnits.userCanRemove = function (userId, doc) {                                                      // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"gpio.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/gpio.js                                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.Gpio = new Mongo.Collection("gpio");                                                                        // 1
                                                                                                                 //
this.Gpio.userCanInsert = function (userId, doc) {                                                               // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.Gpio.userCanUpdate = function (userId, doc) {                                                               // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.Gpio.userCanRemove = function (userId, doc) {                                                               // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mbus.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/mbus.js                                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.Mbus = new Mongo.Collection("mbus");                                                                        // 1
                                                                                                                 //
this.Mbus.userCanInsert = function (userId, doc) {                                                               // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.Mbus.userCanUpdate = function (userId, doc) {                                                               // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.Mbus.userCanRemove = function (userId, doc) {                                                               // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrtu.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/modbusrtu.js                                                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.ModbusRtu = new Mongo.Collection("modbusrtu");                                                              // 1
                                                                                                                 //
this.ModbusRtu.userCanInsert = function (userId, doc) {                                                          // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.ModbusRtu.userCanUpdate = function (userId, doc) {                                                          // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.ModbusRtu.userCanRemove = function (userId, doc) {                                                          // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrturead.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/modbusrturead.js                                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.ModbusRtuRead = new Mongo.Collection("modbusrturead");                                                      // 1
                                                                                                                 //
this.ModbusRtuRead.userCanInsert = function (userId, doc) {                                                      // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.ModbusRtuRead.userCanUpdate = function (userId, doc) {                                                      // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.ModbusRtuRead.userCanRemove = function (userId, doc) {                                                      // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcp.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/modbustcp.js                                                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.ModbusTcp = new Mongo.Collection("modbustcp");                                                              // 1
                                                                                                                 //
this.ModbusTcp.userCanInsert = function (userId, doc) {                                                          // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.ModbusTcp.userCanUpdate = function (userId, doc) {                                                          // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.ModbusTcp.userCanRemove = function (userId, doc) {                                                          // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpread.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/modbustcpread.js                                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.ModbusTcpRead = new Mongo.Collection("modbustcpread");                                                      // 1
                                                                                                                 //
this.ModbusTcpRead.userCanInsert = function (userId, doc) {                                                      // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.ModbusTcpRead.userCanUpdate = function (userId, doc) {                                                      // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.ModbusTcpRead.userCanRemove = function (userId, doc) {                                                      // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpreadcommand.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/modbustcpreadcommand.js                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.ModbusTcpReadCommand = new Mongo.Collection("modbustcpreadcommand");                                        // 1
                                                                                                                 //
this.ModbusTcpReadCommand.userCanInsert = function (userId, doc) {                                               // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.ModbusTcpReadCommand.userCanUpdate = function (userId, doc) {                                               // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.ModbusTcpReadCommand.userCanRemove = function (userId, doc) {                                               // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onewire.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/onewire.js                                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.OneWire = new Mongo.Collection("onewire");                                                                  // 1
                                                                                                                 //
this.OneWire.userCanInsert = function (userId, doc) {                                                            // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.OneWire.userCanUpdate = function (userId, doc) {                                                            // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.OneWire.userCanRemove = function (userId, doc) {                                                            // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"signals.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/collections/signals.js                                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
this.Signals = new Mongo.Collection("signals");                                                                  // 1
                                                                                                                 //
this.Signals.userCanInsert = function (userId, doc) {                                                            // 3
	return true;                                                                                                    // 4
};                                                                                                               // 5
                                                                                                                 //
this.Signals.userCanUpdate = function (userId, doc) {                                                            // 7
	return true;                                                                                                    // 8
};                                                                                                               // 9
                                                                                                                 //
this.Signals.userCanRemove = function (userId, doc) {                                                            // 11
	return true;                                                                                                    // 12
};                                                                                                               // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"joins":{"joins.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// both/joins/joins.js                                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"collections":{"ethercat.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/ethercat.js                                                                                //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Ethercat.allow({                                                                                                 // 1
  insert: function insert(userId, doc) {                                                                         // 2
    return Ethercat.userCanInsert(userId, doc);                                                                  // 3
  },                                                                                                             // 4
                                                                                                                 //
  update: function update(userId, doc, fields, modifier) {                                                       // 6
    return Ethercat.userCanUpdate(userId, doc);                                                                  // 7
  },                                                                                                             // 8
                                                                                                                 //
  remove: function remove(userId, doc) {                                                                         // 10
    return Ethercat.userCanRemove(userId, doc);                                                                  // 11
  }                                                                                                              // 12
});                                                                                                              // 1
                                                                                                                 //
Ethercat.before.insert(function (userId, doc) {                                                                  // 15
  doc.createdAt = new Date();                                                                                    // 16
  doc.createdBy = userId;                                                                                        // 17
  doc.modifiedAt = doc.createdAt;                                                                                // 18
  doc.modifiedBy = doc.createdBy;                                                                                // 19
                                                                                                                 //
  if (!doc.createdBy) doc.createdBy = userId;                                                                    // 22
});                                                                                                              // 23
                                                                                                                 //
function getEthercatValue(_in) {                                                                                 // 25
  //console.log(_in);                                                                                            //
  var values = Ethercat.findOne();                                                                               // 27
  if (values) {                                                                                                  // 28
    var memory = [];                                                                                             // 29
    values.message.obytes.forEach(function (o, i) {                                                              // 30
      memory.push(o);                                                                                            // 31
    });                                                                                                          // 32
    values.message.ibytes.forEach(function (o, i) {                                                              // 33
      memory.push(o);                                                                                            // 34
    });                                                                                                          // 35
                                                                                                                 //
    var oby = _in.offsetbyte;                                                                                    // 37
    var obi = _in.offsetbit;                                                                                     // 38
    var bl = _in.bitlength;                                                                                      // 39
                                                                                                                 //
    var nofBytesWithOffset = Math.ceil((bl + obi) / 8);                                                          // 41
    var nofBitsWithOffset = (bl + obi) % 8;                                                                      // 42
                                                                                                                 //
    //Group affected bytes into an int                                                                           //
    var appendedMemory = 0;                                                                                      // 45
    for (var i = 0; i < nofBytesWithOffset; i++) {                                                               // 46
      appendedMemory += memory[oby + i] << 8 * i;                                                                // 47
    }                                                                                                            // 48
                                                                                                                 //
    var mask = 1;                                                                                                // 50
    for (var i = 1; i < bl; i++) {                                                                               // 51
      //append ones                                                                                              //
      mask = mask << 1;                                                                                          // 52
      mask += 1;                                                                                                 // 53
    }                                                                                                            // 54
                                                                                                                 //
    for (var i = 0; i < obi; i++) {                                                                              // 56
      //append zeros                                                                                             //
      mask = mask << 1;                                                                                          // 57
    }                                                                                                            // 58
    return (appendedMemory & mask) >> obi;                                                                       // 59
  } else {                                                                                                       // 60
    throw new Meteor.Error("No EtherCat data available.");                                                       // 61
  }                                                                                                              // 62
}                                                                                                                // 63
                                                                                                                 //
Ethercat.before.update(function (userId, doc, fieldNames, modifier, options) {                                   // 65
  modifier.$set = modifier.$set || {};                                                                           // 66
  modifier.$set.modifiedAt = new Date();                                                                         // 67
  modifier.$set.modifiedBy = userId;                                                                             // 68
});                                                                                                              // 71
                                                                                                                 //
Ethercat.before.remove(function (userId, doc) {});                                                               // 73
                                                                                                                 //
Ethercat.after.insert(function (userId, doc) {});                                                                // 77
                                                                                                                 //
Ethercat.after.update(function (userId, doc, fieldNames, modifier, options) {                                    // 81
  console.log("Ethercat - afterUpdate");                                                                         // 82
  var esignals = Signals.find({ bus: "ethercat" });                                                              // 83
  esignals.forEach(function (sig, i) {                                                                           // 84
    var val = getEthercatValue(sig);                                                                             // 85
    Signals.update(sig._id, { $set: { value: sig.scale * (val + sig.offsetA) + sig.offsetB, raw: val, timestamp: doc.message.time } });
  });                                                                                                            // 87
});                                                                                                              // 88
                                                                                                                 //
Ethercat.after.remove(function (userId, doc) {});                                                                // 90
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ethercatunits.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/ethercatunits.js                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
EthercatUnits.allow({                                                                                            // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return EthercatUnits.userCanInsert(userId, doc);                                                               // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return EthercatUnits.userCanUpdate(userId, doc);                                                               // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return EthercatUnits.userCanRemove(userId, doc);                                                               // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
EthercatUnits.before.insert(function (userId, doc) {                                                             // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
EthercatUnits.before.update(function (userId, doc, fieldNames, modifier, options) {                              // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
EthercatUnits.before.remove(function (userId, doc) {});                                                          // 33
                                                                                                                 //
EthercatUnits.after.insert(function (userId, doc) {                                                              // 37
	var message = doc.message;                                                                                      // 38
	var sensorArr = [];                                                                                             // 39
	for (var num in message.slaves) {                                                                               // 40
		var slave = message.slaves[num];                                                                               // 41
		var sensorid = slave.name;                                                                                     // 42
		for (var num2 in slave.inputs) {                                                                               // 43
			var channel = slave.inputs[num2];                                                                             // 44
			var tempObj = {};                                                                                             // 45
			tempObj["signal"] = sensorid + "." + channel.name + "." + channel.offsetbyte + "." + channel.offsetbit + "." + channel.bitlength;
			tempObj["value"] = null;                                                                                      // 47
			tempObj["timestamp"] = null;                                                                                  // 48
			tempObj["offsetbyte"] = channel.offsetbyte;                                                                   // 49
			tempObj["offsetbit"] = channel.offsetbit;                                                                     // 50
			tempObj["bitlength"] = channel.bitlength;                                                                     // 51
			sensorArr.push(tempObj);                                                                                      // 52
		}                                                                                                              // 53
	}                                                                                                               // 54
                                                                                                                 //
	console.log(sensorArr);                                                                                         // 56
                                                                                                                 //
	sensorArr.forEach(function (sensor, i) {                                                                        // 58
		var searchSignal = Signals.findOne({ "signal": sensor.signal });                                               // 59
		if (searchSignal !== undefined) {                                                                              // 60
			var offsetA = searchSignal.offsetA;                                                                           // 61
			var offsetB = searchSignal.offsetB;                                                                           // 62
			var scale = searchSignal.scale;                                                                               // 63
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                                                                       // 65
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "ethercat", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false, offsetbyte: sensor.offsetbyte, offsetbit: sensor.offsetbit, bitlength: sensor.bitlength } });
		}                                                                                                              // 68
	});                                                                                                             // 69
});                                                                                                              // 70
                                                                                                                 //
EthercatUnits.after.update(function (userId, doc, fieldNames, modifier, options) {                               // 72
	console.log("EtherCatUnits - afterUpdate");                                                                     // 73
	var message = doc.message;                                                                                      // 74
	var sensorArr = [];                                                                                             // 75
	for (var num in message.slaves) {                                                                               // 76
		var slave = message.slaves[num];                                                                               // 77
		var sensorid = slave.name;                                                                                     // 78
		for (var num2 in slave.inputs) {                                                                               // 79
			var channel = slave.inputs[num2];                                                                             // 80
			var tempObj = {};                                                                                             // 81
			console.log(channel);                                                                                         // 82
			tempObj["signal"] = sensorid + "." + channel.name + "." + channel.offsetbyte + "." + channel.offsetbit + "." + channel.bitlength;
			tempObj["value"] = null;                                                                                      // 84
			tempObj["timestamp"] = null;                                                                                  // 85
			tempObj["offsetbyte"] = channel.offsetbyte;                                                                   // 86
			tempObj["offsetbit"] = channel.offsetbit;                                                                     // 87
			tempObj["bitlength"] = channel.bitlength;                                                                     // 88
			sensorArr.push(tempObj);                                                                                      // 89
		}                                                                                                              // 90
	}                                                                                                               // 91
                                                                                                                 //
	console.log(sensorArr);                                                                                         // 93
                                                                                                                 //
	sensorArr.forEach(function (sensor, i) {                                                                        // 95
		var searchSignal = Signals.findOne({ "signal": sensor.signal });                                               // 96
		if (searchSignal !== undefined) {                                                                              // 97
			var offsetA = searchSignal.offsetA;                                                                           // 98
			var offsetB = searchSignal.offsetB;                                                                           // 99
			var scale = searchSignal.scale;                                                                               // 100
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                                                                       // 102
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "ethercat", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: "", offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false, offsetbyte: sensor.offsetbyte, offsetbit: sensor.offsetbit, bitlength: sensor.bitlength } });
		}                                                                                                              // 105
	});                                                                                                             // 106
});                                                                                                              // 107
                                                                                                                 //
EthercatUnits.after.remove(function (userId, doc) {});                                                           // 109
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"gpio.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/gpio.js                                                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Gpio.allow({                                                                                                     // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return Gpio.userCanInsert(userId, doc);                                                                        // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return Gpio.userCanUpdate(userId, doc);                                                                        // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return Gpio.userCanRemove(userId, doc);                                                                        // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
Gpio.before.insert(function (userId, doc) {                                                                      // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
Gpio.before.update(function (userId, doc, fieldNames, modifier, options) {                                       // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
Gpio.before.remove(function (userId, doc) {});                                                                   // 33
                                                                                                                 //
Gpio.after.insert(function (userId, doc) {});                                                                    // 37
                                                                                                                 //
Gpio.after.update(function (userId, doc, fieldNames, modifier, options) {});                                     // 41
                                                                                                                 //
Gpio.after.remove(function (userId, doc) {});                                                                    // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mbus.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/mbus.js                                                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Mbus.allow({                                                                                                     // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return Mbus.userCanInsert(userId, doc);                                                                        // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return Mbus.userCanUpdate(userId, doc);                                                                        // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return Mbus.userCanRemove(userId, doc);                                                                        // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
Mbus.before.insert(function (userId, doc) {                                                                      // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
Mbus.before.update(function (userId, doc, fieldNames, modifier, options) {                                       // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
Mbus.before.remove(function (userId, doc) {});                                                                   // 33
                                                                                                                 //
Mbus.after.insert(function (userId, doc) {});                                                                    // 37
                                                                                                                 //
Mbus.after.update(function (userId, doc, fieldNames, modifier, options) {                                        // 41
	console.log("Mbus - afterUpdate");                                                                              // 42
	var message = doc.message;                                                                                      // 43
	var sensorArr = [];                                                                                             // 44
	for (var key in message) {                                                                                      // 45
		if (message.hasOwnProperty(key)) {                                                                             // 46
			var sensorid = key;                                                                                           // 47
			for (var valuekey in message[key]) {                                                                          // 48
				var tempObj = {};                                                                                            // 49
				tempObj["signal"] = sensorid;                                                                                // 50
				tempObj["value"] = message[key].value;                                                                       // 51
				tempObj["timestamp"] = new Date(message[key].time);                                                          // 52
				tempObj["unit"] = message[key].unit;                                                                         // 53
				sensorArr.push(tempObj);                                                                                     // 54
			}                                                                                                             // 55
		}                                                                                                              // 56
	}                                                                                                               // 57
                                                                                                                 //
	sensorArr.forEach(function (sensor, i) {                                                                        // 59
		var searchSignal = Signals.findOne({ "signal": sensor.signal });                                               // 60
		if (searchSignal !== undefined) {                                                                              // 61
			var offsetA = searchSignal.offsetA;                                                                           // 62
			var offsetB = searchSignal.offsetB;                                                                           // 63
			var scale = searchSignal.scale;                                                                               // 64
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                                                                       // 66
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "mbus", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: sensor.unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false } });
		}                                                                                                              // 69
	});                                                                                                             // 70
});                                                                                                              // 71
                                                                                                                 //
Mbus.after.remove(function (userId, doc) {});                                                                    // 73
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrtu.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/modbusrtu.js                                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
ModbusRtu.allow({                                                                                                // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return ModbusRtu.userCanInsert(userId, doc);                                                                   // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return ModbusRtu.userCanUpdate(userId, doc);                                                                   // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return ModbusRtu.userCanRemove(userId, doc);                                                                   // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
ModbusRtu.before.insert(function (userId, doc) {                                                                 // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
ModbusRtu.before.update(function (userId, doc, fieldNames, modifier, options) {                                  // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
ModbusRtu.before.remove(function (userId, doc) {});                                                              // 33
                                                                                                                 //
ModbusRtu.after.insert(function (userId, doc) {});                                                               // 37
                                                                                                                 //
ModbusRtu.after.update(function (userId, doc, fieldNames, modifier, options) {});                                // 41
                                                                                                                 //
ModbusRtu.after.remove(function (userId, doc) {});                                                               // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrturead.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/modbusrturead.js                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
ModbusRtuRead.allow({                                                                                            // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return ModbusRtuRead.userCanInsert(userId, doc);                                                               // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return ModbusRtuRead.userCanUpdate(userId, doc);                                                               // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return ModbusRtuRead.userCanRemove(userId, doc);                                                               // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
ModbusRtuRead.before.insert(function (userId, doc) {                                                             // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
ModbusRtuRead.before.update(function (userId, doc, fieldNames, modifier, options) {                              // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
ModbusRtuRead.before.remove(function (userId, doc) {});                                                          // 33
                                                                                                                 //
ModbusRtuRead.after.insert(function (userId, doc) {});                                                           // 37
                                                                                                                 //
ModbusRtuRead.after.update(function (userId, doc, fieldNames, modifier, options) {});                            // 41
                                                                                                                 //
ModbusRtuRead.after.remove(function (userId, doc) {});                                                           // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcp.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/modbustcp.js                                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
ModbusTcp.allow({                                                                                                // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return ModbusTcp.userCanInsert(userId, doc);                                                                   // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return ModbusTcp.userCanUpdate(userId, doc);                                                                   // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return ModbusTcp.userCanRemove(userId, doc);                                                                   // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
ModbusTcp.before.insert(function (userId, doc) {                                                                 // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
ModbusTcp.before.update(function (userId, doc, fieldNames, modifier, options) {                                  // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
ModbusTcp.before.remove(function (userId, doc) {});                                                              // 33
                                                                                                                 //
ModbusTcp.after.insert(function (userId, doc) {});                                                               // 37
                                                                                                                 //
ModbusTcp.after.update(function (userId, doc, fieldNames, modifier, options) {});                                // 41
                                                                                                                 //
ModbusTcp.after.remove(function (userId, doc) {});                                                               // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpread.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/modbustcpread.js                                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
ModbusTcpRead.allow({                                                                                            // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return ModbusTcpRead.userCanInsert(userId, doc);                                                               // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return ModbusTcpRead.userCanUpdate(userId, doc);                                                               // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return ModbusTcpRead.userCanRemove(userId, doc);                                                               // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
ModbusTcpRead.before.insert(function (userId, doc) {                                                             // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
ModbusTcpRead.before.update(function (userId, doc, fieldNames, modifier, options) {                              // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
ModbusTcpRead.before.remove(function (userId, doc) {});                                                          // 33
                                                                                                                 //
ModbusTcpRead.after.insert(function (userId, doc) {});                                                           // 37
                                                                                                                 //
ModbusTcpRead.after.update(function (userId, doc, fieldNames, modifier, options) {});                            // 41
                                                                                                                 //
ModbusTcpRead.after.remove(function (userId, doc) {});                                                           // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpreadcommand.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/modbustcpreadcommand.js                                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
ModbusTcpReadCommand.allow({                                                                                     // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return ModbusTcpReadCommand.userCanInsert(userId, doc);                                                        // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return ModbusTcpReadCommand.userCanUpdate(userId, doc);                                                        // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return ModbusTcpReadCommand.userCanRemove(userId, doc);                                                        // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
ModbusTcpReadCommand.before.insert(function (userId, doc) {                                                      // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
ModbusTcpReadCommand.before.update(function (userId, doc, fieldNames, modifier, options) {                       // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
ModbusTcpReadCommand.before.remove(function (userId, doc) {});                                                   // 33
                                                                                                                 //
ModbusTcpReadCommand.after.insert(function (userId, doc) {});                                                    // 37
                                                                                                                 //
ModbusTcpReadCommand.after.update(function (userId, doc, fieldNames, modifier, options) {});                     // 41
                                                                                                                 //
ModbusTcpReadCommand.after.remove(function (userId, doc) {});                                                    // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onewire.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/onewire.js                                                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
OneWire.allow({                                                                                                  // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return OneWire.userCanInsert(userId, doc);                                                                     // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return OneWire.userCanUpdate(userId, doc);                                                                     // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return OneWire.userCanRemove(userId, doc);                                                                     // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
OneWire.before.insert(function (userId, doc) {                                                                   // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
OneWire.before.update(function (userId, doc, fieldNames, modifier, options) {                                    // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
OneWire.before.remove(function (userId, doc) {});                                                                // 33
                                                                                                                 //
OneWire.after.insert(function (userId, doc) {});                                                                 // 37
                                                                                                                 //
OneWire.after.update(function (userId, doc, fieldNames, modifier, options) {                                     // 41
	console.log("OneWire - afterUpdate");                                                                           // 42
	var message = doc.message;                                                                                      // 43
	var sensorArr = [];                                                                                             // 44
	var timestamp = new Date(message["time"]);                                                                      // 45
	for (var key in message) {                                                                                      // 46
		if (key !== "time") {                                                                                          // 47
			var sensorid = key;                                                                                           // 48
			for (var valuekey in message[key]) {                                                                          // 49
				var tempObj = {};                                                                                            // 50
				tempObj["signal"] = sensorid + "." + valuekey;                                                               // 51
				tempObj["value"] = message[key][valuekey];                                                                   // 52
				tempObj["timestamp"] = timestamp;                                                                            // 53
				sensorArr.push(tempObj);                                                                                     // 54
			}                                                                                                             // 55
		}                                                                                                              // 56
	}                                                                                                               // 57
                                                                                                                 //
	sensorArr.forEach(function (sensor, i) {                                                                        // 59
		var unit = "";                                                                                                 // 60
		if (sensor.signal.indexOf("tempC") > -1) {                                                                     // 61
			unit = "°C";                                                                                                  // 62
		} else if (sensor.signal.indexOf("counter") > -1) {                                                            // 63
			unit = "#";                                                                                                   // 65
		} else if (sensor.signal.indexOf("hum") > -1) {                                                                // 66
			unit = "%RH";                                                                                                 // 68
		}                                                                                                              // 69
		var searchSignal = Signals.findOne({ "signal": sensor.signal });                                               // 70
		if (searchSignal !== undefined) {                                                                              // 71
			var offsetA = searchSignal.offsetA;                                                                           // 72
			var offsetB = searchSignal.offsetB;                                                                           // 73
			var scale = searchSignal.scale;                                                                               // 74
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                                                                       // 76
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "onewire", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false } });
		}                                                                                                              // 79
	});                                                                                                             // 80
});                                                                                                              // 81
                                                                                                                 //
OneWire.after.remove(function (userId, doc) {});                                                                 // 83
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"signals.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/collections/signals.js                                                                                 //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Signals.allow({                                                                                                  // 1
	insert: function insert(userId, doc) {                                                                          // 2
		return Signals.userCanInsert(userId, doc);                                                                     // 3
	},                                                                                                              // 4
                                                                                                                 //
	update: function update(userId, doc, fields, modifier) {                                                        // 6
		return Signals.userCanUpdate(userId, doc);                                                                     // 7
	},                                                                                                              // 8
                                                                                                                 //
	remove: function remove(userId, doc) {                                                                          // 10
		return Signals.userCanRemove(userId, doc);                                                                     // 11
	}                                                                                                               // 12
});                                                                                                              // 1
                                                                                                                 //
Signals.before.insert(function (userId, doc) {                                                                   // 15
	doc.createdAt = new Date();                                                                                     // 16
	doc.createdBy = userId;                                                                                         // 17
	doc.modifiedAt = doc.createdAt;                                                                                 // 18
	doc.modifiedBy = doc.createdBy;                                                                                 // 19
                                                                                                                 //
	if (!doc.createdBy) doc.createdBy = userId;                                                                     // 22
});                                                                                                              // 23
                                                                                                                 //
Signals.before.update(function (userId, doc, fieldNames, modifier, options) {                                    // 25
	modifier.$set = modifier.$set || {};                                                                            // 26
	modifier.$set.modifiedAt = new Date();                                                                          // 27
	modifier.$set.modifiedBy = userId;                                                                              // 28
});                                                                                                              // 31
                                                                                                                 //
Signals.before.remove(function (userId, doc) {});                                                                // 33
                                                                                                                 //
Signals.after.insert(function (userId, doc) {});                                                                 // 37
                                                                                                                 //
Signals.after.update(function (userId, doc, fieldNames, modifier, options) {});                                  // 41
                                                                                                                 //
Signals.after.remove(function (userId, doc) {});                                                                 // 45
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"controllers":{"router.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/controllers/router.js                                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Router.map(function () {});                                                                                      // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publish":{"ethercat.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/ethercat.js                                                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("ethercat", function () {                                                                         // 1
    return Ethercat.find();                                                                                      // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ethercatunits.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/ethercatunits.js                                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("ethercatunits", function () {                                                                    // 1
    return EthercatUnits.find();                                                                                 // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"gpio.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/gpio.js                                                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("gpio", function () {                                                                             // 1
    return Gpio.find();                                                                                          // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mbus.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/mbus.js                                                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("mbus", function () {                                                                             // 1
    return Mbus.find();                                                                                          // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrtu.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/modbusrtu.js                                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("modbusrtu", function () {                                                                        // 1
    return ModbusRtu.find();                                                                                     // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbusrturead.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/modbusrturead.js                                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("modbusrturead", function () {                                                                    // 1
    return ModbusRtuRead.find();                                                                                 // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcp.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/modbustcp.js                                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("modbustcp", function () {                                                                        // 1
    return ModbusTcp.find();                                                                                     // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpread.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/modbustcpread.js                                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("modbustcpread", function () {                                                                    // 1
    return ModbusTcpRead.find();                                                                                 // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modbustcpreadcommand.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/modbustcpreadcommand.js                                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("modbustcpreadcommand", function () {                                                             // 1
    return ModbusTcpReadCommand.find();                                                                          // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onewire.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/onewire.js                                                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("onewire", function () {                                                                          // 1
    return OneWire.find();                                                                                       // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"signals.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/publish/signals.js                                                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish("signals", function () {                                                                          // 1
    return Signals.find();                                                                                       // 2
});                                                                                                              // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// server/server.js                                                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var verifyEmail = false;                                                                                         // 1
                                                                                                                 //
Accounts.config({ sendVerificationEmail: verifyEmail });                                                         // 3
                                                                                                                 //
Meteor.startup(function () {                                                                                     // 5
	// read environment variables from Meteor.settings                                                              //
	if (Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {                                // 7
		for (var variableName in Meteor.settings.env) {                                                                // 8
			process.env[variableName] = Meteor.settings.env[variableName];                                                // 9
		}                                                                                                              // 10
	}                                                                                                               // 11
                                                                                                                 //
	//                                                                                                              //
	// Setup OAuth login service configuration (read from Meteor.settings)                                          //
	//                                                                                                              //
	// Your settings file should look like this:                                                                    //
	//                                                                                                              //
	// {                                                                                                            //
	//     "oauth": {                                                                                               //
	//         "google": {                                                                                          //
	//             "clientId": "yourClientId",                                                                      //
	//             "secret": "yourSecret"                                                                           //
	//         },                                                                                                   //
	//         "github": {                                                                                          //
	//             "clientId": "yourClientId",                                                                      //
	//             "secret": "yourSecret"                                                                           //
	//         }                                                                                                    //
	//     }                                                                                                        //
	// }                                                                                                            //
	//                                                                                                              //
	if (Accounts && Accounts.loginServiceConfiguration && Meteor.settings && Meteor.settings.oauth && _.isObject(Meteor.settings.oauth)) {
		// google                                                                                                      //
		if (Meteor.settings.oauth.google && _.isObject(Meteor.settings.oauth.google)) {                                // 33
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 35
				service: "google"                                                                                            // 36
			});                                                                                                           // 35
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.google;                                                            // 39
			settingsObject.service = "google";                                                                            // 40
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 43
		}                                                                                                              // 44
		// github                                                                                                      //
		if (Meteor.settings.oauth.github && _.isObject(Meteor.settings.oauth.github)) {                                // 46
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 48
				service: "github"                                                                                            // 49
			});                                                                                                           // 48
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.github;                                                            // 52
			settingsObject.service = "github";                                                                            // 53
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 56
		}                                                                                                              // 57
		// linkedin                                                                                                    //
		if (Meteor.settings.oauth.linkedin && _.isObject(Meteor.settings.oauth.linkedin)) {                            // 59
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 61
				service: "linkedin"                                                                                          // 62
			});                                                                                                           // 61
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.linkedin;                                                          // 65
			settingsObject.service = "linkedin";                                                                          // 66
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 69
		}                                                                                                              // 70
		// facebook                                                                                                    //
		if (Meteor.settings.oauth.facebook && _.isObject(Meteor.settings.oauth.facebook)) {                            // 72
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 74
				service: "facebook"                                                                                          // 75
			});                                                                                                           // 74
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.facebook;                                                          // 78
			settingsObject.service = "facebook";                                                                          // 79
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 82
		}                                                                                                              // 83
		// twitter                                                                                                     //
		if (Meteor.settings.oauth.twitter && _.isObject(Meteor.settings.oauth.twitter)) {                              // 85
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 87
				service: "twitter"                                                                                           // 88
			});                                                                                                           // 87
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.twitter;                                                           // 91
			settingsObject.service = "twitter";                                                                           // 92
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 95
		}                                                                                                              // 96
		// meteor                                                                                                      //
		if (Meteor.settings.oauth.meteor && _.isObject(Meteor.settings.oauth.meteor)) {                                // 98
			// remove old configuration                                                                                   //
			Accounts.loginServiceConfiguration.remove({                                                                   // 100
				service: "meteor-developer"                                                                                  // 101
			});                                                                                                           // 100
                                                                                                                 //
			var settingsObject = Meteor.settings.oauth.meteor;                                                            // 104
			settingsObject.service = "meteor-developer";                                                                  // 105
                                                                                                                 //
			// add new configuration                                                                                      //
			Accounts.loginServiceConfiguration.insert(settingsObject);                                                    // 108
		}                                                                                                              // 109
	}                                                                                                               // 110
                                                                                                                 //
	var url = "mqtt://94.234.165.147";                                                                              // 112
	Mbus.mqttConnect(url, ["/mbus/data"], {                                                                         // 113
		"username": "marcus",                                                                                          // 114
		"password": "test"                                                                                             // 115
	});                                                                                                             // 113
	OneWire.mqttConnect(url, ["/1-wire/data"], {                                                                    // 117
		"username": "marcus",                                                                                          // 118
		"password": "test"                                                                                             // 119
	});                                                                                                             // 117
	Ethercat.mqttConnect(url, ["/ethercat/data"], {                                                                 // 121
		"username": "marcus",                                                                                          // 122
		"password": "test"                                                                                             // 123
	});                                                                                                             // 121
	EthercatUnits.mqttConnect(url, ["/ethercat/units"], {                                                           // 125
		"username": "marcus",                                                                                          // 126
		"password": "test"                                                                                             // 127
	});                                                                                                             // 125
	Gpio.mqttConnect(url, ["/gpio/units"], {                                                                        // 129
		"username": "marcus",                                                                                          // 130
		"password": "test"                                                                                             // 131
	});                                                                                                             // 129
	ModbusTcp.mqttConnect(url, ["/modbus-tcp/data"], {                                                              // 133
		"username": "marcus",                                                                                          // 134
		"password": "test"                                                                                             // 135
	});                                                                                                             // 133
	ModbusTcpRead.mqttConnect(url, [""], {                                                                          // 137
		"username": "marcus",                                                                                          // 138
		"password": "test"                                                                                             // 139
	});                                                                                                             // 137
	ModbusRtu.mqttConnect(url, ["/modbus-rtu/data"], {                                                              // 141
		"username": "marcus",                                                                                          // 142
		"password": "test"                                                                                             // 143
	});                                                                                                             // 141
	ModbusRtuRead.mqttConnect(url, ["/modbus-rtu/read"], {                                                          // 145
		"username": "marcus",                                                                                          // 146
		"password": "test"                                                                                             // 147
	});                                                                                                             // 145
	// EtherCatUnits.mqttConnect(url, ["/modbus/units"], {                                                          //
	//     "username": "marcus",                                                                                    //
	//     "password": "test"                                                                                       //
	// });                                                                                                          //
                                                                                                                 //
	// Meteor.setInterval(function(){                                                                               //
                                                                                                                 //
	// 	//Send Modbus TCP commands                                                                                  //
	// 	var commands = ModbusTcpReadCommand.find().fetch();                                                         //
	// 	commands.forEach(function(c,i){                                                                             //
	// 		delete c["_id"];                                                                                           //
	// 		ModbusTcpRead.insert({topic: "/modbus-tcp/read", message: {commands:[c]}, broadcast: true});               //
	// 	});                                                                                                         //
	// }, 5000);                                                                                                    //
});                                                                                                              // 164
                                                                                                                 //
Meteor.methods({                                                                                                 // 166
	"createUserAccount": function createUserAccount(options) {                                                      // 167
		if (!Users.isAdmin(Meteor.userId())) {                                                                         // 168
			throw new Meteor.Error(403, "Access denied.");                                                                // 169
		}                                                                                                              // 170
                                                                                                                 //
		var userOptions = {};                                                                                          // 172
		if (options.username) userOptions.username = options.username;                                                 // 173
		if (options.email) userOptions.email = options.email;                                                          // 174
		if (options.password) userOptions.password = options.password;                                                 // 175
		if (options.profile) userOptions.profile = options.profile;                                                    // 176
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;                       // 177
                                                                                                                 //
		Accounts.createUser(userOptions);                                                                              // 179
	},                                                                                                              // 180
	"updateUserAccount": function updateUserAccount(userId, options) {                                              // 181
		// only admin or users own profile                                                                             //
		if (!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {                                          // 183
			throw new Meteor.Error(403, "Access denied.");                                                                // 184
		}                                                                                                              // 185
                                                                                                                 //
		// non-admin user can change only profile                                                                      //
		if (!Users.isAdmin(Meteor.userId())) {                                                                         // 188
			var keys = Object.keys(options);                                                                              // 189
			if (keys.length !== 1 || !options.profile) {                                                                  // 190
				throw new Meteor.Error(403, "Access denied.");                                                               // 191
			}                                                                                                             // 192
		}                                                                                                              // 193
                                                                                                                 //
		var userOptions = {};                                                                                          // 195
		if (options.username) userOptions.username = options.username;                                                 // 196
		if (options.email) userOptions.email = options.email;                                                          // 197
		if (options.password) userOptions.password = options.password;                                                 // 198
		if (options.profile) userOptions.profile = options.profile;                                                    // 199
                                                                                                                 //
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;                       // 201
		if (options.roles) userOptions.roles = options.roles;                                                          // 202
                                                                                                                 //
		if (userOptions.email) {                                                                                       // 204
			var email = userOptions.email;                                                                                // 205
			delete userOptions.email;                                                                                     // 206
			userOptions.emails = [{ address: email }];                                                                    // 207
		}                                                                                                              // 208
                                                                                                                 //
		var password = "";                                                                                             // 210
		if (userOptions.password) {                                                                                    // 211
			password = userOptions.password;                                                                              // 212
			delete userOptions.password;                                                                                  // 213
		}                                                                                                              // 214
                                                                                                                 //
		if (userOptions) {                                                                                             // 216
			Users.update(userId, { $set: userOptions });                                                                  // 217
		}                                                                                                              // 218
                                                                                                                 //
		if (password) {                                                                                                // 220
			Accounts.setPassword(userId, password);                                                                       // 221
		}                                                                                                              // 222
	},                                                                                                              // 223
	"sendMail": function sendMail(options) {                                                                        // 224
		this.unblock();                                                                                                // 225
                                                                                                                 //
		Email.send(options);                                                                                           // 227
	},                                                                                                              // 228
	"updateSignal": function updateSignal(signalId, values) {                                                       // 229
		console.log("updateSignal");                                                                                   // 230
		if (!Users.isAdmin(Meteor.userId())) {                                                                         // 231
			throw new Meteor.Error(403, "Access denied. You need to be an administrator to update a signal.");            // 232
		}                                                                                                              // 233
                                                                                                                 //
		var signal = Signals.findOne(signalId);                                                                        // 235
		console.log(signal);                                                                                           // 236
		if (signal) {                                                                                                  // 237
			var raw = signal.raw;                                                                                         // 238
			var offsetA = parseFloat(values.signal.offsetA);                                                              // 239
			var offsetB = parseFloat(values.signal.offsetB);                                                              // 240
			var scale = parseFloat(values.signal.scale);                                                                  // 241
			var alarmH = parseFloat(values.signal.alarmH);                                                                // 242
			var alarmL = parseFloat(values.signal.alarmL);                                                                // 243
			if (alarmH < alarmL) {                                                                                        // 244
				throw new Meteor.Error(601, "Alarm high cannot be less than alarm low.");                                    // 245
			} else if (alarmL > alarmH) {                                                                                 // 246
				throw new Meteor.Error(602, "Alarm low cannot be greater than alarm high.");                                 // 248
			} else if (alarmL == alarmH) {                                                                                // 249
				throw new Meteor.Error(603, "Alarm low cannot be equal to alarm high.");                                     // 251
			}                                                                                                             // 252
                                                                                                                 //
			setObj = {                                                                                                    // 254
				name: values.signal.name,                                                                                    // 255
				offsetA: offsetA,                                                                                            // 256
				offsetB: offsetB,                                                                                            // 257
				scale: scale,                                                                                                // 258
				unit: values.signal.unit,                                                                                    // 259
				value: scale * (raw + offsetA) + offsetB,                                                                    // 260
				hidden: values.signal.hidden,                                                                                // 261
				alarmH: alarmH,                                                                                              // 262
				alarmL: alarmL                                                                                               // 263
			};                                                                                                            // 254
                                                                                                                 //
			Signals.update(signalId, { $set: setObj });                                                                   // 266
		} else {                                                                                                       // 267
			throw new Meteor.Error(100, "Signal does not exist");                                                         // 269
		}                                                                                                              // 270
	},                                                                                                              // 271
	"addModbusTcpCommand": function addModbusTcpCommand(values) {                                                   // 272
		if (!Users.isAdmin(Meteor.userId())) {                                                                         // 273
			throw new Meteor.Error(403, "Access denied. You need to be an administrator to add commands.");               // 274
		}                                                                                                              // 275
                                                                                                                 //
		var send = {                                                                                                   // 277
			ip: values.command.ip,                                                                                        // 278
			addr: 1,                                                                                                      // 279
			reg: parseInt(values.command.register),                                                                       // 280
			offset: parseInt(values.command.offset),                                                                      // 281
			len: parseInt(values.command.length)                                                                          // 282
		};                                                                                                             // 277
                                                                                                                 //
		ModbusTcpReadCommand.upsert(send, send);                                                                       // 285
		console.log("Got tcp command", values);                                                                        // 286
	}                                                                                                               // 287
});                                                                                                              // 166
                                                                                                                 //
Accounts.onCreateUser(function (options, user) {                                                                 // 290
	user.roles = ["user"];                                                                                          // 291
                                                                                                                 //
	if (options.profile) {                                                                                          // 293
		user.profile = options.profile;                                                                                // 294
	}                                                                                                               // 295
                                                                                                                 //
	return user;                                                                                                    // 298
});                                                                                                              // 299
                                                                                                                 //
Accounts.validateLoginAttempt(function (info) {                                                                  // 301
                                                                                                                 //
	// reject users with role "blocked"                                                                             //
	if (info.user && Users.isInRole(info.user._id, "blocked")) {                                                    // 304
		throw new Meteor.Error(403, "Your account is blocked.");                                                       // 305
	}                                                                                                               // 306
                                                                                                                 //
	if (verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified) {
		throw new Meteor.Error(499, "E-mail not verified.");                                                           // 309
	}                                                                                                               // 310
                                                                                                                 //
	return true;                                                                                                    // 312
});                                                                                                              // 313
                                                                                                                 //
Users.before.insert(function (userId, doc) {                                                                     // 316
	if (doc.emails && doc.emails[0] && doc.emails[0].address) {                                                     // 317
		doc.profile = doc.profile || {};                                                                               // 318
		doc.profile.email = doc.emails[0].address;                                                                     // 319
	} else {                                                                                                        // 320
		// oauth                                                                                                       //
		if (doc.services) {                                                                                            // 322
			// google e-mail                                                                                              //
			if (doc.services.google && doc.services.google.email) {                                                       // 324
				doc.profile = doc.profile || {};                                                                             // 325
				doc.profile.email = doc.services.google.email;                                                               // 326
			} else {                                                                                                      // 327
				// github e-mail                                                                                             //
				if (doc.services.github && doc.services.github.accessToken) {                                                // 329
					var github = new GitHub({                                                                                   // 330
						version: "3.0.0",                                                                                          // 331
						timeout: 5000                                                                                              // 332
					});                                                                                                         // 330
                                                                                                                 //
					github.authenticate({                                                                                       // 335
						type: "oauth",                                                                                             // 336
						token: doc.services.github.accessToken                                                                     // 337
					});                                                                                                         // 335
                                                                                                                 //
					try {                                                                                                       // 340
						var result = github.user.getEmails({});                                                                    // 341
						var email = _.findWhere(result, { primary: true });                                                        // 342
						if (!email && result.length && _.isString(result[0])) {                                                    // 343
							email = { email: result[0] };                                                                             // 344
						}                                                                                                          // 345
                                                                                                                 //
						if (email) {                                                                                               // 347
							doc.profile = doc.profile || {};                                                                          // 348
							doc.profile.email = email.email;                                                                          // 349
						}                                                                                                          // 350
					} catch (e) {                                                                                               // 351
						console.log(e);                                                                                            // 352
					}                                                                                                           // 353
				} else {                                                                                                     // 354
					// linkedin email                                                                                           //
					if (doc.services.linkedin && doc.services.linkedin.emailAddress) {                                          // 356
						doc.profile = doc.profile || {};                                                                           // 357
						doc.profile.name = doc.services.linkedin.firstName + " " + doc.services.linkedin.lastName;                 // 358
						doc.profile.email = doc.services.linkedin.emailAddress;                                                    // 359
					} else {                                                                                                    // 360
						if (doc.services.facebook && doc.services.facebook.email) {                                                // 361
							doc.profile = doc.profile || {};                                                                          // 362
							doc.profile.email = doc.services.facebook.email;                                                          // 363
						} else {                                                                                                   // 364
							if (doc.services.twitter && doc.services.twitter.email) {                                                 // 365
								doc.profile = doc.profile || {};                                                                         // 366
								doc.profile.email = doc.services.twitter.email;                                                          // 367
							} else {                                                                                                  // 368
								if (doc.services["meteor-developer"] && doc.services["meteor-developer"].emails && doc.services["meteor-developer"].emails.length) {
									doc.profile = doc.profile || {};                                                                        // 370
									doc.profile.email = doc.services["meteor-developer"].emails[0].address;                                 // 371
								}                                                                                                        // 372
							}                                                                                                         // 373
						}                                                                                                          // 374
					}                                                                                                           // 375
				}                                                                                                            // 376
			}                                                                                                             // 377
		}                                                                                                              // 378
	}                                                                                                               // 379
});                                                                                                              // 380
                                                                                                                 //
Users.before.update(function (userId, doc, fieldNames, modifier, options) {                                      // 382
	if (modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {  // 383
		modifier.$set.profile.email = modifier.$set.emails[0].address;                                                 // 384
	}                                                                                                               // 385
});                                                                                                              // 386
                                                                                                                 //
Accounts.onLogin(function (info) {});                                                                            // 388
                                                                                                                 //
Accounts.urls.resetPassword = function (token) {                                                                 // 392
	return Meteor.absoluteUrl('reset_password/' + token);                                                           // 393
};                                                                                                               // 394
                                                                                                                 //
Accounts.urls.verifyEmail = function (token) {                                                                   // 396
	return Meteor.absoluteUrl('verify_email/' + token);                                                             // 397
};                                                                                                               // 398
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{"extensions":[".js",".json"]});
require("./lib/number_utils.js");
require("./lib/object_utils.js");
require("./lib/string_utils.js");
require("./both/collections/ethercat.js");
require("./both/collections/ethercatunits.js");
require("./both/collections/gpio.js");
require("./both/collections/mbus.js");
require("./both/collections/modbusrtu.js");
require("./both/collections/modbusrturead.js");
require("./both/collections/modbustcp.js");
require("./both/collections/modbustcpread.js");
require("./both/collections/modbustcpreadcommand.js");
require("./both/collections/onewire.js");
require("./both/collections/signals.js");
require("./both/joins/joins.js");
require("./server/collections/ethercat.js");
require("./server/collections/ethercatunits.js");
require("./server/collections/gpio.js");
require("./server/collections/mbus.js");
require("./server/collections/modbusrtu.js");
require("./server/collections/modbusrturead.js");
require("./server/collections/modbustcp.js");
require("./server/collections/modbustcpread.js");
require("./server/collections/modbustcpreadcommand.js");
require("./server/collections/onewire.js");
require("./server/collections/signals.js");
require("./server/controllers/router.js");
require("./server/publish/ethercat.js");
require("./server/publish/ethercatunits.js");
require("./server/publish/gpio.js");
require("./server/publish/mbus.js");
require("./server/publish/modbusrtu.js");
require("./server/publish/modbusrturead.js");
require("./server/publish/modbustcp.js");
require("./server/publish/modbustcpread.js");
require("./server/publish/modbustcpreadcommand.js");
require("./server/publish/onewire.js");
require("./server/publish/signals.js");
require("./server/server.js");
//# sourceMappingURL=app.js.map

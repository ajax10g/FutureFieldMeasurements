(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/ethercatunits.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
EthercatUnits.allow({                                                  // 1
	insert: function (userId, doc) {                                      // 2
		return EthercatUnits.userCanInsert(userId, doc);                     // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return EthercatUnits.userCanUpdate(userId, doc);                     // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return EthercatUnits.userCanRemove(userId, doc);                     // 11
	}                                                                     //
});                                                                    //
                                                                       //
EthercatUnits.before.insert(function (userId, doc) {                   // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
EthercatUnits.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
EthercatUnits.before.remove(function (userId, doc) {});                // 33
                                                                       //
EthercatUnits.after.insert(function (userId, doc) {                    // 37
	var message = doc.message;                                            // 38
	var sensorArr = [];                                                   // 39
	for (var num in babelHelpers.sanitizeForInObject(message.slaves)) {   // 40
		var slave = message.slaves[num];                                     // 41
		var sensorid = slave.name;                                           // 42
		for (var num2 in babelHelpers.sanitizeForInObject(slave.inputs)) {   // 43
			var channel = slave.inputs[num2];                                   // 44
			var tempObj = {};                                                   // 45
			tempObj["signal"] = sensorid + "." + channel.name + "." + channel.offsetbyte + "." + channel.offsetbit + "." + channel.bitlength;
			tempObj["value"] = null;                                            // 47
			tempObj["timestamp"] = null;                                        // 48
			tempObj["offsetbyte"] = channel.offsetbyte;                         // 49
			tempObj["offsetbit"] = channel.offsetbit;                           // 50
			tempObj["bitlength"] = channel.bitlength;                           // 51
			sensorArr.push(tempObj);                                            // 52
		}                                                                    //
	}                                                                     //
                                                                       //
	console.log(sensorArr);                                               // 56
                                                                       //
	sensorArr.forEach(function (sensor, i) {                              // 58
		var searchSignal = Signals.findOne({ "signal": sensor.signal });     // 59
		if (searchSignal !== undefined) {                                    // 60
			var offsetA = searchSignal.offsetA;                                 // 61
			var offsetB = searchSignal.offsetB;                                 // 62
			var scale = searchSignal.scale;                                     // 63
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                             //
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "ethercat", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false, offsetbyte: sensor.offsetbyte, offsetbit: sensor.offsetbit, bitlength: sensor.bitlength } });
		}                                                                    //
	});                                                                   //
});                                                                    //
                                                                       //
EthercatUnits.after.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("EtherCatUnits - afterUpdate");                           // 73
	var message = doc.message;                                            // 74
	var sensorArr = [];                                                   // 75
	for (var num in babelHelpers.sanitizeForInObject(message.slaves)) {   // 76
		var slave = message.slaves[num];                                     // 77
		var sensorid = slave.name;                                           // 78
		for (var num2 in babelHelpers.sanitizeForInObject(slave.inputs)) {   // 79
			var channel = slave.inputs[num2];                                   // 80
			var tempObj = {};                                                   // 81
			console.log(channel);                                               // 82
			tempObj["signal"] = sensorid + "." + channel.name + "." + channel.offsetbyte + "." + channel.offsetbit + "." + channel.bitlength;
			tempObj["value"] = null;                                            // 84
			tempObj["timestamp"] = null;                                        // 85
			tempObj["offsetbyte"] = channel.offsetbyte;                         // 86
			tempObj["offsetbit"] = channel.offsetbit;                           // 87
			tempObj["bitlength"] = channel.bitlength;                           // 88
			sensorArr.push(tempObj);                                            // 89
		}                                                                    //
	}                                                                     //
                                                                       //
	console.log(sensorArr);                                               // 93
                                                                       //
	sensorArr.forEach(function (sensor, i) {                              // 95
		var searchSignal = Signals.findOne({ "signal": sensor.signal });     // 96
		if (searchSignal !== undefined) {                                    // 97
			var offsetA = searchSignal.offsetA;                                 // 98
			var offsetB = searchSignal.offsetB;                                 // 99
			var scale = searchSignal.scale;                                     // 100
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                             //
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "ethercat", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: "", offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false, offsetbyte: sensor.offsetbyte, offsetbit: sensor.offsetbit, bitlength: sensor.bitlength } });
		}                                                                    //
	});                                                                   //
});                                                                    //
                                                                       //
EthercatUnits.after.remove(function (userId, doc) {});                 // 109
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=ethercatunits.js.map

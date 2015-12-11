(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/onewire.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
OneWire.allow({                                                        // 1
	insert: function (userId, doc) {                                      // 2
		return OneWire.userCanInsert(userId, doc);                           // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return OneWire.userCanUpdate(userId, doc);                           // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return OneWire.userCanRemove(userId, doc);                           // 11
	}                                                                     //
});                                                                    //
                                                                       //
OneWire.before.insert(function (userId, doc) {                         // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
OneWire.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
OneWire.before.remove(function (userId, doc) {});                      // 33
                                                                       //
OneWire.after.insert(function (userId, doc) {});                       // 37
                                                                       //
OneWire.after.update(function (userId, doc, fieldNames, modifier, options) {
	var message = doc.message;                                            // 42
	var sensorArr = [];                                                   // 43
	var timestamp = new Date(message["time"]);                            // 44
	for (var key in babelHelpers.sanitizeForInObject(message)) {          // 45
		if (key !== "time") {                                                // 46
			var sensorid = key;                                                 // 47
			for (var valuekey in babelHelpers.sanitizeForInObject(message[key])) {
				var tempObj = {};                                                  // 49
				tempObj["signal"] = sensorid + "." + valuekey;                     // 50
				tempObj["value"] = message[key][valuekey];                         // 51
				tempObj["timestamp"] = timestamp;                                  // 52
				sensorArr.push(tempObj);                                           // 53
			}                                                                   //
		}                                                                    //
	}                                                                     //
                                                                       //
	sensorArr.forEach(function (sensor, i) {                              // 58
		var unit = "";                                                       // 59
		if (sensor.signal.indexOf("tempC") > -1) {                           // 60
			unit = "°C";                                                        // 61
		} else if (sensor.signal.indexOf("counter") > -1) {                  //
			unit = "#";                                                         // 64
		} else if (sensor.signal.indexOf("hum") > -1) {                      //
			unit = "%RH";                                                       // 67
		}                                                                    //
		var searchSignal = Signals.findOne({ "signal": sensor.signal });     // 69
		if (searchSignal !== undefined) {                                    // 70
			var offsetA = searchSignal.offsetA;                                 // 71
			var offsetB = searchSignal.offsetB;                                 // 72
			var scale = searchSignal.scale;                                     // 73
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                             //
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "onewire", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false } });
		}                                                                    //
	});                                                                   //
});                                                                    //
                                                                       //
OneWire.after.remove(function (userId, doc) {});                       // 82
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=onewire.js.map

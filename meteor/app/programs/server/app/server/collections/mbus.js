(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/collections/mbus.js                                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Mbus.allow({                                                           // 1
	insert: function (userId, doc) {                                      // 2
		return Mbus.userCanInsert(userId, doc);                              // 3
	},                                                                    //
                                                                       //
	update: function (userId, doc, fields, modifier) {                    // 6
		return Mbus.userCanUpdate(userId, doc);                              // 7
	},                                                                    //
                                                                       //
	remove: function (userId, doc) {                                      // 10
		return Mbus.userCanRemove(userId, doc);                              // 11
	}                                                                     //
});                                                                    //
                                                                       //
Mbus.before.insert(function (userId, doc) {                            // 15
	doc.createdAt = new Date();                                           // 16
	doc.createdBy = userId;                                               // 17
	doc.modifiedAt = doc.createdAt;                                       // 18
	doc.modifiedBy = doc.createdBy;                                       // 19
                                                                       //
	if (!doc.createdBy) doc.createdBy = userId;                           // 22
});                                                                    //
                                                                       //
Mbus.before.update(function (userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};                                  // 26
	modifier.$set.modifiedAt = new Date();                                // 27
	modifier.$set.modifiedBy = userId;                                    // 28
});                                                                    //
                                                                       //
Mbus.before.remove(function (userId, doc) {});                         // 33
                                                                       //
Mbus.after.insert(function (userId, doc) {});                          // 37
                                                                       //
Mbus.after.update(function (userId, doc, fieldNames, modifier, options) {
	console.log("Mbus - afterUpdate");                                    // 42
	var message = doc.message;                                            // 43
	var sensorArr = [];                                                   // 44
	for (var key in babelHelpers.sanitizeForInObject(message)) {          // 45
		if (message.hasOwnProperty(key)) {                                   // 46
			var sensorid = key;                                                 // 47
			for (var valuekey in babelHelpers.sanitizeForInObject(message[key])) {
				var tempObj = {};                                                  // 49
				tempObj["signal"] = sensorid;                                      // 50
				tempObj["value"] = message[key].value;                             // 51
				tempObj["timestamp"] = new Date(message[key].time);                // 52
				tempObj["unit"] = message[key].unit;                               // 53
				sensorArr.push(tempObj);                                           // 54
			}                                                                   //
		}                                                                    //
	}                                                                     //
                                                                       //
	sensorArr.forEach(function (sensor, i) {                              // 59
		var searchSignal = Signals.findOne({ "signal": sensor.signal });     // 60
		if (searchSignal !== undefined) {                                    // 61
			var offsetA = searchSignal.offsetA;                                 // 62
			var offsetB = searchSignal.offsetB;                                 // 63
			var scale = searchSignal.scale;                                     // 64
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                             //
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "mbus", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: sensor.unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false } });
		}                                                                    //
	});                                                                   //
});                                                                    //
                                                                       //
Mbus.after.remove(function (userId, doc) {});                          // 73
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=mbus.js.map

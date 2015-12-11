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
	var message = doc.message;                                            // 42
	var sensorArr = [];                                                   // 43
	for (var key in babelHelpers.sanitizeForInObject(message)) {          // 44
		if (message.hasOwnProperty(key)) {                                   // 45
			var sensorid = key;                                                 // 46
			for (var valuekey in babelHelpers.sanitizeForInObject(message[key])) {
				var tempObj = {};                                                  // 48
				tempObj["signal"] = sensorid;                                      // 49
				tempObj["value"] = message[key].value;                             // 50
				tempObj["timestamp"] = new Date(message[key].time);                // 51
				tempObj["unit"] = message[key].unit;                               // 52
				sensorArr.push(tempObj);                                           // 53
			}                                                                   //
		}                                                                    //
	}                                                                     //
                                                                       //
	sensorArr.forEach(function (sensor, i) {                              // 58
		var searchSignal = Signals.findOne({ "signal": sensor.signal });     // 59
		if (searchSignal !== undefined) {                                    // 60
			var offsetA = searchSignal.offsetA;                                 // 61
			var offsetB = searchSignal.offsetB;                                 // 62
			var scale = searchSignal.scale;                                     // 63
			Signals.upsert({ "signal": sensor.signal }, { $set: { value: scale * (sensor.value + offsetA) + offsetB, raw: sensor.value, timestamp: sensor.timestamp } });
		} else {                                                             //
			Signals.upsert({ "signal": sensor.signal }, { $set: { name: null, bus: "mbus", value: sensor.value, raw: sensor.value, timestamp: sensor.timestamp, unit: sensor.unit, offsetA: 0.0, offsetB: 0.0, scale: 1.0, hidden: false } });
		}                                                                    //
	});                                                                   //
});                                                                    //
                                                                       //
Mbus.after.remove(function (userId, doc) {});                          // 72
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=mbus.js.map

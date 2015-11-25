(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var mqtt;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/perak_mqtt-collection/packages/perak_mqtt-collection.js                                     //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
(function () {                                                                                          // 1
                                                                                                        // 2
///////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                               //     // 4
// packages/perak:mqtt-collection/lib/mqtt.js                                                    //     // 5
//                                                                                               //     // 6
///////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                 //     // 8
mqtt = Npm.require('mqtt');                                                                      // 1   // 9
///////////////////////////////////////////////////////////////////////////////////////////////////     // 10
                                                                                                        // 11
}).call(this);                                                                                          // 12
                                                                                                        // 13
                                                                                                        // 14
                                                                                                        // 15
                                                                                                        // 16
                                                                                                        // 17
                                                                                                        // 18
(function () {                                                                                          // 19
                                                                                                        // 20
///////////////////////////////////////////////////////////////////////////////////////////////////     // 21
//                                                                                               //     // 22
// packages/perak:mqtt-collection/lib/mqtt_collection.js                                         //     // 23
//                                                                                               //     // 24
///////////////////////////////////////////////////////////////////////////////////////////////////     // 25
                                                                                                 //     // 26
var Fiber = Npm.require("fibers");                                                               // 1   // 27
                                                                                                 // 2   // 28
var Mongo = Package.mongo.Mongo;                                                                 // 3   // 29
                                                                                                 // 4   // 30
Mongo.Collection.prototype.mqttConnect = function(uri, topics, options) {                        // 5   // 31
	var self = this;                                                                                // 6   // 32
	this.mqttDisconnect();                                                                          // 7   // 33
                                                                                                 // 8   // 34
	this.options = options || {};                                                                   // 9   // 35
                                                                                                 // 10  // 36
	this._mqttClient = mqtt.connect(uri);                                                           // 11  // 37
                                                                                                 // 12  // 38
	this._mqttClient.on("connect", function() {                                                     // 13  // 39
		self.mqttSubscribe(topics);                                                                    // 14  // 40
	});                                                                                             // 15  // 41
                                                                                                 // 16  // 42
	this._mqttClient.on("message", function(topic, message) {                                       // 17  // 43
		var msg = message.toString();                                                                  // 18  // 44
		if(!self.options.raw) {                                                                        // 19  // 45
			try {                                                                                         // 20  // 46
				msg = JSON.parse(msg);                                                                       // 21  // 47
			} catch(e) {                                                                                  // 22  // 48
			}                                                                                             // 23  // 49
		}                                                                                              // 24  // 50
                                                                                                 // 25  // 51
		Fiber(function() {                                                                             // 26  // 52
                                                                                                 // 27  // 53
			if(self.options.insert) {                                                                     // 28  // 54
				self.insert({                                                                                // 29  // 55
					topic: topic,                                                                               // 30  // 56
					message: msg                                                                                // 31  // 57
				}, function(e, r) {                                                                          // 32  // 58
					if(e) {                                                                                     // 33  // 59
						console.log(e);                                                                            // 34  // 60
					} else {                                                                                    // 35  // 61
						if(self.options.insertLimit) {                                                             // 36  // 62
							var insertLimit = parseInt(self.options.insertLimit);                                     // 37  // 63
							if(!isNaN(insertLimit)) {                                                                 // 38  // 64
								while(self.find({ topic: topic }).count() > insertLimit) {                               // 39  // 65
									var removeId = self.findOne({ topic: topic }, { sort: [["createdAt", "asc"]] });        // 40  // 66
									if(removeId) {                                                                          // 41  // 67
										self.remove({ _id: removeId._id });                                                    // 42  // 68
									}                                                                                       // 43  // 69
								}                                                                                        // 44  // 70
							}                                                                                         // 45  // 71
						}                                                                                          // 46  // 72
					}                                                                                           // 47  // 73
				});                                                                                          // 48  // 74
			} else {                                                                                      // 49  // 75
				self.upsert(                                                                                 // 50  // 76
				{                                                                                            // 51  // 77
					topic: topic                                                                                // 52  // 78
				},                                                                                           // 53  // 79
				{                                                                                            // 54  // 80
					$set: {                                                                                     // 55  // 81
						topic: topic,                                                                              // 56  // 82
						message: msg                                                                               // 57  // 83
					}                                                                                           // 58  // 84
				},                                                                                           // 59  // 85
				{                                                                                            // 60  // 86
				},                                                                                           // 61  // 87
				function(e, r) {                                                                             // 62  // 88
					if(e) console.log(e);                                                                       // 63  // 89
				});                                                                                          // 64  // 90
			}                                                                                             // 65  // 91
		}).run();                                                                                      // 66  // 92
	});                                                                                             // 67  // 93
                                                                                                 // 68  // 94
	var init = true;                                                                                // 69  // 95
	this.find().observeChanges({                                                                    // 70  // 96
		added: function(id, doc) {                                                                     // 71  // 97
			if(!init) {                                                                                   // 72  // 98
				if(doc && doc.topic && doc.message && doc.broadcast && self._mqttClient) {                   // 73  // 99
					var msg = typeof doc.message === 'object' ? JSON.stringify(doc.message) : doc.message + ""; // 74  // 100
					self.remove({ _id: id });                                                                   // 75  // 101
					self._mqttClient.publish(doc.topic, msg);                                                   // 76  // 102
				}                                                                                            // 77  // 103
			}                                                                                             // 78  // 104
		}                                                                                              // 79  // 105
	});                                                                                             // 80  // 106
	init = false;                                                                                   // 81  // 107
};                                                                                               // 82  // 108
                                                                                                 // 83  // 109
Mongo.Collection.prototype.mqttDisconnect = function() {                                         // 84  // 110
	if(this._mqttClient) this._mqttClient.end();                                                    // 85  // 111
	this._mqttClient = null;                                                                        // 86  // 112
};                                                                                               // 87  // 113
                                                                                                 // 88  // 114
Mongo.Collection.prototype.mqttSubscribe = function(topics) {                                    // 89  // 115
	var self = this;                                                                                // 90  // 116
	if(!this._mqttClient) return;                                                                   // 91  // 117
	if(!topics) return;                                                                             // 92  // 118
                                                                                                 // 93  // 119
	if(typeof topics == "string" || topics instanceof String) {                                     // 94  // 120
		this._mqttClient.subscribe(topics);                                                            // 95  // 121
	} else if(_.isArray(topics)) {                                                                  // 96  // 122
		_.each(topics, function(topic) {                                                               // 97  // 123
			self._mqttClient.subscribe(topic);                                                            // 98  // 124
		});                                                                                            // 99  // 125
	}                                                                                               // 100
};                                                                                               // 101
                                                                                                 // 102
///////////////////////////////////////////////////////////////////////////////////////////////////     // 129
                                                                                                        // 130
}).call(this);                                                                                          // 131
                                                                                                        // 132
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['perak:mqtt-collection'] = {
  mqtt: mqtt
};

})();

//# sourceMappingURL=perak_mqtt-collection.js.map

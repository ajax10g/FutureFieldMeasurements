(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var mqtt;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/perak_mqtt-collection/packages/perak_mqtt-collection.js                                     //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/perak:mqtt-collection/lib/mqtt.js                                                    //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
mqtt = Npm.require('mqtt');                                                                      // 1
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/perak:mqtt-collection/lib/mqtt_collection.js                                         //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
var Fiber = Npm.require("fibers");                                                               // 1
                                                                                                 // 2
var Mongo = Package.mongo.Mongo;                                                                 // 3
                                                                                                 // 4
Mongo.Collection.prototype.mqttConnect = function(uri, topics, options) {                        // 5
	var self = this;                                                                                // 6
	this.mqttDisconnect();                                                                          // 7
                                                                                                 // 8
	this.options = options || {};                                                                   // 9
                                                                                                 // 10
	this._mqttClient = mqtt.connect(uri);                                                           // 11
                                                                                                 // 12
	this._mqttClient.on("connect", function() {                                                     // 13
		self.mqttSubscribe(topics);                                                                    // 14
	});                                                                                             // 15
                                                                                                 // 16
	this._mqttClient.on("message", function(topic, message) {                                       // 17
		var msg = message.toString();                                                                  // 18
		if(!self.options.raw) {                                                                        // 19
			try {                                                                                         // 20
				msg = JSON.parse(msg);                                                                       // 21
			} catch(e) {                                                                                  // 22
			}                                                                                             // 23
		}                                                                                              // 24
                                                                                                 // 25
		Fiber(function() {                                                                             // 26
                                                                                                 // 27
			if(self.options.insert) {                                                                     // 28
				self.insert({                                                                                // 29
					topic: topic,                                                                               // 30
					message: msg                                                                                // 31
				}, function(e, r) {                                                                          // 32
					if(e) {                                                                                     // 33
						console.log(e);                                                                            // 34
					} else {                                                                                    // 35
						if(self.options.insertLimit) {                                                             // 36
							var insertLimit = parseInt(self.options.insertLimit);                                     // 37
							if(!isNaN(insertLimit)) {                                                                 // 38
								while(self.find({ topic: topic }).count() > insertLimit) {                               // 39
									var removeId = self.findOne({ topic: topic }, { sort: [["createdAt", "asc"]] });        // 40
									if(removeId) {                                                                          // 41
										self.remove({ _id: removeId._id });                                                    // 42
									}                                                                                       // 43
								}                                                                                        // 44
							}                                                                                         // 45
						}                                                                                          // 46
					}                                                                                           // 47
				});                                                                                          // 48
			} else {                                                                                      // 49
				self.upsert(                                                                                 // 50
				{                                                                                            // 51
					topic: topic                                                                                // 52
				},                                                                                           // 53
				{                                                                                            // 54
					$set: {                                                                                     // 55
						topic: topic,                                                                              // 56
						message: msg                                                                               // 57
					}                                                                                           // 58
				},                                                                                           // 59
				{                                                                                            // 60
				},                                                                                           // 61
				function(e, r) {                                                                             // 62
					if(e) console.log(e);                                                                       // 63
				});                                                                                          // 64
			}                                                                                             // 65
		}).run();                                                                                      // 66
	});                                                                                             // 67
                                                                                                 // 68
	var init = true;                                                                                // 69
	this.find().observeChanges({                                                                    // 70
		added: function(id, doc) {                                                                     // 71
			if(!init) {                                                                                   // 72
				if(doc && doc.topic && doc.message && doc.broadcast && self._mqttClient) {                   // 73
					var msg = typeof doc.message === 'object' ? JSON.stringify(doc.message) : doc.message + ""; // 74
					self.remove({ _id: id });                                                                   // 75
					self._mqttClient.publish(doc.topic, msg);                                                   // 76
				}                                                                                            // 77
			}                                                                                             // 78
		}                                                                                              // 79
	});                                                                                             // 80
	init = false;                                                                                   // 81
};                                                                                               // 82
                                                                                                 // 83
Mongo.Collection.prototype.mqttDisconnect = function() {                                         // 84
	if(this._mqttClient) this._mqttClient.end();                                                    // 85
	this._mqttClient = null;                                                                        // 86
};                                                                                               // 87
                                                                                                 // 88
Mongo.Collection.prototype.mqttSubscribe = function(topics) {                                    // 89
	var self = this;                                                                                // 90
	if(!this._mqttClient) return;                                                                   // 91
	if(!topics) return;                                                                             // 92
                                                                                                 // 93
	if(typeof topics == "string" || topics instanceof String) {                                     // 94
		this._mqttClient.subscribe(topics);                                                            // 95
	} else if(_.isArray(topics)) {                                                                  // 96
		_.each(topics, function(topic) {                                                               // 97
			self._mqttClient.subscribe(topic);                                                            // 98
		});                                                                                            // 99
	}                                                                                               // 100
};                                                                                               // 101
                                                                                                 // 102
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['perak:mqtt-collection'] = {}, {
  mqtt: mqtt
});

})();

//# sourceMappingURL=perak_mqtt-collection.js.map

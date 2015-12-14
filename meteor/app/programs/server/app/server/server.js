(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/server.js                                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
var verifyEmail = false;                                               // 1
                                                                       //
Accounts.config({ sendVerificationEmail: verifyEmail });               // 3
                                                                       //
Meteor.startup(function () {                                           // 5
	// read environment variables from Meteor.settings                    //
	if (Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for (var variableName in babelHelpers.sanitizeForInObject(Meteor.settings.env)) {
			process.env[variableName] = Meteor.settings.env[variableName];      // 9
		}                                                                    //
	}                                                                     //
                                                                       //
	//                                                                    //
	// Setup OAuth login service configuration (read from Meteor.settings)
	//                                                                    //
	// Your settings file should look like this:                          //
	//                                                                    //
	// {                                                                  //
	//     "oauth": {                                                     //
	//         "google": {                                                //
	//             "clientId": "yourClientId",                            //
	//             "secret": "yourSecret"                                 //
	//         },                                                         //
	//         "github": {                                                //
	//             "clientId": "yourClientId",                            //
	//             "secret": "yourSecret"                                 //
	//         }                                                          //
	//     }                                                              //
	// }                                                                  //
	//                                                                    //
	if (Accounts && Accounts.loginServiceConfiguration && Meteor.settings && Meteor.settings.oauth && _.isObject(Meteor.settings.oauth)) {
		// google                                                            //
		if (Meteor.settings.oauth.google && _.isObject(Meteor.settings.oauth.google)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 35
				service: "google"                                                  // 36
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.google;                  // 39
			settingsObject.service = "google";                                  // 40
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 43
		}                                                                    //
		// github                                                            //
		if (Meteor.settings.oauth.github && _.isObject(Meteor.settings.oauth.github)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 48
				service: "github"                                                  // 49
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.github;                  // 52
			settingsObject.service = "github";                                  // 53
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 56
		}                                                                    //
		// linkedin                                                          //
		if (Meteor.settings.oauth.linkedin && _.isObject(Meteor.settings.oauth.linkedin)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 61
				service: "linkedin"                                                // 62
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.linkedin;                // 65
			settingsObject.service = "linkedin";                                // 66
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 69
		}                                                                    //
		// facebook                                                          //
		if (Meteor.settings.oauth.facebook && _.isObject(Meteor.settings.oauth.facebook)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 74
				service: "facebook"                                                // 75
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.facebook;                // 78
			settingsObject.service = "facebook";                                // 79
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 82
		}                                                                    //
		// twitter                                                           //
		if (Meteor.settings.oauth.twitter && _.isObject(Meteor.settings.oauth.twitter)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 87
				service: "twitter"                                                 // 88
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.twitter;                 // 91
			settingsObject.service = "twitter";                                 // 92
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 95
		}                                                                    //
		// meteor                                                            //
		if (Meteor.settings.oauth.meteor && _.isObject(Meteor.settings.oauth.meteor)) {
			// remove old configuration                                         //
			Accounts.loginServiceConfiguration.remove({                         // 100
				service: "meteor-developer"                                        // 101
			});                                                                 //
                                                                       //
			var settingsObject = Meteor.settings.oauth.meteor;                  // 104
			settingsObject.service = "meteor-developer";                        // 105
                                                                       //
			// add new configuration                                            //
			Accounts.loginServiceConfiguration.insert(settingsObject);          // 108
		}                                                                    //
	}                                                                     //
                                                                       //
	var url = "mqtt://94.234.165.147";                                    // 112
	Mbus.mqttConnect(url, ["/mbus/data"], {                               // 113
		"username": "marcus",                                                // 114
		"password": "test"                                                   // 115
	});                                                                   //
	OneWire.mqttConnect(url, ["/1-wire/data"], {                          // 117
		"username": "marcus",                                                // 118
		"password": "test"                                                   // 119
	});                                                                   //
	Ethercat.mqttConnect(url, ["/ethercat/data"], {                       // 121
		"username": "marcus",                                                // 122
		"password": "test"                                                   // 123
	});                                                                   //
	EthercatUnits.mqttConnect(url, ["/ethercat/units"], {                 // 125
		"username": "marcus",                                                // 126
		"password": "test"                                                   // 127
	});                                                                   //
	Gpio.mqttConnect(url, ["/gpio/units"], {                              // 129
		"username": "marcus",                                                // 130
		"password": "test"                                                   // 131
	});                                                                   //
	ModbusTcp.mqttConnect(url, ["/modbus-tcp/data"], {                    // 133
		"username": "marcus",                                                // 134
		"password": "test"                                                   // 135
	});                                                                   //
	ModbusTcpRead.mqttConnect(url, [""], {                                // 137
		"username": "marcus",                                                // 138
		"password": "test"                                                   // 139
	});                                                                   //
	ModbusRtu.mqttConnect(url, ["/modbus-rtu/data"], {                    // 141
		"username": "marcus",                                                // 142
		"password": "test"                                                   // 143
	});                                                                   //
	ModbusRtuRead.mqttConnect(url, ["/modbus-rtu/read"], {                // 145
		"username": "marcus",                                                // 146
		"password": "test"                                                   // 147
	});                                                                   //
	// EtherCatUnits.mqttConnect(url, ["/modbus/units"], {                //
	//     "username": "marcus",                                          //
	//     "password": "test"                                             //
	// });                                                                //
                                                                       //
	// Meteor.setInterval(function(){                                     //
                                                                       //
	// 	//Send Modbus TCP commands                                        //
	// 	var commands = ModbusTcpReadCommand.find().fetch();               //
	// 	commands.forEach(function(c,i){                                   //
	// 		delete c["_id"];                                                 //
	// 		ModbusTcpRead.insert({topic: "/modbus-tcp/read", message: {commands:[c]}, broadcast: true});
	// 	});                                                               //
	// }, 5000);                                                          //
});                                                                    //
                                                                       //
Meteor.methods({                                                       // 166
	"createUserAccount": function (options) {                             // 167
		if (!Users.isAdmin(Meteor.userId())) {                               // 168
			throw new Meteor.Error(403, "Access denied.");                      // 169
		}                                                                    //
                                                                       //
		var userOptions = {};                                                // 172
		if (options.username) userOptions.username = options.username;       // 173
		if (options.email) userOptions.email = options.email;                // 174
		if (options.password) userOptions.password = options.password;       // 175
		if (options.profile) userOptions.profile = options.profile;          // 176
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;
                                                                       //
		Accounts.createUser(userOptions);                                    // 179
	},                                                                    //
	"updateUserAccount": function (userId, options) {                     // 181
		// only admin or users own profile                                   //
		if (!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");                      // 184
		}                                                                    //
                                                                       //
		// non-admin user can change only profile                            //
		if (!Users.isAdmin(Meteor.userId())) {                               // 188
			var keys = Object.keys(options);                                    // 189
			if (keys.length !== 1 || !options.profile) {                        // 190
				throw new Meteor.Error(403, "Access denied.");                     // 191
			}                                                                   //
		}                                                                    //
                                                                       //
		var userOptions = {};                                                // 195
		if (options.username) userOptions.username = options.username;       // 196
		if (options.email) userOptions.email = options.email;                // 197
		if (options.password) userOptions.password = options.password;       // 198
		if (options.profile) userOptions.profile = options.profile;          // 199
                                                                       //
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;
		if (options.roles) userOptions.roles = options.roles;                // 202
                                                                       //
		if (userOptions.email) {                                             // 204
			var email = userOptions.email;                                      // 205
			delete userOptions.email;                                           // 206
			userOptions.emails = [{ address: email }];                          // 207
		}                                                                    //
                                                                       //
		var password = "";                                                   // 210
		if (userOptions.password) {                                          // 211
			password = userOptions.password;                                    // 212
			delete userOptions.password;                                        // 213
		}                                                                    //
                                                                       //
		if (userOptions) {                                                   // 216
			Users.update(userId, { $set: userOptions });                        // 217
		}                                                                    //
                                                                       //
		if (password) {                                                      // 220
			Accounts.setPassword(userId, password);                             // 221
		}                                                                    //
	},                                                                    //
	"sendMail": function (options) {                                      // 224
		this.unblock();                                                      // 225
                                                                       //
		Email.send(options);                                                 // 227
	},                                                                    //
	"updateSignal": function (signalId, values) {                         // 229
		console.log("updateSignal");                                         // 230
		if (!Users.isAdmin(Meteor.userId())) {                               // 231
			throw new Meteor.Error(403, "Access denied. You need to be an administrator to update a signal.");
		}                                                                    //
                                                                       //
		var signal = Signals.findOne(signalId);                              // 235
		console.log(signal);                                                 // 236
		if (signal) {                                                        // 237
			var raw = signal.raw;                                               // 238
			var offsetA = parseFloat(values.signal.offsetA);                    // 239
			var offsetB = parseFloat(values.signal.offsetB);                    // 240
			var scale = parseFloat(values.signal.scale);                        // 241
			var alarmH = parseFloat(values.signal.alarmH);                      // 242
			var alarmL = parseFloat(values.signal.alarmL);                      // 243
			if (alarmH < alarmL) {                                              // 244
				throw new Meteor.Error(601, "Alarm high cannot be less than alarm low.");
			} else if (alarmL > alarmH) {                                       //
				throw new Meteor.Error(602, "Alarm low cannot be greater than alarm high.");
			} else if (alarmL == alarmH) {                                      //
				throw new Meteor.Error(603, "Alarm low cannot be equal to alarm high.");
			}                                                                   //
                                                                       //
			setObj = {                                                          // 254
				name: values.signal.name,                                          // 255
				offsetA: offsetA,                                                  // 256
				offsetB: offsetB,                                                  // 257
				scale: scale,                                                      // 258
				unit: values.signal.unit,                                          // 259
				value: scale * (raw + offsetA) + offsetB,                          // 260
				hidden: values.signal.hidden,                                      // 261
				alarmH: alarmH,                                                    // 262
				alarmL: alarmL                                                     // 263
			};                                                                  //
                                                                       //
			Signals.update(signalId, { $set: setObj });                         // 266
		} else {                                                             //
			throw new Meteor.Error(100, "Signal does not exist");               // 269
		}                                                                    //
	},                                                                    //
	"addModbusTcpCommand": function (values) {                            // 272
		if (!Users.isAdmin(Meteor.userId())) {                               // 273
			throw new Meteor.Error(403, "Access denied. You need to be an administrator to add commands.");
		}                                                                    //
                                                                       //
		var send = {                                                         // 277
			ip: values.command.ip,                                              // 278
			addr: 1,                                                            // 279
			reg: parseInt(values.command.register),                             // 280
			offset: parseInt(values.command.offset),                            // 281
			len: parseInt(values.command.length)                                // 282
		};                                                                   //
                                                                       //
		ModbusTcpReadCommand.upsert(send, send);                             // 285
		console.log("Got tcp command", values);                              // 286
	}                                                                     //
});                                                                    //
                                                                       //
Accounts.onCreateUser(function (options, user) {                       // 290
	user.roles = ["user"];                                                // 291
                                                                       //
	if (options.profile) {                                                // 293
		user.profile = options.profile;                                      // 294
	}                                                                     //
                                                                       //
	return user;                                                          // 298
});                                                                    //
                                                                       //
Accounts.validateLoginAttempt(function (info) {                        // 301
                                                                       //
	// reject users with role "blocked"                                   //
	if (info.user && Users.isInRole(info.user._id, "blocked")) {          // 304
		throw new Meteor.Error(403, "Your account is blocked.");             // 305
	}                                                                     //
                                                                       //
	if (verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified) {
		throw new Meteor.Error(499, "E-mail not verified.");                 // 309
	}                                                                     //
                                                                       //
	return true;                                                          // 312
});                                                                    //
                                                                       //
Users.before.insert(function (userId, doc) {                           // 316
	if (doc.emails && doc.emails[0] && doc.emails[0].address) {           // 317
		doc.profile = doc.profile || {};                                     // 318
		doc.profile.email = doc.emails[0].address;                           // 319
	} else {                                                              //
		// oauth                                                             //
		if (doc.services) {                                                  // 322
			// google e-mail                                                    //
			if (doc.services.google && doc.services.google.email) {             // 324
				doc.profile = doc.profile || {};                                   // 325
				doc.profile.email = doc.services.google.email;                     // 326
			} else {                                                            //
				// github e-mail                                                   //
				if (doc.services.github && doc.services.github.accessToken) {      // 329
					var github = new GitHub({                                         // 330
						version: "3.0.0",                                                // 331
						timeout: 5000                                                    // 332
					});                                                               //
                                                                       //
					github.authenticate({                                             // 335
						type: "oauth",                                                   // 336
						token: doc.services.github.accessToken                           // 337
					});                                                               //
                                                                       //
					try {                                                             // 340
						var result = github.user.getEmails({});                          // 341
						var email = _.findWhere(result, { primary: true });              // 342
						if (!email && result.length && _.isString(result[0])) {          // 343
							email = { email: result[0] };                                   // 344
						}                                                                //
                                                                       //
						if (email) {                                                     // 347
							doc.profile = doc.profile || {};                                // 348
							doc.profile.email = email.email;                                // 349
						}                                                                //
					} catch (e) {                                                     //
						console.log(e);                                                  // 352
					}                                                                 //
				} else {                                                           //
					// linkedin email                                                 //
					if (doc.services.linkedin && doc.services.linkedin.emailAddress) {
						doc.profile = doc.profile || {};                                 // 357
						doc.profile.name = doc.services.linkedin.firstName + " " + doc.services.linkedin.lastName;
						doc.profile.email = doc.services.linkedin.emailAddress;          // 359
					} else {                                                          //
						if (doc.services.facebook && doc.services.facebook.email) {      // 361
							doc.profile = doc.profile || {};                                // 362
							doc.profile.email = doc.services.facebook.email;                // 363
						} else {                                                         //
							if (doc.services.twitter && doc.services.twitter.email) {       // 365
								doc.profile = doc.profile || {};                               // 366
								doc.profile.email = doc.services.twitter.email;                // 367
							} else {                                                        //
								if (doc.services["meteor-developer"] && doc.services["meteor-developer"].emails && doc.services["meteor-developer"].emails.length) {
									doc.profile = doc.profile || {};                              // 370
									doc.profile.email = doc.services["meteor-developer"].emails[0].address;
								}                                                              //
							}                                                               //
						}                                                                //
					}                                                                 //
				}                                                                  //
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
                                                                       //
Users.before.update(function (userId, doc, fieldNames, modifier, options) {
	if (modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
		modifier.$set.profile.email = modifier.$set.emails[0].address;       // 384
	}                                                                     //
});                                                                    //
                                                                       //
Accounts.onLogin(function (info) {});                                  // 388
                                                                       //
Accounts.urls.resetPassword = function (token) {                       // 392
	return Meteor.absoluteUrl('reset_password/' + token);                 // 393
};                                                                     //
                                                                       //
Accounts.urls.verifyEmail = function (token) {                         // 396
	return Meteor.absoluteUrl('verify_email/' + token);                   // 397
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=server.js.map

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
	ModbusTcp.mqttConnect(url, ["/modbustcp/data"], {                     // 133
		"username": "marcus",                                                // 134
		"password": "test"                                                   // 135
	});                                                                   //
	ModbusRtu.mqttConnect(url, ["/modbusrtu/data"], {                     // 137
		"username": "marcus",                                                // 138
		"password": "test"                                                   // 139
	});                                                                   //
	// EtherCatUnits.mqttConnect(url, ["/modbus/units"], {                //
	//     "username": "marcus",                                          //
	//     "password": "test"                                             //
	// });                                                                //
});                                                                    //
                                                                       //
Meteor.methods({                                                       // 148
	"createUserAccount": function (options) {                             // 149
		if (!Users.isAdmin(Meteor.userId())) {                               // 150
			throw new Meteor.Error(403, "Access denied.");                      // 151
		}                                                                    //
                                                                       //
		var userOptions = {};                                                // 154
		if (options.username) userOptions.username = options.username;       // 155
		if (options.email) userOptions.email = options.email;                // 156
		if (options.password) userOptions.password = options.password;       // 157
		if (options.profile) userOptions.profile = options.profile;          // 158
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;
                                                                       //
		Accounts.createUser(userOptions);                                    // 161
	},                                                                    //
	"updateUserAccount": function (userId, options) {                     // 163
		// only admin or users own profile                                   //
		if (!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");                      // 166
		}                                                                    //
                                                                       //
		// non-admin user can change only profile                            //
		if (!Users.isAdmin(Meteor.userId())) {                               // 170
			var keys = Object.keys(options);                                    // 171
			if (keys.length !== 1 || !options.profile) {                        // 172
				throw new Meteor.Error(403, "Access denied.");                     // 173
			}                                                                   //
		}                                                                    //
                                                                       //
		var userOptions = {};                                                // 177
		if (options.username) userOptions.username = options.username;       // 178
		if (options.email) userOptions.email = options.email;                // 179
		if (options.password) userOptions.password = options.password;       // 180
		if (options.profile) userOptions.profile = options.profile;          // 181
                                                                       //
		if (options.profile && options.profile.email) userOptions.email = options.profile.email;
		if (options.roles) userOptions.roles = options.roles;                // 184
                                                                       //
		if (userOptions.email) {                                             // 186
			var email = userOptions.email;                                      // 187
			delete userOptions.email;                                           // 188
			userOptions.emails = [{ address: email }];                          // 189
		}                                                                    //
                                                                       //
		var password = "";                                                   // 192
		if (userOptions.password) {                                          // 193
			password = userOptions.password;                                    // 194
			delete userOptions.password;                                        // 195
		}                                                                    //
                                                                       //
		if (userOptions) {                                                   // 198
			Users.update(userId, { $set: userOptions });                        // 199
		}                                                                    //
                                                                       //
		if (password) {                                                      // 202
			Accounts.setPassword(userId, password);                             // 203
		}                                                                    //
	},                                                                    //
	"sendMail": function (options) {                                      // 206
		this.unblock();                                                      // 207
                                                                       //
		Email.send(options);                                                 // 209
	},                                                                    //
	"updateSignal": function (signalId, values) {                         // 211
		if (!Users.isAdmin(Meteor.userId())) {                               // 212
			throw new Meteor.Error(403, "Access denied.");                      // 213
		}                                                                    //
                                                                       //
		var signal = Signals.findOne(signalId);                              // 216
		console.log(signal);                                                 // 217
		if (signal) {                                                        // 218
			var raw = signal.raw;                                               // 219
			var offsetA = parseFloat(values.signal.offsetA);                    // 220
			var offsetB = parseFloat(values.signal.offsetB);                    // 221
			var scale = parseFloat(values.signal.scale);                        // 222
			var alarmH = parseFloat(values.signal.alarmH);                      // 223
			var alarmL = parseFloat(values.signal.alarmL);                      // 224
			if (alarmH < alarmL) {                                              // 225
				throw new Meteor.Error(601, "Alarm high cannot be less than alarm low.");
			} else if (alarmL > alarmH) {                                       //
				throw new Meteor.Error(602, "Alarm low cannot be greater than alarm high.");
			} else if (alarmL == alarmH) {                                      //
				throw new Meteor.Error(603, "Alarm low cannot be equal to alarm high.");
			}                                                                   //
                                                                       //
			setObj = {                                                          // 235
				name: values.signal.name,                                          // 236
				offsetA: offsetA,                                                  // 237
				offsetB: offsetB,                                                  // 238
				scale: scale,                                                      // 239
				unit: values.signal.unit,                                          // 240
				value: scale * (raw + offsetA) + offsetB,                          // 241
				hidden: values.signal.hidden,                                      // 242
				alarmH: alarmH,                                                    // 243
				alarmL: alarmL                                                     // 244
			};                                                                  //
                                                                       //
			console.log(setObj);                                                // 247
                                                                       //
			Signals.update(signalId, { $set: setObj });                         // 249
		} else {                                                             //
			throw new Meteor.Error(100, "Signal does not exist");               // 252
		}                                                                    //
	}                                                                     //
});                                                                    //
                                                                       //
Accounts.onCreateUser(function (options, user) {                       // 257
	user.roles = ["user"];                                                // 258
                                                                       //
	if (options.profile) {                                                // 260
		user.profile = options.profile;                                      // 261
	}                                                                     //
                                                                       //
	return user;                                                          // 265
});                                                                    //
                                                                       //
Accounts.validateLoginAttempt(function (info) {                        // 268
                                                                       //
	// reject users with role "blocked"                                   //
	if (info.user && Users.isInRole(info.user._id, "blocked")) {          // 271
		throw new Meteor.Error(403, "Your account is blocked.");             // 272
	}                                                                     //
                                                                       //
	if (verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified) {
		throw new Meteor.Error(499, "E-mail not verified.");                 // 276
	}                                                                     //
                                                                       //
	return true;                                                          // 279
});                                                                    //
                                                                       //
Users.before.insert(function (userId, doc) {                           // 283
	if (doc.emails && doc.emails[0] && doc.emails[0].address) {           // 284
		doc.profile = doc.profile || {};                                     // 285
		doc.profile.email = doc.emails[0].address;                           // 286
	} else {                                                              //
		// oauth                                                             //
		if (doc.services) {                                                  // 289
			// google e-mail                                                    //
			if (doc.services.google && doc.services.google.email) {             // 291
				doc.profile = doc.profile || {};                                   // 292
				doc.profile.email = doc.services.google.email;                     // 293
			} else {                                                            //
				// github e-mail                                                   //
				if (doc.services.github && doc.services.github.accessToken) {      // 296
					var github = new GitHub({                                         // 297
						version: "3.0.0",                                                // 298
						timeout: 5000                                                    // 299
					});                                                               //
                                                                       //
					github.authenticate({                                             // 302
						type: "oauth",                                                   // 303
						token: doc.services.github.accessToken                           // 304
					});                                                               //
                                                                       //
					try {                                                             // 307
						var result = github.user.getEmails({});                          // 308
						var email = _.findWhere(result, { primary: true });              // 309
						if (!email && result.length && _.isString(result[0])) {          // 310
							email = { email: result[0] };                                   // 311
						}                                                                //
                                                                       //
						if (email) {                                                     // 314
							doc.profile = doc.profile || {};                                // 315
							doc.profile.email = email.email;                                // 316
						}                                                                //
					} catch (e) {                                                     //
						console.log(e);                                                  // 319
					}                                                                 //
				} else {                                                           //
					// linkedin email                                                 //
					if (doc.services.linkedin && doc.services.linkedin.emailAddress) {
						doc.profile = doc.profile || {};                                 // 324
						doc.profile.name = doc.services.linkedin.firstName + " " + doc.services.linkedin.lastName;
						doc.profile.email = doc.services.linkedin.emailAddress;          // 326
					} else {                                                          //
						if (doc.services.facebook && doc.services.facebook.email) {      // 328
							doc.profile = doc.profile || {};                                // 329
							doc.profile.email = doc.services.facebook.email;                // 330
						} else {                                                         //
							if (doc.services.twitter && doc.services.twitter.email) {       // 332
								doc.profile = doc.profile || {};                               // 333
								doc.profile.email = doc.services.twitter.email;                // 334
							} else {                                                        //
								if (doc.services["meteor-developer"] && doc.services["meteor-developer"].emails && doc.services["meteor-developer"].emails.length) {
									doc.profile = doc.profile || {};                              // 337
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
		modifier.$set.profile.email = modifier.$set.emails[0].address;       // 351
	}                                                                     //
});                                                                    //
                                                                       //
Accounts.onLogin(function (info) {});                                  // 355
                                                                       //
Accounts.urls.resetPassword = function (token) {                       // 359
	return Meteor.absoluteUrl('reset_password/' + token);                 // 360
};                                                                     //
                                                                       //
Accounts.urls.verifyEmail = function (token) {                         // 363
	return Meteor.absoluteUrl('verify_email/' + token);                   // 364
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=server.js.map

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// future-field-meteor.js                                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
if (Meteor.isClient) {                                                 // 1
  // counter starts at 0                                               //
  Session.setDefault('counter', 0);                                    // 3
                                                                       //
  Template.hello.helpers({                                             // 5
    counter: function () {                                             // 6
      return Session.get('counter');                                   // 7
    },                                                                 //
    signal: function () {                                              // 9
      var sample = MyCollection.findOne();                             // 10
      var signals = [];                                                // 11
      if (sample) {                                                    // 12
        for (var key in babelHelpers.sanitizeForInObject(sample.message)) {
          if (sample.message.hasOwnProperty(key)) {                    // 14
            var value = sample.message[key];                           // 15
            if (key !== "time") {                                      // 16
              var obj = {                                              // 17
                "name": key,                                           // 18
                "value": sample.message[key],                          // 19
                "timestamp": new Date(sample.message["time"])          // 20
              };                                                       //
              signals.push(obj);                                       // 22
            }                                                          //
          }                                                            //
        }                                                              //
        return signals;                                                // 26
      }                                                                //
    }                                                                  //
  });                                                                  //
                                                                       //
  Template.hello.events({                                              // 31
    'click button': function () {                                      // 32
      // increment the counter when button is clicked                  //
      Session.set('counter', Session.get('counter') + 1);              // 34
    }                                                                  //
  });                                                                  //
}                                                                      //
                                                                       //
MyCollection = new Mongo.Collection("my-collection");                  // 39
                                                                       //
if (Meteor.isServer) {                                                 // 41
  Meteor.startup(function () {                                         // 42
    MyCollection.mqttConnect("mqtt://127.0.0.1", ["/mbus/data"], { "username": "marcus", "password": "test" });
    // code to run on server at startup                                //
  });                                                                  //
}                                                                      //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=future-field-meteor.js.map

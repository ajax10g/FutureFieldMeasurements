(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/string_utils.js                                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
this.escapeRegEx = function (string) {                                 // 1
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");         // 2
};                                                                     //
                                                                       //
this.replaceSubstrings = function (string, find, replace) {            // 5
	return string.replace(new RegExp(escapeRegEx(find), 'g'), replace);   // 6
};                                                                     //
                                                                       //
this.joinStrings = function (stringArray, join) {                      // 9
	var sep = join || ", ";                                               // 10
	var res = "";                                                         // 11
	_.each(stringArray, function (str) {                                  // 12
		if (str) {                                                           // 13
			if (res) res = res + sep;                                           // 14
			res = res + str;                                                    // 16
		}                                                                    //
	});                                                                   //
	return res;                                                           // 19
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=string_utils.js.map

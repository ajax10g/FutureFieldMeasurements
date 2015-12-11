(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/object_utils.js                                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
/*                                                                     //
   Returns property value, where property name is given as path.       //
                                                                       //
   Example:                                                            //
                                                                       //
       getPropertyValue("x.y.z", {x: { y: { z: 123}}});                //
*/                                                                     //
                                                                       //
this.getPropertyValue = function (propertyName, obj) {                 // 9
	return propertyName.split('.').reduce(function (o, i) {               // 10
		return o[i];                                                         // 10
	}, obj);                                                              //
};                                                                     //
                                                                       //
/*                                                                     //
   converts properties in format { "x.y": "z" } to { x: { y: "z" } }   //
*/                                                                     //
                                                                       //
this.deepen = function (o) {                                           // 18
	var oo = {},                                                          // 19
	    t,                                                                //
	    parts,                                                            //
	    part;                                                             //
	for (var k in babelHelpers.sanitizeForInObject(o)) {                  // 20
		t = oo;                                                              // 21
		parts = k.split('.');                                                // 22
		var key = parts.pop();                                               // 23
		while (parts.length) {                                               // 24
			part = parts.shift();                                               // 25
			t = t[part] = t[part] || {};                                        // 26
		}                                                                    //
		t[key] = o[k];                                                       // 28
	}                                                                     //
	return oo;                                                            // 30
};                                                                     //
                                                                       //
/*                                                                     //
	Function converts array of objects to csv, tsv or json string         //
                                                                       //
	exportFields: list of object keys to export (array of strings)        //
	fileType: can be "json", "csv", "tsv" (string)                        //
*/                                                                     //
                                                                       //
this.convertArrayOfObjects = function (data, exportFields, fileType) {
	data = data || [];                                                    // 41
	fileType = fileType || "csv";                                         // 42
	exportFields = exportFields || [];                                    // 43
                                                                       //
	var str = "";                                                         // 45
	// export to JSON                                                     //
	if (fileType == "json") {                                             // 47
                                                                       //
		var tmp = [];                                                        // 49
		_.each(data, function (doc) {                                        // 50
			var obj = {};                                                       // 51
			_.each(exportFields, function (field) {                             // 52
				obj[field] = doc[field];                                           // 53
			});                                                                 //
			tmp.push(obj);                                                      // 55
		});                                                                  //
                                                                       //
		str = JSON.stringify(tmp);                                           // 58
	}                                                                     //
                                                                       //
	// export to CSV or TSV                                               //
	if (fileType == "csv" || fileType == "tsv") {                         // 62
		var columnSeparator = "";                                            // 63
		if (fileType == "csv") {                                             // 64
			columnSeparator = ",";                                              // 65
		}                                                                    //
		if (fileType == "tsv") {                                             // 67
			columnSeparator = "\t";                                             // 68
		}                                                                    //
                                                                       //
		_.each(exportFields, function (field, i) {                           // 71
			if (i > 0) {                                                        // 72
				str = str + columnSeparator;                                       // 73
			}                                                                   //
			str = str + "\"" + field + "\"";                                    // 75
		});                                                                  //
		str = str + "\r\n";                                                  // 77
                                                                       //
		_.each(data, function (doc) {                                        // 79
			_.each(exportFields, function (field, i) {                          // 80
				if (i > 0) {                                                       // 81
					str = str + columnSeparator;                                      // 82
				}                                                                  //
                                                                       //
				var value = getPropertyValue(field, doc) + "";                     // 85
				value = value.replace(/"/g, '""');                                 // 86
				if (typeof value == "undefined") str = str + "\"\"";else str = str + "\"" + value + "\"";
			});                                                                 //
			str = str + "\r\n";                                                 // 92
		});                                                                  //
	}                                                                     //
                                                                       //
	return str;                                                           // 96
};                                                                     //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=object_utils.js.map

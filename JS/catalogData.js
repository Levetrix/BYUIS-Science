Array.prototype.shuffle = function(){ //v1.0
	var o = this;
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

$.ajax({
		url: window.location.protocol + "//is.byu.edu/site/courses/catalogdata.json.cfm",
		dataType: "json"
	}).done(function( data, textStatus ) {
		//console.log(data);
		catalogData = data['courses'];
		$.ajax({
			url: "courseXref.json.txt",
			dataType: "json"
		}).done(function( data, textStatus ) {
			var xref = data;
			var matchedData = {};
			for(var topLevelCategory in catalogData) {
				//console.log("catalogData['"+topLevelCategory+"']");
				//console.log(catalogData[topLevelCategory]);
				for(var courseCategory in catalogData[topLevelCategory]) {
					//console.log("catalogData['"+topLevelCategory+"']['"+ courseCategory+"']");
					//console.log(catalogData[topLevelCategory][courseCategory]);
					for(var courseI=0;courseI<catalogData[topLevelCategory][courseCategory].length;courseI++) {
						//console.log("catalogData['"+topLevelCategory+"']['"+courseCategory+"']["+courseI+"]");
						//console.log(catalogData[topLevelCategory][courseCategory][courseI]);
						
						
						//	Below accomplishes the same as the following for loop, however the for loop doesn't require the key to be "Featured Products"
						//	var matchRegEx = new RegExp(xref["Featured Products"]);
						for(var matchCategory in xref) {
							for(var i=0;i<xref[matchCategory].length;i++) {
								var matchRegEx = new RegExp(xref[matchCategory][i]['pattern']);
								if(typeof matchedData[matchString] == "undefined")
									matchedData[matchString] = {};
								if(matchRegEx.test(catalogData[topLevelCategory][courseCategory][courseI]['course-title'])) {
									//console.log(catalogData[topLevelCategory][courseCategory][courseI]['course-title']);
									//console.log(catalogData[topLevelCategory][courseCategory][courseI]);
									matchedData[matchString][catalogData[topLevelCategory][courseCategory][courseI]['course-title']] = catalogData[topLevelCategory][courseCategory][courseI];
								}
							}
							
						}
					}
				}
			}
			console.log(matchedData);
			var shuffledCourses = (Object.keys(matchedData["Featured Products"])).shuffle();
			var repeatedFeaturedCourse = $("");
			for(var i=0;i<shuffledCourses.length;i++) {
				var courseTitle = shuffledCourses[i],
					course = matchedData[courseTitle];
				console.log(courseTitle);
			}
		});
	})
;
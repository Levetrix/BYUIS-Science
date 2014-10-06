Array.prototype.shuffle = function(){ //v1.0
	var o = this;
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

$.ajax({
		url: window.location.protocol + "//is.byu.edu/site/courses/catalogdata.json.cfm",
		dataType: "json"
	}).always(function( data, textStatus, errorThrown ) {
		//console.log(data);
		catalogData = data['courses'];
		$.ajax({
			url: "courseXref.json.txt",
			dataType: "json"
		}).always(function( data, textStatus, errorThrown ) {
			if(Object.keys(errorThrown).indexOf("error") == -1) {
				//	There was en error!!!
				console.log("XREF ERROR: " + errorThrown.message);
				console.log(errorThrown);
				$.error("XREF ERROR: "+errorThrown.message + "\n" + errorThrown.stack);
				return false;
			}
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
								var matchRegEx = new RegExp(xref[matchCategory][i]['pattern']),
									matchString = matchCategory
								;
								if(typeof matchedData[matchString] == "undefined")
									matchedData[matchString] = {};
								if(matchRegEx.test(catalogData[topLevelCategory][courseCategory][courseI]['course-title'])) {
									var courseTitle = catalogData[topLevelCategory][courseCategory][courseI]['course-title'];
									//console.log(courseTitle);
									//console.log(catalogData[topLevelCategory][courseCategory][courseI]);
									matchedData[matchString][courseTitle] = catalogData[topLevelCategory][courseCategory][courseI];
									matchedData[matchString][courseTitle]["img"] = xref[matchCategory][i]["img"];
									matchedData[matchString][courseTitle]["marketing-text"] = xref[matchCategory][i]["marketing-text"];
								}
							}
						}
					}
				}
			}
			//console.log(matchedData);
			//console.log(matchedData["Featured Products"]);
			var shuffledCourses = (Object.keys(matchedData["Featured Products"])).shuffle();
			//console.log(shuffledCourses);
			var featuredCourseClone = $("#featured-courses li").first().clone(true,true);
			$("#featured-courses li").remove();
			for(var i=0;i<shuffledCourses.length;i++) {
				var courseTitle = shuffledCourses[i],
					course = matchedData["Featured Products"][courseTitle];
					newfeaturedCourse = featuredCourseClone.clone(true,true)
				;
				// Set title
				newfeaturedCourse.find("h2").text(course['title'].trim());
				newfeaturedCourse.find("h3").text(course['course-title'].trim());
				newfeaturedCourse.attr("id", course['course-title'].trim());
				newfeaturedCourse.attr("data-course-code", course['course-title']);
				newfeaturedCourse.attr("data-course-background", course['img']);
				newfeaturedCourse.find("a").each(function() {
					var $this = $(this);
					if($this.attr("href")) {
						if($this.attr("href").substring(0,1) == "#") {
							$this.attr("href", "#"+course['course-title']);
						}
					}
					if($this.attr("data-href")) {
						if($this.attr("data-href").substring(0,1) == "#") {
							$this.attr("data-href", "#"+course['course-title']);
						}
					}
					if($this.text().toLowerCase().trim() == "more info") {
						$this.attr("href", "http://is.byu.edu/site/courses/description.cfm?"+course['types'].pop()['short-title'].trim());
					}
				});
				newfeaturedCourse.find("p").html(course['marketing-text']);
				$("#featured-courses").append(newfeaturedCourse);
			}
			$(window).resize();
		});
	})
;
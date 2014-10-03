var showdebug=true,
	ssOptions = {
		speed: 250,
		easing: 'linear',
		offset: 0,
		updateURL: true,
		callbackAfter: function ( toggle, anchor ) {	// Function to run after scrolling
			if(showdebug) console.log("setting hash");
			window.location = anchor;
			//if($(window).scrollTop() > $("#featured-courses").parent().find("h2").offset().top) smoothScroll.animateScroll(null, "#featured-courses", {speed: 250,easing: 'linear',offset:0,updateURL:false});
		}
},
	clickTileHandler = function() {
		if(showdebug) console.log("clicked a tile!");
		$(this).find("> a").get(0).click();
},
	clickHashLink = function( e ) {
		var $this = $(this),
			targetId =  $this.attr("data-href") || $this.attr("href"),
			$that = ($(targetId+"-moved").length>0)?$(targetId+"-moved"):$(targetId),
			opened = $that.hasClass("clicked")
		;
		//	cancel bubble to avoid artificial double-click
		e.stopPropagation();

		if(showdebug) console.log("clicked an anchor!");
		//	Remove all clicked tile states
		$(".clicked").removeClass("clicked");
		//	Add the clicked state to the one we're moving to
		if(!opened)
			$that.addClass("clicked");
		//	Set the window hash to trigger style :target (no longer using the :target style trick for javascript-enabled users)
		//window.location = targetId;
		//	Scroll to the desired position
		smoothScroll.animateScroll(this, targetId, ssOptions);
},
	makeTileFillWindow = function( e ) {
		var $this = $(this),
			targetId =  $this.attr("data-href") || $this.attr("href"),
			$that = ($(targetId+"-moved").length>0)?$(targetId+"-moved"):$(targetId)
		;
		$("#featured-courses li").each(function() {
			$(this).removeAttr("style");
		});
		//	Only make it full height if the smallest breakpoint is active
		if(575 > $(window).width() && !$this.hasClass("clicked")) {
			if(showdebug) console.log("resizing height of tile! "+$this.attr("id"));
			if(showdebug) console.log("height of tile: "+$this.height());
			if(showdebug) console.log("height of window: "+$(window).height());
			$this.css("height",$(window).height() + "px");
			if(showdebug) console.log("height of tile: "+$this.height());
		}
};

smoothScroll.init(ssOptions);
//	Change the anchors with javascript for users that have it available.
$(window).resize(function() {
	if(showdebug) console.log("window resized!");
	//	The y-position of the featured courses element will be scrolled to on the larger breakpoints
	var fcYOffset = $("#featured-courses").parent().find("h2").offset().top+"px";
	//	Unassign the event handlers if they are there - they are re-assigned below
	$("#featured-courses li,#featured-courses li > a").off(".tileScroll");
	
	//	The clicked class is removed to allow the user to see additional tiles
	$(".clicked").removeClass("clicked");
	
	//	If the cursor-pointer isn't on the li elements, add it (this is not present in the HTML because the tiles are not "hot" or clickable without javascript so the UI feedback that would indicate clickableness would be inappropriate)
	if(!$("#featured-courses li").hasClass("cursor-pointer")) $("#featured-courses li").addClass("cursor-pointer");
	
	//	Attach the click handler to the tiles
	$("#featured-courses li").on("click.tileScroll",makeTileFillWindow);
	$("#featured-courses li").on("click.tileScroll",clickTileHandler);
	
	//	Remove the scroll anchors, because they will be added in the loop below according to breakpoint logic
	$(".hidden-scroll-anchor").remove();
	//	Loop through the anchors to update the scroll anchors and remove typical hash scrolling behavior
	$("#featured-courses a").each(function() {
		var $this = $(this),
			href = $this.attr("href") || $this.attr("data-href");
		//	Only needed if the anchor has an "href" attribute (or an href that has already been moved to "data-href" attribute
		if($this.parent()[0].tagName.toLowerCase() == "button") {
			if(showdebug) console.log("This is a button link: " + href + "\n" + $this[0].tagName);
			if(showdebug) console.log($this);
		} else if(href) {
			//	Also only if the "href" begins with a hash (meaning it is an in-page link)
			if(href.substring(0,1) == "#") {
				//	Move the data into a data attribute (removes the typical scroll behavior)
				$this.attr("data-href",href);
				$this.removeAttr("href");
				
				//	Attach our custom handler to the anchor
				$this.on("click.tileScroll", clickHashLink);
				
				//	Move the id ... it will be used on the new scroll element
				$this.parent().attr("id",(href+"-moved").substr(1));
				//	Only change the scroll height behavior different for the smallest breakpoint
				var newScrollAnchor = $('<div class="hidden-scroll-anchor">&nbsp;</div>').attr("id",href.substr(1));
				if(575 <= $(window).width()) {
					//	Insert an invisible element with the id this points to at the desired scroll position
					$("body").prepend(newScrollAnchor.css("top",fcYOffset));
				} else {
					$("body").prepend(newScrollAnchor.css("top",($(href+"-moved").offset().top)+"px"));
				}
				if(showdebug) console.log("added click behavior and scroll anchor for "+href);
			}
		}
	});
});
$(window).resize();
	
var showdebug=true,
	ssOptions = {
		speed: 250,
		easing: 'linear',
		offset: 0,
		updateURL: true,
		callbackAfter: function ( toggle, anchor ) {	// Function to run after scrolling
			if(showdebug) console.log("setting hash");
			window.location = anchor;
			if($(window).scrollTop() > $("#featured-courses").parent().find("h2").offset().top) smoothScroll.animateScroll(null, "#featured-courses", {speed: 250,easing: 'linear',offset:0,updateURL:false});
		}
},
	clickTileHandler = function() {
		if(showdebug) console.log("clicked a tile!");
		if(!$(this).hasClass("clicked"))
			$(this).find("a").get(0).click();
		else
			$(this).removeClass("clicked");
},
	clickHashLink = function( e ) {
		var $this = $(this),
			targetId =  $this.attr("data-href") || $this.attr("href"),
			$that = ($(targetId+"-moved").length>0)?$(targetId+"-moved"):$(targetId)
		;
		//	cancel bubble to avoid artificial double-click
		e.stopPropagation();
		
		if(showdebug) console.log("clicked an anchor!");
		//	Remove all clicked tile states
		$(".clicked").removeClass("clicked");
		//	Add the clicked state to the one we're moving to
		$that.addClass("clicked");
		//	Set the window hash to trigger style :target (no longer using the :target style trick for javascript-enabled users)
		//window.location = targetId;
		//	Scroll to the desired position
		smoothScroll.animateScroll(this, targetId, ssOptions);
};

smoothScroll.init(ssOptions);
$(".clicked").removeClass("clicked").addClass("cursor-pointer").on("click.tileScroll",clickTileHandler);
//	Change the anchors with javascript for users that have it available.
$(window).resize(function() {
	var fcYOffset = $("#featured-courses").parent().find("h2").offset().top+"px";
	//$("#featured-courses li").off(".tileScroll");
	if(showdebug) console.log("window resized!");
	if(showdebug) console.log($("#featured-courses").parent().height()+" <= "+$(window).height());
	if(showdebug) console.log($("#featured-courses").parent().height() <= $(window).height());
	$("a").each(function() {
		var $this = $(this),
			href = $this.attr("href") || $this.attr("data-href");
		//	Only needed if the anchor has an "href" attribute
		if(href) {
			//	Also only if the "href" begins with a hash (meaning it is an in-page link)
			if(href.substring(0,1) == "#") {
				//	Move the data into a data attribute (removes the typical scroll behavior)
				$this.attr("data-href",href);
				$this.removeAttr("href");
				
				//	Attach our custom handler to the anchor
				$this.on("click.tileScroll", clickHashLink);
				
				//	Only change the behavior if the featured courses element will fit on the screen for the user.
				if($("#featured-courses").parent().height() <= $(window).height()) {
					//	Move the id ... it will be used on the new scroll element
					$(href).attr("id",(href+"-moved").substr(1));
					//	Insert an invisible element with the id this points to at the desired scroll position
					$("body").prepend($('<div class="hidden-scroll-anchor">&nbsp;</div>').attr("id",href.substr(1)).css("top",fcYOffset));
				} else if(href.indexOf("-moved") > -1) {
					var newhref = href.substr(1).replace("-moved",""),
						oldhref = href
					;
					//	Move the id back ... it will was used on the new scroll element
					$(newhref).remove();			//	Step 1: remove the created element (the one that has the new href already)
					$(oldhref).attr("id",newhref);	//	Step 2: change the href on the original anchor back
				}
			}
		}
	});
});
$(window).resize();
	
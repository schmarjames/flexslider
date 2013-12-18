/**********************************************************
/* Flex Slider JS Plugin
/* By Schmar James
**********************************************************/

var flex_slider = function(config) {
	// declare variables 
	this.rotating = false;
	this.sl_counter = 1;
	this.sl_interval;
	this.slide_max;
	this.begin_anime;
	this.slide_parent;
	this.wrapper;
	this.slide_width;
	var ob = this;
	this.conf = {
			controls: true, //bool
			//transition: "horiz_slide", //string
			automatic: true,
			speed: 4000, //integer
			control_prev: '',
			control_next: '',
			control_image_path: '',
			callback: function(){} 
	};
	
	this.construct = function(){
		var total_sl, slide_h, slide_w, sl_extra_h, sl_extra_w;
		
		for(var opt in config){
			this.conf[opt] = config[opt];
		}
		
		// Check to see if the slide_parent value is not a string or empty
		if(isNaN(this.conf.slide_parent) && this.conf.slide_parent != "")
		{
			ob.slide_parent = jQuery(this.conf.slide_parent);
			slide_dimensions = get_slides_size(ob.slide_parent);
			
			slide_h = slide_dimensions[0];
			slide_w = slide_dimensions[1];
			sl_extra_h = slide_dimensions[2];
			sl_extra_w = slide_dimensions[3];
			total_sl = slide_dimensions[4];
			
			prepare_parent(ob.slide_parent, sl_extra_h, sl_extra_w);
		}
		
		// Check to see if slides_shown value is not a string
		if(!isNaN(this.conf.slides_shown))
		{
			ob.wrapper = create_wrapper(ob.slide_parent, total_sl, sl_extra_w);
		}
		
		// Check to see if controller should be shown
		if(ob.conf.controls == true && ob.wrapper.children.length>1)
		{
			controls = generate_controls(ob.slide_parent, ob.conf.control_image_path);
			
			var prev_btn = controls[0],
				next_btn = controls[1];
				
			
		}
		
		start_rotate();
	};
	
	AttachEvent = function(element, type, handler){
		if(element.addEventListener) element.addEventListener(type, handler, false)
		else element.attachEvent("on"+type, handler);
	};
		
	// Setup main wrapper div for entire slide
	var prepare_parent = function(parent, sh, sw){
			parent.width(sw*ob.conf.slides_shown);
			parent.height(sh);
			parent.css("overflow","hidden");
	};
	
	// Setup the inner wrapper that will hold all slides
	var create_wrapper = function(parent, total_slides, slide_width){
			var namespace = parent.attr("id"),
				wrapper = document.createElement('div'),
				inner_slides = parent.html();
				
			wrapper.setAttribute("id", ""+namespace+"_ad_wrapper");
			jQuery(wrapper).css({
					"position": "absolute",
					"top": 		0,
					"left":		0,
					"width":	(parseInt(parent.width())*(Math.ceil(total_slides/ob.conf.slides_shown)))+"px",
					"height":	parent.height()+"px"
			});
			
			parent.html('');
			parent.wrapInner(wrapper);
			jQuery(wrapper).html(inner_slides);	
			
			return wrapper;
	};
	
	// Get and set the dimensions of the slides
	var get_slides_size = function(parent){
			var slide = parent.children('.ad'),
				slide_extra_h = parseInt(slide.css("marginTop")) + parseInt(slide.css("marginBottom")) + parseInt(slide.css("paddingTop")) + parseInt(slide.css("paddingBottom")),
				slide_extra_w = parseInt(slide.css("marginLeft")) + parseInt(slide.css("marginRight")) + parseInt(slide.css("paddingLeft")) + parseInt(slide.css("paddingRight"));
			
			slide.each(function(){
				jQuery(this).css({
						"width":	ob.conf.width+"px",
						"height": 	ob.conf.height+"px",
						"float": 	"left"
				});
			});
			
			return [slide.height(), slide.width(), slide.height()+slide_extra_h, slide.width()+slide_extra_w, slide.length]
	};
	
	var generate_controls = function(parent, image_path){
			
			var prev = document.createElement('a'),
				next = document.createElement('a'),
				con_namespace = parent.attr("id");
				
			if(image_path != '')
			{
				prev.setAttribute("id", ""+con_namespace+"_prev");
				next.setAttribute("id", ""+con_namespace+"_next");
				jQuery(prev).css("display", "block");
				jQuery(next).css("display", "block");
				
				prev_img = new Image();
				next_img = new Image();
				
				prev_img.src = (image_path != '') ? image_path +""+ ob.conf.control_prev +"" : "images/"+ ob.conf.control_prev +"";
				next_img.src = (image_path != '') ? image_path +""+ ob.conf.control_next +"" : "images/"+ ob.conf.control_next +"";
				
				jQuery(prev).append(prev_img);
				jQuery(next).append(next_img);
				
				jQuery(parent).append(prev);
				jQuery(parent).append(next);
			}
			
			jQuery(prev).bind("click", rotate_previous);
			jQuery(next).bind("click", rotate_next);
			return [jQuery(con_namespace+"_prev"), jQuery(con_namespace+"_next")];
	};
	
	/*var check_animation_type = function(){
		
			switch(ob.conf.transition) {
				case 'horiz_slide': return horizontal_anime(); break;
				case 'fade': return fade_anime(); break;
			}	
	};*/
	
	var start_rotate = function(){
			if(ob.conf.automatic == true)
			ob.begin_anime = setInterval(function() { ob.sl_counter++; horizontal_anime();}, ob.conf.speed);
	};
	
	var horizontal_anime = function(){
			var total_width = parseInt(jQuery(ob.wrapper).width());
				ob.slide_width = parseInt(jQuery(ob.slide_parent).width());
				ob.slide_max = (Math.ceil(total_width/ob.slide_width)+1);
				
			if(ob.sl_counter != ob.slide_max && ob.rotating == false)
			{
				ob.rotating=true;
				jQuery(ob.wrapper).animate({"left": '-=' +ob.slide_width}, 500, 
					function(){
						ob.rotating = false;
				});	
			}
			else if(ob.sl_counter == ob.slide_max && ob.rotating == false)
			{
				ob.rotating = true;
				jQuery(ob.wrapper).animate({"left": '+=' +(total_width-ob.slide_width)}, 500,
					function(){
						ob.rotating = false;
						ob.sl_counter = 1;
				});
			}
	};
	
	var rotate_previous = function(){
			if(ob.sl_counter != 1 && ob.rotating == false)
			{
				clearInterval(ob.begin_anime);
				ob.rotating = true;
				
				ob.sl_counter -= 1;
				
				jQuery(ob.wrapper).animate({"left": '+=' +ob.slide_width}, 500,
					function(){
						ob.rotating = false;
						start_rotate();	
				});
			}
	};
	
	var rotate_next = function(e){
			if(ob.sl_counter != ob.slide_max && ob.rotating == false)
			{
				clearInterval(ob.begin_anime);
				ob.rotating = true;
				ob.sl_counter++;
				
				jQuery(ob.wrapper).animate({"left": '-=' +ob.slide_width}, 500,
					function(){
						ob.rotating = false;
						start_rotate();	
				});
			}
	};
	
	this.construct();
}
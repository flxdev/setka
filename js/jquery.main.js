$(function(){

	clearInputs();
	initTabs();
	addClass();
	slideMap();
	initPlugins();

})

/*---- clear inputs ---*/
function clearInputs(){
	$('input:text, input:password, textarea').each(function(){
		var _el = $(this);
		var _val = _el.val();
		_el.bind('focus', function(){
			if(this.value == _val) {
				this.value = '';
			}
		}).bind('blur', function(){
			if(this.value == '') {
				this.value = _val;
			}
		});
	});
};
function initTabs(){
	$('.catalog-list-scroll').each(function(){
		$(this).jScrollPane({
			verticalDragMaxHeight: 80,
			verticalDragMinHeight: 80,
		});
		var api = $(this).data('jsp');
		var throttleTimeout;
		$(window).bind('resize',function(){
			if ($.browser.msie){
				if (!throttleTimeout){
					throttleTimeout = setTimeout(function(){
						api.reinitialise();
						throttleTimeout = null;
					},50);
				}
			}
			else{
				api.reinitialise();
			}
		});
	});
}
function slideMap(){
	var holder = $('.slide-holder'),
		opener = holder.find('a.opener'),
		map = holder.find('div.map'),
		box = $('.promo-cols'),
		animSpeed = 500;

	if(map.length){
		if(!holder.hasClass('active')) map.css({position: 'absolute',top: '-9999px',left: '-9999px'})
		else box.slideUp(0);

		opener.click(function(){
			if(holder.hasClass('active')){
				map.slideUp(animSpeed,function (){
					holder.removeClass('active')
				})
				box.slideDown(animSpeed);
			}
			else {
				map.css({
					position: 'static',
					top: 'auto',
					left: 'auto'
				})
				map.slideUp(0);
				map.slideDown(animSpeed , function(){
					holder.addClass('active');
				});
				box.slideUp(animSpeed);
			}
			return false;
		})
	}
};

function initPlugins(){
 url = window.location.href;
url = url.split('http://');
url = url[1].split('/');
if(url[1]=='catalogue'){
if((url[2]!='setki-metallicheskie')&&(url[2]!='setki-plastikovye')&&(url[2]!='setki-iz-poliefirnogo-volokna')&&(url[2]!='vse-setki')){
 $('#id1').css('display','none');
}
if((url[2]!='izdeliya-iz-plastmassy-i-neylona')&&(url[2]!='dyubeli-pod-khomuty')&&(url[2]!='fiksatory-armatury')){
 $('#id2').css('display','none');
}
}
$(".fancybox-button").fancybox({
		prevEffect		: 'none',
		nextEffect		: 'none',
		closeBtn		: false,
		helpers		: {
			title	: { type : 'inside' },
			buttons	: {}
		}
	});

	$('.promo-gallery').fadeGallery({
		slideElements:'ul.slideset > li',
		autoRotation:3000,
		autoHeight:true,
		btnNext:false,
		btnPrev:false,
		switchTime:3000,
		pagerLinks:'ul.switcher li',
		IE:true
	});
	$('.visual').fadeGallery({
		slideElements:'ul.slideset > li',
		autoRotation: true,
		autoHeight:false,
		btnNext:false,
		btnPrev:false,
		switchTime:3000,
		pagerLinks:'.visual-nav ul li a',
		event: 'hover',
		IE:true
	});
	/*jQuery('.slide-holder').OpenClose({
		activeClass:'active',
		opener:'a.opener',
		slider:'div.goods-description',
		effect:'slide',
		//animSpeed:500
	});
	jQuery('.side-nav li').OpenClose({
		activeClass:'active',
		opener:'a.opener',
		slider:'div.slide',
		effect:'slide',
		animSpeed:500
	});*/
	jQuery('div.about-gallery').scrollGallery({
		mask: 'div.holder',
		slider: '>ul',
		slides: '>li',
		btnPrev: 'a.btn-prev',
		btnNext: 'a.btn-next',
		disableWhileAnimating: false,
		circularRotation: true,
		autoRotation: false,
		animSpeed: 600,
		step:1
	});
	if($('.about-gallery .slider li a').length){
		//$('.about-gallery .slider li a').fancybox();
	}
}

function addClass(){
	$('#nav li:first').addClass('first');
	if($('#nav li:last').hasClass('online')) $('#nav li').eq($('#nav li:last').index() - 1).addClass('last');
	else $('#nav li:last').addClass('last');
}
// slideshow plugin
jQuery.fn.fadeGallery = function(_options){
	var _options = jQuery.extend({
		slideElements:'div.slideset > div',
		pagerLinks:'div.pager a',
		btnNext:'a.btn-next',
		btnPrev:'a.btn-prev',
		btnPlayPause:'a.play-pause',
		btnPlay:'a.play',
		btnPause:'a.pause',
		pausedClass:'paused',
		disabledClass: 'disabled',
		playClass:'playing',
		activeClass:'active',
		currentNum:false,
		allNum:false,
		startSlide:null,
		noCircle:false,
		pauseOnHover:true,
		autoRotation:false,
		autoHeight:false,
		onChange:false,
		switchTime:3000,
		duration:650,
		event:'click',
		IE:false
	},_options);

	return this.each(function(){
		// gallery options
		var _this = jQuery(this);
		var _slides = jQuery(_options.slideElements, _this);
		var _pagerLinks = jQuery(_options.pagerLinks, _this);
		var _btnPrev = jQuery(_options.btnPrev, _this);
		var _btnNext = jQuery(_options.btnNext, _this);
		var _btnPlayPause = jQuery(_options.btnPlayPause, _this);
		var _btnPause = jQuery(_options.btnPause, _this);
		var _btnPlay = jQuery(_options.btnPlay, _this);
		var _pauseOnHover = _options.pauseOnHover;
		var _autoRotation = _options.autoRotation;
		var _activeClass = _options.activeClass;
		var _disabledClass = _options.disabledClass;
		var _pausedClass = _options.pausedClass;
		var _playClass = _options.playClass;
		var _autoHeight = _options.autoHeight;
		var _duration = _options.duration;
		if (_options.IE && $.browser.msie) {
			if ($.browser.version < 9) _duration = 0;
		}
		var _switchTime = _options.switchTime;
		var _controlEvent = _options.event;
		var _currentNum = (_options.currentNum ? jQuery(_options.currentNum, _this) : false);
		var _allNum = (_options.allNum ? jQuery(_options.allNum, _this) : false);
		var _startSlide = _options.startSlide;
		var _noCycle = _options.noCircle;
		var _onChange = _options.onChange;

		// gallery init
		var _hover = false;
		var _prevIndex = 0;
		var _currentIndex = 0;
		var _slideCount = _slides.length;
		var _timer;
		if(_slideCount < 2) return;

		_prevIndex = _slides.index(_slides.filter('.'+_activeClass));
		if(_prevIndex < 0) _prevIndex = _currentIndex = 0;
		else _currentIndex = _prevIndex;
		if(_startSlide != null) {
			if(_startSlide == 'random') _prevIndex = _currentIndex = Math.floor(Math.random()*_slideCount);
			else _prevIndex = _currentIndex = parseInt(_startSlide);
		}
		_slides.hide().eq(_currentIndex).show();
		if(_autoRotation) _this.removeClass(_pausedClass).addClass(_playClass);
		else _this.removeClass(_playClass).addClass(_pausedClass);

		// gallery control
		if(_btnPrev.length) {
			_btnPrev.bind(_controlEvent,function(){
				prevSlide();
				return false;
			});
		}
		if(_btnNext.length) {
			_btnNext.bind(_controlEvent,function(){
				nextSlide();
				return false;
			});
		}
		if(_pagerLinks.length) {
			_pagerLinks.each(function(_ind){
				jQuery(this).bind(_controlEvent,function(){
					if(_currentIndex != _ind) {
						_prevIndex = _currentIndex;
						_currentIndex = _ind;
						switchSlide();
					}
					return false;
				});
			});
		}

		// play pause section
		if(_btnPlayPause.length) {
			_btnPlayPause.bind(_controlEvent,function(){
				if(_this.hasClass(_pausedClass)) {
					_this.removeClass(_pausedClass).addClass(_playClass);
					_autoRotation = true;
					autoSlide();
				} else {
					_autoRotation = false;
					if(_timer) clearTimeout(_timer);
					_this.removeClass(_playClass).addClass(_pausedClass);
				}
				return false;
			});
		}
		if(_btnPlay.length) {
			_btnPlay.bind(_controlEvent,function(){
				_this.removeClass(_pausedClass).addClass(_playClass);
				_autoRotation = true;
				autoSlide();
				return false;
			});
		}
		if(_btnPause.length) {
			_btnPause.bind(_controlEvent,function(){
				_autoRotation = false;
				if(_timer) clearTimeout(_timer);
				_this.removeClass(_playClass).addClass(_pausedClass);
				return false;
			});
		}

		// gallery animation
		function prevSlide() {
			_prevIndex = _currentIndex;
			if(_currentIndex > 0) _currentIndex--;
			else {
				if(_noCycle) return;
				else _currentIndex = _slideCount-1;
			}
			switchSlide();
		}
		function nextSlide() {
			_prevIndex = _currentIndex;
			if(_currentIndex < _slideCount-1) _currentIndex++;
			else {
				if(_noCycle) return;
				else _currentIndex = 0;
			}
			switchSlide();
		}
		function refreshStatus() {
			if(_pagerLinks.length) _pagerLinks.removeClass(_activeClass).eq(_currentIndex).addClass(_activeClass);
			if(_currentNum) _currentNum.text(_currentIndex+1);
			if(_allNum) _allNum.text(_slideCount);
			_slides.eq(_prevIndex).removeClass(_activeClass);
			_slides.eq(_currentIndex).addClass(_activeClass);
			if(_noCycle) {
				if(_btnPrev.length) {
					if(_currentIndex == 0) _btnPrev.addClass(_disabledClass);
					else _btnPrev.removeClass(_disabledClass);
				}
				if(_btnNext.length) {
					if(_currentIndex == _slideCount-1) _btnNext.addClass(_disabledClass);
					else _btnNext.removeClass(_disabledClass);
				}
			}
			if(typeof _onChange === 'function') {
				_onChange(_this, _currentIndex);
			}
		}
		function switchSlide() {
			_slides.eq(_prevIndex).stop(true,true).fadeOut(_duration);
			_slides.eq(_currentIndex).stop(true,true).fadeIn(_duration);
			if(_autoHeight) _slides.eq(_currentIndex).parent().animate({height:_slides.eq(_currentIndex).outerHeight(true)},{duration:_duration,queue:false});
			refreshStatus();
			autoSlide();
		}

		// autoslide function
		function autoSlide() {
			if(!_autoRotation || _hover) return;
			if(_timer) clearTimeout(_timer);
			_timer = setTimeout(nextSlide,_switchTime+_duration);
		}
		if(_pauseOnHover) {
			_this.hover(function(){
				_hover = true;
				if(_timer) clearTimeout(_timer);
			},function(){
				_hover = false;
				autoSlide();
			});
		}
		refreshStatus();
		jQuery(window).focus(function(){
			autoSlide();
			}).blur(function(){
			clearTimeout(_timer);
		});
	});
}





/*---- accordion ---*/
jQuery.fn.acc = function(_options){
	var _options = jQuery.extend({
		speed: 400,
		active: 'active',
		list: '.children()',
		opener: 'a.opener',
		slide: 'div.slide'
	}, _options);
	return this.each(function(){
		var _list = eval('$(this)' + _options.list);
		var _active = _options.active;
		var _speed = _options.speed;
		var _a = _list.index(_list.filter('.' + _active + ':eq(0)'));
		if(_a != -1) _list.removeClass(_active).eq(_a).addClass(_active);
		for(var i = 0; i < _list.length; i++){
			_list.eq(i).data('btn', _list.eq(i).find(_options.opener).eq(0));
			_list.eq(i).data('box', _list.eq(i).find(_options.slide).eq(0));
			if(i == _a) _list.eq(i).data('box').css('display', 'block');
			else _list.eq(i).data('box').css('display', 'none');
			_list.eq(i).data('btn').data('ind', i);
			if(_list.eq(i).data('box').length){
				_list.eq(i).data('btn').click(function(){
					changeEl($(this).data('ind'));
					return false;
				});
			}
		}
		var anim_f = true;
		var a_h, ind_h, _k;
		function changeEl(_ind){
			if(anim_f){
				anim_f = false;
				if(_a == _ind){
					_list.eq(_a).removeClass(_active).data('box').animate({height: 0}, {
						duration: _speed,
						complete: function(){
							$(this).css({display:'none', height:'auto'});
							_a = -1;
							anim_f = true;
						}
					});
				}
				else{
					_list.eq(_ind).data('box').css('display', 'block');
					ind_h = _list.eq(_ind).data('box').outerHeight();
					_list.eq(_ind).data('box').height(0);
					if(_a != -1){
						a_h = _list.eq(_a).removeClass(_active).data('box').outerHeight();
						_k = a_h/ind_h;
					}
					_list.eq(_ind).addClass(_active).data('box').animate({height: ind_h}, {
						duration: _speed,
						step: function(t_h){
							if(_a != -1) _list.eq(_a).data('box').height(a_h - t_h*_k);
						},
						complete: function(){
							_list.eq(_ind).data('box').height('auto');
							if(_a != -1) _list.eq(_a).data('box').css({display:'none', height: 'auto'});
							_a = _ind;
							anim_f = true;
						}
					});
				}
			}
		}
	});
}
/*
 * jQuery Carousel plugin
 */
;(function($){
	function ScrollGallery(options) {
		this.options = $.extend({
			mask: 'div.mask',
			slider: '>*',
			slides: '>*',
			activeClass:'active',
			disabledClass:'disabled',
			btnPrev: 'a.btn-prev',
			btnNext: 'a.btn-next',
			generatePagination: false,
			pagerList: '<ul>',
			pagerListItem: '<li><a href="#"></a></li>',
			pagerListItemText: 'a',
			pagerLinks: '.pagination li',
			currentNumber: 'span.current-num',
			totalNumber: 'span.total-num',
			circularRotation: true,
			disableWhileAnimating: false,
			autoRotation: false,
			pauseOnHover: true,
			maskAutoSize: false,
			switchTime: 4000,
			animSpeed: 600,
			event:'click',
			swipeGap: false,
			swipeThreshold: 50,
			handleTouch: true,
			vertical: false,
			step: false
		}, options);
		this.init();
	}
	ScrollGallery.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.refreshState(true);
				this.autoRotate();
			}
		},
		findElements: function() {
			// define dimensions proporties
			this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
			this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
			this.slideSizeFunction = 'outerHeight';
			this.maskSizeProperty = 'height';
			this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

			// control elements
			this.gallery = $(this.options.holder);
			this.mask = this.gallery.find(this.options.mask);
			this.slider = this.mask.find(this.options.slider);
			this.slides = this.slider.find(this.options.slides);
			this.btnPrev = this.gallery.find(this.options.btnPrev);
			this.btnNext = this.gallery.find(this.options.btnNext);
			this.currentStep = 0; this.stepsCount = 0;

			// calculate offsets
			this.calculateOffsets();
			$(window).bind('resize orientationchange', $.proxy(this.onWindowResize, this));

			// create gallery pagination
			if(typeof this.options.generatePagination === 'string') {
				this.buildPagination();
			} else {
				this.pagerLinks = this.gallery.find(this.options.pagerLinks);
				this.attachPaginationEvents();
			}

			// get start index
			var activeSlide = this.slides.filter('.'+this.options.activeClass);
			var activePagerLink = this.pagerLinks.filter('.'+this.options.activeClass);
			if(activeSlide.length) {
				this.currentStep = this.slides.index(activeSlide);
			} else if(activePagerLink.length) {
				this.currentStep = this.pagerLinks.index(activePagerLink);
			}
			this.prevIndex = this.currentStep;

			// misc elements
			this.curNum = this.gallery.find(this.options.currentNumber);
			this.allNum = this.gallery.find(this.options.totalNumber);
		},
		attachEvents: function() {
			this.btnPrev.bind(this.options.event, this.bindScope(function(e){
				this.prevSlide();
				e.preventDefault();
			}));
			this.btnNext.bind(this.options.event, this.bindScope(function(e){
				this.nextSlide();
				e.preventDefault();
			}));

			// pause on hover handling
			if(this.options.autoRotation && this.options.pauseOnHover) {
				this.gallery.hover(this.bindScope(function(){
					this.galleryHover = true;
					this.pauseRotation();
				}), this.bindScope(function(){
					this.galleryHover = false;
					this.resumeRotation();
				}));
			}

			// swipe event handling
			if(isTouchDevice) {
				// enable hardware acceleration
				this.slider.css({'-webkit-transform': 'translate3d(0px, 0px, 0px)'});

				// swipe gestures
				if(this.options.handleTouch && $.fn.swipe) {
					this.gallery.swipe({
						threshold: this.options.swipeThreshold,
						allowPageScroll: 'vertical',
						swipeStatus: $.proxy(function(e, phase, direction, distance) {
							if(phase === 'start') {
								this.originalOffset = parseInt(this.slider.stop().css(this.animProperty));
							} else if(phase === 'move') {
								if(direction === 'left' || direction === 'right') {
									var tmpOffset = this.originalOffset + distance * (direction === 'left' ? -1 : 1);
									if(!this.options.swipeGap) {
										tmpOffset = Math.max(Math.min(0, tmpOffset), this.maxOffset);
									}

									this.tmpProps = {};
									this.tmpProps[this.animProperty] = tmpOffset;
									this.slider.css(this.tmpProps);
								}
							} else if(phase === 'cancel') {
								// return to previous position
								this.switchSlide();
							}
						},this),
						swipe: $.proxy(function(event, direction) {
							if(direction === 'left') {
								if(this.currentStep === this.stepsCount - 1) this.switchSlide();
								else this.nextSlide();
							} else if(direction === 'right') {
								if(this.currentStep === 0) this.switchSlide();
								else this.prevSlide();
							}
						},this)
					});
				}
			}
		},
		onWindowResize: function() {
			this.calculateOffsets();
			this.refreshPosition();
			this.buildPagination();
			this.refreshState();
		},
		refreshPosition: function() {
			this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
			this.tmpProps = {};
			this.tmpProps[this.animProperty] = this.getStepOffset();
			this.slider.stop().css(this.tmpProps);
		},
		calculateOffsets: function() {
			this.maskSize = this.mask[this.innerSizeFunction]();
			this.sumSize = this.getSumSize();
			this.maxOffset = this.maskSize - this.sumSize;

			// vertical gallery with single size step custom behavior
			if(this.options.vertical && this.options.maskAutoSize) {
				this.options.step = 1;
				this.stepsCount = this.slides.length;
				this.stepOffsets = [0];
				var tmpOffset = 0;
				for(var i = 0; i < this.slides.length; i++) {
					tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
					this.stepOffsets.push(tmpOffset);
				}
				this.maxOffset = tmpOffset;
				return;
			}

			// scroll by slide size
			if(typeof this.options.step === 'number' && this.options.step > 0) {
				this.slideDimensions = [];
				this.slides.each($.proxy(function(ind, obj){
					this.slideDimensions.push( $(obj)[this.fullSizeFunction](true) );
				},this));

				// calculate steps count
				this.stepOffsets = [0];
				this.stepsCount = 1;
				var tmpOffset = 0, tmpStep = 0;
				while(tmpOffset >= this.maxOffset) {
					tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
					tmpStep += this.options.step;
					this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
					this.stepsCount++;
				}

			}
			// scroll by mask size
			else {
				// define step size
				this.stepSize = this.maskSize;

				// calculate steps count
				this.stepsCount = 1;
				var tmpOffset = 0;
				while(tmpOffset > this.maxOffset) {
					tmpOffset -= this.stepSize;
					this.stepsCount++;
				}
			}
		},
		getSumSize: function() {
			var sum = 0;
			this.slides.each($.proxy(function(ind, obj){
				sum += $(obj)[this.fullSizeFunction](true);
			},this));
			return sum;
		},
		getStepOffset: function(step) {
			step = step || this.currentStep;
			if(typeof this.options.step === 'number') {
				return this.stepOffsets[this.currentStep];
			} else {
				return Math.max(-this.currentStep * this.stepSize, this.maxOffset);
			}
		},
		getSlideSize: function(i1, i2) {
			var sum = 0;
			for(var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
				sum += this.slideDimensions[i];
			}
			return sum;
		},
		buildPagination: function() {
			this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
			this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
			for(var i = 0; i < this.stepsCount; i++) {
				$(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
			}
			this.pagerLinks = this.pagerList.children();
			this.attachPaginationEvents();
		},
		attachPaginationEvents: function() {
			this.pagerLinks.each(this.bindScope(function(ind, obj){
				$(obj).bind(this.options.event, this.bindScope(function(){
					this.numSlide(ind);
					return false;
				}));
			}));
		},
		prevSlide: function() {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep > 0) {
					this.currentStep--;
					this.switchSlide();
				} else if(this.options.circularRotation) {
					this.currentStep = this.stepsCount - 1;
					this.switchSlide();
				}
			}
		},
		nextSlide: function(fromAutoRotation) {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep < this.stepsCount - 1) {
					this.currentStep++;
					this.switchSlide();
				} else if(this.options.circularRotation || fromAutoRotation === true) {
					this.currentStep = 0;
					this.switchSlide();
				}
			}
		},
		numSlide: function(c) {
			if(this.currentStep != c) {
				this.currentStep = c;
				this.switchSlide();
			}
		},
		switchSlide: function() {
			this.galleryAnimating = true;
			this.tmpProps = {}
			this.tmpProps[this.animProperty] = this.getStepOffset();
			this.slider.stop().animate(this.tmpProps,{duration: this.options.animSpeed, complete: this.bindScope(function(){
				// animation complete
				this.autoRotate();
			})});
			this.refreshState();
		},
		refreshState: function(initial) {
			this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			this.curNum.html(this.currentStep+1);
			this.allNum.html(this.stepsCount);

			// initial refresh
			if(this.options.maskAutoSize && typeof this.options.step === 'number') {
				this.tmpProps = {};
				this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep,this.slides.length-1))[this.slideSizeFunction](true);
				this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
			}

			// disabled state
			if(!this.options.circularRotation) {
				this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
				if(this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
				if(this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
			}
		},
		pauseRotation: function() {
			clearTimeout(this.timer);
		},
		resumeRotation: function() {
			this.autoRotate();
		},
		autoRotate: function() {
			clearTimeout(this.timer);
			if(this.options.autoRotation && !this.galleryHover) {
				this.timer = setTimeout(this.bindScope(function(){
					this.nextSlide(true);
				}), this.options.switchTime);
			}
		},
		bindScope: function(func, scope) {
			return $.proxy(func, scope || this);
		}
	}

	// detect device type
	var isTouchDevice = (function() {
		try {
			return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		} catch (e) {
			return false;
		}
	}());

	// jquery plugin
	$.fn.scrollGallery = function(opt){
		return this.each(function(){
			$(this).data('ScrollGallery', new ScrollGallery($.extend(opt,{holder:this})));
		});
	}
}(jQuery));
/*
 * touchSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/touchSwipe
 * http://labs.skinkers.com/touchSwipe/
 *
 * Copyright (c) 2010 Matt Bryson (www.skinkers.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * $version: 1.2.5
 */
;(function(a){a.fn.swipe=function(c){if(!this){return false}var k={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var m="left";var l="right";var d="up";var s="down";var j="none";var u="horizontal";var q="vertical";var o="auto";var f="start";var i="move";var h="end";var n="cancel";var t="ontouchstart" in window,b=t?"touchstart":"mousedown",p=t?"touchmove":"mousemove",g=t?"touchend":"mouseup",r="touchcancel";var e="start";if(c.allowPageScroll==undefined&&(c.swipe!=undefined||c.swipeStatus!=undefined)){c.allowPageScroll=j}if(c){a.extend(k,c)}return this.each(function(){var D=this;var H=a(this);var E=null;var I=0;var x={x:0,y:0};var A={x:0,y:0};var K={x:0,y:0};function z(N){var M=t?N.touches[0]:N;e=f;if(t){I=N.touches.length}distance=0;direction=null;if(I==k.fingers||!t){x.x=A.x=M.pageX;x.y=A.y=M.pageY;if(k.swipeStatus){y(N,e)}}else{C(N)}D.addEventListener(p,J,false);D.addEventListener(g,L,false)}function J(N){if(e==h||e==n){return}var M=t?N.touches[0]:N;A.x=M.pageX;A.y=M.pageY;direction=v();if(t){I=N.touches.length}e=i;G(N,direction);if(I==k.fingers||!t){distance=B();if(k.swipeStatus){y(N,e,direction,distance)}if(!k.triggerOnTouchEnd){if(distance>=k.threshold){e=h;y(N,e);C(N)}}}else{e=n;y(N,e);C(N)}}function L(M){M.preventDefault();distance=B();direction=v();if(k.triggerOnTouchEnd){e=h;if((I==k.fingers||!t)&&A.x!=0){if(distance>=k.threshold){y(M,e);C(M)}else{e=n;y(M,e);C(M)}}else{e=n;y(M,e);C(M)}}else{if(e==i){e=n;y(M,e);C(M)}}D.removeEventListener(p,J,false);D.removeEventListener(g,L,false)}function C(M){I=0;x.x=0;x.y=0;A.x=0;A.y=0;K.x=0;K.y=0}function y(N,M){if(k.swipeStatus){k.swipeStatus.call(H,N,M,direction||null,distance||0)}if(M==n){if(k.click&&(I==1||!t)&&(isNaN(distance)||distance==0)){k.click.call(H,N,N.target)}}if(M==h){if(k.swipe){k.swipe.call(H,N,direction,distance)}switch(direction){case m:if(k.swipeLeft){k.swipeLeft.call(H,N,direction,distance)}break;case l:if(k.swipeRight){k.swipeRight.call(H,N,direction,distance)}break;case d:if(k.swipeUp){k.swipeUp.call(H,N,direction,distance)}break;case s:if(k.swipeDown){k.swipeDown.call(H,N,direction,distance)}break}}}function G(M,N){if(k.allowPageScroll==j){M.preventDefault()}else{var O=k.allowPageScroll==o;switch(N){case m:if((k.swipeLeft&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case l:if((k.swipeRight&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case d:if((k.swipeUp&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break;case s:if((k.swipeDown&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break}}}function B(){return Math.round(Math.sqrt(Math.pow(A.x-x.x,2)+Math.pow(A.y-x.y,2)))}function w(){var P=x.x-A.x;var O=A.y-x.y;var M=Math.atan2(O,P);var N=Math.round(M*180/Math.PI);if(N<0){N=360-Math.abs(N)}return N}function v(){var M=w();if((M<=45)&&(M>=0)){return m}else{if((M<=360)&&(M>=315)){return m}else{if((M>=135)&&(M<=225)){return l}else{if((M>45)&&(M<135)){return s}else{return d}}}}}try{this.addEventListener(b,z,false);this.addEventListener(r,C)}catch(F){}})}})(jQuery);
/*
 * jScrollPane - v2.0.0beta11 - 2011-07-04
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */
(function(b,a,c){b.fn.jScrollPane=function(e){function d(D,O){var az,Q=this,Y,ak,v,am,T,Z,y,q,aA,aF,av,i,I,h,j,aa,U,aq,X,t,A,ar,af,an,G,l,au,ay,x,aw,aI,f,L,aj=true,P=true,aH=false,k=false,ap=D.clone(false,false).empty(),ac=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";aI=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");f=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);function at(aR){var aM,aO,aN,aK,aJ,aQ,aP=false,aL=false;az=aR;if(Y===c){aJ=D.scrollTop();aQ=D.scrollLeft();D.css({overflow:"hidden",padding:0});ak=D.innerWidth()+f;v=D.innerHeight();D.width(ak);Y=b('<div class="jspPane" />').css("padding",aI).append(D.children());am=b('<div class="jspContainer" />').css({width:ak+"px",height:v+"px"}).append(Y).appendTo(D)}else{D.css("width","");aP=az.stickToBottom&&K();aL=az.stickToRight&&B();aK=D.innerWidth()+f!=ak||D.outerHeight()!=v;if(aK){ak=D.innerWidth()+f;v=D.innerHeight();am.css({width:ak+"px",height:v+"px"})}if(!aK&&L==T&&Y.outerHeight()==Z){D.width(ak);return}L=T;Y.css("width","");D.width(ak);am.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}Y.css("overflow","auto");if(aR.contentWidth){T=aR.contentWidth}else{T=Y[0].scrollWidth}Z=Y[0].scrollHeight;Y.css("overflow","");y=T/ak;q=Z/v;aA=q>1;aF=y>1;if(!(aF||aA)){D.removeClass("jspScrollable");Y.css({top:0,width:am.width()-f});n();E();R();w();ai()}else{D.addClass("jspScrollable");aM=az.maintainPosition&&(I||aa);if(aM){aO=aD();aN=aB()}aG();z();F();if(aM){N(aL?(T-ak):aO,false);M(aP?(Z-v):aN,false)}J();ag();ao();if(az.enableKeyboardNavigation){S()}if(az.clickOnTrack){p()}C();if(az.hijackInternalLinks){m()}}if(az.autoReinitialise&&!aw){aw=setInterval(function(){at(az)},az.autoReinitialiseDelay)}else{if(!az.autoReinitialise&&aw){clearInterval(aw)}}aJ&&D.scrollTop(0)&&M(aJ,false);aQ&&D.scrollLeft(0)&&N(aQ,false);D.trigger("jsp-initialised",[aF||aA])}function aG(){if(aA){am.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));U=am.find(">.jspVerticalBar");aq=U.find(">.jspTrack");av=aq.find(">.jspDrag");if(az.showArrows){ar=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aE(0,-1)).bind("click.jsp",aC);af=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aE(0,1)).bind("click.jsp",aC);if(az.arrowScrollOnHover){ar.bind("mouseover.jsp",aE(0,-1,ar));af.bind("mouseover.jsp",aE(0,1,af))}al(aq,az.verticalArrowPositions,ar,af)}t=v;am.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){t-=b(this).outerHeight()});av.hover(function(){av.addClass("jspHover")},function(){av.removeClass("jspHover")}).bind("mousedown.jsp",function(aJ){b("html").bind("dragstart.jsp selectstart.jsp",aC);av.addClass("jspActive");var s=aJ.pageY-av.position().top;b("html").bind("mousemove.jsp",function(aK){V(aK.pageY-s,false)}).bind("mouseup.jsp mouseleave.jsp",ax);return false});o()}}function o(){aq.height(t+"px");I=0;X=az.verticalGutter+aq.outerWidth();Y.width(ak-X-f);try{if(U.position().left===0){Y.css("margin-left",X+"px")}}catch(s){}}function z(){if(aF){am.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));an=am.find(">.jspHorizontalBar");G=an.find(">.jspTrack");h=G.find(">.jspDrag");if(az.showArrows){ay=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aE(-1,0)).bind("click.jsp",aC);x=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aE(1,0)).bind("click.jsp",aC);
if(az.arrowScrollOnHover){ay.bind("mouseover.jsp",aE(-1,0,ay));x.bind("mouseover.jsp",aE(1,0,x))}al(G,az.horizontalArrowPositions,ay,x)}h.hover(function(){h.addClass("jspHover")},function(){h.removeClass("jspHover")}).bind("mousedown.jsp",function(aJ){b("html").bind("dragstart.jsp selectstart.jsp",aC);h.addClass("jspActive");var s=aJ.pageX-h.position().left;b("html").bind("mousemove.jsp",function(aK){W(aK.pageX-s,false)}).bind("mouseup.jsp mouseleave.jsp",ax);return false});l=am.innerWidth();ah()}}function ah(){am.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){l-=b(this).outerWidth()});G.width(l+"px");aa=0}function F(){if(aF&&aA){var aJ=G.outerHeight(),s=aq.outerWidth();t-=aJ;b(an).find(">.jspCap:visible,>.jspArrow").each(function(){l+=b(this).outerWidth()});l-=s;v-=s;ak-=aJ;G.parent().append(b('<div class="jspCorner" />').css("width",aJ+"px"));o();ah()}if(aF){Y.width((am.outerWidth()-f)+"px")}Z=Y.outerHeight();q=Z/v;if(aF){au=Math.ceil(1/y*l);if(au>az.horizontalDragMaxWidth){au=az.horizontalDragMaxWidth}else{if(au<az.horizontalDragMinWidth){au=az.horizontalDragMinWidth}}h.width(au+"px");j=l-au;ae(aa)}if(aA){A=Math.ceil(1/q*t);if(A>az.verticalDragMaxHeight){A=az.verticalDragMaxHeight}else{if(A<az.verticalDragMinHeight){A=az.verticalDragMinHeight}}av.height(A+"px");i=t-A;ad(I)}}function al(aK,aM,aJ,s){var aO="before",aL="after",aN;if(aM=="os"){aM=/Mac/.test(navigator.platform)?"after":"split"}if(aM==aO){aL=aM}else{if(aM==aL){aO=aM;aN=aJ;aJ=s;s=aN}}aK[aO](aJ)[aL](s)}function aE(aJ,s,aK){return function(){H(aJ,s,this,aK);this.blur();return false}}function H(aM,aL,aP,aO){aP=b(aP).addClass("jspActive");var aN,aK,aJ=true,s=function(){if(aM!==0){Q.scrollByX(aM*az.arrowButtonSpeed)}if(aL!==0){Q.scrollByY(aL*az.arrowButtonSpeed)}aK=setTimeout(s,aJ?az.initialDelay:az.arrowRepeatFreq);aJ=false};s();aN=aO?"mouseout.jsp":"mouseup.jsp";aO=aO||b("html");aO.bind(aN,function(){aP.removeClass("jspActive");aK&&clearTimeout(aK);aK=null;aO.unbind(aN)})}function p(){w();if(aA){aq.bind("mousedown.jsp",function(aO){if(aO.originalTarget===c||aO.originalTarget==aO.currentTarget){var aM=b(this),aP=aM.offset(),aN=aO.pageY-aP.top-I,aK,aJ=true,s=function(){var aS=aM.offset(),aT=aO.pageY-aS.top-A/2,aQ=v*az.scrollPagePercent,aR=i*aQ/(Z-v);if(aN<0){if(I-aR>aT){Q.scrollByY(-aQ)}else{V(aT)}}else{if(aN>0){if(I+aR<aT){Q.scrollByY(aQ)}else{V(aT)}}else{aL();return}}aK=setTimeout(s,aJ?az.initialDelay:az.trackClickRepeatFreq);aJ=false},aL=function(){aK&&clearTimeout(aK);aK=null;b(document).unbind("mouseup.jsp",aL)};s();b(document).bind("mouseup.jsp",aL);return false}})}if(aF){G.bind("mousedown.jsp",function(aO){if(aO.originalTarget===c||aO.originalTarget==aO.currentTarget){var aM=b(this),aP=aM.offset(),aN=aO.pageX-aP.left-aa,aK,aJ=true,s=function(){var aS=aM.offset(),aT=aO.pageX-aS.left-au/2,aQ=ak*az.scrollPagePercent,aR=j*aQ/(T-ak);if(aN<0){if(aa-aR>aT){Q.scrollByX(-aQ)}else{W(aT)}}else{if(aN>0){if(aa+aR<aT){Q.scrollByX(aQ)}else{W(aT)}}else{aL();return}}aK=setTimeout(s,aJ?az.initialDelay:az.trackClickRepeatFreq);aJ=false},aL=function(){aK&&clearTimeout(aK);aK=null;b(document).unbind("mouseup.jsp",aL)};s();b(document).bind("mouseup.jsp",aL);return false}})}}function w(){if(G){G.unbind("mousedown.jsp")}if(aq){aq.unbind("mousedown.jsp")}}function ax(){b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");if(av){av.removeClass("jspActive")}if(h){h.removeClass("jspActive")}}function V(s,aJ){if(!aA){return}if(s<0){s=0}else{if(s>i){s=i}}if(aJ===c){aJ=az.animateScroll}if(aJ){Q.animate(av,"top",s,ad)}else{av.css("top",s);ad(s)}}function ad(aJ){if(aJ===c){aJ=av.position().top}am.scrollTop(0);I=aJ;var aM=I===0,aK=I==i,aL=aJ/i,s=-aL*(Z-v);if(aj!=aM||aH!=aK){aj=aM;aH=aK;D.trigger("jsp-arrow-change",[aj,aH,P,k])}u(aM,aK);Y.css("top",s);D.trigger("jsp-scroll-y",[-s,aM,aK]).trigger("scroll")}function W(aJ,s){if(!aF){return}if(aJ<0){aJ=0}else{if(aJ>j){aJ=j}}if(s===c){s=az.animateScroll}if(s){Q.animate(h,"left",aJ,ae)
}else{h.css("left",aJ);ae(aJ)}}function ae(aJ){if(aJ===c){aJ=h.position().left}am.scrollTop(0);aa=aJ;var aM=aa===0,aL=aa==j,aK=aJ/j,s=-aK*(T-ak);if(P!=aM||k!=aL){P=aM;k=aL;D.trigger("jsp-arrow-change",[aj,aH,P,k])}r(aM,aL);Y.css("left",s);D.trigger("jsp-scroll-x",[-s,aM,aL]).trigger("scroll")}function u(aJ,s){if(az.showArrows){ar[aJ?"addClass":"removeClass"]("jspDisabled");af[s?"addClass":"removeClass"]("jspDisabled")}}function r(aJ,s){if(az.showArrows){ay[aJ?"addClass":"removeClass"]("jspDisabled");x[s?"addClass":"removeClass"]("jspDisabled")}}function M(s,aJ){var aK=s/(Z-v);V(aK*i,aJ)}function N(aJ,s){var aK=aJ/(T-ak);W(aK*j,s)}function ab(aW,aR,aK){var aO,aL,aM,s=0,aV=0,aJ,aQ,aP,aT,aS,aU;try{aO=b(aW)}catch(aN){return}aL=aO.outerHeight();aM=aO.outerWidth();am.scrollTop(0);am.scrollLeft(0);while(!aO.is(".jspPane")){s+=aO.position().top;aV+=aO.position().left;aO=aO.offsetParent();if(/^body|html$/i.test(aO[0].nodeName)){return}}aJ=aB();aP=aJ+v;if(s<aJ||aR){aS=s-az.verticalGutter}else{if(s+aL>aP){aS=s-v+aL+az.verticalGutter}}if(aS){M(aS,aK)}aQ=aD();aT=aQ+ak;if(aV<aQ||aR){aU=aV-az.horizontalGutter}else{if(aV+aM>aT){aU=aV-ak+aM+az.horizontalGutter}}if(aU){N(aU,aK)}}function aD(){return -Y.position().left}function aB(){return -Y.position().top}function K(){var s=Z-v;return(s>20)&&(s-aB()<10)}function B(){var s=T-ak;return(s>20)&&(s-aD()<10)}function ag(){am.unbind(ac).bind(ac,function(aM,aN,aL,aJ){var aK=aa,s=I;Q.scrollBy(aL*az.mouseWheelSpeed,-aJ*az.mouseWheelSpeed,false);return aK==aa&&s==I})}function n(){am.unbind(ac)}function aC(){return false}function J(){Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){ab(s.target,false)})}function E(){Y.find(":input,a").unbind("focus.jsp")}function S(){var s,aJ,aL=[];aF&&aL.push(an[0]);aA&&aL.push(U[0]);Y.focus(function(){D.focus()});D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aO){if(aO.target!==this&&!(aL.length&&b(aO.target).closest(aL).length)){return}var aN=aa,aM=I;switch(aO.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:s=aO.keyCode;aK();break;case 35:M(Z-v);s=null;break;case 36:M(0);s=null;break}aJ=aO.keyCode==s&&aN!=aa||aM!=I;return !aJ}).bind("keypress.jsp",function(aM){if(aM.keyCode==s){aK()}return !aJ});if(az.hideFocus){D.css("outline","none");if("hideFocus" in am[0]){D.attr("hideFocus",true)}}else{D.css("outline","");if("hideFocus" in am[0]){D.attr("hideFocus",false)}}function aK(){var aN=aa,aM=I;switch(s){case 40:Q.scrollByY(az.keyboardSpeed,false);break;case 38:Q.scrollByY(-az.keyboardSpeed,false);break;case 34:case 32:Q.scrollByY(v*az.scrollPagePercent,false);break;case 33:Q.scrollByY(-v*az.scrollPagePercent,false);break;case 39:Q.scrollByX(az.keyboardSpeed,false);break;case 37:Q.scrollByX(-az.keyboardSpeed,false);break}aJ=aN!=aa||aM!=I;return aJ}}function R(){D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function C(){if(location.hash&&location.hash.length>1){var aL,aJ,aK=escape(location.hash);try{aL=b(aK)}catch(s){return}if(aL.length&&Y.find(aK)){if(am.scrollTop()===0){aJ=setInterval(function(){if(am.scrollTop()>0){ab(aK,true);b(document).scrollTop(am.position().top);clearInterval(aJ)}},50)}else{ab(aK,true);b(document).scrollTop(am.position().top)}}}}function ai(){b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack")}function m(){ai();b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack",function(){var s=this.href.split("#"),aJ;if(s.length>1){aJ=s[1];if(aJ.length>0&&Y.find("#"+aJ).length>0){ab("#"+aJ,true);return false}}})}function ao(){var aK,aJ,aM,aL,aN,s=false;am.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aO){var aP=aO.originalEvent.touches[0];aK=aD();aJ=aB();aM=aP.pageX;aL=aP.pageY;aN=false;s=true}).bind("touchmove.jsp",function(aR){if(!s){return}var aQ=aR.originalEvent.touches[0],aP=aa,aO=I;Q.scrollTo(aK+aM-aQ.pageX,aJ+aL-aQ.pageY);aN=aN||Math.abs(aM-aQ.pageX)>5||Math.abs(aL-aQ.pageY)>5;
return aP==aa&&aO==I}).bind("touchend.jsp",function(aO){s=false}).bind("click.jsp-touchclick",function(aO){if(aN){aN=false;return false}})}function g(){var s=aB(),aJ=aD();D.removeClass("jspScrollable").unbind(".jsp");D.replaceWith(ap.append(Y.children()));ap.scrollTop(s);ap.scrollLeft(aJ)}b.extend(Q,{reinitialise:function(aJ){aJ=b.extend({},az,aJ);at(aJ)},scrollToElement:function(aK,aJ,s){ab(aK,aJ,s)},scrollTo:function(aK,s,aJ){N(aK,aJ);M(s,aJ)},scrollToX:function(aJ,s){N(aJ,s)},scrollToY:function(s,aJ){M(s,aJ)},scrollToPercentX:function(aJ,s){N(aJ*(T-ak),s)},scrollToPercentY:function(aJ,s){M(aJ*(Z-v),s)},scrollBy:function(aJ,s,aK){Q.scrollByX(aJ,aK);Q.scrollByY(s,aK)},scrollByX:function(s,aK){var aJ=aD()+Math[s<0?"floor":"ceil"](s),aL=aJ/(T-ak);W(aL*j,aK)},scrollByY:function(s,aK){var aJ=aB()+Math[s<0?"floor":"ceil"](s),aL=aJ/(Z-v);V(aL*i,aK)},positionDragX:function(s,aJ){W(s,aJ)},positionDragY:function(aJ,s){V(aJ,s)},animate:function(aJ,aM,s,aL){var aK={};aK[aM]=s;aJ.animate(aK,{duration:az.animateDuration,easing:az.animateEase,queue:false,step:aL})},getContentPositionX:function(){return aD()},getContentPositionY:function(){return aB()},getContentWidth:function(){return T},getContentHeight:function(){return Z},getPercentScrolledX:function(){return aD()/(T-ak)},getPercentScrolledY:function(){return aB()/(Z-v)},getIsScrollableH:function(){return aF},getIsScrollableV:function(){return aA},getContentPane:function(){return Y},scrollToBottom:function(s){V(i,s)},hijackInternalLinks:function(){m()},destroy:function(){g()}});at(O)}e=b.extend({},b.fn.jScrollPane.defaults,e);b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){e[this]=e[this]||e.speed});return this.each(function(){var f=b(this),g=f.data("jsp");if(g){g.reinitialise(e)}else{g=new d(f,e);f.data("jsp",g)}})};b.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:c,animateScroll:false,animateDuration:300,animateEase:"linear",hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:0.8}})(jQuery,this);


/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },

    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);


//vaclav


$( document ).ready(function() {
	var sliderSlick = $('.slider-init');
	if (sliderSlick.length) {
		sliderSlick.each(function() {
			var show = sliderSlick.data('show');
			var next = sliderSlick.data('next');
			var prev = sliderSlick.data('prev');
			if (!show) show = 3;
			sliderSlick.slick({
				infinite: false,
				slidesToShow: show,
				variableWidth: false,
				slidesToScroll: 1,
                                autoplay: true,
                                autoplaySpeed: 3000,
				nextArrow: '<button type="button" class="'+next+'"></button>',
				prevArrow: '<button type="button" class="'+prev+'"></button>'
			});
		});
	}

    var galleryFancy =$("a.grouped_elements")
	if (galleryFancy.length) {
		galleryFancy.fancybox();
	}

	if ($("#message").length) {
		var number = $("#message").val().length;
		$("#count").html(10000 - number);
		$("#message").keyup(function count(){
			var number = $("#message").val().length;
			$("#count").html(10000 - number);
		});
	}

	var form_valid = $(".js_submit_form");
	if (form_valid.length) {
		form_valid.each(function() {
			var form_this  = $(this);
			$.validate({
				form: form_this,
				lang: 'ru',
				modules : 'security',
				borderColorOnError: true,
				scrollToTopOnError: false,
				onSuccess: function($form) {
						if($($form).hasClass('feedback')){
							$('.hidden_protection').val('true');
						}else{
							$($form).find(".js_success_submit").removeClass("hidden");
							$($form).find(".js_form_fields").addClass("hidden");
							$($form).trigger("reset");
							return false;
						}
				}
			});
		});
	}
function popUpsInit() {
	var _this = this;
	_this.b = {
		open: $('.js-popup-button')
	};
	_this.c = {
		popup: $('.js-popup-container'),
		body: $('body'),
	};
	_this.f = {};
	_this.conf = {
		body_class: 'modal_open',
		active_class: 'active',
		close_selector: '.closePopup',
		initial_class: 'popup-initialed',
		header_class: 'is-hidden'
	};
	var _h;
	_this.f.initModalActions = function(_popup) {
		/**
		 * Close buttons.
		 */
		$(_popup).on('click', '.modal-container', function(e) {
			if (!$(_this.conf.close_selector).is(e.target)) {
				e.stopPropagation();
			}
		});
		_popup.find(_this.conf.close_selector).add(_popup).off('click.popup').on('click.popup', function() {
			_this.f.closePopup(_popup);
		});
	};
	_this.f.closePopup = function(_popup) {
		var _res = Math.abs(_h),
			_cont = _popup.find('.modal-container-content:not(.response)')
		_response = _popup.find('.response');
		_popup.removeClass(_this.conf.active_class);
		_this.c.body.removeClass(_this.conf.body_class).removeAttr('style');
		
		$(window).scrollTop(_res);
		setTimeout(function() {
			_cont.removeAttr('style');
			_response.removeClass('visible');
		}, 500);
	};
	_this.f.openPopup = function(_popup) {
		_h = _this.c.body.scrollTop();
		if (_h === 0) {
			_h = $('html').scrollTop();
		}
		_popup.addClass(_this.conf.active_class);
		_this.c.body.addClass(_this.conf.body_class).css('top', -_h);
		
	};
	/**
	 * Initial.
	 */
	$.each(_this.c.popup.not('.' + _this.conf.initial_class), function() {
		var _popup = $(this);
		_this.f.initModalActions(_popup);
		_popup.off('reinit').on('reinit', function() {
			_this.f.initModalActions(_popup);
		});
		_popup.addClass(_this.conf.initial_class);
	});
	_this.b.open.off('click.popup').on('click.popup', function(e) {
		e.preventDefault();
		var _b = $(this),
			_popup = _this.c.popup.filter('[data-modal="' + _b.data('modal') + '"]');
		_this.f.openPopup(_popup);
		return false;
	});
}
popUpsInit();
});
//end vaclav
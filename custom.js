/**
* jQuery plugin for the values slider.
*/
jQuery.fn.extend({
	valueControlSlider: function(url){

		var element = $(this);

		/*
		* assume that this is the url for changing the value of the server side component
		*/
		var changeValueUrl = url;
		/**
		* assume that url+'/status' is the url for retrieving the status
		*/
		var initialStatusUrl = changeValueUrl +"/status";

		

	
		var messageElement = $("<span>").addClass('help-block').text('');
		

		element.slider({  
		      	range: "min",
		   		slide: function(event, ui){
		        	// show 'changing value text' in messageElement
		        	var messageText = element.attr('data-currentvalue-text').replace('$value',ui.value);
		        	messageElement.text(messageText);
				},
		   		stop: function(event, ui ){
		   			// request new value from server
		   			var messageText = element.attr('data-change-text').replace('$value',ui.value);
		        	messageElement.text(messageText);
		   			var changeValue = changeValueUrl + "&newValue="+ui.value;
		   			$.getJSON(changeValue, function(response) {
							element.slider( "option", "value", response.currentValue);
							var messageText = element.attr('data-currentvalue-text').replace('$value',ui.value);
		        			messageElement.text(messageText);
					});
		        },
				create: function() {
					messageElement.insertBefore(element);
					/*
					* init and display max and min values
					*/
					$.getJSON(initialStatusUrl, function(response) {
							element.slider( "option", "max", response.max);
							element.slider( "option", "min", response.min);
							element.slider( "option", "value", response.currentValue);
							var messageText = element.attr('data-currentvalue-text').replace('$value',response.currentValue);
		        			messageElement.text(messageText);
					});
				}
		});
	}
});


/**
* jQuery plugin for the switch on, swicth off button. 
*/
jQuery.fn.extend({
	onOffSwitch: function(url){

		/**
		* assume that this is the URL for turning off turning on
		*/
		var onOffUrl = url;

		/**
		* assume that URL+"/status" is the URL for returning the status
		*/
		var initialStatusUrl = url+"/status";
		var element = $(this);

		var view = {
			messageElmnt : function (message){ return $("<span>").addClass('help-block').text(message)},
			initialized : false,
			init : function (onOff, message){
				if (!this.initialized) {
					this.messageSpan = this.messageElmnt()
					this.messageSpan.insertAfter(element);
                	this.initialized = true;
				}

				element.off('click');
				element.click(function() {
					if (onOff) {
						// if it's on we turn it off
						element.button('turnoff');
					} else {
						element.button('turnon');
					}

	                $.getJSON(onOffUrl, function(response) {
						  view.init(response.onOrOff, response.message);
					});
                });

				if (onOff) {
                    element.removeClass('btn-default').addClass('btn-primary');
                    element.button('on');
                } else {
                    element.removeClass('btn-primary').addClass('btn-default');
                    element.button('off')
                }

                this.messageSpan.text(message);
			}
		}

		$.getJSON(initialStatusUrl, function(response) {
				view.init(response.onOrOff, response.message);	  
		});

		
	}
});

$(function() { 
	// living room 
	$("#living_lights").onOffSwitch('livingroom/lights');
	$("#tv_button").onOffSwitch('livingroom/tv');
	$("#living_temperature").valueControlSlider('livingroom/temperature');

	//bedroom
	$("#bedroom_lights").onOffSwitch('bedroom/lights');
	$("#music_volume_slider").valueControlSlider('bedroom/volume');
	$("#bedroom_temperature").valueControlSlider('bedroom/temperature');


	//garden
	$("#garden_lights").onOffSwitch('garden/lights');
	$("#garage_door").onOffSwitch('garage/door');
});






/*
* ================   Ajax requests/response MOCK code    ====================
*
*/
var onOffSwitch = {status : false} ;
/**
*  Mock for initial lights ON/OFF service
*/
$.mockjax({
  url: '*/lights/status',
  responseTime: 1000,
  // assume that initially the lights are always OFF :-)
  responseText:{ onOrOff: false, message: 'lights are currently OFF'}
});


/**
*  Mock for Turn lights ON/OFF service
*/
$.mockjax({
  url: '*/lights',
  responseTime: 1000,
  response: function(settings) {
  	var isOn = onOffSwitch.status;
  	if (isOn){
  		onOffSwitch.status = false;
  		this.responseText = { onOrOff: false ,message: 'lights have been turned OFF'};
  	} else {
  		onOffSwitch.status = true;
  		this.responseText = { onOrOff: true ,message: 'lights have been turned ON'};
  	}
  }
});


var openClosed = {status : false} ;
/**
*  Mock for garage door open/close
*/
$.mockjax({
  url: '*/door/status',
  responseTime: 1000,
  // assume that initially the lights are always OFF :-)
  responseText:{ onOrOff: false, message: 'Door is currently closed'}
});


/**
*  Mock for garage door open/close
*/
$.mockjax({
  url: '*/door',
  responseTime: 1000,
  response: function(settings) {
  	var isOn = openClosed.status;
  	if (isOn){
  		openClosed.status = false;
  		this.responseText = { onOrOff: false ,message: 'Door has been closed.'};
  	} else {
  		openClosed.status = true;
  		this.responseText = { onOrOff: true ,message: 'Door has been opened.'};
  	}
  }
});




/**
*  Mock for initial tv ON/OFF service
*/
$.mockjax({
  url: '*/tv/status',
  responseTime: 1000,
  // assume that initially the lights are always OFF :-)
  responseText:{ onOrOff: false, message: 'tv is currently OFF'},
});


/**
*  Mock for Turn tv ON/OFF service
*/
var tvonOffSwitch = {status : false} ;
$.mockjax({
  url: '*/tv',
  responseTime: 1000,
  response: function(settings) {
  	var isOn = tvonOffSwitch.status;
  	if (isOn){
  		tvonOffSwitch.status = false;
  		this.responseText = { onOrOff: false ,message: 'tv has been turned OFF'};
  	} else {
  		tvonOffSwitch.status = true;
  		this.responseText = { onOrOff: true ,message: 'tv has been turned ON'};
  	}
  }
});


/**
*  Mock for music volume status
*/
$.mockjax({
  url: '*/volume/status',
  responseTime: 1000,
  // assume that initially temperatures is 21 degrees 
  responseText:{ currentValue: 21}
});


/**
*  Mock for temperature change
*/
$.mockjax({
  url: /^.*\/volume\&newValue=([\d]+)*/,
  urlParams: ['newValue'],
  responseTime: 1000,
  response: function(settings){
  	 this.responseText = { min:0 , max:500 , currentValue: settings.urlParams.newValue};	
  }
});


/**
*  Mock for temperature status
*/
$.mockjax({
  url: '*/temperature/status',
  responseTime: 1000,
  // assume that initially temperatures is 21 degrees 
  responseText:{ min:18 , max:30 , currentValue: 21}
});


/**
*  Mock for temperature change
*/
$.mockjax({
  url: /^.*\/temperature\&newValue=([\d]+)*/,
  urlParams: ['newValue'],
  responseTime: 1000,
  response: function(settings){
  	 this.responseText = { currentValue: settings.urlParams.newValue};	
  }
});
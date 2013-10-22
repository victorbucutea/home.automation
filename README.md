home.automation
===============
The home automation system has 2 simple components (jQuery plugins) for controlling normal house tasks :

1. A slider for numeric control ( e.g. temperature , music volume , etc.  )
2. An on/off switch ( e.g. lights, garage doors, tv, washing machine, etc. )


To use the slider make sure you included custom.js script and simply add the following to your html file:

 <div id="bedroom_temperature" 
      data-currentvalue-text="Current value is $value" 
      data-change-text="Setting new value to $value">
 </div>
 <script>
 	$('#bedroom_temperature').valueControlSlider('url/for/setting/getting/temperature')
 </scipt>

!! PLEASE NOTE that the back-end service (url) should expose the following protocol:
   1. A 'status' check ability. So if your service is 'http://host/volume/', you also need a service 'volume/status' to retrieve the initial status
   2. The new value is passed asa a parameter 'newValue' ( e.g. http://host/volume&newValue=xxxxxx)
   3. The response should be in a JSON format compatible to : { min:0 , max:500 , currentValue: xxxxxx };



 To  use the on/off switch make sure you included custom.js script and simply add the following:

  <button type="button" id="tv_button" 
                           data-turnon-text="Switching on..." 
                           data-turnoff-text="Switching off..." 
                           data-on-text="TV is ON"
                           data-off-text="TV is OFF" 
                           class="btn btn-default">
  </button>
  <script>
  	 $('#tv_button').onOffSwitch('url/for/onoff/service')
  </script>


  !! PLEASE NOTE that the back-end service (url) should expose the following protocol:
   1. A 'status' check ability. So if your service is 'http://host/lights/', you also need a service 'lights/status' to retrieve the initial status
   2. The response to both status check and service should be in a JSON format compatible to : { onOrOff: false, message: 'tv is currently OFF'}
   3. A call to 'http://host/lights/' should turn on the lights another call should turn them off. The state is never held at client side, it always refreshed from the response JSON.




   For more information on how the server should look like, consult the mockjax mocks in custom.js

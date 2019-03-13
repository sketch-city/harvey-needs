(function(window){
  var config = {};

  config.event = 'Harvey';
  config.additionalText = '**Need help? [Find shelters here.](http://houstonsheltermap.com/)**';

  config.dataEntryPortal = '//api.harveyneeds.org';
  config.apiBaseURL = '//api.harveyneeds.org/api/v1/';
  config.googleMapsAPIKey = 'AIzaSyBufCfEN1VR55xVzLJJ6YmBRAFe1_Eg4EI';

  config.mapDefaults = {
    center: {
      lat: 29.7604,
      lng: -95.3698
    },
    zoom: 12
  };

  config.analyticsId = 'UA-105727042-3';

  config.nullPhrases = [];

  function getConfig(){
    return config;
  }

  window.getConfig = getConfig;

}(window))
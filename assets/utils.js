(function(window){

  var CONFIG = getConfig();

  function buildGoogleMapsScriptsUrl(options) {
    return 'https://maps.googleapis.com/maps/api/js?key=' + options.key + '&libraries=places&callback=' + options.callbackName;
  }

  function asyncLoadScript(src) {
    var scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.async = 'async';
    scriptEl.defer = 'defer';
    document.body.appendChild(scriptEl);
  }

  function loadMap() {
    var mapOptions = {
      key: CONFIG.googleMapsAPIKey,
      callbackName: 'initMap'
    };

    asyncLoadScript(buildGoogleMapsScriptsUrl(mapOptions));
  }

  function loadData(options) {
    return axios.get(CONFIG.apiBaseURL + options.endpoint);
  }

  function getData(data, filter, clean){
    return _.chain(data)
      .filter(filter)
      .map(clean)
      .value();
  }

  function loadAnalytics(){
    if (CONFIG.analyticsId) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', CONFIG.analyticsId, 'auto');
      ga('send', 'pageview');
    }
  }

  function makeLinksOpenNew(container) {
    var links = container.querySelectorAll('a');

    Array.prototype.forEach.call(links, function(link){
      link.target = '_blank';
    });
  }

  function isLink(text){
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    return regex.test(text);
  }

  function autodetectLocation(handleSuccess, handleError) {
    if (!navigator.geolocation) {
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.info(position);
    }

    function error() {
      console.info('Could not get position.');
    }

    navigator.geolocation.getCurrentPosition((handleSuccess || success), (handleError || error));

  }

  function isNone(text) {
    var textToMatch = _.chain(text)
      .lowerCase()
      .trim()
      .trimEnd('.')
      .value();

    if (!textToMatch) {
      return true;
    }

    // quick non-filter.
    var phrases = [
      'no need for volunteers',
      'no volunteers needed',
      'no longer needed',
      'no donations accepted at this time',
      'no needs',
      'no supplies needed',
      'none',
      'not accepting donations',
      'no more donations accepted',
      'not taking any supplies',
      'no current needs',
      'do not need any more supplies',
      'not accepting any more donations',
      'not accepting any new donations',
      'no volunteers needed',
      'not in need of supplies',
      'flooded - no longer accepting donations',
      'no longer taking donations',
      'good on volunteers right now',
      'shelter not accepting',
      'volunteers not needed'
    ];

    if (CONFIG.nullPhrases) {
      phrases.concat(CONFIG.nullPhrases);
    }

    var noneRegex = new RegExp('^(' + phrases.join('|') + ')');

    return noneRegex.test(textToMatch);
  }

  function valueOrNone(text) {
    return isNone(text)? null : text;
  }

  function textOrLink(text) {
    var result;
    if (isLink(text)){
      result = {
        link: text,
        text: 'Source'
      };
    }
    return result;
  }

  var utils = {
    textOrLink: textOrLink,
    loadMap: loadMap,
    loadData: loadData,
    loadAnalytics: loadAnalytics,
    makeLinksOpenNew: makeLinksOpenNew,
    getData: getData,
    valueOrNone: valueOrNone,
    isNone: isNone,
    autodetectLocation: autodetectLocation
  };

  window.utils = utils;

}(window));
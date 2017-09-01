<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-105727042-2', 'auto');
  ga('send', 'pageview');

</script>


(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterNeeds(entry) {
    return entry.are_supplies_needed || entry.are_volunteers_needed;
  }

  function cleanNeedsData(entry){
    var name = entry.location_name;
    var address = entry.location_address;
    var addressName = name + ', ' + address;

    return {
      address: address,
      lat: parseFloat(entry.latitude),
      lng: parseFloat(entry.longitude),
      name: name,
      phone: entry.contact_for_this_location_phone_number,
      tel: (entry.contact_for_this_location_phone_number || '').replace(/\D+/g, ''),
      supplyNeeds: entry.are_supplies_needed? utils.valueOrNone(entry.tell_us_about_the_supply_needs) : null,
      volunteerNeeds: entry.are_volunteers_needed? utils.valueOrNone(entry.tell_us_about_the_volunteer_needs) : null,
      lastUpdated: entry.timestamp,
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name),
      source: utils.textOrLink(entry.source),
      details: _.trim(entry.anything_else_you_would_like_to_tell_us)
    };
  }

  function getNeedsHelpers(){
    return {
      endpoint: 'needs',
      filter: filterNeeds,
      cleanData: cleanNeedsData
    };
  }

  window.getNeedsHelpers = getNeedsHelpers;

}(window));

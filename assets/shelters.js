(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterShelters(entry) {
    return entry.supply_needs || entry.volunteer_needs;
  }

  function cleanSheltersData(entry){
    var name = entry.shelter;
    var address = entry.address;
    var addressName = entry.shelter + ', ' + entry.address;
 
    var marker = {
      address: entry.address,
      lat: parseFloat(entry.latitude),
      lng: parseFloat(entry.longitude),
      name: name,
      phone: entry.phone,
      tel: entry.phone.replace(/\D+/g, ''),
      address: address,
      supplyNeeds: entry.supply_needs,
      volunteerNeeds: entry.volunteer_needs,
      lastUpdated: entry.last_updated,
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name)
    };

    if (entry.source) {
      if (utils.isLink(entry.source)){
        marker.source = {
          link: entry.source,
          text: 'Source'
        };
      } else {
        marker.source = {
          text: entry.source
        };
      }
    }

    return marker;
  }

  function getSheltersHelpers(){
    return {
      endpoint: 'shelters',
      filter: filterShelters,
      cleanData: cleanSheltersData
    };
  }

  window.getSheltersHelpers = getSheltersHelpers;

}(window));
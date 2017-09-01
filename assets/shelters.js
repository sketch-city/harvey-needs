(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterShelters(entry) {
    return !(utils.isNone(entry.supply_needs) && utils.isNone(entry.volunteer_needs));
  }

  function cleanSheltersData(entry){
    var name = entry.shelter;
    var address = entry.address;
    var addressName = entry.shelter + ', ' + entry.address;
 
    return {
      address: entry.address,
      lat: parseFloat(entry.latitude),
      lng: parseFloat(entry.longitude),
      name: name,
      phone: entry.phone,
      tel: entry.phone.replace(/\D+/g, ''),
      address: address,
      supplyNeeds: utils.valueOrNone(entry.supply_needs),
      volunteerNeeds: utils.valueOrNone(entry.volunteer_needs),
      lastUpdated: entry.last_updated,
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name),
      source: utils.textOrLink(entry.source)
    };
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
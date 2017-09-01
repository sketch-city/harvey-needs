(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterShelters(entry) {
    return !(utils.isNone(entry.supply_needs) &&
      utils.isNone(entry.volunteer_needs)) ||
      _.startsWith(entry.notes, 'Volunteer');
  }

  function cleanSheltersData(entry){
    var name = entry.shelter;
    var address = entry.address;
    var addressName = entry.shelter + ', ' + entry.address;
    var volunteerNeeds;
    var details;

    if (_.startsWith(entry.notes, 'Volunteer')){
      if (utils.isNone(entry.volunteer_needs)) {
        volunteerNeeds = entry.notes;
      } else {
        details = entry.notes;
      }
    }
    volunteerNeeds = volunteerNeeds || utils.valueOrNone(entry.volunteer_needs);

    return {
      address: entry.address,
      lat: parseFloat(entry.latitude),
      lng: parseFloat(entry.longitude),
      name: name,
      phone: entry.phone,
      tel: entry.phone.replace(/\D+/g, ''),
      address: address,
      supplyNeeds: utils.valueOrNone(entry.supply_needs),
      volunteerNeeds: volunteerNeeds,
      lastUpdated: entry.last_updated,
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name),
      source: utils.textOrLink(entry.source),
      details: details
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
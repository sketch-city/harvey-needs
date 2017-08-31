(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterShelters(entry) {
    return getFromEntry('supplyneeds', entry) || getFromEntry('volunteerneeds', entry);
  }

  function cleanSheltersData(entry){
    var name = getFromEntry('shelter', entry);
    var addressName = getFromEntry('addressname', entry);
    var address;
    if (addressName) {
      address = addressName.replace(name + ', ', '');
    } else {
      address = getFromEntry('address', entry);
      addressName = name + ', ' + address;
    }

    return {
      address: getFromEntry('address', entry),
      lat: parseFloat(getFromEntry('latitude', entry)),
      lng: parseFloat(getFromEntry('longitude', entry)),
      name: name,
      phone: getFromEntry('phone', entry),
      tel: getFromEntry('phone', entry).replace(/\D+/g, ''),
      address: address,
      supplyNeeds: getFromEntry('supplyneeds', entry),
      volunteerNeeds: getFromEntry('volunteerneeds', entry),
      lastUpdated: getFromEntry('lastupdated', entry),
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name)
    };
  }

  function getSheltersHelpers(){
    return {
      docId: '14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k',
      filter: filterShelters,
      cleanData: cleanSheltersData
    };
  }

  window.getSheltersHelpers = getSheltersHelpers;

}(window));
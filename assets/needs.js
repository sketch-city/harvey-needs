(function(window){

  var getFromEntry = utils.getFromEntry;

  function filterNeeds(entry) {
    return getFromEntry('tellusaboutthesupplyneeds', entry) || getFromEntry('tellusaboutthevolunteerneeds', entry);
  }

  function cleanNeedsData(entry){
    var name = getFromEntry('locationname', entry);
    var address = getFromEntry('locationaddress', entry);
    var addressName = name + ', ' + address;

    return {
      address: address,
      lat: parseFloat(getFromEntry('latitude', entry)),
      lng: parseFloat(getFromEntry('longitude', entry)),
      name: name,
      phone: getFromEntry('contactforthislocationphonenumber', entry),
      tel: getFromEntry('contactforthislocationphonenumber', entry).replace(/\D+/g, ''),
      supplyNeeds: getFromEntry('tellusaboutthesupplyneeds', entry),
      volunteerNeeds: getFromEntry('tellusaboutthevolunteerneeds', entry),
      lastUpdated: getFromEntry('timestamp', entry),
      key: _.kebabCase(addressName),
      previousKey: _.kebabCase(name)
    };
  }

  function getNeedsHelpers(){
    return {
      docId: '14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k',
      sheetId: 'oxp802v',
      filter: filterNeeds,
      cleanData: cleanNeedsData
    };
  }

  window.getNeedsHelpers = getNeedsHelpers;

}(window));
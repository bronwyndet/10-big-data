(function(module) {
  var zip = {};
  zip.topFive = [];
  zip.neighborhoodTotals = {};  //using as a "dictionary" of the neighborhood

  getData = function() {
    $.getJSON('/data/manhattan.json', function(data) {
      // TODO: start here!
      zip.reformatted =
      data.features.map(function(obj) {
        return {
          zipCode: obj.properties.zip,
          neighborhood: obj.properties.neighborhood ? obj.properties.neighborhood.split(', ')[0] : null,  //checking if there's a value (if no, use null), but if there's two values, only use the first value
          address: obj.properties.address ? obj.properties.address : null,
          coordinates: {
            lat: obj.geometry.coordinates[1],
            lng: obj.geometry.coordinates[0]
          }
        };
      })
      .forEach(function(obj) {
        var currentNeighborhood = obj.neighborhood;
        zip.neighborhoodTotals[currentNeighborhood] ?
        zip.neighborhoodTotals[currentNeighborhood] ++ :
        zip.neighborhoodTotals[currentNeighborhood] = 1;
      });
      generateTopFive(zip.neighborhoodTotals);
      zip.topFive.sort(function(currentNeighborhood, nextNeighborhood) {
        return nextNeighborhood.totalZips - currentNeighborhood.totalZips;
      }).splice(5);
    });
  };


  function generateTopFive(dictionary) {
    for (var neighborhood in dictionary) {
      zip.topFive.push({
        neighborhood: neighborhood,
        totalZips: dictionary[neighborhood]
      });
    }
  }


  getData();
  module.zip = zip;
})(window);

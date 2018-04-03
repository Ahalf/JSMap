var identifyElements = [];


  var tasks = [];
  var allParams = [];
  var promises = [];

  //Set the tasks array
  tasks.push(new IdentifyTask(labinslayerURL));
  tasks.push(new IdentifyTask(controlLinesURL));

  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 3;
  params.layerIds = [0, 1, 2, 5, 8, 9, 10];
  params.layerOption = "all";
  params.width = view.width;
  params.height = view.height;
  params.returnGeometry = true;
  allParams.push(params);

  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 5;
  params.layerIds = [0, 3, 4, 5, 11];
  params.layerOption = "all";
  params.width = view.width;
  params.height = view.height;
  params.returnGeometry = true;
  allParams.push(params);

console.log(tasks);


  // executeIdentifyTask() is called each time the view is clicked
  on(mapView, "click", executeIdentifyTask);


function executeIdentifyTask(event) {
  dom.byId("viewDiv").style.cursor = "wait";
  console.log("into executeidentify");
  promises = [];
  // Set the geometry to the location of the view click
  allParams[0].geometry = allParams[1].geometry = event.mapPoint;
  allParams[0].mapExtent = allParams[1].mapExtent = view.extent;
  for (i = 0; i < tasks.length; i++) {
    promises.push(tasks[i].execute(allParams[i]));
  }
  var iPromises = new all(promises);

  iPromises.then(function (rArray) {
    arrayUtils.map(rArray, function(response){
      var results = response.results;
      return arrayUtils.map(results, function(result) {
        var feature = result.feature;
        var layerName = result.layerName;

        feature.attributes.layerName = layerName;
        if (layerName === 'NGS Control Points') {
          feature.popupTemplate = NGSpopupTemplate;

        } else if (layerName === 'Preliminary NGS Points') {
          feature.popupTemplate = NGSPreliminarypopupTemplate;

        } else if (layerName === 'Certified Corners') {
          feature.popupTemplate = tideStationsTemplate;

        } else if (layerName === 'CCR with Images') {
          feature.popupTemplate = CCRTemplate;

        } else if (layerName === 'R-Monuments') {
          feature.popupTemplate = rMonumentsTemplate;

        } else if (layerName === 'Erosion Control line') {
          feature.popupTemplate = erosionControlLineTemplate;

        } else if (layerName === 'USGS Quads') {
          feature.popupTemplate = quadsTemplate;

        } else if (layerName === 'City Limits') {
          feature.popupTemplate = cityLimitsTemplate;

        } else if (layerName === 'Parcels') {
          feature.popupTemplate = parcelsTemplate;

        } else if (layerName === 'Soils June 2012 - Dept. of Agriculture ') {
          feature.popupTemplate = soilsTemplate;
        }

        //console.log(identifyElements);
        identifyElements.push(feature);
      });
    })
    showPopup(identifyElements);
  });

  // Shows the results of the Identify in a popup once the promise is resolved
  function showPopup(response) {
    console.log(response);
    if (response.length > 0) {
      view.popup.open({
        features: response,
        location: event.mapPoint
      });
    }
    dom.byId("viewDiv").style.cursor = "auto";
  }
}



require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/geometry/geometryEngine",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/tasks/IdentifyTask",
  "esri/tasks/support/IdentifyParameters",
  "esri/widgets/Popup/PopupViewModel",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/tasks/Locator",


  // Widgets
  "esri/widgets/BasemapGallery",
  "esri/widgets/Search",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/widgets/Print",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Home",
  "esri/widgets/Locate",
  "esri/core/watchUtils",
  "dojo/_base/array",
  "dojo/on",
  "dojo/dom",
  "dojo/promise/all",
  "dojo/dom-construct",
  "dojo/query",
  "dojo/_base/Color",


  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.6",
  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.6",

  "dojo/domReady!"
], function (Map,
  MapView,
  MapImageLayer,
  FeatureLayer,
  QueryTask,
  Query,
  geometryEngine,
  GraphicsLayer,
  Graphic,
  IdentifyTask,
  IdentifyParameters,
  PopupVM,
  SimpleFillSymbol,
  SimpleLineSymbol,
  Locator,
  Basemaps,
  Search,
  Legend,
  LayerList,
  Print,
  BasemapToggle,
  ScaleBar,
  Home,
  Locate,
  watchUtils, arrayUtils, on, dom, all, domConstruct, query, Color,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapsArcGISSupport) {

    /******************************************************************
     *
     * Create the map, view and widgets
     * 
     ******************************************************************/



    //var controlPointsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/FREAC/LABINS_2017_Pts_No_SWFMWD_3857/MapServer/0";
    var controlPointsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0"
    var controlPointsLayer = new FeatureLayer({
      url: controlPointsURL,
      title: "NGS Control Points",
      visible: false,
      listMode: "hide",
      popupTemplate: NGSpopupTemplate

    });
/*
    var labinslayerURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer";
    var labinsLayer = new MapImageLayer({
      url: labinslayerURL
    });
*/
    var labinslayerURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer";
    var labinsLayer = new MapImageLayer({
      url: labinslayerURL,
      title: "LABINS Data",
      sublayers: [{
        id: 10,
        title: "Erosion Control Line",
        visible: true,
        popupTemplate: erosionControlLineTemplate
      }, {
        id: 9,
        title: "R-Monuments",
        visible: true,
        popupTemplate: rMonumentsTemplate
      }, {
        id:8,
        title: "CCR with Images",
        visible: true,
        popupTemplate: CCRTemplate
      },  {
        id:7,
        title: "Geographic Names",
        visible: false,
        popupTemplate: geonamesTemplate
      },  {
        id: 6,
        title: "Tide Interpolation Points",
        visible: true,
        popupTemplate: tideInterpPointsTemplate
      }, {
        id: 5,
        title: "Tide Stations",
        visible: true,
        popupTemplate: tideStationsTemplate
      }, {
        id: 4,
        title: "CCBLMID All Labels",
        visible: false
      }, {
        id: 3,
        title: "Certified Corner (BLMID) Labels",
        visible: false
      }, {
        id: 2,
        title: "Certified Corners",
        visible: true,
        popupTemplate: certifiedCornersTemplate
      }, {
        id: 1,
        title: "Preliminary NGS Points",
        visible: true,
        popupTemplate: NGSPreliminarypopupTemplate
      }, {
        id: 0,
        title: "NGS Control Points",
        visible: true,
        popupTemplate: NGSpopupTemplate
      }]
    });


    var swfwmdURL = "https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer/0";
    var swfwmdLayer = new FeatureLayer({
      url: swfwmdURL,
      title: "SWFWMD Benchmarks",
      visible: true,
      //listMode: "hide",
      popupTemplate: swfwmdLayerPopupTemplate

    });


    var controlLinesURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer/";
    var controlLinesLayer = new MapImageLayer({
      url: controlLinesURL,
      sublayers: [{
        id: 11,
        title: "USDA Soils",
        visible: false,
        popupTemplate: soilsTemplate
      }, {
        id: 10,
        title: "Hi-Res Imagery Grid: State Plane East",
        visible: false,
      },{
        id: 9,
        title: "Hi-Res Imagery Grid: State Plane North",
        visible: false,
      }, {
        id: 8,
        title: "Hi-Res Imagery Grid: State Plane West",
        visible: false,
      }, {
        id: 7,
        title: "Rivers, Streams, and Canals",
        visible: false
      }, {
        id: 6,
        title: "Lakes, Ponds, and Reservoirs",
        visible: false,
      }, {
        id: 5,
        title: "Parcels",
        visible: false,
        popupTemplate: parcelTemplate,
      }, {
        id: 4,
        title: "County Boundaries",
        visible: false,
      }, {
        id: 3,
        title: "City Limits",
        visible: false,
        cityLimitsTemplate,
      }, {
        id: 1,
        title: "Township-Range",
        visible: false,
      }, {
        id: 0,
        title: "USGS Quads",
        visible: false,
      }]
    });

    //var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer/2";
    //var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/FREAC/Control_2017_Lines_TEST/MapServer/0";
    var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines_EPSG_3857/MapServer/1"
    var townshipRangeSectionLayer = new FeatureLayer({
      url: townshipRangeSectionURL,
      outFields: ["twn_ch", "rng_ch", "sec_ch"],
      visible: true,
      listMode: "hide"
    });

    

    var bufferLayer = new GraphicsLayer({
      listMode: "hide"
    });

    var selectionLayer = new GraphicsLayer({
      listMode: "hide"
    });
    /////////////////////
    // Create the map ///
    /////////////////////
    // Create another Map, to be used in the overview "view"
    var overviewMap = new Map({
      basemap: "topo"
    });


    var map = new Map({
      basemap: "topo",
      layers: [swfwmdLayer, controlLinesLayer, townshipRangeSectionLayer, controlPointsLayer, bufferLayer, selectionLayer, labinsLayer]
    });


    /////////////////////////
    // Create the MapView ///
    /////////////////////////

    var mapView = new MapView({
      container: "mapViewDiv",
      map: map,
      padding: {
        top: 50,
        bottom: 0
      },
      center: [-82.28, 27.8],
      zoom: 7,
      constraints: {
        rotationEnabled: false
      }
    });

    //Overview Mapview
    // Create the MapView for overview map
    var overView = new MapView({
      container: "overviewDiv",
      map: overviewMap,
      constraints: {
        rotationEnabled: false
      }
    });

    overView.ui.components = [];

    var extentDiv = dom.byId("extentDiv");

    function clearGraphics() {
      console.log("cleared graphics");
      map.graphics.clear();
      selectionLayer.graphics.removeAll()
    }


    overView.when(function () {
      // Update the overview extent whenever the MapView or SceneView extent changes
      mapView.watch("extent", updateOverviewExtent);
      overView.watch("extent", updateOverviewExtent);

      // Update the minimap overview when the main view becomes stationary
      watchUtils.when(mapView, "stationary", updateOverview);

      function updateOverview() {
        // Animate the MapView to a zoomed-out scale so we get a nice overview.
        // We use the "progress" callback of the goTo promise to update
        // the overview extent while animating
        overView.goTo({
          center: mapView.center,
          scale: mapView.scale * 2 * Math.max(mapView.width /
            overView.width,
            mapView.height / overView.height)
        });
      }
    


      
      function updateOverviewExtent() {
        // Update the overview extent by converting the SceneView extent to the
        // MapView screen coordinates and updating the extentDiv position.
        var extent = mapView.extent;

        var bottomLeft = overView.toScreen(extent.xmin, extent.ymin);
        var topRight = overView.toScreen(extent.xmax, extent.ymax);

        extentDiv.style.top = topRight.y + "px";
        extentDiv.style.left = bottomLeft.x + "px";

        extentDiv.style.height = (bottomLeft.y - topRight.y) + "px";
        extentDiv.style.width = (topRight.x - bottomLeft.x) + "px";
      }
    });
/*
    watchUtils.when(overView, "stationary", updatemapView);
      
    function updatemapView() {
      // Animate the MapView to a zoomed-out scale so we get a nice overview.
      // We use the "progress" callback of the goTo promise to update
      // the overview extent while animating
      mapView.goTo({
        center: overView.center,
      });
    }*/
    /////////////////////////////
    /// Dropdown Select Panel ///
    /////////////////////////////

    function buildSelectPanel(vurl, attribute, zoomParam, panelParam) {

      var task = new QueryTask({
        url: vurl
      });

      var params = new Query({
        where: "1 = 1 AND " + attribute + " IS NOT NULL",
        outFields: [attribute],
        returnDistinctValues: true,
        });

      var option = domConstruct.create("option");
      option.text = zoomParam;
      dom.byId(panelParam).add(option);

      task.execute(params)
        .then(function (response) {
          //console.log(response.features);
          var features = response.features;
          var values = features.map(function (feature) {
            return feature.attributes[attribute];
          });
          //console.log(response);
          return values;

        })
        .then(function (uniqueValues) {
          //console.log(uniqueValues);
          uniqueValues.sort();
          uniqueValues.forEach(function (value) {
            var option = domConstruct.create("option");
            option.text = value;
            dom.byId(panelParam).add(option);
          });
        });
    }


    function unionGeometries (response) {
      var multiPolygonGeometries = [];
      for (i=0; i<response.features.length; i++) {
        multiPolygonGeometries.push(response.features[i].geometry);
      }
      var union = geometryEngine.union(multiPolygonGeometries);
      console.log(union);
      return union;
    }



// Input location from drop down, zoom to it and highlight
    function zoomToFeature(panelurl, location, attribute) {
      var multiPolygonGeometries = [];
      var union = geometryEngine.union(multiPolygonGeometries);
      var task = new QueryTask({
        url: panelurl
      });
      var params = new Query({
        where: attribute + " = '" + location + "'",
        returnGeometry: true
      });
      task.execute(params)
        .then(function (response) {
          mapView.goTo(response.features);
          selectionLayer.graphics.removeAll();
          //console.log(response.features.length);
          graphicArray = [];
          for (i=0; i<response.features.length; i++) {
            highlightGraphic = new Graphic(response.features[i].geometry, highlightSymbol);
            graphicArray.push(highlightGraphic);
            multiPolygonGeometries.push(response.features[i].geometry);
            //console.log(highlightGraphic);
          }
          selectionLayer.graphics.addMany(graphicArray);
          console.log(selectionLayer);
          console.log(multiPolygonGeometries);
          //var union = geometryEngine.union(multiPolygonGeometries);
          console.log(typeof union);
          
        });
        console.log(union);
        return union;
    }

    function executeTRSIdentify(response) {
      console.log(response);
              
      identifyTask = new IdentifyTask(labinslayerURL);

      // Set the parameters for the Identify
      params = new IdentifyParameters();
      params.tolerance = 3;
      params.layerIds = [2];
      params.layerOption = "top";
      params.width = mapView.width;
      params.height = mapView.height;
    
      // Set the geometry to the location of the view click
      params.geometry = response;
      params.mapExtent = mapView.extent;
      dom.byId("mapViewDiv").style.cursor = "wait";

      // This function returns a promise that resolves to an array of features
      // A custom popupTemplate is set for each feature based on the layer it
      // originates from
      identifyTask.execute(params).then(function(response) {
        var results = response.results;

        return [arrayUtils.map(results, function(result) {

          var feature = result.feature;
          var layerName = result.layerName;

          feature.attributes.layerName = layerName;
          if (layerName === 'Certified Corners') {
            feature.popupTemplate = CCRTemplate;
          }
          //console.log(feature);
          return feature;
        }), params.geometry];
      }).then(showPopup); // Send the array of features to showPopup()

      // Shows the results of the Identify in a popup once the promise is resolved
      function showPopup(data) {
        console.log(data);
        response = data[0];
        console.log(response);
        geometry = data[1];
        console.log(geometry);

        if (response.length > 0) {
          mapView.popup.open({
            features: response,
            location: geometry.centroid
          });
        }
        dom.byId("mapViewDiv").style.cursor = "auto";
      }
    }

    var bufferElements = [];
  

    function zoomToSectionFeature(panelurl, location, attribute) {
      
      // Clear existing bufferElement items each time the zoom to feature runs
      //bufferElements.length = 0;

      var township = document.getElementById("selectNGSCountyPanel");
      var strUser = township.options[township.selectedIndex].text;

      var range = document.getElementById("selectNGSCityPanel");
      var rangeUser = range.options[range.selectedIndex].text;

      var section = document.getElementById("selectNGSSectionPanel");
      var sectionUser = section.options[section.selectedIndex].text;


      var task = new QueryTask({
        url: panelurl
      });
      var params = new Query({
        where: "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + rangeUser.substr(0, 2) + "' AND rdir = '" + rangeUser.substr(2) + "' AND sec_ch = '" + sectionUser + "'",
        returnGeometry: true
      });
      task.execute(params)
        .then(function (response) {
          mapView.goTo(response.features);
          return response;
        })
        .then(createBuffer)
        .then(executeTRSIdentify)
    }

    function zoomToTRFeature(panelurl, location, attribute) {
      multiPolygonGeometries = [];
      var union = geometryEngine.union(multiPolygonGeometries);
      // Clear existing bufferElement items each time the zoom to feature runs
      //bufferElements.length = 0;

      var township = document.getElementById("selectNGSCountyPanel");
      var strUser = township.options[township.selectedIndex].text;

      var range = document.getElementById("selectNGSCityPanel");
      var rangeUser = range.options[range.selectedIndex].text;


      var task = new QueryTask({
        url: panelurl
      });
      var params = new Query({
        where: "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + rangeUser.substr(0, 2) + "' AND rdir = '" + rangeUser.substr(2) + "'",
        returnGeometry: true
      });
      task.execute(params)
        .then(function (response) {
          console.log(response);
          mapView.goTo(response.features);
          selectionLayer.graphics.removeAll();
          //console.log(response.features.length);
          graphicArray = [];
          for (i=0; i<response.features.length; i++) {
            highlightGraphic = new Graphic(response.features[i].geometry, highlightSymbol);
            graphicArray.push(highlightGraphic);
            multiPolygonGeometries.push(response.features[i].geometry);
            //console.log(highlightGraphic);
          }
          selectionLayer.graphics.addMany(graphicArray);
          return response;
        })
        .then(unionGeometries)
        //.then(createBuffer)
        .then(executeTRSIdentify);
    }
    
    
    var polySym = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [140, 140, 222, 0.5],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2
      }
    };

//Input geometry, output buffer
    function createBuffer(response) {
      var bufferGeometry = response.features[0].geometry
      var buffer = geometryEngine.geodesicBuffer(bufferGeometry, 100, "feet", true);
      console.log(typeof buffer);
      // add the buffer to the view as a graphic
      var bufferGraphic = new Graphic({
        geometry: buffer,
        symbol: polySym
      });
      bufferLayer.graphics.removeAll();
      bufferLayer.add(bufferGraphic);
      console.log(bufferGeometry);
      return bufferGeometry;
    }

// Inbut buffer, query selected features within this layer
    function queryFeaturesInBuffer(buffer) {
      var controlPointsQueryTask = new QueryTask({
        url: controlLinesURL + "0"
        //url: controlPointsURL
      });
      //console.log("creates querytask");
      var query = new Query({
        //where: "1=1",
        geometry: buffer,
        spatialRelationship: "intersects",
        outFields: ["*"],
        returnGeometry: true
      })
      //console.log(query);
      controlPointsQueryTask.execute(query).then(function (result) {

        console.log(result);
        console.log(result.features.length);
        //console.log(result.features);
        /*if (result.features.length > 0) {
          mapView.popup.open({
            features: "title",
            location: result.features[0].geometry
          });
        }*/
        console.log(result)
        return {
          result: result,
          buffer: buffer
        };
      });

    }

// Assign features to graphic layer for display
    function displayResults(results) {

      bufferLayer.removeAll();
      var features = results.features.map(function (graphic) {
        graphic.symbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          style: "diamond",
          size: 6.5,
          color: "darkorange"
        };
        return graphic;
      });
      var numQuakes = features.length;
      dom.byId("results").innerHTML = numQuakes + " earthquakes found";
      bufferLayer.addMany(features);
    }

    /*****************************************
     * 
     * Zoom to Features through Dropdowns
     * 
     ****************************************/

    // Zoom to City/County/Quad

    // Build County Drop Down
    buildSelectPanel(controlLinesURL + "4", "ctyname", "Zoom to a County", "selectCountyPanel");

    query("#selectCountyPanel").on("change", function (e) {
      return zoomToFeature(controlLinesURL + "4", e.target.value, "ctyname")
    });

    //Build Quad Dropdown panel
    buildSelectPanel(controlLinesURL + "0", "tile_name", "Zoom to a Quad", "selectQuadPanel");

    query("#selectQuadPanel").on("change", function (e) {
      return zoomToFeature(controlLinesURL + "0", e.target.value, "tile_name");
    });

    //Build City Dropdown panel
    buildSelectPanel(controlLinesURL + "3", "name", "Zoom to a City", "selectCityPanel");

    query("#selectCityPanel").on("change", function (e) {
      return zoomToFeature(controlLinesURL + "3", e.target.value, "name");
    });

    // Zoom to Township/Range/Section
    buildSelectPanel(controlLinesURL + "2", "trs", "Zoom to a Township-Range-Section", "selectTownshipPanel");

    query("#selectTownshipPanel").on("change", function (e) {
      return zoomToFeature(controlLinesURL + "2", e.target.value, "trs");
    });



    ///////////////////////
    // Filter by Feature //
    ///////////////////////

    buildSelectPanel(controlLinesURL + "4", "ctyname", "Filter by County", "filterCountyPanel");

    var county = document.getElementById("filterCountyPanel");
    var countyStr = query("#filterCountyPanel").on("change", function (e) {
      countyStr = e.target.value.toUpperCase();
      console.log(countyStr + "this is a county string");
      var searchQuery = "county = '" + countyStr + "'";
      searchWidget.sources.items[0].filter.where = searchQuery;
      console.log(searchQuery);
      return countyStr;

    });

    buildSelectPanel("https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0", "quad", "Filter by Quad", "filterQuadPanel");

    var quad = document.getElementById("filterQuadPanel");
    var quadStr = query("#filterQuadPanel").on("change", function (e) {
      quadStr = e.target.value.toUpperCase();
      console.log(quadStr + "this is a quad string");
      var searchQuery = "quad = '" + quadStr + "'";
      searchWidget.sources.items[0].filter.where = searchQuery;
      console.log(searchQuery);
      return quadStr;

    });

    buildSelectPanel(controlLinesURL + "3", "name", "Filter by City", "filterCityPanel");

    var city = document.getElementById("filterCityPanel");
    var cityStr = query("#filterCityPanel").on("change", function (e) {
      cityStr = e.target.value.toUpperCase();
      console.log(cityStr + "this is a city string");
      
      
      var task = new QueryTask({
        url: controlLinesURL + "3"
      });

      var params = new Query({
        where: "name = '" + cityStr + "'",
        returnGeometry: true
        });
        task.execute(params).then(function (result) {
        
        console.log("before search" , searchWidget.sources.items[0].filter.geometry);
        searchWidget.sources.items[0].filter.geometry = result.features[0].geometry;
        console.log("after search" , searchWidget.sources.items[0].filter.geometry);

        })

    });
    // Does not work, will need to combine township, range, section fields inside of ngs control points layer
    buildSelectPanel(controlLinesURL + "2", "trs", "Zoom to a Township-Range-Section", "filterTownshipPanel");
    var trs = document.getElementById("filterTownshipPanel");
    var trsStr = query("#filterTownshipPanel").on("change", function (e) {
      trsStr = e.target.value.toUpperCase();
      console.log(trsStr + "this is a city string");
      var searchQuery = trsStr.geometry;
      console.log(searchQuery + " This is the searchQuery");
      searchWidget.sources.items[0].filter.geometry = searchQuery;
      console.log(e);
      return trsStr;



    });

    ////////////////////////////////////////////////
    //// Zoom to Township/Section/Range Feature ////
    ////////////////////////////////////////////////

    var townshipSelect = dom.byId("selectNGSCountyPanel");
    var rangeSelect = dom.byId("selectNGSCityPanel");
    var sectionSelect = dom.byId("selectNGSSectionPanel");


    mapView.then(function () {
      return townshipRangeSectionLayer.then(function (response) {
        var townshipQuery = new Query();
        townshipQuery.where = "tdir <> ' '";
        townshipQuery.outFields = ["twn_ch", "tdir"];
        townshipQuery.returnDistinctValues = true;
        townshipQuery.orderByFields = ["twn_ch", "tdir"];
        return townshipRangeSectionLayer.queryFeatures(townshipQuery);
      });
    }).then(addToSelect)
      .otherwise(queryError);


    function queryError(error) {
      console.log("Error getting Township Features");
      console.error(error);
    }

    // Add the unique values to the subregion
    // select element. This will allow the user
    // to filter states by subregion.
    function addToSelect(values) {
      var option = domConstruct.create("option");
      option.text = "Zoom to a Township";
      townshipSelect.add(option);

      values.features.forEach(function (value) {
        var option = domConstruct.create("option");
        var name = value.attributes.twn_ch + value.attributes.tdir;
        option.text = name;
        townshipSelect.add(option);

      });
    }

    // Add the unique values to the state
    // select element. This will allow the user
    // to filter states by state and region.
    function addToSelect2(values) {
      var option = domConstruct.create("option");
      option.text = "Zoom to a Range";
      rangeSelect.add(option);

      values.features.forEach(function (value) {
        var option = domConstruct.create("option");
        var name = value.attributes.rng_ch + value.attributes.rdir;
        option.text = name;
        rangeSelect.add(option);
      });
    }

    function addToSelect3(values) {
      var option = domConstruct.create("option");
      option.text = "Zoom to a Section";
      sectionSelect.add(option);

      values.features.forEach(function (value) {
        var option = domConstruct.create("option");
        option.text = value.attributes.sec_ch;
        sectionSelect.add(option);
      });
    }

    on(townshipSelect, "change", function (evt) {
      var type = evt.target.value;
      var i;
      for (i = rangeSelect.options.length - 1; i >= 0; i--) {
        rangeSelect.remove(i);
      }



      var rangeQuery = new Query();
      rangeQuery.where = "twn_ch = '" + type.substr(0, 2) + "' AND tdir = '" + type.substr(2) + "'";
      rangeQuery.outFields = ["rng_ch", "rdir"];
      rangeQuery.returnDistinctValues = true;
      rangeQuery.orderByFields = ["rng_ch", "rdir"];
      return townshipRangeSectionLayer.queryFeatures(rangeQuery).then(addToSelect2);
    })

    on(rangeSelect, "change", function (evt) {
      var type = evt.target.value;
      var j;
      for (j = sectionSelect.options.length - 1; j >= 0; j--) {
        sectionSelect.remove(j);
      }


      var e = document.getElementById("selectNGSCountyPanel");
      var strUser = e.options[e.selectedIndex].text;

      var selectQuery = new Query();
      selectQuery.where = "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + type.substr(0, 2) + "' AND rdir = '" + type.substr(2) + "' AND rng_ch <> ' '";
      selectQuery.outFields = ["sec_ch"];
      selectQuery.returnDistinctValues = true;
      selectQuery.orderByFields = ["sec_ch"];
      return townshipRangeSectionLayer.queryFeatures(selectQuery).then(addToSelect3);



    });

    var querySection = dom.byId("selectNGSSectionPanel");
    on(querySection, "change", function (e) {
      var type = e.target.value;
      zoomToSectionFeature(townshipRangeSectionURL, type, "sec_ch");
    });

    
    var queryTownship = dom.byId("selectNGSCityPanel");
    on(queryTownship, "change", function (e) {
      var type = e.target.value;
      zoomToTRFeature(townshipRangeSectionURL, type, "rng_ch");
    });
    /////////////////////////
    //// Buffer Identify ////
    /////////////////////////
    var promises, tasks;
    var identifyTask, params;

    tasks = [];
    allParams = [];


    tasks.push(new IdentifyTask(controlLinesURL));
    tasks.push(new IdentifyTask(labinslayerURL));
    tasks.push(new IdentifyTask(swfwmdURL));

    // Set the parameters for the Identify
    params = new IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = [0, 3, 4, 5, 11];
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
    params.returnGeometry = true;
    allParams.push(params);
    // Set the parameters for the Identify
    params = new IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = [0, 1, 2, 5, 6, 9, 10];
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
    params.returnGeometry = true;
    allParams.push(params);
    // Set the parameters for the Identify
    params = new IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = [0];
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
    params.returnGeometry = true;
    allParams.push(params);


    var identifyElements = [];

mapView.on("double-click", function(event) {
    if (mapView.scale < 100000) {
      executeIdentifyTask(event);
    }  
});


function executeIdentifyTask(event) {
  event.stopPropagation()
  promises = [];
  // Set the geometry to the location of the view click
  allParams[0].geometry = allParams[1].geometry = allParams[2].geometry = event.mapPoint;
  allParams[0].mapExtent = allParams[1].mapExtent = allParams[2].mapExtent = mapView.extent;
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
        if (layerName === 'USGS Quads') {
          feature.popupTemplate = quadsIdentifyTemplate;
        } else if (layerName === 'NGS Control Points') {
            feature.popupTemplate = NGSIdentifyPopupTemplate;
        } else if (layerName === 'City Limits') {
          feature.popupTemplate = cityLimitsTemplate;
        } else if (layerName === 'County Boundaries') {
          feature.popupTemplate = countyTemplate;
        } else if (layerName === 'Parcels') {
          feature.popupTemplate = parcelsIdentifyTemplate;
        } else if (layerName === 'Soils June 2012 - Dept. of Agriculture') {
          feature.popupTemplate = soilsTemplate;
        } else if (layerName === 'Preliminary NGS Points') {
          feature.popupTemplate = NGSPreliminaryIdentifypopupTemplate;
        } else if (layerName === 'Certified Corners') {
          feature.popupTemplate = CCRTemplate;
        } else if (layerName === 'Tide Stations') {
          feature.popupTemplate = tideStationsTemplate;
        } else if (layerName === 'Tide Interpolation Points') {
          feature.popupTemplate = tideInterpPointsTemplate;
        } else if (layerName === 'R-Monuments') {
          feature.popupTemplate = rMonumentsTemplate;
        } else if (layerName === 'Erosion Control Line') {
          feature.popupTemplate = erosionControlLineTemplate;
        } else if (layerName === 'Survey Benchmarks') {
          feature.popupTemplate = swfwmdLayerPopupTemplate;
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
      mapView.popup.open({
        features: response,
        location: event.mapPoint
      });
    identifyElements = [];
    }
    dom.byId("viewDiv").style.cursor = "auto";
    identifyElements = [];
  }
}





    //////////////////////////////////
    //// Search Widget Text Search ///
    //////////////////////////////////

    // Search - add to navbar
    var searchWidget = new Search({
      container: "searchWidgetDiv",
      view: mapView,
      allPlaceholder: "Text search for NGS, DEP, and SWFWMD Data",
      sources: [{
        locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
        singleLineFieldName: "SingleLine",
        name: "Geocoder",
        localSearchOptions: {
          minScale: 300000,
          distance: 50000
        },
        placeholder: "Search Geocoder",
        maxResults: 3,
        maxSuggestions: 6,
        suggestionsEnabled: false,
        minSuggestCharacters: 0
      }, {
        featureLayer: {
          url: controlPointsURL + "0", 
          popupTemplate: NGSpopupTemplate
        },
        searchFields: ["pid"],
        suggestionTemplate: "PID: {pid}, County {county}",
        displayField: "pid",
        exactMatch: false,
        outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2"],
        name: "NGS Control Points PID",
        placeholder: "Search by PID",
      }, {
        featureLayer: {
          url: controlPointsURL + "2",
          resultGraphicEnabled: true,
          popupTemplate: CCRTemplate
        },
        searchFields: ["blmid", "tile_name"],
        displayField: "blmid",
        suggestionTemplate: "BLMID: {blmid}, Quad Name: {tile_name}",
        exactMatch: false,
        outFields: ["blmid", "tile_name", "image1", "image2", "objectid"],
        name: "Certified Corners",
        placeholder: "Search by BLMID or Quad Name",
      }, {
        featureLayer: {
          url: controlPointsURL + "5",
          resultGraphicEnabled: true,
          popupTemplate: tideStationsTemplate
        },
        searchFields: ["id", "countyname", "quadname"],
        displayField: "id",
        exactMatch: false,
        outFields: ["*"],
        name: "Tide Stations",
        placeholder: "Search by ID, County Name, or Quad Name",
      }, {
        featureLayer: {
          url: controlPointsURL + "6",
          popupTemplate: tideInterpPointsTemplate
        },
        searchFields: ["iden", "cname", "tile_name", "station1", "station2"],
        suggestionTemplate: "ID: {iden}, County: {cname}",
        displayField: "iden",
        exactMatch: false,
        outFields: ["*"],
        name: "Tide Interpolation Points",
        placeholder: "Search by ID, County Name, Quad Name, or Station Name",
      }, {
        featureLayer: {
          url: controlLinesURL + "4",
          popupTemplate: countyTemplate
        },
        searchFields: ["fips", "ctyname"],
        suggestionTemplate: "FIPS Code: {fips}, County Name {ctyname}",
        displayField: "fips",
        exactMatch: false,
        outFields: ["*"],
        name: "County Limits",
        placeholder: "Search by FIPS ID or County Name",
      }, {
        featureLayer: {
          url: controlLinesURL + "0",
          popupTemplate: quadsTemplate
        },
        searchFields: ["tile_name", "quad"],
        suggestionTemplate: "Quad Name: {tile_name}, Quad Number {quad}",
        displayField: "tile_name",
        exactMatch: false,
        outFields: ["*"],
        name: "Quads",
        placeholder: "Search by Quad Name or Quad number",
      }, {
        featureLayer: {
          url: controlLinesURL + "3",
          popupTemplate: cityLimitsTemplate
        },
        searchFields: ["name", "county"],
        suggestionTemplate: "City Name: {name}, Surrounding County: {county}",
        displayField: "name",
        exactMatch: false,
        outFields: ["*"],
        name: "City Limits",
        placeholder: "Search by City Name or Surrounding County",
      }, {
        featureLayer: {
          url: labinslayerURL + "/9",
          popupTemplate: rMonumentsTemplate
        },
        searchFields: ["monument_name", "county"],
        suggestionTemplate: "R-Monument Name: {monument_name}, County: {county}",
        exactMatch: false,
        outFields: ["*"],
        name: "R-Monuments",
        placeholder: "Search by County Name or R-Monument Name",
      }, {
        featureLayer: {
          url: labinslayerURL + "/10",
          popupTemplate: erosionControlLineTemplate
        },
        searchFields: ["ecl_name", "county"],
        suggestionTemplate: "R-Monument Name: {ecl_name}, County: {county}",
        exactMatch: false,
        outFields: ["*"],
        name: "Erosion Control Lines",
        placeholder: "Search by County Name or Town Name",
      }, {
        featureLayer: {
          url: swfwmdURL,
          popupTemplate: swfwmdLayerPopupTemplate
        },
        searchFields: ["BENCHMARK_NAME"],
        suggestionTemplate: "Benchmark Name: {BENCHMARK_NAME}, fileName {FILE_NAME}",
        exactMatch: false,
        outFields: ["*"],
        name: "Survey Benchmarks",
        placeholder: "Search by Survey Benchmark name",
      }],
    });

    CalciteMapsArcGISSupport.setSearchExpandEvents(searchWidget);


    ////////////////////////////
    ///// Event Listeners //////
    ////////////////////////////



    //// Clickable Links 
    //NGS link

  // Clear all graphics from map  
  on(dom.byId("clearButton"), "click", function(evt){
    selectionLayer.graphics.removeAll(); 
  });

    console.log(mapView);
    mapView.popup.on("trigger-action", function (event) {
      if (event.action.id === "ngsWebsite") {
        window.open("https://www.ngs.noaa.gov");
      }
    });

    //R Monuments link
    mapView.popup.on("trigger-action", function (event) {
      if (event.action.id === "rMonuments") {
        window.open("https://floridadep.gov/water/beach-field-services/content/regional-coastal-monitoring-data");
      }
    });

    //Erosion ControlLines Link
    mapView.popup.on("trigger-action", function (event) {
      if (event.action.id === "waterBoundaryData") {
        window.open("http://www.labins.org/survey_data/water/water.cfm");
      }
    });

    var highlightSymbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0]), 1),
      new Color([125, 125, 125, 0.35])
    );
    //Custom Zoom to feature
    mapView.popup.on("trigger-action", function (evt) {
      if (evt.action.id === "custom-zoom") {
        selectionLayer.graphics.removeAll();
        console.log(mapView.popup.selectedFeature);
        mapView.goTo({
          target: mapView.popup.selectedFeature.geometry,
          zoom: 17
        });
        highlightGraphic = new Graphic(mapView.popup.selectedFeature.geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);
      };
    });

    /////////////
    // Widgets //
    /////////////


    // Popup and panel sync
    mapView.then(function () {
      CalciteMapsArcGISSupport.setPopupPanelSync(mapView);
    });

    // Search - Global
    var navbarSearch = new Search({
      container: "searchWidgetDiv1",
      view: mapView,
      sources: [
        {
          locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
          singleLineFieldName: "SingleLine",
          outFields: ["Addr_type"],
          name: "ESRI Search Tool",
          placeholder: "This is a placeholder",
          countryCode: "US",
          requestOptions: {
          region: "Florida"
          }
        }
      ]
    });
    CalciteMapsArcGISSupport.setSearchExpandEvents(searchWidget);

    // Basemaps
    var basemaps = new Basemaps({
      container: "basemapGalleryDiv",
      view: mapView
    })

    // Legend
    var legendWidget = new Legend({
      container: "legendDiv",
      view: mapView
    });

    // LayerList
    var layerWidget = new LayerList({
      container: "layersDiv",
      view: mapView
    });

    // Print
    var printWidget = new Print({
      container: "printDiv",
      view: mapView,
      printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });

    // Scalebar
    var scaleBar = new ScaleBar({
      view: mapView
    });
    mapView.ui.add(scaleBar, "bottom-left");


    // Home
    var home = new Home({
      view: mapView
    });
    mapView.ui.add(home, "top-left");

    var locateBtn = new Locate({
      view: mapView
    });
    mapView.ui.add(locateBtn, "top-left");

    var clearBtn = document.getElementById("clearButton");
    mapView.ui.add(clearBtn, "top-left");






  });
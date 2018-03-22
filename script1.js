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


  // Widgets
  "esri/widgets/BasemapGallery",
  "esri/widgets/Search",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/widgets/Print",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Home",
  "esri/core/watchUtils",
  "dojo/_base/array",
  "dojo/on",
  "dojo/dom",
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
  Basemaps,
  Search,
  Legend,
  LayerList,
  Print,
  BasemapToggle,
  ScaleBar,
  Home,
  watchUtils, arrayUtils, on, dom, domConstruct, query, Color,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapsArcGISSupport) {

    /******************************************************************
     *
     * Create the map, view and widgets
     * 
     ******************************************************************/


    //////////////////////
    // Popup Templates ///
    //////////////////////


    /*********************************************************************
    *
    * 
    * Labins Popup Templates
    *
    *
     *********************************************************************/



     var customZoomAction = {
      title: "Zoom to",
      id: "custom-zoom",
      className: "esri-icon-zoom-in-magnifying-glass"
    };


    var NGSpopupTemplate = {
      title: 'NGS Control Points: {objectid}',
      content: "<p>(Latitude, Longitude): {dec_lat}, {dec_long}</p>" +
        "<p>County: {county}</p>" +
        "<p>PID: {pid}</p>" +
        "<p>Data Source: <a target='_blank' href={data_srce}>here</a></p>" +
        "<p>Datasheet: <a href={datasheet2}>here</a></p>",
      actions: [{
        title: "Visit NGS website",
        id: "ngsWebsite",
        className: "esri-icon-launch-link-external"
      }]
    };


    var NGSPreliminarypopupTemplate = {
      title: 'Preliminary NGS Control Point: {FeatureID}',
      content: "<p><b>Designation: {base_and_survey.sde.Prelim_NGS_12_21_2011b.designatio}</b></p>" +
        "<p><b>Latitude: {base_and_survey.sde.Prelim_NGS_12_21_2011b.latdecdeg}</b></p>" +
        "<p><b>Longitude: {base_and_survey.sde.Prelim_NGS_12_21_2011b.londecdeg}</b></p>" +
        "<p>Abstract: <a href={base_and_survey.sde.PUBLISHED_PRELIMINARY.abstract}>here</a></p>" +
        "<p>Description file: <a href={base_and_survey.sde.PUBLISHED_PRELIMINARY.description2}>here</a></p>",
      actions: [{
        title: "Visit the National Geodetic Survey website",
        id: "ngsWebsite",
        className: "esri-icon-launch-link-external"
      }]
    };

    // obtain BLMID, QuadName, images
    // https://community.esri.com/community/gis/web-gis/arcgisonline/blog/2017/07/18/conditional-field-display-with-arcade-in-pop-ups
    // for conditional expressions
    var certifiedCornersTemplate = {
      title: 'Certified Corners: {FeatureID}',
      content: "<p><b>BLMID: {blmid}</b></p>" +
        "<p><b>image1: <a href={image1}>here</a></b></p>" +
        "<p><b>image2: <a href={image2}>here</a></b></p>" +
        "<p>Quad Name: {tile_name}</p>" +
        "<p>Quad Number: {quad_num}</p>",
      actions: [{
        title: "Visit the National Geodetic Survey website",
        id: "ngsWebsite",
        className: "esri-icon-launch-link-external"
      }]
    };

    //ID, name, county, quad name, status, station 1, station 2, mhw, mlw, stevens id
    var tideStationsTemplate = {
      title: 'Tide Stations: {id}',
      content: "<p><b>ID: {id}</b></p>" +
        "<p>County: {countyname}</p>" +
        "<p>Quad Name: {quadname}</p>" +
        "<p>Status: {status}</p>" +
        "<p>MHW: {navd88mhw_ft}</p>" +
        "<p>MLW: {navd88mlw_ft}</p>" +
        "<p>Steven's ID: {stevens_id}</p>" +
        "<p><b>DEP Report: <a target='_blank' href={report_dep}>here</a></b></p>",
      actions: [{
        title: "Visit the National Geodetic Survey website",
        id: "ngsWebsite",
        className: "esri-icon-launch-link-external"
      }]
    };

    //ID, county, quad name, method, station 1, station 2, mean high water, mean low water, approval form download
    var tideInterpPointsTemplate = {
      title: 'Tide Stations: {id}',
      content: "<p><b>ID: {id}</b></p>" +
        "<p>County: {cname}</p>" +
        "<p>Quad Name: {tile_name}</p>" +
        "<p>Method: {method}</p>" +
        "<p>MHW: {mhw2_ft}</p>" +
        "<p>MLW: {mlw2_ft}</p>" +
        "<p>Station 1: {station1}</p>" +
        "<p>Station 2: {station2}</p>" +
        "<p>Download report: <a target='_blank' href=http://www.labins.org/survey_data/water/FlexMap_docs/interp_approval_form.cfm?pin={iden}&mCountyName={cname}&mQuad={tile_name}&mhw={mhw2_ft}&mlw={mlw2_ft}>here</a></p>",

      actions: [{
        title: "Visit the Labins Website for Water Boundary data",
        id: "waterBoundaryData",
        className: "esri-icon-launch-link-external"
      }]
    };

    var rMonumentsTemplate = {
      title: 'Regional Coastal Monitoring Data:',
      content: "<p><b>Feature ID: {unique_id}</b></p>" +
        "<p>Monument Name: {monument_name}</p>" +
        "<p>State Plane Zone: {state_plane_zone}</p>" +
        "<p>County: {county}</p>" +
        "<p>Latitude: {latitude}</p>" +
        "<p>Longitude: {longitude}</p>",
      actions: [{
        title: "Visit the FDEP website",
        id: "rMonuments",
        className: "esri-icon-launch-link-external"
      }]
    };

    var erosionControlLineTemplate = {
      title: 'Range Monument:',
      content: "<p><b>Feature ID: {objectid}</b></p>" +
        "<p>County: {county}</p>" +
        "<p>ECL Name: {ecl_name}</p>" +
        "<p>MHW: {mhw}</p>" +
        "<p>Location: {location}</p>" +
        "<p>Download more information: <a target='_blank' href=http://www.labins.org/survey_data/water/ecl_detail.cfm?sel_file={mhw}.pdf&fileType=MAP>here</a></p>",
      actions: [{
        title: "Visit the Labins Water Boundary Data Website",
        id: "waterBoundaryData",
        className: "esri-icon-launch-link-external"
      }]
    };


    /********************************************************
     * 
     * Geoname Popup Template
     * 
     *******************************************************/


    var geonamesTemplate = {
      title: 'Geographic Names',
      content: "<p><b>Object ID: {OBJECTID}</b></p>" +
        "<p>Feature Name: {gaz_name}</p>" +
        "<p>Feature Type: {gaz_featureclass}</p>" +
        "<p>State: {state_alpha}</p>" +
        "<p>County: {county_name}</p>",
      actions: [{
        title: "Visit the USGS National Map Website",
        id: "national-map",
        className: "esri-icon-launch-link-external"
      }]
    };

    /********************************************************
     * 
     * SWFWMD Benchmark Popup Template
     * 
     *******************************************************/

    var swfwmdLayerPopupTemplate = {
      title: 'SWFWMD Survey Benchmarks:',
      content: "<p><b>Benchmark Name: {BENCHMARK_NAME}</b></p>" +
        "<p>More Information: {DOWNLOADME}</p>",

      actions: [{
        title: "Visit the Labins Water Boundary Data Website",
        id: "waterBoundaryData",
        className: "esri-icon-launch-link-external"
      }]
    };



    /********************************************************
    * 
    * Control Lines Popups
    * 
    *******************************************************/


    // I think I need to add more templates to this
    //municipal name, muacres, texture, drainage class, mukind, floodfreqdc,floodfreqma, description 
    //https://www.fgdl.org/metadata/metadata_archive/fgdl_html/nrcs_soils.htm
    //full key list for abbreviations
    var soilsTemplate = {
      title: 'USDA Soils: {muname}',
      content: "<p><b>Mapunit Name: {muname}</b></p>" +
        "<p>Size (acres): {muacres}</p>" +
        "<p>Texture: {texture}</p>" +
        "<p>Drainage Class: {drainagecl}</p>" +
        "<p>Mapunit Kind: {mukind}</p>" +
        "<p>Flooding Frequency ‐ Dominant Condition: {flodfreqdc}</p>" +
        "<p>Flooding Frequency ‐ Maximum: {flodfreqma}</p>" +
        "<p>Description: {descript}</p>",

      actions: [customZoomAction]
    };
    soilsTemplate.overwriteActions = true;



    var parcelsTemplate = {
      title: 'Parcels: {OBJECTID}',
      content:
        "<p>Parcel ID: {PARCEL_ID}</p>" +
        "<p>City: {OWN_CITY}</p>" +
        "<p>State: {OWN_STATE}</p>" +
        "<p>Address: {PHY_ADDR1}</p>",

      actions: [{
        title: "Visit the Labins Water Boundary Data Website",
        id: "waterBoundaryData",
        className: "esri-icon-launch-link-external"
      }, customZoomAction]
    };
    parcelsTemplate.overwriteActions = true;

    var cityLimitsTemplate = { // autocasts as new PopupTemplate()
      title: "City name: {name}",
      content: "<b>county:</b> {county}" +
        "<br><b>objectid:</b> {objectid}" +
        "<br><b>tax_count:</b> {tax_count}" +
        "<br><b>descript:</b> {descript}"
    };

    var quadsTemplate = { // autocasts as new PopupTemplate()
      title: "Quads",
      content: "<b>tile_name:</b> {tile_name}" +
        "<br><b>latitude:</b> {latitude}" +
        "<br><b>longitude:</b> {longitude}" +
        "<br><b>quad:</b> {quad}"
    };

    //blmid, quad name, ccr links
    var CCRTemplate = {
      title: "CCR with Images",
      content:
        "<p>BLMID: {blmid}</p>" +
        "<p>Quad Name: {tile_name}</p>" +
        "<p>Quad Number: {quad_num}</p>" +
        "<p>Image: <a target='_blank' href={image1}>here</a></p>" +
        "<p>Image: <a target='_blank' href={image2}>here</a></p>" +
        "<p>Image: <a target='_blank' href={image3}>here</a></p>",
    };

    //////////////////////
    // Load in the Maps //
    //////////////////////


    /////https://developers.arcgis.com/javascript/latest/sample-code/layers-mapimagelayer-definitionexpression/index.html
    //You can set definition expressions through the sublayers in a mapimagelayer
/*
    // Geographic Names Layer
    var geoNamesLayer = new MapImageLayer({
      url: "https://services.nationalmap.gov/arcgis/rest/services/geonames/MapServer",
      title: "Geographic Names",
      visible: false,
      sublayers: [{
        id: 1,
        title: "Landforms",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 2,
        title: "Streams (Mouth)",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 3,
        title: "Antarctica",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 5,
        title: "Airports",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 6,
        title: "Buildings",
        visible: true,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 7,
        title: "Churches",
        visible: true,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 8,
        title: "Hospitals",
        visible: true,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 9,
        title: "Schools",
        visible: true,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 10,
        title: "Bridges, Crossings, and Tunnels",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 11,
        title: "Cemeteries",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 12,
        title: "Dams",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 13,
        title: "Locales",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 14,
        title: "Mines",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 15,
        title: "Trailheads",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 16,
        title: "Wells",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 18,
        title: "Populated Places",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 19,
        title: "Civil Features",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 20,
        title: "Forests",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 21,
        title: "Parks",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 22,
        title: "Reserves",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 24,
        title: "Historical Cultural-Political Points",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 25,
        title: "Historical Hydrographic Points",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }, {
        id: 26,
        title: "Historical Physical Points",
        visible: false,
        popupTemplate: geonamesTemplate,
        definitionExpression: "state_alpha = 'FL'"

      }]
    });
*/
    //var controlPointsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/FREAC/LABINS_2017_Pts_No_SWFMWD_3857/MapServer/0";
    var controlPointsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0"
    var controlPointsLayer = new FeatureLayer({
      url: controlPointsURL,
      title: "NGS Control Points",
      visible: false,
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
        id: 0,
        title: "NGS Control Points",
        visible: true,
        popupTemplate: NGSpopupTemplate
      }, {
        id: 1,
        title: "Preliminary NGS Points",
        visible: true,
        popupTemplate: NGSPreliminarypopupTemplate
      }, {
        id: 2,
        title: "Certified Corners",
        visible: true,
        popupTemplate: certifiedCornersTemplate
      },  {
        id: 3,
        title: "Certified Corner (BLMID) Labels",
        visible: false
      },  {
        id: 4,
        title: "CCBLMID All Labels",
        visible: false
      }, {
        id: 5,
        title: "Tide Stations",
        visible: true,
        popupTemplate: tideStationsTemplate
      }, {
        id: 6,
        title: "Tide Interpolation Points",
        visible: true,
        popupTemplate: tideInterpPointsTemplate
      }, {
        id:7,
        title: "Geographic Names",
        visible: false,
        popupTemplate: geonamesTemplate
      }, {
      id:8,
      title: "CCR with Images",
      visible: true,
      popupTemplate: CCRTemplate
      }, {
      id: 9,
      title: "R-Monuments",
      visible: true,
      popupTemplate: rMonumentsTemplate
    }, {
      id: 10,
      title: "Erosion Control Line",
      visible: true,
      popupTemplate: erosionControlLineTemplate



      }]
    });


    var swfwmdURL = "https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer";
    var swfwmdLayer = new FeatureLayer({
      url: swfwmdURL,
      title: "SWFWMD Benchmarks",
      visible: false,
      popupTemplate: swfwmdLayerPopupTemplate

    });


    var controlLinesURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer/";
    var controlLinesLayer = new MapImageLayer({
      url: controlLinesURL,
      sublayers: [{
        id: 0,
        title: "USGS Quads",
        visible: false,
      }, {
        id: 1,
        title: "Township-Range",
        visible: false,
      }, /*{
    id:2,
    title: "Township-Range-Section",
    visible: false,
  }, */{
        id: 3,
        title: "City Limits",
        visible: false,
        cityLimitsTemplate,
      }, {
        id: 4,
        title: "County Boundaries",
        visible: false,
      }, {
        id: 5,
        title: "Parcels",
        visible: false,
        popupTemplate: parcelsTemplate,
      }, {
        id: 6,
        title: "Lakes, Ponds, and Reservoirs",
        visible: false,
      }, {
        id: 7,
        title: "Rivers, Streams, and Canals",
        visible: false
      }, {
        id: 8,
        title: "Hi-Res Imagery Grid: State Plane West",
        visible: false,
      }, {
        id: 9,
        title: "Hi-Res Imagery Grid: State Plane North",
        visible: false,
      }, {
        id: 10,
        title: "Hi-Res Imagery Grid: State Plane East",
        visible: false,
      }, {
        id: 11,
        title: "USDA Soils",
        visible: false,
        popupTemplate: soilsTemplate
      }]
    });

    //var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer/2";
    var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/FREAC/Control_2017_Lines_TEST/MapServer/0";

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
          console.log(response);
          return values;

        })/*
        .then(function(values) {
        var uniqueValues = [];
        values.forEach(function(item) {
        if (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) {
            uniqueValues.push(item);
        }
        });
        return uniqueValues;
        })*/
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


// Input location from drop down, zoom to it and highlight
    function zoomToFeature(panelurl, location, attribute) {

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
          console.log(response);
          highlightGraphic = new Graphic(response.features[0].geometry, highlightSymbol);
          selectionLayer.graphics.add(highlightGraphic);
        });
    }

    function showPopup() {
      console.log("into the showPopup");
      console.log(bufferElements);
      if (bufferElements.length > 0) {
        mapView.popup.open({
          features: bufferElements
          //location: bufferElements.geometry,
        });
      } else {console.log("showPopup didn't work")};
      dom.byId("mapViewDiv").style.cursor = "auto";
      //clear array before next call
      bufferElements.length = 0;
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
        //.then(queryFeaturesInBuffer)

        //This should append all features of both 
        //buffers to popup function that happes after

        //What I can see is an entire array with nexted arrays
        // gets put into bufferElements before the second function
        // runs then .push() behaves properly
        .then(function (response) {
        bufferIdentify(controlLinesURL, [0, 3, 5, 11], names, templates, response)
        //.then(console.log(bufferElements.length))
        bufferIdentify('https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer', [8], ["CCR with Images"], [CCRTemplate], response)
        //.then(console.log(bufferElements.length));
      })
      .then(showPopup);
    }
        //.then(function (response) {concatIdentify(response)})
        //.then(showPopup(bufferElements));

        //second bufferIdentify call
     //bufferIdentify('https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer', [8], ["CCR with Images"], [CCRTemplate], response) 
    var polySym = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [140, 140, 222, 0.5],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2
      }
    };

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
      return bufferGeometry;
    }

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
      return zoomToFeature(controlLinesURL + "4", e.target.value, "ctyname");
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

    //Build City Dropdown panel
    buildSelectPanel(controlLinesURL + "2", "trs", "Zoom to a Township-Range-Section", "selectTownshipPanel");

    query("#selectTownshipPanel").on("change", function (e) {
      return zoomToFeature(controlLinesURL + "2", e.target.value, "trs");
    });





    ////////////////////////////
    //// Filter by Feature /////
    ///////////////////////////


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

///////////////////////////////
//// IdentifyTask on Click ////
///////////////////////////////
/*
var layerNames = ['City Limits', 'USGS Quads', 'Parcels', 'Soils'];
var popupTemplates = [cityLimitsTemplate, quadsTemplate, parcelsTemplate, soilsTemplate];
var layerArray = [0, 3, 5, 11];

popupElements = []

on(mapView, "click", identifyFeatures(controlLinesURL, layerArray, layerNames, popupTemplates, event.mapPoint));

function identifyFeatures (url, layerArray, layerNames, popupTemplates, geometry) {

    identifyTask = new identifyTask(url);

    params = IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = layerArray
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
    params.returnGeometry = true;

    executeIdentifyTask();

    function executeIdentifyTask(event) {
        // Set the geometry to the location of the view click
        params.geometry = geometry;
        params.mapExtent = mapView.extent;
        dom.byId("mapViewDiv").style.cursor = "wait";
        //console.log("I'm waiting.");
  
        // This function returns a promise that resolves to an array of features
        // A custom popupTemplate is set for each feature based on the layer it
        // originates from
        identifyTask.execute(params).then(function (response) {
  
          var results = response.results;
          //console.log("I'm still waiting");
          //console.log(results);
  
          return arrayUtils.map(results, function (result) {
  
            //console.log("Did the return happen?");
            //console.log(result.layerName);
  
            var feature = result.feature;
            var layerName = result.layerName;
  
            feature.attributes.layerName = layerName;

            for (i = 0; i < layerNames.length; i++) {
                if(layerName === layerNames[i]) {
                    feature.popupTemplate = popupTemplates[i];
                }
            }
              console.log(feature);
              return feature;
    
            });
}).then(popupElements.concat(feature));

console.log(popupElements);
    };
  }
*/
// disable current functionality for doubleclick
mapView.on("double-click", function(evt) {
  evt.stopPropagation();
  console.info(evt);
});


          // executeIdentifyTask() is called each time the view is clicked
          on(mapView, "double-click", executeIdentifyTask);
    
          // Create identify task for the specified map service
          identifyTask = new IdentifyTask(controlLinesURL);
    
          // Set the parameters for the Identify
          params = new IdentifyParameters();
          params.tolerance = 3;
          params.layerIds = [0, 3, 5, 11];
          params.layerOption = "all";
          params.width = mapView.width;
          params.height = mapView.height;
          params.returnGeometry = true;
    
        // Executes each time the view is clicked
        function executeIdentifyTask(event) {
          // Set the geometry to the location of the view click
          params.geometry = event.mapPoint;
          params.mapExtent = mapView.extent;
          dom.byId("mapViewDiv").style.cursor = "wait";
          //console.log("I'm waiting.");
    
          // This function returns a promise that resolves to an array of features
          // A custom popupTemplate is set for each feature based on the layer it
          // originates from
          identifyTask.execute(params).then(function (response) {
    
            var results = response.results;
            //console.log("I'm still waiting");
            //console.log(results);
    
            return arrayUtils.map(results, function (result) {
    
              //console.log("Did the return happen?");
              //console.log(result.layerName);
    
              var feature = result.feature;
              var layerName = result.layerName;
    
              feature.attributes.layerName = layerName;
    
              //console.log(layerName);
              //console.log(result);
              if (layerName === 'USGS Quads') {
                feature.popupTemplate = { // autocasts as new PopupTemplate()
                  title: "Quads",
                  content: "<b>tile_name:</b> {tile_name}" +
                    "<br><b>latitude:</b> {latitude}" +
                    "<br><b>longitude:</b> {longitude}" +
                    "<br><b>quad:</b> {quad}"
                };
              }
              else if (layerName === 'City Limits') {
                feature.popupTemplate = { // autocasts as new PopupTemplate()
                  title: "City name: {name}",
                  content: "<b>county:</b> {county}" +
                    "<br><b>objectid:</b> {objectid}" +
                    "<br><b>tax_count:</b> {tax_count}" +
                    "<br><b>descript:</b> {descript}"
                };
              }
              else if (layerName === 'Parcels') {
                feature.popupTemplate = parcelsTemplate;
              }
              else if (layerName === 'Soils June 2012 - Dept. of Agriculture') {
                feature.popupTemplate = soilsTemplate;
              }
    
              //console.log(feature);
              return feature;
    
            });
          }).then(showPopup); // Send the array of features to showPopup()
    
          // Shows the results of the Identify in a popup once the promise is resolved
          function showPopup(response) {
            //console.log(response);
            if (response.length > 0) {
              mapView.popup.open({
                features: response,
                location: event.mapPoint
              });
            }
            dom.byId("mapViewDiv").style.cursor = "auto";
          }
        }
//    });

    /*
    */

    /////////////////////////
    //// Buffer Identify ////
    /////////////////////////
/*
    function bufferIdentify(buffer) {

      console.log("We've entered the buffer identify function");

      console.log(buffer);

      // Create identify task for the specified map service
      identifyTask = new IdentifyTask(controlLinesURL);

      // Set the parameters for the Identify
      params = new IdentifyParameters();
      params.tolerance = 10;
      params.layerIds = [0, 3, 11];
      params.layerOption = "all";
      params.width = mapView.width;
      params.height = mapView.height;
      params.returnGeometry = true;

      executeIdentifyTask();

      // Executes each time the view is clicked
      function executeIdentifyTask() {
        console.log("we've entered executeIdentifyTask function");
        console.log(buffer);
        // Set the geometry to the location of the view click
        params.geometry = buffer;
        params.mapExtent = mapView.extent;
        dom.byId("mapViewDiv").style.cursor = "wait";
        //console.log(buffer);

        // This function returns a promise that resolves to an array of features
        // A custom popupTemplate is set for each feature based on the layer it
        // originates from
        identifyTask.execute(params).then(function (response) {

          var results = response.results;
          //console.log("I'm still waiting");
          //console.log(results);

          return arrayUtils.map(results, function (result) {

            //console.log("Did the return happen?");
            //console.log(result.layerName);

            var feature = result.feature;
            var layerName = result.layerName;

            feature.attributes.layerName = layerName;

            //console.log(layerName);
            //console.log(result);
            if (layerName === 'USGS Quads') {
              feature.popupTemplate = { // autocasts as new PopupTemplate()
                title: "Quads",
                content: "<b>tile_name:</b> {tile_name}" +
                  "<br><b>latitude:</b> {latitude}" +
                  "<br><b>longitude:</b> {longitude}" +
                  "<br><b>quad:</b> {quad}"
              };
            }
            else if (layerName === 'City Limits') {
              feature.popupTemplate = { // autocasts as new PopupTemplate()
                title: "City name: {name}",
                content: "<b>county:</b> {county}" +
                  "<br><b>objectid:</b> {objectid}" +
                  "<br><b>tax_count:</b> {tax_count}" +
                  "<br><b>descript:</b> {descript}"
              };
            }
            else if (layerName === 'Parcels') {
              feature.popupTemplate = parcelsTemplate;
            }
            else if (layerName === 'Soils June 2012 - Dept. of Agriculture') {
              feature.popupTemplate = soilsTemplate;
            }

            //console.log(feature);
            //console.log("logged a feature");
            return feature;

          });
        }).then(showPopup); // Send the array of features to showPopup()

        // Shows the results of the Identify in a popup once the promise is resolved
        function showPopup(response) {
          console.log(typeof response);
          console.log(response);
          if (response.length > 0) {
            mapView.popup.open({
              features: response,
              location: buffer.centroid
            });
          }
          dom.byId("mapViewDiv").style.cursor = "auto";
        }
      }
    }

*/

function concatIdentify (response) {

  
  bufferIdentify(controlLinesURL, [0, 3, 5, 11], names, templates, response)
  .then(console.log("First buffer done"))
  .then(bufferIdentify('https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer', [8], ["CCR with Images"], [CCRTemplate], response))
  .then(console.log("second buffer done"));
  //.then(showPopup(bufferElements));
}

function bufferIdentify(url, layerArray, layerNames, popupTemplates, geometry) {

  //console.log("We've entered the buffer identify function");

  //console.log(geometry);

  // Create identify task for the specified map service
  identifyTask = new IdentifyTask(url);

  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 10;
  params.layerIds = layerArray;
  params.layerOption = "all";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;

  executeIdentifyTask();

  // Executes each time the view is clicked
  function executeIdentifyTask() {
    console.log("we've entered executeIdentifyTask function");
    //console.log(geometry);
    // Set the geometry to the location of the view click
    params.geometry = geometry;
    params.mapExtent = mapView.extent;
    dom.byId("mapViewDiv").style.cursor = "wait";
    //console.log(buffer);

    // This function returns a promise that resolves to an array of features
    // A custom popupTemplate is set for each feature based on the layer it
    // originates from
    identifyTask.execute(params).then(function (response) {

      var results = response.results;
      console.log("we've executed the identifyTask");
      //console.log(results);

      return arrayUtils.map(results, function (result) {

        //console.log("Did the return happen?");
        //console.log(result.layerName);

        var feature = result.feature;
        var layerName = result.layerName;

        feature.attributes.layerName = layerName;

        for (i = 0; i < names.length; i++) {
          if(layerName === names[i]) {
              feature.popupTemplate = templates[i];
          }
      }
        bufferElements.push(feature);
        console.log(bufferElements);
        return feature;
      });
    });//.then(showPopup); // Send the array of features to showPopup()
    // Shows the results of the Identify in a popup once the promise is resolved
    
    /*function showPopup(response) {
      
      console.log(response);
      console.log(bufferElements);
      if (bufferElements.length > 0) {
        mapView.popup.open({
          features: bufferElements,
          location: buffer.geometry
        });
      }
      dom.byId("mapViewDiv").style.cursor = "auto";
    }*/
  }
}
var names = ['City Limits', 'USGS Quads', 'Parcels', 'Soils June 2012 - Dept. of Agriculture']
var templates = [cityLimitsTemplate, quadsTemplate, parcelsTemplate, soilsTemplate]

    //////////////////////////////////
    //// Search Widget Text Search ///
    //////////////////////////////////

    // Search - add to navbar
    var searchWidget = new Search({
      container: "searchWidgetDiv",
      view: mapView,
      allPlaceholder: "Text search for NGS, DEP, and SWFWMD Data",
      sources: [{
        featureLayer: {
          url: "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0",
          popupTemplate: {
            title: 'NGS Control Point: {objectid}',
            content: "<p><b>(Latitude, Longitude): {dec_lat}, {dec_long}</b></p>" +
              "<p>County: {county}</p>" +
              "<p>PID: {pid}</p>" +
              "<p>Data Source: <a target='_blank' href={data_srce}>here</a></p>" +
              "<p>Datasheet: <a href={datasheet2}>here</a></p>" +
              "<p>Quad: {quad}</p>",
            actions: [{
              title: "Visit NGS website",
              id: "ngsWebsite",
              className: "esri-icon-launch-link-external"
            }]
          }
        },
        searchFields: ["pid", "datasheet2", "county"],
        displayField: "pid",
        exactMatch: false,
        outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2", "quad"],
        filter: {
          where: "1=1",
        },
        name: "NGS Control Points PID",
        placeholder: "Example: 3708",
      }, {
        featureLayer: {
          url: "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0",
          popupTemplate: {
            title: 'NGS Control Point: {objectid}',
            content: "<p><b>(Latitude, Longitude): {dec_lat}, {dec_long}</b></p>" +
              "<p>County: {county}</p>" +
              "<p>PID: {pid}</p>" +
              "<p>Data Source: <a target='_blank' href={data_srce}>here</a></p>" +
              "<p>Datasheet: <a href={datasheet2}>here</a><s/p>" +
              "<p>Quad: {quad}</p>",
            actions: [{
              title: "Visit NGS website",
              id: "ngsWebsite",
              className: "esri-icon-launch-link-external"
            }]
          }
        },
        searchFields: ["pid"],
        displayField: ["pid", "county"],
        exactMatch: false,
        outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2"],
        name: "NGS Control Points PID",
        placeholder: "Example: 3708",
      }],
    });

    CalciteMapsArcGISSupport.setSearchExpandEvents(searchWidget);


    ////////////////////////////
    ///// Event Listeners //////
    ////////////////////////////



    //// Clickable Links 
    //NGS link
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

    //National Map Link
    mapView.popup.on("trigger-action", function (event) {
      if (event.action.id === "national-map") {
        window.open("https://nationalmap.gov/");
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
      view: mapView
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







  });
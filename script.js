require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/geometry/geometryEngine",
  "esri/tasks/GeometryService",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",


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


  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.6",
  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.6",

  "dojo/domReady!"
], function(Map, 
    MapView, 
    MapImageLayer,
    FeatureLayer,
    QueryTask, 
    Query,
    geometryEngine,
    GeometryService,
    GraphicsLayer,
    Graphic,
    Basemaps, 
    Search, 
    Legend, 
    LayerList, 
    Print, 
    BasemapToggle, 
    ScaleBar, 
    Home,
    watchUtils, arrayUtils, on, dom, domConstruct, query,
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
// Labins Popups /////
//////////////////////


var NGSpopupTemplate = {
  title: 'NGS Control Point: {objectid}',
  content: "<p><b>(Latitude, Longitude): {dec_lat}, {dec_long}</b></p>" +
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

var tideStationsTemplate = {
  title: 'Tide Stations: {id}',
  content: "<p><b>ID: {id}</b></p>" + 
  "<p>County: {countyname}</p>" +
  "<p>Quad Name: {quadname}</p>" +
  "<p>Status: {status}</p>"+ 
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

var tideInterpPointsTemplate = {
  title: 'Tide Stations: {id}',
  content: "<p><b>ID: {id}</b></p>" + 
  "<p>County: {cname}</p>" +
  "<p>Quad Name: {tile_name}</p>" +
  "<p>Method: {method}</p>"+ 
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


/////////////////////
// Geonames Popup //
////////////////////


var geonamesTemplate = {
  title: '{gaz_featureclass}',
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

////////////////////////////
// SWFWMD Benchmark Popup //
////////////////////////////

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
  


//////////////////////////
// Control Lines Popups //
//////////////////////////

// I think I need to add more templates to this
//municipal name, muacres, texture, drainage class, mukind, floodfreqdc,floodfreqma, description 
//https://www.fgdl.org/metadata/metadata_archive/fgdl_html/nrcs_soils.htm
//full key list for abbreviations

var soilsTemplate = {
title: 'USDA Soils:',
content: "<p><b>Mapunit Name: {muname}</b></p>" + 
"<p>Size (acres): {muacres}</p>" +
"<p>Texture: {texture}</p>" +
"<p>Drainage Class: {drainagecl}</p>" +
"<p>Mapunit Kind: {mukind}</p>" +
"<p>Flooding Frequency - Dominant Condition: {flodfreqdc}</p>" +
"<p>Flooding Frequency - Maximum: {flodfreqma}</p>" + 
"<p>Description: {descript}</p>",

actions: [{
title: "Visit the Labins Water Boundary Data Website",
id: "waterBoundaryData",
className: "esri-icon-launch-link-external"
}]
};





/////////////////////////
// Load in the layers ///
/////////////////////////


/////https://developers.arcgis.com/javascript/latest/sample-code/layers-mapimagelayer-definitionexpression/index.html
//You can set definition expressions through the sublayers in a mapimagelayer
var geoNames = new MapImageLayer({
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



var labinsLayer = new MapImageLayer({
  url: "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer",
  title: "LABINS Data",
  sublayers: [{
    id: 0,
    title: "NGS Control Points", 
    visible: true,
    popupTemplate:NGSpopupTemplate
  }, {
    id:1,
    title: "Preliminary NGS Points",
    visible: false,
    popupTemplate: NGSPreliminarypopupTemplate
  }, {
    id:2,
    title: "Certified Corners",
    visible: false,
    popupTemplate: certifiedCornersTemplate
  }, {
    id:3,
    visible: false 
  }, {
    id:4,
    title: "Tide Stations",
    visible: false,
    popupTemplate: tideStationsTemplate
  }, {
    id:5,
    title: "Tide Interpolation Points",
    visible: false,
    popupTemplate: tideInterpPointsTemplate
  },/* {
    id:6,
    title: "Geographic Names",
    visible: false,
    popupTemplate: geographicNamesTemplate
  },*/ {
    id:7,
    visible: false
  }, {
    id:8,
    title: "R-Monuments",
    visible: false,
    popupTemplate: rMonumentsTemplate
  }, {
    id:9,
    title: "Erosion Control Lines",
    visible: false,
    popupTemplate: erosionControlLineTemplate
  
  
  
  }]
});

var swfwmdLayer = new FeatureLayer({
  url: "https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer",
  title: "SWFWMD Benchmarks" ,
  visible: true,
  popupTemplate: swfwmdLayerPopupTemplate

 });

var controlLines = new MapImageLayer({
url: "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer",
sublayers: [{
  id: 0,
  title: "USGS Quads",
  visible: false,
}, {
  id:1,
  title: "Township-Range",
  visible: false, 
}, {
  id:2,
  title: "Township-Range-Section",
  visible: false,
}, {
  id:3,
  title: "City Limits",
  visible: false, 
  returnGeometry: true,
}, {
  id:4,
  title: "County Boundaries",
  visible: false,
}, {
  id:5,
  title: "Parcels",
  visible: false,
}, {
  id:6,
  title: "Lakes, Ponds, and Reservoirs",
  visible: false,
}, {
  id:7,
  title: "Rivers, Streams, and Canals",
  visible: false
}, {
  id:8,
  title: "Hi-Res Imagery Grid: State Plane West",
  visible: false,
}, {
  id:9,
  title: "Hi-Res Imagery Grid: State Plane North",
  visible: false,
}, {
  id:10,
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
  outFields: ["twn_ch", "rng_ch", "sec_ch", "trs"],
  visible: true
});

/////////////////////
// Create the map ///
/////////////////////

var bufferLayer = new GraphicsLayer();

  var map = new Map({
    basemap: "topo",
    layers: [labinsLayer, swfwmdLayer, controlLines , townshipRangeSectionLayer, bufferLayer]
  });


/////////////////////////
// Create the MapView ///
/////////////////////////

var mapView = new MapView({
container: "mapViewDiv",
map: map,
center: [-82.28, 27.8],
zoom: 7, 
constraints: {
rotationEnabled: false
}
});


/////////////////////////
//// Clickable Links ////
/////////////////////////

  //NGS link
  mapView.popup.on("trigger-action", function(event) {
    if (event.action.id === "ngsWebsite"){
      window.open("https://www.ngs.noaa.gov");
    }
  });

  //R Monuments link
  mapView.popup.on("trigger-action", function(event) {
    if (event.action.id === "rMonuments"){
      window.open("https://floridadep.gov/water/beach-field-services/content/regional-coastal-monitoring-data");
    }
  });

  //Erosion ControlLines Link
  mapView.popup.on("trigger-action", function(event) {
    if (event.action.id === "waterBoundaryData"){
      window.open("http://www.labins.org/survey_data/water/water.cfm");
    }
  });

  //National Map Link
  mapView.popup.on("trigger-action", function(event) {
    if (event.action.id === "national-map"){
      window.open("https://nationalmap.gov/");
    }
  });


  //////////////////////////////////////////////////////////////////
function buildSelectPanel(vurl ,attribute, zoomParam, panelParam) {

  var task = new QueryTask({
    url: vurl
  });

  var params = new Query({
    where: "1 = 1 AND " + attribute + " IS NOT NULL",
    outFields: [attribute],
    returnDistinctValues: true
  });

  var option = domConstruct.create("option");
  option.text = zoomParam;
  dom.byId(panelParam).add(option);

  task.execute(params)
  .then(function(response) {
//console.log(response.features);
    var features = response.features;
    var values = features.map(function(feature) {
    return feature.attributes[attribute];
    });
    return values;
  })
  .then(function(uniqueValues) {
    //console.log(uniqueValues);
    uniqueValues.sort();
    uniqueValues.forEach(function(value) {
    var option = domConstruct.create("option");
    option.text = value;
    dom.byId(panelParam).add(option);

    });
  });
  }



  function zoomToFeature(panelurl, location, attribute) {

		var task = new QueryTask({
			url: panelurl
		});
		var params = new Query({
			where: attribute + " = '" + location + "'",
			returnGeometry: true
		});
		task.execute(params)
			.then(function(response) {
      mapView.goTo(response.features);
			});
	}


//////////////////////////////////////////////////////////////////////////////////////
/////////////
// Widgets //
/////////////

//Get string variables (choices) for search widget

var county = document.getElementById("selectCountyPanel");
console.log(county);



  // Popup and panel sync
  mapView.then(function(){
    CalciteMapsArcGISSupport.setPopupPanelSync(mapView);
  });
  // Search - Global
  var navbarSearch = new Search({
    container: "searchWidgetDiv1",
    view: mapView
  })


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
          "<p>Datasheet: <a href={datasheet2}>here</a></p>"+
          "<p>Quad: {quad}</p>",
          actions: [{
          title: "Visit NGS website",
          id: "ngsWebsite",
          className: "esri-icon-launch-link-external"
          }]
        }
      },
      searchFields: ["pid"],
      displayField: "pid",
      exactMatch: false,
      outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2", "quad"],
      filter: {
        where: "1=1",
      },
      name: "NGS Control Points PID",
      placeholder: "Example: 3708",
    }, {featureLayer: {
      url: "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0",
      popupTemplate: {
        title: 'NGS Control Point: {objectid}',
        content: "<p><b>(Latitude, Longitude): {dec_lat}, {dec_long}</b></p>" +
        "<p>County: {county}</p>" + 
        "<p>PID: {pid}</p>" + 
        "<p>Data Source: <a target='_blank' href={data_srce}>here</a></p>" +
        "<p>Datasheet: <a href={datasheet2}>here</a></p>"+
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
/*
  var county = document.getElementById("selectCountyPanel");
  var countyStr = query("#selectCountyPanel").on("change", function(e) {
    countyStr = e.target.value.toUpperCase();
    console.log(countyStr + "this is a county string");
    var searchQuery = "county = '" + countyStr + "'";
    searchWidget.sources.items[0].filter.where = searchQuery;
    console.log(searchQuery);
    return countyStr;
  
  });
  */


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

  // BasemapToggle
  var basemapToggle = new BasemapToggle({
    view: mapView,
    secondBasemap: "satellite"
  });
  mapView.ui.add(basemapToggle, "bottom-right");          
  
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





//////////////////////
// Zoom to Feature ///
//////////////////////

// Zoom to City/County/Quad
panelurl = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines/MapServer/"


    // Build County Drop Down
    buildSelectPanel(panelurl + "4" , "ctyname", "Zoom to a County", "selectCountyPanel");
    
    query("#selectCountyPanel").on("change", function(e) {
      return zoomToFeature(panelurl + "4", e.target.value, "ctyname");
    });

    //Build Quad Dropdown panel
    buildSelectPanel(panelurl + "0" , "tile_name", "Zoom to a Quad", "selectQuadPanel");
      
    query("#selectQuadPanel").on("change", function(e) {
      return zoomToFeature(panelurl + "0", e.target.value, "tile_name");
    });

    //Build City Dropdown panel
    buildSelectPanel(panelurl + "3" , "name", "Zoom to a City", "selectCityPanel");
      
    query("#selectCityPanel").on("change", function(e) {
      return zoomToFeature(panelurl + "3", e.target.value, "name");
    });

// Zoom to Township/Range/Section

    //Build City Dropdown panel
    buildSelectPanel(townshipRangeSectionURL , "trs", "Zoom to a Township-Range-Section", "selectTownshipPanel");

  
    query("#selectTownshipPanel").on("change", function(e) {
      return zoomToFeature(townshipRangeSectionURL, e.target.value, "trs");
    });

///////////////////////
// Filter by Feature //
///////////////////////

    buildSelectPanel(panelurl + "4" , "ctyname", "Filter by County", "filterCountyPanel");

    var county = document.getElementById("filterCountyPanel");
    var countyStr = query("#filterCountyPanel").on("change", function(e) {
      countyStr = e.target.value.toUpperCase();
      console.log(countyStr + "this is a county string");
      var searchQuery = "county = '" + countyStr + "'";
      searchWidget.sources.items[0].filter.where = searchQuery;
      console.log(searchQuery);
      return countyStr;
    
    });

    buildSelectPanel("https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer/0" , "quad", "Filter by Quad", "filterQuadPanel");

    var quad = document.getElementById("filterQuadPanel");
    var quadStr = query("#filterQuadPanel").on("change", function(e) {
      quadStr = e.target.value.toUpperCase();
      console.log(quadStr + "this is a quad string");
      var searchQuery = "quad = '" + quadStr + "'";
      searchWidget.sources.items[0].filter.where = searchQuery;
      console.log(searchQuery);
      return quadStr;
    
    });

    buildSelectPanel(panelurl + "3" , "name", "Filter by City", "filterCityPanel");

    var city = document.getElementById("filterCityPanel");
    var cityStr = query("#filterCityPanel").on("change", function(e) {
      cityStr = e.target.value.toUpperCase();
      console.log(cityStr + "this is a city string");
      var searchQuery = cityStr.geometry;
      console.log(searchQuery + " This is the searchQuery");
      searchWidget.sources.items[0].filter.geometry = searchQuery;
      console.log(searchQuery);
      return cityStr;
    
    });
// Does not work, will need to combine township, range, section fields inside of ngs control points layer
    buildSelectPanel(panelurl + "2" , "trs", "Zoom to a Township-Range-Section", "filterTownshipPanel");
    var trs = document.getElementById("filterTownshipPanel");
    var trsStr = query("#filterTownshipPanel").on("change", function(e) {
      trsStr = e.target.value.toUpperCase();
      console.log(trsStr + "this is a city string");
      var searchQuery = trsStr.geometry;
      console.log(searchQuery + " This is the searchQuery");
      searchWidget.sources.items[0].filter.geometry = searchQuery;
      console.log(searchQuery);
      return trsStr;
    
  

    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Test Zoom to County/City Feature
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var townshipSelect = dom.byId("selectNGSCountyPanel");
var rangeSelect = dom.byId("selectNGSCityPanel");
var sectionSelect = dom.byId("selectNGSSectionPanel");


mapView.then(function() {
  return townshipRangeSectionLayer.then(function(response) {
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
console.error(error);
}

// Add the unique values to the subregion
// select element. This will allow the user
// to filter states by subregion.
function addToSelect(values) {
var option = domConstruct.create("option");
option.text = "Zoom to a Township";
townshipSelect.add(option);

values.features.forEach(function(value) {
  var option = domConstruct.create("option");
  var name  = value.attributes.twn_ch + value.attributes.tdir;
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

values.features.forEach(function(value) {
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
  
  values.features.forEach(function(value) {
    var option = domConstruct.create("option");
    option.text = value.attributes.sec_ch;
    sectionSelect.add(option);
  });
  }
/*
function setDefinitionExpression() {
var strregion = townshipSelect.options[townshipSelect.selectedIndex].value;
var strstate = rangeSelect.options[rangeSelect.selectedIndex].value;
var strsection = sectionSelect.options[sectionSelect.selectedIndex].value;

if (strregion != "" && strstate !== "" && strsection !== "") {
  townshipRangeSectionLayer.definitionExpression = "twn_ch = '" + strregion + "' AND rng_ch = '" + strstate + "' AND sec_ch = '" + strsection + "'";
} else if (strregion != "") {
  townshipRangeSectionLayer.definitionExpression = "twn_ch = '" + strregion + "'";
} else if (strstate !== "") {
  townshipRangeSectionLayer.definitionExpression = "rng_ch = '" + strstate + "'";
} else if (strsection !== "") {
  townshipRangeSectionLayer.definitionExpression = "sec_ch = '" + strsection + "'";
} 

if (!townshipRangeSectionLayer.visible) {
  townshipRangeSectionLayer.visible = true;
} 
} */

on(townshipSelect, "change", function(evt) {
var type = evt.target.value;
var i;
for (i = rangeSelect.options.length - 1; i >= 0; i--) {
  rangeSelect.remove(i);
}

 

var rangeQuery = new Query();
rangeQuery.where = "twn_ch = '" + type.substr(0,2) + "' AND tdir = '" + type.substr(2) + "'";
rangeQuery.outFields = ["rng_ch", "rdir"];
rangeQuery.returnDistinctValues = true;
rangeQuery.orderByFields = ["rng_ch", "rdir"];
return townshipRangeSectionLayer.queryFeatures(rangeQuery).then(addToSelect2);
//setDefinitionExpression();
})

on(rangeSelect, "change", function(evt) {
  var type = evt.target.value;  
  var j;
  for (j = sectionSelect.options.length - 1; j >= 0; j--) {
    sectionSelect.remove(j);
  }
  

  var e = document.getElementById("selectNGSCountyPanel");
  var strUser = e.options[e.selectedIndex].text;
  console.log(typeof(strUser));

  var selectQuery = new Query();
  selectQuery.where = "twn_ch = '" + strUser.substr(0,2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + type.substr(0,2) + "' AND rdir = '" + type.substr(2) + "' AND rng_ch <> ' '";
  selectQuery.outFields = ["sec_ch"];
  selectQuery.returnDistinctValues = true;
  selectQuery.orderByFields = ["sec_ch"];
  return townshipRangeSectionLayer.queryFeatures(selectQuery).then(addToSelect3);
  //setDefinitionExpression();



 });

function queryNGSPoints() {
  var labinsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/LABINS_2017_Pts_No_SWFMWD/MapServer"
  var queryTask = new QueryTask ({
    url: labinsURL + "/0"
  });
  var query = new Query();
  query.geometry = buffer;
  query.returnGeometry = true;
  query.spatialRelationship = "intersects";
  queryTask.execute(query).then(function displayResults(results) {
    console.log("executing display buffer");
    bufferLayer.removeAll();
    var features = results.features.map(function(graphic) {
      graphic.symbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        style: "diamond",
        size: 6.5,
        color: "darkorange"
      };
      return graphic;
    });
    var numQuakes = features.length;
    console.log(numQuakes + " points found");
    bufferLayer.addMany(features);
  });


  /*
  var query = swfwmdLayer.createQuery();
  var labinsNGS = swfwmdLayer
  query.geometry = buffer;
  query.spatialRelationship = "intersects";
  console.log(labinsNGS.queryFeatures(query));

  return labinsNGS.queryFeatures(query);
  */
}

//});
function zoomToSectionFeature(panelurl, location, attribute) {

  var township = document.getElementById("selectNGSCountyPanel");
  var strUser = township.options[township.selectedIndex].text;

  var range = document.getElementById("selectNGSCityPanel");
  var rangeUser = range.options[range.selectedIndex].text;

  var section = document.getElementById("selectNGSSectionPanel");
  var sectionUser = section.options[range.selectedIndex].text;


  var task = new QueryTask({
    url: panelurl
  });
  var params = new Query({
    where:  "twn_ch = '" + strUser.substr(0,2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + rangeUser.substr(0,2) + "' AND rdir = '" + rangeUser.substr(2) + "' AND sec_ch = '" + sectionUser + "'",
    returnDistinctValues: true
  });
  console.log(params.where);
  task.execute(params)
    .then(function(response) {
      console.log(response.features);
      mapView.goTo(response.features);
    });
}

  query("#selectNGSSectionPanel").on("change", function(e) {
    var type = e.target.value;
    return zoomToSectionFeature(townshipRangeSectionURL, type, "sec_ch");

  });

var polySym = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: [140, 140, 222, 0.5],
  outline: {
    color: [0, 0, 0, 0.5],
    width: 2
  }
};
var TRSSelect = dom.byId("selectTownshipPanel");

on(TRSSelect, "input", function(e) {
  var type =  e.target.value;

  var task = new QueryTask({
    url: townshipRangeSectionURL
  });

  var params = new Query({
    where: "trs = '" + type + "'",
    returnGeometry: true
  });
  task.execute(params)
  .then(function(response) {
    console.log(response.features["0"].geometry);
    console.log(response.features[0].geometry);
    console.log(response.features[0].geometry + " TRS response FEATURES");
    console.log(response.features["0"].geometry + " TRS response FEATURES");

    buffer = geometryEngine.geodesicBuffer(response.features[0].geometry, 100, "feet");
    
    console.log(typeof buffer);
    console.log("buffer completed");
    bufferLayer.add(new Graphic({
      geometry: buffer,
      symbol: polySym
    }))
    .then(queryNGSPoints)
    .then(console.log("I queried"))
    //.then(displayResults)
    .then(console.log("I displayed results")); 
  });
});

/*
on(TRSSelect, "input", function(e) {
  var type =  e.target.value;

  var task = new QueryTask({
    url: panelurl + "2"
  });

  var params = new Query({
    where: "trs = '" + type + "'",
    returnGeometry: true
  });
  task.execute(params)
  .then(function(response) {
    console.log(response.features["0"].geometry);
    console.log(response.features[0].geometry);
    console.log(response.features[0].geometry + " TRS response FEATURES");
    console.log(response.features["0"].geometry + " TRS response FEATURES");
    var params = new BufferParameters({
      distances: [500],
      unit: "feet",
      geodesic: true,
      geometries: geometries,
      unionResults: false
    });
    buffer = geometryEngine.geodesicBuffer(response.features["0"].geometry, 100, "feet", false);
    
    console.log(typeof buffer);
    console.log("buffer completed");
    bufferLayer.add(new Graphic({
      geometry: buffer,
      symbol: polySym
    }));
    
  });
});*/
});
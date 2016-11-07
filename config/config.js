
define(['underscore','i18n'], function(_, i18n) {

var workspace = "forestry",
    geoserverUrl= "http://fenix.fao.org:20900/geoserver/"+workspace+"/wms";
    //geoserverUrl= "http://fenix.fao.org/geoserver29/"+workspace+"/wms";

var groups = {
        'vc': [
            'tree',
            'shrub',
            'palm',
            'bamboo',
            'crop'
        ],
        'lu': [
            'wetland',
            'forestland',
            'otherland',
            'cropland',
            'settlement',
            'grassland'
        ],
        'fc': [
            'otherwoodedland',
            'otherland',
            'forest',
            'inlandwaterbodies',
            'otherlandwtreecover',
            'unknown'
        ]
    };
/*
"Positron": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
"Dark matter": "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
"Positron (lite)": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
"Dark matter (lite)": "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
"CartoDB World Antique": "https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png",
"CartoDB World Eco": "https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png",
"CartoDB World Flat Blue": "https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png",
"CartoDB World Midnight Commander": "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png",
*/
return {
    baselayer: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    panel: {

        overlay: {
            title: "Land Use Categories",
            layers: _.map(groups, function(layers, groupName) {
                return {
                    group: groupName,
                    collapsed: true,
                    layers: _.map(layers, function(layerName, i) {
                        return {
                            active: true,
                            name: layerName,
                            layer: {
                                type: "tileLayer.wms",
                                args: [ geoserverUrl, {
                                        styles: groupName+'_'+layerName,
                                        layers: workspace+':'+groupName+'_'+layerName,
                                        format: "image/png",
                                        transparent: true,
                                        opacity: 0.6
                                    }
                                ]
                            }
                        };
                    })
                };
            })
        },

        rawdata: {
            title: "Raw Data",
            layers: [
                {
                    name: "points",
                    layer: {
                        type: "tileLayer.wms",
                        args: [ geoserverUrl, {
                                styles: "global_land_trend_all",
                                layers: workspace+':'+'global_land_trend',
                                format: "image/png",
                                transparent: true
                            }
                        ]
                    }
                }
                //TODO border of polygons
                /*,{
                    name: "borders",
                    layer: {
                        type: "tileLayer.wms",
                        args: [ geoserverUrl, {
                                styles: "global_land_trend_all",
                                layers: workspace+':'+'global_land_trend',
                                format: "image/png",
                                transparent: true
                            }
                        ]
                    }
                }*/
            ]
        },

        base: {
            title: 'Base Layers',
            layers: [
                {
                    name: "Tree Cover 2000",
                    layer: {
                        type: "tileLayer",
                        args: [
                            "http://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_30_2014/{z}/{x}/{y}.png", {
                                attribution: "<a href='http://earthenginepartners.appspot.com/science-2013-global-forest'>Tree Cover (2000-2014, Hansen/UMD/Google/USGS/NASA)</a>",
                                maxZoom: 12
                            }
                        ]
                    }
                },
                {
                    name: "Land Cover 2009",
                    layer: {
                        type: "tileLayer",
                        args: [
                            "https://s3.amazonaws.com/wri-tiles/global-landcover/{z}/{x}/{y}.png", {
                                attribution: "<a href='http://earthenginepartners.appspot.com/science-2013-global-forest'>Maps land cover distribution globally</a>",
                                maxZoom: 12
                            }
                        ]
                    }
                }
            ]
        }

    }
};

});
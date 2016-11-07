
define([
    'underscore',
    'handlebars',
    'i18n!nls/panel',
    'text!src/html/popup.html'
], function(_, Handlebars, i18n, popupTmpl) {

window.I18N = i18n;

console.log('i18n', i18n);

var workspace = "forestry",
    geoserverUrl= "http://fenix.fao.org:20900/geoserver/"+workspace+"/wms";
    //geoserverUrl= "http://fenix.fao.org/geoserver29/"+workspace+"/wms";

//TODO var PopupTmpl = Handlebars(popupTmpl);
var PopupTmpl = function(data) {
    return _.compact(_.map(data, function(v, k) {
        if(v && !_.isNumber(v) && !_.isBoolean(v) && _.isString(v) && v!=='na')
            return '<em>'+k+':</em> '+v;
    })).join('<br>');
};

var groups = {
        'vc': [
            'tree',
            'shrub',
            'palm',
            'bamboo',
            'crop',
        ],
        'lu': [
            'otherland',
            'cropland',
            'forestland',
            'grassland',
            'wetland',
            'settlement'
        ],
        'fc': [
            'otherland',        
            'otherwoodedland',    
            'forest',
            'inlandwaterbodies',
            'otherlandwtreecover',
            'unknown'
        ]
    };

return {
    baselayer: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        //"Positron": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        //"Dark matter": "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        //"Positron (lite)": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        //"Dark matter (lite)": "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        //"CartoDB World Antique": "https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png",
        //"CartoDB World Eco": "https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png",
        //"CartoDB World Flat Blue": "https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png",
        //"CartoDB World Midnight Commander": "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png",
    panel: {

        categories: {
            title: i18n.panel_categories,
            layers: _.map(groups, function(layers, groupName) {
                return {
                    collapsed: false,
                    group: i18n[ groupName ],
                    layers: _.map(layers, function(layerName, i) {
                        return {
                            active: false,//!!i,
                            name: i18n[ groupName+'_'+layerName ],
                            layer: {
                                //type: "tileLayer.wms",
                                type: "tileLayer.betterWms",
                                args: [ geoserverUrl, {
                                        styles: groupName+'_'+layerName,
                                        layers: workspace+':'+groupName+'_'+layerName,
                                        format: "image/png8",
                                        transparent: true,
                                        opacity: 0.8,
                                        zIndex: 1000+i,
                                        formatPopup: function(data) {
                                            return PopupTmpl(data);
                                        }
                                    }
                                ]
                            }
                        };
                    })
                };
            })
        },

        rawlayers: {
            title: i18n.panel_rawlayers,
            layers: [
                {
                    name: i18n.panel_rawpoints,
                    layer: {
                        type: "tileLayer.wms",
                        args: [ geoserverUrl, {
                                styles: "global_land_trend_all",
                                layers: workspace+':'+'global_land_trend',
                                format: "image/png",
                                transparent: true,
                                zIndex: 10000
                            }
                        ]
                    }
                },
                {
                    name: i18n.panel_rawpolygons,
                    layer: {
                        type: "tileLayer.wms",
                        args: [ geoserverUrl, {
                                styles: "all_borders",
                                layers: workspace+':all',
                                format: "image/png",
                                transparent: true,
                                opacity: 0.6,
                                zIndex: 20000
                            }
                        ]
                    }
                }
            ]
        },

        otherlayers: {
            title: i18n.panel_otherlayers,
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
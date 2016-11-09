define(['underscore','handlebars','i18n!nls/panels','text!src/html/popup.html'
], function(_, Handlebars, i18n, popupTmpl) {

var workspace = "forestry",
    geoserverUrl = "http://fenix.fao.org/geoserver29/ows";

//TODO replace with: var PopupTmpl = Handlebars(popupTmpl);
var PopupTmpl = function(data) {
    return _.compact(_.map(data, function(v, k) {
        if(v && !_.isNumber(v) && !_.isBoolean(v) && _.isString(v) && v!=='na')
            return '<em>'+k+':</em> '+v;
    })).join('<br>');
};

//LAYERS CATEGORIES
var groups = {
        'vc': [
            'tree',
            'shrub',
            'palm',
            'bamboo',
            'crop',
        ],
        'lu': [
            'cropland',
            'forestland',
            'grassland',
            'wetland',
            'settlement',
            'otherland',            
        ],
        'fc': [
            'forest',
            'inlandwaterbodies',
            'otherlandwtreecover',
            'unknown',
            'otherland',  
            'otherwoodedland',            
        ]
    };

return {
    categories: {
        title: i18n['panel_categories'],
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
                            type: "tileLayer.betterWms",    //with GetCapabilities
                            args: [ geoserverUrl, {
                                    styles: groupName+'_'+layerName,
                                    layers: workspace+':'+groupName+'_'+layerName,
                                    format: "image/png8",
                                    transparent: true,
                                    opacity: 0.8,
                                    zIndex: 100+i,
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


    baselayers: {
        layers: [
            {
                group: i18n['panel_baselayers'],
                collapsed: false,
                collapsibleGroups: true,
                layers: [
                    {
                        active: true,
                        name: "CartoDB Positron",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                            ]
                        }
                    },
                    {
                        name: "CartoDB Dark matter",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
                            ]
                        }
                    }
                    //"Positron": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                    //"Dark matter": "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                    //"Positron (lite)": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                    //"Dark matter (lite)": "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
                    //"CartoDB World Antique": "https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png",
                    //"CartoDB World Eco": "https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png",
                    //"CartoDB World Flat Blue": "https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png",
                    //"CartoDB World Midnight Commander": "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png",            
                ]
            }
        ]
    },

    rawlayers: {
        layers: [
            {
                group: i18n['panel_rawlayers'],
                collapsed: true,
                layers: [
                    {
                        name: i18n['panel_rawpoints'],
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
                        name: i18n['panel_rawpolygons'],
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
            }
        ]
    }
};

});
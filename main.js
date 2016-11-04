
var map = L.map('map', {
		center: L.latLng([42.4918,12.4992]),
        layers: L.tileLayer(baseLayer),
        attributionControl: false,
        minZoom: 4,
        maxZoom: 8,
        zoom: 4
	})
    .on('zoomend', function() {
        console.log('zoom', this.getZoom() );
    });

var over3 = L.control.panelLayers(null, panel.overlay.layers, {
    title: panel.overlay.title,
    position: 'topright',
    compact: true
}).addTo(map);

var over1 = L.control.panelLayers(null, panel.base.layers, {
    title: panel.base.title,
    position: 'bottomright',
    compact: true
}).addTo(map);




const campground = require("../../models/campground");


mapboxgl.accessToken = 'pk.eyJ1Ijoic2VpbmRlNCIsImEiOiJja2sxYnRwd2MwcHZrMnZ0N2lsNTQxNjR5In0.q9Xo3nuubKOSXN464BowWg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: campground.geometry.coordinates,
zoom: 9
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${campground.title}</h3>`
            )
    )
    .addTo(map)
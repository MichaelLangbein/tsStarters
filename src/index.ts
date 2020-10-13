import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import 'ol/ol.css';


fetch('./data/buildings.geojson').then((response: Response) => {
    response.json().then(data => {
        const dataLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(data)
            })
        });

        map.addLayer(dataLayer);
    });
});


const anchor = document.getElementById('map') as HTMLDivElement;


const bgLayer = new TileLayer({
    source: new OSM()
});

const view = new View({
    projection: 'EPSG:4326',
    center: [15, 52],
    zoom: 6
});

const map = new Map({
    layers: [bgLayer],
    target: anchor,
    view: view
});
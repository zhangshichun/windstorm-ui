<template>
  <div ref="mapEl" class="map"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/turf'
const mapEl = ref(null)
const initOption = {
  zoom: 5,
  center: [
    113.07569050750635,
    30.841719769976834
  ],
  style: {
    "version": 8,
    "id": "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
    "sources": {},
    "light": {
      "anchor": "map",
      "color": "red",
      "intensity": 1
    },
    "layers": [
    ],
    "glyphs": "/fonts/mapbox/{fontstack}/{range}.pbf" // 这行没有啥用，是为了hack字体无法显示的bug
  },
}

const fetchGeoJSON = async (areaCode) => {
  const response = await fetch(`https://pic.zhangshichun.top/geojson/merged/${areaCode}.json`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.json()
}
let map;
const emptyGeoJSON = { "type": "FeatureCollection", "features": [] }

const fitBounds = (feature, options = {}) => {
  const bboxResult = turf.bbox(feature);
  const [a, b, c, d] = bboxResult;
  map?.fitBounds(
    [
      [a, b],
      [c, d],
    ],
    options,
  );
}

const loadArea = async (code) => {
  const geoJSON = await fetchGeoJSON(code)
  map?.getSource('bound-source').setData(geoJSON)
  fitBounds(geoJSON)
  map?.setFilter('areas-name', ['==', 'parentCode', Number(code)]);
}

onMounted(async () => {
  map = new maplibregl.Map({
    container: mapEl.value,
    ...initOption,
  });
  map.on('style.load', async () => {
    map.addSource('bound-source', {
      type: 'geojson',
      data: emptyGeoJSON
    })
    map.addLayer({
      id: 'areas-surface',
      type: 'fill',
      source: 'bound-source',
      layout: {},
      paint: {
        'fill-color': '#0357aa',
        'fill-opacity': 1,
      },
    })
    map.addLayer({
      id: 'areas-surface-hight',
      type: 'fill',
      source: 'bound-source',
      layout: {},
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 1,
      },
      filter: ['==', 'adcode', '']
    })
    map.addLayer({
      id: 'areas-line',
      type: 'line',
      source: 'bound-source',
      paint: {
        'line-color': 'red',
        'line-width': 2
      }
    })
    map.on('click', 'areas-surface', (e) => {
      const feature = e.features?.[0];
      const code = feature?.properties?.adcode;
      loadArea(code)
    })
    map.on('mousemove', 'areas-surface', (e) => {
      const feature = e.features?.[0];
      const code = feature?.properties?.adcode;
      map?.setFilter('areas-surface-hight', ['==', 'adcode', Number(code)]);
    })
    loadArea(420000)
    const areaNames = await fetchGeoJSON('420000-area-names')
    map.addSource('names-source', {
      type: 'geojson',
      data: areaNames
    })
    map.addLayer({
      id: 'areas-name',
      source: 'names-source',
      "type": "symbol",
      "layout": {
        "text-field": '{name}',
        "text-size": 8,
      },
      "paint": {
        "text-color": "black",
        "text-halo-color": "rgba(0, 0, 0, 0)"
      },
      filter: ['==', 'parentCode', 420000]
    })
  })

})
</script>
<style lang="scss" scoped>
.map {
  width: 600px;
  height: 300px;
  background-color: #fff;
}
</style>
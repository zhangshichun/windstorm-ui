<template>
  <div ref="mapEl" class="map"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
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

onMounted(async () => {
  const map = new maplibregl.Map({
    container: mapEl.value,
    ...initOption,
  });
  const hubeiGeoJSON = await fetchGeoJSON(420000)
  map.addSource('bound-source', {
    type: 'geojson',
    data: hubeiGeoJSON
  })
  map.addLayer({
    id: 'areas-line',
    type: 'line',
    source: 'bound-source',
    paint: {
      'line-color': '#fff',
      'line-width': 2
    }
  })
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
      "text-color": "white",
      "text-halo-color": "rgba(0, 0, 0, 0)"
    },
    filter: ['==', 'parentCode', 420000]
  })
})
</script>
<style lang="scss" scoped>
.map {
  width: 600px;
  height: 300px;
}
</style>
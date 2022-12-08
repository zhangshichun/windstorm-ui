<template>
  <div ref="mapEl" class="map"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
const MY_KEY = '88f3c1aa7e87a1daa0176fe655a92030';
const mapEl = ref(null)
const initOption = {
  style: {
    "version": 8,
    "id": "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
    "sources": {
      "tdt-vec": {
        "type": "raster",
        "tiles": [`https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${MY_KEY}`],
        "tileSize": 256
      },
      "tdt-cva": {
        "type": "raster",
        "tiles": [`https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${MY_KEY}`],
        "tileSize": 256
      }
    },
    "light": {
      "anchor": "map",
      "color": "red",
      "intensity": 1
    },
    "layers": [
      {
        "id": "tdt-tiles-layer",
        "type": "raster",
        "source": "tdt-vec",
        "paint": {
          // "raster-brightness-max": 0.7,
          // "raster-brightness-min": 0.3,
          "raster-hue-rotate": 60,
          "raster-saturation": 0
        }
      },
      {
        "id": "tdt-cva-layer",
        "type": "raster",
        "source": "tdt-cva",
      },
    ]
  },
}


onMounted(() => {
  const map = new maplibregl.Map({
    container: mapEl.value,
    ...initOption,
  });
})
</script>
<style lang="scss" scoped>
.map {
  width: 600px;
  height: 300px;
}
</style>
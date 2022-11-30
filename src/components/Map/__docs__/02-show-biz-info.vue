<template>
  <div ref="mapEl" class="map"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import maplibregl from 'maplibre-gl'
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
    ],
    "glyphs": "/fonts/mapbox/{fontstack}/{range}.pbf"
  },
  center: [114.3057884883687, 30.611937378651888],
  zoom: 10,
  pitch: 45
}

const geojsonArea = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              114.46779835239658,
              30.605050523900303
            ],
            [
              114.45307942925189,
              30.624907272879312
            ],
            [
              114.4288130916147,
              30.622168652698548
            ],
            [
              114.41379951994367,
              30.6195846480625
            ],
            [
              114.38794195122841,
              30.608629101366674
            ],
            [
              114.3696757009294,
              30.57943525080438
            ],
            [
              114.41528335032035,
              30.543669137007882
            ],
            [
              114.44153872673763,
              30.53852985669873
            ],
            [
              114.4773415169152,
              30.54366913640706
            ],
            [
              114.4837064566533,
              30.560113005443625
            ],
            [
              114.47376123831367,
              30.58922552097347
            ],
            [
              114.46819191604362,
              30.606004058021256
            ],
            [
              114.46780928809392,
              30.60501608234722
            ],
            [
              114.46779835239658,
              30.605050523900303
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              114.4607075938116,
              30.466500864153844
            ],
            [
              114.37963045409833,
              30.478344631182154
            ],
            [
              114.31710486256651,
              30.46353969699203
            ],
            [
              114.38621826607522,
              30.372908950433754
            ],
            [
              114.47966309031347,
              30.370537758256432
            ],
            [
              114.46236452860569,
              30.44663194215289
            ],
            [
              114.46080027152675,
              30.46637744345206
            ],
            [
              114.46065225645935,
              30.46637744345206
            ],
            [
              114.4607075938116,
              30.466500864153844
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}

const images = {
  zhuren: 'https://pic.zhangshichun.top/pic/20221129-12.png',
  bao: 'https://pic.zhangshichun.top/pic/20221129-10.png',
  nan: 'https://pic.zhangshichun.top/pic/20221129-11.png'
}

const boys = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "德育处主任",
        "icon": "zhuren"
      },
      "geometry": {
        "coordinates": [
          114.34495622042738,
          30.51879704948628
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "战场小包",
        "icon": "bao"
      },
      "geometry": {
        "coordinates": [
          114.46248908403493,
          30.52385942598788
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "南方者",
        "icon": "nan"
      },
      "geometry": {
        "coordinates": [
          114.4188340204089,
          30.481906063384173
        ],
        "type": "Point"
      }
    }
  ]
}

onMounted(() => {
  const map = new maplibregl.Map({
    container: mapEl.value,
    ...initOption,
  });

  const loadImages = async (imgs) => {
    await Promise.all(
      Object.entries(imgs).map(
        ([key, url]) =>
          new Promise((resolve) => {
            map.loadImage(url, (error, res) => {
              if (error) throw error;
              map.addImage(key, res);
              resolve(res);
            });
          }),
      ),
    );
  };
  map.on('style.load', async () => {
    map.addSource('geojson-area-source', {
      type: 'geojson',
      data: geojsonArea
    })

    map.addLayer({
      id: 'geojson-area-layer',
      type: 'fill',
      source: 'geojson-area-source',
      layout: {},
      paint: {
        'fill-color': 'red',
        'fill-opacity': 0.5,
      },
    })
    // 加载图片
    await loadImages(images)
    // 添加位置资源
    map.addSource('boys-source', {
      type: 'geojson',
      data: boys
    })
    // 添加ICON图层
    map.addLayer({
      id: 'boys-icon-layer',
      type: 'symbol',
      source: 'boys-source',
      layout: {
        'icon-image': '{icon}',
        'icon-size': 0.2,
        'icon-anchor': 'center',
        'icon-rotation-alignment': 'viewport',
        'icon-allow-overlap': true
      }
    })
    // 添加名字图层
    map.addLayer({
      id: 'boys-name-layer',
      "type": "symbol",
      source: 'boys-source',
      "layout": {
        "text-field": '{name}',
        "text-size": 14,
        'text-offset': [0, 2.4], // 名字要设置便宜，避免被头像挡住
        'text-allow-overlap': true
      },
      "paint": {
        "text-color": "white",
      },
    })
  })
})
</script>
<style lang="scss" scoped>
.map {
  width: 600px;
  height: 300px;
}
</style>
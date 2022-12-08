const fs = require('fs-extra');
const path = require('path')
const config = require('./configs.js')
const _ = require('lodash');
const { set } = require('lodash');

const readOriginJson = async (code) => {
  const filePath = path.resolve(config.ORIGIN_GEOJSON_DIR, `${code}.json`)
  return fs.readJSON(filePath)
}

const readJsons = async (codes) => {
  const tasks = codes.map(t => readOriginJson(t))
  const jsons = await Promise.all(tasks)
  return jsons;
}

const getAllFeatures = (jsons) => {
  const features = []
  jsons.forEach((json) => {
    const feature = _.get(json, 'features.0')
    const acroutes = _.get(feature, 'properties.acroutes')
    set(feature, 'properties.deep', acroutes.length)
    features.push(feature)
    // const parentCode = _.get(feature, 'properties.parent.adcode')
    // if (!codes.includes(parentCode)) {
    //   rootNodes.push(feature)
    //   return
    // }
    // const parentJson = jsons.find(t => _.get(t,'features.0.properties.adcode') == parentCode)
    // const parentNode = _.get(parentJson, 'features.0')
    // const parentChildren = _.get(parentNode, 'children') ?? []
    // parentChildren.push(feature)
    // _.set(parentNode, 'children', parentChildren)
    // return;
  })
  return features;
}

const genChildrenMap = (features) => {
  const map = {}
  features.forEach(feature => {
    const adcode = _.get(feature, 'properties.adcode')
    const parentCode = _.get(feature, 'properties.parent.adcode')
    if (!features.some(t => _.get(t, 'properties.adcode') == parentCode)) {
      return
    }
    const parentChildren = _.get(map, parentCode) ?? []
    parentChildren.push(adcode)
    _.set(map, parentCode, parentChildren)
  })
  return map;
}

const outputMergedJsons = async (childrenMap, allFeatures) => {
  await fs.remove(config.MERGED_GEOJSON_DIR)
  await fs.ensureDir(config.MERGED_GEOJSON_DIR)
  const tasksWithChildren = Object.keys(childrenMap).map(key => {
    const childrenCodes = childrenMap[key]
    const feature = allFeatures.find(t => _.get(t, 'properties.adcode') == key)
    const features = childrenCodes.map(code => allFeatures.find(t => _.get(t, 'properties.adcode') == code))
    const geojson = {"type":"FeatureCollection", features, properties: feature.properties}
    const filePath = path.resolve(config.MERGED_GEOJSON_DIR, `${key}.json`)
    return fs.writeJSON(filePath, geojson)
  })
  await Promise.all(tasksWithChildren)

  const tasksWithoutChildren = allFeatures.filter(t => !childrenMap[_.get(t, 'properties.adcode')])
  .map(t => {
    const code = _.get(t, 'properties.adcode')
    const filePath = path.resolve(config.MERGED_GEOJSON_DIR, `${code}.json`)

    return fs.writeJSON(filePath, t)
  })
  await Promise.all(tasksWithoutChildren)
}

const genAreaNames = (allFeatures) => {
  const features = allFeatures.map(feature => {
    const areaCode = _.get(feature, 'properties.adcode')
    const center = _.get(feature, 'properties.centroid') || _.get(feature, 'properties.center')
    const name = _.get(feature, 'properties.name')
    const parentCode = _.get(feature, 'properties.parent.adcode')
    const deep = _.get(feature, 'properties.deep')
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: center
      },
      properties: {
        name,
        areaCode,
        deep,
        parentCode
      }
    }
  })
  return {
    "type": "FeatureCollection",
    "features": features
  }
}

const outputAreaNames = async (areaNames) => {
  const filePath = path.resolve(config.MERGED_GEOJSON_DIR, 'area-names.json')
  return fs.writeJSON(filePath, areaNames)
}

const outputCodePropertiesMap = async (allFeatures) => {
  const codePropertiesMap = allFeatures.reduce((pre, feature) => {
    const code = _.get(feature, 'properties.adcode')
    const properties = _.get(feature, 'properties')
    return {
      ...pre,
      [code]: properties
    }
  }, {})
  const filePath = path.resolve(config.MERGED_GEOJSON_DIR, 'code-properties.json')
  return fs.writeJSON(filePath, codePropertiesMap)
}

const begin = async () => {
  const jsons = await readJsons(config.codes)
  const allFeatures = getAllFeatures(jsons)
  const childrenMap = genChildrenMap(allFeatures)
  await outputMergedJsons(childrenMap, allFeatures)
  const areaNames = genAreaNames(allFeatures)
  await outputAreaNames(areaNames)
  await outputCodePropertiesMap(allFeatures)
}

begin()
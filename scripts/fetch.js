const axios = require('axios');
const fs = require('fs-extra');
const path = require('path')
const config = require('./configs.js')


const getGeojson = async (code) => {
  const res = await axios.get(`https://geo.datav.aliyun.com/areas_v3/bound/${code}.json`)
  return res.data
}

const writeGeojson = async (code, geojson) => {
  const fileName = `${code}.json`
  const filePath = path.resolve(config.ORIGIN_GEOJSON_DIR, fileName)
  await fs.writeJSON(filePath, geojson)
}


const begin = async () => {
  await fs.remove(config.ORIGIN_GEOJSON_DIR)
  await fs.ensureDir(config.ORIGIN_GEOJSON_DIR)
  const tasks = config.codes.map(t => getGeojson(t))
  const jsons = await Promise.all(tasks)
  const writeTasks = jsons.map((json, index) => writeGeojson(config.codes[index], json))
  await Promise.all(writeTasks)
}

begin()

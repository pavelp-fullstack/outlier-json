const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const dataPath = path.join(__dirname, 'data')

module.exports = {
  clean,
  get,
  put,
  del
}

if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true })

function dataFilePath (student) {
  return path.join(dataPath, student + '.json')
}

function clean (student) {
  const fp = dataFilePath(student)
  if (fs.existsSync(fp)) fs.unlinkSync(fp)
}

function get (student, prop) {
  const fp = dataFilePath(student)
  if (!fs.existsSync(fp)) return null

  const data = JSON.parse(fs.readFileSync(fp, { encoding: 'utf8' }))
  return _.get(data, prop)
}

function put (student, prop, value) {
  const fp = dataFilePath(student)
  let data = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, { encoding: 'utf8' })) : {}
  data = _.set(data, prop, value)
  fs.writeFileSync(fp, JSON.stringify(data), { encoding: 'utf8' })
}

function del (student, prop) {
  const fp = dataFilePath(student)
  if (!fs.existsSync(fp)) return false

  const data = JSON.parse(fs.readFileSync(fp, { encoding: 'utf8' }))
  const value = _.get(data, prop)
  if (value === null || value === undefined) return false
  _.unset(data, prop)
  fs.writeFileSync(fp, JSON.stringify(data), { encoding: 'utf8' })
  return true
}

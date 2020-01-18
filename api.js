const messages = require('./messages')
const db = require('./db')

module.exports = {
  getHealth,
  putProp,
  getProp,
  deleteProp
}

function decodeParams (req) {
  const student = req.params.student.replace(/[\\/:*?"<>|]/g, '_') // filter out invalid symbols
  const prop = req.params[0] ? req.params[0].replace(/\//g, '.') : ''
  const value = req.headers['content-type'] === 'application/x-www-form-urlencoded'
    ? JSON.parse(Object.keys(req.body)[0])
    : req.body
  return { student, prop, value }
}

function putProp (req, res, next) {
  const { student, prop, value } = decodeParams(req)
  db.put(student, prop, value)
  res.json(messages.success)
}

function getProp (req, res, next) {
  const { student, prop, value } = decodeParams(req)
  const data = db.get(student, prop, value)
  data ? res.json(data) : res.status(404).json(messages.notFound)
}

function deleteProp (req, res, next) {
  const { student, prop, value } = decodeParams(req)
  db.del(student, prop, value)
    ? res.json(messages.success)
    : res.status(404).json(messages.notFound)
}

async function getHealth (req, res, next) {
  res.json(messages.success)
}

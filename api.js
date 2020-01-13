const messages = require('./messages')
const db = require('./db')

module.exports = {
  getHealth,
  putProp,
  getProp,
  deleteProp
}

function decodeParams (req) {
  const student = req.params.student
  const prop = req.params[0].replace(/\//g, '.')
  const value = req.body
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
  data ? res.json(data) : res.json(messages.notFound)
}

function deleteProp (req, res, next) {
  const { student, prop, value } = decodeParams(req)
  db.del(student, prop, value)
    ? res.json(messages.success)
    : res.json(messages.notFound)
}

async function getHealth (req, res, next) {
  res.json(messages.success)
}

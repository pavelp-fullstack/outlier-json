const tape = require('tape')
const jsonist = require('jsonist')

const db = require('./db')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const student = 'rn1abu8'
const prop = 'courses/calculus/quizzes/ye0ab61'
const value = { score: 98 }
const testurl = endpoint + '/' + student + '/' + prop

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('PUT property', t => {
  db.clean(student)
  jsonist.put(testurl, value, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should return success on updating property')
    t.end()
  })
})

// tape('DELETE existing property', t => {
//   db.clean(student)
//   jsonist.get(testurl, (err, body) => {
//     if (err) t.error(err)
//     t.ok(body.success, 'should return success on deleting existing property')
//     t.end()
//   })
// })

// tape('DELETE missing property', t => {
//   db.clean(student)
//   jsonist.get(testurl, (err, body) => {
//     if (err) t.error(err)
//     t.notEquals(body.error, undefined, 'should return error on deleting missing property')
//     t.end()
//   })
// })

// tape('GET existing property', t => {
//   db.clean(student)
//   jsonist.get(testurl, (err, body) => {
//     if (err) t.error(err)
//     t.equals(JSON.stringify(body), JSON.stringify(value), 'should return valid property')
//     t.end()
//   })
// })

// tape('GET missing property', t => {
//   db.clean(student)
//   jsonist.get(testurl, (err, body) => {
//     if (err) t.error(err)
//     t.notEquals(body.error, undefined, 'should return error for missing property')
//     t.equals(body.error, 'Not Found', 'should return \'Not Found\' error')
//     t.end()
//   })
// })

tape('cleanup', function (t) {
  db.clean(student)
  server.close()
  t.end()
})

const tape = require('tape')
const jsonist = require('jsonist')

const messages = require('./messages')
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

tape('DELETE existing property', t => {
  db.clean(student)
  jsonist.put(testurl, value, (err, body) => {
    if (err) t.error(err)

    jsonist.delete(testurl, (err, body) => {
      if (err) t.error(err)
      t.ok(body.success, 'should return success')
      t.end()
    })
  })
})

tape('Delete empty data file', t => {
  db.clean(student)
  jsonist.put(testurl, value, (err, body) => {
    if (err) t.error(err)

    const url = endpoint + '/' + student + '/courses'

    jsonist.delete(url, (err, body) => {
      if (err) t.error(err)
      // t.ok(body.success, 'should return success')
      const fileExists = db.fileExists(student)
      t.equals(fileExists, false)
      t.end()
    })
  })
})

tape('DELETE missing property', t => {
  db.clean(student)
  jsonist.get(testurl, (err, body, resp) => {
    if (err) t.error(err)
    t.equals(resp.statusCode, 404)
    t.equals(
      JSON.stringify(body),
      JSON.stringify(messages.notFound),
      'should return \'Not Found\' error'
    )
    t.end()
  })
})

tape('GET whole file if <student>/ is passed', t => {
  db.clean(student)
  jsonist.put(testurl, value, (err, body) => {
    if (err) t.error(err)

    const studentRoot = endpoint + '/' + student

    jsonist.get(studentRoot, (err, body) => {
      if (err) t.error(err)
      t.ok(body.courses.calculus.quizzes.ye0ab61.score, 'should return complete prop hierarchy')
      t.end()
    })
  })
})

tape('GET existing property', t => {
  db.clean(student)
  jsonist.put(testurl, value, (err, body) => {
    if (err) t.error(err)

    jsonist.get(testurl, (err, body) => {
      if (err) t.error(err)
      t.equals(
        JSON.stringify(body),
        JSON.stringify(value),
        'should return the valid prop'
      )
      t.end()
    })
  })
})

tape('GET missing property', t => {
  db.clean(student)
  jsonist.get(testurl, (err, body, resp) => {
    if (err) t.error(err)
    t.equals(resp.statusCode, 404)
    t.equals(
      JSON.stringify(body),
      JSON.stringify(messages.notFound),
      'should return \'Not Found\' error'
    )
    t.end()
  })
})

tape('cleanup', function (t) {
  db.clean(student)
  server.close()
  t.end()
})

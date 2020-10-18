const db = require('../../../db')
exports.getPoints = function(user) {
  const points = db.defaults({
    [user]: 0
  }).get(user).value()
  return points
}
exports.addPoints = function(user, extraPoints) {
  const points = exports.getPoints(user)
  db.set(user, points + extraPoints).write()
}

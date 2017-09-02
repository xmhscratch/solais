module.exports = {
    '/': {
        GET: function(req, res, next) {
            res.json({ hello: 'world' })
        }
    }
}

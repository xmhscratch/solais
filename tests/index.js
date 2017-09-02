const system = global.system = new (require('../'))

system.install([
    require('../modules/server')
])

system.once('ready', () => {
    server.setup()
    server.start()
})

module.exports = system.bootstrap()

if (global.gc) {
    global.gc() & setInterval(function() {
        return global.gc()
    }, 1800000)
}

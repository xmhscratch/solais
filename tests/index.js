const system = global.system = new (require('../'))

system.once('ready', () => {
    server.start()
})

system.install([
    require('../modules/server')
]).then(() => {
    system.bootstrap()
})

if (global.gc) {
    global.gc() & setInterval(function() {
        return global.gc()
    }, 1800000)
}

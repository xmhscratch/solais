const system = global.system = new (require('./src'))
const server = global.server = system.install(
    require('./modules/server')
)

system.once('ready', () => {
    server.setup()
    server.start()
})

system.bootstrap()

global._ = require('lodash')
global.fs = require('flatory')
global.async = require('async')
global.Promise = require('bluebird')
global.request = require('request')

global.node = require('./node')

const Dcfg = require('dcfg')

class System extends node.events {

    static get Module() {
        return require('./module')
    }

    constructor() {
        super()
    }

    bootstrap(options = {}) {
        _.defaults(options, {
            dbs: [],
            baseDir: null,
            evalName: 'config',
            store: null
        })

        return Promise.promisify((options, done) => {
            global.$dcfg = new Dcfg(options, done)
        })(options)
            .then((values) => {
                global.config = (keyPath, defaultValue) => {
                    return _.get(values, keyPath, defaultValue)
                }
            })
            .catch((error) => {
                this.emit('error', error)
            })
    }

    install(installers = []) {
        return Promise.mapSeries(installers, (installer) => {
            if (!installer) {
                throw new Error("installer not found")
            }

            if (!installer.$ID) {
                throw new Error("installer not found")
            }

            const varName = _.camelCase(installer.$ID)
            const className = _.upperFirst(varName)
            _.set(System, className, installer)

            const module = installer.setup(
                installer, _.tail(arguments)
            )
            return module
        })
        .then((modules) => Promise.mapSeries(modules, (module) => {
            return Promise
                .promisify(module.initialize)
                .apply(module, [])
        }))
        .then((modules) => this.emit('ready', modules))
        .catch((error) => this.emit('error', error))
    }
}

module.exports = global.System = System

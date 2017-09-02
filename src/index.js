global._ = require('lodash')
global.__ = require('flatory')
global.async = require('async')
global.Promise = require('bluebird')
global.request = require('request')

global.node = require('./node')

const Dcfg = require('dcfg')

class System extends node.events {

    constructor() {
        super()
        return this
    }

    install(installers = []) {
        return _.map(installers, (installer) => {
            if (!installer) {
                return this.emit('error', new Error("installer not found"))
            }

            if (!installer.$ID) {
                return this.emit('error', new Error("installer not found"))
            }

            const instModule = installer.setup(
                installer, _.tail(arguments)
            )
            this[`\$${installer.$ID}`] = installer

            if (!instModule) {
                return this.emit('error', new Error("module installation interupted"))
            }

            this[installer.$ID] = instModule
            return instModule
        })
    }

    bootstrap(options = {}) {
        _.defaults(options, {
            dbs: [],
            baseDir: null,
            evalName: 'config',
            store: null
        })

        this.dcfg = new Dcfg(options, (error, values) => {
            global.config = (keyPath, defaultValue) => {
                return _.get(values, keyPath, defaultValue)
            }

            return setImmediate(() => {
                this.emit('ready')
            })
        })

        return this
    }

    get module() {
        return require('./module')
    }
}

module.exports = System

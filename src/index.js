global._ = require('lodash')
global.__ = require('flatory')
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
        return this
    }

    bootstrap(options = {}) {
        _.defaults(options, {
            dbs: [],
            baseDir: null,
            evalName: 'config',
            store: null
        })

        return new Promise((resolve, reject) => {
            this.dcfg = new Dcfg(
                options, (error, values) => {
                    if (error) {
                        return reject(error)
                    }

                    global.config = (keyPath, defaultValue) => {
                        return _.get(values, keyPath, defaultValue)
                    }

                    return resolve(values)
                }
            )
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

            const module = installer.setup(
                installer, _.tail(arguments)
            )
            const varName = _.camelCase(installer.$ID)
            const className = _.upperFirst(varName)

            this[`\$${varName}`] = installer

            if (!module) {
                throw new Error("module installation interupted")
            }

            System[className] = module
            return module
        })
        .then(() => {
            this.emit('ready')
        })
        .catch((error) => {
            this.emit('error', error)
        })
    }
}

module.exports = global.System = System

class Module {

    constructor() {
        return new Promise((resolve, reject) => {
            return this.initialize((error, results) => {
                if (error) {
                    return reject(error)
                } else {
                    return resolve(results)
                }
            })
        })
    }

    initialize(done) {
        return done()
    }

    static setup(moduleInst, params) {
        if(_.isEmpty(moduleInst.$ID)) {
            return false
        }

        return new (
            Function.prototype.bind.apply(moduleInst, params)
        )
    }
}

module.exports = Module

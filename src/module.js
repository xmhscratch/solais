class Module {

    constructor() {
        this.initialize()
        return this
    }

    initialize() {}

    static setup(moduleInst, params) {
        if(_.isEmpty(moduleInst.$ID)) {
            return false;
        }
        return new (Function.prototype.bind.apply(moduleInst, params))
    }
}

module.exports = Module

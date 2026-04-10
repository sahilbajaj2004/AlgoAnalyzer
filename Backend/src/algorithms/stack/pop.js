const throwValidation = require('../validationError')

const getStackPopSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.stack))                        throwValidation('stack must be an array')
    if (input.stack.some(v => typeof v !== 'number'))       throwValidation('stack must contain only numbers')

    const { stack } = input
    const steps = []
    const arr = [...stack]

    // init
    steps.push({
        step_number: steps.length + 1,
        action: 'idle',
        state: { stack: [...arr], top: arr.length - 1, popping: null, popped: null }
    })

    // underflow check
    if (arr.length === 0) {
        steps.push({
            step_number: steps.length + 1,
            action: 'underflow',
            state: { stack: [], top: -1, popping: null, popped: null }
        })
        return steps
    }

    // highlight top element about to be popped
    steps.push({
        step_number: steps.length + 1,
        action: 'pop',
        state: { stack: [...arr], top: arr.length - 1, popping: arr[arr.length - 1], popped: null }
    })

    // actually pop
    const popped = arr.pop()

    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: { stack: [...arr], top: arr.length - 1, popping: null, popped }
    })

    return steps
}

module.exports = { getStackPopSteps }
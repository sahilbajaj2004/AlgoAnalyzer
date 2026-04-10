const throwValidation = require('../validationError')

const getStackPeekSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.stack))                        throwValidation('stack must be an array')
    if (input.stack.some(v => typeof v !== 'number'))       throwValidation('stack must contain only numbers')

    const { stack } = input
    const steps = []
    const arr = [...stack]

    // idle
    steps.push({
        step_number: steps.length + 1,
        action: 'idle',
        state: { stack: [...arr], top: arr.length - 1, peeking: null }
    })

    // underflow
    if (arr.length === 0) {
        steps.push({
            step_number: steps.length + 1,
            action: 'underflow',
            state: { stack: [], top: -1, peeking: null }
        })
        return steps
    }

    // peek
    steps.push({
        step_number: steps.length + 1,
        action: 'peek',
        state: { stack: [...arr], top: arr.length - 1, peeking: arr[arr.length - 1] }
    })

    // done
    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: { stack: [...arr], top: arr.length - 1, peeking: arr[arr.length - 1] }
    })

    return steps
}

module.exports = { getStackPeekSteps }
const throwValidation = require('../validationError')

const getStackIsEmptySteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.stack))                        throwValidation('stack must be an array')
    if (input.stack.some(v => typeof v !== 'number'))       throwValidation('stack must contain only numbers')

    const { stack } = input
    const steps = []
    const arr = [...stack]

    // idle — show current stack state
    steps.push({
        step_number: steps.length + 1,
        action: 'idle',
        state: { stack: [...arr], top: arr.length - 1, peeking: null }
    })

    if (arr.length === 0) {
        // stack IS empty
        steps.push({
            step_number: steps.length + 1,
            action: 'underflow',
            state: { stack: [], top: -1, peeking: null }
        })

        steps.push({
            step_number: steps.length + 1,
            action: 'done',
            state: { stack: [], top: -1, peeking: null, isEmpty: true }
        })
    } else {
        // stack is NOT empty — peek at top to show it's populated
        steps.push({
            step_number: steps.length + 1,
            action: 'peek',
            state: { stack: [...arr], top: arr.length - 1, peeking: arr[arr.length - 1] }
        })

        steps.push({
            step_number: steps.length + 1,
            action: 'done',
            state: { stack: [...arr], top: arr.length - 1, peeking: arr[arr.length - 1], isEmpty: false }
        })
    }

    return steps
}

module.exports = { getStackIsEmptySteps }

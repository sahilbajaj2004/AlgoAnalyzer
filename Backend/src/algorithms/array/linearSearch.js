const throwValidation = require('../validationError')

const getLinearSearchSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.array))                        throwValidation('array must be an array')
    if (typeof input.target !== 'number')                   throwValidation('target must be a number')
    if (input.array.length === 0)                           throwValidation('Array cannot be empty')
    if (input.array.length > 20)                            throwValidation('Max 20 elements allowed')
    if (input.array.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (input.array.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const { array, target } = input
    const arr = [...array]
    const steps = []

    // init
    steps.push({
        step_number: steps.length + 1,
        action: 'init',
        state: { array: [...arr], current: null, target, found: null, visited: [] }
    })

    for (let i = 0; i < arr.length; i++) {

        // checking current index
        steps.push({
            step_number: steps.length + 1,
            action: 'check',
            state: { array: [...arr], current: i, target, found: null, visited: [...Array(i).keys()] }
        })

        if (arr[i] === target) {
            steps.push({
                step_number: steps.length + 1,
                action: 'found',
                state: { array: [...arr], current: i, target, found: i, visited: [...Array(i).keys()] }
            })
            return steps
        }

        // not this one — mark visited
        steps.push({
            step_number: steps.length + 1,
            action: 'skip',
            state: { array: [...arr], current: null, target, found: null, visited: [...Array(i + 1).keys()] }
        })
    }

    // not found
    steps.push({
        step_number: steps.length + 1,
        action: 'notFound',
        state: { array: [...arr], current: null, target, found: -1, visited: [...Array(arr.length).keys()] }
    })

    return steps
}

module.exports = { getLinearSearchSteps }
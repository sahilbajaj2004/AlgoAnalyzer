const throwValidation = require('../validationError')

const getBinarySearchSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.array))                        throwValidation('array must be an array')
    if (typeof input.target !== 'number')                   throwValidation('target must be a number')
    if (input.array.length === 0)                           throwValidation('Array cannot be empty')
    if (input.array.length > 20)                            throwValidation('Max 20 elements allowed')
    if (input.array.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (input.array.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const { array, target } = input
    const arr = [...array].sort((a, b) => a - b) // binary search needs sorted array
    const steps = []

    let left = 0
    let right = arr.length - 1

    // init
    steps.push({
        step_number: steps.length + 1,
        action: 'init',
        state: { array: [...arr], left, right, mid: null, target, found: null }
    })

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2)

        // check mid
        steps.push({
            step_number: steps.length + 1,
            action: 'mid',
            state: { array: [...arr], left, right, mid, target, found: null }
        })

        if (arr[mid] === target) {
            steps.push({
                step_number: steps.length + 1,
                action: 'found',
                state: { array: [...arr], left, right, mid, target, found: mid }
            })
            return steps
        } else if (arr[mid] < target) {
            steps.push({
                step_number: steps.length + 1,
                action: 'goRight',
                state: { array: [...arr], left, right, mid, target, found: null }
            })
            left = mid + 1
        } else {
            steps.push({
                step_number: steps.length + 1,
                action: 'goLeft',
                state: { array: [...arr], left, right, mid, target, found: null }
            })
            right = mid - 1
        }
    }

    // not found
    steps.push({
        step_number: steps.length + 1,
        action: 'notFound',
        state: { array: [...arr], left, right, mid: null, target, found: -1 }
    })

    return steps
}

module.exports = { getBinarySearchSteps }
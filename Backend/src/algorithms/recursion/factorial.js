const throwValidation = require('../validationError')

/**
 * Factorial — visualizes the recursive call stack for factorial(n).
 * Input: { value: number }
 */
const getFactorialSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    if (typeof input.value !== 'number')                throwValidation('value must be a number')
    if (!Number.isInteger(input.value) || input.value < 0) throwValidation('value must be a non-negative integer')
    if (input.value > 12)                               throwValidation('Max value is 12')

    const { value } = input
    const steps = []
    const callStack = []

    const snapshot = (action, extra = {}) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                callStack: callStack.map(f => ({ ...f })),
                inputValue: value,
                ...extra,
            }
        })
    }

    // Init
    snapshot('init')

    // Recursive descent
    const factorial = (n) => {
        callStack.push({ fn: `factorial(${n})`, arg: n, result: null, active: true })
        snapshot('call', { depth: callStack.length, arg: n })

        if (n <= 1) {
            callStack[callStack.length - 1].result = 1
            callStack[callStack.length - 1].active = false
            snapshot('baseCase', { depth: callStack.length, result: 1 })
            callStack.pop()
            return 1
        }

        const sub = factorial(n - 1)
        const result = n * sub

        // Update current frame result
        const frame = callStack[callStack.length - 1]
        frame.result = result
        frame.active = false
        snapshot('return', { depth: callStack.length, result, expression: `${n} × ${sub} = ${result}` })
        callStack.pop()
        return result
    }

    const finalResult = factorial(value)
    snapshot('done', { finalResult })

    return steps
}

module.exports = { getFactorialSteps }

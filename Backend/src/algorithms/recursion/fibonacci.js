const throwValidation = require('../validationError')

/**
 * Fibonacci — visualizes the recursive call stack for fib(n).
 * Input: { value: number }
 */
const getFibonacciSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    if (typeof input.value !== 'number')                throwValidation('value must be a number')
    if (!Number.isInteger(input.value) || input.value < 0) throwValidation('value must be a non-negative integer')
    if (input.value > 10)                               throwValidation('Max value is 10 (tree gets large)')

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

    snapshot('init')

    const fib = (n) => {
        callStack.push({ fn: `fib(${n})`, arg: n, result: null, active: true })
        snapshot('call', { depth: callStack.length, arg: n })

        if (n <= 1) {
            callStack[callStack.length - 1].result = n
            callStack[callStack.length - 1].active = false
            snapshot('baseCase', { depth: callStack.length, result: n })
            callStack.pop()
            return n
        }

        const left = fib(n - 1)
        const right = fib(n - 2)
        const result = left + right

        const frame = callStack[callStack.length - 1]
        frame.result = result
        frame.active = false
        snapshot('return', { depth: callStack.length, result, expression: `fib(${n-1}) + fib(${n-2}) = ${left} + ${right} = ${result}` })
        callStack.pop()
        return result
    }

    const finalResult = fib(value)
    snapshot('done', { finalResult })

    return steps
}

module.exports = { getFibonacciSteps }

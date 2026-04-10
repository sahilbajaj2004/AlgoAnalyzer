const throwValidation = require('../validationError')

const getLLInsertTailSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.nodes))                        throwValidation('nodes must be an array')
    if (typeof input.value !== 'number')                    throwValidation('value must be a number')
    if (input.nodes.length > 10)                            throwValidation('Max 10 nodes allowed')
    if (input.nodes.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (input.nodes.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const { nodes, value } = input
    const steps = []
    const arr = [...nodes]

    // init
    steps.push({
        step_number: steps.length + 1,
        action: 'init',
        state: { nodes: [...arr], newNode: null, current: 0, tail: null }
    })

    // create new node
    steps.push({
        step_number: steps.length + 1,
        action: 'createNode',
        state: { nodes: [...arr], newNode: value, current: 0, tail: null }
    })

    // traverse to tail
    for (let i = 0; i < arr.length - 1; i++) {
        steps.push({
            step_number: steps.length + 1,
            action: 'traverse',
            state: { nodes: [...arr], newNode: value, current: i, tail: null }
        })
    }

    // reached tail
    steps.push({
        step_number: steps.length + 1,
        action: 'reachedTail',
        state: { nodes: [...arr], newNode: value, current: arr.length - 1, tail: arr.length - 1 }
    })

    // link tail.next = newNode
    arr.push(value)
    steps.push({
        step_number: steps.length + 1,
        action: 'linkTail',
        state: { nodes: [...arr], newNode: value, current: arr.length - 2, tail: arr.length - 2 }
    })

    // done
    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: { nodes: [...arr], newNode: null, current: arr.length - 1, tail: arr.length - 1 }
    })

    return steps
}

module.exports = { getLLInsertTailSteps }
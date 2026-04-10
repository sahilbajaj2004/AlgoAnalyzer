const throwValidation = require('../validationError')

const getLLInsertHeadSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.nodes))                        throwValidation('nodes must be an array')
    if (typeof input.value !== 'number')                    throwValidation('value must be a number')
    if (input.nodes.length > 10)                            throwValidation('Max 10 nodes allowed')
    if (input.nodes.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (input.nodes.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const { nodes, value } = input
    const steps = []
    const arr = [...nodes]

    // show initial list
    steps.push({
        step_number: steps.length + 1,
        action: 'init',
        state: { nodes: [...arr], newNode: null, head: 0 }
    })

    // create new node
    steps.push({
        step_number: steps.length + 1,
        action: 'createNode',
        state: { nodes: [...arr], newNode: value, head: 0 }
    })

    // newNode.next = head
    steps.push({
        step_number: steps.length + 1,
        action: 'linkNext',
        state: { nodes: [...arr], newNode: value, head: 0 }
    })

    // head = newNode
    arr.unshift(value)
    steps.push({
        step_number: steps.length + 1,
        action: 'updateHead',
        state: { nodes: [...arr], newNode: value, head: 0 }
    })

    // done
    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: { nodes: [...arr], newNode: null, head: 0 }
    })

    return steps
}

module.exports = { getLLInsertHeadSteps }
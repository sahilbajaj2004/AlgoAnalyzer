const throwValidation = require('../validationError')

const getLLDeleteNodeSteps = (input) => {
    if (!input || typeof input !== 'object')                throwValidation('Input must be an object')
    if (!Array.isArray(input.nodes))                        throwValidation('nodes must be an array')
    if (typeof input.value !== 'number')                    throwValidation('value must be a number')
    if (input.nodes.length === 0)                           throwValidation('List cannot be empty')
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
        state: { nodes: [...arr], current: 0, prev: null, target: value, deleted: null }
    })

    let prevIdx = null

    for (let i = 0; i < arr.length; i++) {

        // check current node
        steps.push({
            step_number: steps.length + 1,
            action: 'check',
            state: { nodes: [...arr], current: i, prev: prevIdx, target: value, deleted: null }
        })

        if (arr[i] === value) {
            // found — delete it
            steps.push({
                step_number: steps.length + 1,
                action: 'found',
                state: { nodes: [...arr], current: i, prev: prevIdx, target: value, deleted: i }
            })

            arr.splice(i, 1)

            steps.push({
                step_number: steps.length + 1,
                action: 'done',
                state: { nodes: [...arr], current: null, prev: null, target: value, deleted: null }
            })

            return steps
        }

        // move forward
        steps.push({
            step_number: steps.length + 1,
            action: 'move',
            state: { nodes: [...arr], current: i, prev: prevIdx, target: value, deleted: null }
        })

        prevIdx = i
    }

    // not found
    steps.push({
        step_number: steps.length + 1,
        action: 'notFound',
        state: { nodes: [...arr], current: null, prev: null, target: value, deleted: null }
    })

    return steps
}

module.exports = { getLLDeleteNodeSteps }
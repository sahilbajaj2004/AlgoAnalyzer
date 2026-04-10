const throwValidation = require('../validationError')

const getLLTraversalSteps = (input) => {
    if (!Array.isArray(input))                          throwValidation('Input must be an array')
    if (input.length === 0)                             throwValidation('List cannot be empty')
    if (input.length > 10)                              throwValidation('Max 10 nodes allowed')
    if (input.some(v => typeof v !== 'number'))         throwValidation('Only numbers allowed')
    if (input.some(v => !Number.isFinite(v)))           throwValidation('No Infinity or NaN allowed')

    const steps = []
    const nodes = [...input]

    // Step 1 — show initial list
    steps.push({
        step_number: steps.length + 1,
        action: 'init',
        state: { nodes, current: null, visited: [] }
    })

    // Step 2 — temp = head
    steps.push({
        step_number: steps.length + 1,
        action: 'start',
        state: { nodes, current: 0, visited: [] }
    })

    const visited = []

    // Step 3+ — traverse each node
    for (let i = 0; i < nodes.length; i++) {
        // visit current node
        steps.push({
            step_number: steps.length + 1,
            action: 'visit',
            state: { nodes, current: i, visited: [...visited] }
        })

        visited.push(i)

        // move to next
        if (i < nodes.length - 1) {
            steps.push({
                step_number: steps.length + 1,
                action: 'move',
                state: { nodes, current: i + 1, visited: [...visited] }
            })
        }
    }

    // temp = null — end of list
    steps.push({
        step_number: steps.length + 1,
        action: 'null',
        state: { nodes, current: null, visited: [...visited] }
    })

    // done
    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: { nodes, current: null, visited: [...visited] }
    })

    return steps
}

module.exports = { getLLTraversalSteps }
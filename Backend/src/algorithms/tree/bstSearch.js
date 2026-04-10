const throwValidation = require('../validationError')

/**
 * BST Search — step-by-step search for a target value in a BST.
 * Input: { values: number[], target: number }
 */
const getBSTSearchSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    if (!Array.isArray(input.values))                   throwValidation('values must be an array')
    if (typeof input.target !== 'number')               throwValidation('target must be a number')
    if (input.values.length === 0)                      throwValidation('Array cannot be empty')
    if (input.values.length > 15)                       throwValidation('Max 15 values allowed')
    if (input.values.some(v => typeof v !== 'number'))   throwValidation('Only numbers allowed')

    const { values, target } = input

    // Build BST from values
    const tree = []
    const insertNode = (val) => {
        if (tree.length === 0) {
            tree.push({ value: val, left: null, right: null })
            return
        }
        let idx = 0
        while (true) {
            if (val < tree[idx].value) {
                if (tree[idx].left === null) {
                    tree[idx].left = tree.length
                    tree.push({ value: val, left: null, right: null })
                    return
                }
                idx = tree[idx].left
            } else if (val > tree[idx].value) {
                if (tree[idx].right === null) {
                    tree[idx].right = tree.length
                    tree.push({ value: val, left: null, right: null })
                    return
                }
                idx = tree[idx].right
            } else return // duplicate
        }
    }
    values.forEach(insertNode)

    const steps = []
    const snapshot = (action, current, highlight, path, found = null) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                tree: tree.map(n => ({ ...n })),
                target,
                current,
                highlight,
                path: [...path],
                found,
            }
        })
    }

    // Init
    snapshot('init', null, [], [], null)

    // Search
    let nodeIdx = 0
    const path = []

    while (nodeIdx !== null && nodeIdx < tree.length) {
        path.push(nodeIdx)
        snapshot('compare', nodeIdx, path, path, null)

        if (target === tree[nodeIdx].value) {
            snapshot('found', nodeIdx, path, path, nodeIdx)
            return steps
        } else if (target < tree[nodeIdx].value) {
            snapshot('goLeft', nodeIdx, path, path, null)
            nodeIdx = tree[nodeIdx].left
        } else {
            snapshot('goRight', nodeIdx, path, path, null)
            nodeIdx = tree[nodeIdx].right
        }
    }

    // Not found
    snapshot('notFound', null, path, path, -1)
    return steps
}

module.exports = { getBSTSearchSteps }

const throwValidation = require('../validationError')

/**
 * BST Insert — generates step-by-step visualization of inserting a value into a BST.
 * Input: { values: number[] }   — values[0] is root, rest are inserted one by one
 *    OR  { tree: number[], value: number } — existing tree + value to insert
 */
const getBSTInsertSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    
    let values
    if (Array.isArray(input.values)) {
        values = input.values
    } else if (Array.isArray(input.tree) && typeof input.value === 'number') {
        values = [...input.tree, input.value]
    } else {
        throwValidation('Provide { values: [numbers] } or { tree: [numbers], value: number }')
    }

    if (values.length === 0)                            throwValidation('Array cannot be empty')
    if (values.length > 15)                             throwValidation('Max 15 values allowed')
    if (values.some(v => typeof v !== 'number'))         throwValidation('Only numbers allowed')
    if (values.some(v => !Number.isFinite(v)))           throwValidation('No Infinity or NaN allowed')

    // Internal tree structure: array of { value, left, right } (indices or null)
    const tree = []
    const steps = []

    const snapshot = (action, current = null, highlight = [], newNode = null, path = []) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                tree: tree.map(n => ({ ...n })),
                current,
                highlight,
                newNode,
                path: [...path],
            }
        })
    }

    // Insert first value as root
    tree.push({ value: values[0], left: null, right: null })
    snapshot('init', 0, [0], null, [])

    // Insert remaining values
    for (let i = 1; i < values.length; i++) {
        const val = values[i]
        let nodeIdx = 0
        const path = []

        snapshot('insertStart', null, [], val, [])

        while (true) {
            path.push(nodeIdx)

            // Compare with current node
            snapshot('compare', nodeIdx, path, val, path)

            if (val < tree[nodeIdx].value) {
                // Go left
                if (tree[nodeIdx].left === null) {
                    // Insert here
                    const newIdx = tree.length
                    tree.push({ value: val, left: null, right: null })
                    tree[nodeIdx].left = newIdx
                    path.push(newIdx)
                    snapshot('insertLeft', newIdx, path, null, path)
                    break
                } else {
                    snapshot('goLeft', nodeIdx, path, val, path)
                    nodeIdx = tree[nodeIdx].left
                }
            } else if (val > tree[nodeIdx].value) {
                // Go right
                if (tree[nodeIdx].right === null) {
                    const newIdx = tree.length
                    tree.push({ value: val, left: null, right: null })
                    tree[nodeIdx].right = newIdx
                    path.push(newIdx)
                    snapshot('insertRight', newIdx, path, null, path)
                    break
                } else {
                    snapshot('goRight', nodeIdx, path, val, path)
                    nodeIdx = tree[nodeIdx].right
                }
            } else {
                // Duplicate
                snapshot('duplicate', nodeIdx, path, null, path)
                break
            }
        }
    }

    // Done
    snapshot('done', null, tree.map((_, i) => i), null, [])

    return steps
}

module.exports = { getBSTInsertSteps }

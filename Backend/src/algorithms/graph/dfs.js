const throwValidation = require('../validationError')

/**
 * DFS — Depth-First Search on an adjacency list graph.
 * Input: { nodes: string[], edges: [number,number][], start: number }
 */
const getDFSSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    if (!Array.isArray(input.nodes))                    throwValidation('nodes must be an array')
    if (!Array.isArray(input.edges))                    throwValidation('edges must be an array')
    if (typeof input.start !== 'number')                throwValidation('start must be a number')
    if (input.nodes.length === 0)                       throwValidation('Graph cannot be empty')
    if (input.nodes.length > 12)                        throwValidation('Max 12 nodes allowed')

    const { nodes, edges, start } = input

    // Build adjacency list
    const adj = Array.from({ length: nodes.length }, () => [])
    edges.forEach(([u, v]) => {
        if (u >= 0 && u < nodes.length && v >= 0 && v < nodes.length) {
            adj[u].push(v)
            adj[v].push(u)
        }
    })

    const steps = []
    const visited = new Set()
    const stack = [start]
    const visitOrder = []

    const snapshot = (action, current, stackState, extra = {}) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                nodes: [...nodes],
                edges: edges.map(e => [...e]),
                visited: [...visited],
                stack: [...stackState],
                current,
                visitOrder: [...visitOrder],
                ...extra,
            }
        })
    }

    // Init
    snapshot('init', null, stack)

    while (stack.length > 0) {
        const current = stack.pop()
        snapshot('pop', current, stack)

        if (visited.has(current)) {
            snapshot('alreadyVisited', current, stack)
            continue
        }

        visited.add(current)
        visitOrder.push(current)
        snapshot('visit', current, stack)

        // Push neighbors in reverse order so smallest is processed first
        const neighbors = adj[current].sort((a, b) => b - a)
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor)
                snapshot('push', current, stack, { neighbor })
            }
        }
    }

    snapshot('done', null, [], { visitOrder: [...visitOrder] })
    return steps
}

module.exports = { getDFSSteps }

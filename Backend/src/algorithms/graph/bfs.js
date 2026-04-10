const throwValidation = require('../validationError')

/**
 * BFS — Breadth-First Search on an adjacency list graph.
 * Input: { nodes: string[], edges: [number,number][], start: number }
 */
const getBFSSteps = (input) => {
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
    const queue = [start]
    const visitOrder = []

    const snapshot = (action, current, queueState, extra = {}) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                nodes: [...nodes],
                edges: edges.map(e => [...e]),
                visited: [...visited],
                queue: [...queueState],
                current,
                visitOrder: [...visitOrder],
                ...extra,
            }
        })
    }

    // Init
    snapshot('init', null, queue)
    visited.add(start)

    while (queue.length > 0) {
        const current = queue.shift()
        visitOrder.push(current)
        snapshot('visit', current, queue)

        const neighbors = adj[current].sort((a, b) => a - b)
        for (const neighbor of neighbors) {
            snapshot('checkNeighbor', current, queue, { neighbor })
            if (!visited.has(neighbor)) {
                visited.add(neighbor)
                queue.push(neighbor)
                snapshot('enqueue', current, queue, { neighbor })
            } else {
                snapshot('alreadyVisited', current, queue, { neighbor })
            }
        }
    }

    snapshot('done', null, [], { visitOrder: [...visitOrder] })
    return steps
}

module.exports = { getBFSSteps }

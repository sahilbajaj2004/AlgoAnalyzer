const throwValidation = require('../validationError')

/**
 * Dijkstra's Shortest Path — weighted graph.
 * Input: { nodes: string[], edges: [number,number,number][], start: number }
 *        edges are [from, to, weight]
 */
const getDijkstraSteps = (input) => {
    if (!input || typeof input !== 'object')            throwValidation('Input must be an object')
    if (!Array.isArray(input.nodes))                    throwValidation('nodes must be an array')
    if (!Array.isArray(input.edges))                    throwValidation('edges must be an array')
    if (typeof input.start !== 'number')                throwValidation('start must be a number')
    if (input.nodes.length === 0)                       throwValidation('Graph cannot be empty')
    if (input.nodes.length > 10)                        throwValidation('Max 10 nodes allowed')

    const { nodes, edges, start } = input
    const n = nodes.length

    // Build adjacency list with weights
    const adj = Array.from({ length: n }, () => [])
    edges.forEach(([u, v, w]) => {
        if (u >= 0 && u < n && v >= 0 && v < n && typeof w === 'number') {
            adj[u].push({ to: v, weight: w })
            adj[v].push({ to: u, weight: w })
        }
    })

    const steps = []
    const dist = Array(n).fill(Infinity)
    const visited = new Set()
    const prev = Array(n).fill(null)
    dist[start] = 0

    const snapshot = (action, current, extra = {}) => {
        steps.push({
            step_number: steps.length + 1,
            action,
            state: {
                nodes: [...nodes],
                edges: edges.map(e => [...e]),
                distances: [...dist],
                visited: [...visited],
                previous: [...prev],
                current,
                ...extra,
            }
        })
    }

    // Init
    snapshot('init', null)

    for (let iter = 0; iter < n; iter++) {
        // Find unvisited node with minimum distance
        let minDist = Infinity
        let u = -1
        for (let i = 0; i < n; i++) {
            if (!visited.has(i) && dist[i] < minDist) {
                minDist = dist[i]
                u = i
            }
        }

        if (u === -1) break // all remaining nodes unreachable

        snapshot('selectMin', u, { minDist })
        visited.add(u)
        snapshot('visit', u)

        // Relax neighbors
        for (const { to, weight } of adj[u]) {
            if (visited.has(to)) continue

            const newDist = dist[u] + weight
            snapshot('checkEdge', u, { neighbor: to, edgeWeight: weight, newDist, oldDist: dist[to] })

            if (newDist < dist[to]) {
                dist[to] = newDist
                prev[to] = u
                snapshot('relax', u, { neighbor: to, newDist })
            } else {
                snapshot('noImprovement', u, { neighbor: to, newDist, oldDist: dist[to] })
            }
        }
    }

    snapshot('done', null, { finalDistances: [...dist] })
    return steps
}

module.exports = { getDijkstraSteps }

const { getBubbleSortSteps } = require('../src/algorithms/array/bubbleSort');
const { getLLTraversalSteps } = require('../src/algorithms/linkedList/traversal');

describe('Algorithm Step Generators', () => {

    describe('Array Algorithms - Bubble Sort', () => {
        it('should throw validation error on empty array', () => {
            expect(() => getBubbleSortSteps([])).toThrow('Array cannot be empty');
        });

        it('should correctly generate steps for [5, 1, 4]', () => {
            const steps = getBubbleSortSteps([5, 1, 4]);

            // Ensure steps are an array and not empty
            expect(Array.isArray(steps)).toBe(true);
            expect(steps.length).toBeGreaterThan(0);

            // Last step action should be 'done' and sorted should be all elements
            const lastStep = steps[steps.length - 1];
            expect(lastStep.action).toBe('done');
            expect(lastStep.state.sorted.length).toBe(3);
            
            // The array should be completely sorted
            expect(lastStep.state.array).toEqual([1, 4, 5]);
        });
    });

    describe('Linked List Algorithms - LL Traversal', () => {
        it('should throw validation error on invalid input', () => {
            expect(() => getLLTraversalSteps(null)).toThrow('Input must be an array');
        });

        it('should correctly visit each node in the list [10, 20]', () => {
            const steps = getLLTraversalSteps([10, 20]);
            
            expect(Array.isArray(steps)).toBe(true);
            // Expected steps: init, start, visit(10), move(20), visit(20), null, done => 7 steps
            expect(steps.length).toBe(7);

            const lastStep = steps[steps.length - 1];
            expect(lastStep.action).toBe('done');
            expect(lastStep.state.current).toBe(null);
            
            // Should have visited both indices 0 and 1
            expect(lastStep.state.visited).toEqual([0, 1]);
        });
    });
});

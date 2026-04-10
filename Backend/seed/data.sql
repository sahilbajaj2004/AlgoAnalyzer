-- ============================================
-- SEED DATA - ALGORITHMS
-- ============================================
INSERT INTO algorithms 
    (name, slug, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index)
VALUES
-- Arrays - Sorting
('Bubble Sort',    'bubble-sort',    'array', 'sorting',   'Repeatedly swaps adjacent elements if they are in wrong order.',                          'O(n)',   'O(n²)',     'O(n²)',    'O(1)',  true,  1),
('Selection Sort', 'selection-sort', 'array', 'sorting',   'Finds the minimum element and places it at the beginning each pass.',                     'O(n²)',  'O(n²)',     'O(n²)',    'O(1)',  false, 2),
('Insertion Sort', 'insertion-sort', 'array', 'sorting',   'Builds sorted array one element at a time by inserting into correct position.',           'O(n)',   'O(n²)',     'O(n²)',    'O(1)',  true,  3),
-- Arrays - Searching
('Binary Search',  'binary-search',  'array', 'searching', 'Searches sorted array by repeatedly halving the search interval.',                        'O(1)',   'O(log n)',  'O(log n)', 'O(1)',  NULL,  4),
('Linear Search',  'linear-search',  'array', 'searching', 'Sequentially checks each element until match is found.',                                  'O(1)',   'O(n)',      'O(n)',     'O(1)',  NULL,  5),
-- Stack
('Stack Push',     'stack-push',     'stack', 'operation', 'Pushes an element onto the top of the stack.',                                            'O(1)',   'O(1)',      'O(1)',     'O(n)',  NULL,  6),
('Stack Pop',      'stack-pop',      'stack', 'operation', 'Removes and returns the top element of the stack.',                                       'O(1)',   'O(1)',      'O(1)',     'O(1)',  NULL,  7),
('Stack Peek',     'stack-peek',     'stack', 'operation', 'Returns the top element without removing it.',                                            'O(1)',   'O(1)',      'O(1)',     'O(1)',  NULL,  8),
('isEmpty Check',  'stack-isempty',  'stack', 'operation', 'Checks whether the stack has no elements.',                                               'O(1)',   'O(1)',      'O(1)',     'O(1)',  NULL,  9),
-- Linked List
('LL Insert Head', 'll-insert-head', 'linked_list', 'operation', 'Inserts a new node at the beginning of the linked list.',                           'O(1)',   'O(1)',      'O(1)',     'O(1)',  NULL,  10),
('LL Insert Tail', 'll-insert-tail', 'linked_list', 'operation', 'Inserts a new node at the end of the linked list.',                                 'O(n)',   'O(n)',      'O(n)',     'O(1)',  NULL,  11),
('LL Delete Node', 'll-delete-node', 'linked_list', 'operation', 'Removes a node with a given value from the linked list.',                           'O(1)',   'O(n)',      'O(n)',     'O(1)',  NULL,  12),
('LL Traversal',   'll-traversal',   'linked_list', 'operation', 'Visits each node in the list sequentially from head to tail.',                      'O(n)',   'O(n)',      'O(n)',     'O(1)',  NULL,  13),
-- Trees
('BST Insert',     'bst-insert',     'tree', 'operation',  'Inserts a value into a Binary Search Tree maintaining BST property.',                  'O(log n)', 'O(log n)', 'O(n)',    'O(n)',  NULL,  14),
('BST Search',     'bst-search',     'tree', 'searching',  'Searches for a target value in a Binary Search Tree.',                                 'O(1)',     'O(log n)', 'O(n)',    'O(1)',  NULL,  15),
-- Graphs
('BFS',            'graph-bfs',      'graph', 'traversal', 'Explores all vertices level by level using a queue.',                                  'O(V+E)',   'O(V+E)',   'O(V+E)',  'O(V)',  NULL,  16),
('DFS',            'graph-dfs',      'graph', 'traversal', 'Explores as deep as possible along each branch before backtracking.',                  'O(V+E)',   'O(V+E)',   'O(V+E)',  'O(V)',  NULL,  17),
('Dijkstra',       'graph-dijkstra', 'graph', 'shortest_path', 'Finds shortest paths from a source to all vertices in a weighted graph.',          'O(V²)',    'O(V²)',    'O(V²)',   'O(V)',  NULL,  18),
-- Recursion
('Factorial',      'recursion-factorial', 'recursion', 'classic', 'Computes n! using recursive calls — a classic example of linear recursion.',    'O(n)',     'O(n)',     'O(n)',    'O(n)',  NULL,  19),
('Fibonacci',      'recursion-fibonacci', 'recursion', 'classic', 'Computes the nth Fibonacci number — demonstrates exponential recursive branching.', 'O(2ⁿ)', 'O(2ⁿ)',   'O(2ⁿ)',   'O(n)',  NULL,  20);

-- ============================================
-- BUBBLE SORT - Java Code
-- ============================================
INSERT INTO algorithm_codes (algorithm_id, language, code, highlight_map)
VALUES (
  1,
  'java',
  'void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        for (int j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
}',
  '{"compare": [3, 4], "swap": [5, 6, 7]}'
);

-- ============================================
-- BUBBLE SORT - C++ Code
-- ============================================
INSERT INTO algorithm_codes (algorithm_id, language, code, highlight_map)
VALUES (
  1,
  'cpp',
  'void bubbleSort(vector<int>& arr) {
    for (int i = 0; i < arr.size() - 1; i++) {
        for (int j = 0; j < arr.size() - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
}',
  '{"compare": [3, 4], "swap": [5, 6, 7]}'
);
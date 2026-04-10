CREATE DATABASE algo_analyzer;

-- ============================================
-- ALGORITHM ANALYZER v1 - DATABASE SCHEMA
-- ============================================

-- 1. ALGORITHMS TABLE
-- Stores metadata and complexity for each algorithm
CREATE TABLE algorithms (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,  -- e.g. "bubble-sort"
    category        VARCHAR(50) NOT NULL,           -- 'array' | 'stack' | 'linked_list'
    subcategory     VARCHAR(50),                    -- 'sorting' | 'searching' | 'operation'
    description     TEXT NOT NULL,
    time_best       VARCHAR(20) NOT NULL,           -- e.g. "O(n)"
    time_avg        VARCHAR(20) NOT NULL,           -- e.g. "O(n²)"
    time_worst      VARCHAR(20) NOT NULL,           -- e.g. "O(n²)"
    space_complexity VARCHAR(20) NOT NULL,          -- e.g. "O(1)"
    is_stable       BOOLEAN DEFAULT NULL,           -- only relevant for sorting
    order_index     INT,                            -- controls display order in UI
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 2. ALGORITHM CODES TABLE
-- Stores Java and C++ implementations
CREATE TABLE algorithm_codes (
    id              SERIAL PRIMARY KEY,
    algorithm_id    INT NOT NULL REFERENCES algorithms(id) ON DELETE CASCADE,
    language        VARCHAR(20) NOT NULL,           -- 'java' | 'cpp'
    code            TEXT NOT NULL,                  -- full implementation
    highlight_map   JSONB,                          
    -- maps step_number → line numbers to highlight
    -- e.g. { "0": [3,4], "1": [5], "2": [6,7] }
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(algorithm_id, language)
);

-- 3. DEFAULT STEPS TABLE
-- Pre-seeded steps for demo/default visualization
CREATE TABLE steps (
    id              SERIAL PRIMARY KEY,
    algorithm_id    INT NOT NULL REFERENCES algorithms(id) ON DELETE CASCADE,
    step_number     INT NOT NULL,
    description     TEXT NOT NULL,                  -- "Comparing index 0 and 1"
    action          VARCHAR(50),                    -- 'compare' | 'swap' | 'push' | 'pop' | 'insert' | 'delete' | 'traverse' | 'found'
    state           JSONB NOT NULL,
    -- Array example:   { "array": [5,3,8], "comparing": [0,1], "sorted": [] }
    -- Stack example:   { "stack": [10,20,30], "top": 2, "action": "push", "value": 30 }
    -- LL example:      { "nodes": [1,2,3], "pointers": {"head":0,"current":1}, "action": "traverse" }
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(algorithm_id, step_number)
);

CREATE TYPE language_type AS ENUM ('java', 'cpp');

-- 4. COMPARISONS TABLE
-- Defines valid algorithm pairs for side-by-side comparison
CREATE TABLE comparisons (
    id              SERIAL PRIMARY KEY,
    algorithm_a_id  INT NOT NULL REFERENCES algorithms(id) ON DELETE CASCADE,
    algorithm_b_id  INT NOT NULL REFERENCES algorithms(id) ON DELETE CASCADE,
    note            TEXT,                           -- "Both O(n²) but insertion sort performs better on nearly sorted data"
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(algorithm_a_id, algorithm_b_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_algorithms_category    ON algorithms(category);
CREATE INDEX idx_algorithms_slug        ON algorithms(slug);
CREATE INDEX idx_steps_algorithm_id     ON steps(algorithm_id);
CREATE INDEX idx_codes_algorithm_id     ON algorithm_codes(algorithm_id);
CREATE INDEX idx_comparisons_a          ON comparisons(algorithm_a_id);
CREATE INDEX idx_comparisons_b          ON comparisons(algorithm_b_id);


select * from algorithms

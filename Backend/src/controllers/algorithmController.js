const algorithmModel = require('../models/algorithmModel');
const codesModel = require('../models/codesModel');
const { getBubbleSortSteps } = require('../algorithms/array/bubbleSort');
const { getStackPushSteps } = require('../algorithms/stack/push');
const { getLLTraversalSteps } = require('../algorithms/linkedList/traversal');
const { getSelectionSortSteps } = require('../algorithms/array/selectionsort');
const { getInsertionSortSteps } = require('../algorithms/array/insertionSort');
const { getBinarySearchSteps } = require('../algorithms/array/binarySearch');
const { getLinearSearchSteps } = require('../algorithms/array/linearSearch');
const { getStackPopSteps } = require('../algorithms/stack/pop');
const { getStackPeekSteps } = require('../algorithms/stack/peek');
const { getLLInsertHeadSteps } = require('../algorithms/linkedList/Inserthead');
const { getLLInsertTailSteps } = require('../algorithms/linkedList/Inserttail');
const { getLLDeleteNodeSteps } = require('../algorithms/linkedList/delete');
const { getStackIsEmptySteps } = require('../algorithms/stack/isEmpty');
const { getBSTInsertSteps } = require('../algorithms/tree/bstInsert');
const { getBSTSearchSteps } = require('../algorithms/tree/bstSearch');
const { getBFSSteps } = require('../algorithms/graph/bfs');
const { getDFSSteps } = require('../algorithms/graph/dfs');
const { getDijkstraSteps } = require('../algorithms/graph/dijkstra');
const { getFactorialSteps } = require('../algorithms/recursion/factorial');
const { getFibonacciSteps } = require('../algorithms/recursion/fibonacci');
const aiService = require('../services/aiService');

const getAllAlgorithms = async (req, res) => {
  try {
    const algorithms = await algorithmModel.getAll();
    res.json({ success: true, data: algorithms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAlgorithmBySlug = async (req, res) => {
  try {
    const algorithm = await algorithmModel.getBySlug(req.params.slug);
    if (!algorithm) {
      return res.status(404).json({ success: false, error: 'Algorithm Not Found' });
    }
    res.json({ success: true, data: algorithm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const algorithmMap = {
  'bubble-sort':    getBubbleSortSteps,
  'stack-push':     getStackPushSteps,
  'll-traversal':   getLLTraversalSteps,
  'selection-sort': getSelectionSortSteps,
  'insertion-sort': getInsertionSortSteps,
  'binary-search':  getBinarySearchSteps,
  'linear-search':  getLinearSearchSteps,
  'stack-pop':      getStackPopSteps,
  'stack-peek':     getStackPeekSteps,
  'll-insert-head': getLLInsertHeadSteps,
  'll-insert-tail': getLLInsertTailSteps,
  'll-delete-node': getLLDeleteNodeSteps,
  'stack-isempty':   getStackIsEmptySteps,
  'bst-insert':     getBSTInsertSteps,
  'bst-search':     getBSTSearchSteps,
  'graph-bfs':      getBFSSteps,
  'graph-dfs':      getDFSSteps,
  'graph-dijkstra': getDijkstraSteps,
  'recursion-factorial': getFactorialSteps,
  'recursion-fibonacci': getFibonacciSteps,
};

// Which slugs need array input (can generate steps from initial plain array input)
const ARRAY_SLUGS = new Set([
  'bubble-sort', 'selection-sort', 'insertion-sort',
  'binary-search', 'linear-search'
]);

const visualizeAlgorithm = async (req, res) => {
  try {
    const { slug } = req.params;
    const { input } = req.body;
    const stepGenerator = algorithmMap[slug];
    if (!stepGenerator) {
      return res.status(404).json({ success: false, error: 'Algorithm not found' });
    }
    const steps = stepGenerator(input);
    res.json({ success: true, data: { steps } });
  } catch (err) {
    const status = err.isValidationError ? 400 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

const getAlgorithmCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const { lang } = req.query;
    if (!lang) {
      return res.status(400).json({ success: false, error: 'Language is required' });
    }
    if (!['java', 'cpp'].includes(lang)) {
      return res.status(400).json({ success: false, error: 'Language must be java or cpp' });
    }
    const code = await codesModel.getCodeBySlugAndLang(slug, lang);
    if (!code) {
      return res.status(404).json({ success: false, error: 'Code not found' });
    }
    res.json({ success: true, data: code });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const parseInput = (raw) => {
  if (Array.isArray(raw)) return raw.map(Number).filter(v => Number.isFinite(v));
  if (typeof raw === 'string') return raw.split(',').map(s => Number(s.trim())).filter(v => Number.isFinite(v));
  return [];
};

const analyzeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, error: 'code and language are required' });
    }

    // Step 1: Quick rule-based detect to fetch reference code before the AI call
    const quickDetect = aiService.detectByPattern(code);
    let referenceCode = null;
    if (quickDetect) {
      try {
        const refRecord = await codesModel.getCodeBySlugAndLang(quickDetect.slug, language);
        referenceCode = refRecord?.code ?? refRecord?.source_code ?? null;
      } catch (_) { /* non-fatal */ }
    }

    // Step 2: Single AI call — detection + comparison
    const aiRes = await aiService.analyze(code, language, referenceCode);

    if (aiRes.confidence < 0.7) {
      return res.status(400).json({
        success: false,
        error: 'Could not confidently detect the algorithm. Please check your code.',
      });
    }

    const stepGenerator = algorithmMap[aiRes.slug];
    if (!stepGenerator) {
      return res.status(400).json({
        success: false,
        error: `Algorithm "${aiRes.slug}" is not supported yet.`,
      });
    }

    // Step 3: Try to generate steps — but NEVER let this block the response
    // For array algorithms: try with the provided input
    // For stack/LL algorithms: skip — frontend will re-request with proper input format
    let steps = [];
    if (ARRAY_SLUGS.has(aiRes.slug) && input) {
      try {
        const parsedInput = parseInput(input);
        if (parsedInput.length > 0) {
          steps = stepGenerator(parsedInput);
        }
      } catch (stepErr) {
        // Non-fatal — frontend will handle missing steps gracefully
        console.warn(`Step generation skipped for ${aiRes.slug}:`, stepErr.message);
      }
    }

    console.log(`✅ analyzeCode: slug=${aiRes.slug} steps=${steps.length}`);

    res.json({
      success: true,
      data: {
        slug:             aiRes.slug,
        name:             aiRes.name || aiRes.slug,
        confidence:       aiRes.confidence,
        time_best:        aiRes.time_best,
        time_avg:         aiRes.time_avg,
        time_worst:       aiRes.time_worst,
        space_complexity: aiRes.space_complexity,
        match_score:      aiRes.match_score ?? null,
        feedback_items:   aiRes.feedback_items ?? [],
        steps,  // empty array for stack/LL — frontend shows AlgoInput to re-visualize
      },
    });

  } catch (err) {
    const status = err.isValidationError ? 400 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllAlgorithms,
  getAlgorithmBySlug,
  visualizeAlgorithm,
  getAlgorithmCode,
  analyzeCode,
};
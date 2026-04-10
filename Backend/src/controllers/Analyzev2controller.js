const { executeCode } = require('../services/executionService');
const { analyzeV2Code } = require('../services/Aiservicev2');

// ─── Parse input safely ───────────────────────────────────────────────────────
const parseInput = (raw) => {
  if (Array.isArray(raw)) return raw.map(Number).filter(v => Number.isFinite(v));
  if (typeof raw === 'string') {
    return raw.split(',').map(s => Number(s.trim())).filter(v => Number.isFinite(v));
  }
  return [5, 3, 8, 1, 9, 2];
};

const analyzeV2 = async (req, res) => {
  try {
    const { code, language = 'java', input } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ success: false, error: 'code is required' });
    }

    const parsedInput = input ? parseInput(input) : [5, 3, 8, 1, 9, 2];

    // Step 1: Execute the code — get real output + time
    const execution = await executeCode(code, language, parsedInput);
    console.log('✅ Execution result:', execution.status, execution.execution_time_ms + 'ms');

    // Step 2: AI analysis based on ACTUAL code + execution result
    const analysis = await analyzeV2Code(code, language, execution, parsedInput);

    res.json({
      success: true,
      data: {
        // Execution
        execution: {
          status: execution.status,
          output: execution.output,
          execution_time_ms: execution.execution_time_ms,
          memory_kb: execution.memory_kb,
          stdout: execution.stdout,
          stderr: execution.stderr,
          input_size: execution.input_size,
          provider: execution.provider,
        },
        // AI Analysis
        algorithm: analysis.algorithm,
        time_complexity: analysis.time_complexity,
        space_complexity: analysis.space_complexity,
        suggestions: analysis.suggestions,
        optimized_code: analysis.optimized_code,
        competitive_hint: analysis.competitive_hint,
        bugs: analysis.bugs,
      }
    });

  } catch (err) {
    console.error('analyzeV2 error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { analyzeV2 };
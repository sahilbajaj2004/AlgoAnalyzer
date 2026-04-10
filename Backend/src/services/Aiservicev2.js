const axios = require('axios');

// Add this function to your existing aiService.js
// It's separate from analyze() — this one uses real execution data

const analyzeV2Code = async (code, language, execution, input) => {
  try {
    const executionSummary = execution.success
      ? `The code ran successfully.
         Output: ${execution.output || execution.stdout}
         Execution time: ${execution.execution_time_ms}ms
         Memory used: ${execution.memory_kb}kb
         Input size (n): ${execution.input_size}`
      : `The code failed to run.
         Error: ${execution.stderr}
         Status: ${execution.status}`;

    const prompt = `
You are an expert algorithm coach. Analyze this ${language} code and give specific, actionable feedback.

User's code:
\`\`\`${language}
${code}
\`\`\`

Execution result with input [${input.join(', ')}]:
${executionSummary}

Your tasks:
1. Identify the algorithm name
2. Derive time and space complexity FROM THE CODE ITSELF (not assumptions)
3. Find bugs if any — be specific about which line and why it's wrong
4. Give 2-3 short, specific suggestions to improve THIS exact code
5. If there's a more efficient version, provide the actual improved code
6. Give ONE competitive programming hint (a trick or pattern this code could use)

Rules:
- Be specific to THIS code, not generic advice
- Reference actual variable names and line numbers from the code
- If the code has a bug that caused wrong output, identify the exact line
- Suggestions must be copy-paste actionable, not vague
- Optimized code must be complete and runnable
- Keep everything concise — no fluff

Return ONLY valid JSON:
{
  "algorithm": "...",
  "time_complexity": {
    "value": "O(n²)",
    "explanation": "Two nested loops each iterating up to n times"
  },
  "space_complexity": {
    "value": "O(1)",
    "explanation": "Only uses a temp variable, no extra arrays"
  },
  "bugs": [
    {
      "line": "if (arr[j] < arr[j+1])",
      "issue": "Comparison is reversed — sorts descending instead of ascending",
      "fix": "if (arr[j] > arr[j+1])"
    }
  ],
  "suggestions": [
    {
      "title": "Add early exit optimization",
      "description": "Track if any swap happened. If no swaps in a pass, array is already sorted.",
      "code": "boolean swapped = false;"
    }
  ],
  "optimized_code": "void bubbleSort(int[] arr) {\n  // full improved code here\n}",
  "competitive_hint": "For nearly-sorted arrays, this optimization reduces time to O(n) best case"
}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Algo Analyzer V2',
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    console.log('🤖 V2 AI:', text.substring(0, 200) + '...');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.error('analyzeV2Code AI error:', err.message);
    // Graceful fallback
    return {
      algorithm:       'Unknown',
      time_complexity: { value: 'Unknown', explanation: 'AI analysis failed' },
      space_complexity: { value: 'Unknown', explanation: 'AI analysis failed' },
      bugs:            [],
      suggestions:     [{ title: 'AI unavailable', description: 'Could not analyze code at this time.', code: '' }],
      optimized_code:  '',
      competitive_hint: '',
    };
  }
};

module.exports = { analyzeV2Code };
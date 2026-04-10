const axios = require('axios');

// ─── Variable-agnostic pattern matching ───────────────────────────────────────
const normalizeVars = (code) => {
  let c = code.replace(/\s+/g, '');
  const arrayVarMatch = c.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\[(?:i|j|0)\]/);
  if (arrayVarMatch) {
    const varName = arrayVarMatch[1];
    if (varName !== 'arr') {
      const re = new RegExp(`\\b${varName}\\b`, 'g');
      c = c.replace(re, 'arr');
    }
  }
  return c;
};

const detectByPattern = (code) => {
  const c = normalizeVars(code);

  if (
    /arr\[.+\]>arr\[.+\+1\]/.test(c) ||
    /arr\[.+\+1\]<arr\[.+\]/.test(c) ||
    /swap.*arr\[.+\].*arr\[.+\+1\]/.test(c)
  ) return { slug: 'bubble-sort',    confidence: 0.95, time_best: 'O(n)',       time_avg: 'O(n²)',      time_worst: 'O(n²)',      space_complexity: 'O(1)' };

  if (
    /min(Index|Idx|_idx|I|i)?=/.test(c) && /arr\[min/.test(c) ||
    /max(Index|Idx|_idx|I|i)?=/.test(c) && /arr\[max/.test(c) ||
    /(minIndex|minIdx|min_index)/.test(c)
  ) return { slug: 'selection-sort', confidence: 0.92, time_best: 'O(n²)',      time_avg: 'O(n²)',      time_worst: 'O(n²)',      space_complexity: 'O(1)' };

  if (
    /(key|temp|current)=arr\[/.test(c) && /arr\[.+\+1\]=arr\[.+\]/.test(c) ||
    /(key|temp|current)=arr\[/.test(c) && /arr\[.+\]=arr\[.+-1\]/.test(c)
  ) return { slug: 'insertion-sort', confidence: 0.92, time_best: 'O(n)',       time_avg: 'O(n²)',      time_worst: 'O(n²)',      space_complexity: 'O(1)' };

  if (
    /(low|left|lo)[=<]/.test(c) && /(high|right|hi)[=>]/.test(c) &&
    /(mid|middle|m)=/.test(c) && /arr\[(mid|middle|m)\]/.test(c)
  ) return { slug: 'binary-search',  confidence: 0.93, time_best: 'O(1)',       time_avg: 'O(log n)',   time_worst: 'O(log n)',   space_complexity: 'O(1)' };

  if (
    /arr\[i\]==(target|key|val|value|x)/.test(c) ||
    /(target|key|val|value|x)==arr\[i\]/.test(c) ||
    /arr\[i\].equals\(/.test(c)
  ) return { slug: 'linear-search',  confidence: 0.90, time_best: 'O(1)',       time_avg: 'O(n)',       time_worst: 'O(n)',       space_complexity: 'O(1)' };

  if (
    /merge\(/.test(c) && /(mergeSort|sort)\(/.test(c) ||
    /mid=/.test(c) && /merge\(/.test(c)
  ) return { slug: 'merge-sort',     confidence: 0.88, time_best: 'O(n log n)', time_avg: 'O(n log n)', time_worst: 'O(n log n)', space_complexity: 'O(n)' };

  if (
    /(pivot|partition)/.test(c) && /(quickSort|quick_sort|sort)\(/.test(c) ||
    /partition\(/.test(c) && /pivot/.test(c)
  ) return { slug: 'quick-sort',     confidence: 0.88, time_best: 'O(n log n)', time_avg: 'O(n log n)', time_worst: 'O(n²)',      space_complexity: 'O(log n)' };

  if (/stack\.push\(|push\(/.test(c) && /top\+\+|top==/.test(c))
    return { slug: 'stack-push',     confidence: 0.88, time_best: 'O(1)', time_avg: 'O(1)', time_worst: 'O(1)', space_complexity: 'O(1)' };

  if (/top--|stack\[top\]/.test(c) && !/push/.test(c))
    return { slug: 'stack-pop',      confidence: 0.85, time_best: 'O(1)', time_avg: 'O(1)', time_worst: 'O(1)', space_complexity: 'O(1)' };

  if (/(current|curr|node|temp)=(current|curr|node|temp)\.next/.test(c) && !/insert|delete/.test(c))
    return { slug: 'll-traversal',   confidence: 0.87, time_best: 'O(n)', time_avg: 'O(n)', time_worst: 'O(n)', space_complexity: 'O(1)' };

  if (/\.next=head|newNode\.next=head/.test(c) && /head=/.test(c))
    return { slug: 'll-insert-head', confidence: 0.87, time_best: 'O(1)', time_avg: 'O(1)', time_worst: 'O(1)', space_complexity: 'O(1)' };

  if (/\.next==null|\.next===null/.test(c) && /\.next=new/.test(c))
    return { slug: 'll-insert-tail', confidence: 0.87, time_best: 'O(n)', time_avg: 'O(n)', time_worst: 'O(n)', space_complexity: 'O(1)' };

  if (/(prev|previous)\.next=(current|curr|node|temp)\.next/.test(c) || /\.next=\.next\.next/.test(c))
    return { slug: 'll-delete-node', confidence: 0.87, time_best: 'O(n)', time_avg: 'O(n)', time_worst: 'O(n)', space_complexity: 'O(1)' };

  return null;
};

// ─── Normalize complexity strings for ComplexityBadge ─────────────────────────
const normalizeComplexity = (s) => {
  if (!s) return s;
  return s.replace(/n\^2/g, 'n²').replace(/n\^3/g, 'n³');
};

// ─── Main analyze ─────────────────────────────────────────────────────────────
const analyze = async (code, language, referenceCode = null) => {
  try {
    const ruleResult   = detectByPattern(code);
    const hasReference = !!referenceCode;

    const prompt = `
You are an expert algorithm teaching assistant. Be precise and concise.

User submitted this ${language} code:
\`\`\`
${code}
\`\`\`
${hasReference ? `
Reference (correct) implementation:
\`\`\`
${referenceCode}
\`\`\`
` : ''}
${ruleResult ? `Pre-detected algorithm: ${ruleResult.slug}` : ''}

Tasks:
1. Identify the algorithm. slug must be exactly one of:
   bubble-sort, selection-sort, insertion-sort, binary-search, linear-search,
   merge-sort, quick-sort, stack-push, stack-pop, stack-peek,
   ll-traversal, ll-insert-head, ll-insert-tail, ll-delete-node

2. ${hasReference
  ? `Compare the user's code to the reference for LOGICAL correctness only.
     Rules:
     - IGNORE: variable names, code style, whitespace, comments, extra optimizations
     - Swap sequences like (a=b;b=a) vs (b=a;a=b) are LOGICALLY IDENTICAL — never mark wrong
     - Early-exit optimizations (swapped flag etc.) are improvements, never wrong
     - Only mark "wrong" if the code produces INCORRECT output on some input
     
     Then give a match_score from 0–100 based on LOGICAL equivalence:
     - 90–100: logically identical or only has extra optimizations
     - 70–89: correct algorithm, minor structural differences
     - 50–69: correct algorithm, missing some edge case handling
     - 30–49: partially correct, some logic issues
     - 0–29: wrong algorithm or fundamentally broken logic`
  : 'Describe what this code does and its correctness.'}

3. Produce exactly 2–4 feedback items:
   - "type": one of "correct", "improvement", "wrong"
   - "message": 1–2 specific, actionable sentences
   - Only use "wrong" for genuine logical bugs that produce wrong output

Return ONLY valid JSON, no markdown, no extra text:
{
  "slug": "...",
  "name": "...",
  "confidence": 0.95,
  "time_best": "...",
  "time_avg": "...",
  "time_worst": "...",
  "space_complexity": "...",
  "match_score": 85,
  "feedback_items": [
    { "type": "correct",     "message": "..." },
    { "type": "improvement", "message": "..." }
  ]
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
          'X-Title': 'Algo Analyzer',
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    console.log('🤖 RAW AI:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');

    const aiResult = JSON.parse(jsonMatch[0]);
    const normalize = normalizeComplexity;

    return {
      ...aiResult,
      slug:             ruleResult?.confidence >= 0.9 ? ruleResult.slug            : aiResult.slug,
      confidence:       ruleResult                    ? ruleResult.confidence       : aiResult.confidence,
      time_best:        normalize(ruleResult?.time_best        ?? aiResult.time_best),
      time_avg:         normalize(ruleResult?.time_avg         ?? aiResult.time_avg),
      time_worst:       normalize(ruleResult?.time_worst       ?? aiResult.time_worst),
      space_complexity: normalize(ruleResult?.space_complexity ?? aiResult.space_complexity),
      // match_score now comes from AI semantic analysis — much more accurate than token counting
      match_score: hasReference ? (aiResult.match_score ?? null) : null,
    };

  } catch (err) {
    console.error('AI SERVICE ERROR:', err.message);
    const fallback = detectByPattern(code);
    return {
      slug:             fallback?.slug             ?? 'bubble-sort',
      name:             fallback?.slug             ?? 'Unknown',
      confidence:       fallback?.confidence       ?? 0.5,
      time_best:        fallback?.time_best        ?? 'O(n²)',
      time_avg:         fallback?.time_avg         ?? 'O(n²)',
      time_worst:       fallback?.time_worst       ?? 'O(n²)',
      space_complexity: fallback?.space_complexity ?? 'O(1)',
      match_score:      null,
      feedback_items: [
        { type: 'improvement', message: 'AI analysis unavailable — pattern detection used as fallback.' },
      ],
    };
  }
};

module.exports = { analyze, detectByPattern };
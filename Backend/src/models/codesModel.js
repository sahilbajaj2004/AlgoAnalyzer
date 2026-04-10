const pool = require('../config/db');

const getCodeBySlugAndLang = async (slug, lang) => {
    const result = await pool.query(
        `SELECT ac.code, ac.highlight_map 
         FROM algorithm_codes as ac
         JOIN algorithms a ON a.id = ac.algorithm_id          
         WHERE a.slug = $1 AND ac.language = $2` ,
        [slug, lang]);
    return result.rows[0];
};

const upsertCodeBySlugAndLang = async (slug, lang, code, highlight_map) => {
    const result = await pool.query(
        `INSERT INTO algorithm_codes (algorithm_id, language, code, highlight_map)
         VALUES (
            (SELECT id FROM algorithms WHERE slug = $1),
            $2, $3, $4
         )
         ON CONFLICT (algorithm_id, language) 
         DO UPDATE SET code = EXCLUDED.code, highlight_map = EXCLUDED.highlight_map
         RETURNING *`,
        [slug, lang, code, highlight_map]
    );
    return result.rows[0];
};

module.exports = { getCodeBySlugAndLang, upsertCodeBySlugAndLang };
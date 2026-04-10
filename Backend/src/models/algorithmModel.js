const pool = require('../config/db');

const getAll = async () => {
    const result = await pool.query('SELECT * FROM algorithms ORDER BY order_index');
    return result.rows;
}

const getBySlug = async (slug) => {
    const result = await pool.query('SELECT * FROM algorithms WHERE slug = $1', [slug]);
    return result.rows[0];
}

const create = async (algo) => {
    const { name, slug, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index } = algo;
    const result = await pool.query(
        `INSERT INTO algorithms 
        (name, slug, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [name, slug, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index]
    );
    return result.rows[0];
}

const updateBySlug = async (slug, algo) => {
    const { name, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index } = algo;
    const result = await pool.query(
        `UPDATE algorithms SET 
         name=$1, category=$2, subcategory=$3, description=$4, time_best=$5, time_avg=$6, time_worst=$7, space_complexity=$8, is_stable=$9, order_index=$10
         WHERE slug=$11 RETURNING *`,
        [name, category, subcategory, description, time_best, time_avg, time_worst, space_complexity, is_stable, order_index, slug]
    );
    return result.rows[0];
}

const deleteBySlug = async (slug) => {
    const result = await pool.query('DELETE FROM algorithms WHERE slug = $1 RETURNING *', [slug]);
    return result.rows[0];
}

module.exports = { getAll, getBySlug, create, updateBySlug, deleteBySlug };
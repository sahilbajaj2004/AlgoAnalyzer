const express = require('express');
const router = express.Router();
const algorithmModel = require('../models/algorithmModel');
const codesModel = require('../models/codesModel');

// ----- Algorithms -----

// Create
router.post('/algorithms', async (req, res) => {
    try {
        const algo = await algorithmModel.create(req.body);
        res.status(201).json({ success: true, data: algo });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update
router.put('/algorithms/:slug', async (req, res) => {
    try {
        const algo = await algorithmModel.updateBySlug(req.params.slug, req.body);
        if (!algo) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true, data: algo });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete
router.delete('/algorithms/:slug', async (req, res) => {
    try {
        const algo = await algorithmModel.deleteBySlug(req.params.slug);
        if (!algo) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true, data: algo });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ----- Code Snippets -----

// Upsert
router.put('/algorithms/:slug/code', async (req, res) => {
    try {
        const { lang, code, highlight_map } = req.body;
        if (!lang || !code) return res.status(400).json({ success: false, error: 'Lang and Code required' });
        
        const codeSnippet = await codesModel.upsertCodeBySlugAndLang(req.params.slug, lang, code, highlight_map || {});
        res.json({ success: true, data: codeSnippet });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

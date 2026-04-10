const express = require('express');
const router = express.Router();
const { analyzeV2 } = require('../controllers/Analyzev2controller');

router.post('/analyze-v2', analyzeV2);

module.exports = router;
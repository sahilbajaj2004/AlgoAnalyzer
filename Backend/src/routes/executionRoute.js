const express = require('express')
const router = express.Router()
const { executeCode } = require('../services/executionService')

// test route
router.get('/test', async (req, res) => {
  const code = `
    void bubbleSort(int[] arr) {
      for (int i = 0; i < arr.length - 1; i++)
        for (int j = 0; j < arr.length - i - 1; j++)
          if (arr[j] > arr[j+1]) {
            int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
          }
    }
  `
  const result = await executeCode(code, 'java', [5, 3, 8, 1])
  res.json(result)
})

module.exports = router
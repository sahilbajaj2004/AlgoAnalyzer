const throwValidation = require('../validationError')

const getInsertionSortSteps = (inputArray) => {
    if (!inputArray)                                        throwValidation('Pass the input first')
    if (!Array.isArray(inputArray))                        throwValidation('Input must be an array')
    if (inputArray.length === 0)                           throwValidation('Array cannot be empty')
    if (inputArray.length > 20)                            throwValidation('Max 20 elements allowed')
    if (inputArray.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (inputArray.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const steps = []
    const arr = [...inputArray]

    for (let i = 1; i < arr.length; i++) {
        const key = arr[i]
        let j = i - 1

        // pick key
        steps.push({
            step_number: steps.length + 1,
            action: 'pick',
            state: {
                array: [...arr],
                key,
                keyIndex: i,
                comparing: [],
                sorted: Array.from({ length: i }, (_, k) => k)
            }
        })

        while (j >= 0 && arr[j] > key) {
            // compare
            steps.push({
                step_number: steps.length + 1,
                action: 'compare',
                state: {
                    array: [...arr],
                    key,
                    keyIndex: j + 1,
                    comparing: [j, j + 1],
                    sorted: Array.from({ length: i }, (_, k) => k)
                }
            })

            // shift
            arr[j + 1] = arr[j]
            j--

            steps.push({
                step_number: steps.length + 1,
                action: 'shift',
                state: {
                    array: [...arr],
                    key,
                    keyIndex: j + 1,
                    comparing: [j + 1, j + 2],
                    sorted: Array.from({ length: i }, (_, k) => k)
                }
            })
        }

        // insert key
        arr[j + 1] = key

        steps.push({
            step_number: steps.length + 1,
            action: 'insert',
            state: {
                array: [...arr],
                key,
                keyIndex: j + 1,
                comparing: [],
                sorted: Array.from({ length: i + 1 }, (_, k) => k)
            }
        })
    }

    // done
    steps.push({
        step_number: steps.length + 1,
        action: 'done',
        state: {
            array: [...arr],
            key: null,
            keyIndex: null,
            comparing: [],
            sorted: arr.map((_, i) => i)
        }
    })

    return steps
}

module.exports = { getInsertionSortSteps }
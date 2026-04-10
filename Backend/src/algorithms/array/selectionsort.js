const throwValidation = require('../validationError')

const getSelectionSortSteps = (inputArray) => {
    if (!inputArray)                                        throwValidation('Pass the input first')
    if (!Array.isArray(inputArray))                        throwValidation('Input must be an array')
    if (inputArray.length === 0)                           throwValidation('Array cannot be empty')
    if (inputArray.length > 20)                            throwValidation('Max 20 elements allowed')
    if (inputArray.some(v => typeof v !== 'number'))       throwValidation('Only numbers allowed')
    if (inputArray.some(v => !Number.isFinite(v)))         throwValidation('No Infinity or NaN allowed')

    const steps = []
    const arr = [...inputArray]

    for (let i = 0; i < arr.length; i++) {
        let minIndex = i

        // highlight minIndex selection
        steps.push({
            step_number: steps.length + 1,
            action: 'select',
            state: {
                array: [...arr],
                comparing: [],
                minIndex,
                sortedUpto: i,
                sorted: Array.from({ length: i }, (_, k) => k)
            }
        })

        for (let j = i + 1; j < arr.length; j++) {

            // comparing arr[j] with arr[minIndex]
            steps.push({
                step_number: steps.length + 1,
                action: 'compare',
                state: {
                    array: [...arr],
                    comparing: [j, minIndex],
                    minIndex,
                    sortedUpto: i,
                    sorted: Array.from({ length: i }, (_, k) => k)
                }
            })

            if (arr[j] < arr[minIndex]) {
                minIndex = j

                // new minimum found
                steps.push({
                    step_number: steps.length + 1,
                    action: 'newMin',
                    state: {
                        array: [...arr],
                        comparing: [j],
                        minIndex,
                        sortedUpto: i,
                        sorted: Array.from({ length: i }, (_, k) => k)
                    }
                })
            }
        }

        // swap
        const temp = arr[minIndex]
        arr[minIndex] = arr[i]
        arr[i] = temp

        steps.push({
            step_number: steps.length + 1,
            action: 'swap',
            state: {
                array: [...arr],
                comparing: [i, minIndex],
                minIndex: i,
                sortedUpto: i,
                sorted: Array.from({ length: i }, (_, k) => k)
            }
        })

        // mark i as sorted
        steps.push({
            step_number: steps.length + 1,
            action: 'sorted',
            state: {
                array: [...arr],
                comparing: [],
                minIndex: i,
                sortedUpto: i + 1,
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
            comparing: [],
            minIndex: null,
            sortedUpto: arr.length,
            sorted: arr.map((_, i) => i)
        }
    })

    return steps
}

module.exports = { getSelectionSortSteps }
const throwValidation = require('../validationError') 

const getStackPushSteps = (input) => {

    if (!input || typeof input !== 'object'){
        throwValidation('Input must be an object')
    } 
    if (typeof input.value !== 'number') {
        throwValidation('value must be a number');
    }
    if (!Array.isArray(input.stack)) {
        throwValidation('stack must be an array');
    }
    if (input.stack.some(v => typeof v !== 'number')) {
        throwValidation('stack must contain only numbers');
    }

    const { value, stack } = input;

    const steps = [];
    const arr = [...stack];


    steps.push({
        step_number: 1,
        action: "idle",
        state: { stack: [...arr], top: arr.length - 1, pushing: null }
    })

    steps.push({
        step_number: 2,
        action: 'push',
        state: { stack: [...arr], top: arr.length - 1, pushing: value }
    })

    arr.push(value);

    steps.push({
        step_number: 3,
        action: 'done',
        state: { stack: [...arr], top: arr.length - 1, pushing: null }
    })

    return steps

}
module.exports = { getStackPushSteps }

document.addEventListener('DOMContentLoaded', () => {

    /* #region Global variables */

    // Just two global variables. Feeling pretty good right now.
    let currentDisplayString = '';
    let operationString = '';

    /* #endregion */

    /* #region Operation functions */

    function operate(string) {
        // In the way TOP asks me to do it, the order of operations is not respected.
        // This way, the user can concatenate more operations, but I respect the order
        // of operations. I know it's dumb, but it bothers me so much.
        // I may have complicated things for myself but I'm going to do it this way.
        // It's mathematically correct.
        result = eval(string);
        // In this order the isFloat function doesn't need to check if the number is finite or not.
        if (!Number.isFinite(result)) {
            result = 'ERR: ZERO DIV';
        } else if (isFloat(result)) {
            result = result.toFixed(3);
        }
        return result;
    }

    function isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    /* #endregion */

    /* #region Display related functions */

    function appendDisplayString(string, numberValue) {
        // Caps the display number length at 11.
        if (string.length === 11) {
            return string;
        }
        return string + numberValue;
    }

    function changeDisplay(displayString) {
        let display = document.querySelector('.displayText');
        display.textContent = displayString;
    }

    function eraseDisplay() {
        // This function returns, so updating the currentDisplayString value is more clear.
        let display = document.querySelector('.displayText');
        display.textContent = '';
        return '';
    }

    /* #endregion */

    /* #region Number buttons related functions */

    function createNumberButtons() {
        // We create 3 rows of 3 elements each, then 1 row with '0' in it.
        let numbersBody = document.querySelector('.numbers');
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('div');
            row.id = 'row';

            // For every row, we now add 3 numbers.
            for (let j = 0; j < 3; j++) {
                let numberButton = document.createElement('button');

                // We add the number class, to add styling.
                numberButton.classList.add('number');

                // We create the text inside the button. We initialize it with +1 so we skip zero for now.
                numberButton.textContent = (3*i) + j + 1;

                // We also create right now a listener.
                numberButton.addEventListener('click', () => {
                    currentDisplayString = appendDisplayString(currentDisplayString, numberButton.textContent);
                    changeDisplay(currentDisplayString);
                });
                row.appendChild(numberButton);
            }
            numbersBody.appendChild(row);
        }

        // Finished the regular rows. Now for the '0' button.
        let lastRow = document.createElement('div');
        lastRow.id = 'row';

        let zeroButton = document.createElement('button');
        zeroButton.classList.add('number');
        zeroButton.textContent = 0;
        zeroButton.addEventListener('click', () => {
            currentDisplayString = appendDisplayString(currentDisplayString, zeroButton.textContent);
            changeDisplay(currentDisplayString);
        });

        lastRow.appendChild(zeroButton);
        numbersBody.appendChild(lastRow);
    }

    /* #endregion */

    /* #region Special buttons related functions */

    function createClearListener() {
        let clearButton = document.querySelector('#cl');
        clearButton.addEventListener('click', () => {
            // Since eraseDisplay returns an empty string, currentDisplayString is destroyed.
            currentDisplayString = eraseDisplay();});
    }

    function createClearAllListener() {
        let clearAllButton = document.querySelector('#ca');
        clearAllButton.addEventListener('click', () => {
            // We reset both strings with clear all.
            currentDisplayString = eraseDisplay();
            operationString = '';
        });
    }

    function createEqualsListener() {
        let equalsButton = document.querySelector('.equals');
        equalsButton.addEventListener('click', () => {
            // We append the last number.
            operationString += currentDisplayString;

            // We calculate the result.
            result = operate(operationString);

            // We reset the display and operation string (since it's over)
            currentDisplayString = operationString = '';

            // And display the result, and there you go.
            changeDisplay(result);
        })
    }

    function createOperandButtons() {
        let operandsSymbols = ['+', '-', '×', '÷'];
        let operandsDiv = document.querySelector('.operands');

        for (let i = 0; i < 4; i++) {
            // After cerating the button...
            let operandButton = document.createElement('button');

            // ...and making content and class appropriate...
            operandButton.classList.add('operand');
            operandButton.textContent = operandsSymbols[i];
    
            // ...we can also create the listener already.
            operandButton.addEventListener('click', () => {
                let operandToAppend = operandButton.textContent;

                // The visually pleasing 'times' and 'divides' symbol seriously fucks up calculations.
                if (operandToAppend === '×') {
                    operandToAppend = '*';
                } else if (operandToAppend === '÷') {
                    operandToAppend = '/';
                }

                // This appends all of the inputs (numbers and operators alike) inside of operationString
                operationString += currentDisplayString + operandToAppend;
                currentDisplayString = '';

                // If the second to last characther is already an operand, we just switch the operand.
                let secondToLastChar = operationString.charAt(operationString.length - 2);
                if (operandsSymbols.includes(secondToLastChar)) {
                    operationString[operationString.length - 2] = '';
                }
            })

            operandsDiv.appendChild(operandButton);
        }
    }

    /* #endregion */

    /* #region Global function calls */

    // In order: number buttons, operands, equals, clear, clearAll.
    createNumberButtons();
    createOperandButtons();
    createClearListener();
    createClearAllListener();
    createEqualsListener();

    /* #endregion */
})
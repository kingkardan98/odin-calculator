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

    function numberListener(numberToDisplay) {
        currentDisplayString = appendDisplayString(currentDisplayString, numberToDisplay);
        changeDisplay(currentDisplayString);
    }

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
                // We also set the id as 'buttonN' for later usage in keyboard support.
                let buttonValue = (3*i) + j + 1;
                numberButton.textContent = buttonValue;
                numberButton.id = 'button' + buttonValue;

                // We also create right now a listener.
                numberButton.addEventListener('click', () => {numberListener(numberButton.textContent);});
                row.appendChild(numberButton);
            }
            numbersBody.appendChild(row);
        }

        // Finished the regular rows. Now for the '0' button.
        let lastRow = document.createElement('div');
        lastRow.id = 'row';

        let zeroButton = document.createElement('button');
        zeroButton.classList.add('number');
        zeroButton.id = 'button0';
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

    function operandListener(button) {
        let operandToAppend = button.textContent;

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
    }

    function createOperandButtons() {
        let operandsSymbols = ['+', '-', '×', '÷'];
        let operandsIds = ['addButton', 'subtractButton', 'multiplyButton', 'divideButton'];
        let operandsDiv = document.querySelector('.operands');

        for (let i = 0; i < 4; i++) {
            // After cerating the button...
            let operandButton = document.createElement('button');

            // ...and making content and class appropriate...
            operandButton.classList.add('operand');
            operandButton.id = operandsIds[i];
            operandButton.textContent = operandsSymbols[i];
    
            // ...we can also create the listener already.
            operandButton.addEventListener('click', () => {operandListener(operandButton);})

            operandsDiv.appendChild(operandButton);
        }
    }

    /* #endregion */

    /* #region Keyboard support */

    document.addEventListener('keydown', (event) => {
        let key = event.key;
        switch(key){
            case "0":
                numberListener(0);
                break;
            case "1":
                numberListener(1);
                break;
            case "2":
                numberListener(2);
                break;
            case "3":
                numberListener(3);
                break;
            case "4":
                numberListener(4);
                break;
            case "5":
                numberListener(5);
                break;
            case "6":
                numberListener(6);
                break;
            case "7":
                numberListener(7);
                break;
            case "8":
                numberListener(8);
                break;
            case "9":
                numberListener(9);
                break;
            case "Enter":
                // We just redo the equals listener.
                operationString += currentDisplayString;
                result = operate(operationString);
                currentDisplayString = operationString = '';
                changeDisplay(result);
                break;
            case "Backspace":
                currentDisplayString = eraseDisplay();
                break;
            case "+":
                let plusButton = document.querySelector('#addButton');
                operandListener(plusButton);
                break;
            case "-":
                let subtractButton = document.querySelector('#subtractButton');
                operandListener(subtractButton);
                break;
            case '*':
                let multiplyButton = document.querySelector('#multiplyButton');
                operandListener(multiplyButton);
                break;
            case '/':
                let divideButton = document.querySelector('#divideButton');
                operandListener(divideButton);
                break;
        }
    });

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
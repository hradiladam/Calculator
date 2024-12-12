document.addEventListener('DOMContentLoaded', () => {
    const recentHistoryDisplay = document.getElementById('recent-history'); // Get recent-history element
    const resultDisplay = document.getElementById('result'); // Get result element

    let currentInput = '0'; // What user types
    let recentHistory = ''; // Stores the previous operation

    const operators = ['+', '−', '×', '÷']; // List of operators


    // Function to update the display of calculator
    const updateDisplay = () => {
        recentHistoryDisplay.textContent = recentHistory || 'Empty'; // Show either recent history or 'Empty' in recent-history display
        resultDisplay.textContent = currentInput || '0'; // Show either current input or '0' in result display
    };


    // Function to clear all inputs
    const clearAll = () => {
        currentInput = ''; // Reset the current input
        recentHistory = ''; // Reset the recent history
    };


    // Function to delete last character
    const deleteLastChar = () => {
        currentInput = currentInput.slice(0, -1); // Return the current input minus the last character
    };


    // Function to evaluate calculation
    const evaluateExpression = () => {
        try {
            // Replace operators for math.js compatibility
            const expression = currentInput
                .replace(/×/g, '*') // Change '×' into '*' for math.js
                .replace(/÷/g, '/') // Change '÷' into '/' for math.js
                .replace(/−/g, '-'); // Change '−' into '-' for math.js

            // Use math.js to evaluate the expression
            const result = math.evaluate(expression); // math.evaluate() evaluates the expression safely

            recentHistory = `${currentInput}=`; // Add '=' at the end of recentHistory for better visual effect
            currentInput = math.format(result, { precision: 14 }); // Format result to avoid floating-point issues
        } catch (error) {
            currentInput = 'error'; // If math.js fails, show an error message
        }
    };



    // Function for appending values of numbers, parentheses and decimal point
    const appendValue = (value) => {
    
        // Logic for decimal points
        if (value === '.') {
            // Check if the last character is a number and the current input doesn't already have a decimal point
            // Also, ensure the last character is not an operator or parentheses
            if (/[0-9]$/.test(currentInput) && !/[+\-×÷=()]$/.test(currentInput)) {
                // Check if there's no decimal already in the number
                if (!/\.[0-9]*$/.test(currentInput)) {
                    currentInput += value; // Append the decimal point
                }
            } else {
                return; // Prevent adding decimal if conditions are not met
            }
        }
        
        // Logic for parentheses
        else if (value === '( )') {
            // Handle parentheses
            if (currentInput === '' || operators.includes(currentInput.slice(-1))) {
                currentInput += '('; // Open parentheses if the current input is empty or ends with an operator
            } else {
                // If parentheses already open, close them
                const openParentheses = (currentInput.match(/\(/g) || []).length;
                const closedParentheses = (currentInput.match(/\)/g) || []).length;
                if (openParentheses > closedParentheses) {
                    currentInput += ')'; // Close parentheses if there are unmatched opening parentheses
                } else {
                    currentInput += '('; // Otherwise, add opening parentheses
                }
            }
        } 
        
        // Prevents repeated operators
        else if (operators.includes(value)) { // Checks if the value is an operator
            if (operators.includes(currentInput.slice(-1))) { // If the last character is already an operator
                currentInput = currentInput.slice(0, -1) + value; // Replace the last operator with the new one
            } else {
                currentInput += value; // Append the operator to the current input
            }
        } 
        
        else {
            currentInput += value; // Append non-operator values (numbers, etc.)
        }
    };

    
    // Function to handle button clicks
    const handleButtons = (value) => {
        switch (value) {
            case 'AC':
                clearAll(); // Clears all inputs
                break;
            case '⌫':
                deleteLastChar(); // Deletes last character
                break;
            case '=':
                evaluateExpression(); // Evaluates expression (modified currentInput)
                break;
            default:
                appendValue(value); // Appends other buttons value to currentInput
        }

        updateDisplay(); // Update the display after each press
    };

    // Function to add event listeners to buttons and connect buttons data-value with JS
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
            handleButtons(button.dataset.value);  // Grabs custom value in data- of HTML button elements and passes it as an argument
        });
    });

    updateDisplay(); // Runs the function to update the display
});
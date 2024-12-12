document.addEventListener('DOMContentLoaded', () => {
    const recentHistoryDisplay = document.getElementById('recent-history'); // Get recent-history element
    const resultDisplay = document.getElementById('result'); // Get result element

    let currentInput = ''; // What user types
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
            currentInput = math.format(result, { precision: 14 }); // Format result to avoid floating-point issues. CHAT GPT ADVISED HOTFIX SINCE I CAN'T MAKE DECIMAL.JS WORK
        } catch (error) {
            currentInput = 'error'; // If math.js fails, show an error message
        }
    };

    // Append buttons' values to current input
    const appendValue = (value) => {
        if (operators.includes(value)) { // Checks if the value is an operator
            if (operators.includes(currentInput.slice(-1))) { // If the last character is already an operator
                currentInput = currentInput.slice(0, -1) + value; // Replace the last operator with the new one
            } else {
                currentInput += value; // Append the operator to the current input
            }
        } else {
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
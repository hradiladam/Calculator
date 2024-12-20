document.addEventListener('DOMContentLoaded', () => {
    const recentHistoryDisplay = document.getElementById('recent-history'); // Get recent-history element
    const resultDisplay = document.getElementById('result'); // Get result element

    let currentInput = '0'; // What user types
    let recentHistory = ''; // Stores the previous operation
    let lastButtonWasEquals = false; // Flag to track if the last button pressed was '='

    const operators = ['+', '-', '×', '÷']; // List of operators


    // Function to update the display of calculator
    const updateDisplay = () => {
        recentHistoryDisplay.textContent = recentHistory || 'Empty'; // Show either recent history or 'Empty' in recent-history display
        resultDisplay.textContent = currentInput || '0'; // Show either current input or '0' in result display
    };


    // Function to clear all inputs
    const clearAll = () => {
        currentInput = '0'; // Reset the current input
        recentHistory = ''; // Reset the recent history
        lastButtonWasEquals = false; // Reset the equals flag
    };


    // Function to delete the last character (or operator with spaces)
const deleteLastChar = () => {
    // Check if the last characters match the pattern ' operator ' (e.g., ' + ')
    if (/\s[+\-×÷]\s$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -3); // Remove the operator and surrounding spaces
    } else {
        currentInput = currentInput.slice(0, -1); // Otherwise, remove the last character
    }

    // Ensure currentInput doesn't end up empty
    if (currentInput === '') {
        currentInput = '0';
    }
};


    // Function to evaluate calculation 
    // CHAT GPT creation to try and fix inherit JS problems with math.js that I can't fix myself - I am not that good at math 
    const evaluateExpression = () => {
        try {
            // Replace operators for math.js compatibility
            let expression = currentInput
                .replace(/×/g, '*') // Change '×' into '*' for math.js
                .replace(/÷/g, '/'); // Change '÷' into '/' for math.js
    
            // Handle percentages contextually
            expression = expression.replace(/(\d+(\.\d+)?)(\s*[-+*/]\s*)(\d+(\.\d+)?)%/g, (match, base, _, operator, percentage) => {
                return `${base} ${operator} (${base} * ${percentage} * 0.01)`;
            });
    
            // Evaluate the corrected expression
            let result = math.evaluate(expression);
    
            // Format result
            let formattedResult;
    
            // Updated thresholds for scientific notation
            const SCIENTIFIC_NOTATION_THRESHOLD = 1e15; // Numbers >= 10^15 switch to scientific notation
            const MINIMUM_THRESHOLD = 1e-15; // Numbers <= 10^-15 switch to scientific notation
            const MAX_DECIMAL_LENGTH = 15; // Number of decimal places
    
            // If result is too large or too small, convert to scientific notation
            if (
                Math.abs(result) >= SCIENTIFIC_NOTATION_THRESHOLD ||
                (Math.abs(result) <= MINIMUM_THRESHOLD && result !== 0)
            ) {
                formattedResult = result.toExponential(3); // Format to 3 significant digits in scientific notation
            } else {
                // Otherwise, use fixed-point format
                formattedResult = result
                    .toFixed(MAX_DECIMAL_LENGTH) // Format to 7 decimal places
                    .replace(/(\.\d*?)0+$/, '$1') // Trim trailing zeros
                    .replace(/\.$/, ''); // Avoid ending with a period
            }
    
            // Update the history and current input
            recentHistory = `${currentInput} =`; // Update history
            currentInput = formattedResult; // Update input to the result
            lastButtonWasEquals = true; // Set the equals flag
        } catch (error) {
            currentInput = 'format error'; // Show error on invalid expressions
        }
    };
    
    


    // Function to handle appending values
    const appendValue = (value) => {
        if (lastButtonWasEquals) {
            handleEqualsFollowUp(value);
            return;
        }
    
        if (/[0-9]/.test(value)) {
            handleNumber(value);
            return;
        }
    
        if (operators.includes(value)) {
            handleOperator(value);
            return;
        }
    
        if (value === '%') { 
            handlePercentage();
            return;
        }
    
        if (value === '.') {
            handleDecimal(value);
            return;
        }
    
        if (value === '( )') {
            handleParentheses(value);
            return;
        }
    };


    /*
        Helper functions for specific button presses
    */

    //Function to handle if the '=' flag is set to true
    const handleEqualsFollowUp = (value) => {
        if (value === '( )') {
            // Append '(' directly after '='
            currentInput += '(';
        } else if (/[0-9]/.test(value)) {
            // If a number is pressed, reset the input to just the number
            currentInput = value;
        } else if (value === '%') {
            // Append '%' directly without spaces
            currentInput += '%';
        } else {
            // For operators or other values, append them with spaces
            currentInput += ` ${value} `;
        }
    
        // Reset the equals flag to allow normal behavior afterward
        lastButtonWasEquals = false;
    };

    // Handle numbers if the '=' flag is false
    const handleNumber = (value) => {
        // If the current input is just "0" and a number is pressed, replace it
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    };

    // Handle operators
    const handleOperator = (value) => {
        // Trim trailing spaces to focus on the meaningful part of the input
        const trimmedInput = currentInput.trim();

        // Prevent operator after '(' (allowing '-' after it)
        if (trimmedInput.slice(-1) === '(' && value !== '-') {
            return;
        }

        // Make '-' the only oeprator that replaces default zero
        if (trimmedInput === '0' && value === '-') {
            currentInput = '-';
        }

        // Prevent multiple consecutive operators
        if (operators.includes(trimmedInput.slice(-1))) {
            // Replace the last operator with the new one
            currentInput = trimmedInput.slice(0, -1) + ` ${value} `; 
        } else {
            currentInput = `${trimmedInput} ${value} `;
        }

    };


    // Handle percentages
    const handlePercentage = () => {
        // Trim trailing spaces to focus on the meaningful part of the input
        const trimmedInput = currentInput.trim();
    
        // If the input ends with an operator (including space), replace the operator and trailing space with '%'
        if (/\s[+\-×÷]\s$/.test(currentInput)) {
            currentInput = trimmedInput.slice(0, -2) + '%'; // Remove ' operator ' and append '%'
            return;
        }
    
        // Prevent invalid placement of '%' (e.g., directly after '(')
        if (trimmedInput.slice(-1) === '(') {
            return;
        }
    
        // Append '%' if it's in a valid position
        currentInput += '%';
    };
    

    // handle the decimal point
    const handleDecimal = (value) => {

         // Prevent pressing '.' after an operator with space
        if (currentInput.slice(-1) === ' ') {
            return;
        }
        
        const lastNumber = currentInput.split(/[\+\-\×\÷]/).pop(); // Get the last number segment
        if (!lastNumber.includes('.')) {
            currentInput += value; // Append the decimal point only if not already present
        }
    };

    // Handle parentheses
    const handleParentheses = () => {
        const openParentheses = (currentInput.match(/\(/g) || []).length;
        const closedParentheses = (currentInput.match(/\)/g) || []).length;
    
        // If the input is '0', replace it with '('
        if (currentInput === '0') {
            currentInput = '(';
            return;
        }
    
        // Add opening parenthesis if it's appropriate
        if (
            operators.includes(currentInput.trim().slice(-1)) ||
            currentInput.trim().slice(-1) === '(' ||
            currentInput === ''
        ) {
            currentInput += '(';
            return;
        }
    
        // Add closing parenthesis only if there are unmatched opening parentheses
        if (openParentheses > closedParentheses) {
            currentInput += ')';
            return;
        }
    
        // Default to adding an opening parenthesis
        currentInput += '(';
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
        // Only add event listener to buttons that are not the theme switch button
        if (button.id !== 'theme-switch') {
            button.addEventListener('click', () => {
                handleButtons(button.dataset.value);  // Grabs custom value in data- of HTML button elements and passes it as an argument
            });
        }
    });

    updateDisplay(); // Runs the function to update the display


    // Function to switch theme between light and dark
    const switchTheme = () => {
        const body = document.body;
        const themeSwitchButton = document.querySelector('#theme-switch');

        body.classList.toggle('dark-theme')
        if (body.classList.contains('dark-theme')) {
            themeSwitchButton.innerHTML = '<i class="fa-regular fa-sun"></i>';
        } else {
            themeSwitchButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    const themeSwitchButton = document.getElementById('theme-switch');
    themeSwitchButton.addEventListener('click', switchTheme);

});

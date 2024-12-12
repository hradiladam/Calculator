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
                .replace(/÷/g, '/'); // Change '÷' into '/' for math.js
    
            // Use math.js to evaluate the expression
            const result = math.evaluate(expression); // math.evaluate() evaluates the expression safely
    
            // Check the length of the integer part for deciding the format (CHAT GPT CREATION, because I don't understand how Math.js works yet)
            const integerPart = Math.abs(result).toFixed(0); // Get the integer part as a string
            const formattedResult =
                integerPart.length > 11 // Check if the integer part has more than 11 digits
                    ? result.toExponential(5) // Use scientific notation with 5 significant digits
                    : Number(result).toFixed(14).replace(/\.?0+$/, ''); // Use fixed-point and remove trailing zeros for others
    
            recentHistory = `${currentInput}=`; // Add '=' at the end of recentHistory for better visual effect
            currentInput = formattedResult; // Store formatted result in currentInput
            lastButtonWasEquals = true; // Set the flag to true
        } 
        
        catch (error) {
            currentInput = 'error'; // If math.js fails, show an error message
        }
    };



    // Function for appending values of numbers, parentheses and decimal point
    const appendValue = (value) => {
    
        // If last action was '=' and the value is a number, start new input
        if (lastButtonWasEquals && /[0-9]/.test(value)) {
            currentInput = value; // Replace current input with the new number
            lastButtonWasEquals = false; // Reset the flag
            return;
        }

        // Remove the default zero if the user starts typing a number
        else if (currentInput === '0' && /[0-9]/.test(value)) { // Checks if the value is a number for 0 to 9
            currentInput = value; // Start the number without a leading zero
            return;
        }

        // Logic for decimal points
        else if (value === '.') {
            // Takes initial 0 always into account
            if (currentInput === '0') {
                currentInput += value
            } 
            
            // Check if the last character is a number and the current input doesn't already have a decimal point
            // Also, ensure the last character is not an operator or parentheses
            else if (/[0-9]$/.test(currentInput) && !/[+\-×÷=()]$/.test(currentInput)) {
                // Check if there's no decimal already in the number
                if (!/\.[0-9]*$/.test(currentInput)) {
                    currentInput += value; // Append the decimal point
                }
            } 
            
            else {
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
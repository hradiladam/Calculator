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
    
            // Format result to handle both small and large numbers
            const formattedResult = 
                integerPart.length > 11 // If the integer part has more than 11 digits, use scientific notation
                    ? result.toExponential(5) // Use scientific notation with 5 significant digits
                    : result.toFixed(7).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, ''); // Remove trailing zeros and avoid ending with a decimal point
    
            recentHistory = `${currentInput}=`; // Add '=' at the end of recentHistory for better visual effect
            currentInput = formattedResult; // Store formatted result in currentInput
            lastButtonWasEquals = true; // Set the flag to true
        } 
        catch (error) {
            currentInput = 'error'; // If math.js fails, show an error message
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
            handlePercentage(value);
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
        if (/[0-9]/.test(value)) {
            currentInput = value; // If a number is pressed, reset the result display and input the number 
        } else {
            currentInput += ' ' + value + ' '; // Append an operator or another spacial character
        }
        lastButtonWasEquals = false; // Reset flag!
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
        // Prevent operator after '(' (allowing '-' after it)
        if (currentInput.slice(-1) === '(' && value !== '-') {
            return;
        }

        // Make '-' the only oeprator that replaces default zero
        if (currentInput === '0' && value === '-') {
            currentInput = '-';
        }

        // Prevent multiple consecutive operators
        if (operators.includes(currentInput.slice(-1))) {
            currentInput = currentInput.slice(0, -1) + value; // Replace the last operator
        } else {
            currentInput += ' ' + value + ' '; // Append the new operator
        }

    };

    // Handle percentage button
    const handlePercentage = (value) => {
        // Prevent consecutive percentages
        if (currentInput.slice(-1) === '%') {
            return;
        }
        currentInput += value; // Append the percentage symbol
    };

    // handle the decimal point
    const handleDecimal = (value) => {
        const lastNumber = currentInput.split(/[\+\-\×\÷]/).pop(); // Get the last number segment
        if (!lastNumber.includes('.')) {
            currentInput += value; // Append the decimal point only if not already present
        }
    };

    // Handle parentheses
    const handleParentheses = () => {
        const openParentheses = (currentInput.match(/\(/g) || []).length;
        const closedParentheses = (currentInput.match(/\)/g) || []).length;

        if (lastButtonWasEquals) {
            currentInput = '('; // When equals was pressed, reset the input to '('
            lastButtonWasEquals = false; // Reset flag after using parentheses
            return;
        }

        if (currentInput === '0') {
            currentInput = '('; // Replace default zero with '('
            return;
        }

        if (operators.includes(currentInput.slice(-1)) || currentInput.slice(-1) === '(' || currentInput === '') {
            currentInput += '('; // Add an opening parenthesis
            return;
        }

        if (openParentheses > closedParentheses) {
            currentInput += ')'; // Add a closing parenthesis if it balances the existing open parentheses
            return;
        }

        currentInput += '('; // Default to adding an opening parenthesis
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

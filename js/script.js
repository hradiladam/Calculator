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
        // If the last button was "=", and a number is pressed, reset the input
        if (lastButtonWasEquals) {
            if (/[0-9]/.test(value)) {
                currentInput = value; // Start fresh with the number
            } else {
                currentInput += value; // Allow appending an operator or special character
            }
            lastButtonWasEquals = false;
            return;
        }
    
        // If the current input is just "0" and a number is pressed, replace it
        if (currentInput === '0' && /[0-9]/.test(value)) {
            currentInput = value;
            return;
        }
    
        // Handle appending numbers after an operator
        if (operators.includes(currentInput.slice(-1)) && /[0-9]/.test(value)) {
            currentInput += value; // Append the number directly after the operator
            return;
        }
    
        // Prevent multiple consecutive operators
        if (operators.includes(value)) {
            if (operators.includes(currentInput.slice(-1))) {
                currentInput = currentInput.slice(0, -1) + value; // Replace the last operator
            } else {
                currentInput += value; // Append the new operator
            }
            return;
        }
    
        // Logic for handling decimal points
        if (value === '.') {
            const lastNumber = currentInput.split(/[\+\-\×\÷]/).pop(); // Get the last number segment
            if (!lastNumber.includes('.')) {
                currentInput += value; // Append the decimal point only if not already present
            }
            return;
        }
    
        // Handle parentheses
        if (value === '( )') {
            const openParentheses = (currentInput.match(/\(/g) || []).length;
            const closedParentheses = (currentInput.match(/\)/g) || []).length;
            if (operators.includes(currentInput.slice(-1)) || currentInput === '') {
                currentInput += '('; // Add an opening parenthesis
            } else if (openParentheses > closedParentheses) {
                currentInput += ')'; // Add a closing parenthesis
            } else {
                currentInput += '('; // Default to adding an opening parenthesis
            }
            return;
        }
    
        // Append all other valid values
        currentInput += value;
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


    // Function to switch theme betwen light and dark
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



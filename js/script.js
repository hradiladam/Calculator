document.addEventListener('DOMContentLoaded', () => {
    const recentHistoryDisplay = document.getElementById('recent-history'); // Get recent-history element
    const resultDisplay = document.getElementById('result'); // Get result element

    let currentInput = ''; // What user types
    let recentHistory = ''; // Stores the previous operation
    let lastActionWasEquals = false; // Flag that will track if the last action was '=' for reset

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
        currentInput = currentInput.slice(0, -1); // Return the currentIput minus the last character
    };


    // Function to evaluate calculation
    const evaluateExpression = () => {
        try {expression = currentInput
                .replace(/×/g, '*') // Change '×' into '*' for eval()
                .replace(/÷/g, '/') // Change '÷' into '/' for eval()
                .replace(/−/g, '-'); // Change '−' into '-' for eval()
            recentHistory = `${currentInput}=`; // Add '=' at the end of recentHistory for better visual effect
            currentInput = eval(expression).toString(); // Evaluate the expression and store the result as string
            lastActionWasEquals = true; // Change flag to mark that the last action was '='
        } catch {
            currentInput = 'error you dumbass' // Motivational error message
        }
    };


    // Append buttons' values to current input
    const appendValue = (value) => {
    
        if (lastActionWasEquals) { // Assigns a new value if the last action was '='
            currentInput = value;
            recentHistory = '';
            lastActionWasEquals = false; // Resets the flag
        } 
        
        else if (operators.includes(value)) { // Checks if an input is one of the four operators
            if (operators.includes(currentInput.slice(-1))) { // Checks if the last character of currentInput is already an operator
                currentInput = currentInput.slice(0, -1) + value; // Corrected slice
            } else {
                currentInput += value; // If the last character is not an operator, it appends the value
            }
        } else {
            currentInput += value; // Appends other button values (numbers, etc.)
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
        };


        updateDisplay(); // Update the display after each press
    };


    // Function to add event listeners to buttons and connect buttons data-value with JS
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
            handleButtons(button.dataset.value);  // Grabs custom value in data- of html button elements ad passes it as an argument
        });
    });

    updateDisplay(); // Runs the function to update the display
    
});


/*
KNOWN ISSUES
1. USE SOMETHING ELSE BUT CALC(), CALC() DOESNT DO DECIMAL POINTS WELL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
2.  % DOESNT WORK YET
3. () DOESNT WORK YET
4., WHEN I PRESS AN OPERATOR AFTER AN OPERATOR THE FIRST ONE MUST DISAPPEAR
5. IF 0 IS PRESSED AND THAN ANOTHER NUMBER IS PRESSED, I WANT THE 0 TO GET DELETED FROM THE RESULT DISPLAY, BUT IF + - / * IS PRESSED FIRST, I WANT THE INITIAL DEFAULT ZERO TO BE TAKEN INTO ACCOUNT
6. IF 0 IS PRESSED MULTIPLE TIMES FIRST, I WANT THE CLICK TO BE IGNORED SO THERE ISNT A STREAM OF ZEROES
*/


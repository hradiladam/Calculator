document.addEventListener('DOMContentLoaded', () => {
    const recentHistoryDisplay = document.getElementById('recent-history'); // Get recent-history element
    const resultDisplay = document.getElementById('result'); // Get result element

    let currentInput = ''; // What user types
    let recentHistory = ''; // Stores the previous operation
    let lastActionWasEquals = false; // Flag that will track if the last action was '=' for reset

 
    // Function to update the display of calculator
    const updateDisplay = () => {
        recentHistoryDisplay.textContent = recentHistory || 'Empty'; // Show either recent history or 'Empty' in recent-history display
        resultDisplay.textContent = currentInput || '0'; // Show either current input or '0' in result display
    };


  
    // Function to handle button clicks
    const handleButtons = (value) => {
        if (value === 'AC') {
            currentInput = '';
            recentHistory = '';
        } else if (value === '⌫') {
            currentInput = currentInput.slice(0, -1);
        } else if (value === '=') {
            try {
                const correctedInput = currentInput
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');
                recentHistory = `${currentInput}=`;
                currentInput = eval(correctedInput).toString();
                lastActionWasEquals = true;
            } catch (error) {
                currentInput = 'Error';
            }
        } else {
            if (lastActionWasEquals) {
                currentInput = value;
                recentHistory = '';
                lastActionWasEquals = false;
            } else {
            currentInput += value;
            };
        };

        updateDisplay(); // Update the display after each press
    };


    // Function to add event listeners to buttons and connect buttons data-value with JS
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
            handleButtons(button.dataset.value);  
        });
    });

    updateDisplay(); // Runs the function to update the display
    
});




// IF 0 IS PRESSED AND THAN ANOTHER NUMBER IS PRESSED, I WANT THE 0 TO GET DELETED FROM THE RESULT DISPLAY, BUT IF + - / * IS PRESSED FIRST, I WANT THE INITIAL DEFAULT ZERO TO BE TAKEN INTO ACCOUNT
// IF 0 IS PRESSED MULTIPLE TIMES FIRST, I THE CLICK TO BE IGNORED SO THER EISNT A STREAM OF ZEROES
// IF + - / * IS PRESSED MULTIPOLE TIMES, IT SHOULD ALWAYS IGNORE ADDITIONAL CLICKS
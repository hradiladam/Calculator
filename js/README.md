# Calculator Project

This is a simple calculator built using HTML, CSS, and JavaScript.

## Features

- **Basic operations:** Addition, subtraction, multiplication, division.
- **Percentage** Allows percentage calculations.
- **Decimal Support:** Enables precise decimal calculations.
- **Parentheses Support:** Lets you group operations for more complex expressions.
- **Clear & Delete:** "AC" to clear inputs and remove "format error" message, while "⌫" to delete the last character.
- **Theme Toggle:** Switch between light and dark themes.
- **Format Error Handling:** Invalid input formats result in a "format error" message.

## Technologies Used

- HTML
- CSS
- JavaScript for handling the logic and user interactions
- Math.js for evaluating complex expressions

## How to Use

1. Open the index.html file in a browser. 

Alternatively Open the application directly in your browser by visiting the following link: [Calculator](https://hradiladam.github.io/Calculator/)

## Features in Detail

- **Basic operations:** Basic operations are evaluated using Math.js to ensure accurate calculations. 
- **Percentage:** Percentage calculations are handled by Math.js, however custom logic manages with custom logic to manage consecutive percentages as implicit multiplication, following the standard behavior used by most calculators. Scenarios like e.g., 50%50% or 50%6 are therefore treated as 50% * 50% and 50% * 6.
- **Number Formatting and Rounding:** To avoid precision errors, such as when calculating 9.2 - 9 resulting in 0.199999999999998, numbers are rounded to a maximum of 12 decimal places. This rounding prevents misleadingly long decimal results. Additionally, trailing zeros are removed to display a clean, concise result, ensuring that values like 5.6000 appear as 5.6 rather than 5.6000. 
- **Scientific Notation:** Results that are too large or too small are formatted using scientific notation. If a result exceeds 10^15 or is smaller than 10^-15, it will be shown in scientific notation with three decimal places (e.g., 1.23e+15 or 1.23e-15).
Complex 
- **Regular Expressions:** Instead of using traditional loops, complex regular expressions are employed throughout the calculator since I found they offer more concise and expressive way to handle certain tasks, such as parsing and transforming mathematical expressions. 

## Acknowledgements

- [math.js](https://mathjs.org/) - For simplifying mathematical expression evaluation.
- [Font Awesome](https://fontawesome.com/) - For providing the icons used in the theme switcher.

---

> This project is a work in progress. I’m continuing to learn and improve my skills, and I plan to keep updating this project as I progress.

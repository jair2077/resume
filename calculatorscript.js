
const screen = document.getElementById("screen");
const expression = document.getElementById("expression");
const buttons = document.querySelectorAll(".btn");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetScreen = false;

function updateScreen() {
    screen.textContent = currentValue;
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    shouldResetScreen = false;
    expression.textContent = "";
    updateScreen();
}

function inputNumber(number) {
    if (currentValue === "Ошибка") {
        clearCalculator();
    }

    if (shouldResetScreen) {
        currentValue = number;
        shouldResetScreen = false;
    } else {
        currentValue =
            currentValue === "0" ? number : currentValue + number;
    }

    updateScreen();
}

function inputDot() {
    if (shouldResetScreen) {
        currentValue = "0";
        shouldResetScreen = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateScreen();
}

function chooseOperator(nextOperator) {
    if (currentValue === "Ошибка") return;

    const value = Number(currentValue);

    if (operator && !shouldResetScreen) {
        calculate();
    }

    previousValue = Number(currentValue);
    operator = nextOperator;
    shouldResetScreen = true;

    expression.textContent =
        `${previousValue} ${getOperatorSymbol(operator)}`;
}

function calculate() {
    if (operator === null || previousValue === null) return;

    const current = Number(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = previousValue + current;
            break;
        case "-":
            result = previousValue - current;
            break;
        case "*":
            result = previousValue * current;
            break;
        case "/":
            if (current === 0) {
                currentValue = "Ошибка";
                expression.textContent = "Деление на ноль";
                previousValue = null;
                operator = null;
                shouldResetScreen = true;
                updateScreen();
                return;
            }
            result = previousValue / current;
            break;
    }

    expression.textContent =
        `${previousValue} ${getOperatorSymbol(operator)} ${current} =`;

    currentValue = String(Number(result.toPrecision(12)));
    previousValue = null;
    operator = null;
    shouldResetScreen = true;

    updateScreen();
}

function getOperatorSymbol(value) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[value] || value;
}

function deleteLast() {
    if (shouldResetScreen || currentValue === "Ошибка") {
        currentValue = "0";
        shouldResetScreen = false;
    } else {
        currentValue =
            currentValue.length > 1
                ? currentValue.slice(0, -1)
                : "0";
    }

    updateScreen();
}

function calculatePercent() {
    currentValue = String(Number(currentValue) / 100);
    updateScreen();
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            if ("+-*/".includes(value)) {
                chooseOperator(value);
            } else {
                inputNumber(value);
            }
            return;
        }

        switch (action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteLast();
                break;
            case "dot":
                inputDot();
                break;
            case "percent":
                calculatePercent();
                break;
            case "equals":
                calculate();
                break;
        }
    });
});

// Управление с клавиатуры
document.addEventListener("keydown", event => {
    if (/^[0-9]$/.test(event.key)) {
        inputNumber(event.key);
    }

    if (event.key === ".") {
        inputDot();
    }

    if ("+-*/".includes(event.key)) {
        chooseOperator(event.key);
    }

    if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    if (event.key === "Backspace") {
        deleteLast();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }
});

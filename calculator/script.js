class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.TAX_RATE = 0.1; // 10%
        this.MAX_DIGITS = 12; // 最大桁数
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
    }

    appendNumber(number) {
        // 現在の数値の桁数をチェック
        const currentString = this.currentOperand.toString();
        const [integerPart, decimalPart] = currentString.split('.');
        const currentDigits = (integerPart.replace(/,/g, '')).length + (decimalPart ? decimalPart.length : 0);

        // 最大桁数を超える場合は追加しない
        if (currentDigits >= this.MAX_DIGITS && number !== '.') return;
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('0で割ることはできません');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // 計算結果を12桁に制限
        const resultString = computation.toString();
        const [intPart, decPart] = resultString.split('.');
        if (intPart.length > this.MAX_DIGITS) {
            computation = parseFloat(intPart.slice(0, this.MAX_DIGITS));
        } else if (decPart && (intPart.length + decPart.length) > this.MAX_DIGITS) {
            const maxDecimalPlaces = this.MAX_DIGITS - intPart.length;
            computation = parseFloat(computation.toFixed(maxDecimalPlaces));
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    calculateTax(includeTax) {
        const amount = parseFloat(this.currentOperand);
        if (isNaN(amount)) return;

        let result;
        if (includeTax) {
            // 税込み計算
            result = amount * (1 + this.TAX_RATE);
        } else {
            // 税抜き計算
            result = amount / (1 + this.TAX_RATE);
        }

        // 結果を12桁に制限
        const resultString = result.toString();
        const [intPart, decPart] = resultString.split('.');
        if (intPart.length > this.MAX_DIGITS) {
            result = parseFloat(intPart.slice(0, this.MAX_DIGITS));
        } else if (decPart && (intPart.length + decPart.length) > this.MAX_DIGITS) {
            const maxDecimalPlaces = this.MAX_DIGITS - intPart.length;
            result = parseFloat(result.toFixed(maxDecimalPlaces));
        }

        this.currentOperand = result.toString();
    }

    updateDisplay() {
        const currentOperandElement = document.querySelector('.current-operand');
        const previousOperandElement = document.querySelector('.previous-operand');

        currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            const operationSymbol = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            }[this.operation];
            previousOperandElement.textContent = `${this.formatNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('ja-JP');
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
}

const calculator = new Calculator();

// イベントリスナーの設定
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="tax-include"]').addEventListener('click', () => {
    calculator.calculateTax(true);
    calculator.updateDisplay();
});

document.querySelector('[data-action="tax-exclude"]').addEventListener('click', () => {
    calculator.calculateTax(false);
    calculator.updateDisplay();
}); 
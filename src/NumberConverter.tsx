import React, { useState, useEffect } from 'react';
import './NumberBaseConverter.css';

const NumberConverter: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [fromBase, setFromBase] = useState<string>('decimal');
    const [toBase, setToBase] = useState<string>('decimal');
    const [result, setResult] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedHistory = localStorage.getItem('conversionHistory');
        const savedTheme = localStorage.getItem('darkMode');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
        if (savedTheme) {
            setDarkMode(JSON.parse(savedTheme));
        }
    }, []);

    const isValidInput = (value: string): boolean => {
        if (fromBase === 'binary') return /^[01]+(\.[01]+)?$/.test(value);
        if (fromBase === 'hexadecimal') return /^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/.test(value);
        if (fromBase === 'octal') return /^[0-7]+(\.[0-7]+)?$/.test(value);
        if (fromBase === 'decimal') return /^[0-9]+(\.[0-9]+)?$/.test(value);
        return false;
    };

    const convert = (): void => {
        if (!isValidInput(inputValue)) {
            setResult('Invalid input for the selected base');
            return;
        }

        let decimalValue: number | null = null;
        try {
            if (fromBase === 'decimal') {
                decimalValue = parseFloat(inputValue);
            } else if (fromBase === 'binary') {
                decimalValue = parseInt(inputValue, 2);
            } else if (fromBase === 'hexadecimal') {
                decimalValue = parseInt(inputValue, 16);
            } else if (fromBase === 'octal') {
                decimalValue = parseInt(inputValue, 8);
            }
        } catch (error) {
            setResult('Error in conversion');
            return;
        }

        if (decimalValue === null || isNaN(decimalValue)) {
            setResult('Conversion failed');
            return;
        }

        let convertedValue: string = '';
        if (toBase === 'decimal') {
            convertedValue = decimalValue.toString(10);
        } else if (toBase === 'binary') {
            convertedValue = decimalValue.toString(2);
        } else if (toBase === 'hexadecimal') {
            convertedValue = decimalValue.toString(16).toUpperCase();
        } else if (toBase === 'octal') {
            convertedValue = decimalValue.toString(8);
        }

        const finalResult = `${convertedValue}`;
        setResult(finalResult);
        addToHistory(finalResult);
    };

    const addToHistory = (conversion: string) => {
        const newHistory = [conversion, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            alert('Result copied to clipboard!');
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
    };

    useEffect(() => {
        if (inputValue) {
            convert();
        }
    }, [inputValue, fromBase, toBase]);

    return (

        <div className={`converter-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="logo-container">
                <div className="logo-text">Number <span>Converter</span></div>
            </div>

            <div className="theme-toggle">
                <button className="theme-button" onClick={toggleTheme}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>

            <input
                type="text"
                id="inputValue"
                className="converter-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number to convert here"
                onKeyDown={(e) => e.key === 'Enter' && convert()}
            />

            <h3>Convert From</h3>
            <select
                id="fromBase"
                className="converter-select"
                value={fromBase}
                onChange={(e) => setFromBase(e.target.value)}
            >
                <option value="decimal">Decimal</option>
                <option value="binary">Binary</option>
                <option value="hexadecimal">Hexadecimal</option>
                <option value="octal">Octal</option>
            </select>

            <h3>Convert To</h3>
            <select
                id="toBase"
                className="converter-select"
                value={toBase}
                onChange={(e) => setToBase(e.target.value)}
            >
                <option value="decimal">Decimal</option>
                <option value="binary">Binary</option>
                <option value="hexadecimal">Hexadecimal</option>
                <option value="octal">Octal</option>
            </select>


            <button className="convert-button" onClick={convert}>Convert</button>
            <button className="copy-button" onClick={copyToClipboard}>Copy to Clipboard</button>

            <div className="converter-result">{result}</div>

        </div>
    );
};

export default NumberConverter;

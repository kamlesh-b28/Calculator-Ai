
let expression = "";

const resultBox = document.getElementById("result");
const expressionBox = document.getElementById("expression");

function add(value) {
  if (expression.length >= 100) return;
  expression += value;
  resultBox.textContent = expression;
  expressionBox.textContent = "Your calculation";
}

function clearCalc() {
  expression = "";
  resultBox.textContent = "0";
  expressionBox.textContent = "Ready to calculate";
}

function backspace() {
  expression = expression.slice(0, -1);
  resultBox.textContent = expression || "0";
}

function calculate() {
  try {
    if (!expression.trim()) return;

    // Only allow numbers and calculator operators.
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid calculation");
    }

    const value = Function(
      '"use strict"; return (' + expression + ')'
    )();

    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Invalid result");
    }

    expressionBox.textContent = expression + " =";
    expression = String(Number(value.toPrecision(12)));
    resultBox.textContent = expression;
  } catch {
    expressionBox.textContent = "Please check your calculation";
  }
}

function square() {
  if (!expression) return;
  try {
    calculate();
    const value = Number(expression);
    expression = String(value * value);
    resultBox.textContent = expression;
    expressionBox.textContent = "Square of the number";
  } catch {
    expressionBox.textContent = "Invalid number";
  }
}

function squareRoot() {
  if (!expression) return;

  try {
    calculate();
    const value = Number(expression);
    if (value < 0) throw new Error("Negative number");

    expression = String(Number(Math.sqrt(value).toPrecision(12)));
    resultBox.textContent = expression;
    expressionBox.textContent = "Square root";
  } catch {
    expressionBox.textContent = "Enter a valid non-negative number";
  }
}

function example(text) {
  document.getElementById("question").value = text;
}

async function askAI() {
  const question = document.getElementById("question").value.trim();
  const status = document.getElementById("status");
  const answer = document.getElementById("answer");
  const button = document.getElementById("askBtn");

  if (!question) {
    status.textContent = "Please enter a maths question.";
    return;
  }

  button.disabled = true;
  status.textContent = "AI is thinking...";
  answer.textContent = "";

  try {
    const response = await fetch("/api/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed.");
    }

    answer.textContent = data.answer;
    status.textContent = "Answer ready. Please verify your result.";
  } catch (error) {
    status.textContent =
      error.message.includes("Failed to fetch")
        ? "AI backend is not connected yet. Follow Step 5."
        : error.message;
  } finally {
    button.disabled = false;
  }
}

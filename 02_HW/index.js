document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1;
let txt2;
let btn;
let lblRes;
let operator;


function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.getElementById("txt2");
    operator = document.getElementById("operator");
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");

    btn.addEventListener("click", calculate);

    // Register second button click
    const btn2 = document.getElementById("btn2");
    btn2.addEventListener("click", () => {
        print("btn2 clicked: " + btn2.id + " | " + btn2.innerHTML);
    });
}

// =============================================
// CALCULATOR
// =============================================
function calculate() {
    let num1 = Number(txt1.value);
    let num2 = Number(txt2.value);
    let op = operator.value;

    txt1.classList.remove("is-valid", "is-invalid");
    txt2.classList.remove("is-valid", "is-invalid");

    if (!isNaN(num1)) txt1.classList.add("is-valid");
    else txt1.classList.add("is-invalid");

    if (!isNaN(num2)) txt2.classList.add("is-valid");
    else txt2.classList.add("is-invalid");

    if (isNaN(num1) || isNaN(num2)) {
        lblRes.innerText = "Please enter valid numbers!";
        return;
    }

    let res;

    switch (op) {
        case "+":
            res = num1 + num2;
            break;
        case "-":
            res = num1 - num2;
            break;
        case "*":
            res = num1 * num2;
            break;
        case "/":
            if (num2 === 0) {
                lblRes.innerText = "Cannot divide by zero!";
                return;
            }
            res = num1 / num2;
            break;
    }

    lblRes.innerText = res;

    // Log the full exercise in the textarea
    print(`${num1} ${op} ${num2} = ${res}`, true);
}


// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) { return fn(a, b); }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    // Print to log
    print(out);
}

// =============================================
// HELPER: PRINT TO TEXTAREA
// =============================================
function print(msg, append = false) {
    const ta = document.getElementById("output");

    if (!ta) {
        console.log(msg);
        return;
    }

    if (append) {
        ta.value += msg + "\n";
    } else {
        ta.value = msg;
    }
}
const initApp = () => {
  const currentValueElem = document.querySelector(".display-current");

  const previousValueElem = document.querySelector(".display-equals");
  let itemArray = [];

  const equationArray = [];
  let newNumberFlag = false;

  const inputButtons = document.querySelectorAll(".number");
  console.log(inputButtons);
  inputButtons.forEach((numButton) => {
    numButton.addEventListener("click", (event) => {
      const newInput = event.target.textContent;
      console.log(newInput);
      if (newNumberFlag) {
        currentValueElem.value = newInput;
        newNumberFlag = false;
      } else {
        console.log(currentValueElem.value);
        currentValueElem.value =
          currentValueElem.value == 0
            ? newInput
            : `${currentValueElem.value}${newInput}`;
      }
    });
  });

  const clearButton = document.querySelector(".all-clear-entity");
  clearButton.addEventListener("click", () => {
    currentValueElem.value = 0;
    previousValueElem.textContent = "";
    itemArray = [];
  });
  const operations = document.querySelectorAll(".operation");

  operations.forEach((operation) => {
    operation.addEventListener("click", (e) => {
      // equal sign
      if (newNumberFlag) {
        previousValueElem.textContent = "";
        itemArray = [];
      }
      const newOperator = e.target.textContent;
      const currentVal = currentValueElem.value;

      if (!itemArray.length && currentVal == 0) return;

      if (!itemArray.length) {
        itemArray.push(currentVal, newOperator);
        previousValueElem.textContent = `${currentVal}${newOperator}`;
        return (newNumberFlag = true);
      }
      // complete equation
      if (itemArray.length) {
        itemArray.push(currentVal);

        const equationObj = {
          num1: parseFloat(itemArray[0]),
          num2: parseFloat(currentVal),
          op: itemArray[1],
        };

        equationArray.push(equationObj);
        const equationString = `${equationObj["num1"]}${equationObj["op"]}${equationObj["num2"]}`;
        const newValue = calculate(equationString, currentValueElem);

        previousValueElem.textContent = `${newValue} ${newOperator}`;

        itemArray = [newValue, newOperator];
        newNumberFlag = true;
        console.log(equationArray);
      }
    });
  });

  const equalBtn = document.querySelector(".equalto");

  equalBtn.addEventListener("click", () => {
    const currentVal = currentValueElem.value;
    let equationObj;
    if (!itemArray.length && equationArray.length) {
      const lastEquation = equationArray[equationArray.length - 1];

      equationObj = {
        num1: parseFloat(currentVal),
        num2: lastEquation.num2,
        op: lastEquation.op,
      };
    } else if (!itemArray.length) {
      return currentVal;
    } else {
      itemArray.push(currentVal);
      equationObj = {
        num1: parseFloat(itemArray[0]),
        num2: parseFloat(currentVal),
        op: itemArray[1],
      };
    }
    equationArray.push(equationObj);

    const equationString = `${equationObj["num1"]} ${equationObj["op"]}${equationObj["num2"]}`;
    calculate(equationString, currentValueElem);
    previousValueElem.textContent = `${equationString} `;
  });

  const backspaceButton = document.querySelector(".backspace");
  backspaceButton.addEventListener("click", () => {
    currentValueElem.value = currentValueElem.value.slice(0, -1);
  });

  const signChange = document.querySelector(".plus-minus");
  signChange.addEventListener("click", () => {
    currentValueElem.value = parseFloat(currentValueElem.value) * -1;
  });
};

document.addEventListener("DOMContentLoaded", initApp);

function calculate(equation, currentValueElem) {
  const regex = /(^[*/=])|(\s)/g;
  equation.replace(regex, "");

  const divByZero = /(\/0)/.test(equation);
  if (divByZero) return (currentValueElem.value = "cannot divide by zero");
  return (currentValueElem.value = eval(equation));
}

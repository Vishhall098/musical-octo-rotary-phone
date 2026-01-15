const inputSlider = document.querySelector("[data-lengthSlider]");
const lenghtDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_+-={[}]|:;"<,>.?/';

let password = "";
let passwordLenght = 10;
let checkCount = 0;
handleSlider();
function handleSlider() {
  inputSlider.value = passwordLenght;
  lenghtDisplay.innerHTML = passwordLenght;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =(
    (passwordLenght - min) * 100/(max - min) )+ "% 100%";
}
setIndicator("#ccc");

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  //shodow
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpparCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);

  return symbols.charAt(randNum);
}

function calcStrenght() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLenght >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLenght >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML = "copied";
  } catch (e) {
    copyMsg.innerHTML = "failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shrufflePassword(array) {
  // fisher Yates method

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let Str = "";
  array.forEach((el) => (Str += el));
  return Str;
}

inputSlider.addEventListener("input", (e) => {
  passwordLenght = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChhange);
});

function handleCheckBoxChhange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLenght < checkCount) {
    passwordLenght = checkCount;
    handleSlider();
  }
}

generateBtn.addEventListener("click", () => {
  //noe of the checkbox are selected
  if (checkCount == 0) return;

  if (passwordLenght < checkCount) {
    passwordLenght = checkCount;
    handleSlider();
  }

  // let's start the journey to find new password
  console.log("starting the journey");
  //remove old password
  password = "";

  // let's put the stufff mentioned by checkboxes

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpparCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numberCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("compulsory addition done");
  //remaining addition
  for (let i = 0; i < passwordLenght - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  console.log("remaining additon is done");

  //shuffle the password
  password = shrufflePassword(Array.from(password));
  console.log("shrffle passwon done");

  //show in UI
  passwordDisplay.value = password;
  console.log("uI additon done");

  calcStrenght();
});

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDispay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[()]};:"<,.>/?|/'


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle to gray
setIndicator("#ccc")

// set password length and displays it on the UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

// sets the color of the indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generates a random number in the range of min and max
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// this function will get us a random number between 0 and 9
function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
    // this function will get us a number between 97 and 123 and then we are  converting that number into a char
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
    // this function will get us a number between 65 and 91 and then we are  converting that number into a char
}

// we've created a string and it generates a random number in between the length of the string and then we get the char present at that index
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// checks which checkbox are checked and then depending on the conditions it generates the strength and then sets the indicator
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// this function copies the password on to the clipboard and then returns a promise and when this is success we make that copy text visible to the user.
// after that we've used a set timeout method to automatically remove the copied text
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDispay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
// to make copy wla span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 1000);
}

function shufflePassword(array){
    // there is a very famous algorithm fisher yates, which we can apply or array and then we can shuffle the elements of the array
    for(let i = array.length-1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => str += el);
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // special case when all the checkboxes are ticked and then you want the length of password less than the number of checkboxes ticked, then we'll generate the password according to the number of checkbox ticked

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
};

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// when we are moving the slider, the value of the slider is changing and we want to update the UI according to new password length
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// if password is visible or let's say the length of password is > 0 then ony we can copy the password, i.e then only the copy button should work.
copyBtn.addEventListener('click', () => {
    if(passwordDispay.value)
        copyContent();
});



generateBtn.addEventListener('click', () => {
    // if none of the boxes are selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find the new password
    console.log("Starting the Journey");
    // remove old password
    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
// this means we are adding all the elements which are ticked by the user
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
        
    }
    console.log("COmpulsory adddition done");

    // now we'll add the remaining characters just to make password of password length
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
        console.log("randIndex" + randIndex);
    }
    console.log("Remaining adddition done");

    // now we'll shuffle the password

    // here in this we are passing the password as a string so as to apply the fisher yates method to shuffle the array
    password = shufflePassword(Array.from(password));

  // now we've generated the password and now we want to display it in our browser
  console.log("Shuffling done");

  
  passwordDispay.value = password;
  console.log("UI adddition done");

//   now we need to adjust the strength
    calcStrength();

});
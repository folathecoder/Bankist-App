'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Folarin Akinloye',
  movements: [430, 1000, 700, 50, 90, -45, -341],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//TODO: DYNAMICALLY CREATING MOVEMENT ENTRIES

//* CREATE A MOVEMENT FUNCTION

const displayMovements = function (movements, sorted = false) {
  //* REMOVE ALL STARTER MOVEMENT STRUCTURES
  containerMovements.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements; 

  movs.forEach(function (mov, i) {
    //* DETERMINE IF THE MOVEMENT IS A DEPOSIT OR WITHDRAWAL
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //* CREATE HTML STRUCTURE
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--deposit">${
          i + 1
        } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    //* INSERT THE HTML STRUCTURE INTO THE movementContainer

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

//TODO: COMPUTING USERNAMES

const CreateUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
CreateUserName(accounts);

//TODO: COMPUTING ACCOUNT BALANCE
const calcAccountBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//TODO: COMPUTING TOTAL DEPOSITS (IN)
const calcDeposits = function (accs) {
  const deposit = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${deposit}€`;
};

//TODO: COMPUTING TOTAL WITHDRAWALS (OUT)
const calcWithdrawals = function (accs) {
  const withdrawal = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
};

//TODO: ADD INTEREST RATE TO THE DOM
const interestRate = function (accs) {
  const { interestRate: interest } = accs;
  labelSumInterest.textContent = `${interest} %`;
};

//TODO: UI UPDATE

const uiUpdate = function (acc) {
  // 2. Calculate balance
  calcAccountBalance(acc);
  // 3. Calculate Deposits
  calcDeposits(acc);
  // 4. Calculate withdrawals
  calcWithdrawals(acc);
  // 5. Display Interest Rate
  interestRate(acc);
  // 6. Display Movements
  displayMovements(acc.movements);
};

//TODO: IMPLEMENT LOGIN FEATURE

let currentAccount;

//Target the login button
btnLogin.addEventListener('click', function (e) {
  //* Prevent page reload on click
  e.preventDefault();
  //* Verify Credentials => Find the username (to select account)
  currentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );
  //* Verify account pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // 1. Display UI and custom welcome message
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    // UI UPDATE
    uiUpdate(currentAccount);

    // 7. Clear login form inputs
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

//TODO: IMPLEMENT MONEY TRANSFER
//Add addEventListener to transfer button and prevent default
btnTransfer.addEventListener('click', function (e) {
  //* Prevent page reload on click
  e.preventDefault();
  //* Assign variables to the input fields
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmt = Number(inputTransferAmount.value);

  console.log(receiverAcc, currentAccount);

  //* Conditions for a successful transfer
  if (
    transferAmt > 0 &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= transferAmt
  ) {
    //* Remove money from the current account (sender)
    currentAccount.movements.push(-transferAmt);
    //* Add money to the receiver's account (sender)
    receiverAcc.movements.push(transferAmt);

    // UI UPDATE
    uiUpdate(currentAccount);

    // Erase Input Fields
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});


//TODO: LOAN REQUEST FUNCTIONALITY

btnLoan.addEventListener('click', function (e) {
  //* Prevent page reload on click
  e.preventDefault();

  //* Requested Loan
  const requestedLoan = Number (inputLoanAmount.value);
  const eligible = currentAccount.movements.some(mov => mov > (0.1 * requestedLoan));

  if (eligible) {
    //* Add requested loan to account
    currentAccount.movements.push(requestedLoan);
    //* UI UPDATE
    uiUpdate(currentAccount);
    //* Erase Input Fields
    inputLoanAmount.value = '' ;
  }


})

//TODO: ACCOUNT DELETE FUNCTIONALITY

btnClose.addEventListener('click', function (e) {
  //* Prevent page reload on click
  e.preventDefault();

  //* Verify username and pin
  const accountUsername = inputCloseUsername.value;
  const accountPin = Number (inputClosePin.value);

  if (
    currentAccount &&
    currentAccount.username === accountUsername &&
    currentAccount.pin === accountPin
  ) {
    //* Find the index of the account to be deleted
    const index = accounts.findIndex((acc) => acc.username === accountUsername);
    //* Delete the index from the array
    accounts.splice(index, 1)
    // Hide UI
    containerApp.style.opacity = '0';
    // Erase Input Fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//TODO: SORTING FUNCTIONALITY

let sorted = false;

btnSort.addEventListener('click', function(e) {
  //* prevent page reload on click
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})














// //!TODO: SIMPLE ARRAY METHODS

// //! ==== THE SLICE METHOD

// const arr = ['a', 'b', 'c', 'd', 'e'];

// const newArr = arr.slice(2, arr.length);
// console.log(newArr);

// //! ==== CREATE A SHALLOW COPY OF AN ARRAY USING SLICE METHOD

// const shallowArr = arr.slice();
// console.log(shallowArr);

// //! THE SPLICE METHOD

// const splice = arr.splice(2);
// console.log(splice);

// console.log(arr);

// //! ==== REVERSE METHOD

// const reverseArr = arr.reverse();
// console.log(reverseArr);

// //! ==== CONCAT METHOD

// const arrr = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const concatArr = arr.concat(arrr);
// console.log(concatArr);

// //! ==== JOIN METHOD

// const joinArr = arr.join('-');
// console.log(joinArr);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, -12];

// movements.forEach( (move, i, arr) => {
//   if (move >= 0) {
//     console.log(`Transaction ${i + 1}: You deposited ${move} to your account`);
//   }
//   else {
//     console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(move)} from your account`);
//   }
// })

// for (const [i, move] of movements.entries()) {
//   if (move >= 0) {
//     console.log(`Transaction ${i + 1}: You deposited ${move} to your account`);
//   }
//   else {
//     console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(move)} from your account`);
//   }
// }

// const orderSet = new Set(['a', 'b', 'c', 'd', 'e', 'c']);
// console.log(orderSet);

// console.log(orderSet.size);
// console.log(orderSet.has('a'));
// console.log(orderSet.add('j'));
// console.log(orderSet.delete('e'));

// console.log(orderSet);

// const rest = new Map();
// rest.set('firstName', 'Folarin');
// rest.set('email', 'folathecoder@gmail.com');
// rest.set('lastName', 'Akinloye');

// rest.forEach(function(value, key, map) {
//   console.log(`${value} ${key}`)
// })

// //TODO: CODING CHALLENGE

// // Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// // Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const juliaData1 = [3, 5, 2, 12, 7];
// const juliaData2 = [9, 16, 6, 8, 3];
// const kateData1 = [4, 1, 15, 8, 3];
// const kateData2 = [10, 5, 6, 1, 4];

// //[1] => Julia found out that the owners of the first and the last two dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)

// const juliaData1Update = juliaData1.slice('1','-2');
// const juliaData2Update = juliaData2.slice('1','-2');

// //[2] => Create an array with both Julia's (corrected) and Kate's data

// const data1Update = juliaData1Update.concat(kateData1);
// const data2Update = juliaData2Update.concat(kateData2);

// const checkDogs = function (dogAges) {

//   dogAges.forEach(function(age, i) {
//     const old = age > 3 ? `an adult`: `a puppy`;
//     const yearTense = age > 1 ? `years`: `year`;
//     console.log(`Dog number ${i + 1} is ${old}, and is ${age} ${yearTense} old.`);
//   })
// }
// checkDogs(data2Update);

//TODO: THE MAP METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, -12];
// const eu = 1.1;
// // const moveEU = movements.map(function(mov) {
// //   return mov * eu;
// // })
// const moveEU = movements.map(mov => mov * eu);
// console.log(moveEU);

//TODO: THE FILTER METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, -12];
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);

// console.log(deposits);

// const deposits = [];
// const withdrawals =[]
// for (const mov of movements) {
//   if(mov > 0) {
//     deposits.push(mov);
//   }
//   else {
//     withdrawals.push(mov);
//   }
// }

// console.log(deposits);
// console.log(withdrawals);

//TODO: THE REDUCE METHOD

// const balance = movements.reduce(function(acc, cur, i, arr) {
//   return acc + cur;
// }, 0);

//TODO: CODING CHALLENGE 2

// const data1 = [16, 6, 10, 5, 6, 1, 4];
// const data2 = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = function(ages) {
//   const humanAges = ages.map((age) => {
//     if (age <= 2) {
//       return age * 4;
//     }
//     else {
//       return 16 + age * 4;
//     }
//   })
//   console.log(humanAges);

//   const adultDogs = humanAges.filter((age) => {
//     return age >= 18;
//   })
//   console.log(adultDogs)

//   const avgAge = adultDogs.reduce((acc, age, i, arr) => acc + age/ arr.length, 0);

//   console.log(avgAge);
// }

// const calcAverageHumanAge = function (ages) {
//   const avgAge = ages
//     .map(age => (age <= 2 ? age * 4 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   console.log(`The average age: ${avgAge}.`);
// };

// calcAverageHumanAge(data1);
// calcAverageHumanAge(data2);

// //TODO: THE FIND METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, -12];

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(firstWithdrawal);


//TODO: SORTING ARRAYS 

const owners = ['Folarin', 'Emmanuael', 'Bose', 'Jide'];
// const sortOwners = owners.sort((a,b) => {
//   if(a > b) return -1;
//   if(a < b) return 1;
// })


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, -12];
const sortOwners = movements.sort((a,b) => b - a);

console.log(sortOwners);

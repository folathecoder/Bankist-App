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
        <div class="movements__type movements__type--${type}">${
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
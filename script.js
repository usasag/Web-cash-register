let price = 3.75;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 5.55],
    ["DIME", 6.1],
    ["QUARTER", 7.25],
    ["ONE", 12],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

const priceElement = document.getElementById('price');
const cash = document.getElementById('cash');
const changeDueDisplay = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDrawer = document.getElementById('change-drawer');

const formatResults = (status, change) => {
    changeDueDisplay.innerHTML = `<p>Status: ${status}<p>`;
        change.map(money => {
            changeDueDisplay.innerHTML += `<p>${money[0]}: \$${money[1]}</p>`;
        })
        return;
    }

const comparePrices = () => {
    if (Number(cash.value) < price) {
        alert("Customer does not have enough money to purchase the item");
        cash.value = "";
        return;
    } else if (Number(cash.value) === price) {
        changeDueDisplay.innerHTML = "<p>No change due - customer paid with exact cash</p>";
        return;
    } else {
        let changeDue = Number(cash.value) - price;
        let reverseCid = [...cid].reverse();
        let denom = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
        let result = { status: 'OPEN', change: []};
        let totalCid = parseFloat(
            cid
            .map(total => total[1])
            .reduce((acc, curr) => acc + curr)
            .toFixed(2)
        );

        if (totalCid < changeDue) {
            return (changeDueDisplay.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>");
        } else if (totalCid === changeDue) {
            result.status = 'CLOSED';
        }

        for (let i = 0; i <= reverseCid.length; i++) {
            if (changeDue >= denom[i]) {
                let count = 0;
                let total = reverseCid[i][1];
                while (changeDue >= denom[i] && total > 0) {
                    total -= denom[i];
                    changeDue = parseFloat((changeDue -= denom[i]).toFixed(2));
                    count++;
                }
                if (count > 0) {
                    total = denom[i] * count;
                    result.change.push([reverseCid[i][0], count * denom[i]]);
                }
            }
        }
        if (changeDue > 0) {
            return (changeDueDisplay.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>");
        }

        formatResults(result.status, result.change);
        updateUI(result.change);
    }
}

const checkResults = () => {
    if (!cash.value) {
        return;
    }
    comparePrices();
}

const updateUI = change => { 
    const currencyNameMap = {
        PENNY: "Pennies",
        NICKEL: "Nickels",
        DIME: "Dimes",
        QUARTER: "Quarters",
        ONE: "Ones",
        FIVE: "Fives",
        TEN: "Tens",
        TWENTY: "Twenties",
        "ONE HUNDRED": "Hundreds"
    };

if (change) {
    change.forEach(changeArr => {
        const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
        targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
}

cash.value = "";
priceElement.textContent = `Total: $${price}`;
changeDrawer.innerHTML = `<p><strong>Change in drawer:</strong></p>
${cid
  .map(money => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
  .join('')}  
`;
};
// event listeners

purchaseBtn.addEventListener('click', checkResults);

cash.addEventListener('keydown', e => {
    if (e.key === "Enter") {
        checkResults();
    }
});

updateUI();

// Path: index.html
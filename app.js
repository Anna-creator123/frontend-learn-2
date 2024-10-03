var TransactionType;
(function (TransactionType) {
    TransactionType["Income"] = "Income";
    TransactionType["Expense"] = "Expense";
})(TransactionType || (TransactionType = {}));
var FinanceTracker = /** @class */ (function () {
    function FinanceTracker() {
        this.transactions = [];
        this.loadFromLocalStorage();
    }
    FinanceTracker.prototype.addTransaction = function (trans) {
        this.transactions.push(trans);
        this.saveToLocalStorage();
        this.render();
    };
    FinanceTracker.prototype.removeTransaction = function (removedID) {
        var updatedTransactions = [];
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var trans = _a[_i];
            if (trans.id !== removedID) {
                updatedTransactions.push(trans);
            }
        }
        this.transactions = updatedTransactions;
        this.saveToLocalStorage();
        this.render();
    };
    FinanceTracker.prototype.getBalance = function () {
        var balance = 0;
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var transaction = _a[_i];
            if (transaction.type === TransactionType.Income) {
                balance += transaction.amount;
            }
            else {
                balance -= transaction.amount;
            }
        }
        return balance;
    };
    FinanceTracker.prototype.getTransactions = function () {
        return this.transactions;
    };
    FinanceTracker.prototype.saveToLocalStorage = function () {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    };
    FinanceTracker.prototype.loadFromLocalStorage = function () {
        var data = localStorage.getItem("transactions");
        if (data) {
            var parsedData = JSON.parse(data);
            // Преобразовать строку даты в объект Date
            for (var _i = 0, parsedData_1 = parsedData; _i < parsedData_1.length; _i++) {
                var transaction = parsedData_1[_i];
                transaction.date = new Date(transaction.date);
            }
            this.transactions = parsedData;
            // Вызвать метод для обновления интерфейса
            this.render();
        }
    };
    FinanceTracker.prototype.render = function () {
        var balanceElement = document.getElementById('balance');
        var transactionsElement = document.getElementById('transactions');
        if (!balanceElement || !transactionsElement)
            return;
        balanceElement.textContent = formatCurrency(this.getBalance());
        transactionsElement.innerHTML = '';
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var transaction = _a[_i];
            var li = document.createElement('li');
            li.className = 'transaction-item';
            li.innerHTML = "\n            <p>\n            <b>".concat(transaction.description, ":</b>  ").concat(formatCurrency(transaction.amount), "\n                (").concat(transaction.type, ") - ").concat(transaction.date.toLocaleDateString(), "\n            </p>\n            <button onclick=\"removeTransaction(").concat(transaction.id, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n        ");
            transactionsElement.appendChild(li);
        }
    };
    return FinanceTracker;
}());
var CurrentTracker = new FinanceTracker();
function formatCurrency(balance) {
    return "$".concat(balance.toFixed(2), "\u0440\u0443\u0431.");
}
function addTransactionButton() {
    var descriptionElement = document.getElementById("description");
    var amountElement = document.getElementById("amount");
    var typeElement = document.getElementById("type");
    if (!descriptionElement || !amountElement || !typeElement)
        return;
    var description = descriptionElement.value;
    var amount = parseFloat(amountElement.value);
    var type = typeElement.value;
    if (!description || isNaN(amount)) {
        alert('Введите корректные данные.');
        return;
    }
    var transaction = {
        id: Date.now(),
        amount: amount,
        type: type,
        description: description,
        date: new Date(),
    };
    CurrentTracker.addTransaction(transaction);
    descriptionElement.value = '';
    amountElement.value = '';
}
function removeTransaction(removeID) {
    CurrentTracker.removeTransaction(removeID);
}

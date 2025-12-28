// Function to open specific modal
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

// Function to close specific modal
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Save logic for the New Expense modal
function saveNewExpense() {
    const w = document.getElementById('modalWhere').value;
    const a = document.getElementById('modalAmt').value;
    if(w && a) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].items.unshift({ where: w, amt: parseFloat(a) });
        updateUI();
        closeModal('expenseModal');
        document.getElementById('modalWhere').value = ''; 
        document.getElementById('modalAmt').value = '';
    }
}

// Save logic for the Budget modal
function saveNewBudget() {
    const b = document.getElementById('modalBudgetField').value;
    if(b !== "") {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(b);
        updateUI();
        closeModal('budgetModal');
        document.getElementById('modalBudgetField').value = '';
    }
}

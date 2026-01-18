let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];
let currentSelectedCat = '🍔';

window.onload = () => {
    updateUI();
    const dayData = allData[selectedDate] || { budget: 0 };
    if (dayData.budget === 0) openModal('budgetModal');
};

function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const historyDiv = document.getElementById('history');
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    
    document.getElementById('dateText').innerText = new Date(selectedDate).toLocaleDateString(undefined, {day:'numeric', month:'short'});
    
    historyDiv.innerHTML = "";
    let totalSpent = 0;
    dayData.items.forEach(item => totalSpent += parseFloat(item.amt));

    const filtered = dayData.items.filter(item => item.where.toLowerCase().includes(searchVal));

    filtered.forEach((i, idx) => {
        historyDiv.innerHTML += `
            <div class="expense-tile">
                <div class="tile-left">
                    <div class="tile-icon">${i.where.split(' ')[0]}</div>
                    <div class="tile-name">${i.where.split(' ').slice(1).join(' ')}</div>
                </div>
                <div class="tile-amt">-₹${i.amt}</div>
            </div>`;
    });

    const budget = dayData.budget || 0;
    document.getElementById('statBudget').innerText = 'Budget: ₹' + budget;
    document.getElementById('statSpent').innerText = '₹' + totalSpent;
    document.getElementById('statSaving').innerText = 'Saved: ₹' + Math.max(0, budget - totalSpent);

    const progBar = document.getElementById('progressBar');
    if (budget > 0) {
        let perc = (totalSpent / budget) * 100;
        progBar.style.width = Math.min(perc, 100) + "%";
        progBar.style.backgroundColor = totalSpent > budget ? "var(--danger)" : "var(--accent)";
        progBar.style.boxShadow = totalSpent > budget ? "0 0 15px #ff7675" : "0 0 15px #00b894";
    }
    localStorage.setItem('swiftCoinPro', JSON.stringify(allData));
}

function saveNewBudget() {
    const val = document.getElementById('modalBudgetField').value;
    if(val) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(val);
        updateUI(); closeModal('budgetModal');
    }
}

function saveNewExpense() {
    const w = document.getElementById('modalWhere').value || "Expense";
    const a = document.getElementById('modalAmt').value;
    if(a) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].items.unshift({ where: `${currentSelectedCat} ${w}`, amt: parseFloat(a) });
        updateUI(); closeModal('expenseModal');
        document.getElementById('modalWhere').value = "";
        document.getElementById('modalAmt').value = "";
    }
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function showPage(id) { 
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}
function selectCat(emoji, el) {
    currentSelectedCat = emoji;
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
}
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

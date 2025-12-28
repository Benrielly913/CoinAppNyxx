let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];

function handleDateChange(val) {
    selectedDate = val;
    updateUI();
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const h = document.getElementById('history');
    h.innerHTML = "";
    
    let totalSpent = 0;
    dayData.items.forEach((i, idx) => {
        totalSpent += parseFloat(i.amt);
        h.innerHTML += `<div style="background:var(--card); padding:15px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between;">
            <span><b>${i.where}</b></span>
            <span style="color:var(--danger); font-weight:700;">₹${i.amt}</span>
        </div>`;
    });

    const budget = dayData.budget || 0;
    document.getElementById('statBudget').innerText = '₹' + budget;
    document.getElementById('statSpent').innerText = '₹' + totalSpent;
    document.getElementById('statSaving').innerText = '₹' + (budget - totalSpent);

    const perc = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
    document.getElementById('progressBar').style.width = perc + '%';
    document.getElementById('dateText').innerText = new Date(selectedDate).toLocaleDateString(undefined, {day:'numeric', month:'short'});

    localStorage.setItem('swiftCoinPro', JSON.stringify(allData));
}

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

function saveNewBudget() {
    const b = document.getElementById('modalBudgetField').value;
    if(b !== "") {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(b);
        updateUI();
        closeModal('budgetModal');
    }
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

window.onload = updateUI;

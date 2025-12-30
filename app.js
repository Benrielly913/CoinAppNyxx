let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];
let currentSelectedCat = '🍔';

window.onload = () => {
    const savedTheme = localStorage.getItem('scTheme') || 'light-theme';
    document.body.className = savedTheme;
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            updateUI();
            const dayData = allData[selectedDate] || { budget: 0 };
            if (dayData.budget === 0) openModal('budgetModal');
        }, 1000);
    }, 2500);
};

function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const h = document.getElementById('history');
    document.getElementById('dateText').innerText = new Date(selectedDate).toLocaleDateString(undefined, {day:'numeric', month:'short'});
    
    h.innerHTML = "";
    let totalSpent = 0;
    if (dayData.items.length === 0) {
        h.innerHTML = `<div style="text-align:center; padding:60px; opacity:0.3;">No records today.</div>`;
    } else {
        dayData.items.forEach((i, idx) => {
            totalSpent += parseFloat(i.amt);
            h.innerHTML += `<div style="background:var(--card); padding:18px; border-radius:20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);"><span><b>${i.where}</b></span><div style="display:flex; align-items:center; gap:15px;"><span style="color:var(--danger); font-weight:700;">₹${i.amt}</span><span onclick="deleteItem(${idx})" style="opacity:0.2; cursor:pointer;">✕</span></div></div>`;
        });
    }

    const budget = dayData.budget || 0;
    document.getElementById('statBudget').innerText = '₹' + budget;
    document.getElementById('statSpent').innerText = '₹' + totalSpent;
    document.getElementById('statSaving').innerText = '₹' + (budget - totalSpent);

    const progBar = document.getElementById('progressBar');
    const perc = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
    progBar.style.width = perc + '%';
    
    // RED ALERT: If spent > budget
    if (totalSpent > budget && budget > 0) {
        progBar.classList.add('over-budget');
    } else {
        progBar.classList.remove('over-budget');
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

function handleDateChange(val) { selectedDate = val; updateUI(); }
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function deleteItem(idx) { if(confirm("Delete this?")) { allData[selectedDate].items.splice(idx, 1); updateUI(); } }
function selectCat(emoji, el) {
    currentSelectedCat = emoji;
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
}

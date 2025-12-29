let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];
let currentSelectedCat = '🍔';

window.onload = () => {
    const savedTheme = localStorage.getItem('scTheme') || 'light-theme';
    document.body.className = savedTheme;

    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 500);
        
        updateUI();

        // Automatic Budget Prompt on first-time use today
        const dayData = allData[selectedDate] || { budget: 0 };
        if (dayData.budget === 0) {
            openModal('budgetModal');
        }
    }, 2000);
};

function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const h = document.getElementById('history');
    
    const dateObj = new Date(selectedDate);
    document.getElementById('dateText').innerText = dateObj.toLocaleDateString(undefined, {day:'numeric', month:'short'});

    h.innerHTML = "";
    let totalSpent = 0;

    if (dayData.items.length === 0) {
        h.innerHTML = `<div style="text-align:center; padding:60px; opacity:0.3;">No records today.</div>`;
    } else {
        dayData.items.forEach((i, idx) => {
            totalSpent += parseFloat(i.amt);
            h.innerHTML += `
                <div style="background:var(--card); padding:18px; border-radius:20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <span><b>${i.where}</b></span>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="color:var(--danger); font-weight:700;">₹${i.amt}</span>
                        <span onclick="deleteItem(${idx})" style="opacity:0.2; cursor:pointer;">✕</span>
                    </div>
                </div>`;
        });
    }

    const budget = dayData.budget || 0;
    document.getElementById('statBudget').innerText = '₹' + budget;
    document.getElementById('statSpent').innerText = '₹' + totalSpent;
    document.getElementById('statSaving').innerText = '₹' + (budget - totalSpent);

    const perc = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
    document.getElementById('progressBar').style.width = perc + '%';

    localStorage.setItem('swiftCoinPro', JSON.stringify(allData));
}

function selectCat(emoji, el) {
    currentSelectedCat = emoji;
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
}

function saveNewBudget() {
    const val = document.getElementById('modalBudgetField').value;
    if(val !== "") {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(val);
        updateUI();
        closeModal('budgetModal');
        document.getElementById('modalBudgetField').value = "";
    }
}

function saveNewExpense() {
    const w = document.getElementById('modalWhere').value || "Expense";
    const a = document.getElementById('modalAmt').value;
    if(a) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].items.unshift({ where: `${currentSelectedCat} ${w}`, amt: parseFloat(a) });
        updateUI();
        closeModal('expenseModal');
        document.getElementById('modalWhere').value = "";
        document.getElementById('modalAmt').value = "";
    }
}

function handleDateChange(val) { selectedDate = val; updateUI(); }
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function deleteItem(idx) {
    if(confirm("Delete this?")) {
        allData[selectedDate].items.splice(idx, 1);
        updateUI();
    }
}

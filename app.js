let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];

// 1. Startup Logic
window.onload = () => {
    // Load theme
    const savedTheme = localStorage.getItem('scTheme') || 'light-theme';
    document.body.className = savedTheme;

    // Splash Timer
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 500);
        
        updateUI();
        
        // Feature: First-time open check for budget
        const dayData = allData[selectedDate] || { budget: 0 };
        if (dayData.budget === 0) {
            openModal('budgetModal');
        }
    }, 2000);
};

// 2. Core UI Updates
function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const h = document.getElementById('history');
    
    // Update Calendar Text
    const dateObj = new Date(selectedDate);
    document.getElementById('dateText').innerText = dateObj.toLocaleDateString(undefined, {day:'numeric', month:'short'});

    // Clear and Redraw History
    h.innerHTML = "";
    if (dayData.items.length === 0) {
        h.innerHTML = `<div style="text-align:center; padding:50px; opacity:0.3;">No records for this day.</div>`;
    } else {
        dayData.items.forEach((i, idx) => {
            h.innerHTML += `
                <div class="expense-card" style="background:var(--card); padding:15px; border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span><b>${i.where}</b></span>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="color:var(--danger); font-weight:700;">₹${i.amt}</span>
                        <span onclick="deleteItem(${idx})" style="opacity:0.2; font-size:12px; cursor:pointer;">✕</span>
                    </div>
                </div>`;
        });
    }

    // Update Totals
    const spent = dayData.items.reduce((sum, i) => sum + parseFloat(i.amt), 0);
    document.getElementById('statBudget').innerText = '₹' + dayData.budget;
    document.getElementById('statSpent').innerText = '₹' + spent;
    document.getElementById('statSaving').innerText = '₹' + (dayData.budget - spent);

    // Progress Bar
    const perc = dayData.budget > 0 ? Math.min((spent / dayData.budget) * 100, 100) : 0;
    document.getElementById('progressBar').style.width = perc + '%';

    localStorage.setItem('swiftCoinPro', JSON.stringify(allData));
}

// 3. Actions
function handleDateChange(val) { selectedDate = val; updateUI(); }
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function saveNewBudget() {
    const amt = document.getElementById('modalBudgetField').value;
    if(amt !== "") {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(amt);
        updateUI();
        closeModal('budgetModal');
    }
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

function deleteItem(idx) {
    if(confirm("Delete this expense?")) {
        allData[selectedDate].items.splice(idx, 1);
        updateUI();
    }
}

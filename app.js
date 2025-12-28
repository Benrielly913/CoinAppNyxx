let allData = JSON.parse(localStorage.getItem('swiftCoinPro')) || {};
let selectedDate = new Date().toISOString().split('T')[0];

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function updateUI() {
    const dayData = allData[selectedDate] || { budget: 0, items: [] };
    const h = document.getElementById('history');
    h.innerHTML = "";
    
    let totalSpent = 0;
    dayData.items.forEach((i, idx) => {
        totalSpent += parseFloat(i.amt);
        h.innerHTML += `<div class="expense-card">
            <span><b>${i.where}</b><br><small>${selectedDate}</small></span>
            <div style="display:flex; align-items:center; gap:15px;">
                <span style="color:var(--danger); font-weight:700;">₹${i.amt}</span>
                <span onclick="deleteItem(${idx})" style="opacity:0.3; cursor:pointer;">✕</span>
            </div>
        </div>`;
    });

    const budget = dayData.budget || 0;
    const saved = budget - totalSpent;
    document.getElementById('statBudget').innerText = '₹' + budget;
    document.getElementById('statSpent').innerText = '₹' + totalSpent;
    document.getElementById('statSaving').innerText = '₹' + saved;

    const perc = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
    const pb = document.getElementById('progressBar');
    pb.style.width = perc + '%';
    pb.style.background = perc > 90 ? 'var(--danger)' : 'var(--accent)';

    localStorage.setItem('swiftCoinPro', JSON.stringify(allData));
}

function addExpense() {
    const w = prompt("What for?");
    const a = prompt("Amount?");
    if(w && a) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].items.unshift({ where: w, amt: parseFloat(a) });
        updateUI();
    }
}

function editBudget() {
    const b = prompt("Daily Budget?", allData[selectedDate]?.budget || 0);
    if(b !== null) {
        if(!allData[selectedDate]) allData[selectedDate] = { budget: 0, items: [] };
        allData[selectedDate].budget = parseFloat(b);
        updateUI();
    }
}

function deleteItem(idx) {
    allData[selectedDate].items.splice(idx, 1);
    updateUI();
}

window.onload = () => {
    const bg = localStorage.getItem('scCustomBG');
    if(bg) document.body.style.backgroundImage = `url(${bg})`;
    setTheme(localStorage.getItem('scTheme') || 'light-theme');
    updateUI();
}

function showPage(id) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    // Show target
    document.getElementById(id).style.display = 'flex';
}

function setTheme(t) {
    document.body.className = t;
    localStorage.setItem('scTheme', t);
}

function clearAllData() {
    if(confirm("Erase all data? This cannot be undone.")) {
        localStorage.removeItem('swiftCoinPro');
        location.reload();
    }
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("SwiftCoin Report", 14, 15);
    let rows = [];
    Object.keys(allData).forEach(date => {
        allData[date].items.forEach(i => rows.push([date, i.where, "₹" + i.amt]));
    });
    doc.autoTable({ head: [['Date', 'Description', 'Amount']], body: rows, startY: 20 });
    doc.save('SwiftCoin_Expenses.pdf');
}

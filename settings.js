function showPage(id) {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById(id).style.display = 'flex';
}
function setTheme(t) {
    document.body.className = t;
    localStorage.setItem('scTheme', t);
}
function clearAllData() {
    if(confirm("DANGER: This will delete ALL history. Continue?")) {
        localStorage.removeItem('swiftCoinPro');
        location.reload();
    }
}
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("SwiftCoin Expense Report", 14, 15);
    let rows = [];
    Object.keys(allData).forEach(date => {
        allData[date].items.forEach(i => rows.push([date, i.where, "₹" + i.amt]));
    });
    doc.autoTable({ head: [['Date', 'Description', 'Amount']], body: rows, startY: 20 });
    doc.save('SwiftCoin_Report.pdf');
}

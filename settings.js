function setTheme(t) { 
    document.body.className = t; 
    localStorage.setItem('scTheme', t); 
}

function uploadBG(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.body.style.backgroundImage = `url(${ev.target.result})`;
        localStorage.setItem('scCustomBG', ev.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
}

function cleanData(type) {
    if(!confirm("Are you sure?")) return;
    if(type === 'all') allData = {};
    else {
        let days = type === 'today' ? 0 : 30;
        const now = new Date();
        const cutoff = new Date(); cutoff.setDate(now.getDate() - days);
        Object.keys(allData).forEach(date => { if(new Date(date) >= cutoff) delete allData[date]; });
    }
    updateUI();
}

function exportExcel() {
    let csv = "Date,Item,Amount\n";
    Object.keys(allData).forEach(d => allData[d].items.forEach(i => csv += `${d},${i.where},${i.amt}\n`));
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'SwiftCoin.csv'; a.click();
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 15);
    let rows = [];
    Object.keys(allData).forEach(d => allData[d].items.forEach(i => rows.push([d, i.where, i.amt])));
    doc.autoTable({ head:[['Date','Item','Amount']], body: rows, startY: 20 });
    doc.save('SwiftCoin.pdf');
}

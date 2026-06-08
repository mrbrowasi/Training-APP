const newEntryBtn = document.getElementById('newEntryBtn');
const showAllBtn = document.getElementById('showAllBtn');
const newEntrySection = document.getElementById('newEntrySection');
const showAllSection = document.getElementById('showAllSection');
const datesContainer = document.getElementById('datesContainer');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const deptInput = document.getElementById('department');
const designInput = document.getElementById('designation');
const saveBtn = document.querySelector('#newEntrySection .submit button');
const backToHomeBtn = document.getElementById('backToHomeBtn');

let selectedDate = null;

newEntryBtn.addEventListener('click', function() {
    newEntrySection.classList.add('active');
    showAllSection.classList.remove('active');
});

showAllBtn.addEventListener('click', function() {
    showAllSection.classList.add('active');
    newEntrySection.classList.remove('active');
    loadAllDatesList();
});

backToHomeBtn.addEventListener('click', function() {
    showAllSection.classList.remove('active');
});

// Save entry function
saveBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (nameInput.value === '' || idInput.value === '') {
        alert('Please fill Employee Name and ID');
        return;
    }
    
    const entry = {
        date: new Date().toLocaleDateString(),
        name: nameInput.value,
        id: idInput.value,
        department: deptInput.value,
        designation: designInput.value
    };
    
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    
    nameInput.value = '';
    idInput.value = '';
    deptInput.value = '';
    designInput.value = '';
    
    alert('Entry saved successfully!');
});

// Load all dates list
function loadAllDatesList() {
    datesContainer.innerHTML = '';
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    
    // Get unique dates
    let uniqueDates = [...new Set(entries.map(entry => entry.date))];
    uniqueDates.sort((a, b) => new Date(b) - new Date(a)); // Sort descending
    
    uniqueDates.forEach(function(date) {
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item';
        dateItem.textContent = date + ' (' + entries.filter(e => e.date === date).length + ' entries)';
        
        const table = document.createElement('table');
        table.className = 'entries-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        
        const tbody = table.getElementsByTagName('tbody')[0];
        let dateEntries = entries.filter(e => e.date === date);
        dateEntries.forEach(function(entry, index) {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = entry.name;
            row.insertCell(1).textContent = entry.id;
            row.insertCell(2).textContent = entry.department;
            row.insertCell(3).textContent = entry.designation || '-';
            
            const actionCell = row.insertCell(4);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.padding = '5px 10px';
            deleteBtn.style.backgroundColor = '#dc3545';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this entry?')) {
                    let allEntries = JSON.parse(localStorage.getItem('entries')) || [];
                    let entryToDelete = allEntries.findIndex(e => 
                        e.date === entry.date && 
                        e.name === entry.name && 
                        e.id === entry.id
                    );
                    if (entryToDelete > -1) {
                        allEntries.splice(entryToDelete, 1);
                        localStorage.setItem('entries', JSON.stringify(allEntries));
                        loadAllDatesList();
                    }
                }
            });
            actionCell.appendChild(deleteBtn);
        });
        
        // Create export button for this date
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export This Date';
        exportBtn.style.padding = '8px 16px';
        exportBtn.style.backgroundColor = 'darkgreen';
        exportBtn.style.color = 'white';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.style.marginTop = '10px';
        exportBtn.style.marginRight = '5px';
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                let allEntries = JSON.parse(localStorage.getItem('entries')) || [];
                let exportEntries = allEntries.filter(e => e.date === date);
                
                if (exportEntries.length === 0) {
                    alert('No entries to export!');
                    return;
                }
                
                console.log('Exporting entries:', exportEntries);
                exportToExcel(exportEntries, 'Entries_' + date.replace(/\//g, '-'));
            } catch(err) {
                console.error('Export error:', err);
                alert('Error exporting file: ' + err.message);
            }
        });
        
        dateItem.addEventListener('click', function() {
            const isExpanded = dateItem.classList.contains('expanded');
            
            // Close all other expanded items
            document.querySelectorAll('.date-item.expanded').forEach(item => {
                if (item !== dateItem) {
                    item.classList.remove('expanded');
                    item.nextElementSibling.classList.remove('show');
                    // Hide export button of other items
                    let nextBtn = item.nextElementSibling.nextElementSibling;
                    if (nextBtn && nextBtn.classList && nextBtn.classList.contains('export-button-container')) {
                        nextBtn.style.display = 'none';
                    }
                }
            });
            
            // Toggle current item
            dateItem.classList.toggle('expanded');
            table.classList.toggle('show');
            
            if (dateItem.classList.contains('expanded')) {
                selectedDate = date;
                // Show export button
                let exportContainer = exportBtn.parentElement;
                if (exportContainer) {
                    exportContainer.style.display = 'flex';
                }
            } else {
                selectedDate = null;
                // Hide export button
                let exportContainer = exportBtn.parentElement;
                if (exportContainer) {
                    exportContainer.style.display = 'none';
                }
            }
        });
        
        // Create container for export button
        const exportButtonContainer = document.createElement('div');
        exportButtonContainer.className = 'export-button-container';
        exportButtonContainer.style.display = 'none';
        exportButtonContainer.style.padding = '10px 0';
        exportButtonContainer.appendChild(exportBtn);
        
        datesContainer.appendChild(dateItem);
        datesContainer.appendChild(table);
        datesContainer.appendChild(exportButtonContainer);
    });
}

// Reset - Delete last entry (only if not saved)
// Note: Reset button removed - user can delete from Show All Entries using delete button in each entry

// Export selected date
// This is handled inline in the export button click handler now

backToHomeBtn.addEventListener('click', function() {
    showAllSection.classList.remove('active');
});

// Function to export to Excel
function exportToExcel(entries, filename) {
    try {
        if (!entries || entries.length === 0) {
            alert('No data to export!');
            return;
        }
        
        // Check if XLSX is available, if not try different ways
        let XLSX_lib = window.XLSX || window.xlsx;
        
        if (!XLSX_lib) {
            alert('Excel library not loaded. Trying to load...');
            // Load dynamically if not available
            let script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
            script.onload = function() {
                exportToExcel(entries, filename); // Retry after loading
            };
            script.onerror = function() {
                alert('Failed to load Excel library. Please try again later.');
            };
            document.head.appendChild(script);
            return;
        }
        
        let exportData = entries.map(function(entry) {
            return {
                'Date': entry.date,
                'Employee Name': entry.name,
                'Employee ID': entry.id,
                'Department': entry.department,
                'Designation': entry.designation || '-'
            };
        });
        
        console.log('Export data:', exportData);
        
        let worksheet = XLSX_lib.utils.json_to_sheet(exportData);
        
        worksheet['!cols'] = [
            {wch: 12},
            {wch: 20},
            {wch: 15},
            {wch: 15},
            {wch: 15}
        ];
        
        let workbook = XLSX_lib.utils.book_new();
        XLSX_lib.utils.book_append_sheet(workbook, worksheet, 'Entries');
        
        XLSX_lib.writeFile(workbook, filename + '.xlsx');
        console.log('File exported successfully:', filename);
    } catch(err) {
        console.error('Export error:', err);
        alert('Error exporting file: ' + err.message);
    }
}

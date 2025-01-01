// script.js

async function fetchData() {
    try {
        const response = await fetch('data/pickup_dates_2025_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip the header
        const parsedData = rows.map(row => {
            const [category, date] = row.split(',');
            return { category, date };
        });

        displayData(parsedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('pickup-data');
    container.innerHTML = data.map(item => 
        `<div>${item.category}: ${item.date}</div>`
    ).join('');
}

fetchData();

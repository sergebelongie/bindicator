async function fetchData() {
    try {
        const response = await fetch('data/pickup_dates_2025_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip the header
        const parsedData = rows
            .filter(row => row.trim() !== '') // Remove empty lines
            .map(row => {
                const [category, date] = row.split(',');
                return { category: category.trim(), date: new Date(date.trim()) };
            });

        const nextPickups = calculateNextPickups(parsedData);
        displayData(nextPickups);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function calculateNextPickups(data) {
    const today = new Date();
    const nextPickups = {};

    data.forEach(item => {
        if (item.date > today) {
            if (!nextPickups[item.category] || item.date < nextPickups[item.category]) {
                nextPickups[item.category] = item.date;
            }
        }
    });

    return nextPickups;
}

function displayData(data) {
    const container = document.getElementById('pickup-data');
    container.innerHTML = Object.entries(data)
        .map(([category, date]) => 
            `<div>${category}: ${date.toDateString()}</div>`
        ).join('');
}

fetchData();

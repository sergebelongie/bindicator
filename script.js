async function fetchData() {
    try {
        const response = await fetch('data/pickup_dates_2025_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip the header
        const parsedData = rows
            .filter(row => row.trim() !== '') // Remove empty lines
            .map(row => {
                const [category, date] = row.split(',');
                const parsedDate = new Date(date.trim());
                if (isNaN(parsedDate)) {
                    console.warn(`Invalid date found: ${date.trim()}`);
                }
                return { category: category.trim(), date: parsedDate };
            })
            .filter(item => !isNaN(item.date)); // Remove invalid dates

        const nextPickups = calculateNextPickups(parsedData);
        displayData(nextPickups);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
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

    console.log('Next pickups calculated:', nextPickups); // Debug output
    return nextPickups;
}

function displayData(data) {
    const container = document.getElementById('pickup-data');
    if (Object.keys(data).length === 0) {
        container.innerHTML = '<p>No upcoming pickups found.</p>';
        return;
    }
    container.innerHTML = Object.entries(data)
        .map(([category, date]) => 
            `<div>${category}: ${date.toDateString()}</div>`
        ).join('');
}

fetchData();

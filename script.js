async function fetchData() {
    try {
        const response = await fetch('data/pickup_dates_2025_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n'); // Split into rows
        console.log('CSV Rows:', rows); // Log the rows for debugging

        // Display the raw CSV data in the HTML
        const container = document.getElementById('pickup-data');
        container.innerHTML = rows.map(row => `<div>${row}</div>`).join('');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch and display the CSV data
fetchData();

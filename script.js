async function fetchData() {
    try {
        const response = await fetch('data/pickup_dates_2025_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Skip the header row
        const today = new Date();

        // Parse and process the rows
        const parsedRows = rows
            .filter(row => row.trim() !== '') // Remove empty rows
            .map(row => {
                const [category, date] = row.split(',');
                const parsedDate = new Date(date.trim());
                const daysUntil = calculateDaysUntil(today, parsedDate);

                return { category: category.trim(), date: parsedDate, daysUntil };
            });

        displayData(parsedRows);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function calculateDaysUntil(today, futureDate) {
    const timeDifference = futureDate - today;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

function displayData(data) {
    const container = document.getElementById('pickup-data');
    container.innerHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Pickup Date</th>
                    <th>Days Until</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.date.toDateString()}</td>
                        <td>${item.daysUntil >= 0 ? item.daysUntil : 'Passed'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

fetchData();

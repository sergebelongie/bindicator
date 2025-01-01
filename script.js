document.addEventListener("DOMContentLoaded", () => {
    const csvUrl = "data/pickup_dates_2025_cleaned.csv"; // Adjusted path
    const today = new Date();

    // Fetch and process the CSV data
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.trim().split("\n").slice(1); // Ignore header row
            const data = rows.map(row => {
                const [category, date] = row.split(",");
                return { category, date: new Date(date) };
            });

            // Calculate the next pickup for each category
            const nextPickups = calculateNextPickups(data, today);

            // Display the result
            displayResults(nextPickups);
        });

    // Calculate next pickup dates
    function calculateNextPickups(data, today) {
        const categories = [...new Set(data.map(item => item.category))];
        const nextPickups = [];

        categories.forEach(category => {
            const pickups = data
                .filter(item => item.category === category && item.date >= today)
                .sort((a, b) => a.date - b.date);
            
            if (pickups.length > 0) {
                const nextPickup = pickups[0];
                const daysUntil = Math.ceil((nextPickup.date - today) / (1000 * 60 * 60 * 24));
                nextPickups.push({
                    category,
                    date: nextPickup.date.toISOString().split("T")[0],
                    daysUntil
                });
            }
        });

        return nextPickups;
    }

    // Display results in a simple format
    function displayResults(nextPickups) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = nextPickups
            .map(pickup => 
                `<p><strong>${pickup.category}:</strong> ${pickup.date} (${pickup.daysUntil} days left)</p>`)
            .join("");
    }
});

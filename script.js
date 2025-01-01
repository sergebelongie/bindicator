document.addEventListener("DOMContentLoaded", () => {
    const csvUrl = "data/pickup_dates_2025_cleaned.csv"; // Adjusted path
    const today = new Date();
    const statusDiv = document.getElementById("status");
    const outputDiv = document.getElementById("output");

    // Update the status text on the page
    function updateStatus(message) {
        statusDiv.textContent = message;
    }

    // Fetch and process the CSV data
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            updateStatus("CSV file fetched successfully.");
            return response.text();
        })
        .then(csvText => {
            updateStatus("CSV file loaded. Parsing data...");
            const rows = csvText.trim().split("\n").slice(1); // Ignore header
            if (rows.length === 0) {
                throw new Error("No data found in CSV.");
            }

            const data = rows.map(row => {
                const [category, date] = row.split(",");
                return { category, date: new Date(date) };
            });

            updateStatus("Data parsed successfully. Calculating next pickups...");
            const nextPickups = calculateNextPickups(data, today);
            displayResults(nextPickups);
        })
        .catch(error => {
            updateStatus(`Error: ${error.message}`);
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
        updateStatus("Next pickups calculated. Displaying results...");
        outputDiv.innerHTML = nextPickups
            .map(pickup => 
                `<p><strong>${pickup.category}:</strong> ${pickup.date} (${pickup.daysUntil} days left)</p>`)
            .join("");
    }
});

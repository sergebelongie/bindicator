const csvFilePath = "data/pickup_dates_2025_cleaned.csv";

// Function to calculate days until a given date
function daysUntilPickup(pickupDate) {
  const today = new Date(); // Current date
  const pickup = new Date(pickupDate.trim());
  const diffTime = pickup - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
}

// Fetch and process the CSV file
fetch(csvFilePath)
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split("\n").slice(1); // Skip the header row
    const data = {}; // Object to store the next pickup for each category

    rows.forEach(row => {
      const [category, date] = row.split(","); // Split each row into category and date
      if (!category || !date) return; // Skip empty rows

      const pickupDate = new Date(date.trim()); // Convert date string to Date object
      if (isNaN(pickupDate)) return; // Skip invalid dates

      // Only include future pickup dates
      if (pickupDate >= new Date()) {
        // Update the next pickup if:
        // 1. The category doesn't exist in the data object yet
        // 2. This date is sooner than the currently stored date
        if (!data[category] || pickupDate < new Date(data[category].date)) {
          data[category] = { date: pickupDate.toISOString().split("T")[0], days: daysUntilPickup(date) };
        }
      }
    });

    // Populate the table with the next pickup dates
    const tableBody = document.querySelector("#pickup-table tbody");
    tableBody.innerHTML = ""; // Clear the table

    Object.entries(data).forEach(([category, { date, days }]) => {
      const row = document.createElement("tr");

      // Category cell
      const categoryCell = document.createElement("td");
      categoryCell.textContent = category;
      row.appendChild(categoryCell);

      // Date cell
      const dateCell = document.createElement("td");
      dateCell.textContent = date;
      row.appendChild(dateCell);

      // Days until pickup cell
      const daysCell = document.createElement("td");
      daysCell.textContent = days >= 0 ? days : "Past";
      row.appendChild(daysCell);

      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error("Error loading CSV file:", error));

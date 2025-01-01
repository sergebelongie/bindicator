const csvFilePath = "data/pickup_dates_2025_cleaned.csv";

// Function to calculate days until a given date
function daysUntilPickup(pickupDate) {
  const today = new Date(); // Current date
  const pickup = new Date(pickupDate.trim());
  const diffTime = pickup - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
}

// Function to append debug messages to the page
function logDebug(message) {
  const debugDiv = document.getElementById("debug-output");
  const debugMessage = document.createElement("p");
  debugMessage.textContent = message;
  debugDiv.appendChild(debugMessage);
}

// Fetch and process the CSV file
fetch(csvFilePath)
  .then(response => response.text())
  .then(csvText => {
    logDebug("CSV Loaded:");
    logDebug(csvText); // Log the raw CSV contents

    const rows = csvText.split("\n").slice(1); // Skip the header row
    logDebug(`Number of Rows: ${rows.length}`);

    const data = {}; // Object to store the next pickup for each category

    rows.forEach(row => {
      const [category, date] = row.split(","); // Split each row into category and date
      logDebug(`Processing Row: Category = ${category}, Date = ${date}`);

      if (!category || !date) {
        logDebug("Skipping empty or invalid row.");
        return; // Skip empty rows
      }

      const pickupDate = new Date(date.trim());
      if (isNaN(pickupDate)) {
        logDebug(`Invalid date encountered: ${date}`);
        return; // Skip invalid dates
      }

      if (pickupDate >= new Date()) {
        // Check if this is the earliest pickup date for the category
        if (!data[category] || pickupDate < new Date(data[category].date)) {
          data[category] = { date: pickupDate.toISOString().split("T")[0], days: daysUntilPickup(date) };
        }
      }
    });

    logDebug("Final Data Object:");
    logDebug(JSON.stringify(data, null, 2));

    // Populate the table with the next pickup dates
    const tableBody = document.querySelector("#pickup-table tbody");
    tableBody.innerHTML = ""; // Clear the table

    Object.entries(data).forEach(([category, { date, days }]) => {
      logDebug(`Adding Row: Category = ${category}, Date = ${date}, Days = ${days}`);

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
  .catch(error => {
    logDebug(`Error loading CSV file: ${error}`);
  });

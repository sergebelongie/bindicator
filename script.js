// Path to the CSV file
const csvFilePath = "data/pickup_dates_2025.csv";

// Function to calculate days until a given date
function daysUntilPickup(pickupDate) {
  const today = new Date(); // Current date
  const pickup = new Date(pickupDate);
  const diffTime = pickup - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Fetch and parse the CSV file
fetch(csvFilePath)
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split("\n").slice(1); // Skip the header
    const tableBody = document.querySelector("#pickup-table tbody");

    rows.forEach(row => {
      const [category, date] = row.split(","); // Split row into category and date
      if (category && date) {
        // Create a table row
        const tableRow = document.createElement("tr");

        // Category cell
        const categoryCell = document.createElement("td");
        categoryCell.textContent = category;
        tableRow.appendChild(categoryCell);

        // Date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = date.trim();
        tableRow.appendChild(dateCell);

        // Days until pickup cell
        const daysCell = document.createElement("td");
        daysCell.textContent = daysUntilPickup(date.trim());
        tableRow.appendChild(daysCell);

        // Append the row to the table
        tableBody.appendChild(tableRow);
      }
    });
  })
  .catch(error => console.error("Error loading CSV file:", error));

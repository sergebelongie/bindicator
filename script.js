fetch(csvFilePath)
  .then(response => response.text())
  .then(csvText => {
    console.log("CSV Loaded: ", csvText); // Log the raw CSV contents

    const rows = csvText.split("\n").slice(1); // Skip the header row
    console.log("CSV Rows: ", rows); // Log the individual rows

    const data = {}; // Object to store the next pickup for each category

    rows.forEach(row => {
      const [category, date] = row.split(","); // Split each row into category and date
      console.log("Processing Row: ", { category, date }); // Log the current row being processed

      if (!category || !date) return; // Skip empty rows
      const pickupDate = new Date(date.trim()); // Convert date string to Date object
      const days = daysUntilPickup(date);

      // Log the parsed date and days until pickup
      console.log("Parsed Date: ", pickupDate, "Days Until: ", days);

      // Update the next pickup if:
      if (!data[category] || pickupDate < new Date(data[category].date)) {
        data[category] = { date: pickupDate.toLocaleDateString(), days };
      }
    });

    console.log("Final Data: ", data); // Log the final grouped data

    // Populate the table
    const tableBody = document.querySelector("#pickup-table tbody");
    for (const [category, { date, days }] of Object.entries(data)) {
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
    }
  })
  .catch(error => console.error("Error loading CSV file:", error));

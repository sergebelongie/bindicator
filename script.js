function displayData(data) {
    const container = document.getElementById('pickup-data');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Pickup Date</th>
                    <th>Days Until</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr style="${item.daysUntil === 0 ? 'background-color: #d4edda;' : ''}">
                        <td>${item.category}</td>
                        <td>${item.date.toDateString()}</td>
                        <td style="color: ${item.daysUntil === 0 ? 'green' : item.daysUntil < 0 ? 'red' : 'black'};">
                            ${item.daysUntil >= 0 ? item.daysUntil : 'Passed'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

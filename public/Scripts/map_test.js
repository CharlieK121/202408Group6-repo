


document.addEventListener('DOMContentLoaded',
    function() { 
        var select = document.getElementById('class-select');
        if (select) { select.onchange = function() { 
        const display = document.getElementById('building-details');

        // Get the selected option's data attributes
        const selectedOption = select.options[select.selectedIndex];
        const name = selectedOption.dataset.name;
        const longitude = selectedOption.dataset.longitude;
        const latitude = selectedOption.dataset.latitude;

        // Update the display area

        display.innerHTML = `
            <p><strong>Building Name:</strong> ${name}</p>
            <p><strong>Longitude:</strong> ${longitude}</p>
            <p><strong>Latitude:</strong> ${latitude}</p>
        `;
}}});
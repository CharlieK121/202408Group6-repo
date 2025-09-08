document.addEventListener('DOMContentLoaded', function() {
    // Select all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Function to close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(function(dropdown) {
            dropdown.style.display = 'none'; // Hide all dropdowns
        });
    }

    // Function to open the specific dropdown
    function openDropdown(event) {
        closeAllDropdowns(); // Close any open dropdowns before opening a new one
        const dropdown = event.currentTarget.querySelector('.dropdown');
        dropdown.style.display = 'block'; // Show the specific dropdown
    }

    // Function to close the dropdown when clicking anywhere outside the dropdown menu
    function closeDropdownOnClickOutside(event) {
        if (!event.target.closest('.dropdown-toggle')) {
            closeAllDropdowns(); // Close all dropdowns if clicking outside the dropdown
        }
    }

    // Add event listeners for each dropdown toggle (RESOURCES, SETTINGS)
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('mouseenter', openDropdown); // Open on hover
        toggle.addEventListener('mouseleave', closeAllDropdowns); // Close on hover out
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', closeDropdownOnClickOutside);

    // Initially ensure all dropdowns are hidden on page load (in case of any persistent states)
    closeAllDropdowns(); // This ensures the dropdowns are not visible when the page is refreshed
});
    
document.addEventListener('DOMContentLoaded', function () {
    // Ensure the DOM is fully loaded before running the script.

    // 1. Select all the tab links and tab panes
    const tabs = document.querySelectorAll('.nav-link');  // Select all elements with class 'nav-link' (tab links)
    const tabPanes = document.querySelectorAll('.tab-content');  // Select all elements with class 'tab-content' (tab content areas)
    const loginForm = document.getElementById('login');  // Get the login form container by its ID
    const registerForm = document.getElementById('register');  // Get the registration form container by its ID

    document.addEventListener('DOMContentLoaded', () => {
    // 2. Generic function to toggle between Login and Registration Forms
    function toggleForm(formToShow, formToHide) {
        formToHide.style.display = 'none';  // Hide the form to hide
        formToShow.style.display = 'block';  // Show the form to show
    }

    // 3. Function to show the login form
    function login() {
        toggleForm(loginForm, registerForm);  // Show login form
    }

    // 4. Function to show the registration form
    function register() {
        toggleForm(registerForm, loginForm);  // Show register form
    }

    // 5. Initialize the page by hiding the registration form initially and showing the login form
    login();  // Show the login form by default

    // 6. Add event listeners for form toggle links
    // Link to toggle to Register form
    document.querySelector('#login a').addEventListener('click', function (event) {
        event.preventDefault();
        register();  // Show the register form
    });

    // Link to toggle to Login form
    document.querySelector('#register a').addEventListener('click', function (event) {
        event.preventDefault();
        login();  // Show the login form
    });

    // 7. Initialize the first tab as active (if there are tabs and tab panes)
    if (tabs.length > 0 && tabPanes.length > 0) {
        tabs[0].classList.add('active');  // Set the first tab link as active
        tabPanes[0].classList.add('active');  // Set the first tab content pane as active
    }

    // 8. Add event listeners for tab switching
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));  // Remove 'active' class from all tab links
            tabPanes.forEach(pane => pane.classList.remove('active'));  // Remove 'active' class from all tab panes

            tab.classList.add('active');  // Add 'active' class to the clicked tab link
            tabPanes[index].classList.add('active');  // Add 'active' class to the corresponding tab content pane
        });
    });

    // 9. Event listener for Forgot password link (navigation)
    document.querySelector('#forgot-password').addEventListener('click', function (event) {
        event.preventDefault();  // Prevent default link behavior
        window.location.href = "password.html";  // Navigate to the forgot password page
    });

    // 10. Event listener for Terms & Conditions link (navigation)
    document.querySelector('#terms-conditions').addEventListener('click', function (event) {
        event.preventDefault();  // Prevent default link behavior
        window.location.href = "termsAndConditions.html";  // Navigate to the terms and conditions page
    });
});
});

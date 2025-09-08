document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('.nav-link');
    var tabPanes = document.querySelectorAll('.tab-pane');
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            var target = document.querySelector(tab.getAttribute('href'));
            tabs.forEach(function (t) {
                t.classList.remove('active');
            });
            tabPanes.forEach(function (pane) {
                pane.classList.remove('show', 'active');
            });
            tab.classList.add('active');
            target.classList.add('show', 'active');
        });
    });
});
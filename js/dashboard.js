document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 992 && 
            !sidebar.contains(event.target) && 
            !mobileToggle.contains(event.target) && 
            sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    });
    
    // Initialize Charts
    initBookingsChart();
    initCountriesChart();
    
    // Year Select Change
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            initBookingsChart();
        });
    }
});

// Bookings Chart
function initBookingsChart() {
    const ctx = document.getElementById('bookingsChart');
    
    if (!ctx) return;
    
    // Get selected year
    const yearSelect = document.getElementById('yearSelect');
    const selectedYear = yearSelect ? yearSelect.value : '2025';
    
    // Sample data - in a real app, this would come from an API
    const data = {
        '2025': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [52, 23, 18, 25, 32, 28, 36, 45, 52, 38, 42, 48]
        },
        '2024': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [48, 35, 28, 32, 38, 42, 50, 55, 48, 42, 38, 45]
        },
        '2023': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: [35, 28, 22, 30, 35, 40, 45, 50, 42, 38, 32, 40]
        }
    };
    
    // Destroy existing chart if it exists
    if (window.bookingsChart instanceof Chart) {
        window.bookingsChart.destroy();
    }
    
    // Create new chart
    window.bookingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data[selectedYear].labels,
            datasets: [{
                label: `Bookings in ${selectedYear}`,
                data: data[selectedYear].values,
                backgroundColor: '#59b46f',
                borderColor: '#59b46f',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Countries Chart
function initCountriesChart() {
    const ctx = document.getElementById('countriesChart');
    
    if (!ctx) return;
    
    // Sample data - in a real app, this would come from an API
    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Spain', 'Italy', 'Russia', 'South Africa'];
    const bookings = [15, 68, 8, 22, 18, 12, 8, 5, 7, 10, 6, 12, 8, 5, 20];
    
    // Destroy existing chart if it exists
    if (window.countriesChart instanceof Chart) {
        window.countriesChart.destroy();
    }
    
    // Create new chart
    window.countriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: countries,
            datasets: [{
                label: 'Bookings',
                data: bookings,
                fill: false,
                borderColor: '#e74c3c',
                tension: 0.1,
                pointBackgroundColor: '#e74c3c',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
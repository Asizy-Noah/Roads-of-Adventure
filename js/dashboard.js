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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor for Tour Overview
    const tourOverviewEditor = new Quill('#tourOverviewEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image', 'video']
            ]
        },
        placeholder: 'Type tour description here...'
    });
    
    // Initialize Quill editor for first itinerary
    initItineraryEditor(0);
    
    // Handle form submission
    document.getElementById('addTourForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get content from Quill editor and set to hidden input
        document.getElementById('tourOverview').value = tourOverviewEditor.root.innerHTML;
        
        // Get content from all itinerary editors
        document.querySelectorAll('.itinerary-editor').forEach((editor, index) => {
            const quill = Quill.find(editor);
            const hiddenInput = document.querySelector(`input[name="itineraries[${index}][description]"]`);
            hiddenInput.value = quill.root.innerHTML;
        });
        
        // Show success message
        alert('Tour created successfully!');
        
        // Redirect to tours page
        window.location.href = 'tours.html';
    });
    
    // Handle file upload preview
    document.getElementById('coverImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add new itinerary
    document.getElementById('addItineraryBtn').addEventListener('click', function() {
        const itinerariesContainer = document.getElementById('itinerariesContainer');
        const itineraryCount = itinerariesContainer.querySelectorAll('.itinerary-item').length;
        const newIndex = itineraryCount;
        
        // Create new itinerary item
        const itineraryItem = document.createElement('div');
        itineraryItem.className = 'itinerary-item';
        itineraryItem.innerHTML = `
            <div class="itinerary-header">
                <h4>Itinerary ${newIndex + 1}</h4>
                <button type="button" class="remove-itinerary-btn" title="Remove Itinerary">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="form-row">
                <div class="form-group col-md-2">
                    <label>Day</label>
                    <input type="number" name="itineraries[${newIndex}][day]" class="form-control" min="1" value="${newIndex + 1}" required>
                </div>
                
                <div class="form-group col-md-10">
                    <label>Itinerary Title</label>
                    <input type="text" name="itineraries[${newIndex}][title]" class="form-control" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Itinerary Description</label>
                <div class="itinerary-editor editor-container"></div>
                <input type="hidden" name="itineraries[${newIndex}][description]">
            </div>
            
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label>Meal Plan</label>
                    <select name="itineraries[${newIndex}][mealPlan]" class="form-control" required>
                        <option value="">Select Meal Plan</option>
                        <option value="Lunch & Dinner">Lunch & Dinner</option>
                        <option value="Breakfast, Lunch & Dinner">Breakfast, Lunch & Dinner</option>
                        <option value="Breakfast & Lunch">Breakfast & Lunch</option>
                        <option value="Breakfast Only">Breakfast Only</option>
                    </select>
                </div>
                
                <div class="form-group col-md-6">
                    <label>Accommodation</label>
                    <input type="text" name="itineraries[${newIndex}][accommodation]" class="form-control" placeholder="e.g., Serena Lodge or similar">
                </div>
            </div>
        `;
        
        // Add to container
        itinerariesContainer.appendChild(itineraryItem);
        
        // Initialize Quill editor for new itinerary
        initItineraryEditor(newIndex);
        
        // Add event listener for remove button
        itineraryItem.querySelector('.remove-itinerary-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this itinerary?')) {
                itineraryItem.remove();
                updateItineraryNumbers();
            }
        });
    });
    
    // Add event listener for remove button on first itinerary
    document.querySelector('.remove-itinerary-btn').addEventListener('click', function() {
        if (document.querySelectorAll('.itinerary-item').length > 1) {
            if (confirm('Are you sure you want to remove this itinerary?')) {
                this.closest('.itinerary-item').remove();
                updateItineraryNumbers();
            }
        } else {
            alert('You must have at least one itinerary.');
        }
    });
    
    // Function to initialize Quill editor for itinerary
    function initItineraryEditor(index) {
        const editorContainer = document.querySelectorAll('.itinerary-editor')[index];
        const quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link']
                ]
            },
            placeholder: 'Describe the activities for this day...'
        });
    }
    
    // Function to update itinerary numbers after removal
    function updateItineraryNumbers() {
        const itineraryItems = document.querySelectorAll('.itinerary-item');
        itineraryItems.forEach((item, index) => {
            // Update header
            item.querySelector('h4').textContent = `Itinerary ${index + 1}`;
            
            // Update day input default value
            const dayInput = item.querySelector('input[name^="itineraries"][name$="[day]"]');
            if (dayInput.value == dayInput.defaultValue) {
                dayInput.value = index + 1;
            }
            
            // Update all input names
            item.querySelectorAll('[name^="itineraries["]').forEach(input => {
                const name = input.getAttribute('name');
                const newName = name.replace(/itineraries\[\d+\]/, `itineraries[${index}]`);
                input.setAttribute('name', newName);
            });
        });
    }
});
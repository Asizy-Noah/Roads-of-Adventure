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


document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor for blog content
    var Quill = (typeof Quill !== 'undefined') ? Quill : {}; // Declare Quill if it's not already defined
    const blogContentEditor = new Quill('#blogContentEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },
        placeholder: 'Write your blog content here...'
    });
    
    // If we're on the edit page, populate the editor with content
    if (window.location.pathname.includes('edit-blog')) {
        // This is sample content for demonstration
        const sampleContent = `
            <h2>Introduction to Gorilla Trekking</h2>
            <p>Gorilla trekking is one of the most extraordinary wildlife experiences available in Africa. Uganda is home to over half of the world's remaining mountain gorillas, making it a premier destination for this once-in-a-lifetime adventure.</p>
            
            <h3>Best Time to Go</h3>
            <p>While gorilla trekking is available year-round, the best times to visit are during the dry seasons:</p>
            <ul>
                <li>December to February</li>
                <li>June to August</li>
            </ul>
            <p>During these periods, the trails are less muddy and the hiking conditions are more favorable.</p>
            
            <h3>Physical Preparation</h3>
            <p>Gorilla trekking can be physically demanding. The trek can last anywhere from 30 minutes to 6 hours, depending on the location of the gorilla family. It's recommended to:</p>
            <ul>
                <li>Build up your stamina before the trip</li>
                <li>Practice hiking on uneven terrain</li>
                <li>Strengthen your legs with regular exercise</li>
            </ul>
            
            <h2>What to Pack</h2>
            <p>Proper preparation is essential for a comfortable gorilla trekking experience. Here's what you should bring:</p>
            <ul>
                <li>Hiking boots with good ankle support</li>
                <li>Long-sleeved shirts and pants (for protection against nettles)</li>
                <li>Rain jacket or poncho</li>
                <li>Garden gloves (for grabbing onto vegetation)</li>
                <li>Hat and sunscreen</li>
                <li>Insect repellent</li>
                <li>Camera with zoom lens (no flash photography allowed)</li>
                <li>Water and snacks</li>
            </ul>
            
            <h2>The Trekking Experience</h2>
            <p>On the day of your trek, you'll gather at the park headquarters for a briefing. You'll be assigned to a gorilla family and grouped with other trekkers (maximum 8 per group). A guide will lead you through the forest, tracking the gorillas with the help of experienced trackers.</p>
            
            <p>Once you find the gorillas, you'll have one hour to observe them. This is a strictly enforced rule to minimize stress on the animals. During this time, maintain a distance of at least 7 meters, though the curious gorillas might approach you!</p>
            
            <h2>Conservation Efforts</h2>
            <p>Your gorilla permit fee (currently $700 in Uganda) directly contributes to conservation efforts and supports local communities. Thanks to these initiatives, mountain gorilla numbers have increased from 620 in 1989 to over 1,000 today.</p>
            
            <h2>Conclusion</h2>
            <p>Gorilla trekking is not just an adventure; it's a profound connection with our closest relatives in the animal kingdom. The experience of looking into the eyes of a wild gorilla is often described as life-changing. With proper preparation and respect for these magnificent creatures, your gorilla trekking experience in Uganda will be unforgettable.</p>
        `;
        
        blogContentEditor.clipboard.dangerouslyPasteHTML(sampleContent);
        
        // Show the current image preview
        document.getElementById('imagePreview').style.display = 'block';
    }
    
    // Handle file upload preview
    document.getElementById('featuredImage').addEventListener('change', function(e) {
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
    
    // Handle form submission
    const blogForm = document.getElementById('addBlogForm') || document.getElementById('editBlogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get content from Quill editor and set to hidden input
            document.getElementById('blogContent').value = blogContentEditor.root.innerHTML;
            
            // Show success message
            if (window.location.pathname.includes('add-blog')) {
                alert('Blog post published successfully!');
            } else {
                alert('Blog post updated successfully!');
            }
            
            // Redirect to updates page
            window.location.href = 'updates.html';
        });
    }
    
    // Handle delete buttons on updates page
    const deleteButtons = document.querySelectorAll('.delete-btn');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
                    // In a real application, this would send a request to delete the post
                    // For this demo, we'll just remove the card from the DOM
                    const blogCard = this.closest('.blog-card');
                    blogCard.style.opacity = '0';
                    setTimeout(() => {
                        blogCard.remove();
                    }, 300);
                }
            });
        });
    }
});
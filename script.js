// Navigation functionality
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
        });

        // Add active class to clicked link
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the selected section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Detection option cards
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// File upload dropzone
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--primary)';
    this.style.backgroundColor = '#edf3fe';
});

dropZone.addEventListener('dragleave', function() {
    this.style.borderColor = '#dadce0';
    this.style.backgroundColor = '#f8f9fa';
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#dadce0';
    this.style.backgroundColor = '#f8f9fa';
    alert('File ready for analysis: ' + e.dataTransfer.files[0].name);
});


function updateKathmanduTime() {
    const now = new Date();
    
    // Convert to Kathmandu time (UTC+5:45)
    const offset = 5.75 * 60 * 60 * 1000; // 5 hours 45 minutes in milliseconds
    const kathmanduTime = new Date(now.getTime() + offset);
    
    // Format date as YYYY-MM-DD
    const year = kathmanduTime.getUTCFullYear();
    const month = String(kathmanduTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(kathmanduTime.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Format time as HH:MM:SS
    const hours = String(kathmanduTime.getUTCHours()).padStart(2, '0');
    const minutes = String(kathmanduTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(kathmanduTime.getUTCSeconds()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;
    
    // Update the DOM
    document.getElementById('kathmandu-date').textContent = dateStr;
    document.getElementById('kathmandu-time').textContent = ` ${timeStr}`;
    
    // Update every second
    setTimeout(updateKathmanduTime, 1000);
}

// Start the clock when page loads
window.onload = updateKathmanduTime;






// Sidebar toggle functionality
document.querySelector('.sidebar-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    
    // Optional: Save state to localStorage
    localStorage.setItem('sidebarCollapsed', 
        document.querySelector('.sidebar').classList.contains('collapsed'));
});

// Optional: Load saved state on page load
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.querySelector('.sidebar').classList.add('collapsed');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('videoUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const videoPreview = document.getElementById('videoPreview');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const progressContainer = document.querySelector('.upload-progress');

    // Click handler for upload button
    uploadBtn.addEventListener('click', () => fileInput.click());

    // File selection handler
    fileInput.addEventListener('change', handleFiles);

    // Drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('highlight');
    }

    function unhighlight() {
        dropZone.classList.remove('highlight');
    }

    // Handle dropped files
    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    });

    // Process selected files
    function handleFiles(e) {
        const files = e.target.files;
        if (files.length) {
            const file = files[0];
            
            // Validate file type
            if (!file.type.match('video.*')) {
                alert('Please select a video file');
                return;
            }
            
            // Preview video
            const videoURL = URL.createObjectURL(file);
            videoPreview.src = videoURL;
            videoPreview.style.display = 'block';
            
            // Upload to server
            uploadVideo(file);
        }
    }

    // Upload to server function
    function uploadVideo(file) {
        progressContainer.style.display = 'block';
        
        const formData = new FormData();
        formData.append('video', file);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = percentComplete + '% uploaded';
            }
        };
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Video uploaded successfully!');
                // You could trigger analysis here
            } else {
                alert('Upload failed: ' + xhr.statusText);
            }
            progressContainer.style.display = 'none';
        };
        
        xhr.send(formData);
    }
});

// Sample incident data (replace with your actual data)
const incidents = [
    { lat: 27.7172, lng: 85.3240, intensity: 5, type: "fire", title: "Kathmandu Fire" }, // Nepal
    { lat: 26.4525, lng: 87.2718, intensity: 3, type: "crowd", title: "Dharan Crowd" }, // Nepal
    { lat: 26.6637, lng: 87.2746, intensity: 2, type: "fall", title: "Itahari Incident" }, // Nepal
    { lat: 26.7271, lng: 85.9258, intensity: 4, type: "crash", title: "Janakpur Accident" }, // Nepal
    { lat: 40.7128, lng: -74.0060, intensity: 8, type: "fire", title: "New York Fire" }, // USA
    { lat: 51.5074, lng: -0.1278, intensity: 6, type: "crowd", title: "London Gathering" }, // UK
    { lat: 35.6762, lng: 139.6503, intensity: 7, type: "crash", title: "Tokyo Accident" } // Japan
];

function initMap() {
    // Initialize map centered on Nepal
    const map = L.map('map').setView([27.7172, 85.3240], 7);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add layer control
    const baseLayers = {
        "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }),
        "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        })
    };
    
    // Initialize layer groups
    const heatLayer = L.layerGroup();
    const markerLayer = L.layerGroup();
    const clusterLayer = L.markerClusterGroup();
    
    // Process incident data
    incidents.forEach(incident => {
        const marker = L.marker([incident.lat, incident.lng], {
            icon: getIconForType(incident.type)
        }).bindPopup(`<b>${incident.title}</b><br>Type: ${incident.type}`);
        
        markerLayer.addLayer(marker);
        clusterLayer.addLayer(marker.clone());
    });
    
    // Create heatmap data
    const heatData = incidents.map(incident => [
        incident.lat, 
        incident.lng, 
        incident.intensity
    ]);
    
    if (heatData.length > 0) {
        L.heatLayer(heatData, { radius: 25 }).addTo(heatLayer);
    }
    
    // Add layer control
    const overlays = {
        "Heatmap": heatLayer,
        "Markers": markerLayer,
        "Clusters": clusterLayer
    };
    
    L.control.layers(baseLayers, overlays).addTo(map);
    
    // Default to heatmap view
    heatLayer.addTo(map);
    
    // Layer switcher handler
    document.getElementById('mapLayer').addEventListener('change', function() {
        map.eachLayer(layer => {
            if (layer !== baseLayers["Street Map"] && layer !== baseLayers["Satellite"]) {
                map.removeLayer(layer);
            }
        });
        
        switch(this.value) {
            case 'heatmap': heatLayer.addTo(map); break;
            case 'markers': markerLayer.addTo(map); break;
            case 'clusters': clusterLayer.addTo(map); break;
        }
    });
}

// Custom icons for incident types
function getIconForType(type) {
    const iconUrl = {
        'fire': 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
        'crowd': 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
        'fall': 'https://cdn-icons-png.flaticon.com/512/3764/3764342.png',
        'crash': 'https://cdn-icons-png.flaticon.com/512/836/836576.png'
    }[type] || 'https://cdn-icons-png.flaticon.com/512/447/447031.png';
    
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [32, 32],
        popupAnchor: [0, -15]
    });
}

// Initialize map when analytics section is viewed
document.querySelector('[data-section="analytics"]').addEventListener('click', function() {
    if (!window.mapInitialized) {
        initMap();
        window.mapInitialized = true;
    }
});

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar .fa-search');
    
    // Search when Enter key is pressed
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Search when icon is clicked
    searchIcon.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    function performSearch(query) {
        if (!query.trim()) return;
        
        console.log('Searching for:', query);
        
        // Implement your search logic here:
        // 1. Search through incidents
        // 2. Filter camera feeds
        // 3. Search analytics data
        // 4. Show results
        
        // Example implementation:
        const results = searchAllSections(query);
        displaySearchResults(results);
    }
    
    function searchAllSections(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        // Search detection logs
        document.querySelectorAll('.detection-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                results.push({
                    type: 'detection',
                    element: item,
                    text: item.textContent.trim()
                });
            }
        });
        
        // Search alert logs
        document.querySelectorAll('.alert-table tbody tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                results.push({
                    type: 'alert',
                    element: row,
                    text: row.textContent.trim()
                });
            }
        });
        
        return results;
    }
    
    function displaySearchResults(results) {
        // Clear previous highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.classList.remove('search-highlight');
        });
        
        if (results.length === 0) {
            alert('No results found for: ' + query);
            return;
        }
        
        // Highlight results and scroll to first match
        results.forEach(result => {
            result.element.classList.add('search-highlight');
        });
        
        results[0].element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Initialize search when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    // ... your other initialization code
});

function searchAllSections(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // 1. Search camera feeds (if implemented)
    if (window.cameraFeeds) {
        window.cameraFeeds.forEach(feed => {
            if (feed.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'camera',
                    id: feed.id,
                    text: `Camera: ${feed.name}`
                });
            }
        });
    }
    
    // 2. Search detection logs
    document.querySelectorAll('.detection-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
            results.push({
                type: 'detection',
                element: item,
                text: item.textContent.trim()
            });
        }
    });
    
    // 3. Search alerts table
    document.querySelectorAll('.alert-table tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells).map(cell => cell.textContent).join(' ').toLowerCase();
        
        if (rowText.includes(lowerQuery)) {
            results.push({
                type: 'alert',
                element: row,
                text: row.textContent.trim(),
                severity: row.querySelector('.severity-high') ? 'high' : 
                         row.querySelector('.severity-medium') ? 'medium' : 'low'
            });
        }
    });
    
    // 4. Search analytics data (if loaded)
    if (window.analyticsData) {
        window.analyticsData.forEach(item => {
            if (item.location.toLowerCase().includes(lowerQuery) || 
                item.type.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'analytics',
                    id: item.id,
                    text: `Analytics: ${item.type} at ${item.location}`
                });
            }
        });
    }
    
    return results;
}

// Make search available globally
window.dashboardSearch = {
    focus: function() {
        const searchInput = document.querySelector('.search-bar input');
        searchInput.focus();
    },
    search: function(query) {
        const searchInput = document.querySelector('.search-bar input');
        searchInput.value = query;
        performSearch(query);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('tutorialVideo');
    const selectBtn = document.getElementById('selectVideoBtn');
    const videoFileInput = document.getElementById('videoFile');
    const filePathDisplay = document.getElementById('filePath');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Set default path to Downloads
    videoFileInput.directory = true;
    videoFileInput.webkitdirectory = true;

    // File selection handler
    selectBtn.addEventListener('click', function() {
        videoFileInput.click();
    });

    videoFileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const filePath = file.path || file.name; // Electron gives path, browser gives name
            
            filePathDisplay.textContent = `Selected: ${filePath.replace('C:\\Users\\Bimlendra\\Downloads\\', '')}`;
            
            const videoURL = URL.createObjectURL(file);
            video.src = videoURL;
            
            // Store reference for future sessions
            localStorage.setItem('lastVideoPath', filePath);
        }
    });

    // Play/Pause control
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Progress bar update
    video.addEventListener('timeupdate', function() {
        progressBar.value = (video.currentTime / video.duration) * 100;
        updateTimeDisplay();
    });

    // Seek functionality
    progressBar.addEventListener('input', function() {
        video.currentTime = (progressBar.value / 100) * video.duration;
    });

    // Fullscreen control
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                alert(`Error entering fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Update time display
    function updateTimeDisplay() {
        const current = formatTime(video.currentTime);
        const duration = formatTime(video.duration);
        timeDisplay.textContent = `${current} / ${duration}`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Load last used video if available
    if (localStorage.getItem('lastVideoPath')) {
        filePathDisplay.textContent = `Last used: ${localStorage.getItem('lastVideoPath').replace('C:\\Users\\Bimlendra\\Downloads\\', '')}`;
    }
});

document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const thumbnail = document.getElementById('videoThumbnail');
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('tutorialVideo');
  const closeBtn = document.querySelector('.close-btn');
  const fullscreenBtn = document.querySelector('.fullscreen-btn');
  
  // Thumbnail click handler
  thumbnail.addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Attempt to play video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Video playback failed:', error);
        alert('Video playback failed. Please try again.');
      });
    }
  });
  
  // Close button handler
  closeBtn.addEventListener('click', closeVideo);
  
  // Fullscreen button handler
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  // Close when clicking outside video
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeVideo();
    }
  });
  
  // Keyboard controls
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
      if (e.key === 'Escape') {
        closeVideo();
      }
      if (e.key === 'f') {
        toggleFullscreen();
      }
    }
  });
  
  function closeVideo() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
    video.pause();
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
});
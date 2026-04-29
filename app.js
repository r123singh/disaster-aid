// Punjab Disaster Aid Application
// A map-based interface to help flood victims connect with aid providers

class DisasterAidApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentLocation = null;
        this.selectedDistrict = '';
        this.selectedVillage = '';
        this.pins = [];
        this.filteredPins = [];
        
        // Firebase configuration from config file
        this.firebaseConfig = CONFIG.FIREBASE;
        
        this.db = null;
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            
            // Initialize Firebase
            await this.initializeFirebase();
            
            // Initialize Mapbox
            await this.initializeMap();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load existing pins
            await this.loadPins();
            
            // Set up real-time updates
            this.setupRealtimeUpdates();
            
            // Check location permission
            this.checkLocationPermission();
            
            this.showLoading(false);
        } catch (error) {
            console.error('Initialization error:', error);
            this.showMessage('Error initializing application. Please refresh the page.', 'error');
            this.showLoading(false);
        }
    }

    async initializeFirebase() {
        try {
            // Initialize Firebase
            firebase.initializeApp(this.firebaseConfig);
            this.db = firebase.database();
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
            // For demo purposes, we'll use localStorage as fallback
            this.useLocalStorage = true;
        }
    }

    async initializeMap() {
        // Create map centered on Punjab using Leaflet
        this.map = L.map('map').setView(CONFIG.MAP.center, CONFIG.MAP.zoom);
        console.log('Map initialized:', this.map);

        // Add OpenStreetMap tiles
        L.tileLayer(CONFIG.MAP.tileLayer, {
            attribution: CONFIG.MAP.attribution,
            maxZoom: 18
        }).addTo(this.map);

        // Add custom markers for different severity levels
        this.addCustomMarkers();
        
        // Test map click event
        this.map.on('click', (e) => {
            console.log('Map clicked at:', e.latlng);
            if (this.addingPin) {
                this.addPinAtLocation(e.latlng);
            }
        });
    }

    addCustomMarkers() {
        // Create custom icons for different severity levels
        this.customIcons = {};
        Object.keys(CONFIG.SEVERITY).forEach(severity => {
            const color = CONFIG.SEVERITY[severity].color;
            this.customIcons[severity] = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    width: 32px; 
                    height: 32px; 
                    background-color: ${color}; 
                    border: 2px solid white; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-weight: bold; 
                    font-size: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">!</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
        });
    }

    setupEventListeners() {
        // District selection
        document.getElementById('district-select').addEventListener('change', (e) => {
            this.selectedDistrict = e.target.value;
            this.updateVillageOptions();
            this.filterPins();
            
            // Zoom to selected district
            if (this.selectedDistrict) {
                this.zoomToDistrict(this.selectedDistrict);
            }
        });

        // Village selection
        document.getElementById('village-select').addEventListener('change', (e) => {
            this.selectedVillage = e.target.value;
            this.filterPins();
            
            // Zoom to selected village
            if (this.selectedVillage) {
                this.zoomToVillage(this.selectedVillage);
            }
        });

        // Add pin button
        document.getElementById('add-pin-btn').addEventListener('click', () => {
            this.showPinModal();
        });

        // My location button
        document.getElementById('my-location-btn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Filter button
        document.getElementById('filter-btn').addEventListener('click', () => {
            this.toggleSeverityFilter();
        });

        // Reset view button (if it exists)
        const resetViewBtn = document.getElementById('reset-view-btn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                this.resetMapView();
            });
        }

        // Severity filter checkboxes
        document.querySelectorAll('.severity-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filterPins();
            });
        });

        // Modal close buttons
        document.getElementById('close-pin-modal').addEventListener('click', () => {
            this.hidePinModal();
        });

        document.getElementById('close-details-modal').addEventListener('click', () => {
            this.hidePinDetailsModal();
        });

        // Pin form submission
        document.getElementById('pin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPin();
        });

        // Offer form submission
        document.getElementById('offer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOffer();
        });

        // Cancel pin button
        document.getElementById('cancel-pin').addEventListener('click', () => {
            this.hidePinModal();
        });

        // Add a way to cancel when in "add pin" mode but no location selected
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.addingPin) {
                this.cancelAddPin();
            }
        });

        // Reset location button (if it exists)
        const resetLocationBtn = document.getElementById('reset-location');
        if (resetLocationBtn) {
            resetLocationBtn.addEventListener('click', () => {
                this.currentLocation = null;
                this.showMessage('📍 Location reset. Click on the map again to select a new location.', 'info');
            });
        }

        // Media file input
        document.getElementById('pin-media').addEventListener('change', (e) => {
            this.handleMediaFiles(e.target.files);
        });
    }

    updateVillageOptions() {
        const villageSelect = document.getElementById('village-select');
        villageSelect.innerHTML = '<option value="">Select Village</option>';
        
        if (!this.selectedDistrict) return;

        // Sample villages for each district (in a real app, this would come from a database)
        const villages = this.getVillagesForDistrict(this.selectedDistrict);
        
        villages.forEach(village => {
            const option = document.createElement('option');
            option.value = village.toLowerCase().replace(/\s+/g, '-');
            option.textContent = village;
            villageSelect.appendChild(option);
        });
    }

    getVillagesForDistrict(district) {
        // Sample villages for demonstration
        const villageMap = {
            'amritsar': ['Amritsar City', 'Ranjit Avenue', 'Lawrence Road', 'Mall Road'],
            'ludhiana': ['Ludhiana City', 'Civil Lines', 'Model Town', 'Sarabha Nagar'],
            'jalandhar': ['Jalandhar City', 'Model Town', 'Adarsh Nagar', 'Civil Lines'],
            'patiala': ['Patiala City', 'Leela Bhawan', 'Urban Estate', 'Civil Lines'],
            'bathinda': ['Bathinda City', 'Model Town', 'Civil Lines', 'Adarsh Nagar'],
            'moga': ['Moga City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'sangrur': ['Sangrur City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'ferozepur': ['Ferozepur City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'gurdaspur': ['Gurdaspur City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'hoshiarpur': ['Hoshiarpur City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'kapurthala': ['Kapurthala City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'mansa': ['Mansa City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'muktsar': ['Muktsar City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'pathankot': ['Pathankot City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'rupnagar': ['Rupnagar City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'sahibzada-ajit-singh-nagar': ['Mohali City', 'Phase 1', 'Phase 2', 'Phase 3'],
            'shahid-bhagat-singh-nagar': ['Nawanshahr City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'tarn-taran': ['Tarn Taran City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'barnala': ['Barnala City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'faridkot': ['Faridkot City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'fatehgarh-sahib': ['Fatehgarh Sahib City', 'Civil Lines', 'Model Town', 'Adarsh Nagar'],
            'fazilka': ['Fazilka City', 'Civil Lines', 'Model Town', 'Adarsh Nagar']
        };
        
        return villageMap[district] || ['Village 1', 'Village 2', 'Village 3', 'Village 4'];
    }

    getDistrictCoordinates(district) {
        // District coordinates for Punjab
        const districtCoords = {
            'amritsar': [31.6340, 74.8711],
            'ludhiana': [30.9010, 75.8573],
            'jalandhar': [31.3260, 75.5792],
            'patiala': [30.3398, 76.3869],
            'bathinda': [30.2070, 74.9455],
            'moga': [30.8168, 75.1688],
            'sangrur': [30.2450, 75.8449],
            'ferozepur': [30.9258, 74.6133],
            'gurdaspur': [32.0383, 75.4026],
            'hoshiarpur': [31.5320, 75.9170],
            'kapurthala': [31.3805, 75.3810],
            'mansa': [29.9944, 75.3826],
            'muktsar': [30.4743, 74.5166],
            'pathankot': [32.2743, 75.6524],
            'rupnagar': [30.9658, 76.5264],
            'sahibzada-ajit-singh-nagar': [30.7046, 76.7179],
            'shahid-bhagat-singh-nagar': [31.1261, 76.1315],
            'tarn-taran': [31.4504, 74.9249],
            'barnala': [30.3745, 75.5486],
            'faridkot': [30.6739, 74.7559],
            'fatehgarh-sahib': [30.6800, 76.2571],
            'fazilka': [30.4021, 74.0284]
        };
        
        return districtCoords[district] || [31.1471, 75.3412]; // Default to Punjab center
    }

    zoomToDistrict(district) {
        const coords = this.getDistrictCoordinates(district);
        if (coords) {
            this.map.flyTo(coords, 12, { // Increased zoom level for better district view
                duration: 1.5,
                easeLinearity: 0.25
            });
            console.log(`Zoomed to ${district} at coordinates:`, coords);
            
            // Show user feedback
            const districtName = this.getDistrictDisplayName(district);
            this.showMessage(`🗺️ Zooming to ${districtName} district...`, 'info');
        }
    }

    getDistrictDisplayName(district) {
        // Convert district ID to display name
        const districtNames = {
            'amritsar': 'Amritsar',
            'ludhiana': 'Ludhiana',
            'jalandhar': 'Jalandhar',
            'patiala': 'Patiala',
            'bathinda': 'Bathinda',
            'moga': 'Moga',
            'sangrur': 'Sangrur',
            'ferozepur': 'Ferozepur',
            'gurdaspur': 'Gurdaspur',
            'hoshiarpur': 'Hoshiarpur',
            'kapurthala': 'Kapurthala',
            'mansa': 'Mansa',
            'muktsar': 'Muktsar',
            'pathankot': 'Pathankot',
            'rupnagar': 'Rupnagar',
            'sahibzada-ajit-singh-nagar': 'Sahibzada Ajit Singh Nagar (Mohali)',
            'shahid-bhagat-singh-nagar': 'Shahid Bhagat Singh Nagar (Nawanshahr)',
            'tarn-taran': 'Tarn Taran',
            'barnala': 'Barnala',
            'faridkot': 'Faridkot',
            'fatehgarh-sahib': 'Fatehgarh Sahib',
            'fazilka': 'Fazilka'
        };
        
        return districtNames[district] || district;
    }

    resetMapView() {
        // Reset to Punjab overview
        this.map.flyTo(CONFIG.MAP.center, CONFIG.MAP.zoom, {
            duration: 1.5,
            easeLinearity: 0.25
        });
        
        // Reset selections
        this.selectedDistrict = '';
        this.selectedVillage = '';
        document.getElementById('district-select').value = '';
        document.getElementById('village-select').innerHTML = '<option value="">Select Village</option>';
        
        // Reset filters
        document.querySelectorAll('.severity-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Reload all pins
        this.filterPins();
        
        this.showMessage('🗺️ Reset to Punjab overview', 'info');
    }

    getVillageCoordinates(village) {
        // Village coordinates for major villages in Punjab with slight variations
        const villageCoords = {
            // Amritsar villages
            'amritsar-city': [31.6340, 74.8711],
            'ranjit-avenue': [31.6340, 74.8711],
            'lawrence-road': [31.6340, 74.8711],
            'mall-road': [31.6340, 74.8711],
            
            // Ludhiana villages
            'ludhiana-city': [30.9010, 75.8573],
            'civil-lines': [30.9010, 75.8573],
            'model-town': [30.9010, 75.8573],
            'sarabha-nagar': [30.9010, 75.8573],
            
            // Jalandhar villages
            'jalandhar-city': [31.3260, 75.5792],
            'adarsh-nagar': [31.3260, 75.5792],
            
            // Patiala villages
            'patiala-city': [30.3398, 76.3869],
            'leela-bhawan': [30.3398, 76.3869],
            'urban-estate': [30.3398, 76.3869],
            
            // Bathinda villages
            'bathinda-city': [30.2070, 74.9455],
            
            // Moga villages
            'moga-city': [30.8168, 75.1688],
            
            // Sangrur villages
            'sangrur-city': [30.2450, 75.8449],
            
            // Ferozepur villages
            'ferozepur-city': [30.9258, 74.6133],
            
            // Gurdaspur villages
            'gurdaspur-city': [32.0383, 75.4026],
            
            // Hoshiarpur villages
            'hoshiarpur-city': [31.5320, 75.9170],
            
            // Kapurthala villages
            'kapurthala-city': [31.3805, 75.3810],
            
            // Mansa villages
            'mansa-city': [29.9944, 75.3826],
            
            // Muktsar villages
            'muktsar-city': [30.4743, 74.5166],
            
            // Pathankot villages
            'pathankot-city': [32.2743, 75.6524],
            
            // Rupnagar villages
            'rupnagar-city': [30.9658, 76.5264],
            
            // Mohali villages
            'mohali-city': [30.7046, 76.7179],
            'phase-1': [30.7046, 76.7179],
            'phase-2': [30.7046, 76.7179],
            'phase-3': [30.7046, 76.7179],
            
            // Nawanshahr villages
            'nawanshahr-city': [31.1261, 76.1315],
            
            // Tarn Taran villages
            'tarn-taran-city': [31.4504, 74.9249],
            
            // Barnala villages
            'barnala-city': [30.3745, 75.5486],
            
            // Faridkot villages
            'faridkot-city': [30.6739, 74.7559],
            
            // Fatehgarh Sahib villages
            'fatehgarh-sahib-city': [30.6800, 76.2571],
            
            // Fazilka villages
            'fazilka-city': [30.4021, 74.0284]
        };
        
        return villageCoords[village] || null;
    }

    zoomToVillage(village) {
        const coords = this.getVillageCoordinates(village);
        if (coords) {
            this.map.flyTo(coords, 14, { // Higher zoom level for village view
                duration: 1.5,
                easeLinearity: 0.25
            });
            console.log(`Zoomed to village ${village} at coordinates:`, coords);
            
            // Show user feedback
            const villageName = this.getVillageDisplayName(village);
            this.showMessage(`🗺️ Zooming to ${villageName}...`, 'info');
        } else {
            // If village coordinates not found, zoom to district center with higher zoom
            const districtCoords = this.getDistrictCoordinates(this.selectedDistrict);
            if (districtCoords) {
                this.map.flyTo(districtCoords, 13, {
                    duration: 1.5,
                    easeLinearity: 0.25
                });
                console.log(`Zoomed to district center for village ${village}`);
                
                const villageName = this.getVillageDisplayName(village);
                this.showMessage(`🗺️ Zooming to ${villageName} area...`, 'info');
            }
        }
    }

    getVillageDisplayName(village) {
        // Convert village ID to display name
        const villageNames = {
            'amritsar-city': 'Amritsar City',
            'ranjit-avenue': 'Ranjit Avenue',
            'lawrence-road': 'Lawrence Road',
            'mall-road': 'Mall Road',
            'ludhiana-city': 'Ludhiana City',
            'civil-lines': 'Civil Lines',
            'model-town': 'Model Town',
            'sarabha-nagar': 'Sarabha Nagar',
            'jalandhar-city': 'Jalandhar City',
            'adarsh-nagar': 'Adarsh Nagar',
            'patiala-city': 'Patiala City',
            'leela-bhawan': 'Leela Bhawan',
            'urban-estate': 'Urban Estate',
            'bathinda-city': 'Bathinda City',
            'moga-city': 'Moga City',
            'sangrur-city': 'Sangrur City',
            'ferozepur-city': 'Ferozepur City',
            'gurdaspur-city': 'Gurdaspur City',
            'hoshiarpur-city': 'Hoshiarpur City',
            'kapurthala-city': 'Kapurthala City',
            'mansa-city': 'Mansa City',
            'muktsar-city': 'Muktsar City',
            'pathankot-city': 'Pathankot City',
            'rupnagar-city': 'Rupnagar City',
            'mohali-city': 'Mohali City',
            'phase-1': 'Phase 1',
            'phase-2': 'Phase 2',
            'phase-3': 'Phase 3',
            'nawanshahr-city': 'Nawanshahr City',
            'tarn-taran-city': 'Tarn Taran City',
            'barnala-city': 'Barnala City',
            'faridkot-city': 'Faridkot City',
            'fatehgarh-sahib-city': 'Fatehgarh Sahib City',
            'fazilka-city': 'Fazilka City'
        };
        
        return villageNames[village] || village;
    }

    async getCurrentLocation() {
        if (navigator.geolocation) {
            try {
                this.showMessage('Getting your location...', 'info');
                
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 60000
                    });
                });

                this.currentLocation = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                };

                // Fly to current location
                this.map.flyTo({
                    center: [this.currentLocation.lng, this.currentLocation.lat],
                    zoom: 12
                });

                this.showMessage('Location found! You can now add a pin at your location.', 'success');
            } catch (error) {
                console.error('Geolocation error:', error);
                
                // Provide specific error messages
                let errorMessage = 'Could not get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'Please enable location services and try again.';
                }
                
                this.showMessage(errorMessage, 'error');
                
                // Show instructions for enabling location
                setTimeout(() => {
                    this.showMessage('💡 Tip: Click the lock icon in your browser address bar and allow location access.', 'info');
                }, 3000);
            }
        } else {
            this.showMessage('Geolocation is not supported by this browser. Please use a modern browser.', 'error');
        }
    }

    showPinModal() {
        this.addingPin = true;
        console.log('Pin modal opened, addingPin set to:', this.addingPin);
        
        // Show helpful message to guide user first
        this.showMessage('📍 Click anywhere on the map to select the location for your pin, then the form will appear. (Press ESC to cancel)', 'info');
        
        // Add visual indicator to map
        document.getElementById('map').style.cursor = 'crosshair';
        
        // Add a temporary overlay to indicate "add pin" mode
        this.addPinModeOverlay();
        
        // Don't show modal yet - wait for location selection
    }

    hidePinModal() {
        this.addingPin = false;
        console.log('Pin modal closed, addingPin set to:', this.addingPin);
        document.getElementById('pin-modal').style.display = 'none';
        
        // Reset map cursor
        document.getElementById('map').style.cursor = 'grab';
        this.removePinModeOverlay();
    }

    cancelAddPin() {
        this.addingPin = false;
        this.currentLocation = null;
        console.log('Add pin cancelled');
        document.getElementById('map').style.cursor = 'grab';
        this.removePinModeOverlay();
        this.showMessage('❌ Add pin cancelled. Click "Add Pin" again to try.', 'info');
    }

    addPinModeOverlay() {
        // Remove existing overlay if any
        this.removePinModeOverlay();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'pin-mode-overlay';
        overlay.innerHTML = `
            <div style="
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(231, 76, 60, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                📍 Click on map to select location
            </div>
        `;
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.getElementById('map').appendChild(overlay);
    }

    removePinModeOverlay() {
        const overlay = document.getElementById('pin-mode-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    showPinDetailsModal(pin) {
        this.currentPin = pin;
        document.getElementById('pin-details-title').textContent = pin.title;
        
        const content = document.getElementById('pin-details-content');
        content.innerHTML = `
            <div class="pin-details">
                <h3>${pin.title}</h3>
                <p><strong>Description:</strong> ${pin.description}</p>
                <p><strong>Location:</strong> ${pin.district}, ${pin.village}</p>
                <p><strong>Severity:</strong> <span class="severity-badge severity-${pin.severity}">${pin.severity}</span></p>
                <p><strong>Posted:</strong> ${new Date(pin.timestamp).toLocaleString()}</p>
                ${pin.contact ? `<p><strong>Contact:</strong> ${pin.contact}</p>` : ''}
                ${pin.mediaUrls && pin.mediaUrls.length > 0 ? `
                    <div class="media-gallery">
                        <strong>Media:</strong>
                        <div class="media-preview">
                            ${pin.mediaUrls.map(url => `
                                ${url.match(/\.(jpg|jpeg|png|gif)$/i) ? 
                                    `<img src="${url}" alt="Media" onclick="window.open('${url}', '_blank')">` :
                                    `<video src="${url}" controls></video>`
                                }
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('pin-details-modal').style.display = 'block';
    }

    hidePinDetailsModal() {
        document.getElementById('pin-details-modal').style.display = 'none';
        this.currentPin = null;
    }

    toggleSeverityFilter() {
        const filter = document.getElementById('severity-filter');
        filter.style.display = filter.style.display === 'none' ? 'block' : 'none';
    }

    handleMediaFiles(files) {
        const preview = document.getElementById('media-preview');
        preview.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaElement = file.type.startsWith('image/') ? 
                    `<img src="${e.target.result}" alt="Preview">` :
                    `<video src="${e.target.result}" controls></video>`;
                
                preview.innerHTML += mediaElement;
            };
            reader.readAsDataURL(file);
        });
    }

    async addPin() {
        const formData = new FormData(document.getElementById('pin-form'));
        const title = document.getElementById('pin-title').value;
        const description = document.getElementById('pin-description').value;
        const severity = document.getElementById('pin-severity').value;
        const contact = document.getElementById('pin-contact').value;
        const district = this.selectedDistrict;
        const village = this.selectedVillage;

        if (!title || !description || !severity || !district || !village) {
            this.showMessage('Please fill in all required fields and select location.', 'error');
            return;
        }

        if (!this.currentLocation) {
            this.showMessage('📍 Please click on the map to select a location for your pin first, then try submitting again.', 'error');
            return;
        }

        try {
            this.showLoading(true);

            const pin = {
                id: Date.now().toString(),
                title,
                description,
                severity,
                contact,
                district,
                village,
                location: {
                    lng: this.currentLocation.lng,
                    lat: this.currentLocation.lat
                },
                timestamp: Date.now(),
                mediaUrls: [], // In a real app, you'd upload files to Firebase Storage
                offers: []
            };

            // Save to database
            await this.savePin(pin);

            // Add to local array
            this.pins.push(pin);

            // Update map
            this.addMarkerToMap(pin);

            // Update pin count
            this.updatePinCount();

            this.hidePinModal();
            this.showMessage('Pin added successfully!', 'success');

        } catch (error) {
            console.error('Error adding pin:', error);
            this.showMessage('Error adding pin. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    addPinAtLocation(latlng) {
        console.log('Adding pin at location:', latlng);
        this.currentLocation = { lng: latlng.lng, lat: latlng.lat };
        
        // Show success message for location selection
        this.showMessage('✅ Location selected! Now fill out the form below.', 'success');
        
        // Now show the modal after location is selected
        document.getElementById('pin-modal').style.display = 'block';
        document.getElementById('pin-form').reset();
        document.getElementById('media-preview').innerHTML = '';
        
        // Reset map cursor and remove overlay
        document.getElementById('map').style.cursor = 'grab';
        this.removePinModeOverlay();
    }

    async savePin(pin) {
        if (this.useLocalStorage) {
            const pins = JSON.parse(localStorage.getItem('disasterAidPins') || '[]');
            pins.push(pin);
            localStorage.setItem('disasterAidPins', JSON.stringify(pins));
        } else {
            await this.db.ref('pins').child(pin.id).set(pin);
        }
    }

    async loadPins() {
        try {
            let pins = [];
            
            if (this.useLocalStorage) {
                pins = JSON.parse(localStorage.getItem('disasterAidPins') || '[]');
            } else {
                const snapshot = await this.db.ref('pins').once('value');
                pins = Object.values(snapshot.val() || {});
            }

            this.pins = pins;
            this.filteredPins = pins;
            
            // Add markers to map
            pins.forEach(pin => this.addMarkerToMap(pin));
            
            // Update pin count
            this.updatePinCount();
            
        } catch (error) {
            console.error('Error loading pins:', error);
            this.showMessage('Error loading existing pins.', 'error');
        }
    }

    setupRealtimeUpdates() {
        if (!this.useLocalStorage && this.db) {
            this.db.ref('pins').on('child_added', (snapshot) => {
                const pin = snapshot.val();
                if (!this.pins.find(p => p.id === pin.id)) {
                    this.pins.push(pin);
                    this.addMarkerToMap(pin);
                    this.updatePinCount();
                }
            });

            this.db.ref('pins').on('child_changed', (snapshot) => {
                const updatedPin = snapshot.val();
                const index = this.pins.findIndex(p => p.id === updatedPin.id);
                if (index !== -1) {
                    this.pins[index] = updatedPin;
                    this.updateMarker(updatedPin);
                }
            });
        }
    }

    addMarkerToMap(pin) {
        const marker = L.marker([pin.location.lat, pin.location.lng], {
            icon: this.customIcons[pin.severity] || this.customIcons.medium
        }).addTo(this.map);

        // Add popup
        const popupContent = `
            <div class="popup-content">
                <h4>${pin.title}</h4>
                <p><strong>Severity:</strong> <span class="severity-badge severity-${pin.severity}">${pin.severity}</span></p>
                <p>${pin.description.substring(0, 100)}${pin.description.length > 100 ? '...' : ''}</p>
                <button onclick="app.showPinDetailsModal(${JSON.stringify(pin).replace(/"/g, '&quot;')})" class="btn btn-primary btn-sm">View Details</button>
            </div>
        `;

        marker.bindPopup(popupContent);

        // Store marker reference
        pin.marker = marker;
        this.markers.push(marker);
    }

    updateMarker(pin) {
        if (pin.marker) {
            this.map.removeLayer(pin.marker);
        }
        this.addMarkerToMap(pin);
    }

    getSeverityColor(severity) {
        return CONFIG.SEVERITY[severity]?.color || '#95a5a6';
    }

    filterPins() {
        const selectedSeverities = Array.from(document.querySelectorAll('.severity-options input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        this.filteredPins = this.pins.filter(pin => {
            const matchesSeverity = selectedSeverities.includes(pin.severity);
            const matchesDistrict = !this.selectedDistrict || pin.district === this.selectedDistrict;
            const matchesVillage = !this.selectedVillage || pin.village === this.selectedVillage;
            
            return matchesSeverity && matchesDistrict && matchesVillage;
        });

        // Update markers visibility
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];
        
        this.filteredPins.forEach(pin => {
            this.addMarkerToMap(pin);
        });

        this.updatePinCount();
    }

    updatePinCount() {
        document.getElementById('pin-count').textContent = this.filteredPins.length;
    }

    async submitOffer() {
        if (!this.currentPin) return;

        const name = document.getElementById('offer-name').value;
        const contact = document.getElementById('offer-contact').value;
        const message = document.getElementById('offer-message').value;

        if (!name || !contact || !message) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }

        try {
            const offer = {
                id: Date.now().toString(),
                name,
                contact,
                message,
                timestamp: Date.now()
            };

            // Add offer to pin
            this.currentPin.offers = this.currentPin.offers || [];
            this.currentPin.offers.push(offer);

            // Save updated pin
            await this.savePin(this.currentPin);

            // Update local pin
            const index = this.pins.findIndex(p => p.id === this.currentPin.id);
            if (index !== -1) {
                this.pins[index] = this.currentPin;
            }

            this.hidePinDetailsModal();
            this.showMessage('Offer submitted successfully! The person in need will be notified.', 'success');

        } catch (error) {
            console.error('Error submitting offer:', error);
            this.showMessage('Error submitting offer. Please try again.', 'error');
        }
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message; // Changed to innerHTML to support emojis

        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageDiv, mainContent.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Check location permission status
    checkLocationPermission() {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                if (result.state === 'denied') {
                    this.showMessage('📍 Location access is blocked. Please enable it in your browser settings to use the "My Location" feature.', 'warning');
                }
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DisasterAidApp();
});

// Add some sample data for demonstration
function addSampleData() {
    const samplePins = [
        {
            id: '1',
            title: 'Need Boats for Rescue',
            description: 'Village is completely flooded. Need boats to rescue stranded families. Water level is rising rapidly.',
            severity: 'critical',
            contact: '+91-98765-43210',
            district: 'amritsar',
            village: 'amritsar-city',
            location: { lng: 74.8711, lat: 31.6340 },
            timestamp: Date.now() - 3600000,
            offers: []
        },
        {
            id: '2',
            title: 'Medical Supplies Needed',
            description: 'Local clinic needs medical supplies for treating flood-related injuries and water-borne diseases.',
            severity: 'high',
            contact: '+91-98765-43211',
            district: 'ludhiana',
            village: 'ludhiana-city',
            location: { lng: 75.8573, lat: 30.9010 },
            timestamp: Date.now() - 7200000,
            offers: []
        },
        {
            id: '3',
            title: 'Food and Water Distribution',
            description: 'Setting up relief camp. Need volunteers and supplies for food and water distribution.',
            severity: 'medium',
            contact: '+91-98765-43212',
            district: 'jalandhar',
            village: 'jalandhar-city',
            location: { lng: 75.5792, lat: 31.3260 },
            timestamp: Date.now() - 10800000,
            offers: []
        }
    ];

    localStorage.setItem('disasterAidPins', JSON.stringify(samplePins));
    console.log('Sample data added. Refresh the page to see the pins.');
}

// Uncomment the line below to add sample data for testing
addSampleData();

// Test function to verify map click is working
function testMapClick() {
    if (window.app && window.app.map) {
        console.log('Testing map click...');
        // Simulate a click at the center of the map
        const center = window.app.map.getCenter();
        console.log('Map center:', center);
        
        // Trigger a click event
        const clickEvent = {
            latlng: center,
            originalEvent: new MouseEvent('click')
        };
        
        // Manually trigger the click handler
        if (window.app.addingPin) {
            window.app.addPinAtLocation(clickEvent.latlng);
        } else {
            console.log('addingPin is false. Open the pin modal first.');
        }
    } else {
        console.log('App or map not initialized yet.');
    }
}

// Make test function available globally
window.testMapClick = testMapClick;

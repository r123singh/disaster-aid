// Configuration file for Punjab Disaster Aid Application
// Replace the placeholder values with your actual API keys

const CONFIG = {
    // Leaflet Configuration (Free OpenStreetMap)
    MAP: {
        center: [31.1471, 75.3412], // Punjab coordinates [lat, lng]
        zoom: 7,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },

    // Firebase Configuration
    FIREBASE: {
        apiKey: "FIREBASE_API_KEY",
        authDomain: "disaster-aid-punjab.firebaseapp.com",
        databaseURL: "https://disaster-aid-punjab-default-rtdb.firebaseio.com",
        projectId: "disaster-aid-punjab",
        storageBucket: "disaster-aid-punjab.firebasestorage.app",
        messagingSenderId: "844928288749",
        appId: "1:844928288749:web:6c7a67e27a5b723e8b49e4",
        measurementId: "G-GMEQHV2KPY"
      },

    // Application Settings
    APP: {
        name: 'Punjab Disaster Aid',
        version: '1.0.0',
        description: 'Map-based relief coordination for Punjab flood victims',
        defaultSeverity: 'medium',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        supportedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],
        autoRefreshInterval: 30000, // 30 seconds
        messageTimeout: 5000 // 5 seconds
    },

    // Punjab Districts and Coordinates
    DISTRICTS: {
        'amritsar': { name: 'Amritsar', center: [74.8711, 31.6340] },
        'barnala': { name: 'Barnala', center: [75.5483, 30.3745] },
        'bathinda': { name: 'Bathinda', center: [74.9481, 30.2110] },
        'faridkot': { name: 'Faridkot', center: [74.7559, 30.6739] },
        'fatehgarh-sahib': { name: 'Fatehgarh Sahib', center: [76.3784, 30.6802] },
        'fazilka': { name: 'Fazilka', center: [74.0283, 30.4021] },
        'ferozepur': { name: 'Ferozepur', center: [74.6119, 30.9258] },
        'gurdaspur': { name: 'Gurdaspur', center: [75.4017, 32.0388] },
        'hoshiarpur': { name: 'Hoshiarpur', center: [75.9172, 31.5320] },
        'jalandhar': { name: 'Jalandhar', center: [75.5792, 31.3260] },
        'kapurthala': { name: 'Kapurthala', center: [75.3811, 31.3805] },
        'ludhiana': { name: 'Ludhiana', center: [75.8573, 30.9010] },
        'mansa': { name: 'Mansa', center: [75.3989, 29.9944] },
        'moga': { name: 'Moga', center: [75.1745, 30.8168] },
        'muktsar': { name: 'Muktsar', center: [74.5163, 30.4743] },
        'pathankot': { name: 'Pathankot', center: [75.6497, 32.2743] },
        'patiala': { name: 'Patiala', center: [76.4008, 30.3398] },
        'rupnagar': { name: 'Rupnagar', center: [76.5333, 30.9663] },
        'sahibzada-ajit-singh-nagar': { name: 'Sahibzada Ajit Singh Nagar', center: [76.7075, 30.7046] },
        'sangrur': { name: 'Sangrur', center: [75.8474, 30.2453] },
        'shahid-bhagat-singh-nagar': { name: 'Shahid Bhagat Singh Nagar', center: [76.1333, 31.1167] },
        'tarn-taran': { name: 'Tarn Taran', center: [74.9258, 31.4504] }
    },

    // Severity Levels Configuration
    SEVERITY: {
        critical: {
            label: 'Critical - Immediate help needed',
            color: '#e74c3c',
            priority: 1
        },
        high: {
            label: 'High - Urgent help needed',
            color: '#f39c12',
            priority: 2
        },
        medium: {
            label: 'Medium - Help needed soon',
            color: '#f1c40f',
            priority: 3
        },
        low: {
            label: 'Low - General assistance',
            color: '#27ae60',
            priority: 4
        }
    },

    // Emergency Contacts
    EMERGENCY_CONTACTS: {
        national: {
            emergency: '112',
            ndrf: '011-23438000',
            disaster_management: '011-23438001'
        },
        punjab: {
            disaster_management: 'http://pdma.punjab.gov.in/',
            police: '100',
            ambulance: '108',
            fire: '101'
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

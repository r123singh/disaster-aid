# Punjab Disaster Aid - Map-Based Relief Coordination

A real-time, map-based web application to help flood victims in Punjab connect with aid providers. Built with modern web technologies and designed for immediate deployment on GitHub Pages.

## 🚀 Features

### For Victims (People in Need)
- **Interactive Map Interface**: Visual representation of all needs across Punjab
- **Easy Pin Creation**: Add your needs with location, description, and severity level
- **Multi-modal Input**: Support for text, images, and videos
- **Real-time Updates**: See new offers and responses instantly
- **Location-based Filtering**: Filter by district and village
- **Severity Classification**: Mark needs as Critical, High, Medium, or Low priority

### For Aid Providers
- **Browse Active Needs**: View all current needs on the interactive map
- **Filter by Severity**: Focus on the most urgent cases first
- **Direct Communication**: Offer help directly through the platform
- **Location-based Matching**: Find needs in specific areas
- **Real-time Notifications**: Get updates when new needs are posted

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Capability**: Basic functionality works without internet
- **Real-time Database**: Firebase integration for live updates
- **Interactive Maps**: Leaflet.js with OpenStreetMap for smooth map interactions
- **Modern UI/UX**: Clean, intuitive interface optimized for emergency use

## 🛠️ Setup Instructions

### Prerequisites
- A Firebase account (free tier available)
- Basic knowledge of HTML, CSS, and JavaScript
- No map API key required (uses free OpenStreetMap)

### Step 1: Get API Keys

#### Map Setup (No API Key Required!)
The application uses **Leaflet.js** with **OpenStreetMap**, which is completely free and doesn't require any API keys or credit cards.

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database (Create a new database -> Start in test mode -> Enable)
4. Go to Project Settings > General
5. Scroll down to "Your apps" and click the web icon
6. Register your app and copy the configuration
7. Replace the Firebase configuration in `config.js`

### Step 2: Configure Firebase Database Rules

In your Firebase Console, go to Realtime Database > Rules and set:

```json
{
  "rules": {
    "pins": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Step 3: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files to the repository:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
   - `README.md`
3. Go to repository Settings > Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your app will be available at `https://yourusername.github.io/repository-name`

### Step 4: Test the Application

1. Open your deployed application
2. Try adding a test pin
3. Test the filtering functionality
4. Verify that offers can be submitted

## 📱 Usage Guide

### Adding a Need Pin
1. Click "Add Need Pin" button
2. Select your district and village from the dropdowns
3. Click on the map to set your exact location
4. Fill in the form with:
   - Title (brief description)
   - Detailed description
   - Severity level
   - Contact information (optional)
   - Media files (optional)
5. Click "Add Pin"

### Offering Help
1. Browse the map for active needs
2. Click on any pin to see details
3. Fill out the "Offer Help" form with:
   - Your name
   - Contact information
   - How you can help
4. Click "Send Offer"

### Filtering and Navigation
- Use the district and village dropdowns to filter by location
- Click the "Filter" button to show/hide severity filters
- Use the map controls to zoom and pan
- Click "My Location" to center the map on your current position

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive breakpoints are defined for mobile optimization

### Functionality
- Add new districts/villages in the `getVillagesForDistrict()` function
- Modify severity levels in the `getSeverityColor()` function
- Add new features by extending the `DisasterAidApp` class

### Database Schema
The app uses a simple schema:
```javascript
{
  "pins": {
    "pinId": {
      "id": "unique_id",
      "title": "Need description",
      "description": "Detailed description",
      "severity": "critical|high|medium|low",
      "contact": "contact_info",
      "district": "district_name",
      "village": "village_name",
      "location": {
        "lng": longitude,
        "lat": latitude
      },
      "timestamp": timestamp,
      "mediaUrls": ["url1", "url2"],
      "offers": [
        {
          "id": "offer_id",
          "name": "helper_name",
          "contact": "helper_contact",
          "message": "offer_message",
          "timestamp": timestamp
        }
      ]
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**Map not loading:**
- Ensure you have internet connection
- Check browser console for errors
- Verify Leaflet library is loading

**Database not working:**
- Verify Firebase configuration
- Check database rules
- Ensure Firebase project is properly set up

**Location not working:**
- Allow location access in browser
- Check if HTTPS is enabled (required for geolocation)

**Pins not showing:**
- Check if sample data is loaded
- Verify database connection
- Check browser console for errors

### Performance Optimization
- The app uses localStorage as fallback for offline functionality
- Images are compressed and optimized
- Database queries are optimized for real-time updates

## 🌟 Future Enhancements

- **Push Notifications**: Real-time alerts for new needs/offers
- **SMS Integration**: Text message notifications
- **Advanced Filtering**: Filter by date, type of need, etc.
- **Analytics Dashboard**: Track relief efforts and statistics
- **Multi-language Support**: Punjabi and Hindi language options
- **Offline Mode**: Full offline functionality with sync
- **Mobile App**: Native mobile applications
- **AI Integration**: Smart matching of needs with providers

## 🤝 Contributing

This is an open-source project for disaster relief. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the people of Punjab during flood crisis**

*This application is designed for immediate deployment and use during emergency situations. Please ensure all API keys and configurations are properly set up before deployment.*

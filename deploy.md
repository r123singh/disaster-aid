# Quick Deployment Guide for GitHub Pages

## Step-by-Step Deployment

### 1. Create GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it `punjab-disaster-aid` or any name you prefer
4. Make it public
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Upload Files
1. In your new repository, click "uploading an existing file"
2. Drag and drop all these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
   - `README.md`
3. Add a commit message like "Initial commit - Punjab Disaster Aid App"
4. Click "Commit changes"

### 3. Configure Firebase (Only)
1. Edit `config.js` file in your repository
2. Replace the Firebase placeholder values with your actual Firebase configuration:
   - `YOUR_FIREBASE_API_KEY` - Get from [Firebase Console](https://console.firebase.google.com/)
   - All other Firebase config values
3. **No map API key needed** - The app uses free OpenStreetMap tiles

### 4. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait a few minutes for deployment

### 5. Test Your App
1. Your app will be available at: `https://yourusername.github.io/repository-name`
2. Test all features:
   - Map loading
   - Adding pins
   - Filtering
   - Offering help

## API Setup Instructions

### Map Setup (No API Key Required!)
The application uses **Leaflet.js** with **OpenStreetMap**, which is completely free and doesn't require any API keys or credit cards.

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database
4. Go to Project Settings > General
5. Scroll to "Your apps" and click the web icon
6. Register your app with any name
7. Copy the config object
8. Replace all Firebase values in `config.js`

### Firebase Database Rules
In Firebase Console > Realtime Database > Rules, set:
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

## Troubleshooting

### Common Issues:
- **Map not loading**: Check internet connection and browser console
- **Database errors**: Verify Firebase config and rules
- **Location not working**: Must be on HTTPS (GitHub Pages provides this)
- **Pins not showing**: Check browser console for errors

### Testing Locally:
1. Install a local server: `npm install -g http-server`
2. Run: `http-server`
3. Open: `http://localhost:8080`

## Quick Start with Sample Data

To test the app immediately, uncomment the last line in `app.js`:
```javascript
addSampleData(); // Uncomment this line
```

This will add sample pins to test the functionality.

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all API keys are correct
3. Ensure Firebase database rules are set correctly
4. Test on different browsers/devices

---

**Your disaster aid app is now ready to help flood victims in Punjab!**

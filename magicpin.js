// Help the victims via -

// 1. A map-based interface where users pin needs (e.g., "village X needs boats") and match them with suppliers. Deadline: 2 hours.
// 2. Host it for free on GitHub Pages. Deadline: 2 hours.
// 3. Also promote it using X. Deadline: 2 hours.

// Immediate tool to help Punjab floods victims via a discord web-app which is hosted on GitHub. Deadline: 48 hours.

// User Experience:

// 1. Flood affected all across Punjab, is helpless.
// 2. They land on the map interface on the site.
// 3. User can select one state, Punjab. You pick it from the dropdown only by choosing the one happening right below your feet. 🤌
// 4. User can select a district, you pick it from the dropdown only by choosing the one in the field above the google maps popup by default.
// 5. User can select a village, village is pre-selected from the dropdown only by choosing the one in the field above the google maps popup by default.
// 6. User can add a new pin on the map with a short description of their disaster impact and needs. Multi-modal input, text, voice, image, video, etc.
// 7. User can preview the pin added to the map with the description.
// 8. This pin is now visible to all users. User will be able to see it on the map if they select the state, district and village.
// 9. All pins can be filtered by severity of need, to get help immediately.
// 10. Suppliers can see the pin and offer any support they can to the user.
// 11. User can choose the best offer and contact them.
// 12. User also can add a pin on their current location on the map, and add a short description of their disaster impact and needs.

/*
Feasibility & Approach for Interactive Map-based Disaster Aid App

Feasibility:
Yes, it is feasible to design this application using an interactive map provider. The most common and accessible options are:
- Google Maps JavaScript API (free tier available, but with usage limits)
- Mapbox GL JS (generous free tier, open-source, customizable)
- Leaflet.js (open-source, can use free map tile providers like OpenStreetMap)

All of these allow you to:
- Display a map centered on a region (Punjab)
- Add custom pins/markers with metadata (text, images, etc.)
- Allow users to add new pins interactively
- Filter and cluster pins
- Handle user geolocation

Possible Approach:
1. **Frontend (React or Vanilla JS):**
   - Use Mapbox GL JS or Google Maps JS API to render the map.
   - Use Leaflet.js to render the map.
   - Provide dropdowns for State, District, Village (pre-populated for Punjab).
   - Allow users to add pins by clicking on the map or using a form.
   - Attach metadata (description, images, etc.) to each pin.
   - Show all pins for the selected region, with filtering options (e.g., severity).
   - Allow suppliers to click on pins and offer help (via a form or direct contact).

2. **Backend (Optional, for persistence):**
   - Use a simple backend (Node.js/Express, Firebase, or even GitHub Issues/JSON for MVP) to store pins and offers.
   - For a GitHub Pages-only solution, you can use a static JSON file (not real-time), or leverage a free backend like Firebase Realtime Database for live updates.

3. **Hosting:**
   - Host the frontend on GitHub Pages (static site).
   - If using Firebase or similar, connect via client-side JS.

4. **Promotion:**
   - Share the GitHub Pages link on X (Twitter) and other social media.

**Example Stack:**
- Map: Mapbox GL JS (free, easy to use, works on GitHub Pages)
- Data: Firebase Realtime Database (free tier, easy integration)
- Frontend: React or plain JS/HTML/CSS

**References:**
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Google Maps JS API](https://developers.google.com/maps/documentation/javascript/overview)
- [Leaflet.js](https://leafletjs.com/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database/web/start)

**Summary:**  
You can build this as a static web app using Mapbox or Google Maps, with real-time pin data via Firebase or a simple backend. All user interactions (adding pins, filtering, offering help) are supported by these map providers and can be implemented with client-side JavaScript.
*/
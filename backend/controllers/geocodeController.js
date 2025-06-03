// backend/controllers/geocodeController.js
const axios = require('axios');

const geocode = async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ 
      success: false,
      message: "Missing latitude or longitude parameters" 
    });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false,
        message: "Google Maps API key not configured" 
      });
    }

    // First get the place_id
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    console.log(`Making geocoding request to: ${geocodeUrl}`);
    
    const { data: geocodeData } = await axios.get(geocodeUrl);
    console.log('Geocoding API response:', geocodeData);
    
    if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
      const result = geocodeData.results[0];
      let placeName = result.formatted_address;
      
      // If we got a plus code, try to get a more specific place name
      if (placeName.includes('+')) {
        try {
          // Try to get nearby places
          const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=50&key=${apiKey}`;
          const { data: placesData } = await axios.get(placesUrl);
          
          if (placesData.status === 'OK' && placesData.results.length > 0) {
            // Get the closest place
            const closestPlace = placesData.results[0];
            placeName = closestPlace.name;
            
            // Add the vicinity if available
            if (closestPlace.vicinity) {
              placeName += `, ${closestPlace.vicinity}`;
            }
            
            // Add the area if it's not already included
            const area = result.address_components.find(c => 
              c.types.includes('sublocality_level_1') || 
              c.types.includes('locality')
            )?.long_name;
            
            if (area && !placeName.includes(area)) {
              placeName += `, ${area}`;
            }
          }
        } catch (placeError) {
          console.error('Error getting place details:', placeError);
          // Continue with the original formatted address if place details fail
        }
      }
      
      res.json({ 
        success: true,
        placeName: placeName,
        location: placeName,
        addressComponents: result.address_components,
        coordinates: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }
      });
    } else if (geocodeData.status === 'ZERO_RESULTS') {
      res.json({ 
        success: true,
        placeName: `Location: ${lat}, ${lon}`,
        location: `Location: ${lat}, ${lon}`,
        message: "No address found for these coordinates"
      });
    } else {
      console.error('Geocoding API error:', geocodeData);
      res.status(400).json({ 
        success: false,
        message: `Geocoding failed: ${geocodeData.status}`,
        error: geocodeData.error_message || 'Unknown error'
      });
    }
  } catch (err) {
    console.error('Geocoding error:', err.message);
    console.error('Full error:', err);
    
    // Fallback response
    res.status(500).json({ 
      success: false,
      message: "Geocoding service unavailable", 
      error: err.message,
      fallback: {
        placeName: `Coords: ${lat}, ${lon}`,
        location: `Coords: ${lat}, ${lon}`
      }
    });
  }
};

module.exports = { geocode };
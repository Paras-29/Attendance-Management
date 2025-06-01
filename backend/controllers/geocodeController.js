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

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    
    console.log(`Making geocoding request to: ${url}`);
    
    const { data } = await axios.get(url);
    
    console.log('Geocoding API response:', data);
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      res.json({ 
        success: true,
        placeName: result.formatted_address,
        location: result.formatted_address, // Add this for frontend compatibility
        addressComponents: result.address_components,
        coordinates: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }
      });
    } else if (data.status === 'ZERO_RESULTS') {
      res.json({ 
        success: true,
        placeName: `Location: ${lat}, ${lon}`,
        location: `Location: ${lat}, ${lon}`,
        message: "No address found for these coordinates"
      });
    } else {
      console.error('Geocoding API error:', data);
      res.status(400).json({ 
        success: false,
        message: `Geocoding failed: ${data.status}`,
        error: data.error_message || 'Unknown error'
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
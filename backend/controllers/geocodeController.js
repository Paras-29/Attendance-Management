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

    // First try to get a specific place using Places API with a very small radius
    try {
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=20&rankby=distance&key=${apiKey}`;
      const { data: placesData } = await axios.get(placesUrl);
      
      if (placesData.status === 'OK' && placesData.results.length > 0) {
        const closestPlace = placesData.results[0];
        let placeName = closestPlace.name;
        
        // Get the place details for more information
        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${closestPlace.place_id}&fields=name,formatted_address,address_components&key=${apiKey}`;
        const { data: placeDetails } = await axios.get(placeDetailsUrl);
        
        if (placeDetails.status === 'OK' && placeDetails.result) {
          const result = placeDetails.result;
          
          // Try to construct a more specific address
          const addressComponents = result.address_components || [];
          const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name;
          const route = addressComponents.find(c => c.types.includes('route'))?.long_name;
          const sublocality = addressComponents.find(c => c.types.includes('sublocality_level_1'))?.long_name;
          const locality = addressComponents.find(c => c.types.includes('locality'))?.long_name || 'Jaipur';
          
          // Build the address parts
          const addressParts = [];
          if (streetNumber && route) {
            addressParts.push(`${streetNumber} ${route}`);
          } else if (route) {
            addressParts.push(route);
          }
          if (sublocality) {
            addressParts.push(sublocality);
          }
          if (locality) {
            addressParts.push(locality);
          }
          
          // Use the most specific address we can construct
          if (addressParts.length > 0) {
            placeName = addressParts.join(', ');
          } else {
            // Fallback to the place name with vicinity
            placeName = closestPlace.name;
            if (closestPlace.vicinity) {
              placeName += `, ${closestPlace.vicinity}`;
            }
          }
        }
        
        return res.json({ 
          success: true,
          placeName: placeName,
          location: placeName,
          coordinates: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
          }
        });
      }
    } catch (placeError) {
      console.error('Error getting place details:', placeError);
      // Continue with geocoding if place search fails
    }

    // Fallback to geocoding if place search didn't work
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    console.log(`Making geocoding request to: ${geocodeUrl}`);
    
    const { data: geocodeData } = await axios.get(geocodeUrl);
    console.log('Geocoding API response:', geocodeData);
    
    if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
      const result = geocodeData.results[0];
      let placeName = result.formatted_address;
      
      // Try to extract a more specific address from the components
      const addressComponents = result.address_components;
      const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name;
      const route = addressComponents.find(c => c.types.includes('route'))?.long_name;
      const sublocality = addressComponents.find(c => c.types.includes('sublocality_level_1'))?.long_name;
      const locality = addressComponents.find(c => c.types.includes('locality'))?.long_name || 'Jaipur';
      
      // Build a more specific address
      const addressParts = [];
      if (streetNumber && route) {
        addressParts.push(`${streetNumber} ${route}`);
      } else if (route) {
        addressParts.push(route);
      }
      if (sublocality) {
        addressParts.push(sublocality);
      }
      if (locality) {
        addressParts.push(locality);
      }
      
      if (addressParts.length > 0) {
        placeName = addressParts.join(', ');
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
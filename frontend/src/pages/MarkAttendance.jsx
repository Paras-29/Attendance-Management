import { useState, useCallback } from "react";
import { CheckCircle, Mail, MapPin, Clock, AlertCircle, RefreshCw } from "lucide-react";

// Add API URL constant at the top
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MarkAttendance = () => {
  const [status, setStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const getLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 60000 // Allow 1 minute old location
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position);
          resolve(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please check your device's location services.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting location.";
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }, []);

  const getGeocode = async (latitude, longitude) => {
    try {
      console.log(`Requesting geocode for: ${latitude}, ${longitude}`);
      
      const response = await fetch(
        `${API_URL}/api/geocode?lat=${latitude}&lon=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Geocode response status:', response.status);
      
      const data = await response.json();
      console.log('Geocode response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Geocoding failed`);
      }

      // Handle both success and fallback cases
      if (data.success === false) {
        if (data.fallback) {
          console.warn('Using fallback geocoding data:', data.fallback);
          return {
            success: true,
            placeName: data.fallback.placeName,
            location: data.fallback.location
          };
        }
        throw new Error(data.message || 'Geocoding failed');
      }

      return data;
    } catch (error) {
      console.error('Geocoding error:', error);
      
      // Provide fallback location data
      return {
        success: true,
        placeName: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        location: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        isFailback: true
      };
    }
  };

  const handleMarkAttendance = async () => {
    setIsLoading(true);
    setError(null);
    setStatus("Getting your location...");
    const currentTimestamp = new Date();
    setTimestamp(currentTimestamp.toLocaleString());

    try {
      // Get location
      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      
      console.log('Got coordinates:', { latitude, longitude });

      // Get geocode
      setStatus("Getting address details...");
      const geoData = await getGeocode(latitude, longitude);
      
      console.log('Got geocode data:', geoData);
      
      setLocation({
        latitude,
        longitude,
        placeName: geoData.placeName,
        location: geoData.location || geoData.placeName,
        isFailback: geoData.isFailback || false
      });

      // Submit attendance
      setStatus("Submitting attendance...");
      const response = await fetch(
        `${API_URL}/api/attendance/mark`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            timestamp: currentTimestamp.toISOString(),
            latitude,
            longitude,
            placeName: geoData.placeName,
          }),
        }
      );

      const result = await response.json();
      console.log('Attendance response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to mark attendance');
      }

      setStatus("✅ Attendance marked successfully!");
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 3000);
      
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      
      if (retryCount < MAX_RETRIES && (
        error.message.includes("location") || 
        error.message.includes("timeout") ||
        error.message.includes("geocode")
      )) {
        setRetryCount(prev => prev + 1);
        setStatus(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(handleMarkAttendance, 3000);
      } else {
        setStatus("❌ Failed to mark attendance");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    handleMarkAttendance();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="p-10 max-w-md w-full bg-white rounded-2xl shadow-2xl border-blue-100 border">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 flex items-center justify-center gap-2">
          <CheckCircle size={28} className="text-green-500" /> Mark Attendance
        </h1>

        {!submitted ? (
          <>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Enter your registered email"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button
                className={`w-full bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                onClick={() => {
                  if (!email) {
                    setError("Please enter your email address");
                    return;
                  }
                  setSubmitted(true);
                  handleMarkAttendance();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {error ? (
              <div className="w-full bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="flex-1">{error}</span>
                {retryCount < MAX_RETRIES && (
                  <button
                    onClick={handleRetry}
                    className="ml-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xl font-semibold text-blue-700">{status}</p>
            )}
            
            {location && !error && (
              <div className="mt-4 text-base text-gray-700 bg-blue-50 rounded-xl p-4 w-full flex flex-col gap-2 items-start">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="font-medium">Location:</span> 
                  <span className={location.isFailback ? "text-orange-600" : ""}>
                    {location.placeName}
                  </span>
                </div>
                {location.isFailback && (
                  <div className="text-xs text-orange-600 ml-6">
                    (Using coordinates - address lookup unavailable)
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  <span className="font-medium">Time:</span> {timestamp}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <span className="font-medium">Email:</span> {email}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
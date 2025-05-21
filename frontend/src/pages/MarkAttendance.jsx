import { useState } from "react";

const MarkAttendance = () => {
  const [status, setStatus] = useState(null);
  const [location, setLocation] = useState(null); // will store {latitude, longitude, placeName}
  const [timestamp, setTimestamp] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleMarkAttendance = () => {
    setStatus("Marking your attendance...");
    const currentTimestamp = new Date();
    setTimestamp(currentTimestamp.toLocaleString());

    if (!navigator.geolocation) {
      setStatus("❌ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Call Nominatim API for reverse geocoding
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await geoRes.json();
          // Extract readable place name, fallback to coords
          const placeName = geoData.display_name || `${latitude}, ${longitude}`;

          // Save full location info in state
          setLocation({ latitude, longitude, placeName });

          // Send attendance to backend (you can also send placeName if you want)
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance/mark`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              timestamp: currentTimestamp.toISOString(),
              latitude,
              longitude,
              placeName, // optional
            }),
          });

          const result = await response.json();

          if (response.ok) {
            setStatus("✅ Attendance marked successfully!");
          } else {
            setStatus(`❌ ${result.message}`);
          }
        } catch (error) {
          console.error("Network or geocoding error:", error);
          setStatus("❌ Network or geocoding error while submitting attendance.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("❌ Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-center">
      <h1 className="text-xl font-bold mb-4">Mark Attendance</h1>

      {!submitted ? (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full px-4 py-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              if (!email) return alert("Please enter email");
              setSubmitted(true);
              handleMarkAttendance();
            }}
          >
            Submit
          </button>
        </>
      ) : (
        <>
          <p>{status}</p>
          {location && (
            <div className="mt-4 text-sm text-gray-600">
              <p>📍 Location: {location.placeName}</p>
              <p>🕒 Time: {timestamp}</p>
              <p>📧 Email: {email}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarkAttendance;

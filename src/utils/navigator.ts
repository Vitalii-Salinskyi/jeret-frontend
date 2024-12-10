import axios from "axios";

export const getUserLocationAndDeviceInfo = async () => {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => resolve(position),
      (error: any) =>
        reject(new Error(`Geolocation Exception: ${error.message}`)),
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0,
      }
    );
  });

  const { latitude, longitude } = position.coords;

  const browser = navigator.userAgent;
  const device = browser.split(")")[0] + ")";

  const {
    data: { ip },
  } = await axios.get("https://api.ipify.org?format=json");

  return {
    lat: latitude,
    long: longitude,
    device,
    ip,
  };
};

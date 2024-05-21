import axios from 'axios';

const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

export const getBusTime = async (origin: string, destination: string) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&transit_mode=bus&key=${googleMapsApiKey}`);
  return response.data;
};

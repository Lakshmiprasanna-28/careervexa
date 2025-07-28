const getBaseUrl = () => {
  return import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend-url.onrender.com"; // replace this when you deploy
};

export default getBaseUrl;

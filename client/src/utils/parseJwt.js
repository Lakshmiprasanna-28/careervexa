const parseJwt = (token) => {
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};

export default parseJwt;

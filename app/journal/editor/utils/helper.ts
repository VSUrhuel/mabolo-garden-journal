export const formatDateTimeLocal = (isoString : string) => {
  if (!isoString) return "";
  return isoString.slice(0, 16);
};

export const generateInt8Id = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return BigInt(`${timestamp}${random}`);
};
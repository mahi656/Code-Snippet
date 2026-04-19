export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 100) => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + "...";
};

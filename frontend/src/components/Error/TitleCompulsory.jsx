export const checkTitleCompulsory = (title) => {
  if (!title || !title.trim()) {
    return "Snippet Title is required.";
  }
  return null;
};

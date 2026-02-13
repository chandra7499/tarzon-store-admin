export const extractPublicId = (url) => {
  const afterUpload = url.split("/upload/")[1];
  if (!afterUpload) return null;

  return afterUpload
    .replace(/v\d+\//, "")
    .replace(/\.[^/.]+$/, "");
};

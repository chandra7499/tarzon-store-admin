import cloudinary from "@/clouds/cloudinaryConfig";

export const cloudinaryUpload = async (
  file, // base64 string or file
  folder, // folder name in Cloudinary
  public_id, // unique identifier for the file
  resource_type = "auto", // auto-detect resource type
  overwrite = true, // whether to overwrite existing files
  type = "upload", // access mode
) => {
  try {
    const uploadOptions = {
      folder: folder,
      public_id: public_id,
      resource_type: resource_type,
      overwrite: overwrite,
      access_mode: "public",
      type: type,
      timeout: 120000,
    };

    // If it's a base64 string, Cloudinary can handle it directly
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

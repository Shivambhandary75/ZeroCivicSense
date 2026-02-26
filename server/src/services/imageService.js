const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");
const logger = require("../utils/logger");

/**
 * Upload a buffer image to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadImage = async (buffer, folder = "ZeroCivicSense") => {
  const result = await uploadToCloudinary(buffer, folder);
  return { url: result.secure_url, publicId: result.public_id };
};

/**
 * Delete an image from Cloudinary by public ID.
 * @param {string} publicId
 */
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    logger.warn(`Failed to delete image ${publicId}: ${err.message}`);
  }
};

module.exports = { uploadImage, deleteImage };

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary")

/*
===========================================================================
cloudinary.ts
- inits + exports cloudinary storage for images
===========================================================================
*/

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "PetResort",
		allowedFormats: ["jpeg", "jpg", "png"],
	},
});

module.exports = { cloudinary, storage };

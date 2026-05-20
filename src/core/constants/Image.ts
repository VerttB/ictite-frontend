export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPE = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/avif",
    "image/heic",
    "image/heif",
];

export const ACCEPTED_IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
    ".avif",
    ".heic",
    ".heif",
];

export const ACCEPTED_IMAGE_FORMAT_LABEL = "JPG/PNG/WEBP/GIF/BMP/TIFF/AVIF/HEIC";
export const ACCEPTED_IMAGE_INPUT_TYPES = [
    ...ACCEPTED_IMAGE_TYPE,
    ...ACCEPTED_IMAGE_EXTENSIONS,
].join(",");

export const isAcceptedImageFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    const hasAcceptedType = ACCEPTED_IMAGE_TYPE.includes(file.type);
    const hasAcceptedExtension = ACCEPTED_IMAGE_EXTENSIONS.some((extension) =>
        fileName.endsWith(extension)
    );

    return hasAcceptedType || hasAcceptedExtension;
};

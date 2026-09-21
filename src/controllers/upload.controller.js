import path from "path";

const upload = async (req, res) => {
  if (!req.file) {
    const error = new Error("No file was uploaded");
    error.statusCode = 400;
    throw error;
  }

  const folder = path.basename(path.dirname(req.file.path));
  const relativeUrl = `/uploads/${folder}/${req.file.filename}`;

  const host = `${req.protocol}://${req.get("host")}`;
  const url = `${host}${relativeUrl}`;

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      url,
      path: relativeUrl,
      folder,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
    },
  });
};

export { upload };


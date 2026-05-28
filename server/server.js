import cors from "cors";
import express from "express";
import multer from "multer";
import Replicate from "replicate";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();      // ✅ create app FIRST

app.use(cors());            // ✅ THEN use cors

const upload = multer({ dest: "uploads/" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post(
  "/generate-ad",
  upload.fields([
    { name: "product" },
    { name: "model" }
  ]),
  async (req, res) => {
    try {
      console.log("Request received"); // ✅ debug

      const productPath = req.files["product"][0].path;
      const modelPath = req.files["model"][0].path;

      const modelImage = `data:image/png;base64,${fs.readFileSync(modelPath, "base64")}`;

      const output = await replicate.run(
        "stability-ai/sdxl:latest",
        {
          input: {
            prompt: `
            A realistic advertisement photo of a person using the product.
            The person should match the uploaded model image.
            High quality, Instagram ad style, clean lighting.
            `,
            image: modelImage,
          },
        }
      );

      res.json({ image: output[0] });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
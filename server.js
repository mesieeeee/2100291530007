import app from "./app.js";
import cloudinary from "cloudinary";

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
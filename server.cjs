 const express = require("express");
const path = require("path");

const app = express();
const PORT = 4000;

// dist folder serve
app.use(express.static(path.join(__dirname, "dist")));

// React SPA fallback (MOST IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

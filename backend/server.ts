import express from "express";

const app = express();
const PORT = 5000; // Different from frontend's port

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

export {};

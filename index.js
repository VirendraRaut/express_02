// index.js
import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js"; // make sure logger.js exists
import morgan from "morgan";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Morgan logging format
const morganFormat = ":method :url :status :response-time ms";

// Use Morgan to log HTTP requests and pipe them to Winston
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        // Parse Morgan message to JSON object
        const [method, url, status, responseTime] = message.trim().split(" ");
        const logObject = { method, url, status, responseTime };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const port = process.env.PORT || 3002;

// Routes
app.get("/", (req, res) => {
  res.send("Hello World..!");
});

app.get("/another", (req, res) => {
  res.send("Hello from ANOTHER World");
});

// In-memory storage
let alphabeticals = [];
let id = 1;

// POST a new letter
app.post("/letters", (req, res) => {
  const { letter } = req.body;
  if (!letter || letter.length === 0) {
    return res.status(400).send({ error: "Letter is required" });
  }
  const firstLetter = letter[0];
  const nextId = { id: id++, firstLetter };
  alphabeticals.push(nextId);
  res.status(200).send(nextId);
});

// GET all letters
app.get("/letters", (req, res) => {
  res.status(200).send(alphabeticals);
});

// GET letter by ID
app.get("/letters/:id", (req, res) => {
  const alphabetical = alphabeticals.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!alphabetical) {
    return res.status(404).send({ error: "Alphabetical not found" });
  }
  res.status(200).send(alphabetical);
});

// PUT/update letter by ID
app.put("/letters/:id", (req, res) => {
  const { letter } = req.body;
  const alphabetical = alphabeticals.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!alphabetical) {
    return res.status(404).send({ error: "Alphabetical not found" });
  }
  alphabetical.firstLetter = letter[0];
  res.status(200).send(alphabetical);
});

// DELETE letter by ID
app.delete("/letters/:id", (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const index = alphabeticals.findIndex((a) => a.id === idToDelete);

  if (index === -1) {
    return res.status(404).send({ error: "Alphabetical not found" });
  }

  const deleted = alphabeticals.splice(index, 1)[0];
  res.status(200).send({
    message: "Alphabetical deleted successfully",
    deleted,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on => http://localhost:${port}`);
  logger.info(`Server started on port ${port}`);
});

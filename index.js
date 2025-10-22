import express from "express";

const app = express();
app.use(express.json());

const port = 3002;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/another", (req, res) => {
  res.send("Hello from ANOTHER World");
});

let alphabeticals = [];
let id = 1;

app.post("/letters", (req, res) => {
  const { letter } = req.body;
  const firstLetter = letter[0];
  const nextId = { id: id++, firstLetter };
  alphabeticals.push(nextId);

  res.status(200).send(nextId);
});

app.get("/letters", (req, res) => {
  res.status(200).send(alphabeticals);
});

app.get("/letters/:id", (req, res) => {
  const alphabetical = alphabeticals.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!alphabetical) {
    return res.send("Not found your alphabetical");
  }
  return res.send(alphabetical);
});

app.put("/letters/:id", (req, res) => {
  const { letter } = req.body;
  const alphabetical = alphabeticals.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!alphabetical) {
    return res.send("Not found your alphabetical");
  }
  alphabetical.firstLetter = letter[0];
  return res.send(alphabetical);
});

app.delete("/letters/:id", (req, res) => {
  const idToDelete = parseInt(req.params.id);

  // Find the index of the object to delete
  const index = alphabeticals.findIndex((a) => a.id === idToDelete);

  // If not found, return an error
  if (index === -1) {
    return res.status(404).send("Alphabetical not found");
  }

  // Remove it from the array
  const deleted = alphabeticals.splice(index, 1)[0];

  // Send back the deleted item as confirmation
  res.status(200).send({
    message: "Alphabetical deleted successfully",
    deleted,
  });
});

app.listen(port, () => {
  console.log(`Server is running on => http://localhost:${port}`);
});

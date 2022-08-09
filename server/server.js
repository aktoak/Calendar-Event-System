const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/event");
const path = require("path");

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "/../client/build")));

// connect to mongodb
const dbURI =
  "mongodb+srv://admin:sltQh8befGuI0AQo@cluster0.hhucucn.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("connected to db");
    app.listen(PORT, console.log(`Server is starting at ${PORT}`));
  })
  .catch((err) => console.log(err));

/****** routes ******/

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// create event
app.post("/event/create", (req, res) => {
  const data = req.body;
  const event = new Event({
    title: data.title,
    start: data.start,
    end: data.end,
  });

  event
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// get all events
app.get("/events", (req, res) => {
  Event.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

//update event
app.post("/event/update/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  Event.findByIdAndUpdate(id, { start: data.start, end: data.end })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

//delete event
app.delete("/event/delete/:id", (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

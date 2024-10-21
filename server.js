const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const morgan = require("morgan");
const app = express();
const Plant = require('./models/Plant');

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get('/plants', async (req, res) => {
  const allPlants = await Plant.find();
  res.render('plants/index', { plants: allPlants });
});

app.get('/plants/new', (req, res) => {
  res.render('plants/new');
});

app.post('/plants', async (req, res) => {
  await Plant.create(req.body);
  res.redirect('/plants');
});

app.get('/plants/:id', async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  res.render('plants/show', { plant });
});

app.get('/plants/:id/edit', async (req, res) => {
  const foundPlant = await Plant.findById(req.params.id);
  res.render('plants/edit', { plant: foundPlant });
});

app.put('/plants/:id', async (req, res) => {
  await Plant.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/plants/${req.params.id}`);
});

app.delete('/plants/:id', async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id);
  res.redirect('/plants');
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Enable CORS untuk semua domain (bisa diatur lebih spesifik jika diperlukan)
app.use(cors({
    origin: 'http://localhost:3001',  // Tentukan URL aplikasi Next.js Anda
  }));

  // Menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Setup storage untuk multer (menyimpan file di folder 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

let projects = [];

app.get('/projects', (req, res) => {
  res.json(projects);
});

app.post('/projects', upload.single('image'), (req, res) => {
  const { title, description, link, tags } = req.body;
  const image = req.file ? req.file.path : null;

  if (!title || !description || !tags || !image) {
    return res.status(400).json({ error: 'Title, description, image, and tags are required' });
  }

  const newProject = {
    id: uuidv4(),
    title,
    description,
    imageUrl: image,
    link,
    tags: tags.split(',')
  };

  projects.push(newProject);

  res.status(201).json({
    message: 'Project added successfully',
    project: newProject
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const router = express('router');


const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

const checkAuth = (req, res, next) => {
  if (req.session.authenticated) {
    res.redirect('/disciplines');
  } else {
    res.redirect('/');
  }
};



// User registration
app.post('/registration', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const saltRounds = 10;

    // Checking if the user already exists in the database
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'This email is already taken' });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createNewUser = await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, email]);

    res.json(createNewUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const hashedPassword = user.rows[0].password;

    // Compare the hashed password with the provided password
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Create a token for user authentication
    const token = jwt.sign({ email }, 'secret_key');
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// user logout

app.get("/logout", async (req, res) => {
  try {
    req.logout();
  } catch (err) {
    console.error(err.message);
  }
})

// Get user details
app.get('/user', async (req, res) => {
  try {
    const { user_id } = req.query;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [user_id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get disciplines
app.get('/disciplines', async (req, res) => {
  try {
    const { user_id } = req.query;
    const disciplines = await pool.query('SELECT * FROM disciplines WHERE email = $1', [user_id]);
    res.json(disciplines.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific discipline
app.get('/disciplines/:disciplineId', async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const discipline = await pool.query('SELECT * FROM disciplines WHERE id = $1', [disciplineId]);
    if (discipline.rows.length === 0) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    res.json(discipline.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/adddiscipline', async (req, res) => {
  try {
    const { discipline_title, email } = req.body;
   
    const newDiscipline = await pool.query('INSERT INTO disciplines (discipline_title, email) VALUES ($1, $2) RETURNING *', [discipline_title, email]);
    res.json(newDiscipline.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// delete

app.delete("/disciplines/:disciplineId", async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const deleteDiscipline = await pool.query("DELETE FROM disciplines WHERE id = $1", [
      disciplineId
    ]);
    
    // Check if any rows were affected by the delete operation
    if (deleteDiscipline.rowCount === 0) {
      return res.status(404).json({ message: 'Discipline not found' });
    }
    
    res.json({ message: 'Discipline deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});



// update discipline

app.put("/disciplines/:disciplineId/update", async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const { disciplineTilte } = req.body;
    const updateDiscipline = await pool.query("UPDATE disciplines SET discipline_title=$1 WHERE id=$2", [
      disciplineTilte,disciplineId
    ]);
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});




// work with topics

app.get("/disciplines/:disciplineId/topics", async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const topics = await pool.query("SELECT * FROM topics WHERE discipline_id=$1", [
      disciplineId
    ]);
    
    res.json(topics.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
})

app.post("/disciplines/:disciplineId/addtopics", async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const { topic_title } = req.body;
    const addTopic = await pool.query("INSERT INTO topics (topic_title,  discipline_id) VALUES ($1, $2) RETURNING *", [
      topic_title,disciplineId
    ]);
    
    res.json(addTopic.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
})




// work with materials

app.post("/disciplines/:disciplineId/topics/:topicId/addmaterial", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { material_title } = req.body;
    const addMaterial = await pool.query("INSERT INTO materials (material_title,  topic_id) VALUES ($1, $2) RETURNING *;", [
      material_title, topicId
    ]);

    res.json(addMaterial.rows[0]);

  } catch (err) {
    console.error(err.message);
  }
});


app.get("/disciplines/:disciplineId/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    const allMaterials = await pool.query("SELECT * FROM materials WHERE topic_id=$1", [
      topicId
    ]);

    res.json(allMaterials.rows);

  } catch (err) {
    console.error(err.message);
  }
});

app.get("/disciplines/:disciplineId/topics/:topicId/getuniq", async (req, res) => {
  try {
    const { topicId } = req.params;
    const uniq = await pool.query("SELECT * FROM topics WHERE id=$1", [
      topicId
    ]);

    res.json(uniq.rows[0]);

  } catch (err) {
    console.error(err.message);
  }
});

app.post('/api/ocr', async (req, res) => {
  try {
    const { image } = req.files;
    const { 'content-language': contentLanguage } = req.headers;

    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.loadLanguage('rus');
    await worker.initialize('eng+rus');
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    });

    const { data: { text } } = await worker.recognize(image.path, contentLanguage);
    await worker.terminate();

    res.send({ text });
  } catch (error) {
    console.error(error);
    res.status(500).send('OCR processing failed');
  }
});



// material page backend queries


app.get("/disciplines/:disciplineId/topics/:topicId/:materialId", async (req, res) => {
  try {
    const { materialId } = req.params;
    const responseMaterial = await pool.query("SELECT * FROM materials WHERE id=$1", [
      materialId
    ]);

    res.json(responseMaterial.rows[0]);
  } catch (err) {
    console.error(err);
  }
})

app.put("/disciplines/:disciplineId/topics/:topicId/:materialId/updateMaterialData", async (req, res) => {
  try {
    const { materialId } = req.params;
    const { material_data } = req.body;
    const updateDiscipline = await pool.query("UPDATE materials SET material_data=$1 WHERE id=$2", [
      material_data,materialId
    ]);
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// delete and edit materials page functions

app.delete("/disciplines/:disciplineId/topics/:topicId/deleteTitle", async (req, res) => {
  try {
    const { topicId } = req.params;
    const deleteDiscipline = await pool.query("DELETE FROM topics WHERE id = $1", [
      topicId
    ]);
    
    // Check if any rows were affected by the delete operation
    if (deleteDiscipline.rowCount === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

app.put("/disciplines/:disciplineId/topics/:topicId/updateTitle", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { topic_title } = req.body;

    const updateMaterialsTitle = await pool.query("UPDATE topics SET topic_title=$1 WHERE id=$2", 
      [topic_title, topicId]
    );

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
})


// delete and edit materials page functions

app.delete("/disciplines/:disciplineId/topics/:topicId/deleteMaterial", async (req, res) => {
  try {
    const { topicId } = req.params;
    const deleteDiscipline = await pool.query("DELETE FROM topics WHERE id = $1", [
      topicId
    ]);
    
    // Check if any rows were affected by the delete operation
    if (deleteDiscipline.rowCount === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

app.put("/disciplines/:disciplineId/topics/:topicId/updateMaterial", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { topic_title } = req.body;

    const updateMaterialsTitle = await pool.query("UPDATE topics SET topic_title=$1 WHERE id=$2", 
      [topic_title, topicId]
    );

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
})




// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

module.exports = router;
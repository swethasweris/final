const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const fs = require('fs'); // For file management
const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/TeacherContactsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas and models
const teacherSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const Teacher = mongoose.model('Teacher', teacherSchema);

const studentUserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const StudentUser = mongoose.model('StudentUser', studentUserSchema, 'sreg');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  phoneNo: String,
  yearOfStudy: Number,
  department: String,
  cgpa: Number,
  idCard: String,
  email: String,
  lastUpdated: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false },
  isClassRepresentative: { type: Boolean, default: false },
});
const Student = mongoose.model('Student', studentSchema);

const groupSchema = new mongoose.Schema({
  groupName: String,
  mentorName: String,
  members: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: String,
    email: String
  }],
  mentorEmail: String,
});
const Group = mongoose.model('Group', groupSchema);



// Storage and File Upload Configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  },
});

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.teacherId = decoded.id;
    next();
  });
};

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sweswesweris@gmail.com',
    pass: 'tjim smxa egup bsgm',
  },
  debug: true,
  logger: true,
});

// Registration Route for Students
app.post('/studentregister', async (req, res) => {
  console.log('Registering new student:', req.body.username);
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudentUser = new StudentUser({ username, password: hashedPassword });
    await newStudentUser.save();
    console.log('Student registered successfully:', username);
    res.json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
});

// Login Route for Students
app.post('/studentlogin', async (req, res) => {
  console.log('Student attempting to log in:', req.body.username);

  try {
    const { username, password } = req.body;

    // Check if the student exists in the database
    const student = await StudentUser.findOne({ username });
    if (!student) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log('Student logged in successfully:', username);
    res.json({ message: 'Student logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in student', error: error.message });
  }
});

// Modify Cgpa schema to include extracted text and scores field
const cgpaSchema = new mongoose.Schema({
  username: String,
  extractedText: String,
  scores: Map,
  cgpa: Number, // Add field to store CGPA
  date: { type: Date, default: Date.now },
});
const Cgpa = mongoose.model('Cgpa', cgpaSchema);
const router = express.Router();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/upload', upload.fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }]), (req, res) => {
  const { mentorEmail, studentEmail } = req.body;
  const files = req.files; // All uploaded files
  const actionId = uuidv4(); // Generate a unique ID for the approval process

  // Ensure that the studentEmail and mentorEmail are received
  if (!mentorEmail || !studentEmail) {
    return res.status(400).json({ message: 'Mentor email and student email are required.' });
  }

  const mentorMailOptions = {
    from: studentEmail, // Send from the student's email
    to: mentorEmail,    // Send to the mentor's email
    subject: 'Review Student Submission',
    html: `
      <p>You have received new documents from ${studentEmail}. Please review and approve or decline.</p>
      <p><b>Files:</b></p>
      <ul>
        <li><a href="http://localhost:5000/uploads/${files.file1[0].filename}">File 1</a></li>
        <li><a href="http://localhost:5000/uploads/${files.file2[0].filename}">File 2</a></li>
        <li><a href="http://localhost:5000/uploads/${files.file3[0].filename}">File 3</a></li>
      </ul>
      <p>
        <a href="http://localhost:5000/approve/${actionId}?action=approve">Approve</a> | 
        <a href="http://localhost:5000/approve/${actionId}?action=decline">Decline</a>
      </p>
    `,
  };
  
  // Send the email to the mentor
  transporter.sendMail(mentorMailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email to mentor', error });
    }

    console.log('Email sent to mentor: ' + info.response);

    // Respond to the student
    res.status(200).json({ message: 'Email sent to mentor for review' });
  });
});

// Handle approval or rejection
app.get('/approve/:actionId', (req, res) => {
  const { actionId } = req.params;
  const { action } = req.query;
  
  // You should pass the student email dynamically from your logic, ideally using a database or session
  const studentEmail = req.query.studentEmail || 'student@example.com'; // Dynamically set the student's email

  let subject = '';
  let text = '';

  if (action === 'approve') {
    subject = 'Your form has been approved';
    text = 'Your form has been approved by the mentor.';
  } else if (action === 'decline') {
    subject = 'Your form has been declined';
    text = 'Your form has been declined by the mentor. Please meet your mentor for further discussion.';
  }

  const studentMailOptions = {
    from: req.query.mentorEmail || 'mentor-email@example.com',  // Mentor's email
    to: studentEmail,   // Send to the student's email
    subject,
    text,
  };

  transporter.sendMail(studentMailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email to student', error });
    }

    console.log('Confirmation email sent to student: ' + info.response);

    // Respond to the mentor action page
    res.send(`<h3>Your action has been recorded: ${action}</h3>`);
  });
});


// Register route
app.post('/register', async (req, res) => {
  console.log('Registering new teacher:', req.body.username);
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({ username, password: hashedPassword });
    await newTeacher.save();
    console.log('Teacher registered successfully:', username);
    res.json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering teacher', error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body.username);
  try {
    const { username, password } = req.body;
    const teacher = await Teacher.findOne({ username });
    if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
      console.log('Invalid login attempt for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: teacher._id }, 'your_jwt_secret');
    console.log('Login successful:', username);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Add contact route
app.post('/add-contact', verifyToken, upload.single('idCard'), async (req, res) => {
  try {
    const { name, rollNo, phoneNo, yearOfStudy, department, cgpa, email } = req.body;
    const idCard = req.file ? req.file.path : ''; // Get the file path
    const newStudent = new Student({ name, rollNo, phoneNo, yearOfStudy, department, cgpa, idCard, email });
    await newStudent.save();
    res.json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding contact', error });
  }
});


// View contacts route
app.get('/view-contacts', verifyToken, async (req, res) => {
  const { archived } = req.query;
  console.log('Fetching contacts, archived:', archived);
  try {
    const filter = archived === 'true' ? { isArchived: true } : { isArchived: false };
    const students = await Student.find(filter).sort({ cgpa: -1 });
    console.log(`Found ${students.length} contacts`);
    res.json(students);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// Archive Contact Endpoint
app.put('/archive-contact/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Archiving contact ${id}`);
  try {
    const { isArchived } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { isArchived },
      { new: true }
    );
    console.log('Contact archive status updated:', student);
    res.json({ message: `Contact ${isArchived ? 'archived' : 'unarchived'} successfully` });
  } catch (error) {
    console.error('Error archiving contact:', error);
    res.status(500).json({ message: 'Error updating archive status', error: error.message });
  }
});

// Edit contact endpoint
app.put('/edit-contact/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Editing contact ${id}:`, req.body);
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    console.log('Contact updated:', updatedStudent);
    res.json({ message: 'Contact updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error editing contact:', error);
    res.status(500).json({ message: 'Error editing contact', error: error.message });
  }
});

// Delete contact endpoint
app.delete('/delete-contact/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting contact ${id}`);
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    console.log('Contact deleted:', deletedStudent);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

app.post('/create-group', verifyToken, async (req, res) => {
  console.log('Creating new group:', req.body);
  try {
    const { groupName, mentorName, mentorEmail, members } = req.body;
    
    // Fetch member details using student IDs
    const memberDetails = await Student.find({ _id: { $in: members } }).select('name email');
    const membersWithNames = memberDetails.map(student => ({
      studentId: student._id,
      name: student.name,
      email: student.email,
    }));

    // Create the new group, including mentorEmail
    const newGroup = new Group({
      groupName: groupName,
      mentor: mentorName,
      mentorEmail: mentorEmail,  // Store mentorEmail in the group
      members: membersWithNames,
    });

    await newGroup.save();
    console.log('Group created:', newGroup);

    // Step 1: Send email notification to the mentor
    const mentorMailOptions = {
      from: 'swethap.22it@kongu.edu.com',
      to: mentorEmail,
      subject: `You are mentoring the group "${groupName}"`,
      text: `Hello ${mentorName},\n\nYou are the mentor for the group "${groupName}". You will be guiding the following students:\n\n${membersWithNames.map(m => m.name + ' (' + m.email + ')').join('\n')}\n\nBest regards,\nYour Team`,
    };

    transporter.sendMail(mentorMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to mentor:', error);
      } else {
        console.log('Email sent to mentor:', info.response);
      }
    });

    // Step 2: Send email notifications to each student
    membersWithNames.forEach(student => {
      const studentMailOptions = {
        from: 'swethap.22it@kongu.edu.com',
        to: student.email,
        subject: `Welcome to the group "${groupName}"`,
        text: `Dear ${student.name},\n\nCongratulations! You have been added to the group "${groupName}", which is guided by ${mentorName}. If you have any questions, feel free to reach out to your mentor at ${mentorEmail}.\n\nBest regards,\nYour Team`,
      };

      transporter.sendMail(studentMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email to student:', student.name, error);
        } else {
          console.log('Email sent to student:', student.name, info.response);
        }
      });
    });

    // Send a success response
    res.json({
      message: 'Group created successfully, notifications sent to mentor and members.',
      group: newGroup,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
});


    
// View groups endpoint
app.get('/view-groups', verifyToken, async (req, res) => {
  console.log('Fetching groups');
  try {
    const groups = await Group.find().populate('members.studentId', 'name');
    console.log(`Found ${groups.length} groups`);
    res.json(groups);
    console.log(groups); // Log the groups to check their structure

  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups', error: error.message });
  }
});

app.put('/update-group/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { groupName, mentorName, members } = req.body;
  console.log(`Updating group ${id}:`, req.body); // Check incoming data

  try {
    const memberDetails = await Student.find({ _id: { $in: members } }).select('name');
    const membersWithNames = memberDetails.map(student => ({
      studentId: student._id,
      name: student.name,
    }));
    
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { groupName, mentor: mentorName, members: membersWithNames },
      { new: true }
    );
    
    console.log('Group updated:', updatedGroup);
    res.json({ message: 'Group updated successfully', group: updatedGroup });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Error updating group', error: error.message });
  }
});

// Delete group endpoint
app.delete('/delete-group/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting group ${id}`);
  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    console.log('Group deleted:', deletedGroup);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Error deleting group', error: error.message });
  }
});

// Available students endpoint
app.get('/available-students', verifyToken, async (req, res) => {
  console.log('Fetching available students');
  try {
    const students = await Student.find({ isArchived: false }).select('name');
    console.log(`Found ${students.length} available students`);
    res.json(students);
  } catch (error) {
    console.error('Error fetching available students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Auto-update student year of study
setInterval(async () => {
  try {
    const now = new Date();
    console.log('Running auto-update for student year of study');
    
    const result = await Student.updateMany(
      {
        lastUpdated: { $lt: new Date(now.getTime() - 20 * 1000) },
        yearOfStudy: { $lt: 4 }
      },
      {
        $inc: { yearOfStudy: 1 },
        $set: { lastUpdated: now }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Updated year of study for ${result.modifiedCount} student(s)`);
    }
  } catch (error) {
    console.error('Error in auto-update:', error);
  }
}, 20 * 1000);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import pg from 'pg';
import cors from 'cors'; 
import multer from 'multer';
import XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;

// تهيئة جيميناي بالطريقة الصحيحة والمستقرة
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// التعديل الصحيح
// التعديل الصحيح
const aiModel = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
const upload = multer({ storage: multer.memoryStorage() });

// قراءة رابط قاعدة البيانات من متغيرات البيئة بشكل آمن
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_PUk42FhVoziK@ep-raspy-math-atr8pmc2-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';

// إعداد الاتصال بقاعدة البيانات (Neon PostgreSQL)
const pool = new Pool({
  connectionString: connectionString,
});

app.get('/', (req, res) => res.send('Server is running and API is active!'));

// تفعيل CORS و JSON
app.use(cors({
  origin: 'https://humanitarian-cell-frontend.vercel.app', // رابط موقعك على Vercel حصرياً
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ==========================================
// 1. مسارات البرامج ومشاريعها الخاصة (Programs & Sub-Projects)
// ==========================================
app.get('/api/programs/:programId', async (req, res) => {
  const { programId } = req.params;

  try {
    const programResult = await pool.query('SELECT * FROM programs WHERE id = $1', [programId]);
    
    if (programResult.rows.length === 0) {
      return res.status(404).json({ error: 'البرنامج غير موجود' });
    }

    const program = programResult.rows[0];
    const projectsResult = await pool.query('SELECT * FROM program_projects WHERE program_id = $1', [programId]);
    program.projects = projectsResult.rows;

    res.json(program);
  } catch (err) {
    console.error('خطأ في جلب بيانات البرنامج:', err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
});

// ==========================================
// 2. مسارات المشاريع العامة (Projects)
// ==========================================
app.get('/api/projects/active', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE needs_donation = TRUE ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب المشاريع النشطة:", err);
    res.status(500).json({ error: 'خطأ في جلب المشاريع النشطة للتبرع' });
  }
});

app.get('/api/projects/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE location = $1', [location]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب مشاريع هذه المحافظة.' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في جلب المشاريع' });
  }
});

app.post('/api/projects', async (req, res) => {
  const { title, description, target, raised, needs_donation } = req.body;

  if (!title || !description || !target) {
    return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة (العنوان، الوصف، المبلغ المطلوب)' });
  }

  try {
    const queryText = `
      INSERT INTO projects (title, description, target, raised, needs_donation) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;
    const values = [title, description, target, raised || 0, needs_donation !== undefined ? needs_donation : true];
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'تمت إضافة المشروع بنجاح!',
      project: result.rows[0]
    });
  } catch (err) {
    console.error("خطأ في إضافة المشروع:", err);
    res.status(500).json({ error: 'فشل إرسال المشروع لقاعدة البيانات' });
  }
});

// ==========================================
// 3. مسار استقبال التبرعات (Donations)
// ==========================================
app.post('/api/donations', async (req, res) => {
  const { fullName, email, phone, amount, project, paymentMethod } = req.body;

  if (!fullName || !phone || !amount) {
    return res.status(400).json({ error: 'الاسم، الهاتف، وقيمة التبرع حقول مطلوبة' });
  }

  try {
    const queryText = `
      INSERT INTO donations (full_name, email, phone, amount, project_name, payment_method) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;
    const values = [fullName, email, phone, amount, project, paymentMethod];
    await pool.query(queryText, values);

    if (project && project !== 'عام') {
      const updateProjectQuery = `
        UPDATE projects 
        SET raised = COALESCE(raised, 0) + $1 
        WHERE title = $2;
      `;
      await pool.query(updateProjectQuery, [parseFloat(amount), project]);
    }

    res.status(201).json({ message: 'تم تسجيل التبرع بنجاح وتحديث بيانات المشروع الحقيقية!' });
  } catch (err) {
    console.error("خطأ أثناء معالجة التبرع:", err);
    res.status(500).json({ error: 'حدث خطأ في الخادم أثناء معالجة التبرع' });
  }
});

// ==========================================
// 4. مسارات الأخبار (News)
// ==========================================
app.get('/api/news/ticker', async (req, res) => {
  try {
    const result = await pool.query('SELECT title FROM news WHERE is_urgent = true ORDER BY date_published DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error("DEBUG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/latest', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY date_published DESC LIMIT 3');
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب الأخبار الأخيرة:", err);
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news WHERE is_urgent = false OR is_urgent IS NULL ORDER BY date_published DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ في الخادم');
  }
});

// ==========================================
// 5. مسار التقارير (Reports)
// ==========================================
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY date_published DESC');
    res.json(result.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ في الخادم أثناء جلب التقارير');
  }
});

// ==========================================
// 6. مسار الاشتراكات (Subscribers)
// ==========================================
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  try {
    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(200).json({ message: 'تم الاشتراك بنجاح!' });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ message: 'هذا البريد الإلكتروني مشترك بالفعل.' });
    } else {
      res.status(500).json({ message: 'حدث خطأ، حاول مجدداً لاحقاً.' });
    }
  }
});

// ==========================================
// 7. مسار المساعد الذكي وتلخيص الملفات (AI Assistant & File Processing)
// ==========================================
app.post('/api/ai-assistant', upload.single('file'), async (req, res) => {
  const { message } = req.body;
  const file = req.file;

  try {
    let fileTextContent = "";

    if (file) {
      const buffer = file.buffer;
      const fileName = file.originalname.toLowerCase();

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        fileTextContent = JSON.stringify(sheetData, null, 2); 
      } else if (fileName.endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        fileTextContent = pdfData.text;
      } else if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
        fileTextContent = buffer.toString('utf8');
      }
    }

    const systemInstruction = `أنت نموذج Google Gemini الذكي والمحترف جداً. مهمتك هي تحليل البيانات والتقارير بدقة متناهية، وتقديم إجابات وتلخيصات مفصلة، منظمة في نقاط وواضحة باللغة العربية الفصحى، وبدون أي اختصار مخل.`;

    let prompt = message || "قم بتحليل وتلخيص هذا الملف بدقة تامة.";
    
    if (fileTextContent) {
      prompt = `إليك محتوى المستند أو بيانات الإكسل المرفقة بالكامل:\n"""\n${fileTextContent}\n"""\n\nطلب المستخدم أو سؤاله حول الملف: ${message || "قم بإعداد تقرير وتحليل شامل ومفصل يتضمن أبرز المؤشرات والأرقام والنتائج."}`;
    }

    const result = await aiModel.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (err) {
    console.error("خطأ في معالجة الذكاء الاصطناعي للملف:", err);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة وتلخيص الملف عبر الذكاء الاصطناعي.' });
  }
});

// خدمة ملفات الواجهة الأمامية الساكنة (React Build) إذا توفرت
// خدمة ملفات الواجهة الأمامية الساكنة (React Build) إذا توفرت
if (process.env.NODE_ENV === 'production' || true) {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // استخدمنا التعبير النمطي /.*/ لتجنب خطأ path-to-regexp الجديد
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
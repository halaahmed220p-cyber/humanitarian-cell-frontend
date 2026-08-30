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
// تفعيل CORS و JSON بشكل متكامل
app.use(cors({
  origin: ['https://humanitarian-cell-frontend.vercel.app', 'http://localhost:5173', 'http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// التعامل المباشر مع طلبات الفحص المسبق OPTIONS لجميع المسارات لضمان عدم حظر الـ CORS
app.options('*', cors());

// ==========================================
// 1. مسارات البرامج ومشاريعها الخاصة (Programs & Sub-Projects)
// ==========================================
app.get('/api/programs/:programId', async (req, res) => {
  const { programId } = req.params;
  const { province } = req.query; // استلام المحافظة في حال تم الضغط عليها من الخريطة

  try {
    // 1. جلب بيانات البرنامج الأساسية
    const programResult = await pool.query('SELECT * FROM programs WHERE id = $1', [programId]);
    
    if (programResult.rows.length === 0) {
      return res.status(404).json({ error: 'البرنامج غير موجود' });
    }

    const program = programResult.rows[0];

    // 2. جلب المشاريع الحقيقية المرتبطة بهذا البرنامج ديناميكياً من قاعدة البيانات
    let queryStr = 'SELECT * FROM projects WHERE program_id = $1';
    let queryParams = [programId];

    // إذا حدد المستخدم محافظة معينة من الخريطة، نقوم بتصفية المشاريع بناءً عليها أيضاً
    if (province) {
      queryStr += ' AND province = $2';
      queryParams.push(province);
    }

    queryStr += ' ORDER BY id DESC';

    const projectsResult = await pool.query(queryStr, queryParams);
    
    // توحيد أسماء الحقول لتتوافق تماماً مع الواجهة الأمامية React
   // توحيد أسماء الحقول لتتوافق تماماً مع الواجهة الأمامية React
    program.projects = projectsResult.rows.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.province + (p.district ? ` - ${p.district}` : ''),
      province: p.province,
      beneficiaries: p.beneficiaries || 'غير محدد',
      progress: p.target > 0 ? Math.min(Math.round(((p.raised || 0) / p.target) * 100), 100) : 0,
      status: p.status || 'active',
      date: p.execution_year || p.date || '2026', // <-- التعديل هنا لجلب سنة التنفيذ من قاعدة البيانات
      icon: p.icon || '📁'
    }));

    res.json(program);
  } catch (err) {
    console.error('خطأ في جلب بيانات البرنامج وماريعه:', err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
});

app.get('/api/projects/province/:provinceName', async (req, res) => {
  try {
    const { provinceName } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE province = $1 ORDER BY id DESC', [provinceName]);
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب مشاريع المحافظة:", err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب مشاريع هذه المحافظة.' });
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
  const { title, description, target, raised, needs_donation, program_id, province, district, beneficiaries, status, execution_year } = req.body;

  if (!title || !description || !target || !program_id || !province) {
    return res.status(400).json({ error: 'يرجى ملء الحقول الأساسية: العنوان، الوصف، المبلغ المطلوب، البرنامج، والمحافظة' });
  }

  try {
    const queryText = `
      INSERT INTO projects (title, description, target, raised, needs_donation, program_id, province, district, beneficiaries, status, execution_year) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *;
    `;
    const values = [
      title, 
      description, 
      target, 
      raised || 0, 
      needs_donation !== undefined ? needs_donation : true,
      program_id,
      province,
      district || '',
      beneficiaries || 'غير محدد',
      status || 'active',
      execution_year || new Date().getFullYear()
    ];
    
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'تمت إضافة المشروع وربطه بالبرنامج والمحافظة بنجاح!',
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

// ==========================================
// 8. مسارات الشركاء والمانحين (Partners & Donors)
// ==========================================

// جلب قائمة الشركاء والمانحين
app.get('/api/partners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM partners_donors ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب بيانات الشركاء والمانحين:", err);
    res.status(500).json({ error: 'خطأ في جلب البيانات من الخادم' });
  }
});

// إضافة شريك أو مانح جديد (خاص بلوحة التحكم أو التسجيل)
app.post('/api/partners', async (req, res) => {
  const { name, type, email, phone, contribution_amount, logo_url, description } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'اسم الشريك/المانح ونوع الحساب حقول أساسية مطلوبة' });
  }

  try {
    const queryText = `
      INSERT INTO partners_donors (name, type, email, phone, contribution_amount, logo_url, description) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
    `;
    const values = [name, type, email, phone, contribution_amount || 0, logo_url, description];
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'تمت إضافة الشريك أو المانح بنجاح!',
      partner: result.rows[0]
    });
  } catch (err) {
    console.error("خطأ في إضافة الشريك أو المانح:", err);
    res.status(500).json({ error: 'فشل حفظ البيانات في قاعدة البيانات' });
  }
});
// جلب التقارير الخاصة بشريك أو مانح معين بناءً على معرفه
app.get('/api/partners/:id/reports', async (req, res) => {
  const partnerId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT * FROM project_reports WHERE partner_id = $1 ORDER BY created_at DESC',
      [partnerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب تقارير الشريك:", err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// ==========================================
// 5.1 مسار إضافة بلاغ أو رأي جديد (Field Reports)
// ==========================================
app.post('/api/field-reports', async (req, res) => {
  const { type, title, full_name, contact_type, contact_value, message, latitude, longitude } = req.body;

  // التحقق من أن جميع البيانات المطلوبة موجودة
  if (!title || !full_name || !contact_value || !message || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'جميع الحقول الأساسية وتحديد الموقع الجغرافي إلزامية' });
  }

  try {
    const queryText = `
      INSERT INTO field_reports (type, title, full_name, contact_type, contact_value, message, latitude, longitude) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;
    const values = [
      type || 'بلاغ طارئ', 
      title, 
      full_name, 
      contact_type || 'phone', 
      contact_value, 
      message, 
      latitude, 
      longitude
    ];
    
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'تم استلام بلاغكم بنجاح، شكراً لتعاونكم.',
      report: result.rows[0]
    });
  } catch (err) {
    console.error("خطأ في حفظ البلاغ في field_reports:", err);
    res.status(500).json({ error: 'حدث خطأ في الخادم أثناء حفظ البلاغ، يرجى المحاولة لاحقاً.' });
  }
});
// مسار لجلب البلاغات (لإدارة لوحة التحكم مستقبلاً)
app.get('/api/field-reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM field_reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب البلاغات:", err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// مسار جلب البرامج من قاعدة البيانات
app.get('/api/programs', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM programs ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching programs:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/sectors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sectors ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// مسار تسجيل دخول الشركاء والمانحين
app.post('/api/partners/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
  }

  try {
    // البحث عن الشريك بواسطة اسم المستخدم
    const result = await pool.query('SELECT * FROM partners_donors WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const partner = result.rows[0];

    // التحقق من كلمة المرور (يمكنك مطابقتها مباشرة أو باستخدام التشفير إذا كنتِ تستخدمينه)
    if (partner.password_hash !== password) {
      return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    }

    // إرسال بيانات الشريك بنجاح عند مطابقة بيانات الدخول
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      partner: {
        id: partner.id,
        name: partner.name,
        type: partner.type,
        logo_url: partner.logo_url,
        description: partner.description
      }
    });

  } catch (err) {
    console.error("خطأ في تسجيل الدخول:", err);
    res.status(500).json({ error: 'خطأ في الخادم' });
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
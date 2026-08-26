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
    // 1. جلب بيانات البرنامج الأساسية (سواء تم ارساله كـ ID رقمي أو كاسم مثل rafid)
    let programResult;
    if (!isNaN(programId)) {
      programResult = await pool.query('SELECT * FROM programs WHERE id = $1', [programId]);
    } else {
      // إذا كان مرسلاً كاسم نصي، نبحث به في جدول programs
      programResult = await pool.query('SELECT * FROM programs WHERE LOWER(name) = LOWER($1)', [programId]);
    }
    
    if (programResult.rows.length === 0) {
      return res.status(404).json({ error: 'البرنامج غير موجود' });
    }

    const program = programResult.rows[0];

    // 2. جلب المشاريع المرتبطة بهذا البرنامج بناءً على program_id الصحيح
    const projectsResult = await pool.query(
      'SELECT * FROM projects WHERE program_id = $1 ORDER BY id DESC',
      [program.id]
    );
    
    // 3. مطابقة أسماء الحقول تماماً مع ما تنتظره الواجهة الأمامية React
    program.projects = projectsResult.rows.map(p => ({
      id: p.id,
      title: p.project_name, // تم التعديل ليطابق عمود project_name
      description: p.quality_notes || 'مشروع تنموي تابع للبرنامج', // تم التعديل ليتوافق مع الأعمدة المتاحة
      location: p.province_id ? `محافظة رقم ${p.province_id}` : 'اليمن',
      beneficiaries: p.beneficiaries_count ? `${p.beneficiaries_count} مستفيد` : 'غير محدد',
      beneficiaries_count: p.beneficiaries_count || 0,
      progress: 100, // قيمة افتراضية أو حسب منطق التطبيق لدك
      status: p.project_status || 'active', // تطابق عمود project_status
      date: p.execution_year ? p.execution_year.toString() : '2026', // تطابق عمود execution_year
      project_category: p.project_category,
      is_seasonal: p.is_seasonal,
      donor: p.donor,
      implementation_id: p.implementation_id,
      google_maps_link: p.google_maps_link,
      icon: '📁'
    }));

    res.json(program);
  } catch (err) {
    console.error('خطأ في جلب بيانات البرنامج وماريعه:', err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي', details: err.message });
  }
});

// مسار إضافة مشروع جديد ليتوافق مع قاعدة البيانات
app.post('/api/projects', async (req, res) => {
  const { project_name, quality_notes, program_id, province_id, district_id, execution_year, beneficiaries_count, project_status, donor, project_category, is_seasonal } = req.body;

  if (!project_name || !program_id) {
    return res.status(400).json({ error: 'يرجى ملء الحقول الأساسية: اسم المشروع والبرنامج' });
  }

  try {
    const queryText = `
      INSERT INTO projects (project_name, quality_notes, program_id, province_id, district_id, execution_year, beneficiaries_count, project_status, donor, project_category, is_seasonal, implementation_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *;
    `;
    const values = [
      project_name, 
      quality_notes || '', 
      program_id,
      province_id || 1,
      district_id || 1,
      execution_year || 2026,
      beneficiaries_count || 0,
      project_status || 'active',
      donor || 'خلية الأعمال الإنسانية',
      project_category || 'تنموي',
      is_seasonal || 'no',
      'IMP-' + Date.now() // توليد implementation_id فريد
    ];
    
    const result = await pool.query(queryText, values);
    
    res.status(201).json({
      message: 'تمت إضافة المشروع وربطه بالبرنامج بنجاح!',
      project: result.rows[0]
    });
  } catch (err) {
    console.error("خطأ في إضافة المشروع:", err);
    res.status(500).json({ error: 'فشل إرسال المشروع لقاعدة البيانات', details: err.message });
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
  const { type, full_name, phone, message, latitude, longitude } = req.body;

  // التحقق من أن جميع البيانات المطلوبة موجودة
  if (!full_name || !phone || !message || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'جميع الحقول وتحديد الموقع الجغرافي إلزامية' });
  }

  try {
    const queryText = `
      INSERT INTO field_reports (type, full_name, phone, message, latitude, longitude) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;
    const values = [type || 'بلاغ طارئ', full_name, phone, message, latitude, longitude];
    
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
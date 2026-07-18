import express from 'express';
import pg from 'pg';
import cors from 'cors'; 
const { Pool } = pg;

const app = express();

// 1. التعديل: جعل المنفذ ديناميكياً ليناسب بيئة تشغيل Render
const port = process.env.PORT || 3000;

// 2. التعديل: قراءة رابط قاعدة البيانات من متغيرات البيئة بشكل آمن، واستخدام الرابط الحالي كاحتياطي للمحلي
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_PUk42FhVoziK@ep-raspy-math-atr8pmc2-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';

// إعداد الاتصال بقاعدة البيانات (Neon PostgreSQL)
const pool = new Pool({
  connectionString: connectionString,
});

// تفعيل CORS و JSON
app.use(cors({
  origin: 'https://humanitarian-cell-frontend.vercel.app', // ضعي رابط موقعكِ هنا
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// ==========================================
// 1. مسارات المشاريع (Projects)
// ==========================================

// وضعنا المسار الفرعي النشط أولاً لتجنب مشكلة الـ 404 وتداخل المسارات في Express
app.get('/api/projects/active', async (req, res) => {
  try {
    // جلب المشاريع المفعلة للتبرع (needs_donation = true)
    const result = await pool.query('SELECT * FROM projects WHERE needs_donation = TRUE ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("خطأ في جلب المشاريع النشطة:", err);
    res.status(500).json({ error: 'خطأ في جلب المشاريع النشطة للتبرع' });
  }
});

// جلب جميع المشاريع (العام) - يأتي بعد المسار المخصص
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في جلب المشاريع' });
  }
});

// إضافة مشروع جديد إلى قاعدة البيانات
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
// 2. مسار استقبال التبرعات (Donations)
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

    // تحديث مبالغ التبرعات الفعلية للمشروع في قاعدة البيانات تلقائياً دون تزييف
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
// 3. مسارات الأخبار (News)
// ==========================================
// جلب الأخبار العادية (غير العاجلة) فقط
app.get('/api/news', async (req, res) => {
  try {
    // نجلب الأخبار التي ليست عاجلة (is_urgent = false)
    const result = await pool.query('SELECT * FROM news WHERE is_urgent = false OR is_urgent IS NULL ORDER BY date_published DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ في الخادم');
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


// ==========================================
// 4. مسار التقارير (Reports)
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


// تشغيل الخادم والاعتماد على متغير الـ port


// في ملف السيرفر (مثلاً app.js أو server.js)
app.get('/api/news/ticker', async (req, res) => {
  try {
    // قمت بتغيير "name" إلى "title" ليطابق أعمدة الجدول لديكِ
    const result = await pool.query('SELECT title FROM news WHERE is_urgent = true ORDER BY date_published DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error("DEBUG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  try {
    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(200).json({ message: 'تم الاشتراك بنجاح!' });
  } catch (err) {
    if (err.code === '23505') { // خطأ تكرار الإيميل
      res.status(400).json({ message: 'هذا البريد الإلكتروني مشترك بالفعل.' });
    } else {
      res.status(500).json({ message: 'حدث خطأ، حاول مجدداً لاحقاً.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
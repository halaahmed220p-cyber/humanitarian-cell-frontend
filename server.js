import express from 'express';
import pg from 'pg';
import cors from 'cors'; 
const { Pool } = pg;

const app = express();

// 1. جعل المنفذ ديناميكياً ليناسب بيئة تشغيل Render
const port = process.env.PORT || 3000;

// 2. قراءة رابط قاعدة البيانات من متغيرات البيئة بشكل آمن، واستخدام الرابط الحالي كاحتياطي للمحلي
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_PUk42FhVoziK@ep-raspy-math-atr8pmc2-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require';

// إعداد الاتصال بقاعدة البيانات (Neon PostgreSQL)
const pool = new Pool({
  connectionString: connectionString,
});

// تفعيل CORS و JSON
app.use(cors({
  origin: '*', // السماح لأي موقع بالاتصال
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ==========================================
// 1. مسارات البرامج ومشاريعها الخاصة (Programs & Sub-Projects)
// ==========================================

// جلب تفاصيل البرنامج المحدد مع مشاريعه الخاصة وتوثيقها
app.get('/api/programs/:programId', async (req, res) => {
  const { programId } = req.params;

  try {
    // 1. جلب بيانات البرنامج الأساسية
    const programResult = await pool.query('SELECT * FROM programs WHERE id = $1', [programId]);
    
    if (programResult.rows.length === 0) {
      return res.status(404).json({ error: 'البرنامج غير موجود' });
    }

    const program = programResult.rows[0];

    // 2. جلب المشاريع التابعة لهذا البرنامج حصرياً من جدول program_projects
    const projectsResult = await pool.query('SELECT * FROM program_projects WHERE program_id = $1', [programId]);
    
    // إدراج المشاريع داخل كائن البرنامج ليطابق هيكل الواجهة
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

// مسار لجلب المشاريع بناءً على المحافظة
app.get('/api/projects/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const result = await pool.query(
      'SELECT * FROM projects WHERE location = $1',
      [location]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب مشاريع هذه المحافظة.' });
  }
});

// جلب جميع المشاريع (العام)
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

    // تحديث مبالغ التبرعات الفعلية للمشروع في قاعدة البيانات تلقائياً
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

// جلب الأخبار العادية (غير العاجلة) فقط
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
    if (err.code === '23505') { // خطأ تكرار الإيميل
      res.status(400).json({ message: 'هذا البريد الإلكتروني مشترك بالفعل.' });
    } else {
      res.status(500).json({ message: 'حدث خطأ، حاول مجدداً لاحقاً.' });
    }
  }
});


// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
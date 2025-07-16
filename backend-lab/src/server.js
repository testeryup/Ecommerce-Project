import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PayOS from '@payos/node';
import connectDB from './config/db.config.js';
import SubscriptionService from './services/subscriptionService.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js'; // Uncomment this line
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import transactionRoutes from './routes/transaction.routes.js'; // Import transaction routes
import categoryRoutes from './routes/category.routes.js'
import skuRoutes from './routes/sku.routes.js';
import promoRoutes from './routes/promo.routes.js';


dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
const app = express();

if (process.env.NODE_ENV === 'production') {
  // Trust first proxy (load balancer)
  app.set('trust proxy', 1);

  // Rate limiting với correct IP
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100, // limit each IP to 100 requests per windowMs
  //   message: 'Too many requests from this IP',
  //   standardHeaders: true,
  //   legacyHeaders: false,
  //   // Sử dụng req.ip (đã được trust proxy xử lý)
  //   keyGenerator: (req) => req.ip
  // });

  // app.use('/api/', limiter);

  // HTTPS redirect
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - IP: ${req.ip} - Protocol: ${req.protocol}`);
  next();
});


app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 })); // Parse URL-encoded bodies
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'https://my.payos.vn',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)

    if (!origin) return callback(null, true);
    // Check if the origin is localhost or matches ngrok pattern
    if (allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.ngrok-free\.app$/.test(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
      /^https:\/\/.*\.netlify\.app$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// seedCategories()
// Routes

app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    client: {
      ip: req.ip,
      protocol: req.protocol,
      hostname: req.hostname,
      secure: req.secure,
      userAgent: req.get('User-Agent')
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Use order routes
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionRoutes); // Use transaction routes
app.use('/api/sku', skuRoutes); // Use transaction routes
app.use('/api/promo', promoRoutes); // Use transaction routes


app.post("/create-embedded-payment-link", async (req, res) => {

  const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 10000,
    description: "Thanh toan don hang",
    returnUrl: `${YOUR_DOMAIN}`,
    cancelUrl: `${YOUR_DOMAIN}`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    console.log(paymentLinkResponse)
    res.send(paymentLinkResponse)
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
})
// 404
app.use('*', (req, res) => {
  res.status(404).json({
    errCode: 1,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      errCode: 1,
      message: 'Internal server error'
    });
  } else {
    res.status(500).json({
      errCode: 1,
      message: err.message,
      stack: err.stack
    });
  }
});

connectDB();

// Initialize subscription cron jobs after DB connection
SubscriptionService.initializeCronJobs();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("running server at port:", port);
  console.log("Subscription management system initialized");
});
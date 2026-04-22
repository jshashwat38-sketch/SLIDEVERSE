-- Supabase Schema for Slideverse (Updated for Multi-Language Support)

DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS appearance;
DROP TABLE IF EXISTS grievances;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB,
  price NUMERIC DEFAULT 0,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB,
  price NUMERIC NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  drive_link TEXT,
  faqs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT,
  email TEXT,
  phone TEXT,
  product TEXT,
  amount NUMERIC,
  status TEXT DEFAULT 'pending',
  date TEXT,
  payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL,
  role JSONB,
  text JSONB,
  code TEXT,
  rating INTEGER DEFAULT 5,
  date TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTPs Table for Auth
CREATE TABLE IF NOT EXISTS otps (
  email TEXT PRIMARY KEY,
  otp TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appearance Table (Single row for settings)
CREATE TABLE IF NOT EXISTS appearance (
  id TEXT PRIMARY KEY DEFAULT 'global',
  data JSONB NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Allow all for testing (Replace with proper Auth later)
CREATE POLICY "Allow all for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all for products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all for reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Allow all for grievances" ON grievances FOR ALL USING (true);
CREATE POLICY "Allow all for appearance" ON appearance FOR ALL USING (true);
CREATE POLICY "Allow all for otps" ON otps FOR ALL USING (true);

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = 'https://ywjzqtuhwtxhopkyhora.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3anpxdHVod3R4aG9wa3lob3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTA2MDMsImV4cCI6MjA5MjQyNjYwM30.lDCXurnzJsY0jYx3hM54jMv78ZuOxiID_RrVfpbz6Gs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  
  const tables = [
    { file: 'categories.json', table: 'categories' },
    { file: 'products.json', table: 'products' },
    { file: 'users.json', table: 'users' },
    { file: 'orders.json', table: 'orders' },
    { file: 'reviews.json', table: 'reviews' },
    { file: 'grievances.json', table: 'grievances' }
  ];

  for (const item of tables) {
    try {
      const filePath = path.join(dataDir, item.file);
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      console.log(`Migrating ${item.file} (${data.length} records)...`);
      
      const mappedData = data.map(record => {
        const newRecord = { ...record };
        if (record.categoryId) {
          newRecord.category_id = record.categoryId;
          delete newRecord.categoryId;
        }
        if (record.imageUrl) {
          newRecord.image_url = record.imageUrl;
          delete newRecord.imageUrl;
        }
        if (record.driveLink) {
          newRecord.drive_link = record.driveLink;
          delete newRecord.driveLink;
        }
        if (record.createdAt) {
          newRecord.created_at = record.createdAt;
          delete newRecord.createdAt;
        }
        if (record.paymentId) {
          newRecord.payment_id = record.paymentId;
          delete newRecord.paymentId;
        }
        if (record.razorpayOrderId) {
          newRecord.razorpay_order_id = record.razorpayOrderId;
          delete newRecord.razorpayOrderId;
        }
        return newRecord;
      });

      const { error } = await supabase.from(item.table).upsert(mappedData);
      if (error) console.error(`Error migrating ${item.table}:`, error);
      else console.log(`Successfully migrated ${item.table}`);
    } catch (err) {
      console.warn(`Skipping ${item.file}: ${err.message}`);
    }
  }
}

migrate();

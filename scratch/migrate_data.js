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
        
        // Use 'in' operator to check for existence, even if value is falsy
        if ('categoryId' in record) {
          newRecord.category_id = record.categoryId;
          delete newRecord.categoryId;
        }
        if ('imageUrl' in record) {
          newRecord.image_url = record.imageUrl;
          delete newRecord.imageUrl;
        }
        if ('driveLink' in record) {
          newRecord.drive_link = record.driveLink;
          delete newRecord.driveLink;
        }
        if ('createdAt' in record) {
          newRecord.created_at = record.createdAt;
          delete newRecord.createdAt;
        }
        if ('paymentId' in record) {
          newRecord.payment_id = record.paymentId;
          delete newRecord.paymentId;
        }
        if ('razorpayOrderId' in record) {
          newRecord.razorpay_order_id = record.razorpayOrderId;
          delete newRecord.razorpayOrderId;
        }

        // Fix for categories/products title and description
        if (item.table === 'categories' || item.table === 'products') {
          if (typeof record.title === 'string') {
            newRecord.title = { en: record.title };
          }
          if (typeof record.description === 'string') {
            newRecord.description = { en: record.description };
          }
        }

        return newRecord;
      });

      for (let i = 0; i < mappedData.length; i += 50) {
        const chunk = mappedData.slice(i, i + 50);
        const { error } = await supabase.from(item.table).upsert(chunk);
        if (error) {
          console.error(`Error migrating chunk ${i/50} of ${item.table}:`, error);
          break;
        }
      }
      
      console.log(`Finished ${item.table}`);
    } catch (err) {
      console.warn(`Skipping ${item.file}: ${err.message}`);
    }
  }
}

migrate();

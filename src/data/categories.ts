export const categoryNames = [
  "Business", "Mobile", "Social Media", "Marketing", "Technology", "Art & Photos", "Career", 
  "Design", "Education", "Presentations & Public Speaking", "Government & Nonprofit", 
  "Healthcare", "Internet", "Law", "Leadership & Management", "Automotive", "Engineering", 
  "Software", "Recruiting & HR", "Retail", "Sales", "Services", "Science", 
  "Small Business & Entrepreneurship", "Food", "Environment", "Economy & Finance", 
  "Data & Analytics", "Investor Relations", "Sports", "Spiritual", "News & Politics", 
  "Travel", "Self Improvement", "Real Estate", "Entertainment & Humor", "Health & Medicine", 
  "Devices & Hardware", "Lifestyle"
];

export const slideshareCategories = categoryNames.map((name) => ({
  id: `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  title: name,
  description: `Discover top presentations, documents, and resources about ${name}.`,
  price: 499,
  features: ["Premium Content", "100% Editable", "Instant Download"],
  imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name.toLowerCase())}/800/600`
}));

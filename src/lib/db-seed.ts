/**
 * Database seed script for Nomad storefront.
 * Creates all Nomad_* tables (IF NOT EXISTS) and inserts seed data.
 *
 * Run: npx tsx src/lib/db-seed.ts
 *
 * SAFE: Does NOT touch any existing tables in MES_2026.
 */

import sql from "mssql";

const config: sql.config = {
  server: "localhost",
  port: 1433,
  user: "sa",
  password: "MsSql_Admin_2026_Secure!",
  database: "MES_2026",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function seed() {
  const pool = await new sql.ConnectionPool(config).connect();
  console.log("✅ Connected to MSSQL:", config.database);

  // ───────────────────────────────────────────────
  // 1. Create tables
  // ───────────────────────────────────────────────
  console.log("\n📦 Creating tables...\n");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_Products')
    CREATE TABLE dbo.Nomad_Products (
      Id             INT IDENTITY(1,1) PRIMARY KEY,
      Slug           NVARCHAR(100) NOT NULL UNIQUE,
      Category       NVARCHAR(50) NOT NULL,
      Name           NVARCHAR(200) NOT NULL,
      Price          INT NOT NULL,
      CompareAtPrice INT NULL,
      Rating         DECIMAL(2,1) NOT NULL DEFAULT 0,
      ReviewCount    INT NOT NULL DEFAULT 0,
      Badge          NVARCHAR(50) NULL,
      Blurb          NVARCHAR(500) NOT NULL,
      Description    NVARCHAR(MAX) NOT NULL,
      IsActive       BIT NOT NULL DEFAULT 1,
      CreatedAt      DATETIME2 NOT NULL DEFAULT GETDATE(),
      UpdatedAt      DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_Products");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_Categories')
    CREATE TABLE dbo.Nomad_Categories (
      Id             INT IDENTITY(1,1) PRIMARY KEY,
      Slug           NVARCHAR(50) NOT NULL UNIQUE,
      Name           NVARCHAR(100) NOT NULL,
      Description    NVARCHAR(500) NULL,
      SortOrder      INT NOT NULL DEFAULT 0,
      IsActive       BIT NOT NULL DEFAULT 1,
      CreatedAt      DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_Categories");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_ProductFeatures')
    CREATE TABLE dbo.Nomad_ProductFeatures (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      ProductId INT NOT NULL,
      Feature   NVARCHAR(500) NOT NULL,
      SortOrder INT NOT NULL DEFAULT 0,
      CONSTRAINT FK_PF_Product FOREIGN KEY (ProductId) REFERENCES dbo.Nomad_Products(Id)
    );
  `);
  console.log("  ✓ Nomad_ProductFeatures");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_ProductSpecs')
    CREATE TABLE dbo.Nomad_ProductSpecs (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      ProductId INT NOT NULL,
      Label     NVARCHAR(100) NOT NULL,
      Value     NVARCHAR(200) NOT NULL,
      SortOrder INT NOT NULL DEFAULT 0,
      CONSTRAINT FK_PS_Product FOREIGN KEY (ProductId) REFERENCES dbo.Nomad_Products(Id)
    );
  `);
  console.log("  ✓ Nomad_ProductSpecs");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_FAQs')
    CREATE TABLE dbo.Nomad_FAQs (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      Question  NVARCHAR(500) NOT NULL,
      Answer    NVARCHAR(MAX) NOT NULL,
      SortOrder INT NOT NULL DEFAULT 0,
      IsActive  BIT NOT NULL DEFAULT 1,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_FAQs");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_Testimonials')
    CREATE TABLE dbo.Nomad_Testimonials (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      Name      NVARCHAR(100) NOT NULL,
      Role      NVARCHAR(100) NOT NULL,
      Quote     NVARCHAR(MAX) NOT NULL,
      Rating    INT NOT NULL DEFAULT 5,
      IsActive  BIT NOT NULL DEFAULT 1,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_Testimonials");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_ContactSubmissions')
    CREATE TABLE dbo.Nomad_ContactSubmissions (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      Name      NVARCHAR(200) NOT NULL,
      Email     NVARCHAR(200) NOT NULL,
      Message   NVARCHAR(MAX) NOT NULL,
      IsRead    BIT NOT NULL DEFAULT 0,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_ContactSubmissions");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_NewsletterSubscribers')
    CREATE TABLE dbo.Nomad_NewsletterSubscribers (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      Email     NVARCHAR(200) NOT NULL UNIQUE,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_NewsletterSubscribers");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_CartSessions')
    CREATE TABLE dbo.Nomad_CartSessions (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      SessionId NVARCHAR(100) NOT NULL UNIQUE,
      CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
      UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_CartSessions");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_CartItems')
    CREATE TABLE dbo.Nomad_CartItems (
      Id        INT IDENTITY(1,1) PRIMARY KEY,
      SessionId INT NOT NULL,
      ProductId INT NOT NULL,
      Quantity  INT NOT NULL DEFAULT 1,
      AddedAt   DATETIME2 NOT NULL DEFAULT GETDATE(),
      CONSTRAINT FK_CI_Session FOREIGN KEY (SessionId) REFERENCES dbo.Nomad_CartSessions(Id),
      CONSTRAINT FK_CI_Product FOREIGN KEY (ProductId) REFERENCES dbo.Nomad_Products(Id)
    );
  `);
  console.log("  ✓ Nomad_CartItems");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_SiteSettings')
    CREATE TABLE dbo.Nomad_SiteSettings (
      Id            INT IDENTITY(1,1) PRIMARY KEY,
      SettingKey    NVARCHAR(100) NOT NULL UNIQUE,
      SettingValue  NVARCHAR(MAX) NOT NULL,
      UpdatedAt     DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_SiteSettings");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Nomad_Coupons')
    CREATE TABLE dbo.Nomad_Coupons (
      Id             INT IDENTITY(1,1) PRIMARY KEY,
      Code           NVARCHAR(50) NOT NULL UNIQUE,
      DiscountType   NVARCHAR(20) NOT NULL, -- 'PERCENT' or 'FIXED'
      DiscountValue  INT NOT NULL,
      IsActive       BIT NOT NULL DEFAULT 1,
      CreatedAt      DATETIME2 NOT NULL DEFAULT GETDATE()
    );
  `);
  console.log("  ✓ Nomad_Coupons");

  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Nomad_CartSessions') AND name = 'AppliedCouponCode')
    ALTER TABLE dbo.Nomad_CartSessions ADD AppliedCouponCode NVARCHAR(50) NULL;
  `);
  console.log("  ✓ Nomad_CartSessions Alter (AppliedCouponCode)");

  // ───────────────────────────────────────────────
  // 2. Seed data (only if tables are empty)
  // ───────────────────────────────────────────────
  console.log("\n🌱 Seeding data...\n");

  // Check if categories already seeded
  const categoryCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_Categories"
  );

  if (categoryCount.recordset[0].cnt === 0) {
    const categories = [
      { slug: "charger", name: "Chargers", description: "GaN chargers and adapters" },
      { slug: "cable", name: "Cables", description: "Braided and reinforced fast cables" },
      { slug: "power-bank", name: "Power Banks", description: "Portable high capacity power banks" },
      { slug: "kit", name: "Travel Kits", description: "Essential travel tech sets" }
    ];

    for (const c of categories) {
      await pool.request()
        .input("slug", c.slug)
        .input("name", c.name)
        .input("description", c.description)
        .query(`
          INSERT INTO dbo.Nomad_Categories (Slug, Name, Description)
          VALUES (@slug, @name, @description)
        `);
      console.log(`  ✓ Category: ${c.name}`);
    }
  }

  // Check if products already seeded
  const productCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_Products"
  );

  if (productCount.recordset[0].cnt === 0) {
    // --- Products ---
    const products = [
      {
        slug: "65w-gan-charger",
        category: "charger",
        name: "65W GaN Charger",
        price: 2499,
        compareAtPrice: 3499,
        rating: 4.8,
        reviewCount: 214,
        badge: "Bestseller",
        blurb: "Pocket-sized, laptop-fast. Charges 3 devices at once.",
        description:
          "GaN (gallium nitride) packs more power into less space than the silicon charger you're used to, so this one is smaller than a matchbox but still fast enough for a laptop. Three ports mean your phone, earbuds, and laptop can all top up from a single wall socket.",
        features: [
          "65W total output across 2 USB-C + 1 USB-A port",
          'Charges a 13" laptop, phone, and earbuds at once',
          "Foldable pins — safe for a bag pocket",
          "Built-in surge & over-heat protection",
        ],
        specs: [
          { label: "Output", value: "65W max (PD 3.0)" },
          { label: "Ports", value: "2× USB-C, 1× USB-A" },
          { label: "Weight", value: "112g" },
          { label: "Warranty", value: "1 year replacement" },
        ],
      },
      {
        slug: "braided-usb-c-cable",
        category: "cable",
        name: "Braided USB-C Cable",
        price: 799,
        compareAtPrice: null,
        rating: 4.6,
        reviewCount: 132,
        badge: null,
        blurb: "6ft, kevlar-reinforced, survives daily backpack abuse.",
        description:
          "Most cables fray at the connector within months of being crushed in a bag. This one has a kevlar-reinforced core under the braided sleeve, so it bends thousands of times without the copper inside ever knowing.",
        features: [
          "6ft length — reaches from a desk to a couch",
          "Kevlar-reinforced core, rated for 15,000+ bends",
          "100W PD support — cable, not just adapter, matters",
          "Matte braided sleeve, doesn't tangle like rubber cables",
        ],
        specs: [
          { label: "Length", value: "6ft / 1.8m" },
          { label: "Max power", value: "100W (E-marked)" },
          { label: "Data speed", value: "USB 2.0, 480Mbps" },
          { label: "Warranty", value: "1 year replacement" },
        ],
      },
      {
        slug: "10k-power-bank",
        category: "power-bank",
        name: "10K Power Bank",
        price: 1999,
        compareAtPrice: 2599,
        rating: 4.7,
        reviewCount: 98,
        badge: "New",
        blurb: "Slim enough for a jacket pocket, still fills a phone twice.",
        description:
          "10,000mAh in a body thin enough to forget it's in your jacket pocket. Pass-through charging means you can top up the bank and your phone overnight from one outlet.",
        features: [
          "10,000mAh — roughly 2 full phone charges",
          "18W fast-charge output",
          "Pass-through charging (charge it + your phone together)",
          "USB-C in and out",
        ],
        specs: [
          { label: "Capacity", value: "10,000mAh" },
          { label: "Output", value: "18W (PD)" },
          { label: "Weight", value: "185g" },
          { label: "Warranty", value: "1 year replacement" },
        ],
      },
      {
        slug: "4-in-1-travel-kit",
        category: "kit",
        name: "4-in-1 Travel Kit",
        price: 3299,
        compareAtPrice: null,
        rating: 4.9,
        reviewCount: 61,
        badge: null,
        blurb: "Charger, cable, bank, and pouch — one order, zero clutter.",
        description:
          "Everything above, bundled into one zip pouch: the 65W charger, the braided cable, the 10K power bank, and a slim organizer to keep them from tangling in your bag. Built for the person who's tired of buying these one at a time.",
        features: [
          "Includes the 65W GaN Charger + Braided Cable + 10K Power Bank",
          "Slim zip pouch with dedicated cable loop",
          "Saves ~15% versus buying each item separately",
          "One warranty claim covers the whole kit",
        ],
        specs: [
          { label: "Includes", value: "Charger, cable, power bank, pouch" },
          { label: "Pouch size", value: "18 × 10 × 4cm" },
          { label: "Combined weight", value: "~340g" },
          { label: "Warranty", value: "1 year replacement" },
        ],
      },
    ];

    for (const p of products) {
      const result = await pool
        .request()
        .input("slug", sql.NVarChar, p.slug)
        .input("category", sql.NVarChar, p.category)
        .input("name", sql.NVarChar, p.name)
        .input("price", sql.Int, p.price)
        .input("compareAtPrice", sql.Int, p.compareAtPrice)
        .input("rating", sql.Decimal(2, 1), p.rating)
        .input("reviewCount", sql.Int, p.reviewCount)
        .input("badge", sql.NVarChar, p.badge)
        .input("blurb", sql.NVarChar, p.blurb)
        .input("description", sql.NVarChar, p.description)
        .query(`
          INSERT INTO dbo.Nomad_Products
            (Slug, Category, Name, Price, CompareAtPrice, Rating, ReviewCount, Badge, Blurb, Description)
          OUTPUT INSERTED.Id
          VALUES
            (@slug, @category, @name, @price, @compareAtPrice, @rating, @reviewCount, @badge, @blurb, @description)
        `);

      const productId = result.recordset[0].Id;

      // Features
      for (let i = 0; i < p.features.length; i++) {
        await pool
          .request()
          .input("productId", sql.Int, productId)
          .input("feature", sql.NVarChar, p.features[i])
          .input("sortOrder", sql.Int, i)
          .query(`
            INSERT INTO dbo.Nomad_ProductFeatures (ProductId, Feature, SortOrder)
            VALUES (@productId, @feature, @sortOrder)
          `);
      }

      // Specs
      for (let i = 0; i < p.specs.length; i++) {
        await pool
          .request()
          .input("productId", sql.Int, productId)
          .input("label", sql.NVarChar, p.specs[i].label)
          .input("value", sql.NVarChar, p.specs[i].value)
          .input("sortOrder", sql.Int, i)
          .query(`
            INSERT INTO dbo.Nomad_ProductSpecs (ProductId, Label, Value, SortOrder)
            VALUES (@productId, @label, @value, @sortOrder)
          `);
      }

      console.log(`  ✓ Product: ${p.name} (ID: ${productId})`);
    }

    // --- FAQs ---
    const faqs = [
      {
        question: "How long does shipping take?",
        answer:
          "Orders placed before 2pm IST ship the same day from our Noida warehouse. Most metros see delivery in 2–3 days, other pin codes in 4–6 days.",
      },
      {
        question: "What's covered under the 1-year replacement warranty?",
        answer:
          "Any manufacturing fault — stops charging, port failure, cable fraying at the connector — gets a free replacement within 1 year of purchase. No questions asked, no return shipping charge.",
      },
      {
        question: "Will the 65W charger work with my laptop?",
        answer:
          "If your laptop charges over USB-C PD (most MacBooks since 2016, most Windows ultrabooks since 2019), yes. It won't work with older barrel-connector chargers.",
      },
      {
        question: "Do you ship outside India?",
        answer:
          "Not yet — this demo storefront currently ships to Indian pin codes only. International shipping is on the roadmap.",
      },
      {
        question: "Can I return an item if I change my mind?",
        answer:
          "Yes, unused items in original packaging can be returned within 7 days of delivery for a full refund, no reason needed.",
      },
    ];

    for (let i = 0; i < faqs.length; i++) {
      await pool
        .request()
        .input("question", sql.NVarChar, faqs[i].question)
        .input("answer", sql.NVarChar, faqs[i].answer)
        .input("sortOrder", sql.Int, i)
        .query(`
          INSERT INTO dbo.Nomad_FAQs (Question, Answer, SortOrder)
          VALUES (@question, @answer, @sortOrder)
        `);
    }
    console.log(`  ✓ FAQs: ${faqs.length} items`);

    // --- Testimonials ---
    const testimonials = [
      {
        name: "Ananya R.",
        role: "Product Designer",
        quote:
          "Charges my laptop and phone off one brick. Haven't touched my old charger since.",
        rating: 5,
      },
      {
        name: "Rohan K.",
        role: "Software Engineer",
        quote:
          "The cable survived a full year in my backpack. That alone earned a 5-star review.",
        rating: 5,
      },
      {
        name: "Meera S.",
        role: "Travel Blogger",
        quote:
          "Slim, fast, and the packaging alone made it feel like a premium unboxing.",
        rating: 4,
      },
    ];

    for (const t of testimonials) {
      await pool
        .request()
        .input("name", sql.NVarChar, t.name)
        .input("role", sql.NVarChar, t.role)
        .input("quote", sql.NVarChar, t.quote)
        .input("rating", sql.Int, t.rating)
        .query(`
          INSERT INTO dbo.Nomad_Testimonials (Name, Role, Quote, Rating)
          VALUES (@name, @role, @quote, @rating)
        `);
    }
    console.log(`  ✓ Testimonials: ${testimonials.length} items`);

    // --- Site Settings ---
    const settings = [
      {
        key: "aboutStats",
        value: JSON.stringify([
          { label: "Orders shipped", value: "500+" },
          { label: "Average rating", value: "4.8★" },
          { label: "Warranty", value: "1 year" },
          { label: "Dispatch time", value: "2 days" },
        ]),
      },
      {
        key: "contactInfo",
        value: JSON.stringify({
          email: "hello@nomad-gear.example",
          phone: "+91 98765 43210",
          address: "Sector 62, Noida, Uttar Pradesh, India",
          hours: "Mon–Sat, 10am–6pm IST",
        }),
      },
    ];

    for (const s of settings) {
      await pool
        .request()
        .input("key", sql.NVarChar, s.key)
        .input("value", sql.NVarChar, s.value)
        .query(`
          INSERT INTO dbo.Nomad_SiteSettings (SettingKey, SettingValue)
          VALUES (@key, @value)
        `);
    }
    console.log(`  ✓ Site Settings: ${settings.length} items`);

    // --- Coupons ---
    const couponCount = await pool.request().query(
      "SELECT COUNT(*) AS cnt FROM dbo.Nomad_Coupons"
    );

    if (couponCount.recordset[0].cnt === 0) {
      const coupons = [
        { code: "OFF30", discountType: "PERCENT", discountValue: 30 },
        { code: "WELCOME10", discountType: "PERCENT", discountValue: 10 },
        { code: "FLAT150", discountType: "FIXED", discountValue: 150 },
      ];

      for (const c of coupons) {
        await pool.request()
          .input("code", sql.NVarChar, c.code)
          .input("discountType", sql.NVarChar, c.discountType)
          .input("discountValue", sql.Int, c.discountValue)
          .query(`
            INSERT INTO dbo.Nomad_Coupons (Code, DiscountType, DiscountValue)
            VALUES (@code, @discountType, @discountValue)
          `);
        console.log(`  ✓ Coupon: ${c.code}`);
      }
    }

    console.log("\n🎉 Seed complete!");
  } else {
    // Even if other tables are not empty, ensure Nomad_Coupons is seeded if empty
    const couponCount = await pool.request().query(
      "SELECT COUNT(*) AS cnt FROM dbo.Nomad_Coupons"
    );

    if (couponCount.recordset[0].cnt === 0) {
      const coupons = [
        { code: "OFF30", discountType: "PERCENT", discountValue: 30 },
        { code: "WELCOME10", discountType: "PERCENT", discountValue: 10 },
        { code: "FLAT150", discountType: "FIXED", discountValue: 150 },
      ];

      for (const c of coupons) {
        await pool.request()
          .input("code", sql.NVarChar, c.code)
          .input("discountType", sql.NVarChar, c.discountType)
          .input("discountValue", sql.Int, c.discountValue)
          .query(`
            INSERT INTO dbo.Nomad_Coupons (Code, DiscountType, DiscountValue)
            VALUES (@code, @discountType, @discountValue)
          `);
        console.log(`  ✓ Coupon: ${c.code}`);
      }
    }
    console.log("  ⏭  Data already exists — skipping seed.");
  }

  await pool.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

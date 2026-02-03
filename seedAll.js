require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const Store = require("./models/Store");
const PaymentMethod = require("./models/PaymentMethod");

const seedAll = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database");

    // 1. Create Admin User
    const existingAdmin = await Admin.findOne({ email: "admin@opticsglasses.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const admin = await Admin.create({
        name: "Admin User",
        username: "admin",
        email: "admin@opticsglasses.com",
        password: hashedPassword,
        role: "admin"
      });

      console.log("✅ Admin user created:");
      console.log("   Email: admin@opticsglasses.com");
      console.log("   Password: admin123");
    } else {
      console.log("✅ Admin user already exists");
    }

    // 2. Create Store Configuration
    const existingStore = await Store.findOne();
    if (!existingStore) {
      const store = await Store.create({
        storeProfile: {
          name: "OpticsGlasses",
          email: "admin@opticsglasses.com",
          phone: "+1-234-567-8900",
          address: "123 Main Street, City, State 12345",
          currency: "USD",
          timezone: "UTC",
          language: "en"
        },
        shipping: {
          freeThreshold: 50,
          standardRate: 10,
          expressRate: 25,
          deliveryEstimate: "3-7 business days"
        },
        cms: {
          hero: {
            title: "Premium Eyewear Collection",
            subtitle: "Discover the perfect frames for your style",
            cta: "Shop Now",
            active: true
          },
          heroSlides: [
            {
              id: "slide1",
              imgSrc: "/home/header1.jpg",
              brand: "Premium Collection",
              active: true
            },
            {
              id: "slide2", 
              imgSrc: "/home/header2.jpg",
              brand: "Designer Frames",
              active: true
            }
          ],
          promo: {
            text: "Free shipping on orders over $50!",
            bgColor: "#000000",
            textColor: "#FFFFFF",
            active: true
          },
          featuredLimit: 8
        },
        seo: {
          title: "OpticsGlasses | Premium Eyewear & Sunglasses",
          description: "Shop the latest collection of premium eyeglasses and sunglasses. Quality frames, designer styles, and prescription lenses.",
          keywords: "eyewear, sunglasses, prescription glasses, designer frames, optics"
        },
        paymentMethods: [
          {
            name: "Stripe",
            provider: "stripe",
            status: "active",
            isDefault: true
          },
          {
            name: "PayPal",
            provider: "paypal", 
            status: "inactive",
            isDefault: false
          }
        ]
      });

      console.log("✅ Store configuration created");
    } else {
      console.log("✅ Store configuration already exists");
    }

    // 3. Create Payment Methods
    const paymentMethods = [
      {
        name: "Stripe",
        type: "card",
        icon: "💳",
        description: "Pay securely with your credit or debit card",
        isEnabled: true,
        instructions: "You will be redirected to Stripe's secure payment page"
      },
      {
        name: "PayPal",
        type: "wallet",
        icon: "🅿️",
        description: "Pay with your PayPal account",
        isEnabled: false,
        instructions: "You will be redirected to PayPal to complete your payment"
      },
      {
        name: "Cash on Delivery",
        type: "cash",
        icon: "💵",
        description: "Pay when you receive your order",
        isEnabled: true,
        instructions: "Pay in cash when your order is delivered"
      }
    ];

    for (const method of paymentMethods) {
      const existing = await PaymentMethod.findOne({ name: method.name });
      if (!existing) {
        await PaymentMethod.create(method);
        console.log(`✅ Payment method created: ${method.name}`);
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\nAdmin Login Credentials:");
    console.log("Email: admin@opticsglasses.com");
    console.log("Password: admin123");
    console.log("\nYou can now:");
    console.log("1. Login to admin panel at /admin/login");
    console.log("2. Access the dashboard");
    console.log("3. Manage products, orders, and settings");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAll();
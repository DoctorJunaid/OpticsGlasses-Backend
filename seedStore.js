require("dotenv").config();
const mongoose = require("mongoose");
const Store = require("./models/Store");

const seedStore = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database");

    // Check if store config already exists
    const existingStore = await Store.findOne();
    if (existingStore) {
      console.log("Store configuration already exists");
      return;
    }

    // Create default store configuration
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

    console.log("Default store configuration created successfully:");
    console.log("Store Name:", store.storeProfile.name);
    console.log("Store ID:", store._id);

  } catch (error) {
    console.error("Error seeding store:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedStore();
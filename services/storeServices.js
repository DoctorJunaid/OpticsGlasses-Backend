const Store = require("../models/Store");

// Get the store configuration (Singleton pattern logic)
const getStoreConfig = async () => {
    let store = await Store.findOne();

    // If no store config exists, create a default one
    if (!store) {
        store = await Store.create({
            storeProfile: {
                name: "OpticsGlasses",
                email: "admin@opticsglasses.com"
            }
        });
    }

    return store;
};

// Update store configuration
const updateStoreConfig = async (updateData) => {
    console.log('UPDATING STORE CONFIG WITH:', JSON.stringify(updateData, null, 2));

    let store = await Store.findOne();
    if (!store) {
        store = new Store();
    }

    // Deep merge updateData into store document
    const deepMerge = (target, source) => {
        for (const [key, value] of Object.entries(source)) {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                // If it's an object, initialize if needed and recurse
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                deepMerge(target[key], value);
            } else {
                // Direct assignment for primitives and arrays
                target[key] = value;
            }
        }
    };

    deepMerge(store, updateData);

    // Save with validation
    await store.save();

    console.log('RESULTING STORE CONFIG CMS:', JSON.stringify(store.cms, null, 2));
    return store;
};

// Public: Get only necessary store settings (e.g., shipping, active SEO)
const getPublicStoreConfig = async () => {
    let store = await Store.findOne();

    // If no store config exists, create a default one (same as getStoreConfig)
    if (!store) {
        store = await Store.create({
            storeProfile: {
                name: "OpticsGlasses",
                email: "admin@opticsglasses.com"
            }
        });
    }

    // Return a subset of data safe for public consumption if needed
    // or just return the whole object if nothing is sensitive.
    // Assuming everything in Store model is relatively public or frontend-needed.
    return store;
}

module.exports = {
    getStoreConfig,
    updateStoreConfig,
    getPublicStoreConfig
};

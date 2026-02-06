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

    // Flatten nested objects to use dot notation for partial updates
    const flatten = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flatten(obj[key], pre + key));
            } else {
                acc[pre + key] = obj[key];
            }
            return acc;
        }, {});
    };

    const finalUpdate = flatten(updateData);

    const store = await Store.findOneAndUpdate({}, { $set: finalUpdate }, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
    });

    console.log('UPDATED STORE DOCUMENT CMS:', JSON.stringify(store.cms, null, 2));
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

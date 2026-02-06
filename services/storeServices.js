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

    // If updateData contains 'cms', flattened it to use dot notation to prevent overwriting other fields
    let finalUpdate = { ...updateData };
    if (updateData.cms) {
        delete finalUpdate.cms;
        Object.keys(updateData.cms).forEach(key => {
            finalUpdate[`cms.${key}`] = updateData.cms[key];
        });
    }

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

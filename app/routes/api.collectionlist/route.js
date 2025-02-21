import { json } from "@remix-run/node";
import Collection from "../../models/collection.model";

export const loader = async () => {
    try {
      const collections = await Collection.find(); 
      return json({ collections }); 
    } catch (error) {
      return json({ error: "Internal Server Error" }, { status: 500 });
    }
  };

export const action = async ({ request }) => {
    if (request.method == "POST") {
        try {
            const { collections } = await request.json(); 
            if (!Array.isArray(collections) || collections.length === 0) {
              return json({ error: "Invalid collections array" }, { status: 400 });
            }
            const bulkOperations = collections.map((collection) => ({
              updateOne: {
                filter: { collectionId: collection.id },
                update: {
                  collectionId: collection.id,
                  title: collection.title,
                  image: collection.image ? collection.image.url : null,
                },
                upsert: true,
              },
            }));
            await Collection.bulkWrite(bulkOperations);
            return json({ message: "Collections added successfully" });
          } catch (error) {
            return json({ error: "Internal Server Error" }, { status: 500 });
          }
    }
};

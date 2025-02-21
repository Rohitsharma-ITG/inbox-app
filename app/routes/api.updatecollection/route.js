import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import Collection from "../../models/collection.model";

export const action = async ({ request }) => {
  console.log('request---',request);
  try {
    const { id, title } = await request.json(); 
    if (!id || !title) {
      return json({ error: "Collection ID and title are required!" }, { status: 400 });
    }

    const { admin } = await authenticate.admin(request);
     
    const response = await admin.graphql(
      `#graphql
      mutation updateCollectionTitle($input: CollectionInput!) {
        collectionUpdate(input: $input) {
          collection {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          input: {
            id,
            title,
          },
        },
      }
    );

    const data = await response.json();
    const collection = data.data.collectionUpdate.collection
    if (collection) {
      const result = await Collection.updateOne(
              { collectionId: id },
              { $set: { title: title } }
            );  
    }


    if (data.errors || data.data.collectionUpdate.userErrors.length > 0) {
      return json({ error: data.data.collectionUpdate.userErrors }, { status: 400 });
    }
    return json({ success: true, collection });
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import Collection from "../../models/collection.model";

export const action = async ({ request }) => {
  try {
    const { id } = await request.json(); 
    if (!id) {
      return json({ error: "Collection ID is required!" }, { status: 400 });
    }

    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
      mutation collectionDelete($input: CollectionDeleteInput!) {
        collectionDelete(input: $input) {
          deletedCollectionId
          shop {
            id
            name
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
            id
          },
        },
      }
    );
    
    const data = await response.json();
    const collection = data.data.collectionDelete
    if (collection) {
      const result = await Collection.deleteOne(
              { collectionId: id }
            );  
    }
    return json({ success: true, collection });
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

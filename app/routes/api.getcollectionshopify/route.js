import { authenticate } from "../../shopify.server";
import { json } from "@remix-run/node";
import Collection from "../../models/collection.model";
import { User } from "../../models/user.model";

export const loader = async ({ request }) => {
  try {
    // console.log("Trying to fetch collections...");

    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
          query GetAllCollections {
  collections(first: 50) {
    nodes {
      id
      handle
      title
      updatedAt
      descriptionHtml
      sortOrder
      templateSuffix
      image {
        url
        altText
        width
        height
      }
    }
  }
}
`,
    );
    const data = await response.json();
    const collectiondata = data.data.collections.nodes;
    let collection = [];
    console.log("collectiondata:", collectiondata);
    for (const item of collectiondata) {
      const collectionExist = await Collection.findOne({ collectionId: item.id });
      if (!collectionExist && collection.length < 5) {
        collection.push({
          id: item.id,
          title: item.title,
          image: item.image,
        });
      }
    }
    console.log("collections:", collection);
    return json({ collection });    
  } catch (error) {
    console.error("Error fetching collections:", error);
    return json({ error: "Failed to fetch collections" }, { status: 500 });
  }
};



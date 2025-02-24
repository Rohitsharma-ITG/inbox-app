import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import Rproduct from "../../models/rpoducts.model";

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    if (request.method === "POST") {
      const { id, title } = await request.json();
      if (!id || !title) {
        return json({ error: "Product ID and title are required!" }, { status: 400 });
      }

      const response = await admin.graphql(
        `#graphql
        mutation updateProductTitle($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
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
      const product = data.data.productUpdate.product;

      if (product) {
        await Rproduct.updateOne({ productId: id }, { $set: { title: title } });
      }

      if (data.errors || data.data.productUpdate.userErrors.length > 0) {
        return json({ error: data.data.productUpdate.userErrors }, { status: 400 });
      }

      return json({ success: true, product });
    } 
    
    else if (request.method === "DELETE") {
      const { id } = await request.json();
      if (!id) {
        return json({ error: "Product ID is required for deletion!" }, { status: 400 });
      }
      const response = await admin.graphql(
        `#graphql
        mutation deleteProduct($input: ProductDeleteInput!) {
          productDelete(input: $input) {
            deletedProductId
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
            },
          },
        }
      );

      const data = await response.json();

      if (data.errors || data.data.productDelete.userErrors.length > 0) {
        return json({ error: data.data.productDelete.userErrors }, { status: 400 });
      }

      await Rproduct.deleteOne({ productId: id });

      return json({ success: true, message: "Product deleted successfully" });
    } 
    
    else {
      return json({ error: "Invalid request method" }, { status: 405 });
    }
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

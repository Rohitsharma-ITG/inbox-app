import { authenticate } from "../../shopify.server";
import { json } from "@remix-run/node";
import Rproduct from "../../models/rpoducts.model";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const productResponse = await admin.graphql(
      `#graphql
        query GetAllProducts {
          products(first: 50) {
            nodes {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `
    );

    const productData = await productResponse.json();
    console.log('productData:-- ', productData);
    const products = productData.data.products.nodes;
    console.log('products--:', products);
    let productList = [];
    for (const item of products) {
      const productExist = await Rproduct.findOne({ productId: item.id });
      if (!productExist && productList.length < 5) {
        productList.push({
          id: item.id,
          title: item.title,
          image: item.images.edges.length > 0 ? item.images.edges[0].node.url : null,
          price: item.priceRange.minVariantPrice.amount,
        });
      }
    }
    console.log('productList:--', productList);
    return json({ products: productList });

  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: "Failed to fetch products" }, { status: 500 });
  }
};

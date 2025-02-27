import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request,params }) => {
  try {
    const { orderId } = params; 
    console.log('orderId',orderId,params);
    if (!orderId) {
      return json({ error: "Order ID is required." }, { status: 400 });
    }

    const { admin } = await authenticate.admin(request);

   
    const response = await admin.graphql(`
        query {
    order(id: "gid://shopify/Order/${orderId}") {
      id
      name
      createdAt
      updatedAt
      cancelledAt
      displayFulfillmentStatus
      displayFinancialStatus
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      customer {
        id
        firstName
        lastName
        email
      }
      lineItems(first: 100) {
        edges {
          node {
            id
            title
            quantity
            variant {
              id
              title
              sku
              price
              image {
                url
                altText
              }
              product {
                id
                title
                vendor
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
  
      `);
  
      const res = await response.json();
      console.log('responcee',res.data.order);
     const resdata = res.data.order
    return json(resdata );
  } catch (error) {
    console.error("Error fetching order details:", error);
    return json({ error: "Failed to fetch order details." }, { status: 500 });
  }
};

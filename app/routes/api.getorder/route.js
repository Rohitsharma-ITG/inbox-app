import { authenticate } from "../../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(
      `#graphql
    query {
  orders(first: 100) {
    edges {
      node {
        id
        name
        customer {
          id
          firstName
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        createdAt
        displayFulfillmentStatus
        displayFinancialStatus
        channelInformation {
          id
          channelDefinition {
            id
          }
        }
        lineItems(first: 100) {
          edges {
            node {
               title
          quantity
            }
          }
        }
        updatedAt
      }
    }
  }
}

`,
    );

    const data = await response.json();
    const orders = data.data.orders.edges;
    return json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return json({ error: "Failed to fetch orders" }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const { orderId, productId, quantity } = await request.json();

    console.log("✅ Order ID:", orderId);
    console.log("✅ Product ID:", productId);

    // Fetch Variant ID
    const variantResponse = await admin.graphql(`
      query {
        product(id: "${productId}") {
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `);
    const variantData = await variantResponse.json();

    console.log("🛠 Variant Data:", JSON.stringify(variantData, null, 2));

    if (
      variantData.errors ||
      !variantData.data?.product?.variants?.edges?.length
    ) {
      console.error("🚨 Error fetching variant:", variantData);
      return json(
        { error: "Failed to fetch variant for the product." },
        { status: 400 },
      );
    }

    const variantId = variantData.data.product.variants.edges[0].node.id;
    console.log("✅ Variant ID:", variantId);

    // Start Order Edit
    const beginEditResponse = await admin.graphql(`
      mutation {
        orderEditBegin(id: "${orderId}") {
          calculatedOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `);
    const beginEditData = await beginEditResponse.json();
    console.log(
      "🛠 Order Edit Begin Response:",
      JSON.stringify(beginEditData, null, 2),
    );

    if (
      beginEditData.errors ||
      beginEditData.data?.orderEditBegin?.userErrors?.length > 0
    ) {
      console.error("🚨 Error starting order edit:", beginEditData);
      return json({ error: "Failed to start order edit." }, { status: 400 });
    }

    const calculatedOrderId =
      beginEditData.data.orderEditBegin.calculatedOrder.id;
    console.log("✅ Calculated Order ID:", calculatedOrderId);

    // Add Variant to Order
    const addVariantResponse = await admin.graphql(`
      mutation {
        orderEditAddVariant(id: "${calculatedOrderId}", variantId: "${variantId}", quantity: ${quantity}) {
          calculatedOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `);
    const addVariantData = await addVariantResponse.json();
    console.log(
      "🛠 Add Variant Response:",
      JSON.stringify(addVariantData, null, 2),
    );

    if (
      addVariantData.errors ||
      addVariantData.data?.orderEditAddVariant?.userErrors?.length > 0
    ) {
      console.error("🚨 Error adding product:", addVariantData);
      return json(
        { error: "Failed to add product to order." },
        { status: 400 },
      );
    }

    // Commit Order Edit
    const commitResponse = await admin.graphql(`
      mutation {
        orderEditCommit(id: "${calculatedOrderId}") {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `);
    const commitData = await commitResponse.json();
    console.log("🛠 Commit Response:", JSON.stringify(commitData, null, 2));

    if (
      commitData.errors ||
      commitData.data?.orderEditCommit?.userErrors?.length > 0
    ) {
      console.error("🚨 Error committing order edit:", commitData);
      return json(
        { error: "Failed to commit order changes." },
        { status: 400 },
      );
    }

    return json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error("🚨 Error updating order:", error);
    return json({ error: "Failed to update order." }, { status: 500 });
  }
};

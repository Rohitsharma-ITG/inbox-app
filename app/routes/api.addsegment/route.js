import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server"; 

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    if (request.method !== "POST") {
      return json({ error: "Only POST requests are allowed" }, { status: 405 });
    }

    const { name, query } = await request.json();
console.log('query',query);
    if (!name || !query) {
      return json({ error: "Segment name and query are required!" }, { status: 400 });
    }

    const mutation = `#graphql
      mutation segmentCreate($name: String!, $query: String!) {
        segmentCreate(name: $name, query: $query) {
          segment {
            id
            name
            query
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await admin.graphql(mutation, {
      variables: { name, query },
    });

    const res = await response.json(); 
    const data = res.data
    console.log('data.segmentCreate.segment',data.segmentCreate.userErrors);
    if (data.segmentCreate?.userErrors?.length > 0) {
      return json({ error: data.segmentCreate.userErrors }, { status: 400 });
    }

    return json({ success: true, segment: data.segmentCreate.segment });
  } catch (error) {
    console.error("Error creating segment:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

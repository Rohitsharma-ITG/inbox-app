import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server"; 

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const query = `#graphql
      query {
        segments(first: 50) {
          edges {
            node {
              id
              name
              query
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const res = await response.json()
    console.log('responceeeee',res.data.segments.edges);
    if (!res.data.segments) {
      return json({ error: "No segments found!" }, { status: 404 });
    }

    return json({ success: true, segments: res.data.segments.edges });
  } catch (error) {
    console.error("Error fetching segments:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getUserComparisonProducts } from "../storage.server";

type ProductNodeImage = {
  url: string;
  altText: string | null;
};

type MetaobjectField = {
  key: string;
  value: string;
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  featuredImage: ProductNodeImage | null;
  metafield: {
    reference: { fields: MetaobjectField[] } | null;
  } | null;
};

type Product = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  imageAlt: string;
  characteristics: Record<string, string> | null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const customerId = url.searchParams.get("logged_in_customer_id");

  if (!customerId) {
    return Response.json({ error: "Not logged in" }, { status: 500 });
  }

  if (!admin) {
    return Response.json({ error: "Can't get data" }, { status: 500 });
  }

  const userProducts = getUserComparisonProducts(customerId);

  if (!userProducts || userProducts.length === 0) {
    return Response.json(null);
  }

  const gids = userProducts.map((id: string): string => {
    return `gid://shopify/Product/${id}`;
  });

  const shopifyProductsResponse = await admin.graphql(
    `#graphql
    query GetComparisonProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          metafield(namespace: "custom", key: "characteristics") {
            reference {
              ... on Metaobject {
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }`,
    { variables: { ids: gids } },
  );

  const { data } = await shopifyProductsResponse.json();
  const nodes: ProductNode[] = data?.nodes ?? [];
  const products: Product[] = [];

  nodes.forEach((node: ProductNode | null): void => {
    if (!node) {
      return;
    }

    const numericId = node.id.replace("gid://shopify/Product/", "");

    const fields = node.metafield?.reference?.fields;
    const characteristics: Record<string, string> | null = fields
      ? Object.fromEntries(fields.map((f) => [f.key, f.value]))
      : null;

    const product: Product = {
      id: numericId,
      title: node.title,
      url: `/products/${node.handle}`,
      image: node.featuredImage?.url ?? null,
      imageAlt: node.featuredImage?.altText ?? node.title,
      characteristics,
    };

    products.push(product);
  });

  return Response.json({ products });
};

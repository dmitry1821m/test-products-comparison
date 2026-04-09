import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import {
  initUserComparisonProducts,
  getUserComparisonProducts,
  toggleProductInComparison,
} from "../storage.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const customerId = url.searchParams.get("logged_in_customer_id");
  const productId = url.searchParams.get("product_id");

  if (!customerId) {
    return Response.json({ error: "Not logged in" }, { status: 500 });
  }

  if (!productId) {
    return Response.json({ error: "No product id" }, { status: 500 });
  }

  const userProducts = getUserComparisonProducts(customerId);

  if (!userProducts) {
    initUserComparisonProducts(customerId);
  }

  toggleProductInComparison(customerId, productId);
  const isInComparison = getUserComparisonProducts(customerId)?.includes(productId) ?? false;

  return Response.json({ isInComparison });
};

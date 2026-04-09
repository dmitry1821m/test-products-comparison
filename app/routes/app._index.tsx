import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const Index = () => {
  return (
    <s-page>
      <s-section>
        Let customers easily compare two products side by side, making smarter shopping decisions
        and boosting conversions in your Shopify store!
      </s-section>
    </s-page>
  );
};

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

export default Index;

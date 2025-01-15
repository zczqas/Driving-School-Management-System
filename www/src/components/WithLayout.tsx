import React from "react";

interface Props<T> {
  component: React.FC<T>;
  layout: any;
  [key: string]: any;
}

// ==============================|| WITH LAYOUT ||============================== //
const WithLayout = <T extends {}>(props: Props<T>) => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Layout>
      <Component {...(rest as T)} />
    </Layout>
  );
};

export default WithLayout;

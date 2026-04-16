import React from "react";
import { css, cx } from "./emotion";
import { useCatalog } from "./components/CatalogRuntimeContext";

const styled = (tag, styles) => {
   
  const Styled = ({ className, ...props }) => {
    const catalog = useCatalog();
    return React.createElement(tag, {
      ...props,
      className: cx(
        css(typeof styles === "function" ? styles(props, catalog) : styles, {
          label: tag
        }),
        className
      )
    });
  };

  Styled.displayName = `Styled.${tag}`;

  return Styled;
};

export default styled;

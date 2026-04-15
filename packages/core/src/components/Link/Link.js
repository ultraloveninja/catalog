import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { parsePath, isInternalPath, getPublicPath } from "../../utils/path";
import { useCatalog } from "../CatalogRuntimeContext";

const Link = ({ to, className, activeClassName, onlyActiveOnIndex, ...rest }) => {
  const catalog = useCatalog();
  const parsedTo = parsePath(to, catalog);
  return isInternalPath(parsedTo, catalog) ? (
    activeClassName ? (
      <NavLink
        to={parsedTo}
        end={onlyActiveOnIndex}
        className={({ isActive }) =>
          isActive && activeClassName
            ? [className, activeClassName].filter(Boolean).join(" ")
            : className
        }
        {...rest}
      />
    ) : (
      <RouterLink to={parsedTo} className={className} {...rest} />
    )
  ) : (
    <a href={getPublicPath(to, catalog)} className={className} {...rest} />
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  onlyActiveOnIndex: PropTypes.bool
};

export default Link;

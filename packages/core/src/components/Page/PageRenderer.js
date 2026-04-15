import PropTypes from "prop-types";
import "raf/polyfill";

import React, { useCallback, useEffect, useRef } from "react";
import Page from "./Page";
import runscript from "../../utils/runscript";
import { useCatalog } from "../CatalogContext";

const renderStyles = styles => {
  return styles.map((src, i) => (
    <link key={i} href={src} rel="stylesheet" type="text/css" />
  ));
};

const renderContent = Content =>
  typeof Content === "string" ? <Page>{Content}</Page> : <Content />;

const PageRenderer = ({ content, location }) => {
  const {
    page: { styles, scripts }
  } = useCatalog();
  const jumpTimeout = useRef(null);

  const jumpToSelector = useCallback(selector => {
    if (jumpTimeout.current !== null) {
      cancelAnimationFrame(jumpTimeout.current);
      jumpTimeout.current = null;
    }

    // Don't freak out when hash is not a valid selector (e.g. #/foo)
    try {
      const el = document.querySelector(selector);
      if (el) {
        // Defer scrolling by one tick (when the page has completely rendered)
        jumpTimeout.current = requestAnimationFrame(() => {
          jumpTimeout.current = null;
          el.scrollIntoView();
        });
      }
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }, []);

  const jump = useCallback(() => {
    const {
      hash,
      search
    } = location;
    const a = new URLSearchParams(search).get("a");

    // Hash is always defined, but may be an empty string. But the query param
    // is indeed optional and may be undefined. We do not want to be jumping
    // to the '#undefined' selector.

    if (hash !== "") {
      jumpToSelector(hash);
    } else if (a !== null && a !== "") {
      jumpToSelector(`#${a}`);
    }
  }, [jumpToSelector, location]);

  useEffect(() => {
    scripts.forEach(runscript);
    jump();
  }, [scripts, jump]);

  useEffect(() => {
    return () => {
      if (jumpTimeout.current !== null) {
        cancelAnimationFrame(jumpTimeout.current);
        jumpTimeout.current = null;
      }
    };
  }, []);

  return (
    <div>
      {renderStyles(styles)}
      {renderContent(content)}
    </div>
  );
};

PageRenderer.propTypes = {
  content: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  location: PropTypes.object.isRequired
};

export default PageRenderer;

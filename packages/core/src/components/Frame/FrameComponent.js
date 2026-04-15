/*

Modified react-frame-component@0.4.0 which supports an onRender callback (e.g. to measure contents);
Original https://github.com/ryanseddon/react-frame-component/

*/

import React, { Component } from "react";
import { css } from "../../emotion";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import raf from "raf";

class FrameComponent extends Component {
  constructor() {
    super();
    this.state = {
      mountNode: null
    };
    this.isUnmounting = false;
    this.setupTimer = null;
    this.setupFrameDocument = this.setupFrameDocument.bind(this);
    this.scheduleOnRender = this.scheduleOnRender.bind(this);
  }

  componentDidMount() {
    this.setupFrameDocument();
  }

  componentDidUpdate() {
    if (!this.state.mountNode) {
      this.setupFrameDocument();
      return;
    }
    this.scheduleOnRender();
  }

  componentWillUnmount() {
    this.isUnmounting = true;
    if (this.setupTimer) {
      clearTimeout(this.setupTimer);
      this.setupTimer = null;
    }
  }

  setupFrameDocument() {
    if (!this.iframe) {
      return;
    }

    const doc = this.iframe.contentDocument;

    if (doc && doc.readyState === "complete") {
      doc.body.innerHTML = "<div></div>";
      doc.head.innerHTML = "";

      const base = doc.createElement("base");
      base.setAttribute("href", window.location.href);
      doc.head.appendChild(base);

      // Clone styles from parent document head into the iframe, so components which use webpack's style-loader get rendered correctly.
      // This doesn't clone any Catalog styles because they are either inline styles or part of the body.
      const pageStyles = Array.from(
        document.querySelectorAll('head > style, head > link[rel="stylesheet"]')
      );
      pageStyles.forEach(s => {
        doc.head.appendChild(s.cloneNode(true));
      });

      if (!this.isUnmounting) {
        this.setState({ mountNode: doc.body.firstChild });
      }
    } else {
      this.setupTimer = setTimeout(this.setupFrameDocument, 0);
    }
  }

  scheduleOnRender() {
    if (this.props.onRender && this.state.mountNode) {
      raf(() => {
        if (!this.isUnmounting && this.state.mountNode) {
          this.props.onRender(this.state.mountNode);
        }
      });
    }
  }

  render() {
    const { style } = this.props;
    const { mountNode } = this.state;
    const contents = (
      <div>
        {this.props.head}
        {this.props.children}
      </div>
    );

    return (
      <>
        <iframe
          ref={el => {
            this.iframe = el;
          }}
          className={css(style)}
        />
        {mountNode ? createPortal(contents, mountNode) : null}
      </>
    );
  }
}

FrameComponent.propTypes = {
  style: PropTypes.object,
  head: PropTypes.node,
  onRender: PropTypes.func,
  children: PropTypes.node
};

export default FrameComponent;

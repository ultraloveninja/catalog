import React from "react";
import PropTypes from "prop-types";
import renderMarkdown from "../../markdown/renderMarkdown";
import seqKey from "../../utils/seqKey";
import MarkdownSpecimen from "../Specimen/MarkdownSpecimen";
import { css } from "../../emotion";
import { useCatalog } from "../CatalogRuntimeContext";

const pageStyle = {
  boxSizing: "border-box",
  margin: `0 20px 0 20px`,
  maxWidth: "64em",
  display: "flex",
  flexFlow: "row wrap",
  padding: `48px 0`,
  "@media (min-width: 640px)": {
    margin: `0 10px 0 20px`
  },
  "@media (min-width: 1000px)": {
    margin: `0 30px 0 40px`
  },
  "& > :first-child": {
    marginTop: 0
  }
};

const Page = ({ children }) => {
  const { getSpecimen } = useCatalog();

  const getSpecimenKey = seqKey("Specimen");
  const blocks = React.Children.toArray(children);

  return (
    <div
      className={css({
        ...pageStyle
      })}
    >
      {blocks.map((child, index) => {
        const md =
          typeof child === "string"
            ? renderMarkdown({
                text: child,
                renderer: {
                  code: (body, options) => {
                    return (
                      <MarkdownSpecimen
                        key={getSpecimenKey()}
                        body={body}
                        options={options || ""}
                        getSpecimen={getSpecimen}
                      />
                    );
                  }
                }
              })
            : child;

        return (
          <React.Fragment key={`page-block-${index}`}>
            {React.Children.toArray(md)}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node
};

export default Page;

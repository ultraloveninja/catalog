/**
 * CSS Modules local class names (Create React App–compatible behavior).
 * MIT License — derived from facebook/create-react-app’s implementation.
 */
import crypto from "crypto";
import path from "path";

type LoaderContext = {
  resourcePath: string;
  rootContext: string;
};

function hashDigest(relativePath: string, localName: string): string {
  return crypto
    .createHash("md5")
    .update(relativePath + localName)
    .digest("base64")
    .slice(0, 5)
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
}

export default function getCSSModuleLocalIdent(
  context: LoaderContext,
  _localIdentName: string,
  localName: string,
  _options: Record<string, unknown>
): string {
  const relative = path.posix.relative(context.rootContext, context.resourcePath);
  const hash = hashDigest(relative, localName);

  const fileNameOrFolder = context.resourcePath.match(
    /index\.module\.(css|scss|sass)$/
  )
    ? path.basename(path.dirname(context.resourcePath))
    : path.parse(context.resourcePath).name;

  const className = `${fileNameOrFolder}_${localName}__${hash}`;
  return className.replace(/\.module_/g, "_");
}

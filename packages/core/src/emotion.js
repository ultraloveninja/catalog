import createEmotion from "@emotion/css/create-instance";

const context = typeof global !== "undefined" ? global : {};

if (context.__CATALOG_EMOTION_INSTANCE__ === undefined) {
  context.__CATALOG_EMOTION_INSTANCE__ = createEmotion({
    key: "catalog"
  });
}

const emotion = context.__CATALOG_EMOTION_INSTANCE__;

export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  cache
} = emotion;

export const caches = { catalog: cache };

import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape } from 'html-escaper';
import mime from 'mime';
import { dim, bold, red, yellow, cyan, green } from 'kleur/colors';
import sizeOf from 'image-size';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
/* empty css                                 */import contentful from 'contentful';
import { optimize } from 'svgo';
/* empty css                                 *//* empty css                                 *//* empty css                                 *//* empty css                                     *//* empty css                                 *//* empty css                                 *//* empty css                                 */import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
/* empty css                                 *//* empty css                                  *//* empty css                                 */import 'cookie';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

function baseCreateComponent(cb, moduleId) {
  cb.isAstroComponentFactory = true;
  cb.moduleId = moduleId;
  return cb;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId);
  cb.propagation = opts.propagation;
  return cb;
}
function createComponent(arg1, moduleId) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const ASTRO_VERSION = "1.7.2";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

var _a$7;
const renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  constructor(htmlParts, expressions) {
    this[_a$7] = true;
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [(_a$7 = renderTemplateResultSym, Symbol.toStringTag)]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
async function* renderAstroTemplateResult(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function renderToString(result, componentFactory, props, children) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    const response = factoryResult;
    throw response;
  }
  let parts = new HTMLParts();
  const templateResult = isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
  for await (const chunk of renderAstroTemplateResult(templateResult)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.propagation.has(factory.moduleId) && hint === "none") {
    hint = result.propagation.get(factory.moduleId);
  }
  return hint === "in-tree" || hint === "self";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  InvalidPrerenderExport: {
    title: "Invalid prerender export.",
    code: 3019,
    message: (prefix, suffix) => {
      let msg = `A \`prerender\` export has been detected, but its value cannot be statically analyzed.`;
      if (prefix !== "const")
        msg += `
Expected \`const\` declaration but got \`${prefix}\`.`;
      if (suffix !== "true")
        msg += `
Expected \`true\` value but got \`${suffix}\`.`;
      return msg;
    },
    hint: "Mutable values declared at runtime are not supported. Please make sure to use exactly `export const prerender = true`."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  MarkdownContentSchemaValidationError: {
    title: "Content collection frontmatter invalid.",
    code: 6002,
    message: (collection, entryId, error) => {
      return [
        `${String(collection)} \u2192 ${String(entryId)} frontmatter does not match collection schema.`,
        ...error.errors.map((zodError) => zodError.message)
      ].join("\n");
    },
    hint: "See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas."
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name && name !== "Error") {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode;
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var _a$6;
const astroComponentInstanceSym = Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  constructor(result, props, slots, factory) {
    this[_a$6] = true;
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      this.slotValues[name] = slots[name]();
    }
  }
  async init() {
    this.returnValue = this.factory(this.result, this.props, this.slotValues);
    return this.returnValue;
  }
  async *render() {
    if (this.returnValue === void 0) {
      await this.init();
    }
    let value = this.returnValue;
    if (isPromise(value)) {
      value = await value;
    }
    if (isHeadAndContent(value)) {
      yield* value.content;
    } else {
      yield* renderChild(value);
    }
  }
}
_a$6 = astroComponentInstanceSym;
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory) && !result.propagators.has(factory)) {
    result.propagators.set(factory, instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (isRenderTemplateResult(child)) {
    yield* renderAstroTemplateResult(child);
  } else if (isAstroComponentInstance(child)) {
    yield* child.render();
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToIterable(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToIterable(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && typeof Component === "object" && Component["astro:html"];
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  var _a, _b;
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroTemplateResult(
      await renderTemplate`<${Tag}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/g;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlot(result, slots == null ? void 0 : slots.default);
  if (children == null) {
    return children;
  }
  return markHTMLString(children);
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component.render({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => stringifyChunk(result, instr)).join("") : "";
  return markHTMLString(hydrationHtml + html);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Promise.resolve(Component).then((Unwrapped) => {
      return renderComponent(result, displayName, Unwrapped, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots);
  }
  if (isAstroComponentFactory(Component)) {
    return createAstroComponentInstance(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots);
}
function renderComponentToIterable(result, displayName, Component, props, slots = {}) {
  const renderResult = renderComponent(result, displayName, Component, props, slots);
  if (isAstroComponentInstance(renderResult)) {
    return renderResult.render();
  }
  return renderResult;
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
async function* renderExtraHead(result, base) {
  yield base;
  for (const part of result.extraHead) {
    yield* renderChild(part);
  }
}
function renderAllHeadContent(result) {
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  const baseHeadContent = markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
  if (result.extraHead.length > 0) {
    return renderExtraHead(result, baseHeadContent);
  } else {
    return baseHeadContent;
  }
}
function createRenderHead(result) {
  result._metadata.hasRenderedHead = true;
  return renderAllHeadContent.bind(null, result);
}
const renderHead = createRenderHead;
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield createRenderHead(result)();
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const PREFIX = "@astrojs/image";
const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function getPrefix(level, timestamp) {
  let prefix = "";
  if (timestamp) {
    prefix += dim(dateTimeFormat.format(new Date()) + " ");
  }
  switch (level) {
    case "debug":
      prefix += bold(green(`[${PREFIX}] `));
      break;
    case "info":
      prefix += bold(cyan(`[${PREFIX}] `));
      break;
    case "warn":
      prefix += bold(yellow(`[${PREFIX}] `));
      break;
    case "error":
      prefix += bold(red(`[${PREFIX}] `));
      break;
  }
  return prefix;
}
const log = (_level, dest) => ({ message, level, prefix = true, timestamp = true }) => {
  if (levels[_level] >= levels[level]) {
    dest(`${prefix ? getPrefix(level, timestamp) : ""}${message}`);
  }
};
const error = log("error", console.error);

async function metadata(src, data) {
  const file = data || await fs.readFile(src);
  const { width, height, type, orientation } = await sizeOf(file);
  const isPortrait = (orientation || 0) >= 5;
  if (!width || !height || !type) {
    return void 0;
  }
  return {
    src: fileURLToPath(src),
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

const imagePoolModulePromise = import('./chunks/image-pool.abfa6f7b.mjs');
class SquooshService extends BaseSSRService {
  async processAvif(image, transform) {
    const encodeOptions = transform.quality ? { avif: { quality: transform.quality } } : { avif: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.avif;
    return {
      data: data.binary,
      format: "avif"
    };
  }
  async processJpeg(image, transform) {
    const encodeOptions = transform.quality ? { mozjpeg: { quality: transform.quality } } : { mozjpeg: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.mozjpeg;
    return {
      data: data.binary,
      format: "jpeg"
    };
  }
  async processPng(image, transform) {
    await image.encode({ oxipng: {} });
    const data = await image.encodedWith.oxipng;
    return {
      data: data.binary,
      format: "png"
    };
  }
  async processWebp(image, transform) {
    const encodeOptions = transform.quality ? { webp: { quality: transform.quality } } : { webp: {} };
    await image.encode(encodeOptions);
    const data = await image.encodedWith.webp;
    return {
      data: data.binary,
      format: "webp"
    };
  }
  async autorotate(transform, inputBuffer) {
    try {
      const meta = await metadata(transform.src, inputBuffer);
      switch (meta == null ? void 0 : meta.orientation) {
        case 3:
        case 4:
          return { type: "rotate", numRotations: 2 };
        case 5:
        case 6:
          return { type: "rotate", numRotations: 1 };
        case 7:
        case 8:
          return { type: "rotate", numRotations: 3 };
      }
    } catch {
    }
  }
  async transform(inputBuffer, transform) {
    const operations = [];
    if (!isRemoteImage(transform.src)) {
      const autorotate = await this.autorotate(transform, inputBuffer);
      if (autorotate) {
        operations.push(autorotate);
      }
    } else if (transform.src.startsWith("//")) {
      transform.src = `https:${transform.src}`;
    }
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      operations.push({
        type: "resize",
        width,
        height
      });
    }
    if (!transform.format) {
      error({
        level: "info",
        prefix: false,
        message: red(`Unknown image output: "${transform.format}" used for ${transform.src}`)
      });
      throw new Error(`Unknown image output: "${transform.format}" used for ${transform.src}`);
    }
    const { processBuffer } = await imagePoolModulePromise;
    const data = await processBuffer(inputBuffer, operations, transform.format, transform.quality);
    return {
      data: Buffer.from(data),
      format: transform.format
    };
  }
}
const service = new SquooshService();
var squoosh_default = service;

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get$1 = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = squoosh_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await squoosh_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$z = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/logo.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$Logo;
  return renderTemplate`${maybeRenderHead($$result)}<a href="/" class="astro-4NVSOZW4">
    <img src="https://simplot-media.azureedge.net/-/media/project/sapl/brands/australia/iandj/images/logos/brand-small.jpg?h=450&iar=0&w=600&rev=42050e2b08674bc6bf2e9edd066e878d&hash=0A802625D6E74D5D0968F70EAB04285F" class="logo astro-4NVSOZW4" alt="logo">  
</a>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/logo.astro");

const contentfulClient = contentful.createClient({
  space: "803kc1al70mk",
  accessToken: "W-Pn_XBfU8rZTWCfkn7Md_eASVPQxZ7fpReuU4Q1kl4",
  host: "cdn.contentful.com"
});

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$y = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Icon.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Icon.astro");

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$x = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Spritesheet.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$w = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/SpriteProvider.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$v = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Sprite.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$u = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/headerNav.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$HeaderNav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$HeaderNav;
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const prodCategories = categories.items.map((item) => {
    const { name, headerNav } = item.fields;
    return {
      name,
      headerNav
    };
  });
  return renderTemplate`${maybeRenderHead($$result)}<nav class="header-nav astro-QTHG7GS4">
    <div class="logo astro-QTHG7GS4">${renderComponent($$result, "Logo", $$Logo, { "class": "astro-QTHG7GS4" })}</div>
    <ul class="cat-nav astro-QTHG7GS4">
        ${prodCategories.map((cats) => cats.headerNav && renderTemplate`<li class="astro-QTHG7GS4">
            <a${addAttribute(`/our-range/${cats.name}/`, "href")} class="astro-QTHG7GS4">
            <h3 class="astro-QTHG7GS4">${cats.name}</h3>
            </a>
        </li>`)}
    </ul>
    <ul class="page-nav astro-QTHG7GS4">
            <li class="astro-QTHG7GS4">
                <a${addAttribute("../about", "href")} class="astro-QTHG7GS4">
                    <h3 class="astro-QTHG7GS4">   
                        About Us
                    </h3>
                </a>
            </li>
            <li class="astro-QTHG7GS4">
                <a${addAttribute("../ebooks", "href")} class="astro-QTHG7GS4">
                    <h3 class="astro-QTHG7GS4">   
                        eBooks
                    </h3>
                </a>
            </li>
            <li class="astro-QTHG7GS4">
                <a${addAttribute("../contactus", "href")} class="astro-QTHG7GS4">
                    <h3 class="astro-QTHG7GS4">   
                        Contact Us
                    </h3>
                </a>
            </li>
            <li class="astro-QTHG7GS4">
                <a${addAttribute("../recipes", "href")} class="astro-QTHG7GS4">
                    <h3 class="astro-QTHG7GS4">   
                        Recipes
                    </h3>
                </a>
            </li>
    <ul class="social-nav astro-QTHG7GS4">
        <li class="astro-QTHG7GS4">
            ${renderComponent($$result, "Icon", $$Icon, { "name": "ri:facebook-box-fill", "class": "astro-QTHG7GS4" })}
        </li>
        <li class="astro-QTHG7GS4">
            ${renderComponent($$result, "Icon", $$Icon, { "name": "mdi:instagram", "class": "astro-QTHG7GS4" })}
        </li>
        <li class="astro-QTHG7GS4">
            ${renderComponent($$result, "Icon", $$Icon, { "name": "mdi:search", "class": "astro-QTHG7GS4" })}
        </li>
    </ul>
    </ul>
</nav>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/headerNav.astro");

const $$Astro$t = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/footerNav.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$FooterNav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$FooterNav;
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const prodCategories = categories.items.map((item) => {
    const { name, footerNav } = item.fields;
    return {
      name,
      footerNav
    };
  });
  return renderTemplate`${maybeRenderHead($$result)}<nav class="footer-nav astro-HTCCHRMT">
  <div class="logo astro-HTCCHRMT">${renderComponent($$result, "Logo", $$Logo, { "class": "astro-HTCCHRMT" })}</div>
    <ul class="astro-HTCCHRMT">
        ${prodCategories.map((cats) => cats.footerNav && renderTemplate`<li class="astro-HTCCHRMT">
              <a${addAttribute(`/our-range/${cats.name}/`, "href")} class="astro-HTCCHRMT">
              <h3 class="astro-HTCCHRMT">${cats.name}</h3>
              
              </a>
          </li>`)}
    </ul>
</nav>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/footerNav.astro");

const $$Astro$s = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/copyright.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Copyright = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$Copyright;
  return renderTemplate`${maybeRenderHead($$result)}<div class="copyright-wrapper astro-2226LSYZ">
    <div class="copyright astro-2226LSYZ">
        <p class="astro-2226LSYZ">© Simplot Australia Pty Ltd. All rights reserved.</p>
    </div>
</div>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/copyright.astro");

var __freeze$5 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$5(cooked, "raw", { value: __freeze$5(raw || cooked.slice()) }));
var _a$5;
const $$Astro$r = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/layouts/Layout.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$Layout;
  const { pageTitle } = Astro2.props;
  return renderTemplate(_a$5 || (_a$5 = __template$5(['<html lang="en" class="astro-NX2FWRR5">\n  <head>\n    <meta charset="utf-8">\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n    <meta name="viewport" content="width=device-width">\n    <meta name="generator"', '>\n	<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">\n	<!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"> -->\n    <title>', "</title>\n  ", '</head>\n  <body class="astro-NX2FWRR5">\n	<header class="wrapper header-nav astro-NX2FWRR5">\n		', '\n	</header>\n	<main class="astro-NX2FWRR5">	\n		<div class="wrapper main-container astro-NX2FWRR5">	\n			', '	\n		</div>\n    </main>\n	<footer class="wrapper footer-nav astro-NX2FWRR5">\n		', "\n		", '\n	</footer>\n	<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"><\/script> -->\n  \n\n</body></html>'])), addAttribute(Astro2.generator, "content"), pageTitle, renderHead($$result), renderComponent($$result, "HeaderNav", $$HeaderNav, { "class": "astro-NX2FWRR5" }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "FooterNav", $$FooterNav, { "class": "astro-NX2FWRR5" }), renderComponent($$result, "Copyright", $$Copyright, { "class": "astro-NX2FWRR5" }));
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/layouts/Layout.astro");

const $$Astro$q = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/homehero.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Homehero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$Homehero;
  return renderTemplate`${maybeRenderHead($$result)}<img src="https://simplot-media.azureedge.net/-/media/project/sapl/brands/australia/iandj/images/ij-background-jpg.jpg?h=312&iar=0&w=820&rev=4b7aae4681c34609baa616d1eb61f335&hash=25F5C45A4620C54D17F856CB062E9001" alt="logo" class="full-width astro-WJVETA7W">`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/homehero.astro");

const $$Astro$p = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/CategoryCards.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$CategoryCards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$CategoryCards;
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const cardCategories = categories.items.map((item) => {
    const { name, description, imageUrl, displayCard } = item.fields;
    return {
      name,
      description,
      imageUrl,
      displayCard
    };
  });
  return renderTemplate`${maybeRenderHead($$result)}<div class="card-wrapper astro-UMM4R3BH">
${cardCategories.map((card) => card.displayCard && renderTemplate`<div class="card astro-UMM4R3BH"> 
      <a${addAttribute(`/our-range/${card.name}/`, "href")} class="astro-UMM4R3BH">
      <!-- <a href={\`/our-range/\${slugify(card.name)}/\`}> -->
      <h2 class="astro-UMM4R3BH">${card.name}</h2>
      <p class="astro-UMM4R3BH">${card.description}</p>
      <div class="image-wrapper astro-UMM4R3BH">
        <img${addAttribute(card.imageUrl, "src")}${addAttribute(card.name, "alt")} class="astro-UMM4R3BH">
      </div>
      </a>
    </div>`)}
</div>


`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/CategoryCards.astro");

const $$Astro$o = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/index.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Index$3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$Index$3;
  const pageTitle = "I and J";
  return renderTemplate`<title>${pageTitle}</title>

${renderComponent($$result, "Layout", $$Layout, { "class": "astro-2JJ7ZYIT" }, { "default": () => renderTemplate`${renderComponent($$result, "Homehero", $$Homehero, { "class": "astro-2JJ7ZYIT" })}${renderComponent($$result, "CategoryCards", $$CategoryCards, { "class": "astro-2JJ7ZYIT" })}` })}



`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/index.astro");

const $$file$8 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/index.astro";
const $$url$8 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$3,
  file: $$file$8,
  url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(raw || cooked.slice()) }));
var _a$4;
const $$Astro$n = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Accordion.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Accordion = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$Accordion;
  return renderTemplate(_a$4 || (_a$4 = __template$4(["", '<div class="accordion astro-3WOKX5CT">\n  <ul class="accordion__wrapper astro-3WOKX5CT">\n    ', `
  </ul>
</div>

<script type="module">
  // variables
  const accordionItems = [...document.querySelectorAll('.accordion__item')]

  // functions
  const getPanelHeight = accordionItem => {
    const accordionInner = accordionItem.querySelector('.panel__inner')
    return accordionInner.getBoundingClientRect().height
  }

  const openAccordionItem = accordionItem => {
    const accordionItemHeader = accordionItem.querySelector('.accordion__header')
    const accordionToggleIndicator = accordionItem.querySelector('.header__toggle-indicator')
    const accordionPanel = accordionItem.querySelector('.accordion__panel')

    accordionPanel.style.height = \`\${getPanelHeight(accordionItem)}px\`
    accordionItem.classList.add('is-active')
    accordionItemHeader.setAttribute('aria-expanded', true)
    accordionToggleIndicator.innerHTML = \`<svg class="header__toggle-indicator" aria-hidden="true" data-prefix="fas" data-icon="minus" class="svg-inline--fa fa-minus fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>\`
  }

  const closeAccordionItem = accordionItem => {
    const accordionItemHeader = accordionItem.querySelector('.accordion__header')
    const accordionToggleIndicator = accordionItem.querySelector('.header__toggle-indicator')
    const accordionPanel = accordionItem.querySelector('.accordion__panel')

    accordionItem.classList.remove('is-active')
    accordionPanel.style.height = 0
    accordionItemHeader.focus()
    accordionItemHeader.setAttribute('aria-expanded', false)
    accordionToggleIndicator.innerHTML = \`<svg class="header__toggle-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>\`
  }

  const isAccordionOpen = accordionItem => {
    return accordionItem.classList.contains('is-active')
  }

  function toggleAccordionItem () {
    const accordionItem = event.target.closest('.accordion__item')
    if (!accordionItem || event.target.closest('.accordion__panel')) return

    isAccordionOpen(accordionItem)
      ? closeAccordionItem(accordionItem)
      : openAccordionItem(accordionItem)
  }

  function recalculateHeight () {
    const toggledAccordionItems = accordionItems.filter(element => element.classList.contains('is-active'))

    toggledAccordionItems.forEach(toggledAccordionItem => {
      const accordionPanel = toggledAccordionItem.querySelector('.accordion__panel')
      accordionPanel.style.height = \`\${getPanelHeight(toggledAccordionItem)}px\`
    })
  }

  // execution
  accordionItems.forEach((item, index) => {
    const accordionItemHeader = item.querySelector('.accordion__header')
    const accordionItemPanel = item.querySelector('.accordion__panel')

    accordionItemHeader.setAttribute('id', \`accordion-item\${index + 1}\`)
    accordionItemPanel.setAttribute('id', \`item\${index + 1}\`)

    accordionItemHeader.setAttribute('aria-controls', \`item\${index + 1}\`)
    accordionItemPanel.setAttribute('aria-labelledby', \`accordion-item\${index + 1}\`)
  })

  document.addEventListener('keydown', event => {
    const accordionItem = event.target.closest('.accordion__item')

    if (event.key !== 'Escape') return
    if (!accordionItem) return

    if (isAccordionOpen(accordionItem)) {
      closeAccordionItem(accordionItem)
    }
  })

  document.addEventListener('keydown', event => {
    if (!event.target.closest('.accordion__header')) return

    const accordionWrapper = event.target.closest('.accordion__wrapper')
    const accordionItem = event.target.closest('.accordion__item')
    const accordionItems = [...accordionWrapper.querySelectorAll('.accordion__item')]
    const index = accordionItems.findIndex(element => element === accordionItem)

    const { key } = event

    let targetItem

    if (key === 'ArrowDown') {
      targetItem = accordionItems[index + 1]
    }

    if (key === 'ArrowUp') {
      targetItem = accordionItems[index - 1]
    }

    if (targetItem) {
      event.preventDefault()
      targetItem.querySelector('.accordion__header').focus()
    }
  })

  window.toggleAccordionItem = toggleAccordionItem
  window.onresize = recalculateHeight
<\/script>

`], ["", '<div class="accordion astro-3WOKX5CT">\n  <ul class="accordion__wrapper astro-3WOKX5CT">\n    ', `
  </ul>
</div>

<script type="module">
  // variables
  const accordionItems = [...document.querySelectorAll('.accordion__item')]

  // functions
  const getPanelHeight = accordionItem => {
    const accordionInner = accordionItem.querySelector('.panel__inner')
    return accordionInner.getBoundingClientRect().height
  }

  const openAccordionItem = accordionItem => {
    const accordionItemHeader = accordionItem.querySelector('.accordion__header')
    const accordionToggleIndicator = accordionItem.querySelector('.header__toggle-indicator')
    const accordionPanel = accordionItem.querySelector('.accordion__panel')

    accordionPanel.style.height = \\\`\\\${getPanelHeight(accordionItem)}px\\\`
    accordionItem.classList.add('is-active')
    accordionItemHeader.setAttribute('aria-expanded', true)
    accordionToggleIndicator.innerHTML = \\\`<svg class="header__toggle-indicator" aria-hidden="true" data-prefix="fas" data-icon="minus" class="svg-inline--fa fa-minus fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>\\\`
  }

  const closeAccordionItem = accordionItem => {
    const accordionItemHeader = accordionItem.querySelector('.accordion__header')
    const accordionToggleIndicator = accordionItem.querySelector('.header__toggle-indicator')
    const accordionPanel = accordionItem.querySelector('.accordion__panel')

    accordionItem.classList.remove('is-active')
    accordionPanel.style.height = 0
    accordionItemHeader.focus()
    accordionItemHeader.setAttribute('aria-expanded', false)
    accordionToggleIndicator.innerHTML = \\\`<svg class="header__toggle-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>\\\`
  }

  const isAccordionOpen = accordionItem => {
    return accordionItem.classList.contains('is-active')
  }

  function toggleAccordionItem () {
    const accordionItem = event.target.closest('.accordion__item')
    if (!accordionItem || event.target.closest('.accordion__panel')) return

    isAccordionOpen(accordionItem)
      ? closeAccordionItem(accordionItem)
      : openAccordionItem(accordionItem)
  }

  function recalculateHeight () {
    const toggledAccordionItems = accordionItems.filter(element => element.classList.contains('is-active'))

    toggledAccordionItems.forEach(toggledAccordionItem => {
      const accordionPanel = toggledAccordionItem.querySelector('.accordion__panel')
      accordionPanel.style.height = \\\`\\\${getPanelHeight(toggledAccordionItem)}px\\\`
    })
  }

  // execution
  accordionItems.forEach((item, index) => {
    const accordionItemHeader = item.querySelector('.accordion__header')
    const accordionItemPanel = item.querySelector('.accordion__panel')

    accordionItemHeader.setAttribute('id', \\\`accordion-item\\\${index + 1}\\\`)
    accordionItemPanel.setAttribute('id', \\\`item\\\${index + 1}\\\`)

    accordionItemHeader.setAttribute('aria-controls', \\\`item\\\${index + 1}\\\`)
    accordionItemPanel.setAttribute('aria-labelledby', \\\`accordion-item\\\${index + 1}\\\`)
  })

  document.addEventListener('keydown', event => {
    const accordionItem = event.target.closest('.accordion__item')

    if (event.key !== 'Escape') return
    if (!accordionItem) return

    if (isAccordionOpen(accordionItem)) {
      closeAccordionItem(accordionItem)
    }
  })

  document.addEventListener('keydown', event => {
    if (!event.target.closest('.accordion__header')) return

    const accordionWrapper = event.target.closest('.accordion__wrapper')
    const accordionItem = event.target.closest('.accordion__item')
    const accordionItems = [...accordionWrapper.querySelectorAll('.accordion__item')]
    const index = accordionItems.findIndex(element => element === accordionItem)

    const { key } = event

    let targetItem

    if (key === 'ArrowDown') {
      targetItem = accordionItems[index + 1]
    }

    if (key === 'ArrowUp') {
      targetItem = accordionItems[index - 1]
    }

    if (targetItem) {
      event.preventDefault()
      targetItem.querySelector('.accordion__header').focus()
    }
  })

  window.toggleAccordionItem = toggleAccordionItem
  window.onresize = recalculateHeight
<\/script>

`])), maybeRenderHead($$result), renderSlot($$result, $$slots["default"]));
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Accordion.astro");

const $$Astro$m = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/AccordionItem.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$AccordionItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$AccordionItem;
  const { header } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li class="accordion__item">
  <h3>
    <button id="accordion-header-1" class="accordion__header" aria-expanded="false" aria-controls="accordion-panel-1" onclick="toggleAccordionItem()">
      ${header}
      <svg class="header__toggle-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
      </svg>
    </button>
  </h3>
  <div id="accordion-panel-1" role="region" class="accordion__panel" aria-labelledby="accordion-header-1">
    <div class="panel__inner">
      ${renderSlot($$result, $$slots["default"])}
    </div>
  </div>
</li>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/AccordionItem.astro");

const $$Astro$l = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Breadcrumbs.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Breadcrumbs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  return renderTemplate`${maybeRenderHead($$result)}<nav class="breadcrumbs" aria-label="Breadcrumbs">
  <ol>
    ${renderSlot($$result, $$slots["default"])}
  </ol>
</nav>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Breadcrumbs.astro");

const $$Astro$k = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/BreadcrumbsItem.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$BreadcrumbsItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$BreadcrumbsItem;
  const {
    href = "#",
    label = "Breadcrumb",
    currentPage = false
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li class="breadcrumbs__item">
  ${currentPage ? renderTemplate`<span>${label}</span>` : renderTemplate`<a${addAttribute(href, "href")}>${label}</a>`}
</li>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/BreadcrumbsItem.astro");

const $$Astro$j = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Card.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    url = "#",
    img = "https://fakeimg.pl/640x360",
    title = "Default title",
    footer = "Your name"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="card">
  <div class="card__image">
    <img${addAttribute(img, "src")} alt="">
  </div>
  <div class="card__content">
    <h3>
      <a${addAttribute(url, "href")}>${title}</a>
    </h3>
    <p>
      ${renderSlot($$result, $$slots["default"], renderTemplate`Default description.`)}
    </p>
    <small>
      ${footer}
    </small>
  </div>
</div>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Card.astro");

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro$i = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/DarkMode.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$DarkMode = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$DarkMode;
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", `<button class="darkmode-toggle" aria-pressed="false" aria-label="Enable dark mode">
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3z"></path></svg>
</button>

<script>
  // variables
  let darkMode = localStorage.getItem('darkMode')
  const darkModeToggle = document.querySelector('.darkmode-toggle')

  // functions
  const enableDarkMode = () => {
    document.body.classList.add('darkmode')
    darkModeToggle.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 3a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0V3zM5.707 4.293a1 1 0 0 0-1.414 1.414l1 1a1 1 0 0 0 1.414-1.414l-1-1zm14 0a1 1 0 0 0-1.414 0l-1 1a1 1 0 0 0 1.414 1.414l1-1a1 1 0 0 0 0-1.414zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-9 4a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H3zm17 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1zM6.707 18.707a1 1 0 1 0-1.414-1.414l-1 1a1 1 0 1 0 1.414 1.414l1-1zm12-1.414a1 1 0 0 0-1.414 1.414l1 1a1 1 0 0 0 1.414-1.414l-1-1zM13 20a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0v-1z" fill="currentColor"/></svg>\`
    darkModeToggle.setAttribute('aria-pressed', 'true')
    darkModeToggle.setAttribute('aria-label', 'Disable dark mode')
    localStorage.setItem('darkMode', 'enabled')
  }

  const disableDarkMode = () => {
    document.body.classList.remove('darkmode')
    darkModeToggle.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3z"/></svg>\`
    darkModeToggle.setAttribute('aria-pressed', 'false')
    darkModeToggle.setAttribute('aria-label', 'Enable dark mode')
    localStorage.setItem('darkMode', null)
  }

  // execution
  if (darkMode === 'enabled') enableDarkMode()

  darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode')

    darkMode !== 'enabled'
      ? enableDarkMode()
      : disableDarkMode()
  })
<\/script>`], ["", `<button class="darkmode-toggle" aria-pressed="false" aria-label="Enable dark mode">
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3z"></path></svg>
</button>

<script>
  // variables
  let darkMode = localStorage.getItem('darkMode')
  const darkModeToggle = document.querySelector('.darkmode-toggle')

  // functions
  const enableDarkMode = () => {
    document.body.classList.add('darkmode')
    darkModeToggle.innerHTML = \\\`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 3a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0V3zM5.707 4.293a1 1 0 0 0-1.414 1.414l1 1a1 1 0 0 0 1.414-1.414l-1-1zm14 0a1 1 0 0 0-1.414 0l-1 1a1 1 0 0 0 1.414 1.414l1-1a1 1 0 0 0 0-1.414zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm-9 4a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H3zm17 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1zM6.707 18.707a1 1 0 1 0-1.414-1.414l-1 1a1 1 0 1 0 1.414 1.414l1-1zm12-1.414a1 1 0 0 0-1.414 1.414l1 1a1 1 0 0 0 1.414-1.414l-1-1zM13 20a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0v-1z" fill="currentColor"/></svg>\\\`
    darkModeToggle.setAttribute('aria-pressed', 'true')
    darkModeToggle.setAttribute('aria-label', 'Disable dark mode')
    localStorage.setItem('darkMode', 'enabled')
  }

  const disableDarkMode = () => {
    document.body.classList.remove('darkmode')
    darkModeToggle.innerHTML = \\\`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3z"/></svg>\\\`
    darkModeToggle.setAttribute('aria-pressed', 'false')
    darkModeToggle.setAttribute('aria-label', 'Enable dark mode')
    localStorage.setItem('darkMode', null)
  }

  // execution
  if (darkMode === 'enabled') enableDarkMode()

  darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode')

    darkMode !== 'enabled'
      ? enableDarkMode()
      : disableDarkMode()
  })
<\/script>`])), maybeRenderHead($$result));
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/DarkMode.astro");

const $$Astro$h = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Media.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Media = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Media;
  const {
    classes = null,
    src = "https://shorturl.at/tCPS2",
    alt = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(classes, "class")}${addAttribute(src, "src")}${addAttribute(alt, "alt")} loading="lazy">`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Media.astro");

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$g = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Modal.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Modal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$Modal;
  const {
    triggerId,
    title,
    closeText = "Close"
  } = Astro2.props;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<div class="modal" role="dialog"', '>\n  <div class="modal__inner">\n    <div class="modal__content">\n      <h3 tabindex="-1">\n        ', "\n      </h3>\n      ", '\n    </div>\n    <div class="modal__close">\n      <button>', `</button>
    </div>
  </div>
</div>

<script type="module">
  // variables
  const body = document.querySelector('body')
  const modal = document.querySelector('.modal')
  const modalId = modal.getAttribute('aria-labelledby')
  const modalCloseButton = modal.querySelector('.modal__close button')
  const modalTrigger = document.querySelector(\`#\${modalId}\`)
  
  // functions
  const teleportToRoot = element => {
    element.remove()
    body.appendChild(element)
  }

  const getKeyboardFocusableElements = element => {
    return [...element.querySelectorAll(
      'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )]
      .filter(el => !el.hasAttribute('disabled'))
  }

  const trapFocus = event => {
    const focusables = getKeyboardFocusableElements(modal)
    const firstFocusable = focusables[0]
    const lastFocusable = focusables[focusables.length - 1]

    if (document.activeElement === lastFocusable && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusable.focus()
    }

    if (document.activeElement === firstFocusable && event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusable.focus()
    }
  }

  const openModal = _ => {
    const modalTitle = modal.querySelector('h3')

    modal.classList.add('show')
    body.classList.add('modal-is-active')
    modalTitle.focus()
    document.addEventListener('keydown', trapFocus)

    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeModal()
      }
    })
  }

  const closeModal = _ => {
    modal.classList.remove('show')
    body.classList.remove('modal-is-active')
    modalTrigger.focus({ preventScroll: true })
    document.removeEventListener('keydown', trapFocus)
  }

  // execution
  teleportToRoot(modal)

  modalTrigger.addEventListener('click', openModal)

  modalCloseButton.addEventListener('click', closeModal)

  modal.addEventListener('click', event => { 
    if (!event.target.closest('.modal__content')) {
      closeModal()
    }
  })

  window.closeModal = closeModal
<\/script>

`], ["", '<div class="modal" role="dialog"', '>\n  <div class="modal__inner">\n    <div class="modal__content">\n      <h3 tabindex="-1">\n        ', "\n      </h3>\n      ", '\n    </div>\n    <div class="modal__close">\n      <button>', `</button>
    </div>
  </div>
</div>

<script type="module">
  // variables
  const body = document.querySelector('body')
  const modal = document.querySelector('.modal')
  const modalId = modal.getAttribute('aria-labelledby')
  const modalCloseButton = modal.querySelector('.modal__close button')
  const modalTrigger = document.querySelector(\\\`#\\\${modalId}\\\`)
  
  // functions
  const teleportToRoot = element => {
    element.remove()
    body.appendChild(element)
  }

  const getKeyboardFocusableElements = element => {
    return [...element.querySelectorAll(
      'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )]
      .filter(el => !el.hasAttribute('disabled'))
  }

  const trapFocus = event => {
    const focusables = getKeyboardFocusableElements(modal)
    const firstFocusable = focusables[0]
    const lastFocusable = focusables[focusables.length - 1]

    if (document.activeElement === lastFocusable && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusable.focus()
    }

    if (document.activeElement === firstFocusable && event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusable.focus()
    }
  }

  const openModal = _ => {
    const modalTitle = modal.querySelector('h3')

    modal.classList.add('show')
    body.classList.add('modal-is-active')
    modalTitle.focus()
    document.addEventListener('keydown', trapFocus)

    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeModal()
      }
    })
  }

  const closeModal = _ => {
    modal.classList.remove('show')
    body.classList.remove('modal-is-active')
    modalTrigger.focus({ preventScroll: true })
    document.removeEventListener('keydown', trapFocus)
  }

  // execution
  teleportToRoot(modal)

  modalTrigger.addEventListener('click', openModal)

  modalCloseButton.addEventListener('click', closeModal)

  modal.addEventListener('click', event => { 
    if (!event.target.closest('.modal__content')) {
      closeModal()
    }
  })

  window.closeModal = closeModal
<\/script>

`])), maybeRenderHead($$result), addAttribute(triggerId, "aria-labelledby"), title, renderSlot($$result, $$slots["default"], renderTemplate`Modal description.`), closeText);
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Modal.astro");

const $$Astro$f = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Notification.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Notification = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Notification;
  const {
    type = "default",
    role = "none",
    ariaLive = "off"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`notification type-${type}`, "class")}${addAttribute(role, "role")}${addAttribute(ariaLive, "aria-live")}>
  ${renderSlot($$result, $$slots["default"], renderTemplate`
    <p><strong>Message:</strong> This is a notification!</p>
  `)}
</div>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Notification.astro");

const $$Astro$e = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Pagination.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Pagination;
  const {
    firstPage = "#",
    previousPage = "#",
    nextPage = "#",
    lastPage = "#",
    currentPage = "1",
    totalPages = "12"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<nav class="pagination" aria-label="Pagination">
  <ul class="pagination__list">
    <li>
      ${firstPage ? renderTemplate`<a${addAttribute(firstPage, "href")} aria-label="Go to the first page"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.6667 9L18 15.6667L24.6667 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.6667 9L8 15.6667L14.6667 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>` : renderTemplate`<span class="disabled"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.6667 9L18 15.6667L24.6667 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.6667 9L8 15.6667L14.6667 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>`}
    </li>
    <li>
      ${previousPage ? renderTemplate`<a${addAttribute(previousPage, "href")}${addAttribute(`Go back to ${previousPage}`, "aria-label")}><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 7-5 5 5 5"></path></svg></a>` : renderTemplate`<span class="disabled"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 7-5 5 5 5"></path></svg></span>`}
    </li>
    <li>
      <span>Page ${currentPage} of ${totalPages}</span>
    </li>
    <li>
      ${nextPage ? renderTemplate`<a${addAttribute(nextPage, "href")}${addAttribute(`Go to ${nextPage}`, "aria-label")}><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 7 5 5-5 5"></path></svg></a>` : renderTemplate`<span class="disabled"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 7 5 5-5 5"></path></svg></span>`}
    </li>
    <li>
      ${lastPage ? renderTemplate`<a${addAttribute(lastPage, "href")} aria-label="Go to the last page"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.33333 9L14 15.6667L7.33333 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3333 9L24 15.6667L17.3333 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>` : renderTemplate`<span class="disabled"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.33333 9L14 15.6667L7.33333 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.3333 9L24 15.6667L17.3333 22.3333" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>`}
    </li>
  </ul>
</nav>

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/Pagination.astro");

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$d = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/SkipLinks.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$SkipLinks = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$SkipLinks;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<div class="skip-links">
  <a href="#main-content">Skip to main content</a>
</div>

<script type="module">
  // variables
  const skipLink = document.querySelector('.skip-links a')

  // execution
  skipLink.addEventListener('keydown', event => {
    if (!event.target.closest('a')) return
    const key = event.key

    if (key !== 'Enter') return
    event.preventDefault()
    const target = event.target.getAttribute('href')

    if (document.querySelector(target)) {
      const targetElement = document.querySelector(target)
      targetElement.setAttribute('tabindex', '-1')
      targetElement.focus()
    } else if (!document.querySelector(target) && document.querySelector('h1')) {
      const h1 = document.querySelector('h1')
      h1.setAttribute('tabindex', '-1')
      h1.focus()
    } else {
      console.warn('SkipLinks are not set, either missing an h1 or main content id on the page.')
    }
  })
<\/script>

`])), maybeRenderHead($$result));
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/accessible-astro-components/SkipLinks.astro");

const $$Astro$c = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/title.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Title = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Title;
  const { pageTitle = "Page Title", usebgImage = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute([["title-wrapper", { "title-bg": usebgImage }], "astro-BQDUPTEM"], "class:list")}>
    <h1 class="astro-BQDUPTEM">${pageTitle}</h1>
</div>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/title.astro");

const $$Astro$b = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/contactus.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Contactus = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Contactus;
  const pageTitle = "Contact Us";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "class": "astro-WM2FJO5P" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, { "class": "astro-WM2FJO5P" }, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home", "class": "astro-WM2FJO5P" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": pageTitle, "class": "astro-WM2FJO5P" })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": pageTitle, "class": "astro-WM2FJO5P" })}${maybeRenderHead($$result)}<h4 class="astro-WM2FJO5P">
    We really are humbled by your feedback, it keeps us inspired to do our very best!<br class="astro-WM2FJO5P">
    If there is something you’d like to share with us please fill out the form below.
  </h4><h4 class="astro-WM2FJO5P">
    <span class="astro-WM2FJO5P">
      SEND ENQUIRY
    </span>
  </h4><div class="form-wrapper astro-WM2FJO5P">
    <form action="" method="POST" style="display:block;" class="astro-WM2FJO5P">
      <input type="hidden" name="captcha_settings" value="{&quot;keyname&quot;:&quot;SAPL&quot;,&quot;fallback&quot;:&quot;true&quot;,&quot;orgId&quot;:&quot;00D60000000J7C2&quot;,&quot;ts&quot;:&quot;&quot;}" class="astro-WM2FJO5P">
      <input type="hidden" name="orgid" value="00D60000000J7C2" class="astro-WM2FJO5P">
      <input type="hidden" name="retURL" value="https://IandJ.com.au/contact-us/thank-you" class="astro-WM2FJO5P">
      <input type="hidden" name="recordType" name="recordType" value="0125x000000EAXG" class="astro-WM2FJO5P">
      <input type="hidden" name="00N5x00000F5Vqo" name="00N5x00000F5Vqo" value="IandJ" class="astro-WM2FJO5P">
    
      <div class="form-group my-4 astro-WM2FJO5P">
          <label for="00N5x00000F5VrW" class="astro-WM2FJO5P">Title</label>
        <select class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5VrW" name="00N5x00000F5VrW" title="Title">
          <option value="" class="astro-WM2FJO5P">Please Select</option>
          <option value="Dr" class="astro-WM2FJO5P">Dr</option>
          <option value="Master" class="astro-WM2FJO5P">Master</option>
          <option value="Miss" class="astro-WM2FJO5P">Miss</option>
          <option value="Mr" class="astro-WM2FJO5P">Mr</option>
          <option value="Mrs" class="astro-WM2FJO5P">Mrs</option>
          <option value="Ms" class="astro-WM2FJO5P">Ms</option>
          <option value="Prof" class="astro-WM2FJO5P">Prof</option>
        </select>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vr1" class="astro-WM2FJO5P">First Name *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vr1" maxlength="32" name="00N5x00000F5Vr1" size="20" type="text" required>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5VrS" class="astro-WM2FJO5P">Last Name *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5VrS" maxlength="32" name="00N5x00000F5VrS" size="20" type="text" required>
      </div>
    
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5VrO" class="astro-WM2FJO5P">Street Address *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5VrO" maxlength="255" name="00N5x00000F5VrO" size="20" type="text" required>
      </div>
    
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vqf" class="astro-WM2FJO5P">City *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vqf" maxlength="255" name="00N5x00000F5Vqf" size="20" type="text" required>
      </div>
    
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5VrN" class="astro-WM2FJO5P">State *:</label>
        <select class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5VrN" name="00N5x00000F5VrN" title="State" required>
          <option value="" class="astro-WM2FJO5P">Please Select</option>
          <option value="ACT" class="astro-WM2FJO5P">ACT</option>
          <option value="NSW" class="astro-WM2FJO5P">NSW</option>
          <option value="NT" class="astro-WM2FJO5P">NT</option>
          <option value="QLD" class="astro-WM2FJO5P">QLD</option>
          <option value="SA" class="astro-WM2FJO5P">SA</option>
          <option value="TAS" class="astro-WM2FJO5P">TAS</option>
          <option value="VIC" class="astro-WM2FJO5P">VIC</option>
          <option value="WA" class="astro-WM2FJO5P">WA</option>
          <option value="Other" class="astro-WM2FJO5P">Other</option>
        </select>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vqk" class="astro-WM2FJO5P">Country (if outside Australia)</label>
        <select class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vqk" name="00N5x00000F5Vqk" title="Country" required>
          <option selected="selected" value="Australia" class="astro-WM2FJO5P">Australia</option>
          <option value="New Zealand" class="astro-WM2FJO5P">New Zealand</option>
          <option value="Italy" class="astro-WM2FJO5P">Italy</option>
          <option value="Japan" class="astro-WM2FJO5P">Japan</option>
          <option value="United Kingdom" class="astro-WM2FJO5P">United Kingdom</option>
          <option value="USA" class="astro-WM2FJO5P">USA</option>
          <option value="Other" class="astro-WM2FJO5P">Other</option>
        </select>
      </div>
    
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vr7" class="astro-WM2FJO5P">Postcode *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vr7" maxlength="10" name="00N5x00000F5Vr7" size="20" type="text" required>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vr0" class="astro-WM2FJO5P">Phone</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vr0" maxlength="40" name="00N5x00000F5Vr0" size="20" type="text">
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="00N5x00000F5Vqr" class="astro-WM2FJO5P">Email *</label>
        <input class="form-control form-control-lg astro-WM2FJO5P" id="00N5x00000F5Vqr" maxlength="80" name="00N5x00000F5Vqr" size="20" type="email" required>
      </div>
    
      <div class="form-group my-4 astro-WM2FJO5P">
        <label for="subject" class="astro-WM2FJO5P">Category of Feedback</label>
        <select class="form-control form-control-lg astro-WM2FJO5P" id="subject" name="subject" title="Subject">
          <option value=" " class="astro-WM2FJO5P">Please Select</option>
          <option value="Employment" class="astro-WM2FJO5P">Employment</option>
          <option value="Food Service" class="astro-WM2FJO5P">Food Service</option>
          <option value="Product Information" class="astro-WM2FJO5P">Product Information</option>
          <option value="Recipe Club" class="astro-WM2FJO5P">Recipe Club</option>
          <option value="Other" class="astro-WM2FJO5P">Other</option>
        </select>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
          <label for="description" class="astro-WM2FJO5P">Comments *</label>
          <textarea class="form-control form-control-lg astro-WM2FJO5P" id="description" name="description" rows="3" required></textarea>
      </div>
      <div class="form-group my-4 astro-WM2FJO5P">
        <input type="hidden" id="external" name="external" value="1" class="astro-WM2FJO5P">
        <div class="g-recaptcha astro-WM2FJO5P" data-sitekey="6LeVpikfAAAAAHhJtANKXpShaSTUv3K-JGn0-wX0" data-callback="enableFormBtn" data-expired-callback="disableFormBtn" data-error-callback="disableFormBtn"></div>
      </div>
    
      <input type="submit" class="btn btn-primary astro-WM2FJO5P" name="submit" disabled="disabled">
    
      </form>
  </div>` })}

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/contactus.astro");

const $$file$7 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/contactus.astro";
const $$url$7 = "/contactus";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contactus,
  file: $$file$7,
  url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$a = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/CatCards.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$CatCards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$CatCards;
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const cardCategories = categories.items.map((item) => {
    const { name, description, imageUrl, displayCard } = item.fields;
    return {
      name,
      description,
      imageUrl,
      displayCard
    };
  });
  return renderTemplate`${maybeRenderHead($$result)}<div class="card-wrapper astro-MXCZGLKE">
${cardCategories.map((card) => card.displayCard && renderTemplate`<div class="card astro-MXCZGLKE"> 
      <a${addAttribute(`/our-range/${card.name}/`, "href")} class="astro-MXCZGLKE">
      <h2 class="astro-MXCZGLKE">${card.name}</h2>
      <div class="image-wrapper astro-MXCZGLKE">
        <img${addAttribute(card.imageUrl, "src")}${addAttribute(card.name, "alt")} class="astro-MXCZGLKE">
      </div>
      </a>
    </div>`)}
</div>


`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/CatCards.astro");

const $$Astro$9 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/index.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Index$2;
  const pageTitle = "Our Range";
  const usebgImage = false;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pageTitle": pageTitle }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, {}, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": pageTitle })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": pageTitle, "usebgImage": usebgImage })}${renderComponent($$result, "CatCards", $$CatCards, {})}` })}`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/index.astro");

const $$file$6 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/index.astro";
const $$url$6 = "/our-range";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$8 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/SubCatCards.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$SubCatCards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$SubCatCards;
  const { category } = Astro2.props;
  const subcategories = await contentfulClient.getEntries({
    content_type: "subcategory"
  });
  const filteredSubCat = subcategories.items.filter((cat) => cat.fields.parentCategory === category);
  return renderTemplate`${maybeRenderHead($$result)}<div class="card-wrapper astro-OIGVFCPG">
${filteredSubCat.map((card) => card.fields.displayCard && renderTemplate`<div class="card astro-OIGVFCPG"> 
      <a${addAttribute(`/our-range/${card.fields.parentCategory}/${card.fields.name}/`, "href")} class="astro-OIGVFCPG">
      <h2 class="astro-OIGVFCPG">${card.fields.name}</h2>
      <div class="image-wrapper astro-OIGVFCPG">
        <img${addAttribute(card.fields.imageUrl, "src")}${addAttribute(card.fields.name, "alt")} class="astro-OIGVFCPG">
      </div>
      </a>
    </div>`)}
</div>


`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/SubCatCards.astro");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const $$Astro$7 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/index.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
async function getStaticPaths$2() {
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const prodCategories = categories.items.map((item) => ({
    params: { category: item.fields.name },
    props: { category: item.fields.name }
  }));
  return prodCategories;
}
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Index$1;
  const { category } = Astro2.props;
  const categories = await contentfulClient.getEntries({
    content_type: "category"
  });
  const cardCategories = categories.items.map((item) => {
    const { name, displayCard } = item.fields;
    return {
      name,
      displayCard
    };
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pageTitle": "Our Range | I&J", "class": "astro-5MQV6DR2" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, { "class": "astro-5MQV6DR2" }, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home", "class": "astro-5MQV6DR2" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": category, "class": "astro-5MQV6DR2" })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": "Our Range", "class": "astro-5MQV6DR2" })}${maybeRenderHead($$result)}<div class="catnav-mobile astro-5MQV6DR2">
    <select class="astro-5MQV6DR2">
      ${cardCategories.map((card) => card.displayCard && renderTemplate`<option value="..\\${slugify(card.name)}" selected="" class="astro-5MQV6DR2">${card.name}</option>`)}
    </select>
  </div><div class="catnav-desktop astro-5MQV6DR2">
    ${cardCategories.map((card) => card.displayCard && renderTemplate`<a href="..\\${slugify(card.name)}" class="astro-5MQV6DR2">
      <p class="astro-5MQV6DR2">${card.name}</p>
    </a>`)}
  </div>${renderComponent($$result, "SubCatCards", $$SubCatCards, { "category": category, "class": "astro-5MQV6DR2" })}` })}`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/index.astro");

const $$file$5 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/index.astro";
const $$url$5 = "/our-range/[category]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths: getStaticPaths$2,
  default: $$Index$1,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$6 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/ProdCards.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$ProdCards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ProdCards;
  const products = await contentfulClient.getEntries({
    content_type: "product"
  });
  products.items.map((item) => {
    const { sku, name, description, imageurl, category, subcategory, displayCard, displayNew } = item.fields;
    return {
      sku,
      name,
      description,
      imageurl,
      category,
      subcategory,
      displayCard,
      displayNew
    };
  });
  const { subcat } = Astro2.props;
  const filteredProd = products.items.filter((prod) => prod.fields.subcategory == subcat);
  return renderTemplate`${maybeRenderHead($$result)}<div class="card-wrapper astro-IY4TCRJQ">
${filteredProd.map((card) => card.fields.displayCard && renderTemplate`<div class="card astro-IY4TCRJQ"> 
      <a${addAttribute(`/our-range/${card.fields.category}/${card.fields.subcategory}/${card.fields.sku}/`, "href")} class="astro-IY4TCRJQ">
      ${card.fields.displayNew && renderTemplate`<img src="https://iandj.com.au/-/media/project/sapl/brands/australia/iandj/images/icons/new.svg" class="new astro-IY4TCRJQ">`}
      <h2 class="astro-IY4TCRJQ">${card.fields.name}</h2>
      <div class="image-wrapper astro-IY4TCRJQ">
        <img${addAttribute(card.fields.imageurl, "src")}${addAttribute(card.fields.name, "alt")} class="astro-IY4TCRJQ">
      </div>
      </a>
    </div>`)}
</div>


`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/ProdCards.astro");

const $$Astro$5 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/index.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
async function getStaticPaths$1() {
  const subcategories = await contentfulClient.getEntries({
    content_type: "subcategory"
  });
  const prodSubCategories = subcategories.items.map((item) => ({
    params: {
      category: item.fields.parentCategory,
      subcategory: item.fields.name
    },
    props: {
      subcategory: item.fields.name,
      parentcategory: item.fields.parentCategory
    }
  }));
  return prodSubCategories;
}
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index;
  const { subcategory, parentcategory } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pageTitle": "Our Range | I&J" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, {}, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "..", "label": parentcategory })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": subcategory })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": subcategory })}${renderComponent($$result, "ProdCards", $$ProdCards, { "subcat": subcategory })}` })}`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/index.astro");

const $$file$4 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/index.astro";
const $$url$4 = "/our-range/[category]/[subcategory]";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths: getStaticPaths$1,
  default: $$Index,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/ProductDisclaimer.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$ProductDisclaimer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ProductDisclaimer;
  return renderTemplate`${maybeRenderHead($$result)}<div class="disclaimer astro-AUH7ESH6">
    <p class="astro-AUH7ESH6">
        Whilst all care has been taken to ensure the information is
        correct, please refer to the product label for further information.
    </p>
</div>`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/components/ProductDisclaimer.astro");

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$3 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/[sku].astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
async function getStaticPaths() {
  const products = await contentfulClient.getEntries({
    content_type: "product"
  });
  return products.items.map((item) => {
    return {
      params: {
        category: item.fields.category,
        subcategory: item.fields.subcategory,
        sku: item.fields.sku
      },
      props: {
        name: item.fields.name,
        description: documentToHtmlString(item.fields.description),
        imageurl: item.fields.imageurl,
        ingredients: documentToHtmlString(item.fields.ingredients),
        ing: item.fields.ingredients,
        newicon: item.fields.displayNew,
        packsize: item.fields.packSize,
        servingsize: item.fields.servingSize,
        servingsperpackage: item.fields.servingsPerPackage,
        energyperserving: item.fields.energyPerServing,
        energyper100g: item.fields.energyPer100g,
        proteinperserving: item.fields.proteinPerServing,
        proteinper100g: item.fields.proteinPer100g,
        fattotalperserving: item.fields.fatTotalPerServing,
        fattotalper100g: item.fields.fatTotalPer100g
      }
    };
  });
}
const $$sku = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$sku;
  const claims = await contentfulClient.getEntries({
    content_type: "claim"
  });
  const allClaims = claims.items.map((claim) => {
    const { claimName } = claim.fields;
    return {
      claimName
    };
  });
  const { category, subcategory, sku } = Astro2.params;
  const { name, description, imageurl, ingredients, newicon, packsize, servingsize, servingsperpackage, energyperserving, energyper100g, proteinperserving, proteinper100g, fattotalperserving, fattotalper100g } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '\n\n\n\n<script>\nfunction showhide() {\n    let nutInfo = document.getElementById("nut-info");\n    let ingInfo = document.getElementById("ing-info");\n    let nutLabel = document.getElementById("nut-label");\n    let ingLabel = document.getElementById("ing-label");\n\n    if (nutInfo.style.display == "none") {\n        nutInfo.style.display = "flex";\n        nutLabel.style.color = "white"\n        nutLabel.style.backgroundColor = "black"\n        ingInfo.style.display = "none";\n        ingLabel.style.color = "black"\n        ingLabel.style.backgroundColor = "white"\n    } else {\n        nutInfo.style.display = "none";\n        nutLabel.style.color = "black"\n        nutLabel.style.backgroundColor = "white"\n        ingInfo.style.display = "flex";\n        ingLabel.style.color = "white"\n        ingLabel.style.backgroundColor = "black"\n    }\n}    \n<\/script>'])), renderComponent($$result, "Layout", $$Layout, { "pageTitle": subcategory, "class": "astro-AP3JAACK" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, { "class": "astro-AP3JAACK" }, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home", "class": "astro-AP3JAACK" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "../..", "label": category, "class": "astro-AP3JAACK" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "..", "label": subcategory, "class": "astro-AP3JAACK" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": sku, "class": "astro-AP3JAACK" })}` })}${maybeRenderHead($$result)}<div class="prod-head astro-AP3JAACK">
        <div class="prod-img astro-AP3JAACK">
            ${newicon && renderTemplate`<img src="https://iandj.com.au/-/media/project/sapl/brands/australia/iandj/images/icons/new.svg" class="new astro-AP3JAACK">`}
            <img${addAttribute(imageurl, "src")} alt="Product Image" class="prod-img astro-AP3JAACK">
        </div>
        <div class="prod-info astro-AP3JAACK">
            <h1 class="astro-AP3JAACK">${name}</h1>
            <p class="astro-AP3JAACK">${unescapeHTML(description)}</p>
        </div>
    </div><div class="prod-labels astro-AP3JAACK">
        <div onclick="showhide()" class="ing astro-AP3JAACK" id="ing-label">
            Ingredients
        </div>      
        <div onclick="showhide()" class="nut astro-AP3JAACK" id="nut-label">
            Nutritional Information
        </div>
    </div><div class="prod-tech-info astro-AP3JAACK" id="ing-info" style="display: flex">
        <div class="ing-text astro-AP3JAACK">${unescapeHTML(ingredients)}</div>
        <ul class="astro-AP3JAACK">
            ${allClaims.map((claim) => renderTemplate`<li class="claim-text astro-AP3JAACK">${claim.claimName}</li>`)}
        </ul>
    </div><div class="prod-tech-info astro-AP3JAACK" id="nut-info" style="display:none">
        <div class="pack-data astro-AP3JAACK">
            <ul class="nut-info-ul astro-AP3JAACK" style="padding-inline-start: 0;">
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">Pack Size:</li>
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">Serving Size:</li>
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">Serving per Package:</li>  
            </ul>
            <ul class="nut-info-ul astro-AP3JAACK" style="padding-inline-start: 0;">
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">${packsize}</li>
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">${servingsize}</li>
              <li style="padding-inline-start: 0;" class="astro-AP3JAACK">${servingsperpackage}</li>  
            </ul>
        </div>
        <div class="nut-data astro-AP3JAACK">
            <div class="nut-labels astro-AP3JAACK">
                <p class="astro-AP3JAACK">Average Quantity</p>
                <p class="astro-AP3JAACK">Per Serving</p>
                <p class="astro-AP3JAACK">Per 100g</p>
            </div>             
            <div class="energy astro-AP3JAACK">
                <p class="astro-AP3JAACK">Energy</p>
                <p class="astro-AP3JAACK">${energyperserving}</p>
                <p class="astro-AP3JAACK">${energyper100g}</p>    
            </div>   
            <div class="protein astro-AP3JAACK">
                <p class="astro-AP3JAACK">Protein</p>
                <p class="astro-AP3JAACK">${proteinperserving}</p>
                <p class="astro-AP3JAACK">${proteinper100g}</p>    
            </div> 
            ${(fattotalperserving || fattotalper100g) && renderTemplate`<div class="fat-total astro-AP3JAACK"> 
                <p class="astro-AP3JAACK">Fat, total</p>
                <p class="astro-AP3JAACK">${fattotalperserving}</p>
                <p class="astro-AP3JAACK">${fattotalper100g}</p></div>`} 
        </div>
    </div>${renderComponent($$result, "ProductDisclaimer", $$ProductDisclaimer, { "class": "astro-AP3JAACK" })}` }));
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/[sku].astro");

const $$file$3 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/our-range/[category]/[subcategory]/[sku].astro";
const $$url$3 = "/our-range/[category]/[subcategory]/[sku]";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getStaticPaths,
  default: $$sku,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/recipes.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Recipes = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Recipes;
  const pageTitle = "Recipes";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, {}, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": pageTitle })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": pageTitle })}` })}`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/recipes.astro");

const $$file$2 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/recipes.astro";
const $$url$2 = "/recipes";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Recipes,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/ebooks.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$Ebooks = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Ebooks;
  const pageTitle = "eBooks";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "class": "astro-WSF4T3GH" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, { "class": "astro-WSF4T3GH" }, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home", "class": "astro-WSF4T3GH" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": pageTitle, "class": "astro-WSF4T3GH" })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": pageTitle, "class": "astro-WSF4T3GH" })}${maybeRenderHead($$result)}<div class="list-wrapper astro-WSF4T3GH">
    <h4 class="astro-WSF4T3GH">Recipe Inspirations</h4>
    <div class="book-wrapper astro-WSF4T3GH">
      <div class="book astro-WSF4T3GH">
        <a href="https://simplot-media.azureedge.net/-/media/project/sapl/brands/australia/iandj/documents/ebooks/ebook-finest-fish-dishes-pdf.pdf?rev=2599a753a2b84a44b2048e87983ed0d2" target="_blank" class="astro-WSF4T3GH">
          <img src="https://simplot-media.azureedge.net/-/media/project/sapl/brands/australia/iandj/images/ebooks/ebook-finest-fish-dishes-jpg.jpg" alt="" class="astro-WSF4T3GH">
        </a>
      </div>
    </div>
  </div>` })}

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/ebooks.astro");

const $$file$1 = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/ebooks.astro";
const $$url$1 = "/ebooks";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ebooks,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/about.astro", "https://sapl-iandj.netlify.app/", "file:///C:/Projects-Sandbox/AstroContentful/IandJ2/");
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const pageTitle = "About Us";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "pageTitle": pageTitle, "class": "astro-ES5VGNM2" }, { "default": () => renderTemplate`${renderComponent($$result, "Breadcrumbs", $$Breadcrumbs, { "class": "astro-ES5VGNM2" }, { "default": () => renderTemplate`${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "href": "/", "label": "Home", "class": "astro-ES5VGNM2" })}${renderComponent($$result, "BreadcrumbsItem", $$BreadcrumbsItem, { "currentPage": true, "label": pageTitle, "class": "astro-ES5VGNM2" })}` })}${renderComponent($$result, "Title", $$Title, { "pageTitle": pageTitle, "class": "astro-ES5VGNM2" })}${maybeRenderHead($$result)}<div class="text-wrapper astro-ES5VGNM2">
    <p class="astro-ES5VGNM2">
        In 1910, fisherman George Irvin and Carl Johnson formed I&J to tackle the world's deepest seas in search of the freshest seafood. This legacy lives on over a century later. 
    </p>
    <p class="astro-ES5VGNM2">
        Our seafood is filleted and snap frozen at sea within hours of every catch, maintaining the fresh tasting goodness our customers expect. 
    </p>
    <p class="astro-ES5VGNM2">
        We sail to the cleanest, pristine oceans of New Zealand and Alaska for our catch. This ensures we responsibly deliver the freshest, most natural tasting seafood for you.
    </p>
</div>` })}

`;
}, "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/about.astro");

const $$file = "C:/Projects-Sandbox/AstroContentful/IandJ2/src/pages/about.astro";
const $$url = "/about";

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['node_modules/@astrojs/image/dist/endpoint.js', _page0],['src/pages/index.astro', _page1],['src/pages/contactus.astro', _page2],['src/pages/our-range/index.astro', _page3],['src/pages/our-range/[category]/index.astro', _page4],['src/pages/our-range/[category]/[subcategory]/index.astro', _page5],['src/pages/our-range/[category]/[subcategory]/[sku].astro', _page6],['src/pages/recipes.astro', _page7],['src/pages/ebooks.astro', _page8],['src/pages/about.astro', _page9],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/index.a04035a6.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/contactus.d529d2d5.css"],"scripts":[],"routeData":{"route":"/contactus","type":"page","pattern":"^\\/contactus\\/?$","segments":[[{"content":"contactus","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contactus.astro","pathname":"/contactus","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/index.98c83cc9.css"],"scripts":[],"routeData":{"route":"/our-range","type":"page","pattern":"^\\/our-range\\/?$","segments":[[{"content":"our-range","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/our-range/index.astro","pathname":"/our-range","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/index.47aa6fa1.css"],"scripts":[],"routeData":{"route":"/our-range/[category]","type":"page","pattern":"^\\/our-range\\/([^/]+?)\\/?$","segments":[[{"content":"our-range","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}]],"params":["category"],"component":"src/pages/our-range/[category]/index.astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/index.3a3626ed.css"],"scripts":[],"routeData":{"route":"/our-range/[category]/[subcategory]","type":"page","pattern":"^\\/our-range\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"our-range","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}],[{"content":"subcategory","dynamic":true,"spread":false}]],"params":["category","subcategory"],"component":"src/pages/our-range/[category]/[subcategory]/index.astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/_sku_.41491221.css"],"scripts":[],"routeData":{"route":"/our-range/[category]/[subcategory]/[sku]","type":"page","pattern":"^\\/our-range\\/([^/]+?)\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"our-range","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}],[{"content":"subcategory","dynamic":true,"spread":false}],[{"content":"sku","dynamic":true,"spread":false}]],"params":["category","subcategory","sku"],"component":"src/pages/our-range/[category]/[subcategory]/[sku].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css"],"scripts":[],"routeData":{"route":"/recipes","type":"page","pattern":"^\\/recipes\\/?$","segments":[[{"content":"recipes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/recipes.astro","pathname":"/recipes","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/ebooks.90dcbdc6.css"],"scripts":[],"routeData":{"route":"/ebooks","type":"page","pattern":"^\\/ebooks\\/?$","segments":[[{"content":"ebooks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ebooks.astro","pathname":"/ebooks","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/about.6aba8197.css","assets/about.b989c7ce.css","assets/about.aef78a02.css","assets/about.3d8ce539.css"],"scripts":[],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","_meta":{"trailingSlash":"ignore"}}}],"site":"https://sapl-iandj.netlify.app/","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","C:/Projects-Sandbox/AstroContentful/IandJ2/node_modules/@astrojs/image/dist/vendor/squoosh/image-pool.js":"chunks/image-pool.abfa6f7b.mjs","astro:scripts/before-hydration.js":""},"assets":["/assets/_sku_.41491221.css","/assets/about.3d8ce539.css","/assets/about.aef78a02.css","/assets/about.6aba8197.css","/assets/about.b989c7ce.css","/assets/contactus.d529d2d5.css","/assets/ebooks.90dcbdc6.css","/assets/index.3a3626ed.css","/assets/index.a04035a6.css","/assets/index.47aa6fa1.css","/assets/index.98c83cc9.css","/favicon.svg"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };

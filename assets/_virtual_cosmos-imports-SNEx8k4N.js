var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value2) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value2);
var __privateSet = (obj, member, value2, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value2) : member.set(obj, value2), value2);
var _config, _readSessionIntercomSetting, _setIntercomSetting;
import { u as useFixtureState, e as extendWithValue, R as React, c as createValue, i as isEqual, r as reactExports, a as reactDomExports, b as React$1, g as getDefaultExportFromCjs, d as commonjsGlobal, f as ReactDOM } from "./index-BFZUl6XN.js";
function useCurrentInputValue(inputName, defaultValue) {
  const [fixtureState] = useFixtureState("inputs");
  const inputFs = fixtureState && fixtureState[inputName];
  return inputFs && inputFs.type === "standard" ? (
    // Types of fixture state values cannot be guaranteed at run time, which
    // means that tampering with the fixture state can cause runtime errors
    extendWithValue(defaultValue, inputFs.currentValue)
  ) : defaultValue;
}
function useInputFixtureState(inputName, defaultValue) {
  const [, setFixtureState] = useFixtureState("inputs");
  React.useEffect(() => {
    setFixtureState((prevFs) => {
      const inputFs = prevFs && prevFs[inputName];
      if (inputFs && inputFs.type === "standard" && fsValueExtendsBaseValue(inputFs.defaultValue, defaultValue))
        return prevFs;
      return {
        ...prevFs,
        [inputName]: {
          type: "standard",
          defaultValue: createValue(defaultValue),
          currentValue: createValue(defaultValue)
        }
      };
    });
  }, [setFixtureState, inputName, defaultValue]);
}
function fsValueExtendsBaseValue(fsValue, baseValue) {
  return isEqual(baseValue, extendWithValue(baseValue, fsValue));
}
function useSetInputValue(inputName, defaultValue) {
  const [, setFixtureState] = useFixtureState("inputs");
  return React.useCallback((stateChange) => {
    setFixtureState((prevFs) => {
      function getNewState() {
        if (typeof stateChange !== "function")
          return stateChange;
        const stateUpdater = stateChange;
        return stateUpdater(getCurrentValueFromFixtureState(prevFs, inputName, defaultValue));
      }
      return {
        ...prevFs,
        [inputName]: {
          type: "standard",
          defaultValue: createValue(defaultValue),
          currentValue: createValue(getNewState())
        }
      };
    });
  }, [setFixtureState, defaultValue, inputName]);
}
function getCurrentValueFromFixtureState(fixtureState, inputName, defaultValue) {
  const inputFs = fixtureState && fixtureState[inputName];
  return inputFs && inputFs.type === "standard" ? extendWithValue(defaultValue, inputFs.currentValue) : defaultValue;
}
function useFixtureInput(inputName, defaultValue) {
  useInputFixtureState(inputName, defaultValue);
  const currentValue = useCurrentInputValue(inputName, defaultValue);
  const setValue = useSetInputValue(inputName, defaultValue);
  return [currentValue, setValue];
}
function getDefaultSelectValue({ options, defaultValue }) {
  if (typeof defaultValue === "string") {
    return defaultValue;
  }
  const [firstOption] = options;
  if (typeof firstOption === "object") {
    return firstOption.options[0];
  }
  return firstOption;
}
function useCurrentSelectValue(selectName, args) {
  const [fixtureState] = useFixtureState("inputs");
  const inputFs = fixtureState && fixtureState[selectName];
  return inputFs && inputFs.type === "select" ? inputFs.currentValue : getDefaultSelectValue(args);
}
function useSelectFixtureState(selectName, args) {
  const [, setFixtureState] = useFixtureState("inputs");
  const defaultValue = getDefaultSelectValue(args);
  reactExports.useEffect(() => {
    setFixtureState((prevFs) => {
      const inputFs = prevFs && prevFs[selectName];
      if (inputFs && inputFs.type === "select" && inputFs.defaultValue === defaultValue)
        return prevFs;
      return {
        ...prevFs,
        [selectName]: {
          type: "select",
          options: args.options,
          defaultValue,
          currentValue: defaultValue
        }
      };
    });
  }, [JSON.stringify(args.options), defaultValue, selectName, setFixtureState]);
}
function useSetSelectValue(selectName) {
  const [, setFixtureState] = useFixtureState("inputs");
  return reactExports.useCallback((value2) => {
    setFixtureState((prevFs) => {
      const inputFs = prevFs && prevFs[selectName];
      if (!inputFs || inputFs.type !== "select") {
        console.warn(`Invalid fixture state for select: ${selectName}`);
        return prevFs ?? {};
      }
      return {
        ...prevFs,
        [selectName]: {
          ...inputFs,
          currentValue: value2
        }
      };
    });
  }, [selectName, setFixtureState]);
}
function useFixtureSelect(selectName, args) {
  if (!args || !args.options || !args.options.length)
    throw new Error("No options provided to useSelect");
  if (typeof args.options[0] === "object") {
    if (!args.options[0].options.length)
      throw new Error("No options provided to useSelect");
  }
  useSelectFixtureState(selectName, args);
  const currentValue = useCurrentSelectValue(selectName, args);
  const setValue = useSetSelectValue(selectName);
  return [currentValue, setValue];
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$2 = reactExports, k$1 = Symbol.for("react.element"), l$1 = Symbol.for("react.fragment"), m$a = Object.prototype.hasOwnProperty, n$2 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q$1(c2, a2, g2) {
  var b2, d2 = {}, e = null, h2 = null;
  void 0 !== g2 && (e = "" + g2);
  void 0 !== a2.key && (e = "" + a2.key);
  void 0 !== a2.ref && (h2 = a2.ref);
  for (b2 in a2) m$a.call(a2, b2) && !p$1.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
  if (c2 && c2.defaultProps) for (b2 in a2 = c2.defaultProps, a2) void 0 === d2[b2] && (d2[b2] = a2[b2]);
  return { $$typeof: k$1, type: c2, key: e, ref: h2, props: d2, _owner: n$2.current };
}
reactJsxRuntime_production_min.Fragment = l$1;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
function t() {
  return t = Object.assign ? Object.assign.bind() : function(e) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var n2 = arguments[t2];
      for (var r2 in n2) Object.prototype.hasOwnProperty.call(n2, r2) && (e[r2] = n2[r2]);
    }
    return e;
  }, t.apply(this, arguments);
}
const n$1 = ["children", "options"], r$2 = { blockQuote: "0", breakLine: "1", breakThematic: "2", codeBlock: "3", codeFenced: "4", codeInline: "5", footnote: "6", footnoteReference: "7", gfmTask: "8", heading: "9", headingSetext: "10", htmlBlock: "11", htmlComment: "12", htmlSelfClosing: "13", image: "14", link: "15", linkAngleBraceStyleDetector: "16", linkBareUrlDetector: "17", linkMailtoDetector: "18", newlineCoalescer: "19", orderedList: "20", paragraph: "21", ref: "22", refImage: "23", refLink: "24", table: "25", tableSeparator: "26", text: "27", textBolded: "28", textEmphasized: "29", textEscaped: "30", textMarked: "31", textStrikethroughed: "32", unorderedList: "33" };
var i$1;
!function(e) {
  e[e.MAX = 0] = "MAX", e[e.HIGH = 1] = "HIGH", e[e.MED = 2] = "MED", e[e.LOW = 3] = "LOW", e[e.MIN = 4] = "MIN";
}(i$1 || (i$1 = {}));
const l = ["allowFullScreen", "allowTransparency", "autoComplete", "autoFocus", "autoPlay", "cellPadding", "cellSpacing", "charSet", "classId", "colSpan", "contentEditable", "contextMenu", "crossOrigin", "encType", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "frameBorder", "hrefLang", "inputMode", "keyParams", "keyType", "marginHeight", "marginWidth", "maxLength", "mediaGroup", "minLength", "noValidate", "radioGroup", "readOnly", "rowSpan", "spellCheck", "srcDoc", "srcLang", "srcSet", "tabIndex", "useMap"].reduce((e, t2) => (e[t2.toLowerCase()] = t2, e), { class: "className", for: "htmlFor" }), a$1 = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: "“" }, o$2 = ["style", "script"], c$2 = /([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi, s$j = /mailto:/i, d = /\n{2,}$/, p = /^(\s*>[\s\S]*?)(?=\n\n|$)/, u = /^ *> ?/gm, f$1 = /^(?:\[!([^\]]*)\]\n)?([\s\S]*)/, h = /^ {2,}\n/, m$9 = /^(?:( *[-*_])){3,} *(?:\n *)+\n/, g = /^(?: {1,3})?(`{3,}|~{3,}) *(\S+)? *([^\n]*?)?\n([\s\S]*?)(?:\1\n?|$)/, y = /^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/, k = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/, x = /^(?:\n *)*\n/, b = /\r\n?/g, v = /^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/, S = /^\[\^([^\]]+)]/, C = /\f/g, $ = /^---[ \t]*\n(.|\n)*\n---[ \t]*\n/, E = /^\s*?\[(x|\s)\]/, w = /^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/, z = /^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/, L = /^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/, A = /^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i, T = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, O = /^<!--[\s\S]*?(?:-->)/, B = /^(data|aria|x)-[a-z_][a-z\d_.-]*$/, M = /^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i, R = /^\{.*\}$/, I = /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/, U = /^<([^ >]+@[^ >]+)>/, D = /^<([^ >]+:\/[^ >]+)>/, N = /-([a-z])?/gi, j = /^(\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/, H = /^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/, P = /^!\[([^\]]*)\] ?\[([^\]]*)\]/, F = /^\[([^\]]*)\] ?\[([^\]]*)\]/, _ = /(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/, G = /\t/g, W = /(^ *\||\| *$)/g, Z = /^ *:-+: *$/, q = /^ *:-+ *$/, Q = /^ *-+: *$/, V = "((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)", X = new RegExp(`^([*_])\\1${V}\\1\\1(?!\\1)`), J = new RegExp(`^([*_])${V}\\1(?!\\1|\\w)`), K = new RegExp(`^==${V}==`), Y = new RegExp(`^~~${V}~~`), ee = /^\\([^0-9A-Za-z\s])/, te = /^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i, ne = /^\n+/, re = /^([ \t]*)/, ie = /\\([^\\])/g, le = / *\n+$/, ae = /(?:^|\n)( *)$/, oe = "(?:\\d+\\.)", ce = "(?:[*+-])";
function se(e) {
  return "( *)(" + (1 === e ? oe : ce) + ") +";
}
const de = se(1), pe = se(2);
function ue(e) {
  return new RegExp("^" + (1 === e ? de : pe));
}
const fe = ue(1), he = ue(2);
function me(e) {
  return new RegExp("^" + (1 === e ? de : pe) + "[^\\n]*(?:\\n(?!\\1" + (1 === e ? oe : ce) + " )[^\\n]*)*(\\n|$)", "gm");
}
const ge = me(1), ye = me(2);
function ke(e) {
  const t2 = 1 === e ? oe : ce;
  return new RegExp("^( *)(" + t2 + ") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1" + t2 + " (?!" + t2 + " ))\\n*|\\s*\\n*$)");
}
const xe = ke(1), be = ke(2);
function ve(e, t2) {
  const n2 = 1 === t2, i2 = n2 ? xe : be, l2 = n2 ? ge : ye, a2 = n2 ? fe : he;
  return { match(e2, t3) {
    const n3 = ae.exec(t3.prevCapture);
    return n3 && (t3.list || !t3.inline && !t3.simple) ? i2.exec(e2 = n3[1] + e2) : null;
  }, order: 1, parse(e2, t3, r2) {
    const i3 = n2 ? +e2[2] : void 0, o2 = e2[0].replace(d, "\n").match(l2);
    let c2 = false;
    return { items: o2.map(function(e3, n3) {
      const i4 = a2.exec(e3)[0].length, l3 = new RegExp("^ {1," + i4 + "}", "gm"), s2 = e3.replace(l3, "").replace(a2, ""), d2 = n3 === o2.length - 1, p2 = -1 !== s2.indexOf("\n\n") || d2 && c2;
      c2 = p2;
      const u2 = r2.inline, f2 = r2.list;
      let h2;
      r2.list = true, p2 ? (r2.inline = false, h2 = s2.replace(le, "\n\n")) : (r2.inline = true, h2 = s2.replace(le, ""));
      const m2 = t3(h2, r2);
      return r2.inline = u2, r2.list = f2, m2;
    }), ordered: n2, start: i3 };
  }, render: (t3, n3, i3) => e(t3.ordered ? "ol" : "ul", { key: i3.key, start: t3.type === r$2.orderedList ? t3.start : void 0 }, t3.items.map(function(t4, r2) {
    return e("li", { key: r2 }, n3(t4, i3));
  })) };
}
const Se = new RegExp(`^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['"]([\\s\\S]*?)['"])?\\s*\\)`), Ce = /^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/, $e = [p, g, y, w, L, z, O, j, ge, xe, ye, be], Ee = [...$e, /^[^\n]+(?:  \n|\n{2,})/, A, M];
function we(e) {
  return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, "a").replace(/[çÇ]/g, "c").replace(/[ðÐ]/g, "d").replace(/[ÈÉÊËéèêë]/g, "e").replace(/[ÏïÎîÍíÌì]/g, "i").replace(/[Ññ]/g, "n").replace(/[øØœŒÕõÔôÓóÒò]/g, "o").replace(/[ÜüÛûÚúÙù]/g, "u").replace(/[ŸÿÝý]/g, "y").replace(/[^a-z0-9- ]/gi, "").replace(/ /gi, "-").toLowerCase();
}
function ze(e) {
  return Q.test(e) ? "right" : Z.test(e) ? "center" : q.test(e) ? "left" : null;
}
function Le(e, t2, n2, i2) {
  const l2 = n2.inTable;
  n2.inTable = true;
  let a2 = e.trim().split(/( *(?:`[^`]*`|\\\||\|) *)/).reduce((e2, l3) => ("|" === l3.trim() ? e2.push(i2 ? { type: r$2.tableSeparator } : { type: r$2.text, text: l3 }) : "" !== l3 && e2.push.apply(e2, t2(l3, n2)), e2), []);
  n2.inTable = l2;
  let o2 = [[]];
  return a2.forEach(function(e2, t3) {
    e2.type === r$2.tableSeparator ? 0 !== t3 && t3 !== a2.length - 1 && o2.push([]) : (e2.type !== r$2.text || null != a2[t3 + 1] && a2[t3 + 1].type !== r$2.tableSeparator || (e2.text = e2.text.trimEnd()), o2[o2.length - 1].push(e2));
  }), o2;
}
function Ae(e, t2, n2) {
  n2.inline = true;
  const i2 = e[2] ? e[2].replace(W, "").split("|").map(ze) : [], l2 = e[3] ? function(e2, t3, n3) {
    return e2.trim().split("\n").map(function(e3) {
      return Le(e3, t3, n3, true);
    });
  }(e[3], t2, n2) : [], a2 = Le(e[1], t2, n2, !!l2.length);
  return n2.inline = false, l2.length ? { align: i2, cells: l2, header: a2, type: r$2.table } : { children: a2, type: r$2.paragraph };
}
function Te(e, t2) {
  return null == e.align[t2] ? {} : { textAlign: e.align[t2] };
}
function Oe(e) {
  return function(t2, n2) {
    return n2.inline ? e.exec(t2) : null;
  };
}
function Be(e) {
  return function(t2, n2) {
    return n2.inline || n2.simple ? e.exec(t2) : null;
  };
}
function Me(e) {
  return function(t2, n2) {
    return n2.inline || n2.simple ? null : e.exec(t2);
  };
}
function Re(e) {
  return function(t2) {
    return e.exec(t2);
  };
}
function Ie(e, t2) {
  if (t2.inline || t2.simple) return null;
  let n2 = "";
  e.split("\n").every((e2) => !$e.some((t3) => t3.test(e2)) && (n2 += e2 + "\n", e2.trim()));
  const r2 = n2.trimEnd();
  return "" == r2 ? null : [n2, r2];
}
function Ue(e) {
  try {
    if (decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g, "").match(/^\s*(javascript|vbscript|data(?!:image)):/i)) return null;
  } catch (e2) {
    return null;
  }
  return e;
}
function De(e) {
  return e.replace(ie, "$1");
}
function Ne(e, t2, n2) {
  const r2 = n2.inline || false, i2 = n2.simple || false;
  n2.inline = true, n2.simple = true;
  const l2 = e(t2, n2);
  return n2.inline = r2, n2.simple = i2, l2;
}
function je(e, t2, n2) {
  const r2 = n2.inline || false, i2 = n2.simple || false;
  n2.inline = false, n2.simple = true;
  const l2 = e(t2, n2);
  return n2.inline = r2, n2.simple = i2, l2;
}
function He(e, t2, n2) {
  const r2 = n2.inline || false;
  n2.inline = false;
  const i2 = e(t2, n2);
  return n2.inline = r2, i2;
}
const Pe = (e, t2, n2) => ({ children: Ne(t2, e[1], n2) });
function Fe() {
  return {};
}
function _e() {
  return null;
}
function Ge(...e) {
  return e.filter(Boolean).join(" ");
}
function We(e, t2, n2) {
  let r2 = e;
  const i2 = t2.split(".");
  for (; i2.length && (r2 = r2[i2[0]], void 0 !== r2); ) i2.shift();
  return r2 || n2;
}
function Ze(n2 = "", i2 = {}) {
  function d2(e, n3, ...r2) {
    const l2 = We(i2.overrides, `${e}.props`, {});
    return i2.createElement(function(e2, t2) {
      const n4 = We(t2, e2);
      return n4 ? "function" == typeof n4 || "object" == typeof n4 && "render" in n4 ? n4 : We(t2, `${e2}.component`, e2) : e2;
    }(e, i2.overrides), t({}, n3, l2, { className: Ge(null == n3 ? void 0 : n3.className, l2.className) || void 0 }), ...r2);
  }
  function W2(e) {
    e = e.replace($, "");
    let t2 = false;
    i2.forceInline ? t2 = true : i2.forceBlock || (t2 = false === _.test(e));
    const n3 = le2(ie2(t2 ? e : `${e.trimEnd().replace(ne, "")}

`, { inline: t2 }));
    for (; "string" == typeof n3[n3.length - 1] && !n3[n3.length - 1].trim(); ) n3.pop();
    if (null === i2.wrapper) return n3;
    const r2 = i2.wrapper || (t2 ? "span" : "div");
    let l2;
    if (n3.length > 1 || i2.forceWrapper) l2 = n3;
    else {
      if (1 === n3.length) return l2 = n3[0], "string" == typeof l2 ? d2("span", { key: "outer" }, l2) : l2;
      l2 = null;
    }
    return i2.createElement(r2, { key: "outer" }, l2);
  }
  function Z2(e, t2) {
    const n3 = t2.match(c$2);
    return n3 ? n3.reduce(function(t3, n4) {
      const r2 = n4.indexOf("=");
      if (-1 !== r2) {
        const a2 = function(e2) {
          return -1 !== e2.indexOf("-") && null === e2.match(B) && (e2 = e2.replace(N, function(e3, t4) {
            return t4.toUpperCase();
          })), e2;
        }(n4.slice(0, r2)).trim(), o2 = function(e2) {
          const t4 = e2[0];
          return ('"' === t4 || "'" === t4) && e2.length >= 2 && e2[e2.length - 1] === t4 ? e2.slice(1, -1) : e2;
        }(n4.slice(r2 + 1).trim()), c2 = l[a2] || a2;
        if ("ref" === c2) return t3;
        const s2 = t3[c2] = function(e2, t4, n5, r3) {
          return "style" === t4 ? n5.split(/;\s?/).reduce(function(e3, t5) {
            const n6 = t5.slice(0, t5.indexOf(":"));
            return e3[n6.trim().replace(/(-[a-z])/g, (e4) => e4[1].toUpperCase())] = t5.slice(n6.length + 1).trim(), e3;
          }, {}) : "href" === t4 || "src" === t4 ? r3(n5, e2, t4) : (n5.match(R) && (n5 = n5.slice(1, n5.length - 1)), "true" === n5 || "false" !== n5 && n5);
        }(e, a2, o2, i2.sanitizer);
        "string" == typeof s2 && (A.test(s2) || M.test(s2)) && (t3[c2] = W2(s2.trim()));
      } else "style" !== n4 && (t3[l[n4] || n4] = true);
      return t3;
    }, {}) : null;
  }
  i2.overrides = i2.overrides || {}, i2.sanitizer = i2.sanitizer || Ue, i2.slugify = i2.slugify || we, i2.namedCodesToUnicode = i2.namedCodesToUnicode ? t({}, a$1, i2.namedCodesToUnicode) : a$1, i2.createElement = i2.createElement || reactExports.createElement;
  const q2 = [], Q2 = {}, V2 = { [r$2.blockQuote]: { match: Me(p), order: 1, parse(e, t2, n3) {
    const [, r2, i3] = e[0].replace(u, "").match(f$1);
    return { alert: r2, children: t2(i3, n3) };
  }, render(e, t2, n3) {
    const l2 = { key: n3.key };
    return e.alert && (l2.className = "markdown-alert-" + i2.slugify(e.alert.toLowerCase(), we), e.children.unshift({ attrs: {}, children: [{ type: r$2.text, text: e.alert }], noInnerParse: true, type: r$2.htmlBlock, tag: "header" })), d2("blockquote", l2, t2(e.children, n3));
  } }, [r$2.breakLine]: { match: Re(h), order: 1, parse: Fe, render: (e, t2, n3) => d2("br", { key: n3.key }) }, [r$2.breakThematic]: { match: Me(m$9), order: 1, parse: Fe, render: (e, t2, n3) => d2("hr", { key: n3.key }) }, [r$2.codeBlock]: { match: Me(y), order: 0, parse: (e) => ({ lang: void 0, text: e[0].replace(/^ {4}/gm, "").replace(/\n+$/, "") }), render: (e, n3, r2) => d2("pre", { key: r2.key }, d2("code", t({}, e.attrs, { className: e.lang ? `lang-${e.lang}` : "" }), e.text)) }, [r$2.codeFenced]: { match: Me(g), order: 0, parse: (e) => ({ attrs: Z2("code", e[3] || ""), lang: e[2] || void 0, text: e[4], type: r$2.codeBlock }) }, [r$2.codeInline]: { match: Be(k), order: 3, parse: (e) => ({ text: e[2] }), render: (e, t2, n3) => d2("code", { key: n3.key }, e.text) }, [r$2.footnote]: { match: Me(v), order: 0, parse: (e) => (q2.push({ footnote: e[2], identifier: e[1] }), {}), render: _e }, [r$2.footnoteReference]: { match: Oe(S), order: 1, parse: (e) => ({ target: `#${i2.slugify(e[1], we)}`, text: e[1] }), render: (e, t2, n3) => d2("a", { key: n3.key, href: i2.sanitizer(e.target, "a", "href") }, d2("sup", { key: n3.key }, e.text)) }, [r$2.gfmTask]: { match: Oe(E), order: 1, parse: (e) => ({ completed: "x" === e[1].toLowerCase() }), render: (e, t2, n3) => d2("input", { checked: e.completed, key: n3.key, readOnly: true, type: "checkbox" }) }, [r$2.heading]: { match: Me(i2.enforceAtxHeadings ? z : w), order: 1, parse: (e, t2, n3) => ({ children: Ne(t2, e[2], n3), id: i2.slugify(e[2], we), level: e[1].length }), render: (e, t2, n3) => d2(`h${e.level}`, { id: e.id, key: n3.key }, t2(e.children, n3)) }, [r$2.headingSetext]: { match: Me(L), order: 0, parse: (e, t2, n3) => ({ children: Ne(t2, e[1], n3), level: "=" === e[2] ? 1 : 2, type: r$2.heading }) }, [r$2.htmlBlock]: { match: Re(A), order: 1, parse(e, t2, n3) {
    const [, r2] = e[3].match(re), i3 = new RegExp(`^${r2}`, "gm"), l2 = e[3].replace(i3, ""), a2 = (c2 = l2, Ee.some((e2) => e2.test(c2)) ? He : Ne);
    var c2;
    const s2 = e[1].toLowerCase(), d3 = -1 !== o$2.indexOf(s2), p2 = (d3 ? s2 : e[1]).trim(), u2 = { attrs: Z2(p2, e[2]), noInnerParse: d3, tag: p2 };
    return n3.inAnchor = n3.inAnchor || "a" === s2, d3 ? u2.text = e[3] : u2.children = a2(t2, l2, n3), n3.inAnchor = false, u2;
  }, render: (e, n3, r2) => d2(e.tag, t({ key: r2.key }, e.attrs), e.text || (e.children ? n3(e.children, r2) : "")) }, [r$2.htmlSelfClosing]: { match: Re(M), order: 1, parse(e) {
    const t2 = e[1].trim();
    return { attrs: Z2(t2, e[2] || ""), tag: t2 };
  }, render: (e, n3, r2) => d2(e.tag, t({}, e.attrs, { key: r2.key })) }, [r$2.htmlComment]: { match: Re(O), order: 1, parse: () => ({}), render: _e }, [r$2.image]: { match: Be(Ce), order: 1, parse: (e) => ({ alt: e[1], target: De(e[2]), title: e[3] }), render: (e, t2, n3) => d2("img", { key: n3.key, alt: e.alt || void 0, title: e.title || void 0, src: i2.sanitizer(e.target, "img", "src") }) }, [r$2.link]: { match: Oe(Se), order: 3, parse: (e, t2, n3) => ({ children: je(t2, e[1], n3), target: De(e[2]), title: e[3] }), render: (e, t2, n3) => d2("a", { key: n3.key, href: i2.sanitizer(e.target, "a", "href"), title: e.title }, t2(e.children, n3)) }, [r$2.linkAngleBraceStyleDetector]: { match: Oe(D), order: 0, parse: (e) => ({ children: [{ text: e[1], type: r$2.text }], target: e[1], type: r$2.link }) }, [r$2.linkBareUrlDetector]: { match: (e, t2) => t2.inAnchor || i2.disableAutoLink ? null : Oe(I)(e, t2), order: 0, parse: (e) => ({ children: [{ text: e[1], type: r$2.text }], target: e[1], title: void 0, type: r$2.link }) }, [r$2.linkMailtoDetector]: { match: Oe(U), order: 0, parse(e) {
    let t2 = e[1], n3 = e[1];
    return s$j.test(n3) || (n3 = "mailto:" + n3), { children: [{ text: t2.replace("mailto:", ""), type: r$2.text }], target: n3, type: r$2.link };
  } }, [r$2.orderedList]: ve(d2, 1), [r$2.unorderedList]: ve(d2, 2), [r$2.newlineCoalescer]: { match: Me(x), order: 3, parse: Fe, render: () => "\n" }, [r$2.paragraph]: { match: Ie, order: 3, parse: Pe, render: (e, t2, n3) => d2("p", { key: n3.key }, t2(e.children, n3)) }, [r$2.ref]: { match: Oe(H), order: 0, parse: (e) => (Q2[e[1]] = { target: e[2], title: e[4] }, {}), render: _e }, [r$2.refImage]: { match: Be(P), order: 0, parse: (e) => ({ alt: e[1] || void 0, ref: e[2] }), render: (e, t2, n3) => Q2[e.ref] ? d2("img", { key: n3.key, alt: e.alt, src: i2.sanitizer(Q2[e.ref].target, "img", "src"), title: Q2[e.ref].title }) : null }, [r$2.refLink]: { match: Oe(F), order: 0, parse: (e, t2, n3) => ({ children: t2(e[1], n3), fallbackChildren: e[0], ref: e[2] }), render: (e, t2, n3) => Q2[e.ref] ? d2("a", { key: n3.key, href: i2.sanitizer(Q2[e.ref].target, "a", "href"), title: Q2[e.ref].title }, t2(e.children, n3)) : d2("span", { key: n3.key }, e.fallbackChildren) }, [r$2.table]: { match: Me(j), order: 1, parse: Ae, render(e, t2, n3) {
    const r2 = e;
    return d2("table", { key: n3.key }, d2("thead", null, d2("tr", null, r2.header.map(function(e2, i3) {
      return d2("th", { key: i3, style: Te(r2, i3) }, t2(e2, n3));
    }))), d2("tbody", null, r2.cells.map(function(e2, i3) {
      return d2("tr", { key: i3 }, e2.map(function(e3, i4) {
        return d2("td", { key: i4, style: Te(r2, i4) }, t2(e3, n3));
      }));
    })));
  } }, [r$2.text]: { match: Re(te), order: 4, parse: (e) => ({ text: e[0].replace(T, (e2, t2) => i2.namedCodesToUnicode[t2] ? i2.namedCodesToUnicode[t2] : e2) }), render: (e) => e.text }, [r$2.textBolded]: { match: Be(X), order: 2, parse: (e, t2, n3) => ({ children: t2(e[2], n3) }), render: (e, t2, n3) => d2("strong", { key: n3.key }, t2(e.children, n3)) }, [r$2.textEmphasized]: { match: Be(J), order: 3, parse: (e, t2, n3) => ({ children: t2(e[2], n3) }), render: (e, t2, n3) => d2("em", { key: n3.key }, t2(e.children, n3)) }, [r$2.textEscaped]: { match: Be(ee), order: 1, parse: (e) => ({ text: e[1], type: r$2.text }) }, [r$2.textMarked]: { match: Be(K), order: 3, parse: Pe, render: (e, t2, n3) => d2("mark", { key: n3.key }, t2(e.children, n3)) }, [r$2.textStrikethroughed]: { match: Be(Y), order: 3, parse: Pe, render: (e, t2, n3) => d2("del", { key: n3.key }, t2(e.children, n3)) } };
  true === i2.disableParsingRawHTML && (delete V2[r$2.htmlBlock], delete V2[r$2.htmlSelfClosing]);
  const ie2 = function(e) {
    let t2 = Object.keys(e);
    function n3(r2, i3) {
      let l2 = [];
      for (i3.prevCapture = i3.prevCapture || ""; r2; ) {
        let a2 = 0;
        for (; a2 < t2.length; ) {
          const o2 = t2[a2], c2 = e[o2], s2 = c2.match(r2, i3);
          if (s2) {
            const e2 = s2[0];
            i3.prevCapture += e2, r2 = r2.substring(e2.length);
            const t3 = c2.parse(s2, n3, i3);
            null == t3.type && (t3.type = o2), l2.push(t3);
            break;
          }
          a2++;
        }
      }
      return i3.prevCapture = "", l2;
    }
    return t2.sort(function(t3, n4) {
      let r2 = e[t3].order, i3 = e[n4].order;
      return r2 !== i3 ? r2 - i3 : t3 < n4 ? -1 : 1;
    }), function(e2, t3) {
      return n3(function(e3) {
        return e3.replace(b, "\n").replace(C, "").replace(G, "    ");
      }(e2), t3);
    };
  }(V2), le2 = (ae2 = /* @__PURE__ */ function(e, t2) {
    return function(n3, r2, i3) {
      const l2 = e[n3.type].render;
      return t2 ? t2(() => l2(n3, r2, i3), n3, r2, i3) : l2(n3, r2, i3);
    };
  }(V2, i2.renderRule), function e(t2, n3 = {}) {
    if (Array.isArray(t2)) {
      const r2 = n3.key, i3 = [];
      let l2 = false;
      for (let r3 = 0; r3 < t2.length; r3++) {
        n3.key = r3;
        const a2 = e(t2[r3], n3), o2 = "string" == typeof a2;
        o2 && l2 ? i3[i3.length - 1] += a2 : null !== a2 && i3.push(a2), l2 = o2;
      }
      return n3.key = r2, i3;
    }
    return ae2(t2, e, n3);
  });
  var ae2;
  const oe2 = W2(n2);
  return q2.length ? d2("div", null, oe2, d2("footer", { key: "footer" }, q2.map(function(e) {
    return d2("div", { id: i2.slugify(e.identifier, we), key: e.identifier }, e.identifier, le2(ie2(e.footnote, { inline: true })));
  }))) : oe2;
}
const Markdown = (t2) => {
  let { children: r2 = "", options: i2 } = t2, l2 = function(e, t3) {
    if (null == e) return {};
    var n2, r3, i3 = {}, l3 = Object.keys(e);
    for (r3 = 0; r3 < l3.length; r3++) t3.indexOf(n2 = l3[r3]) >= 0 || (i3[n2] = e[n2]);
    return i3;
  }(t2, n$1);
  return reactExports.cloneElement(Ze(r2, i2), l2);
};
function r$1(e) {
  var t2, f2, n2 = "";
  if ("string" == typeof e || "number" == typeof e) n2 += e;
  else if ("object" == typeof e) if (Array.isArray(e)) for (t2 = 0; t2 < e.length; t2++) e[t2] && (f2 = r$1(e[t2])) && (n2 && (n2 += " "), n2 += f2);
  else for (t2 in e) e[t2] && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function clsx() {
  for (var e, t2, f2 = 0, n2 = ""; f2 < arguments.length; ) (e = arguments[f2++]) && (t2 = r$1(e)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
const SearchIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M14 14L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }), jsxRuntimeExports.jsx("circle", { cx: "10", cy: "10", r: "5", stroke: "currentColor", strokeWidth: "2" })] }));
SearchIcon.displayName = "SearchIcon";
const CallIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 18 18", ...props, children: jsxRuntimeExports.jsx("path", { d: "M17.0156 12.375C17.2969 12.375 17.5312 12.4688 17.7188 12.6562C17.9062 12.8438 18 13.0781 18 13.3594V16.8281C18 17.6094 17.6719 18 17.0156 18C12.3594 18 8.35938 16.3281 5.01562 12.9844C1.67188 9.64062 0 5.64062 0 0.984375C0 0.328125 0.390625 0 1.17188 0H4.64062C4.92188 0 5.15625 0.09375 5.34375 0.28125C5.53125 0.46875 5.625 0.703125 5.625 0.984375C5.625 2.20312 5.8125 3.375 6.1875 4.5C6.3125 4.90625 6.23438 5.25 5.95312 5.53125L4.03125 7.21875C5.46875 10.2188 7.76562 12.4844 10.9219 14.0156L12.4688 12.0469C12.6562 11.8594 12.8906 11.7656 13.1719 11.7656C13.3281 11.7656 13.4375 11.7812 13.5 11.8125C14.625 12.1875 15.7969 12.375 17.0156 12.375Z", fill: "currentColor" }) }));
CallIcon.displayName = "CallIcon";
const CloseIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M6 6L18 18M6 18L18 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }));
CloseIcon.displayName = "CloseIcon";
const FlameIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", fill: "currentColor", d: "M6.34315 19.5736C3.21895 16.3384 3.21895 11.0931 6.34315 7.85786L6.44057 7.75698C7.65679 9.8159 8.24605 10.5185 9 11C8.38813 7.49125 9.16738 5.52009 12 2L17.6569 7.85786C20.781 11.0931 20.781 16.3384 17.6569 19.5736C14.5327 22.8088 9.46734 22.8088 6.34315 19.5736ZM9.17157 18.7868C7.60948 17.1692 7.60948 14.5465 9.17157 12.9289L9.22028 12.8785C9.8284 13.9079 10.123 14.2592 10.5 14.5C10.1941 12.7456 10.5837 11.76 12 10L14.8284 12.9289C16.3905 14.5465 16.3905 17.1692 14.8284 18.7868C13.2663 20.4044 10.7337 20.4044 9.17157 18.7868Z" }) }));
FlameIcon.displayName = "FlameIcon";
const FireTruckIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "15", height: "15", viewBox: "0 0 15 15", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 2L2 7H1V8H2V9H1V10C1 10.5523 1.44772 11 2 11C2 12.1046 2.89543 13 4 13C5.10457 13 6 12.1046 6 11H9C9 12.1046 9.89543 13 11 13C12.1046 13 13 12.1046 13 11H14V9C14 8.44771 13.5523 8 13 8V7C13 5.89543 12.1046 5 11 5H8V7H4L8 3L7 2ZM3 8V9H4V8H3ZM5 11C5 11.5523 4.55228 12 4 12C3.44772 12 3 11.5523 3 11C3 10.4477 3.44772 10 4 10C4.55228 10 5 10.4477 5 11ZM11 12C11.5523 12 12 11.5523 12 11C12 10.4477 11.5523 10 11 10C10.4477 10 10 10.4477 10 11C10 11.5523 10.4477 12 11 12ZM10 6H11C11.5523 6 12 6.44772 12 7V8H10V6ZM6 8H5V9H6V8ZM7 8H8V9H7V8Z", fill: "currentColor" }) }));
FireTruckIcon.displayName = "FireTruckIcon";
const HydrantIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", ...props, children: [jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 12.4688C12.7754 12.4688 13.4062 13.0996 13.4062 13.875C13.4062 14.6504 12.7754 15.2812 12 15.2812C11.2246 15.2812 10.5938 14.6504 10.5938 13.875C10.5938 13.0996 11.2246 12.4688 12 12.4688ZM12 14.3438C12.2585 14.3438 12.4688 14.1335 12.4688 13.875C12.4688 13.6165 12.2585 13.4062 12 13.4062C11.7415 13.4062 11.5312 13.6165 11.5312 13.875C11.5312 14.1335 11.7415 14.3438 12 14.3438Z" }), jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M8.25 12.4688H8.71875V11.4506C8.17316 11.2571 7.78125 10.7361 7.78125 10.125C7.78125 9.50519 8.1845 8.97813 8.74231 8.79141C8.87847 7.64309 9.59875 6.67353 10.5938 6.19506V5.40625C10.5938 4.63084 11.2246 4 12 4C12.7754 4 13.4062 4.63084 13.4062 5.40625V6.19503C14.4013 6.6735 15.1215 7.64309 15.2577 8.79138C15.8155 8.97813 16.2188 9.50519 16.2188 10.125C16.2188 10.7361 15.8268 11.2571 15.2812 11.4506V12.4688H15.75C16.0089 12.4688 16.2188 12.6786 16.2188 12.9375V14.8125C16.2188 15.0714 16.0089 15.2812 15.75 15.2812H15.2812V17.2369C15.8268 17.4304 16.2188 17.9514 16.2188 18.5625V19.5312C16.2188 19.7901 16.0089 20 15.75 20H8.25C7.99113 20 7.78125 19.7901 7.78125 19.5312V18.5625C7.78125 17.9514 8.17316 17.4304 8.71875 17.2369V15.2812H8.25C7.99113 15.2812 7.78125 15.0714 7.78125 14.8125V12.9375C7.78125 12.6786 7.99109 12.4688 8.25 12.4688ZM12.4688 5.40625C12.4688 5.14778 12.2585 4.9375 12 4.9375C11.7415 4.9375 11.5312 5.14778 11.5312 5.40625V5.90894C11.6844 5.88672 11.8408 5.875 12 5.875C12.1592 5.875 12.3156 5.88672 12.4688 5.90894V5.40625ZM12 6.8125C10.866 6.8125 9.91769 7.63291 9.70231 8.71875H14.2977C14.0823 7.63291 13.134 6.8125 12 6.8125ZM14.8125 9.65625H9.1875C8.92903 9.65625 8.71875 9.86653 8.71875 10.125C8.71875 10.3835 8.92903 10.5938 9.1875 10.5938H14.8125C15.071 10.5938 15.2812 10.3835 15.2812 10.125C15.2812 9.86653 15.071 9.65625 14.8125 9.65625ZM8.71875 19.0625H15.2812V18.5625C15.2812 18.304 15.071 18.0938 14.8125 18.0938H9.1875C8.92903 18.0938 8.71875 18.304 8.71875 18.5625V19.0625ZM8.71875 14.3437H9.1875C9.44637 14.3437 9.65625 14.5536 9.65625 14.8125V17.1562H14.3438V14.8125C14.3438 14.5536 14.5536 14.3437 14.8125 14.3437H15.2812V13.4062H14.8125C14.5536 13.4062 14.3438 13.1964 14.3438 12.9375V11.5312H9.65625V12.9375C9.65625 13.1963 9.44641 13.4062 9.1875 13.4062H8.71875V14.3437Z" })] }));
HydrantIcon.displayName = "HydrantIcon";
const MarkerIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", fill: "currentColor", d: "M12 23C12 23 20 15 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 15 12 23 12 23ZM12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" }) }));
MarkerIcon.displayName = "MarkerIcon";
const DisasterListIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "17", height: "22", viewBox: "0 0 17 22", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M1 14.3333C1 17 3.92847 19.5714 5.39271 20.5238C5.23002 20.2063 4.90463 19.2857 4.90463 18.1429C4.90463 17 5.88079 15.7619 6.36887 15.2857C6.36887 15.7619 6.36887 16.7143 6.85695 18.1429C7.34503 19.5714 9.29734 20.5238 10.2735 21C11.575 20.3651 14.2341 18.9134 15.6424 14.3333C16.8138 10.5238 14.8289 7.66667 13.6901 6.71429C13.6901 7.03175 13.4948 7.95238 12.7139 9.09524C11.933 10.2381 10.1108 10.8413 9.29734 11C9.94811 10.2063 11.152 8.04762 10.7616 5.7619C10.3711 3.47619 7.67041 1.63492 6.36887 1C6.85695 2.11111 7.34503 4.90476 5.39271 7.19048C2.95232 10.0476 1 11 1 14.3333Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }) }));
DisasterListIcon.displayName = "DisasterListIcon";
const DrawToolsIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "20", height: "22", viewBox: "0 0 20 22", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M11.8099 7.75L1.19006 1.25L2.30994 19.25L7.80994 18.25L15.8099 20.75L18.8099 6.25L11.8099 7.75Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }) }));
DrawToolsIcon.displayName = "DrawToolsIcon";
const BoundarySelectorIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "18", height: "21", viewBox: "0 0 18 21", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M4.98737 4.07847L3.22876 1.03247", stroke: "currentColor", strokeWidth: "1.3" }), jsxRuntimeExports.jsx("path", { d: "M7.21138 3.78567L8.1217 0.388306", stroke: "currentColor", strokeWidth: "1.3" }), jsxRuntimeExports.jsx("path", { d: "M8.99111 5.15131L12.0371 3.3927", stroke: "currentColor", strokeWidth: "1.3" }), jsxRuntimeExports.jsx("path", { d: "M0.868433 9.84088L3.91443 8.08228", stroke: "currentColor", strokeWidth: "1.3" }), jsxRuntimeExports.jsx("path", { d: "M0.224216 4.94783L3.62158 5.85815", stroke: "currentColor", strokeWidth: "1.3" }), jsxRuntimeExports.jsx("path", { d: "M7.04717 7.60757L16.3557 14.9121L11.6493 15.5786L8.71884 19.3212L7.04717 7.60757Z", stroke: "currentColor", strokeWidth: "1.3" })] }));
BoundarySelectorIcon.displayName = "BoundarySelectorIcon";
const UploadFileIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: jsxRuntimeExports.jsx("path", { stroke: "currentColor", strokeLinecap: "square", strokeLinejoin: "bevel", strokeWidth: "1.3", d: "M12 3v18M3 12h18" }) }));
UploadFileIcon.displayName = "UploadFileIcon";
const AnalyticsPanelIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "18", height: "22", viewBox: "0 0 18 22", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M11 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7L11 1Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M13 16H5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M13 12H5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M7 8H6H5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M11 1V7H17", stroke: "currentColor", fill: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" })] }));
AnalyticsPanelIcon.displayName = "AnalyticsPanelIcon";
const DrawPolygonIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M2 12V4M14 12V4M12 2H4M12 14H4", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "0.65", y: "12.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "0.65", y: "0.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "12.65", y: "0.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "12.65", y: "12.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" })] }));
DrawPolygonIcon.displayName = "DrawPolygonIcon";
const TrashBinIcon = reactExports.memo((props) => jsxRuntimeExports.jsx("svg", { width: "16", height: "18", viewBox: "0 0 16 18", fill: "none", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.21857 2.17112C4.21857 1.25985 4.9573 0.521118 5.86857 0.521118H10.1317C11.043 0.521118 11.7817 1.25985 11.7817 2.17112V3.65256H13.4804H14.1304H15.0462C15.4052 3.65256 15.6962 3.94357 15.6962 4.30256C15.6962 4.66154 15.4052 4.95256 15.0462 4.95256H14.1304V15.8288C14.1304 16.7401 13.3917 17.4788 12.4804 17.4788H3.51992C2.60865 17.4788 1.86992 16.7401 1.86992 15.8288V4.95256H0.954199C0.595214 4.95256 0.304199 4.66154 0.304199 4.30256C0.304199 3.94357 0.595214 3.65256 0.954199 3.65256H1.86992H2.51992H4.21857V2.17112ZM5.51857 3.65256H10.4817V2.17112C10.4817 1.97782 10.325 1.82112 10.1317 1.82112H5.86857C5.67527 1.82112 5.51857 1.97782 5.51857 2.17112V3.65256ZM3.16992 4.95256V15.8288C3.16992 16.0221 3.32662 16.1788 3.51992 16.1788H12.4804C12.6737 16.1788 12.8304 16.0221 12.8304 15.8288V4.95256H3.16992ZM6.43429 7.56707C6.79328 7.56707 7.08429 7.85809 7.08429 8.21707V12.9144C7.08429 13.2734 6.79328 13.5644 6.43429 13.5644C6.07531 13.5644 5.78429 13.2734 5.78429 12.9144V8.21707C5.78429 7.85809 6.07531 7.56707 6.43429 7.56707ZM10.2159 8.21707C10.2159 7.85809 9.92486 7.56707 9.56588 7.56707C9.20689 7.56707 8.91588 7.85809 8.91588 8.21707V12.9144C8.91588 13.2734 9.20689 13.5644 9.56588 13.5644C9.92486 13.5644 10.2159 13.2734 10.2159 12.9144V8.21707Z", fill: "currentColor" }) }));
TrashBinIcon.displayName = "TrashBinIcon";
const DrawLineIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M7 17L17 7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "4.65", y: "16.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("rect", { x: "16.65", y: "4.65", width: "2.7", height: "2.7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" })] }));
DrawLineIcon.displayName = "DrawLineIcon";
const DrawPointIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "14", height: "18", viewBox: "0 0 14 18", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M13.2944 7.14721C13.2944 12.1644 7.49138 16.8075 7.14721 16.8075C6.80305 16.8075 1 12.1644 1 7.14721C1 3.7522 3.7522 1 7.14721 1C10.5422 1 13.2944 3.7522 13.2944 7.14721Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("circle", { cx: "7.14746", cy: "7.90381", r: "1.5", fill: "currentColor" })] }));
DrawPointIcon.displayName = "DrawPointIcon";
const InfoIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { fill: "none", width: "14", height: "14", viewBox: "0 0 14 14", ...props, children: [jsxRuntimeExports.jsx("path", { opacity: "0.3", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", d: "M7.00002 12.8334C10.2217 12.8334 12.8334 10.2217 12.8334 7.00002C12.8334 3.77836 10.2217 1.16669 7.00002 1.16669C3.77836 1.16669 1.16669 3.77836 1.16669 7.00002C1.16669 10.2217 3.77836 12.8334 7.00002 12.8334Z" }), jsxRuntimeExports.jsx("path", { opacity: "0.3", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", d: "M7 9.33333V7" }), jsxRuntimeExports.jsx("path", { opacity: "0.3", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", d: "M7 4.66669H7.00667" })] }));
InfoIcon.displayName = "InfoIcon";
const LegendPanelIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M11 15V11", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M11 7H11.01", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" })] }));
LegendPanelIcon.displayName = "LegendPanelIcon ";
const BivariatePanelIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M17 11H11V17H17V11Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("path", { d: "M7 11H1V17H7V11Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("path", { d: "M17 1H11V7H17V1Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("path", { d: "M7 1H1V7H7V1Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" })] }));
BivariatePanelIcon.displayName = "BivariatePanelIcon ";
const LayersPanelIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M1 16L11 21L21 16", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M1 11L11 16L21 11", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M11 1L1 6L11 11L21 6L11 1Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" })] }));
LayersPanelIcon.displayName = "LayersPanelIcon";
const EyeBallIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M0.666687 7.99984C0.666687 7.99984 3.33335 2.6665 8.00002 2.6665C12.6667 2.6665 15.3334 7.99984 15.3334 7.99984C15.3334 7.99984 12.6667 13.3332 8.00002 13.3332C3.33335 13.3332 0.666687 7.99984 0.666687 7.99984Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" })] }));
EyeBallIcon.displayName = "EyeBallIcon";
const EyeBallCrossedIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M6.60002 2.82652C7.05891 2.71911 7.52873 2.66541 8.00002 2.66652C12.6667 2.66652 15.3334 7.99985 15.3334 7.99985C14.9287 8.75692 14.4461 9.46968 13.8934 10.1265M9.41335 9.41319C9.23025 9.60968 9.00945 9.76729 8.76412 9.8766C8.51879 9.98591 8.25395 10.0447 7.98541 10.0494C7.71687 10.0542 7.45013 10.0048 7.20109 9.90418C6.95206 9.80359 6.72583 9.65387 6.53592 9.46396C6.346 9.27404 6.19628 9.04782 6.09569 8.79878C5.9951 8.54975 5.9457 8.283 5.95044 8.01446C5.95518 7.74592 6.01396 7.48108 6.12327 7.23575C6.23258 6.99042 6.39019 6.76962 6.58669 6.58652M11.96 11.9599C10.8204 12.8285 9.43276 13.3098 8.00002 13.3332C3.33335 13.3332 0.666687 7.99985 0.666687 7.99985C1.49595 6.45445 2.64611 5.10426 4.04002 4.03985L11.96 11.9599Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M0.666687 0.666504L15.3334 15.3332", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" })] }));
EyeBallCrossedIcon.displayName = "EyeBallCrossedIcon";
const AddLayerIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M3.5 16.5L12 20.5L20.5 16.5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("path", { d: "M12 7.5L3.5 11.5L12 15.5L20.5 11.5L12 7.5Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "square", strokeLinejoin: "bevel" }), jsxRuntimeExports.jsx("path", { d: "M12 5L18.5 8L16.5 12H12H7.5L5.5 8L12 5Z", fill: "#26303A" }), jsxRuntimeExports.jsx("path", { d: "M12 3V11M8 7H16", stroke: "currentColor", strokeWidth: "1.3" })] }));
AddLayerIcon.displayName = "AddLayerIcon";
const SortIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M4 5H12", stroke: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M4 8H12", stroke: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M4 11H12", stroke: "currentColor" })] }));
SortIcon.displayName = "SortIcon";
const TripleDotIcon = reactExports.memo((props) => jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [jsxRuntimeExports.jsx("path", { d: "M13 7C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M3 7C3.55228 7 4 7.44772 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7Z", fill: "currentColor" })] }));
TripleDotIcon.displayName = "TripleDotIcon";
const PlayOutlineTv24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.35 9.45221C8.35 8.54037 9.33771 8.13095 10.0195 8.47689L15.0405 11.0247C15.8532 11.437 15.8531 12.563 15.0405 12.9753L10.0195 15.5231C9.33771 15.869 8.35 15.4596 8.35 14.5478V9.45221ZM9.65 9.7472V14.2528L14.0897 12L9.65 9.7472Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.349998 5.5C0.349998 4.31259 1.31259 3.35 2.5 3.35H21.5C22.6874 3.35 23.65 4.31259 23.65 5.5V18.5C23.65 19.6874 22.6874 20.65 21.5 20.65H2.5C1.31259 20.65 0.349998 19.6874 0.349998 18.5V5.5ZM2.5 4.65C2.03056 4.65 1.65 5.03056 1.65 5.5V18.5C1.65 18.9694 2.03056 19.35 2.5 19.35H21.5C21.9694 19.35 22.35 18.9694 22.35 18.5V5.5C22.35 5.03056 21.9694 4.65 21.5 4.65H2.5Z", fill: "currentColor" })] });
PlayOutlineTv24.displayName = "PlayOutlineTv24";
const Memo$2T = reactExports.memo(PlayOutlineTv24);
const ArrowRight24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.5404 4.54039C11.7942 4.28655 12.2058 4.28655 12.4596 4.54039L19.4596 11.5404C19.7135 11.7942 19.7135 12.2058 19.4596 12.4596L12.4596 19.4596C12.2058 19.7135 11.7942 19.7135 11.5404 19.4596C11.2865 19.2058 11.2865 18.7942 11.5404 18.5404L17.4308 12.65H5.00001C4.64102 12.65 4.35001 12.359 4.35001 12C4.35001 11.641 4.64102 11.35 5.00001 11.35H17.4308L11.5404 5.45963C11.2865 5.20578 11.2865 4.79423 11.5404 4.54039Z", fill: "currentColor" }) });
ArrowRight24.displayName = "ArrowRight24";
const Memo$2S = reactExports.memo(ArrowRight24);
const ArrowLeft24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.4596 4.54039C12.7135 4.79423 12.7135 5.20578 12.4596 5.45963L6.56925 11.35H19C19.359 11.35 19.65 11.641 19.65 12C19.65 12.359 19.359 12.65 19 12.65H6.56925L12.4596 18.5404C12.7135 18.7942 12.7135 19.2058 12.4596 19.4596C12.2058 19.7135 11.7942 19.7135 11.5404 19.4596L4.54039 12.4596C4.28655 12.2058 4.28655 11.7942 4.54039 11.5404L11.5404 4.54039C11.7942 4.28655 12.2058 4.28655 12.4596 4.54039Z", fill: "currentColor" }) });
ArrowLeft24.displayName = "ArrowLeft24";
const Memo$2R = reactExports.memo(ArrowLeft24);
const Database24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.1096 4.34279C3.72825 4.64332 3.65 4.87032 3.65 5.00001C3.65 5.12969 3.72825 5.35669 4.1096 5.65722C4.48361 5.95198 5.0651 6.24585 5.84159 6.50468C7.38777 7.02008 9.56514 7.35001 12 7.35001C14.4349 7.35001 16.6122 7.02008 18.1584 6.50468C18.9349 6.24585 19.5164 5.95198 19.8904 5.65722C20.2717 5.35669 20.35 5.12969 20.35 5.00001C20.35 4.87032 20.2717 4.64332 19.8904 4.34279C19.5164 4.04803 18.9349 3.75416 18.1584 3.49533C16.6122 2.97994 14.4349 2.65001 12 2.65001C9.56514 2.65001 7.38777 2.97994 5.84159 3.49533C5.0651 3.75416 4.48361 4.04803 4.1096 4.34279ZM20.35 6.92345C19.8593 7.2395 19.2514 7.51067 18.5695 7.73797C16.8583 8.30836 14.5357 8.65001 12 8.65001C9.46429 8.65001 7.14167 8.30836 5.43049 7.73797C4.74859 7.51067 4.14074 7.2395 3.65 6.92345V12C3.65 12.1327 3.72892 12.3602 4.10681 12.6596C4.47822 12.9539 5.05649 13.2474 5.83083 13.506C7.37279 14.0207 9.5499 14.35 12 14.35C14.4501 14.35 16.6272 14.0207 18.1692 13.506C18.9435 13.2474 19.5218 12.9539 19.8932 12.6596C20.2711 12.3602 20.35 12.1327 20.35 12V6.92345ZM21.65 5.00001C21.65 4.30127 21.2246 3.73905 20.6951 3.32175C20.1582 2.89868 19.4217 2.54611 18.5695 2.26204C16.8583 1.69165 14.5357 1.35001 12 1.35001C9.46429 1.35001 7.14167 1.69165 5.43049 2.26204C4.5783 2.54611 3.84177 2.89868 3.30493 3.32175C2.77542 3.73905 2.35 4.30127 2.35 5.00001V19C2.35 19.6974 2.77108 20.2598 3.29943 20.6785C3.83428 21.1023 4.5685 21.4551 5.41917 21.7391C7.12721 22.3093 9.4501 22.65 12 22.65C14.5499 22.65 16.8728 22.3093 18.5808 21.7391C19.4315 21.4551 20.1657 21.1023 20.7006 20.6785C21.2289 20.2598 21.65 19.6974 21.65 19V5.00001ZM20.35 13.9284C19.8621 14.243 19.2584 14.5129 18.5808 14.7391C16.8728 15.3093 14.5499 15.65 12 15.65C9.4501 15.65 7.12721 15.3093 5.41917 14.7391C4.7416 14.5129 4.13791 14.243 3.65 13.9284V19C3.65 19.1327 3.72892 19.3602 4.10681 19.6596C4.47822 19.9539 5.05649 20.2474 5.83083 20.506C7.37279 21.0207 9.5499 21.35 12 21.35C14.4501 21.35 16.6272 21.0207 18.1692 20.506C18.9435 20.2474 19.5218 19.9539 19.8932 19.6596C20.2711 19.3602 20.35 19.1327 20.35 19V13.9284Z", fill: "currentColor" }) });
Database24.displayName = "Database24";
const Memo$2Q = reactExports.memo(Database24);
const CornerUpRight24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.5404 3.54039C14.7942 3.28655 15.2058 3.28655 15.4596 3.54039L20.4596 8.54039C20.7135 8.79423 20.7135 9.20578 20.4596 9.45963L15.4596 14.4596C15.2058 14.7135 14.7942 14.7135 14.5404 14.4596C14.2865 14.2058 14.2865 13.7942 14.5404 13.5404L18.4308 9.65001H8.00001C7.11153 9.65001 6.25944 10.003 5.6312 10.6312C5.00295 11.2594 4.65001 12.1115 4.65001 13V20C4.65001 20.359 4.35899 20.65 4.00001 20.65C3.64102 20.65 3.35001 20.359 3.35001 20V13C3.35001 11.7667 3.83992 10.584 4.71196 9.71196C5.584 8.83992 6.76675 8.35001 8.00001 8.35001H18.4308L14.5404 4.45963C14.2865 4.20578 14.2865 3.79423 14.5404 3.54039Z", fill: "currentColor" }) });
CornerUpRight24.displayName = "CornerUpRight24";
const Memo$2P = reactExports.memo(CornerUpRight24);
const AddLayer24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.35001C12.359 2.35001 12.65 2.64102 12.65 3.00001V6.35001H16C16.359 6.35001 16.65 6.64102 16.65 7.00001C16.65 7.35899 16.359 7.65001 16 7.65001H12.65V11C12.65 11.359 12.359 11.65 12 11.65C11.641 11.65 11.35 11.359 11.35 11V7.65001H8C7.64101 7.65001 7.35 7.35899 7.35 7.00001C7.35 6.64102 7.64101 6.35001 8 6.35001H11.35V3.00001C11.35 2.64102 11.641 2.35001 12 2.35001ZM16.8745 9.79388C17.0273 9.46907 17.4146 9.32966 17.7394 9.48252L20.7768 10.9119C21.0046 11.0191 21.15 11.2482 21.15 11.5C21.15 11.7518 21.0046 11.9809 20.7768 12.0881L12.2768 16.0881C12.1015 16.1706 11.8985 16.1706 11.7232 16.0881L3.22323 12.0881C2.99541 11.9809 2.85 11.7518 2.85 11.5C2.85 11.2482 2.99541 11.0191 3.22323 10.9119L6.25794 9.48377C6.58276 9.33092 6.96999 9.47032 7.12284 9.79514C7.2757 10.12 7.1363 10.5072 6.81148 10.66L5.02655 11.5L12 14.7816L18.9735 11.5L17.1859 10.6588C16.861 10.5059 16.7216 10.1187 16.8745 9.79388ZM2.91187 16.2232C3.06472 15.8984 3.45195 15.759 3.77677 15.9119L12 19.7816L20.2232 15.9119C20.548 15.759 20.9353 15.8984 21.0881 16.2232C21.241 16.5481 21.1016 16.9353 20.7768 17.0881L12.2768 21.0881C12.1015 21.1706 11.8985 21.1706 11.7232 21.0881L3.22323 17.0881C2.89841 16.9353 2.75901 16.5481 2.91187 16.2232Z", fill: "currentColor" }) });
AddLayer24.displayName = "AddLayer24";
const Memo$2O = reactExports.memo(AddLayer24);
const Location24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_105_20)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13.9079 17.2777L17.8494 5.89032C18.0405 5.3382 17.511 4.80876 16.9589 4.99986L5.57154 8.94133C4.9336 9.16213 4.94701 10.069 5.5912 10.2708L9.26499 11.4219C10.2964 11.7451 11.1042 12.5529 11.4273 13.5843L12.5785 17.2581C12.7803 17.9023 13.6871 17.9156 13.9079 17.2777ZM19.0779 6.31553C19.6239 4.73805 18.1112 3.22536 16.5337 3.77137L5.14632 7.71283C3.32366 8.3437 3.36197 10.9346 5.2025 11.5113L8.87629 12.6625C9.50138 12.8583 9.99094 13.3479 10.1868 13.973L11.3379 17.6468C11.9146 19.4873 14.5055 19.5256 15.1364 17.7029L19.0779 6.31553Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_105_20", children: jsxRuntimeExports.jsx("rect", { width: 24, height: 24, rx: 12, fill: "white" }) }) })] });
Location24.displayName = "Location24";
const Memo$2N = reactExports.memo(Location24);
const LocationFilled24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M16.7861 6.92606C17.4051 6.63177 18.055 7.2787 17.755 7.89487L14.7765 17.0975C14.5223 17.883 13.4143 17.8924 13.1467 17.1113L11.8399 13.9562C11.6337 13.4585 11.2356 13.0651 10.7356 12.8648L7.6745 11.639C6.84402 11.3351 6.86547 10.1532 7.70642 9.87968L16.7861 6.92606Z", fill: "currentColor" }) });
LocationFilled24.displayName = "LocationFilled24";
const Memo$2M = reactExports.memo(LocationFilled24);
const LocationFilled16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M11.1908 4.61738C11.6034 4.42119 12.0367 4.85247 11.8366 5.26325L9.85101 11.3983C9.68152 11.922 8.94284 11.9283 8.7645 11.4075L8.00068 9.5635C7.79456 9.06588 7.39644 8.67243 6.89642 8.4722L5.11633 7.75937C4.56268 7.55677 4.57698 6.76883 5.13762 6.58646L11.1908 4.61738Z", fill: "currentColor" }) });
LocationFilled16.displayName = "LocationFilled16";
const Memo$2L = reactExports.memo(LocationFilled16);
const Info24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65001C6.83614 2.65001 2.65 6.83614 2.65 12C2.65 17.1639 6.83614 21.35 12 21.35C17.1639 21.35 21.35 17.1639 21.35 12C21.35 6.83614 17.1639 2.65001 12 2.65001ZM1.35 12C1.35 6.11817 6.11817 1.35001 12 1.35001C17.8818 1.35001 22.65 6.11817 22.65 12C22.65 17.8818 17.8818 22.65 12 22.65C6.11817 22.65 1.35 17.8818 1.35 12ZM11.35 8.00001C11.35 7.64102 11.641 7.35001 12 7.35001H12.01C12.369 7.35001 12.66 7.64102 12.66 8.00001C12.66 8.35899 12.369 8.65001 12.01 8.65001H12C11.641 8.65001 11.35 8.35899 11.35 8.00001ZM12 11.35C12.359 11.35 12.65 11.641 12.65 12V16C12.65 16.359 12.359 16.65 12 16.65C11.641 16.65 11.35 16.359 11.35 16V12C11.35 11.641 11.641 11.35 12 11.35Z", fill: "currentColor" }) });
Info24.displayName = "Info24";
const Memo$2K = reactExports.memo(Info24);
const Locate24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_1688_25972)", children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 18.7C15.7003 18.7 18.7 15.7003 18.7 12C18.7 8.2997 15.7003 5.30001 12 5.30001C8.29969 5.30001 5.3 8.2997 5.3 12C5.3 15.7003 8.29969 18.7 12 18.7ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58173 16.4183 4.00001 12 4.00001C7.58172 4.00001 4 7.58173 4 12C4 16.4183 7.58172 20 12 20Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 10.3C12.9389 10.3 13.7 11.0611 13.7 12C13.7 12.9389 12.9389 13.7 12 13.7C11.0611 13.7 10.3 12.9389 10.3 12C10.3 11.0611 11.0611 10.3 12 10.3ZM12 9.00001C13.6569 9.00001 15 10.3432 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3432 10.3431 9.00001 12 9.00001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 0.350006C12.359 0.350006 12.65 0.641021 12.65 1.00001V4.00001C12.65 4.35899 12.359 4.65001 12 4.65001C11.641 4.65001 11.35 4.35899 11.35 4.00001V1.00001C11.35 0.641021 11.641 0.350006 12 0.350006ZM0.349998 12C0.349998 11.641 0.641013 11.35 0.999998 11.35H4C4.35898 11.35 4.65 11.641 4.65 12C4.65 12.359 4.35898 12.65 4 12.65H0.999998C0.641013 12.65 0.349998 12.359 0.349998 12ZM19.35 12C19.35 11.641 19.641 11.35 20 11.35H23C23.359 11.35 23.65 11.641 23.65 12C23.65 12.359 23.359 12.65 23 12.65H20C19.641 12.65 19.35 12.359 19.35 12ZM12 19.35C12.359 19.35 12.65 19.641 12.65 20V23C12.65 23.359 12.359 23.65 12 23.65C11.641 23.65 11.35 23.359 11.35 23V20C11.35 19.641 11.641 19.35 12 19.35Z", fill: "currentColor" })] }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1688_25972", children: jsxRuntimeExports.jsx("rect", { width: 24, height: 24, fill: "white" }) }) })] });
Locate24.displayName = "Locate24";
const Memo$2J = reactExports.memo(Locate24);
const Loader24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 1.35001C12.359 1.35001 12.65 1.64102 12.65 2.00001V6.00001C12.65 6.35899 12.359 6.65001 12 6.65001C11.641 6.65001 11.35 6.35899 11.35 6.00001V2.00001C11.35 1.64102 11.641 1.35001 12 1.35001ZM4.47038 4.47039C4.72422 4.21655 5.13578 4.21655 5.38962 4.47039L8.21962 7.30039C8.47346 7.55423 8.47346 7.96579 8.21962 8.21963C7.96578 8.47347 7.55422 8.47347 7.30038 8.21963L4.47038 5.38963C4.21654 5.13578 4.21654 4.72423 4.47038 4.47039ZM19.5296 4.47039C19.7835 4.72423 19.7835 5.13578 19.5296 5.38963L16.6996 8.21963C16.4458 8.47347 16.0342 8.47347 15.7804 8.21963C15.5265 7.96579 15.5265 7.55423 15.7804 7.30039L18.6104 4.47039C18.8642 4.21655 19.2758 4.21655 19.5296 4.47039ZM1.35 12C1.35 11.641 1.64101 11.35 2 11.35H6C6.35898 11.35 6.65 11.641 6.65 12C6.65 12.359 6.35898 12.65 6 12.65H2C1.64101 12.65 1.35 12.359 1.35 12ZM17.35 12C17.35 11.641 17.641 11.35 18 11.35H22C22.359 11.35 22.65 11.641 22.65 12C22.65 12.359 22.359 12.65 22 12.65H18C17.641 12.65 17.35 12.359 17.35 12ZM8.21962 15.7804C8.47346 16.0342 8.47346 16.4458 8.21962 16.6996L5.38962 19.5296C5.13578 19.7835 4.72422 19.7835 4.47038 19.5296C4.21654 19.2758 4.21654 18.8642 4.47038 18.6104L7.30038 15.7804C7.55422 15.5265 7.96578 15.5265 8.21962 15.7804ZM15.7804 15.7804C16.0342 15.5265 16.4458 15.5265 16.6996 15.7804L19.5296 18.6104C19.7835 18.8642 19.7835 19.2758 19.5296 19.5296C19.2758 19.7835 18.8642 19.7835 18.6104 19.5296L15.7804 16.6996C15.5265 16.4458 15.5265 16.0342 15.7804 15.7804ZM12 17.35C12.359 17.35 12.65 17.641 12.65 18V22C12.65 22.359 12.359 22.65 12 22.65C11.641 22.65 11.35 22.359 11.35 22V18C11.35 17.641 11.641 17.35 12 17.35Z", fill: "currentColor" }) });
Loader24.displayName = "Loader24";
const Memo$2I = reactExports.memo(Loader24);
const Loading16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.98598 2.74142C9.05221 2.38823 8.81918 2.04465 8.46088 2.01744C8.30877 2.00588 8.15507 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 7.72291 13.9812 7.45021 13.9449 7.1831C13.8964 6.82712 13.5395 6.61511 13.191 6.70225C12.8428 6.78929 12.6358 7.14218 12.6736 7.49906C12.6911 7.66365 12.7 7.83078 12.7 8C12.7 10.5957 10.5957 12.7 8 12.7C5.40426 12.7 3.3 10.5957 3.3 8C3.3 5.40426 5.40426 3.3 8 3.3C8.07433 3.3 8.14825 3.30173 8.22174 3.30514C8.58011 3.32178 8.91987 3.09403 8.98598 2.74142Z", fill: "currentColor" }) });
Loading16.displayName = "Loading16";
const Memo$2H = reactExports.memo(Loading16);
const Measure24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.44038 2.54039C3.69422 2.28655 4.10578 2.28655 4.35962 2.54039L6.75962 4.94039C7.01346 5.19423 7.01346 5.60578 6.75962 5.85963C6.50578 6.11347 6.09422 6.11347 5.84038 5.85963L4.55 4.56924V19.45H19.4308L18.0404 18.0596C17.7865 17.8058 17.7865 17.3942 18.0404 17.1404C18.2942 16.8865 18.7058 16.8865 18.9596 17.1404L21.4596 19.6404C21.7135 19.8942 21.7135 20.3058 21.4596 20.5596L18.9596 23.0596C18.7058 23.3135 18.2942 23.3135 18.0404 23.0596C17.7865 22.8058 17.7865 22.3942 18.0404 22.1404L19.4308 20.75H3.9C3.54101 20.75 3.25 20.459 3.25 20.1V4.56924L1.95962 5.85963C1.70578 6.11347 1.29422 6.11347 1.04038 5.85963C0.786538 5.60578 0.786538 5.19423 1.04038 4.94039L3.44038 2.54039Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 8.29445C10.359 8.29445 10.65 8.58546 10.65 8.94445V9.0207C11.4123 8.72149 12.3159 8.84249 12.9639 9.38369C14.018 8.37682 15.9036 8.62498 16.5478 10.1282C16.6152 10.2855 16.65 10.4548 16.65 10.626V14C16.65 14.359 16.359 14.65 16 14.65C15.641 14.65 15.35 14.359 15.35 14V10.6335C15.0261 9.89264 13.9739 9.89264 13.65 10.6335V14C13.65 14.359 13.359 14.65 13 14.65C12.641 14.65 12.35 14.359 12.35 14V10.6502C11.9784 9.99782 11.0216 9.99782 10.65 10.6502V14C10.65 14.359 10.359 14.65 10 14.65C9.64102 14.65 9.35 14.359 9.35 14V8.94445C9.35 8.58546 9.64102 8.29445 10 8.29445Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M19.2428 4.68117C19.0836 4.50773 18.7987 4.38433 18.5526 4.389C18.0654 4.39825 17.65 4.83367 17.65 5.33334C17.65 5.69233 17.359 5.98334 17 5.98334C16.641 5.98334 16.35 5.69233 16.35 5.33334C16.35 4.16634 17.2922 3.1127 18.5279 3.08924C19.1433 3.07755 19.7869 3.35161 20.2004 3.80192C20.4137 4.03427 20.5857 4.33608 20.6352 4.69327C20.6859 5.05932 20.6002 5.42979 20.3853 5.77004C19.9542 6.45253 19.2993 6.80641 18.8152 7.06802C18.7535 7.10134 18.6946 7.13317 18.6393 7.16399C18.5259 7.22717 18.4215 7.28811 18.3258 7.35001L20 7.35001C20.359 7.35001 20.65 7.64102 20.65 8.00001C20.65 8.35899 20.359 8.65001 20 8.65001L17 8.65001C16.7911 8.65001 16.5949 8.54957 16.4727 8.38007C16.3505 8.21057 16.3173 7.99268 16.3834 7.79446C16.7143 6.80161 17.424 6.35293 18.0065 6.02836C18.0708 5.99254 18.1327 5.95843 18.1923 5.92558C18.7032 5.64408 19.0469 5.4547 19.2862 5.07579C19.352 4.97159 19.3524 4.90733 19.3475 4.87177C19.3414 4.82736 19.3159 4.76071 19.2428 4.68117Z", fill: "currentColor" })] });
Measure24.displayName = "Measure24";
const Memo$2G = reactExports.memo(Measure24);
const Chart24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 6.35C12.359 6.35 12.65 6.64101 12.65 7L12.65 17C12.65 17.359 12.359 17.65 12 17.65C11.641 17.65 11.35 17.359 11.35 17L11.35 7C11.35 6.64101 11.641 6.35 12 6.35ZM17 10.35C17.359 10.35 17.65 10.641 17.65 11V17C17.65 17.359 17.359 17.65 17 17.65C16.641 17.65 16.35 17.359 16.35 17V11C16.35 10.641 16.641 10.35 17 10.35ZM7 11.85C7.35898 11.85 7.65 12.141 7.65 12.5V17C7.65 17.359 7.35898 17.65 7 17.65C6.64101 17.65 6.35 17.359 6.35 17V12.5C6.35 12.141 6.64101 11.85 7 11.85Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5 1.7H19C20.8225 1.7 22.3 3.17746 22.3 5V19C22.3 20.8225 20.8225 22.3 19 22.3H5C3.17746 22.3 1.7 20.8225 1.7 19V5C1.7 3.17746 3.17746 1.7 5 1.7ZM5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z", fill: "currentColor" })] });
Chart24.displayName = "Chart24";
const Memo$2F = reactExports.memo(Chart24);
const ChartColumn24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 8.35001C16.359 8.35001 16.65 8.64102 16.65 9.00001L16.65 20C16.65 20.359 16.359 20.65 16 20.65C15.641 20.65 15.35 20.359 15.35 20L15.35 9.00001C15.35 8.64102 15.641 8.35001 16 8.35001ZM10 11.35C10.359 11.35 10.65 11.641 10.65 12L10.65 20C10.65 20.359 10.359 20.65 10 20.65C9.64102 20.65 9.35001 20.359 9.35001 20L9.35001 12C9.35001 11.641 9.64102 11.35 10 11.35ZM13 14.35C13.359 14.35 13.65 14.641 13.65 15V20C13.65 20.359 13.359 20.65 13 20.65C12.641 20.65 12.35 20.359 12.35 20V15C12.35 14.641 12.641 14.35 13 14.35ZM7.00001 16.35C7.35899 16.35 7.65001 16.641 7.65001 17V20C7.65001 20.359 7.35899 20.65 7.00001 20.65C6.64102 20.65 6.35001 20.359 6.35001 20L6.35001 17C6.35001 16.641 6.64102 16.35 7.00001 16.35Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.00001 3.35001C4.35899 3.35001 4.65001 3.64102 4.65001 4.00001V19.35H20C20.359 19.35 20.65 19.641 20.65 20C20.65 20.359 20.359 20.65 20 20.65H4.00001C3.82762 20.65 3.66229 20.5815 3.54039 20.4596C3.41849 20.3377 3.35001 20.1724 3.35001 20L3.35001 4.00001C3.35001 3.64102 3.64102 3.35001 4.00001 3.35001Z", fill: "currentColor" })] });
ChartColumn24.displayName = "ChartColumn24";
const Memo$2E = reactExports.memo(ChartColumn24);
const Expand24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.9809 4.63096C12.9809 4.27197 13.2719 3.98096 13.6309 3.98096L19.369 3.98096C19.728 3.98096 20.019 4.27197 20.019 4.63096V10.369C20.019 10.728 19.728 11.019 19.369 11.019C19.01 11.019 18.719 10.728 18.719 10.369V6.2002L14.3836 10.5356C14.1298 10.7895 13.7182 10.7895 13.4644 10.5356C13.2105 10.2818 13.2105 9.87022 13.4644 9.61638L17.7998 5.28096H13.6309C13.2719 5.28096 12.9809 4.98994 12.9809 4.63096ZM4.63095 12.981C4.98993 12.981 5.28095 13.272 5.28095 13.631L5.28095 17.7998L9.61637 13.4644C9.87021 13.2105 10.2818 13.2105 10.5356 13.4644C10.7894 13.7182 10.7894 14.1298 10.5356 14.3836L6.20019 18.719H10.369C10.728 18.719 11.019 19.0101 11.019 19.369C11.019 19.728 10.728 20.019 10.369 20.019H4.63095C4.45856 20.019 4.29323 19.9506 4.17133 19.8287C4.04943 19.7068 3.98095 19.5414 3.98095 19.369L3.98095 13.631C3.98095 13.272 4.27196 12.981 4.63095 12.981Z", fill: "currentColor" }) });
Expand24.displayName = "Expand24";
const Memo$2D = reactExports.memo(Expand24);
const Collapse24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20.5356 3.46438C20.7894 3.71822 20.7894 4.12978 20.5356 4.38362L15.2002 9.71904H19.369C19.728 9.71904 20.019 10.0101 20.019 10.369C20.019 10.728 19.728 11.019 19.369 11.019H13.6309C13.2719 11.019 12.9809 10.728 12.9809 10.369V4.63096C12.9809 4.27197 13.2719 3.98096 13.6309 3.98096C13.9899 3.98096 14.2809 4.27197 14.2809 4.63096V8.7998L19.6163 3.46438C19.8702 3.21054 20.2817 3.21054 20.5356 3.46438ZM3.98096 13.631C3.98096 13.272 4.27198 12.981 4.63096 12.981H10.3691C10.5414 12.981 10.7068 13.0494 10.8287 13.1713C10.9506 13.2932 11.0191 13.4586 11.0191 13.631L11.019 19.369C11.019 19.728 10.728 20.019 10.369 20.019C10.0101 20.019 9.71905 19.728 9.71905 19.369L9.71905 15.2002L4.38363 20.5356C4.12979 20.7895 3.71823 20.7895 3.46439 20.5356C3.21055 20.2818 3.21055 19.8702 3.46439 19.6164L8.79981 14.281H4.63096C4.27198 14.281 3.98096 13.9899 3.98096 13.631Z", fill: "currentColor" }) });
Collapse24.displayName = "Collapse24";
const Memo$2C = reactExports.memo(Collapse24);
const Collapse224 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 1.92883C12.3589 1.92883 12.65 2.21985 12.65 2.57883V9.12425L15.5978 6.17643C15.8516 5.92259 16.2632 5.92259 16.517 6.17643C16.7709 6.43028 16.7709 6.84183 16.517 7.09567L12.4596 11.1531C12.3377 11.275 12.1724 11.3435 12 11.3435C11.8276 11.3435 11.6622 11.275 11.5403 11.1531L7.48291 7.09567C7.22907 6.84183 7.22907 6.43028 7.48291 6.17644C7.73675 5.92259 8.1483 5.92259 8.40215 6.17644L11.35 9.12425V2.57883C11.35 2.21985 11.641 1.92883 12 1.92883ZM12 12.6565C12.1724 12.6565 12.3377 12.725 12.4596 12.8469L16.5171 16.9043C16.7709 17.1582 16.7709 17.5697 16.5171 17.8236C16.2632 18.0774 15.8517 18.0774 15.5978 17.8236L12.65 14.8757V21.4212C12.65 21.7801 12.359 22.0712 12 22.0712C11.641 22.0712 11.35 21.7801 11.35 21.4212V14.8757L8.40217 17.8236C8.14833 18.0774 7.73678 18.0774 7.48294 17.8236C7.2291 17.5697 7.2291 17.1582 7.48294 16.9043L11.5404 12.8469C11.6623 12.725 11.8276 12.6565 12 12.6565Z", fill: "currentColor" }) });
Collapse224.displayName = "Collapse224";
const Memo$2B = reactExports.memo(Collapse224);
const Branch24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 15.65C4.70213 15.65 3.65 16.7021 3.65 18C3.65 19.2979 4.70213 20.35 6 20.35C7.29787 20.35 8.35 19.2979 8.35 18C8.35 16.7021 7.29787 15.65 6 15.65ZM2.35 18C2.35 15.9842 3.98416 14.35 6 14.35C8.01584 14.35 9.65 15.9842 9.65 18C9.65 20.0158 8.01584 21.65 6 21.65C3.98416 21.65 2.35 20.0158 2.35 18Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 8.35001C18.359 8.35001 18.65 8.64102 18.65 9.00001C18.65 11.5593 17.6333 14.0139 15.8236 15.8236C14.0139 17.6333 11.5593 18.65 9 18.65C8.64101 18.65 8.35 18.359 8.35 18C8.35 17.641 8.64101 17.35 9 17.35C11.2146 17.35 13.3384 16.4703 14.9043 14.9043C16.4703 13.3384 17.35 11.2146 17.35 9.00001C17.35 8.64102 17.641 8.35001 18 8.35001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 3.65001C16.7021 3.65001 15.65 4.70214 15.65 6.00001C15.65 7.29788 16.7021 8.35001 18 8.35001C19.2979 8.35001 20.35 7.29788 20.35 6.00001C20.35 4.70214 19.2979 3.65001 18 3.65001ZM14.35 6.00001C14.35 3.98417 15.9842 2.35001 18 2.35001C20.0158 2.35001 21.65 3.98417 21.65 6.00001C21.65 8.01585 20.0158 9.65001 18 9.65001C15.9842 9.65001 14.35 8.01585 14.35 6.00001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 2.35001C6.35898 2.35001 6.65 2.64102 6.65 3.00001V15C6.65 15.359 6.35898 15.65 6 15.65C5.64101 15.65 5.35 15.359 5.35 15V3.00001C5.35 2.64102 5.64101 2.35001 6 2.35001Z", fill: "currentColor" })] });
Branch24.displayName = "Branch24";
const Memo$2A = reactExports.memo(Branch24);
const InfoFilled16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_1049_4224)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8 2.375C8.51777 2.375 8.9375 2.79473 8.9375 3.3125C8.9375 3.83027 8.51777 4.25 8 4.25C7.48223 4.25 7.0625 3.83027 7.0625 3.3125C7.0625 2.79473 7.48223 2.375 8 2.375ZM10.5 12.375C10.5 12.7616 10.1866 13.075 9.8 13.075H6.2C5.8134 13.075 5.5 12.7616 5.5 12.375C5.5 11.9884 5.8134 11.675 6.2 11.675H7.3V7.45H6.825C6.4384 7.45 6.125 7.1366 6.125 6.75C6.125 6.3634 6.4384 6.05 6.825 6.05H7.70625C8.25854 6.05 8.70625 6.49772 8.70625 7.05V11.675H9.8C10.1866 11.675 10.5 11.9884 10.5 12.375Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1049_4224", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
InfoFilled16.displayName = "InfoFilled16";
const Memo$2z = reactExports.memo(InfoFilled16);
const Calendar24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.00001 4.65001C4.25442 4.65001 3.65001 5.25442 3.65001 6.00001V20C3.65001 20.7456 4.25442 21.35 5.00001 21.35H19C19.7456 21.35 20.35 20.7456 20.35 20V6.00001C20.35 5.25442 19.7456 4.65001 19 4.65001H5.00001ZM2.35001 6.00001C2.35001 4.53645 3.53645 3.35001 5.00001 3.35001H19C20.4636 3.35001 21.65 4.53645 21.65 6.00001V20C21.65 21.4636 20.4636 22.65 19 22.65H5.00001C3.53645 22.65 2.35001 21.4636 2.35001 20V6.00001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00001 1.35001C8.35899 1.35001 8.65001 1.64102 8.65001 2.00001V6.00001C8.65001 6.35899 8.35899 6.65001 8.00001 6.65001C7.64102 6.65001 7.35001 6.35899 7.35001 6.00001V2.00001C7.35001 1.64102 7.64102 1.35001 8.00001 1.35001ZM16 1.35001C16.359 1.35001 16.65 1.64102 16.65 2.00001V6.00001C16.65 6.35899 16.359 6.65001 16 6.65001C15.641 6.65001 15.35 6.35899 15.35 6.00001V2.00001C15.35 1.64102 15.641 1.35001 16 1.35001ZM2.35001 10C2.35001 9.64102 2.64102 9.35001 3.00001 9.35001H21C21.359 9.35001 21.65 9.64102 21.65 10C21.65 10.359 21.359 10.65 21 10.65H3.00001C2.64102 10.65 2.35001 10.359 2.35001 10Z", fill: "currentColor" })] });
Calendar24.displayName = "Calendar24";
const Memo$2y = reactExports.memo(Calendar24);
const Filters24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.35 7.00001C2.35 6.64102 2.64101 6.35001 3 6.35001H10C10.359 6.35001 10.65 6.64102 10.65 7.00001C10.65 7.35899 10.359 7.65001 10 7.65001H3C2.64101 7.65001 2.35 7.35899 2.35 7.00001ZM18 6.35001L21 6.35001C21.359 6.35001 21.65 6.64102 21.65 7.00001C21.65 7.35899 21.359 7.65001 21 7.65001L18 7.65001C17.641 7.65001 17.35 7.35899 17.35 7.00001C17.35 6.64102 17.641 6.35001 18 6.35001ZM2.35 17C2.35 16.641 2.64101 16.35 3 16.35H6C6.35898 16.35 6.65 16.641 6.65 17C6.65 17.359 6.35898 17.65 6 17.65H3C2.64101 17.65 2.35 17.359 2.35 17ZM13.35 17C13.35 16.641 13.641 16.35 14 16.35H21C21.359 16.35 21.65 16.641 21.65 17C21.65 17.359 21.359 17.65 21 17.65H14C13.641 17.65 13.35 17.359 13.35 17Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.5 15.15C9.52172 15.15 10.35 15.9783 10.35 17C10.35 18.0217 9.52172 18.85 8.5 18.85C7.47827 18.85 6.65 18.0217 6.65 17C6.65 15.9783 7.47827 15.15 8.5 15.15ZM11.65 17C11.65 15.2603 10.2397 13.85 8.5 13.85C6.7603 13.85 5.35 15.2603 5.35 17C5.35 18.7397 6.7603 20.15 8.5 20.15C10.2397 20.15 11.65 18.7397 11.65 17Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.5 5.15001C14.4783 5.15001 13.65 5.97828 13.65 7.00001C13.65 8.02173 14.4783 8.85001 15.5 8.85001C16.5217 8.85001 17.35 8.02173 17.35 7.00001C17.35 5.97828 16.5217 5.15001 15.5 5.15001ZM12.35 7.00001C12.35 5.26031 13.7603 3.85001 15.5 3.85001C17.2397 3.85001 18.65 5.26031 18.65 7.00001C18.65 8.7397 17.2397 10.15 15.5 10.15C13.7603 10.15 12.35 8.7397 12.35 7.00001Z", fill: "currentColor" })] });
Filters24.displayName = "Filters24";
const Memo$2x = reactExports.memo(Filters24);
const Alarm24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.6999 2.58808C11.0968 2.36464 11.5446 2.24725 12 2.24725C12.4555 2.24725 12.9032 2.36464 13.3001 2.58808C13.697 2.81152 14.0296 3.13348 14.2658 3.52289L14.2676 3.52598L22.743 17.6749C22.9744 18.0756 23.0967 18.53 23.098 18.9927C23.0993 19.4554 22.9794 19.9104 22.7503 20.3124C22.5212 20.7144 22.1908 21.0494 21.792 21.2841C21.3932 21.5187 20.9399 21.6449 20.4772 21.65L20.47 21.65L3.52288 21.65C3.06019 21.6449 2.6069 21.5187 2.2081 21.2841C1.80929 21.0494 1.47889 20.7144 1.24975 20.3124C1.02061 19.9104 0.900723 19.4554 0.902018 18.9927C0.903314 18.53 1.02575 18.0757 1.25713 17.675L1.26234 17.6659L9.73241 3.52598L9.73428 3.52289C9.97049 3.13348 10.3031 2.81152 10.6999 2.58808ZM12 3.54725C11.768 3.54725 11.5399 3.60705 11.3377 3.72088C11.136 3.83445 10.9669 3.99798 10.8466 4.19575C10.8463 4.1962 10.8461 4.19665 10.8458 4.19711L2.38058 18.3291C2.26422 18.5322 2.20267 18.7622 2.20201 18.9963C2.20135 19.2321 2.26243 19.4638 2.37916 19.6686C2.49589 19.8734 2.66421 20.0441 2.86737 20.1636C3.06964 20.2827 3.29941 20.3469 3.53403 20.35H20.466C20.7006 20.3469 20.9304 20.2827 21.1327 20.1636C21.3358 20.0441 21.5042 19.8734 21.6209 19.6686C21.7376 19.4638 21.7987 19.2321 21.798 18.9963C21.7974 18.7622 21.7358 18.5323 21.6195 18.3291L13.1543 4.19711C13.154 4.19665 13.1537 4.1962 13.1535 4.19575C13.0332 3.99798 12.8641 3.83445 12.6623 3.72088C12.4602 3.60705 12.232 3.54725 12 3.54725ZM12 8.35C12.359 8.35 12.65 8.64101 12.65 9V13C12.65 13.359 12.359 13.65 12 13.65C11.641 13.65 11.35 13.359 11.35 13V9C11.35 8.64101 11.641 8.35 12 8.35ZM11.35 17C11.35 16.641 11.641 16.35 12 16.35H12.01C12.369 16.35 12.66 16.641 12.66 17C12.66 17.359 12.369 17.65 12.01 17.65H12C11.641 17.65 11.35 17.359 11.35 17Z", fill: "currentColor" }) });
Alarm24.displayName = "Alarm24";
const Memo$2w = reactExports.memo(Alarm24);
const InfoAlarm16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.205221 12.6799L6.69066 1.74455C6.82716 1.51726 7.01936 1.32935 7.2487 1.19893C7.47805 1.06851 7.7368 1 8 1C8.2632 1 8.52195 1.06851 8.7513 1.19893C8.98064 1.32935 9.17284 1.51726 9.30934 1.74455L15.7948 12.6799C15.9285 12.9138 15.9992 13.179 16 13.449C16.0007 13.7191 15.9315 13.9847 15.799 14.2193C15.6666 14.4539 15.4757 14.6495 15.2452 14.7864C15.0148 14.9234 14.7528 14.997 14.4854 15H1.51456C1.24718 14.997 0.985227 14.9234 0.754766 14.7864C0.524306 14.6495 0.333369 14.4539 0.200953 14.2193C0.0685372 13.9847 -0.000742706 13.7191 6.00468e-06 13.449C0.000754715 13.179 0.0715059 12.9138 0.205221 12.6799ZM8.80001 6C8.80001 5.55817 8.44184 5.2 8.00001 5.2C7.55818 5.2 7.20001 5.55817 7.20001 6V9C7.20001 9.44182 7.55818 9.8 8.00001 9.8C8.44184 9.8 8.80001 9.44182 8.80001 9V6ZM8.00001 11.5333C7.55818 11.5333 7.20001 11.8915 7.20001 12.3333C7.20001 12.7752 7.55818 13.1333 8.00001 13.1333H8.00668C8.44851 13.1333 8.80668 12.7752 8.80668 12.3333C8.80668 11.8915 8.44851 11.5333 8.00668 11.5333H8.00001Z", fill: "currentColor" }) });
InfoAlarm16.displayName = "InfoAlarm16";
const Memo$2v = reactExports.memo(InfoAlarm16);
const Calendar16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.33333 3.16667C2.8731 3.16667 2.5 3.53977 2.5 4.00001V13.3333C2.5 13.7936 2.8731 14.1667 3.33333 14.1667H12.6667C13.1269 14.1667 13.5 13.7936 13.5 13.3333V4.00001C13.5 3.53977 13.1269 3.16667 12.6667 3.16667H3.33333ZM1.5 4.00001C1.5 2.98748 2.32081 2.16667 3.33333 2.16667H12.6667C13.6792 2.16667 14.5 2.98748 14.5 4.00001V13.3333C14.5 14.3459 13.6792 15.1667 12.6667 15.1667H3.33333C2.32081 15.1667 1.5 14.3459 1.5 13.3333V4.00001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.5 6.66667C1.5 6.39053 1.72386 6.16667 2 6.16667H14C14.2761 6.16667 14.5 6.39053 14.5 6.66667C14.5 6.94281 14.2761 7.16667 14 7.16667H2C1.72386 7.16667 1.5 6.94281 1.5 6.66667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.6667 0.833328C10.9428 0.833328 11.1667 1.05719 11.1667 1.33333V3.99999C11.1667 4.27614 10.9428 4.49999 10.6667 4.49999C10.3905 4.49999 10.1667 4.27614 10.1667 3.99999V1.33333C10.1667 1.05719 10.3905 0.833328 10.6667 0.833328Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.33333 0.833328C5.60947 0.833328 5.83333 1.05719 5.83333 1.33333V3.99999C5.83333 4.27614 5.60947 4.49999 5.33333 4.49999C5.05719 4.49999 4.83333 4.27614 4.83333 3.99999V1.33333C4.83333 1.05719 5.05719 0.833328 5.33333 0.833328Z", fill: "currentColor" })] });
Calendar16.displayName = "Calendar16";
const Memo$2u = reactExports.memo(Calendar16);
const FilterOff16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.65 11.5C15.65 11.141 15.359 10.85 15 10.85L10 10.85C9.64102 10.85 9.35001 11.141 9.35001 11.5C9.35001 11.859 9.64102 12.15 10 12.15H15C15.359 12.15 15.65 11.859 15.65 11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.350006 4.50001C0.350006 4.85899 0.641021 5.15001 1.00001 5.15001H6.00001C6.35899 5.15001 6.65001 4.85899 6.65001 4.50001C6.65001 4.14102 6.35899 3.85001 6.00001 3.85001H1.00001C0.641021 3.85001 0.350006 4.14102 0.350006 4.50001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.23025 11.5C3.23025 11.859 2.93924 12.15 2.58025 12.15H1.00001C0.641021 12.15 0.350006 11.859 0.350006 11.5C0.350006 11.141 0.641021 10.85 1.00001 10.85H2.58025C2.93924 10.85 3.23025 11.141 3.23025 11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.00001 10.15C5.74559 10.15 6.35001 10.7544 6.35001 11.5C6.35001 12.2456 5.74559 12.85 5.00001 12.85C4.25442 12.85 3.65001 12.2456 3.65001 11.5C3.65001 10.7544 4.25442 10.15 5.00001 10.15ZM7.65001 11.5C7.65001 10.0365 6.46356 8.85001 5.00001 8.85001C3.53645 8.85001 2.35001 10.0365 2.35001 11.5C2.35001 12.9636 3.53645 14.15 5.00001 14.15C6.46356 14.15 7.65001 12.9636 7.65001 11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.35 4.50001C12.35 4.14102 12.641 3.85001 13 3.85001L15 3.85001C15.359 3.85001 15.65 4.14102 15.65 4.50001C15.65 4.85899 15.359 5.15001 15 5.15001L13 5.15001C12.641 5.15001 12.35 4.85899 12.35 4.50001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11 3.15001C10.2544 3.15001 9.65001 3.75442 9.65001 4.50001C9.65001 5.24559 10.2544 5.85001 11 5.85001C11.7456 5.85001 12.35 5.24559 12.35 4.50001C12.35 3.75442 11.7456 3.15001 11 3.15001ZM8.35001 4.50001C8.35001 3.03645 9.53645 1.85001 11 1.85001C12.4636 1.85001 13.65 3.03645 13.65 4.50001C13.65 5.96356 12.4636 7.15001 11 7.15001C9.53645 7.15001 8.35001 5.96356 8.35001 4.50001Z", fill: "currentColor" })] });
FilterOff16.displayName = "FilterOff16";
const Memo$2t = reactExports.memo(FilterOff16);
const FilterOn16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.65 11.5C15.65 11.141 15.359 10.85 15 10.85H10C9.64101 10.85 9.35 11.141 9.35 11.5C9.35 11.859 9.64101 12.15 10 12.15H15C15.359 12.15 15.65 11.859 15.65 11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.349997 4.5C0.349997 4.14102 0.641012 3.85 0.999997 3.85H4C4.35898 3.85 4.65 4.14102 4.65 4.5C4.65 4.85898 4.35898 5.15 4 5.15H0.999997C0.641012 5.15 0.349997 4.85898 0.349997 4.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.99999 8.85001C6.46355 8.85001 7.64999 10.0365 7.64999 11.5C7.64999 12.9636 6.46355 14.15 4.99999 14.15C3.7607 14.15 2.7201 13.2993 2.43029 12.15H0.999991C0.641006 12.15 0.349991 11.859 0.349991 11.5C0.349991 11.141 0.641006 10.85 0.999991 10.85H2.43029C2.7201 9.70071 3.7607 8.85001 4.99999 8.85001ZM6.34999 11.5C6.34999 10.7544 5.74558 10.15 4.99999 10.15C4.25441 10.15 3.64999 10.7544 3.64999 11.5C3.64999 12.2456 4.25441 12.85 4.99999 12.85C5.74558 12.85 6.34999 12.2456 6.34999 11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.5 9C13.9853 9 16 6.98528 16 4.5C16 2.01472 13.9853 0 11.5 0C9.01472 0 7 2.01472 7 4.5C7 6.98528 9.01472 9 11.5 9ZM14.4596 3.95963C14.7135 3.70578 14.7135 3.29423 14.4596 3.04039C14.2058 2.78655 13.7942 2.78655 13.5404 3.04039L11 5.58077L9.95962 4.54039C9.70578 4.28655 9.29422 4.28655 9.04038 4.54039C8.78654 4.79423 8.78654 5.20578 9.04038 5.45963L10.5404 6.95963C10.7942 7.21347 11.2058 7.21347 11.4596 6.95963L14.4596 3.95963Z", fill: "currentColor" })] });
FilterOn16.displayName = "FilterOn16";
const Memo$2s = reactExports.memo(FilterOn16);
const Locate16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_4764_28837)", children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12ZM8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 0.5C8.27614 0.5 8.5 0.723858 8.5 1V3.1738C8.5 3.44994 8.27614 3.6738 8 3.6738C7.72386 3.6738 7.5 3.44994 7.5 3.1738V1C7.5 0.723858 7.72386 0.5 8 0.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.5 8C15.5 8.27614 15.2761 8.5 15 8.5H13C12.7239 8.5 12.5 8.27614 12.5 8C12.5 7.72386 12.7239 7.5 13 7.5H15C15.2761 7.5 15.5 7.72386 15.5 8Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 12.5C8.27614 12.5 8.5 12.7239 8.5 13V15C8.5 15.2761 8.27614 15.5 8 15.5C7.72386 15.5 7.5 15.2761 7.5 15V13C7.5 12.7239 7.72386 12.5 8 12.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.5 8C3.5 8.27614 3.27614 8.5 3 8.5H1C0.723858 8.5 0.5 8.27614 0.5 8C0.5 7.72386 0.723858 7.5 1 7.5H3C3.27614 7.5 3.5 7.72386 3.5 8Z", fill: "currentColor" })] }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_4764_28837", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
Locate16.displayName = "Locate16";
const Memo$2r = reactExports.memo(Locate16);
const CornerUpRight16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.64645 3.31312C9.84171 3.11786 10.1583 3.11786 10.3536 3.31312L13.6869 6.64645C13.8821 6.84171 13.8821 7.1583 13.6869 7.35356L10.3536 10.6869C10.1583 10.8822 9.84171 10.8822 9.64645 10.6869C9.45118 10.4916 9.45118 10.175 9.64645 9.97978L12.6262 7L9.64645 4.02023C9.45118 3.82496 9.45118 3.50838 9.64645 3.31312Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.33333 7.5C4.75869 7.5 4.20759 7.72827 3.80127 8.1346C3.39494 8.54093 3.16666 9.09203 3.16666 9.66667V12.3333C3.16666 12.6095 2.94281 12.8333 2.66666 12.8333C2.39052 12.8333 2.16666 12.6095 2.16666 12.3333V9.66667C2.16666 8.82681 2.50029 8.02136 3.09416 7.4275C3.68802 6.83363 4.49348 6.5 5.33333 6.5H13.3333C13.6095 6.5 13.8333 6.72386 13.8333 7C13.8333 7.27614 13.6095 7.5 13.3333 7.5H5.33333Z", fill: "currentColor" })] });
CornerUpRight16.displayName = "CornerUpRight16";
const Memo$2q = reactExports.memo(CornerUpRight16);
const SetArea16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.5 2.5C3.23478 2.5 2.98043 2.60536 2.79289 2.79289C2.60536 2.98043 2.5 3.23478 2.5 3.5V5.75C2.5 6.02614 2.27614 6.25 2 6.25C1.72386 6.25 1.5 6.02614 1.5 5.75V3.5C1.5 2.96957 1.71071 2.46086 2.08579 2.08579C2.46086 1.71071 2.96957 1.5 3.5 1.5H5.75C6.02614 1.5 6.25 1.72386 6.25 2C6.25 2.27614 6.02614 2.5 5.75 2.5H3.5ZM9.75 2C9.75 1.72386 9.97386 1.5 10.25 1.5H12.5C13.0304 1.5 13.5391 1.71071 13.9142 2.08579C14.2893 2.46086 14.5 2.96957 14.5 3.5V5.75C14.5 6.02614 14.2761 6.25 14 6.25C13.7239 6.25 13.5 6.02614 13.5 5.75V3.5C13.5 3.23478 13.3946 2.98043 13.2071 2.79289C13.0196 2.60536 12.7652 2.5 12.5 2.5H10.25C9.97386 2.5 9.75 2.27614 9.75 2ZM2 9.75C2.27614 9.75 2.5 9.97386 2.5 10.25V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5H5.75C6.02614 13.5 6.25 13.7239 6.25 14C6.25 14.2761 6.02614 14.5 5.75 14.5H3.5C2.96957 14.5 2.46086 14.2893 2.08579 13.9142C1.71071 13.5391 1.5 13.0304 1.5 12.5V10.25C1.5 9.97386 1.72386 9.75 2 9.75ZM14 9.75C14.2761 9.75 14.5 9.97386 14.5 10.25V12.5C14.5 13.0304 14.2893 13.5391 13.9142 13.9142C13.5391 14.2893 13.0304 14.5 12.5 14.5H10.25C9.97386 14.5 9.75 14.2761 9.75 14C9.75 13.7239 9.97386 13.5 10.25 13.5H12.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5V10.25C13.5 9.97386 13.7239 9.75 14 9.75Z", fill: "currentColor" }) });
SetArea16.displayName = "SetArea16";
const Memo$2p = reactExports.memo(SetArea16);
const Update16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.21968 3.67655C8.50552 3.4661 7.75089 3.44341 7.02592 3.61053C6.30092 3.77765 5.62837 4.12936 5.07132 4.63377C4.51421 5.13823 4.09077 5.77906 3.84141 6.49695C3.75081 6.75781 3.46589 6.89582 3.20504 6.80521C2.94418 6.71461 2.80617 6.42969 2.89677 6.16884C3.20069 5.29385 3.71757 4.51055 4.4001 3.89251C5.08269 3.27442 5.90868 2.84184 6.8013 2.63608C7.69396 2.43031 8.62331 2.4583 9.50235 2.71734C10.3788 2.97561 11.176 3.45494 11.8204 4.10985L13.5 5.71777V4C13.5 3.72386 13.7239 3.5 14 3.5C14.2761 3.5 14.5 3.72386 14.5 4V6.88778C14.5 6.88837 14.5 6.88896 14.5 6.88955V7C14.5 7.27614 14.2761 7.5 14 7.5H11C10.7239 7.5 10.5 7.27614 10.5 7C10.5 6.72386 10.7239 6.5 11 6.5H12.871L11.1233 4.82692L11.1122 4.8159C10.5851 4.27866 9.93389 3.88702 9.21968 3.67655ZM1.5 9C1.5 8.72386 1.72386 8.5 2 8.5H5C5.27614 8.5 5.5 8.72386 5.5 9C5.5 9.27614 5.27614 9.5 5 9.5H3.12897L4.87667 11.1731L4.88783 11.1841C5.41489 11.7213 6.06611 12.113 6.78032 12.3234C7.49448 12.5339 8.24911 12.5566 8.97408 12.3895C9.69908 12.2223 10.3716 11.8706 10.9287 11.3662C11.4858 10.8618 11.9092 10.2209 12.1586 9.50305C12.2492 9.24219 12.5341 9.10418 12.795 9.19479C13.0558 9.28539 13.1938 9.57031 13.1032 9.83116C12.7993 10.7061 12.2824 11.4895 11.5999 12.1075C10.9173 12.7256 10.0913 13.1582 9.1987 13.3639C8.30605 13.5697 7.3767 13.5417 6.49765 13.2827C5.62121 13.0244 4.82403 12.5451 4.17963 11.8902L2.5 10.2822V12C2.5 12.2761 2.27614 12.5 2 12.5C1.72386 12.5 1.5 12.2761 1.5 12V9.1122C1.5 9.11162 1.5 9.11105 1.5 9.11047V9Z", fill: "currentColor" }) });
Update16.displayName = "Update16";
const Memo$2o = reactExports.memo(Update16);
const CornerUpLeft16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.35355 3.31312C6.54881 3.50838 6.54881 3.82496 6.35355 4.02023L3.37377 7L6.35355 9.97978C6.54881 10.175 6.54881 10.4916 6.35355 10.6869C6.15829 10.8822 5.84171 10.8822 5.64644 10.6869L2.31311 7.35356C2.11785 7.1583 2.11785 6.84171 2.31311 6.64645L5.64644 3.31312C5.84171 3.11786 6.15829 3.11786 6.35355 3.31312Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.16666 7C2.16666 6.72386 2.39052 6.5 2.66666 6.5H10.6667C11.5065 6.5 12.312 6.83363 12.9058 7.4275C13.4997 8.02136 13.8333 8.82681 13.8333 9.66667V12.3333C13.8333 12.6095 13.6095 12.8333 13.3333 12.8333C13.0572 12.8333 12.8333 12.6095 12.8333 12.3333V9.66667C12.8333 9.09203 12.6051 8.54093 12.1987 8.1346C11.7924 7.72827 11.2413 7.5 10.6667 7.5H2.66666C2.39052 7.5 2.16666 7.27614 2.16666 7Z", fill: "currentColor" })] });
CornerUpLeft16.displayName = "CornerUpLeft16";
const Memo$2n = reactExports.memo(CornerUpLeft16);
const Plus24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 3.35001C12.359 3.35001 12.65 3.64102 12.65 4.00001V11.35L19.9999 11.35C20.3589 11.35 20.6499 11.641 20.6499 12C20.6499 12.359 20.3589 12.65 19.9999 12.65L12.65 12.65V20C12.65 20.359 12.359 20.65 12 20.65C11.641 20.65 11.35 20.359 11.35 20V12.65L3.99991 12.65C3.64093 12.65 3.34991 12.359 3.34991 12C3.34991 11.641 3.64093 11.35 3.99991 11.35L11.35 11.35L11.35 4.00001C11.35 3.64102 11.641 3.35001 12 3.35001Z", fill: "currentColor" }) });
Plus24.displayName = "Plus24";
const Memo$2m = reactExports.memo(Plus24);
const Plus16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 2.16667C8.27614 2.16667 8.5 2.39053 8.5 2.66667L8.5 7.5L13.3332 7.5C13.6093 7.5 13.8332 7.72386 13.8332 8C13.8332 8.27614 13.6093 8.5 13.3332 8.5L8.5 8.5L8.5 13.3333C8.5 13.6095 8.27614 13.8333 8 13.8333C7.72386 13.8333 7.5 13.6095 7.5 13.3333L7.5 8.5L2.6665 8.5C2.39036 8.5 2.1665 8.27614 2.1665 8C2.1665 7.72386 2.39036 7.5 2.6665 7.5L7.5 7.5L7.5 2.66667C7.5 2.39053 7.72386 2.16667 8 2.16667Z", fill: "currentColor" }) });
Plus16.displayName = "Plus16";
const Memo$2l = reactExports.memo(Plus16);
const BookOpen24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.35001 4.00001C2.35001 3.64102 2.64102 3.35001 3.00001 3.35001H8.40001C9.52459 3.35001 10.6047 3.79115 11.4023 4.57894C11.6309 4.80471 11.831 5.05367 12 5.32028C12.1691 5.05367 12.3691 4.80471 12.5977 4.57894C13.3953 3.79115 14.4754 3.35001 15.6 3.35001H21C21.359 3.35001 21.65 3.64102 21.65 4.00001V17.3333C21.65 17.6923 21.359 17.9833 21 17.9833H14.7C14.1537 17.9833 13.6314 18.1977 13.2476 18.5769C12.864 18.9557 12.65 19.4678 12.65 20C12.65 20.359 12.359 20.65 12 20.65C11.641 20.65 11.35 20.359 11.35 20C11.35 19.4678 11.136 18.9557 10.7524 18.5769C10.3686 18.1977 9.84629 17.9833 9.30001 17.9833H3.00001C2.64102 17.9833 2.35001 17.6923 2.35001 17.3333V4.00001ZM11.35 17.3768C10.7656 16.9292 10.0451 16.6833 9.30001 16.6833H3.65001V4.65001H8.40001C9.18498 4.65001 9.9362 4.95806 10.4888 5.50387C11.0412 6.04941 11.35 6.78758 11.35 7.55556V17.3768ZM12.65 17.3768C13.2344 16.9292 13.9549 16.6833 14.7 16.6833H20.35V4.65001H15.6C14.815 4.65001 14.0638 4.95806 13.5112 5.50387C12.9588 6.04941 12.65 6.78758 12.65 7.55556V17.3768Z", fill: "currentColor" }) });
BookOpen24.displayName = "BookOpen24";
const Memo$2k = reactExports.memo(BookOpen24);
const Download24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 3.492C12.359 3.492 12.65 3.78302 12.65 4.142V12.9463L15.5559 10.0404C15.8098 9.78658 16.2213 9.78658 16.4752 10.0404C16.729 10.2943 16.729 10.7058 16.4751 10.9597L12.4597 14.9751C12.2058 15.229 11.7943 15.229 11.5404 14.9751L7.52495 10.9597C7.27111 10.7058 7.27111 10.2943 7.52495 10.0404C7.77879 9.78658 8.19035 9.78658 8.44419 10.0404L11.35 12.9463V4.142C11.35 3.78302 11.641 3.492 12 3.492ZM3.98616 13.4203C4.34514 13.4203 4.63616 13.7113 4.63616 14.0703V18.858C4.63616 19.0513 4.79286 19.208 4.98616 19.208H19.0139C19.2072 19.208 19.3639 19.0513 19.3639 18.858V14.0703C19.3639 13.7113 19.6549 13.4203 20.0139 13.4203C20.3729 13.4203 20.6639 13.7113 20.6639 14.0703V18.858C20.6639 19.7693 19.9251 20.508 19.0139 20.508H4.98616C4.07489 20.508 3.33616 19.7693 3.33616 18.858V14.0703C3.33616 13.7113 3.62717 13.4203 3.98616 13.4203Z", fill: "currentColor" }) });
Download24.displayName = "Download24";
const Memo$2j = reactExports.memo(Download24);
const Download16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.49997 2.76132C8.49997 2.48518 8.27612 2.26132 7.99997 2.26132C7.72383 2.26132 7.49997 2.48518 7.49997 2.76132V8.46989L5.67655 6.64646C5.48129 6.45119 5.16471 6.45119 4.96945 6.64646C4.77418 6.84172 4.77418 7.1583 4.96944 7.35356L7.64642 10.0305C7.84168 10.2258 8.15826 10.2258 8.35353 10.0306L11.0305 7.35356C11.2258 7.1583 11.2258 6.84172 11.0305 6.64646C10.8353 6.45119 10.5187 6.45119 10.3234 6.64646L8.49997 8.46989V2.76132ZM3.15723 9.38017C3.15723 9.10403 2.93337 8.88017 2.65723 8.88017C2.38108 8.88017 2.15723 9.10403 2.15723 9.38017V12.2387C2.15723 13.0671 2.8288 13.7387 3.65723 13.7387H12.3424C13.1708 13.7387 13.8424 13.0671 13.8424 12.2387V9.38017C13.8424 9.10403 13.6185 8.88017 13.3424 8.88017C13.0662 8.88017 12.8424 9.10403 12.8424 9.38017V12.2387C12.8424 12.5148 12.6185 12.7387 12.3424 12.7387H3.65723C3.38108 12.7387 3.15723 12.5148 3.15723 12.2387V9.38017Z", fill: "currentColor" }) });
Download16.displayName = "Download16";
const Memo$2i = reactExports.memo(Download16);
const Upload16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.49997 9.677C8.49997 9.95314 8.27612 10.177 7.99997 10.177C7.72383 10.177 7.49997 9.95314 7.49997 9.677V3.96843L5.67655 5.79186C5.48129 5.98712 5.16471 5.98712 4.96945 5.79186C4.77418 5.5966 4.77418 5.28002 4.96944 5.08476L7.64642 2.40777C7.84168 2.21251 8.15826 2.21251 8.35353 2.40777L11.0305 5.08475C11.2258 5.28002 11.2258 5.5966 11.0305 5.79186C10.8353 5.98712 10.5187 5.98712 10.3234 5.79186L8.49997 3.96843V9.677ZM3.15723 9.38017C3.15723 9.10403 2.93337 8.88017 2.65723 8.88017C2.38108 8.88017 2.15723 9.10403 2.15723 9.38017V12.2387C2.15723 13.0671 2.8288 13.7387 3.65723 13.7387H12.3424C13.1708 13.7387 13.8424 13.0671 13.8424 12.2387V9.38017C13.8424 9.10403 13.6185 8.88017 13.3424 8.88017C13.0662 8.88017 12.8424 9.10403 12.8424 9.38017V12.2387C12.8424 12.5148 12.6185 12.7387 12.3424 12.7387H3.65723C3.38108 12.7387 3.15723 12.5148 3.15723 12.2387V9.38017Z", fill: "currentColor" }) });
Upload16.displayName = "Upload16";
const Memo$2h = reactExports.memo(Upload16);
const PointOutline24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.1472 4.65001C9.11118 4.65001 6.65 7.11119 6.65 10.1472C6.65 12.4236 7.97949 14.6899 9.44336 16.442C10.1656 17.3064 10.8982 18.019 11.4673 18.5125C11.7443 18.7526 11.9774 18.9364 12.1472 19.0586C12.317 18.9364 12.5502 18.7526 12.8271 18.5125C13.3962 18.019 14.1289 17.3064 14.8511 16.442C16.3149 14.6899 17.6444 12.4236 17.6444 10.1472C17.6444 7.11119 15.1832 4.65001 12.1472 4.65001ZM5.35 10.1472C5.35 6.39322 8.39321 3.35001 12.1472 3.35001C15.9012 3.35001 18.9444 6.39322 18.9444 10.1472C18.9444 12.888 17.3724 15.4518 15.8487 17.2755C15.0771 18.199 14.2945 18.9608 13.6787 19.4947C13.3713 19.7613 13.1 19.9757 12.8878 20.1272C12.7828 20.2021 12.6836 20.2679 12.5964 20.3179C12.5536 20.3424 12.5029 20.3695 12.4489 20.3924L12.4472 20.3931C12.4141 20.4072 12.2958 20.4575 12.1472 20.4575C11.9987 20.4575 11.8803 20.4072 11.8472 20.3931L11.8455 20.3924C11.7916 20.3695 11.7408 20.3424 11.698 20.3179C11.6108 20.2679 11.5116 20.2021 11.4067 20.1272C11.1944 19.9757 10.9232 19.7613 10.6157 19.4947C9.99994 18.9608 9.2173 18.199 8.44573 17.2755C6.92203 15.4518 5.35 12.888 5.35 10.1472Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M13.6472 9.90375C13.6472 10.7322 12.9756 11.4038 12.1472 11.4038C11.3188 11.4038 10.6472 10.7322 10.6472 9.90375C10.6472 9.07533 11.3188 8.40375 12.1472 8.40375C12.9756 8.40375 13.6472 9.07533 13.6472 9.90375Z", fill: "currentColor" })] });
PointOutline24.displayName = "PointOutline24";
const Memo$2g = reactExports.memo(PointOutline24);
const PointOutline16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.09814 3.16666C6.11094 3.16666 4.5 4.7776 4.5 6.7648C4.5 8.25857 5.37389 9.7542 6.34673 10.9186C6.82567 11.4918 7.31155 11.9644 7.68856 12.2913C7.85152 12.4326 7.99107 12.544 8.09814 12.6232C8.20521 12.544 8.34476 12.4326 8.50772 12.2913C8.88474 11.9644 9.37061 11.4918 9.84955 10.9186C10.8224 9.7542 11.6963 8.25857 11.6963 6.7648C11.6963 4.7776 10.0853 3.16666 8.09814 3.16666ZM3.5 6.7648C3.5 4.22532 5.55866 2.16666 8.09814 2.16666C10.6376 2.16666 12.6963 4.22532 12.6963 6.7648C12.6963 8.61583 11.6358 10.3403 10.617 11.5598C10.1 12.1785 9.57572 12.6888 9.16282 13.0468C8.9567 13.2255 8.77421 13.3699 8.63057 13.4724C8.55967 13.523 8.49154 13.5682 8.4308 13.6031C8.40102 13.6202 8.36464 13.6396 8.32532 13.6563L8.32382 13.6569C8.29999 13.6671 8.21087 13.705 8.09814 13.705C7.98541 13.705 7.89629 13.6671 7.87247 13.6569L7.87096 13.6563C7.83165 13.6396 7.79527 13.6202 7.76549 13.6031C7.70474 13.5682 7.63662 13.523 7.56571 13.4724C7.42207 13.3699 7.23958 13.2255 7.03346 13.0468C6.62056 12.6888 6.09624 12.1785 5.57933 11.5598C4.56046 10.3403 3.5 8.61583 3.5 6.7648Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M9.09814 6.60249C9.09814 7.15477 8.65043 7.60249 8.09814 7.60249C7.54586 7.60249 7.09814 7.15477 7.09814 6.60249C7.09814 6.0502 7.54586 5.60249 8.09814 5.60249C8.65043 5.60249 9.09814 6.0502 9.09814 6.60249Z", fill: "currentColor" })] });
PointOutline16.displayName = "PointOutline16";
const Memo$2f = reactExports.memo(PointOutline16);
const PointFilled24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 22C12.4479 22 20 16.1255 20 9.77761C20 5.48216 16.4183 2 12 2C7.58172 2 4 5.48216 4 9.77761C4 16.1255 11.5521 22 12 22ZM12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z", fill: "currentColor" }) });
PointFilled24.displayName = "PointFilled24";
const Memo$2e = reactExports.memo(PointFilled24);
const StartLoc = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("circle", { cx: 12, cy: 12, r: 8, fill: "currentColor", stroke: "white", strokeWidth: 1.3, strokeLinecap: "square", strokeLinejoin: "bevel" }) });
StartLoc.displayName = "StartLoc";
const Memo$2d = reactExports.memo(StartLoc);
const Circle = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("circle", { cx: 12, cy: 12, r: 6, stroke: "currentColor", strokeWidth: 2, strokeLinecap: "square", strokeLinejoin: "bevel" }) });
Circle.displayName = "Circle";
const Memo$2c = reactExports.memo(Circle);
const PointFilled16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 14.6667C8.2986 14.6667 13.3333 10.7503 13.3333 6.5184C13.3333 3.65477 10.9455 1.33333 8 1.33333C5.05449 1.33333 2.66667 3.65477 2.66667 6.5184C2.66667 10.7503 7.70141 14.6667 8 14.6667ZM9.33334 6.66666C9.33334 7.40304 8.73638 7.99999 8 7.99999C7.26363 7.99999 6.66667 7.40304 6.66667 6.66666C6.66667 5.93028 7.26363 5.33333 8 5.33333C8.73638 5.33333 9.33334 5.93028 9.33334 6.66666Z", fill: "currentColor" }) });
PointFilled16.displayName = "PointFilled16";
const Memo$2b = reactExports.memo(PointFilled16);
const Line24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.1326 6.8674C17.3864 7.12124 17.3864 7.5328 17.1326 7.78664L7.78664 17.1326C7.5328 17.3864 7.12124 17.3864 6.8674 17.1326C6.61356 16.8788 6.61356 16.4672 6.8674 16.2134L16.2134 6.8674C16.4672 6.61356 16.8788 6.61356 17.1326 6.8674Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.3 17.3V18.7H6.7V17.3H5.3ZM5 16C4.44772 16 4 16.4477 4 17V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V17C8 16.4477 7.55228 16 7 16H5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.3 5.3V6.7H18.7V5.3H17.3ZM17 4C16.4477 4 16 4.44772 16 5V7C16 7.55228 16.4477 8 17 8H19C19.5523 8 20 7.55228 20 7V5C20 4.44772 19.5523 4 19 4H17Z", fill: "currentColor" })] });
Line24.displayName = "Line24";
const Memo$2a = reactExports.memo(Line24);
const Area24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.35 5.35H16.65V6.65H7.35V5.35ZM6.65 7.35V16.65H5.35V7.35H6.65ZM18.65 7.35V16.65H17.35V7.35H18.65ZM7.35 17.35H16.65V18.65H7.35V17.35Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.3 17.3V18.7H6.7V17.3H5.3ZM5.3 5.3V6.7H6.7V5.3H5.3ZM17.3 5.3V6.7H18.7V5.3H17.3ZM17.3 17.3V18.7H18.7V17.3H17.3ZM5 4C4.44772 4 4 4.44772 4 5V7C4 7.55228 4.44772 8 5 8H7C7.55228 8 8 7.55228 8 7V5C8 4.44772 7.55228 4 7 4H5ZM5 16C4.44772 16 4 16.4477 4 17V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V17C8 16.4477 7.55228 16 7 16H5ZM16 5C16 4.44772 16.4477 4 17 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H17C16.4477 8 16 7.55228 16 7V5ZM17 16C16.4477 16 16 16.4477 16 17V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V17C20 16.4477 19.5523 16 19 16H17Z", fill: "currentColor" })] });
Area24.displayName = "Area24";
const Memo$29 = reactExports.memo(Area24);
const EditLine24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.2076 2.54039C14.4615 2.28655 14.873 2.28655 15.1269 2.54039L20.0766 7.49013C20.1985 7.61203 20.267 7.77736 20.267 7.94975C20.267 8.12214 20.1985 8.28747 20.0766 8.40937L10.8842 17.6018C10.7623 17.7237 10.597 17.7921 10.4246 17.7921H5.47487C5.11589 17.7921 4.82487 17.5011 4.82487 17.1421V12.1924C4.82487 12.02 4.89336 11.8547 5.01526 11.7328L14.2076 2.54039ZM12.4045 6.18199L16.435 10.2125L18.6978 7.94975L14.6673 3.91925L12.4045 6.18199ZM15.5158 11.1317L11.4853 7.10123L6.12488 12.4616V16.4921H10.1554L15.5158 11.1317ZM3.84999 20.0586C3.84999 19.6997 4.14101 19.4086 4.49999 19.4086H21.8086C22.1676 19.4086 22.4586 19.6997 22.4586 20.0586C22.4586 20.4176 22.1676 20.7086 21.8086 20.7086H4.49999C4.14101 20.7086 3.84999 20.4176 3.84999 20.0586Z", fill: "currentColor" }) });
EditLine24.displayName = "EditLine24";
const Memo$28 = reactExports.memo(EditLine24);
const Poly24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.85472 1.69311C3.06244 1.56808 3.32248 1.56904 3.52926 1.69561L13.9276 8.06001L20.6736 6.61443C20.8884 6.56841 21.1119 6.63398 21.2678 6.78876C21.4237 6.94354 21.4908 7.16658 21.4463 7.3817L18.4463 21.8817C18.4091 22.0614 18.2977 22.2171 18.1395 22.3102C17.9813 22.4033 17.7911 22.4252 17.6159 22.3704L9.76865 19.9181L4.42609 20.8895C4.24339 20.9227 4.05522 20.8762 3.90903 20.7617C3.76284 20.6472 3.67259 20.4757 3.66106 20.2904L2.54119 2.29037C2.52614 2.04839 2.647 1.81815 2.85472 1.69311ZM3.91627 3.45665L4.91314 19.4797L9.69353 18.6105C9.79694 18.5917 9.90337 18.5982 10.0037 18.6296L17.3187 20.9155L19.9713 8.09444L13.946 9.38558C13.783 9.42052 13.6127 9.39146 13.4705 9.30441L3.91627 3.45665Z", fill: "currentColor" }) });
Poly24.displayName = "Poly24";
const Memo$27 = reactExports.memo(Poly24);
const Bi24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.35001 4.00001C3.35001 3.64102 3.64102 3.35001 4.00001 3.35001H10C10.359 3.35001 10.65 3.64102 10.65 4.00001V10C10.65 10.359 10.359 10.65 10 10.65H4.00001C3.64102 10.65 3.35001 10.359 3.35001 10V4.00001ZM4.65001 4.65001V9.35001H9.35001V4.65001H4.65001ZM13.35 4.00001C13.35 3.64102 13.641 3.35001 14 3.35001H20C20.359 3.35001 20.65 3.64102 20.65 4.00001V10C20.65 10.359 20.359 10.65 20 10.65H14C13.641 10.65 13.35 10.359 13.35 10V4.00001ZM14.65 4.65001V9.35001H19.35V4.65001H14.65ZM3.35001 14C3.35001 13.641 3.64102 13.35 4.00001 13.35H10C10.359 13.35 10.65 13.641 10.65 14V20C10.65 20.359 10.359 20.65 10 20.65H4.00001C3.64102 20.65 3.35001 20.359 3.35001 20V14ZM4.65001 14.65V19.35H9.35001V14.65H4.65001ZM13.35 14C13.35 13.641 13.641 13.35 14 13.35H20C20.359 13.35 20.65 13.641 20.65 14V20C20.65 20.359 20.359 20.65 20 20.65H14C13.641 20.65 13.35 20.359 13.35 20V14ZM14.65 14.65V19.35H19.35V14.65H14.65Z", fill: "currentColor" }) });
Bi24.displayName = "Bi24";
const Memo$26 = reactExports.memo(Bi24);
const SelectArea24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.2901 0.760469C11.6368 0.853381 11.8426 1.2098 11.7497 1.55655L10.8394 4.95392C10.7465 5.30067 10.3901 5.50645 10.0433 5.41354C9.69656 5.32063 9.49078 4.96421 9.58369 4.61745L10.494 1.22009C10.5869 0.873335 10.9433 0.667557 11.2901 0.760469ZM5.90388 1.46957C6.21477 1.29008 6.6123 1.39659 6.7918 1.70748L8.5504 4.75348C8.72989 5.06437 8.62337 5.4619 8.31248 5.6414C8.00159 5.82089 7.60406 5.71437 7.42457 5.40348L5.66596 2.35748C5.48647 2.04659 5.59299 1.64906 5.90388 1.46957ZM15.6001 4.06768C15.7796 4.37857 15.6731 4.7761 15.3622 4.95559L12.3162 6.7142C12.0053 6.89369 11.6078 6.78717 11.4283 6.47628C11.2488 6.16539 11.3553 5.76786 11.6662 5.58837L14.7122 3.82976C15.0231 3.65027 15.4206 3.75679 15.6001 4.06768ZM2.59651 5.77965C2.68943 5.4329 3.04584 5.22712 3.3926 5.32003L6.78996 6.23035C7.13672 6.32327 7.3425 6.67968 7.24958 7.02644C7.15667 7.37319 6.80025 7.57897 6.4535 7.48606L3.05613 6.57574C2.70938 6.48282 2.5036 6.1264 2.59651 5.77965ZM9.72242 8.04472C9.95232 7.91198 10.2398 7.93239 10.4487 8.09628L19.7572 15.4008C19.9621 15.5616 20.0512 15.8292 19.9837 16.0807C19.9161 16.3323 19.7049 16.5192 19.4471 16.5558L14.9999 17.1855L12.2309 20.722C12.0703 20.9271 11.8028 21.0165 11.5512 20.9492C11.2996 20.882 11.1124 20.671 11.0756 20.4131L9.40394 8.69946C9.36643 8.43666 9.49252 8.17745 9.72242 8.04472ZM10.9196 10.1183L12.1472 18.7202L14.1377 16.178C14.2413 16.0457 14.392 15.9586 14.5584 15.9351L17.7553 15.4824L10.9196 10.1183ZM7.47746 8.7573C7.65696 9.06819 7.55044 9.46572 7.23955 9.64521L4.19355 11.4038C3.88266 11.5833 3.48513 11.4768 3.30563 11.1659C3.12614 10.855 3.23266 10.4575 3.54355 10.278L6.58955 8.51938C6.90044 8.33989 7.29797 8.44641 7.47746 8.7573Z", fill: "currentColor" }) });
SelectArea24.displayName = "SelectArea24";
const Memo$25 = reactExports.memo(SelectArea24);
const Ruler24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.63636 3.35001C7.80875 3.35001 7.97408 3.41849 8.09598 3.54039L20.4596 15.904C20.7135 16.1579 20.7135 16.5694 20.4596 16.8233L16.8233 20.4596C16.5694 20.7135 16.1579 20.7135 15.904 20.4596L3.54038 8.09599C3.41848 7.97409 3.35 7.80876 3.35 7.63637C3.35 7.46398 3.41848 7.29865 3.54038 7.17675L7.17674 3.54039C7.29864 3.41849 7.46397 3.35001 7.63636 3.35001ZM4.91924 7.63637L6.68543 9.40256L8.13517 8.02828C8.3957 7.78131 8.80711 7.7923 9.05408 8.05283C9.30105 8.31336 9.29006 8.72477 9.02953 8.97174L7.605 10.3221L9.89392 12.611L11.3568 11.2243C11.6173 10.9773 12.0287 10.9883 12.2757 11.2489C12.5227 11.5094 12.5117 11.9208 12.2511 12.1678L10.8135 13.5306L13.1854 15.9026L14.6352 14.5283C14.8957 14.2813 15.3071 14.2923 15.5541 14.5528C15.8011 14.8134 15.7901 15.2248 15.5295 15.4717L14.105 16.8221L16.3636 19.0808L19.0808 16.3636L7.63636 4.91924L4.91924 7.63637Z", fill: "currentColor" }) });
Ruler24.displayName = "Ruler24";
const Memo$24 = reactExports.memo(Ruler24);
const Close24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.54039 5.54039C5.79423 5.28655 6.20578 5.28655 6.45963 5.54039L12 11.0808L17.5404 5.54039C17.7942 5.28655 18.2058 5.28655 18.4596 5.54039C18.7135 5.79423 18.7135 6.20578 18.4596 6.45963L12.9192 12L18.4596 17.5404C18.7135 17.7942 18.7135 18.2058 18.4596 18.4596C18.2058 18.7135 17.7942 18.7135 17.5404 18.4596L12 12.9192L6.45963 18.4596C6.20578 18.7135 5.79423 18.7135 5.54039 18.4596C5.28655 18.2058 5.28655 17.7942 5.54039 17.5404L11.0808 12L5.54039 6.45963C5.28655 6.20578 5.28655 5.79423 5.54039 5.54039Z", fill: "currentColor" }) });
Close24.displayName = "Close24";
const Memo$23 = reactExports.memo(Close24);
const Close16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.64645 2.64645C2.84171 2.45118 3.15829 2.45118 3.35355 2.64645L13.3536 12.6464C13.5488 12.8417 13.5488 13.1583 13.3536 13.3536C13.1583 13.5488 12.8417 13.5488 12.6464 13.3536L2.64645 3.35355C2.45118 3.15829 2.45118 2.84171 2.64645 2.64645Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13.3536 2.64645C13.1583 2.45118 12.8417 2.45118 12.6464 2.64645L2.64645 12.6464C2.45118 12.8417 2.45118 13.1583 2.64645 13.3536C2.84171 13.5488 3.15829 13.5488 3.35355 13.3536L13.3536 3.35355C13.5488 3.15829 13.5488 2.84171 13.3536 2.64645Z", fill: "currentColor" })] });
Close16.displayName = "Close16";
const Memo$22 = reactExports.memo(Close16);
const ChevronDown24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.54039 8.54039C5.79423 8.28655 6.20578 8.28655 6.45963 8.54039L12 14.0808L17.5404 8.54039C17.7942 8.28655 18.2058 8.28655 18.4596 8.54039C18.7135 8.79423 18.7135 9.20578 18.4596 9.45963L12.4596 15.4596C12.2058 15.7135 11.7942 15.7135 11.5404 15.4596L5.54039 9.45963C5.28655 9.20578 5.28655 8.79423 5.54039 8.54039Z", fill: "currentColor" }) });
ChevronDown24.displayName = "ChevronDown24";
const Memo$21 = reactExports.memo(ChevronDown24);
const ChevronDown16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.64645 5.64645C2.84171 5.45118 3.15829 5.45118 3.35355 5.64645L8 10.2929L12.6464 5.64645C12.8417 5.45118 13.1583 5.45118 13.3536 5.64645C13.5488 5.84171 13.5488 6.15829 13.3536 6.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L2.64645 6.35355C2.45118 6.15829 2.45118 5.84171 2.64645 5.64645Z", fill: "currentColor" }) });
ChevronDown16.displayName = "ChevronDown16";
const Memo$20 = reactExports.memo(ChevronDown16);
const ChevronUp24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.54039 15.4596C5.79423 15.7135 6.20578 15.7135 6.45963 15.4596L12 9.91923L17.5404 15.4596C17.7942 15.7135 18.2058 15.7135 18.4596 15.4596C18.7135 15.2058 18.7135 14.7942 18.4596 14.5404L12.4596 8.54037C12.2058 8.28653 11.7942 8.28653 11.5404 8.54037L5.54039 14.5404C5.28655 14.7942 5.28655 15.2058 5.54039 15.4596Z", fill: "currentColor" }) });
ChevronUp24.displayName = "ChevronUp24";
const Memo$1$ = reactExports.memo(ChevronUp24);
const ChevronUp16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.64645 11.3536C2.84171 11.5488 3.15829 11.5488 3.35355 11.3536L8 6.70711L12.6464 11.3536C12.8417 11.5488 13.1583 11.5488 13.3536 11.3536C13.5488 11.1583 13.5488 10.8417 13.3536 10.6464L8.35355 5.64645C8.15829 5.45118 7.84171 5.45118 7.64645 5.64645L2.64645 10.6464C2.45118 10.8417 2.45118 11.1583 2.64645 11.3536Z", fill: "currentColor" }) });
ChevronUp16.displayName = "ChevronUp16";
const Memo$1_ = reactExports.memo(ChevronUp16);
const ChevronLeft24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.4596 5.54039C15.7135 5.79423 15.7135 6.20578 15.4596 6.45963L9.91924 12L15.4596 17.5404C15.7135 17.7942 15.7135 18.2058 15.4596 18.4596C15.2058 18.7135 14.7942 18.7135 14.5404 18.4596L8.54038 12.4596C8.28654 12.2058 8.28654 11.7942 8.54038 11.5404L14.5404 5.54039C14.7942 5.28655 15.2058 5.28655 15.4596 5.54039Z", fill: "currentColor" }) });
ChevronLeft24.displayName = "ChevronLeft24";
const Memo$1Z = reactExports.memo(ChevronLeft24);
const ChevronLeft16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.3536 3.64645C10.5488 3.84171 10.5488 4.15829 10.3536 4.35355L6.70711 8L10.3536 11.6464C10.5488 11.8417 10.5488 12.1583 10.3536 12.3536C10.1583 12.5488 9.84171 12.5488 9.64645 12.3536L5.64645 8.35355C5.45118 8.15829 5.45118 7.84171 5.64645 7.64645L9.64645 3.64645C9.84171 3.45118 10.1583 3.45118 10.3536 3.64645Z", fill: "currentColor" }) });
ChevronLeft16.displayName = "ChevronLeft16";
const Memo$1Y = reactExports.memo(ChevronLeft16);
const ChevronRight24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.54038 5.54039C8.79422 5.28655 9.20578 5.28655 9.45962 5.54039L15.4596 11.5404C15.7135 11.7942 15.7135 12.2058 15.4596 12.4596L9.45962 18.4596C9.20578 18.7135 8.79422 18.7135 8.54038 18.4596C8.28654 18.2058 8.28654 17.7942 8.54038 17.5404L14.0808 12L8.54038 6.45963C8.28654 6.20578 8.28654 5.79423 8.54038 5.54039Z", fill: "currentColor" }) });
ChevronRight24.displayName = "ChevronRight24";
const Memo$1X = reactExports.memo(ChevronRight24);
const ChevronRight16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.64645 3.64645C5.84171 3.45118 6.15829 3.45118 6.35355 3.64645L10.3536 7.64645C10.5488 7.84171 10.5488 8.15829 10.3536 8.35355L6.35355 12.3536C6.15829 12.5488 5.84171 12.5488 5.64645 12.3536C5.45118 12.1583 5.45118 11.8417 5.64645 11.6464L9.29289 8L5.64645 4.35355C5.45119 4.15829 5.45119 3.84171 5.64645 3.64645Z", fill: "currentColor" }) });
ChevronRight16.displayName = "ChevronRight16";
const Memo$1W = reactExports.memo(ChevronRight16);
const TriangleDown16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M3 5L8 11L13 5", fill: "currentColor" }) });
TriangleDown16.displayName = "TriangleDown16";
const Memo$1V = reactExports.memo(TriangleDown16);
const TriangleUp16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M13 11L8 5L3 11", fill: "currentColor" }) });
TriangleUp16.displayName = "TriangleUp16";
const Memo$1U = reactExports.memo(TriangleUp16);
const ArrowLeft16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.0203 4.47009C7.82504 4.27483 7.50846 4.27483 7.31319 4.47009L4.13683 7.64646C4.04306 7.74022 3.99038 7.8674 3.99038 8.00001C3.99038 8.13262 4.04306 8.2598 4.13683 8.35356L7.31319 11.5299C7.50846 11.7252 7.82504 11.7252 8.0203 11.5299C8.21556 11.3347 8.21556 11.0181 8.0203 10.8228L5.69749 8.50001L11.5096 8.50002C11.7858 8.50002 12.0096 8.27616 12.0096 8.00002C12.0096 7.72388 11.7858 7.50002 11.5096 7.50002L5.69749 7.50001L8.0203 5.1772C8.21556 4.98194 8.21556 4.66535 8.0203 4.47009Z", fill: "currentColor" }) });
ArrowLeft16.displayName = "ArrowLeft16";
const Memo$1T = reactExports.memo(ArrowLeft16);
const ArrowRight16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.97956 4.47009C8.17482 4.27483 8.4914 4.27483 8.68666 4.47009L11.863 7.64646C12.0583 7.84172 12.0583 8.1583 11.863 8.35356L8.68666 11.5299C8.4914 11.7252 8.17482 11.7252 7.97956 11.5299C7.7843 11.3347 7.7843 11.0181 7.97956 10.8228L10.3024 8.50001L4.49023 8.50002C4.21409 8.50002 3.99023 8.27616 3.99023 8.00002C3.99023 7.72388 4.21409 7.50002 4.49023 7.50002L10.3024 7.50001L7.97956 5.1772C7.7843 4.98194 7.7843 4.66536 7.97956 4.47009Z", fill: "currentColor" }) });
ArrowRight16.displayName = "ArrowRight16";
const Memo$1S = reactExports.memo(ArrowRight16);
const DollarCircle16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.99792 8.00001C2.99792 5.23743 5.23743 2.99792 8.00001 2.99792C10.7626 2.99792 13.0021 5.23743 13.0021 8.00001C13.0021 10.7626 10.7626 13.0021 8.00001 13.0021C5.23743 13.0021 2.99792 10.7626 2.99792 8.00001ZM8.00001 1.99792C4.68515 1.99792 1.99792 4.68515 1.99792 8.00001C1.99792 11.3149 4.68515 14.0021 8.00001 14.0021C11.3149 14.0021 14.0021 11.3149 14.0021 8.00001C14.0021 4.68515 11.3149 1.99792 8.00001 1.99792ZM8.50001 4.69875C8.50001 4.42261 8.27615 4.19875 8.00001 4.19875C7.72386 4.19875 7.50001 4.42261 7.50001 4.69875V5.29917H7.4498C6.56591 5.29917 5.84938 6.0157 5.84938 6.89959C5.84938 7.78347 6.56591 8.50001 7.4498 8.50001H8.55021C8.88181 8.50001 9.15063 8.76882 9.15063 9.10042C9.15063 9.43202 8.88181 9.70084 8.55021 9.70084H8.0007C8.00047 9.70084 8.00024 9.70084 8.00001 9.70084C7.99977 9.70084 7.99954 9.70084 7.99931 9.70084H6.34938C6.07324 9.70084 5.84938 9.9247 5.84938 10.2008C5.84938 10.477 6.07324 10.7008 6.34938 10.7008H7.50001V11.3013C7.50001 11.5774 7.72386 11.8013 8.00001 11.8013C8.27615 11.8013 8.50001 11.5774 8.50001 11.3013V10.7008H8.55021C9.4341 10.7008 10.1506 9.98431 10.1506 9.10042C10.1506 8.21654 9.4341 7.50001 8.55021 7.50001H7.4498C7.1182 7.50001 6.84938 7.23119 6.84938 6.89959C6.84938 6.56799 7.1182 6.29917 7.4498 6.29917H9.65063C9.92677 6.29917 10.1506 6.07532 10.1506 5.79917C10.1506 5.52303 9.92677 5.29917 9.65063 5.29917H8.50001V4.69875Z", fill: "currentColor" }) });
DollarCircle16.displayName = "DollarCircle16";
const Memo$1R = reactExports.memo(DollarCircle16);
const DollarSquare16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00001 4.19874C8.27615 4.19874 8.50001 4.4226 8.50001 4.69874V5.29916H9.65063C9.92677 5.29916 10.1506 5.52302 10.1506 5.79916C10.1506 6.0753 9.92677 6.29916 9.65063 6.29916H7.4498C7.1182 6.29916 6.84938 6.56798 6.84938 6.89958C6.84938 7.23118 7.1182 7.5 7.4498 7.5H8.55021C9.4341 7.5 10.1506 8.21653 10.1506 9.10041C10.1506 9.9843 9.4341 10.7008 8.55021 10.7008H8.50001V11.3012C8.50001 11.5774 8.27615 11.8012 8.00001 11.8012C7.72386 11.8012 7.50001 11.5774 7.50001 11.3012V10.7008H6.34938C6.07324 10.7008 5.84938 10.477 5.84938 10.2008C5.84938 9.92469 6.07324 9.70083 6.34938 9.70083H7.99931C7.99908 9.70083 7.99954 9.70083 7.99931 9.70083C7.99954 9.70083 8.00047 9.70083 8.0007 9.70083H8.55021C8.88181 9.70083 9.15063 9.43201 9.15063 9.10041C9.15063 8.76881 8.88181 8.5 8.55021 8.5H7.4498C6.56591 8.5 5.84938 7.78347 5.84938 6.89958C5.84938 6.01569 6.56591 5.29916 7.4498 5.29916H7.50001V4.69874C7.50001 4.4226 7.72386 4.19874 8.00001 4.19874Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.5 4C1.5 2.61929 2.61929 1.5 4 1.5H12C13.3807 1.5 14.5 2.61929 14.5 4V12C14.5 13.3807 13.3807 14.5 12 14.5H4C2.61929 14.5 1.5 13.3807 1.5 12V4ZM4 2.5C3.17157 2.5 2.5 3.17157 2.5 4V12C2.5 12.8284 3.17157 13.5 4 13.5H12C12.8284 13.5 13.5 12.8284 13.5 12V4C13.5 3.17157 12.8284 2.5 12 2.5H4Z", fill: "currentColor" })] });
DollarSquare16.displayName = "DollarSquare16";
const Memo$1Q = reactExports.memo(DollarSquare16);
const ArrowExternal24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.25 7.90001C6.89101 7.90001 6.6 7.60899 6.6 7.25001C6.6 6.89102 6.89101 6.60001 7.25 6.60001H16.75C17.109 6.60001 17.4 6.89102 17.4 7.25001V16.75C17.4 17.109 17.109 17.4 16.75 17.4C16.391 17.4 16.1 17.109 16.1 16.75V8.81924L7.70962 17.2096C7.45578 17.4635 7.04422 17.4635 6.79038 17.2096C6.53654 16.9558 6.53654 16.5442 6.79038 16.2904L15.1808 7.90001H7.25Z", fill: "currentColor" }) });
ArrowExternal24.displayName = "ArrowExternal24";
const Memo$1P = reactExports.memo(ArrowExternal24);
const ArrowExternal16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83333 5.33334C4.55719 5.33334 4.33333 5.10948 4.33333 4.83334C4.33333 4.55719 4.55719 4.33334 4.83333 4.33334H11.1667L11.6667 4.83334V11.1667C11.6667 11.4428 11.4428 11.6667 11.1667 11.6667C10.8905 11.6667 10.6667 11.4428 10.6667 11.1667V6.04044L5.18688 11.5202C4.99162 11.7155 4.67504 11.7155 4.47977 11.5202C4.28451 11.325 4.28451 11.0084 4.47977 10.8131L9.95956 5.33334H4.83333Z", fill: "currentColor" }) });
ArrowExternal16.displayName = "ArrowExternal16";
const Memo$1O = reactExports.memo(ArrowExternal16);
const Trash16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.01001 2.77523C5.01001 1.9468 5.68158 1.27523 6.51001 1.27523H9.48987C10.3183 1.27523 10.9899 1.9468 10.9899 2.77523V3.76506H12.3573H12.8573H13.6021C13.8783 3.76506 14.1021 3.98892 14.1021 4.26506C14.1021 4.5412 13.8783 4.76506 13.6021 4.76506H12.8573V13.2248C12.8573 14.0532 12.1858 14.7248 11.3573 14.7248H4.64258C3.81415 14.7248 3.14258 14.0532 3.14258 13.2248V4.76506H2.39746C2.12132 4.76506 1.89746 4.5412 1.89746 4.26506C1.89746 3.98892 2.12132 3.76506 2.39746 3.76506H3.14258H3.64258H5.01001V2.77523ZM6.01001 3.76506H9.98987V2.77523C9.98987 2.49909 9.76601 2.27523 9.48987 2.27523H6.51001C6.23387 2.27523 6.01001 2.49909 6.01001 2.77523V3.76506ZM4.14258 4.76506V13.2248C4.14258 13.5009 4.36644 13.7248 4.64258 13.7248H11.3573C11.6335 13.7248 11.8573 13.5009 11.8573 13.2248V4.76506H4.14258ZM6.75513 6.87752C7.03127 6.87752 7.25513 7.10138 7.25513 7.37752V11.1124C7.25513 11.3886 7.03127 11.6124 6.75513 11.6124C6.47898 11.6124 6.25513 11.3886 6.25513 11.1124V7.37752C6.25513 7.10138 6.47898 6.87752 6.75513 6.87752ZM9.74487 7.37752C9.74487 7.10138 9.52102 6.87752 9.24487 6.87752C8.96873 6.87752 8.74487 7.10138 8.74487 7.37752V11.1124C8.74487 11.3886 8.96873 11.6124 9.24487 11.6124C9.52102 11.6124 9.74487 11.3886 9.74487 11.1124V7.37752Z", fill: "currentColor" }) });
Trash16.displayName = "Trash16";
const Memo$1N = reactExports.memo(Trash16);
const CloseFilled24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM9.08462 8.16538C8.83078 7.91154 8.41922 7.91154 8.16538 8.16538C7.91154 8.41922 7.91154 8.83078 8.16538 9.08462L11.0808 12L8.16538 14.9154C7.91154 15.1692 7.91154 15.5808 8.16538 15.8346C8.41922 16.0885 8.83078 16.0885 9.08462 15.8346L12 12.9192L14.9154 15.8346C15.1692 16.0885 15.5808 16.0885 15.8346 15.8346C16.0885 15.5808 16.0885 15.1692 15.8346 14.9154L12.9192 12L15.8346 9.08462C16.0885 8.83078 16.0885 8.41922 15.8346 8.16538C15.5808 7.91154 15.1692 7.91154 14.9154 8.16538L12 11.0808L9.08462 8.16538Z", fill: "currentColor" }) });
CloseFilled24.displayName = "CloseFilled24";
const Memo$1M = reactExports.memo(CloseFilled24);
const CloseFilled16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM5.29038 5.29038C5.54422 5.03654 5.95578 5.03654 6.20962 5.29038L8 7.08076L9.79038 5.29038C10.0442 5.03654 10.4558 5.03654 10.7096 5.29038C10.9635 5.54422 10.9635 5.95578 10.7096 6.20962L8.91924 8L10.7096 9.79038C10.9635 10.0442 10.9635 10.4558 10.7096 10.7096C10.4558 10.9635 10.0442 10.9635 9.79038 10.7096L8 8.91924L6.20962 10.7096C5.95578 10.9635 5.54422 10.9635 5.29038 10.7096C5.03654 10.4558 5.03654 10.0442 5.29038 9.79038L7.08076 8L5.29038 6.20962C5.03654 5.95578 5.03654 5.54422 5.29038 5.29038Z", fill: "currentColor" }) });
CloseFilled16.displayName = "CloseFilled16";
const Memo$1L = reactExports.memo(CloseFilled16);
const InfoError16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_302_731)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8.80001 4C8.80001 3.55817 8.44184 3.2 8.00001 3.2C7.55818 3.2 7.20001 3.55817 7.20001 4V8C7.20001 8.44182 7.55818 8.8 8.00001 8.8C8.44184 8.8 8.80001 8.44182 8.80001 8V4ZM8.00001 10.5333C7.55818 10.5333 7.20001 10.8915 7.20001 11.3333C7.20001 11.7752 7.55818 12.1333 8.00001 12.1333H8.00668C8.44851 12.1333 8.80668 11.7752 8.80668 11.3333C8.80668 10.8915 8.44851 10.5333 8.00668 10.5333H8.00001Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_302_731", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
InfoError16.displayName = "InfoError16";
const Memo$1K = reactExports.memo(InfoError16);
const Error16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_9823_47436)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 1.83334C4.59424 1.83334 1.83333 4.59425 1.83333 8.00001C1.83333 11.4058 4.59424 14.1667 8 14.1667C11.4058 14.1667 14.1667 11.4058 14.1667 8.00001C14.1667 4.59425 11.4058 1.83334 8 1.83334ZM0.833332 8.00001C0.833332 4.04197 4.04196 0.833344 8 0.833344C11.958 0.833344 15.1667 4.04197 15.1667 8.00001C15.1667 11.9581 11.958 15.1667 8 15.1667C4.04196 15.1667 0.833332 11.9581 0.833332 8.00001ZM5.5 6.00001C5.5 5.72387 5.72386 5.50001 6 5.50001H6.00667C6.28281 5.50001 6.50667 5.72387 6.50667 6.00001C6.50667 6.27615 6.28281 6.50001 6.00667 6.50001H6C5.72386 6.50001 5.5 6.27615 5.5 6.00001ZM9.5 6.00001C9.5 5.72387 9.72386 5.50001 10 5.50001H10.0067C10.2828 5.50001 10.5067 5.72387 10.5067 6.00001C10.5067 6.27615 10.2828 6.50001 10.0067 6.50001H10C9.72386 6.50001 9.5 6.27615 9.5 6.00001ZM5.74758 9.59564C6.26113 9.22215 7.0289 8.83334 8 8.83334C8.9711 8.83334 9.73887 9.22215 10.2524 9.59564C10.5102 9.78309 10.7094 9.97049 10.8454 10.1124C10.9136 10.1836 10.9665 10.2439 11.0034 10.288C11.0219 10.31 11.0365 10.328 11.0471 10.3414L11.0599 10.3578L11.064 10.3632L11.0655 10.3652L11.0661 10.366C11.0661 10.366 11.0661 10.366 11.0661 10.3578V10.366C11.2318 10.5869 11.1876 10.901 10.9667 11.0667C10.746 11.2322 10.4331 11.1877 10.2673 10.9675L10.263 10.9621C10.2581 10.9559 10.2496 10.9452 10.2375 10.9308C10.2132 10.902 10.175 10.8581 10.1234 10.8043C10.0198 10.6962 9.86484 10.5503 9.66425 10.4044C9.26113 10.1112 8.69557 9.83334 8 9.83334C7.30443 9.83334 6.73887 10.1112 6.33575 10.4044C6.13516 10.5503 5.98022 10.6962 5.87662 10.8043C5.82503 10.8581 5.78677 10.902 5.76254 10.9308C5.75045 10.9452 5.7419 10.9559 5.73699 10.9621L5.73257 10.9677C5.56683 11.1883 5.25415 11.2323 5.03333 11.0667C4.81242 10.901 4.76765 10.5876 4.93333 10.3667V10.3578C4.93333 10.3414 4.93333 10.3667 4.93333 10.3667L4.93446 10.3652L4.93597 10.3632L4.94012 10.3578L4.95295 10.3414C4.9635 10.328 4.97807 10.31 4.99657 10.288C5.03354 10.2439 5.08643 10.1836 5.15463 10.1124C5.29062 9.97049 5.48984 9.78309 5.74758 9.59564Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_9823_47436", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
Error16.displayName = "Error16";
const Memo$1J = reactExports.memo(Error16);
const SortDrag16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.5 5C3.5 4.72386 3.72386 4.5 4 4.5H12C12.2761 4.5 12.5 4.72386 12.5 5C12.5 5.27614 12.2761 5.5 12 5.5H4C3.72386 5.5 3.5 5.27614 3.5 5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.5 8C3.5 7.72386 3.72386 7.5 4 7.5H12C12.2761 7.5 12.5 7.72386 12.5 8C12.5 8.27614 12.2761 8.5 12 8.5H4C3.72386 8.5 3.5 8.27614 3.5 8Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.5 11C3.5 10.7239 3.72386 10.5 4 10.5H12C12.2761 10.5 12.5 10.7239 12.5 11C12.5 11.2761 12.2761 11.5 12 11.5H4C3.72386 11.5 3.5 11.2761 3.5 11Z", fill: "currentColor" })] });
SortDrag16.displayName = "SortDrag16";
const Memo$1I = reactExports.memo(SortDrag16);
const Search24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11 4.65001C7.49299 4.65001 4.65 7.493 4.65 11C4.65 14.507 7.49299 17.35 11 17.35C14.507 17.35 17.35 14.507 17.35 11C17.35 7.493 14.507 4.65001 11 4.65001ZM3.35 11C3.35 6.77503 6.77502 3.35001 11 3.35001C15.225 3.35001 18.65 6.77503 18.65 11C18.65 15.225 15.225 18.65 11 18.65C6.77502 18.65 3.35 15.225 3.35 11Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.5404 15.5404C15.7942 15.2865 16.2058 15.2865 16.4596 15.5404L20.4596 19.5404C20.7135 19.7942 20.7135 20.2058 20.4596 20.4596C20.2058 20.7135 19.7942 20.7135 19.5404 20.4596L15.5404 16.4596C15.2865 16.2058 15.2865 15.7942 15.5404 15.5404Z", fill: "currentColor" })] });
Search24.displayName = "Search24";
const Memo$1H = reactExports.memo(Search24);
const Search16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.08223 7.29471C2.08223 4.41597 4.41591 2.08228 7.29465 2.08228C10.1734 2.08228 12.5071 4.41597 12.5071 7.29471C12.5071 10.1735 10.1734 12.5071 7.29465 12.5071C4.41591 12.5071 2.08223 10.1735 2.08223 7.29471ZM7.29465 1.08228C3.86363 1.08228 1.08223 3.86368 1.08223 7.29471C1.08223 10.7257 3.86363 13.5071 7.29465 13.5071C8.83024 13.5071 10.2357 12.95 11.3199 12.0268L14.731 15.4379C14.9263 15.6332 15.2429 15.6332 15.4381 15.4379C15.6334 15.2427 15.6334 14.9261 15.4381 14.7308L12.027 11.3197C12.95 10.2355 13.5071 8.83017 13.5071 7.29471C13.5071 3.86368 10.7257 1.08228 7.29465 1.08228Z", fill: "currentColor" }) });
Search16.displayName = "Search16";
const Memo$1G = reactExports.memo(Search16);
const Intercom = (props) => jsxRuntimeExports.jsxs("svg", { width: 108, height: 108, viewBox: "0 0 108 108", fill: "none", ...props, children: [jsxRuntimeExports.jsxs("g", { filter: "url(#filter0_ddddd_130_814)", children: [jsxRuntimeExports.jsx("circle", { cx: 54, cy: 30, r: 22, fill: "url(#paint0_linear_130_814)" }), jsxRuntimeExports.jsx("path", { d: "M64.2666 40.9992C64.2666 41.3517 63.913 41.5942 63.5849 41.4653C62.455 41.0212 60.1184 40.104 58.1007 39.3179C58.0428 39.2954 57.9817 39.284 57.9196 39.284H46.2538C44.8627 39.284 43.7333 38.0857 43.7333 36.6095V20.9389C43.7333 19.4642 44.8627 18.2667 46.2538 18.2667H61.7455C63.1373 18.2667 64.2659 19.4635 64.2659 20.9397V34.4359L64.2666 40.9992ZM61.2314 32.9465C61.1765 32.876 61.1075 32.8177 61.0289 32.7753C60.9502 32.7328 60.8637 32.7071 60.7746 32.6999C60.6855 32.6927 60.5959 32.704 60.5114 32.7332C60.427 32.7624 60.3495 32.8088 60.2839 32.8695C60.2619 32.8886 58.0729 34.8356 53.9993 34.8356C49.9762 34.8356 47.7535 32.9025 47.7139 32.8673C47.6482 32.8069 47.5708 32.7608 47.4864 32.7319C47.402 32.703 47.3126 32.6918 47.2237 32.6992C47.1348 32.7066 47.0484 32.7323 46.9699 32.7747C46.8915 32.8172 46.8227 32.8754 46.7679 32.9458C46.6505 33.0923 46.5931 33.2778 46.6073 33.465C46.6197 33.6512 46.7032 33.8255 46.8405 33.9519C46.9446 34.0458 49.4343 36.2619 53.9993 36.2619C58.565 36.2619 61.0547 34.0458 61.1588 33.9519C61.2958 33.8254 61.3791 33.6511 61.3913 33.465C61.4055 33.2782 61.3483 33.0929 61.2314 32.9465Z", fill: "white" })] }), jsxRuntimeExports.jsxs("defs", { children: [jsxRuntimeExports.jsxs("filter", { id: "filter0_ddddd_130_814", x: 0, y: 0, width: 108, height: 108, filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [jsxRuntimeExports.jsx("feFlood", { floodOpacity: 0, result: "BackgroundImageFix" }), jsxRuntimeExports.jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsxRuntimeExports.jsx("feOffset", {}), jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: 0.5 }), jsxRuntimeExports.jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow_130_814" }), jsxRuntimeExports.jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsxRuntimeExports.jsx("feOffset", { dy: 4 }), jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: 4 }), jsxRuntimeExports.jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in2: "effect1_dropShadow_130_814", result: "effect2_dropShadow_130_814" }), jsxRuntimeExports.jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsxRuntimeExports.jsx("feOffset", { dy: 16 }), jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: 12 }), jsxRuntimeExports.jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in2: "effect2_dropShadow_130_814", result: "effect3_dropShadow_130_814" }), jsxRuntimeExports.jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsxRuntimeExports.jsx("feOffset", { dy: 24 }), jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: 16 }), jsxRuntimeExports.jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in2: "effect3_dropShadow_130_814", result: "effect4_dropShadow_130_814" }), jsxRuntimeExports.jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsxRuntimeExports.jsx("feOffset", { dy: 4 }), jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: 2 }), jsxRuntimeExports.jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in2: "effect4_dropShadow_130_814", result: "effect5_dropShadow_130_814" }), jsxRuntimeExports.jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect5_dropShadow_130_814", result: "shape" })] }), jsxRuntimeExports.jsxs("linearGradient", { id: "paint0_linear_130_814", x1: 32, y1: 30, x2: 76, y2: 30, gradientUnits: "userSpaceOnUse", children: [jsxRuntimeExports.jsx("stop", { stopColor: "#26ABFF" }), jsxRuntimeExports.jsx("stop", { offset: 1, stopColor: "#00CCFF" })] })] })] });
Intercom.displayName = "Intercom";
const Memo$1F = reactExports.memo(Intercom);
const Delete24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.51083 3.57198C7.63426 3.43092 7.81257 3.35001 8.00001 3.35001H21C21.7028 3.35001 22.3769 3.6292 22.8738 4.12617C23.3708 4.62314 23.65 5.29718 23.65 6.00001V18C23.65 18.7028 23.3708 19.3769 22.8738 19.8738C22.3769 20.3708 21.7028 20.65 21 20.65H8.00001C7.81257 20.65 7.63426 20.5691 7.51083 20.428L0.510831 12.428C0.296398 12.183 0.296398 11.817 0.510831 11.572L7.51083 3.57198ZM8.29496 4.65001L1.86371 12L8.29496 19.35H21C21.358 19.35 21.7014 19.2078 21.9546 18.9546C22.2078 18.7014 22.35 18.358 22.35 18V6.00001C22.35 5.64196 22.2078 5.29859 21.9546 5.04541C21.7014 4.79224 21.358 4.65001 21 4.65001H8.29496ZM11.5404 8.54039C11.7942 8.28655 12.2058 8.28655 12.4596 8.54039L15 11.0808L17.5404 8.54039C17.7942 8.28655 18.2058 8.28655 18.4596 8.54039C18.7135 8.79423 18.7135 9.20578 18.4596 9.45963L15.9192 12L18.4596 14.5404C18.7135 14.7942 18.7135 15.2058 18.4596 15.4596C18.2058 15.7135 17.7942 15.7135 17.5404 15.4596L15 12.9192L12.4596 15.4596C12.2058 15.7135 11.7942 15.7135 11.5404 15.4596C11.2865 15.2058 11.2865 14.7942 11.5404 14.5404L14.0808 12L11.5404 9.45963C11.2865 9.20578 11.2865 8.79423 11.5404 8.54039Z", fill: "currentColor" }) });
Delete24.displayName = "Delete24";
const Memo$1E = reactExports.memo(Delete24);
const Delete16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.95704 2.33741C5.05199 2.2289 5.18915 2.16666 5.33333 2.16666H14C14.4862 2.16666 14.9525 2.35982 15.2964 2.70363C15.6402 3.04745 15.8333 3.51377 15.8333 4V12C15.8333 12.4862 15.6402 12.9525 15.2964 13.2964C14.9525 13.6402 14.4862 13.8333 14 13.8333H5.33333C5.18915 13.8333 5.05199 13.7711 4.95704 13.6626L0.290378 8.32925C0.12543 8.14074 0.12543 7.85926 0.290378 7.67074L4.95704 2.33741ZM5.56022 3.16666L1.33105 8L5.56022 12.8333H14C14.221 12.8333 14.433 12.7455 14.5893 12.5893C14.7455 12.433 14.8333 12.221 14.8333 12V4C14.8333 3.77898 14.7455 3.56702 14.5893 3.41074C14.433 3.25446 14.221 3.16666 14 3.16666H5.56022Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.7071 6L8 10.7071L7.29289 10L12 5.29289L12.7071 6Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 5.29289L12.7071 10L12 10.7071L7.29289 6L8 5.29289Z", fill: "currentColor" })] });
Delete16.displayName = "Delete16";
const Memo$1D = reactExports.memo(Delete16);
const EyeOff24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_705_816)", children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.9985 4.65C11.3419 4.64846 10.6874 4.72326 10.0481 4.8729C9.69861 4.95472 9.34892 4.73769 9.26711 4.38815C9.18529 4.03861 9.40232 3.68893 9.75185 3.60711C10.489 3.43457 11.2437 3.34829 12.0007 3.35001C15.7601 3.35029 18.6697 5.49733 20.5992 7.55544C21.5699 8.59089 22.3121 9.62386 22.8117 10.3974C23.0618 10.7847 23.2522 11.1087 23.381 11.3376C23.4454 11.4521 23.4944 11.5429 23.5279 11.6061C23.5446 11.6378 23.5575 11.6625 23.5664 11.6799L23.5768 11.7003L23.5798 11.7063L23.5808 11.7082C23.5808 11.7082 23.5814 11.7093 23 12L22.4268 11.6936C22.3723 11.7954 22.3169 11.8967 22.2605 11.9974C22.2564 11.99 22.2522 11.9825 22.2479 11.9749C22.1306 11.7663 21.9538 11.4653 21.7196 11.1026C21.2504 10.3762 20.5551 9.40912 19.6508 8.44457C17.8304 6.50282 15.2403 4.65001 12 4.65001L11.9985 4.65ZM22.2605 11.9974C21.7104 12.9803 21.0682 13.9092 20.3426 14.7715C20.1115 15.0462 20.1468 15.4562 20.4215 15.6874C20.6962 15.9185 21.1062 15.8832 21.3374 15.6085C22.1955 14.5886 22.9449 13.4819 23.5732 12.3064C23.6726 12.1205 23.6757 11.8979 23.5814 11.7093L23 12C22.4186 12.2907 22.4188 12.291 22.4188 12.291L22.4173 12.2881L22.4102 12.2743C22.4036 12.2613 22.3931 12.2411 22.3788 12.2142C22.3524 12.1642 22.3129 12.0909 22.2605 11.9974ZM5.66551 5.5434C5.9243 5.34579 6.28938 5.37014 6.51962 5.60039L10.3371 9.41789C10.3386 9.41935 10.3401 9.42082 10.3415 9.4223L14.5777 13.6585C14.5792 13.6599 14.5807 13.6614 14.5821 13.6629L18.3996 17.4804C18.5322 17.613 18.6011 17.7964 18.5885 17.9836C18.576 18.1707 18.4832 18.3433 18.334 18.4569C16.5143 19.8441 14.2985 20.6125 12.0106 20.6499L12 20.6501C8.24032 20.6501 5.33041 18.5028 3.4008 16.4446C2.43007 15.4091 1.6879 14.3762 1.18835 13.6026C0.938167 13.2153 0.747771 12.8913 0.619021 12.6624C0.554622 12.5479 0.505572 12.4571 0.472109 12.3939C0.455375 12.3622 0.442532 12.3375 0.433609 12.3202L0.423166 12.2997L0.420155 12.2937L0.419203 12.2919C0.419203 12.2919 0.418621 12.2907 0.999999 12L0.418621 12.2907C0.324168 12.1018 0.327385 11.8788 0.427247 11.6927C1.71496 9.2929 3.50099 7.19626 5.66551 5.5434ZM1.73979 12.0032C1.74381 12.0104 1.7479 12.0177 1.75207 12.0251C1.86941 12.2337 2.04621 12.5347 2.2804 12.8974C2.74959 13.6239 3.44493 14.5909 4.3492 15.5554C6.16859 17.4961 8.75685 19.348 11.9947 19.35C13.753 19.3203 15.4628 18.7991 16.9334 17.8526L14.0925 15.0117C13.8808 15.168 13.6522 15.3012 13.4107 15.4089C12.963 15.6084 12.4796 15.7156 11.9896 15.7243C11.4995 15.7329 11.0127 15.6428 10.5582 15.4592C10.1037 15.2756 9.69082 15.0024 9.34423 14.6558C8.99763 14.3092 8.72439 13.8963 8.54082 13.4418C8.35724 12.9873 8.26709 12.5005 8.27573 12.0104C8.28438 11.5204 8.39165 11.037 8.59115 10.5893C8.69877 10.3478 8.83205 10.1192 8.98829 9.90753L6.00896 6.9282C4.28107 8.33706 2.83267 10.0585 1.73979 12.0032ZM9.92384 10.8431C9.86952 10.9314 9.82098 11.0233 9.77861 11.1184C9.65016 11.4067 9.5811 11.7178 9.57553 12.0334C9.56996 12.3489 9.62801 12.6623 9.7462 12.955C9.86439 13.2476 10.0403 13.5134 10.2635 13.7365C10.4866 13.9597 10.7524 14.1356 11.045 14.2538C11.3377 14.372 11.6511 14.43 11.9666 14.4245C12.2822 14.4189 12.5933 14.3498 12.8816 14.2214C12.9767 14.179 13.0687 14.1305 13.1569 14.0762L9.92384 10.8431Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.540379 0.540387C0.79422 0.286546 1.20578 0.286546 1.45962 0.540387L23.4596 22.5404C23.7135 22.7942 23.7135 23.2058 23.4596 23.4596C23.2058 23.7135 22.7942 23.7135 22.5404 23.4596L0.540379 1.45963C0.286538 1.20578 0.286538 0.794227 0.540379 0.540387Z", fill: "currentColor" })] }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_705_816", children: jsxRuntimeExports.jsx("rect", { width: 24, height: 24, fill: "white" }) }) })] });
EyeOff24.displayName = "EyeOff24";
const Memo$1C = reactExports.memo(EyeOff24);
const EyeOff16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_1049_4206)", children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.99882 3.16666C7.56629 3.16564 7.13511 3.21492 6.71396 3.3135C6.44508 3.37644 6.17609 3.20949 6.11316 2.94061C6.05022 2.67174 6.21717 2.40275 6.48604 2.33982C6.98248 2.22361 7.49074 2.16551 8.00059 2.16666C10.5334 2.16688 12.4895 3.61332 13.7814 4.99135C14.432 5.68529 14.9292 6.37731 15.2638 6.8954C15.4314 7.15492 15.559 7.37206 15.6454 7.52569C15.6886 7.60254 15.7216 7.6636 15.7442 7.70624C15.7555 7.72756 15.7641 7.74428 15.7702 7.75608L15.7773 7.77005L15.7794 7.77418L15.7801 7.77553C15.7802 7.77572 15.7805 7.77638 15.3333 7.99999L14.8924 7.76429C14.8504 7.84279 14.8076 7.92079 14.7639 7.99828C14.6863 7.86113 14.5725 7.66832 14.4237 7.43792C14.1125 6.956 13.6513 6.31469 13.0519 5.6753C11.8439 4.38677 10.1336 3.16666 8 3.16666L7.99882 3.16666ZM14.7639 7.99828C14.4032 8.63785 13.9837 9.24263 13.5108 9.80474C13.333 10.016 13.3601 10.3314 13.5714 10.5092C13.7827 10.687 14.0981 10.6599 14.2759 10.4486C14.851 9.76511 15.3532 9.02346 15.7743 8.2357C15.8507 8.09267 15.8526 7.92059 15.7801 7.77553L15.3333 7.99999C14.8861 8.2236 14.8862 8.22373 14.8862 8.22384L14.8854 8.22221L14.8809 8.21331C14.8778 8.20738 14.8735 8.19904 14.8679 8.1884C14.8656 8.18398 14.8631 8.17916 14.8603 8.17395C14.8415 8.13846 14.8126 8.08494 14.7738 8.01596C14.7706 8.01017 14.7673 8.00428 14.7639 7.99828ZM3.73655 3.6426C3.93562 3.49059 4.21644 3.50933 4.39355 3.68644L6.93825 6.23114C6.93942 6.23229 6.94058 6.23345 6.94174 6.23462L9.76537 9.05826C9.76654 9.05941 9.7677 9.06057 9.76885 9.06173L12.3136 11.6064C12.4156 11.7085 12.4685 11.8496 12.4589 11.9935C12.4492 12.1374 12.3778 12.2702 12.2631 12.3576C11.0386 13.291 9.54762 13.8081 8.00817 13.8333L8 13.8334C5.46691 13.8334 3.51057 12.3868 2.21856 11.0086C1.568 10.3147 1.07082 9.62267 0.73623 9.10459C0.568623 8.84507 0.440995 8.62792 0.354577 8.47429C0.311349 8.39744 0.278376 8.33638 0.255815 8.29375C0.244533 8.27243 0.235849 8.2557 0.229784 8.24391L0.222649 8.22994L0.220558 8.2258L0.219882 8.22446C0.219785 8.22426 0.219453 8.2236 0.666667 7.99999L0.219882 8.22446C0.147227 8.07914 0.149272 7.90673 0.226089 7.76358C1.08906 6.15535 2.28598 4.75028 3.73655 3.6426ZM1.23638 8.00216C1.31394 8.13928 1.42763 8.33192 1.57627 8.56206C1.88751 9.04398 2.34867 9.68529 2.9481 10.3247C4.15532 11.6124 5.86424 12.8318 7.99592 12.8333C9.12774 12.8141 10.229 12.4861 11.1829 11.89L9.38794 10.095C9.25618 10.1877 9.11545 10.2676 8.9676 10.3335C8.66093 10.4701 8.32989 10.5436 7.99421 10.5495C7.65854 10.5554 7.32511 10.4937 7.01381 10.3679C6.70252 10.2422 6.41974 10.055 6.18234 9.81765C5.94495 9.58025 5.7578 9.29747 5.63206 8.98618C5.50633 8.67488 5.44458 8.34145 5.4505 8.00578C5.45642 7.6701 5.5299 7.33906 5.66654 7.03239C5.73241 6.88454 5.81233 6.74381 5.90496 6.61206L4.00153 4.70863C2.88624 5.62752 1.9488 6.74381 1.23638 8.00216ZM6.63018 7.33728C6.61219 7.37062 6.59543 7.40468 6.57997 7.43939C6.49798 7.62339 6.4539 7.82201 6.45034 8.02342C6.44679 8.22482 6.48384 8.42488 6.55928 8.61166C6.63472 8.79844 6.74701 8.9681 6.88945 9.11054C7.03189 9.25298 7.20156 9.36527 7.38833 9.44071C7.57511 9.51615 7.77517 9.5532 7.97657 9.54965C8.17798 9.54609 8.3766 9.50201 8.5606 9.42003C8.59531 9.40456 8.62937 9.3878 8.66271 9.36981L6.63018 7.33728Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.313113 0.313103C0.508375 0.117841 0.824958 0.117841 1.02022 0.313103L15.6869 14.9798C15.8821 15.175 15.8821 15.4916 15.6869 15.6869C15.4916 15.8821 15.175 15.8821 14.9798 15.6869L0.313113 1.02021C0.117851 0.824948 0.117851 0.508365 0.313113 0.313103Z", fill: "currentColor" })] }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1049_4206", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
EyeOff16.displayName = "EyeOff16";
const Memo$1B = reactExports.memo(EyeOff16);
const Eye24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.738 12C1.74259 12.0082 1.74728 12.0166 1.75207 12.0251C1.86941 12.2337 2.04621 12.5347 2.2804 12.8974C2.74959 13.6239 3.44493 14.5909 4.3492 15.5554C6.16959 17.4972 8.75968 19.35 12 19.35C15.2403 19.35 17.8304 17.4972 19.6508 15.5554C20.5551 14.5909 21.2504 13.6239 21.7196 12.8974C21.9538 12.5347 22.1306 12.2337 22.2479 12.0251C22.2527 12.0166 22.2574 12.0082 22.262 12C22.2574 11.9918 22.2527 11.9834 22.2479 11.9749C22.1306 11.7663 21.9538 11.4653 21.7196 11.1026C21.2504 10.3762 20.5551 9.40912 19.6508 8.44457C17.8304 6.50282 15.2403 4.65001 12 4.65001C8.75968 4.65001 6.16959 6.50282 4.3492 8.44457C3.44493 9.40912 2.74959 10.3762 2.2804 11.1026C2.04621 11.4653 1.86941 11.7663 1.75207 11.9749C1.74728 11.9834 1.74259 11.9918 1.738 12ZM23 12C23.5814 11.7093 23.5813 11.7091 23.5811 11.7088L23.5798 11.7063L23.5768 11.7003L23.5664 11.6799C23.5575 11.6625 23.5446 11.6378 23.5279 11.6061C23.4944 11.5429 23.4454 11.4521 23.381 11.3376C23.2522 11.1087 23.0618 10.7847 22.8116 10.3974C22.3121 9.62386 21.5699 8.59089 20.5992 7.55544C18.6696 5.49719 15.7597 3.35001 12 3.35001C8.24032 3.35001 5.33041 5.49719 3.4008 7.55544C2.43007 8.59089 1.6879 9.62386 1.18835 10.3974C0.938167 10.7847 0.747771 11.1087 0.619021 11.3376C0.554622 11.4521 0.505572 11.5429 0.472109 11.6061C0.455375 11.6378 0.442532 11.6625 0.433609 11.6799L0.423166 11.7003L0.420155 11.7063L0.419203 11.7082C0.419073 11.7084 0.418621 11.7093 0.999998 12L0.418621 11.7093C0.327124 11.8923 0.327124 12.1077 0.418621 12.2907L0.999998 12C0.418621 12.2907 0.418491 12.2904 0.418621 12.2907L0.420155 12.2938L0.423166 12.2997L0.433609 12.3202C0.442532 12.3375 0.455375 12.3622 0.472109 12.3939C0.505572 12.4571 0.554622 12.5479 0.619021 12.6624C0.747771 12.8913 0.938167 13.2153 1.18835 13.6026C1.6879 14.3762 2.43007 15.4091 3.4008 16.4446C5.33041 18.5028 8.24032 20.65 12 20.65C15.7597 20.65 18.6696 18.5028 20.5992 16.4446C21.5699 15.4091 22.3121 14.3762 22.8116 13.6026C23.0618 13.2153 23.2522 12.8913 23.381 12.6624C23.4454 12.5479 23.4944 12.4571 23.5279 12.3939C23.5446 12.3622 23.5575 12.3375 23.5664 12.3202L23.5768 12.2997L23.5798 12.2938L23.5808 12.2919C23.5809 12.2916 23.5814 12.2907 23 12ZM23 12L23.5814 12.2907C23.6729 12.1077 23.6726 11.8918 23.5811 11.7088L23 12ZM12 9.65001C10.7021 9.65001 9.65 10.7021 9.65 12C9.65 13.2979 10.7021 14.35 12 14.35C13.2979 14.35 14.35 13.2979 14.35 12C14.35 10.7021 13.2979 9.65001 12 9.65001ZM8.35 12C8.35 9.98417 9.98416 8.35001 12 8.35001C14.0158 8.35001 15.65 9.98417 15.65 12C15.65 14.0158 14.0158 15.65 12 15.65C9.98416 15.65 8.35 14.0158 8.35 12Z", fill: "currentColor" }) });
Eye24.displayName = "Eye24";
const Memo$1A = reactExports.memo(Eye24);
const Eye16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.23515 7.99999C1.31274 8.13725 1.42685 8.3307 1.57627 8.56206C1.88751 9.04398 2.34867 9.68529 2.9481 10.3247C4.15609 11.6132 5.86642 12.8333 8 12.8333C10.1336 12.8333 11.8439 11.6132 13.0519 10.3247C13.6513 9.68529 14.1125 9.04398 14.4237 8.56206C14.5731 8.3307 14.6873 8.13724 14.7648 7.99999C14.6873 7.86273 14.5731 7.66928 14.4237 7.43792C14.1125 6.956 13.6513 6.31469 13.0519 5.67529C11.8439 4.38677 10.1336 3.16666 8 3.16666C5.86642 3.16666 4.15609 4.38677 2.9481 5.67529C2.34867 6.31469 1.88751 6.956 1.57627 7.43792C1.42685 7.66928 1.31274 7.86273 1.23515 7.99999ZM15.3333 7.99999C15.7805 7.77638 15.7805 7.77621 15.7804 7.77602L15.7794 7.77418L15.7773 7.77004L15.7702 7.75608C15.7641 7.74428 15.7555 7.72755 15.7442 7.70623C15.7216 7.6636 15.6887 7.60254 15.6454 7.52569C15.559 7.37206 15.4314 7.15491 15.2638 6.89539C14.9292 6.37731 14.432 5.68529 13.7814 4.99135C12.4894 3.61321 10.5331 2.16666 8 2.16666C5.46691 2.16666 3.51057 3.61321 2.21857 4.99135C1.568 5.68529 1.07082 6.37731 0.736231 6.89539C0.568624 7.15491 0.440996 7.37206 0.354578 7.52569C0.31135 7.60254 0.278377 7.6636 0.255816 7.70623C0.244534 7.72755 0.23585 7.74428 0.229784 7.75608L0.22265 7.77004L0.220559 7.77418L0.219883 7.77553C0.219786 7.77572 0.219454 7.77638 0.666667 7.99999L0.219883 7.77553C0.149501 7.91629 0.149072 8.08283 0.219454 8.2236L0.666667 7.99999C0.219454 8.2236 0.219357 8.2234 0.219454 8.2236L0.220559 8.2258L0.22265 8.22994L0.229784 8.2439C0.23585 8.2557 0.244534 8.27242 0.255816 8.29374C0.278377 8.33638 0.31135 8.39744 0.354578 8.47429C0.440996 8.62792 0.568624 8.84506 0.736231 9.10459C1.07082 9.62267 1.568 10.3147 2.21857 11.0086C3.51057 12.3868 5.46691 13.8333 8 13.8333C10.5331 13.8333 12.4894 12.3868 13.7814 11.0086C14.432 10.3147 14.9292 9.62267 15.2638 9.10459C15.4314 8.84506 15.559 8.62792 15.6454 8.47429C15.6887 8.39744 15.7216 8.33638 15.7442 8.29374C15.7555 8.27242 15.7641 8.2557 15.7702 8.2439L15.7773 8.22994L15.7794 8.2258L15.7801 8.22445C15.7802 8.22426 15.7805 8.2236 15.3333 7.99999ZM15.3333 7.99999L15.7801 8.22445C15.8505 8.08369 15.8507 7.91678 15.7804 7.77602L15.3333 7.99999Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 6.49999C7.17157 6.49999 6.5 7.17157 6.5 7.99999C6.5 8.82842 7.17157 9.49999 8 9.49999C8.82843 9.49999 9.5 8.82842 9.5 7.99999C9.5 7.17157 8.82843 6.49999 8 6.49999ZM5.5 7.99999C5.5 6.61928 6.61929 5.49999 8 5.49999C9.38071 5.49999 10.5 6.61928 10.5 7.99999C10.5 9.3807 9.38071 10.5 8 10.5C6.61929 10.5 5.5 9.3807 5.5 7.99999Z", fill: "currentColor" })] });
Eye16.displayName = "Eye16";
const Memo$1z = reactExports.memo(Eye16);
const Chat24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18.2222 4.65001C18.5213 4.65001 18.8082 4.76883 19.0197 4.98032C19.2312 5.19182 19.35 5.47868 19.35 5.77778V18.4308L16.9041 15.9848C16.7822 15.8629 16.6168 15.7945 16.4444 15.7945H5.77778C5.47867 15.7945 5.19182 15.6756 4.98032 15.4641C4.76882 15.2526 4.65 14.9658 4.65 14.6667V5.77778C4.65 5.47868 4.76882 5.19182 4.98032 4.98032C5.19182 4.76883 5.47867 4.65001 5.77778 4.65001H18.2222ZM19.9389 4.06109C19.4836 3.60579 18.8661 3.35001 18.2222 3.35001H5.77778C5.13389 3.35001 4.51637 3.60579 4.06108 4.06109C3.60578 4.51638 3.35 5.1339 3.35 5.77778V14.6667C3.35 15.3106 3.60578 15.9281 4.06108 16.3834C4.51637 16.8387 5.13389 17.0944 5.77778 17.0944H16.1752L19.5404 20.4596C19.7263 20.6455 20.0059 20.7011 20.2487 20.6005C20.4916 20.4999 20.65 20.2629 20.65 20V5.77778C20.65 5.1339 20.3942 4.51638 19.9389 4.06109Z", fill: "currentColor" }) });
Chat24.displayName = "Chat24";
const Memo$1y = reactExports.memo(Chat24);
const Chat16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.1481 3.16666C12.3299 3.16666 12.5041 3.23885 12.6326 3.36735C12.7611 3.49585 12.8333 3.67013 12.8333 3.85185V12.1262L11.3165 10.6094C11.2227 10.5156 11.0956 10.463 10.963 10.463H3.85185C3.67013 10.463 3.49585 10.3908 3.36735 10.2623C3.23885 10.1338 3.16666 9.9595 3.16666 9.77777V3.85185C3.16666 3.67013 3.23885 3.49585 3.36735 3.36735C3.49585 3.23885 3.67013 3.16666 3.85185 3.16666H12.1481ZM13.3397 2.66024C13.0237 2.34421 12.5951 2.16666 12.1481 2.16666H3.85185C3.40491 2.16666 2.97628 2.34421 2.66024 2.66024C2.34421 2.97628 2.16666 3.40491 2.16666 3.85185V9.77777C2.16666 10.2247 2.34421 10.6533 2.66024 10.9694C2.97628 11.2854 3.40491 11.463 3.85185 11.463H10.7559L12.9798 13.6869C13.1228 13.8299 13.3378 13.8727 13.5247 13.7953C13.7115 13.7179 13.8333 13.5356 13.8333 13.3333V3.85185C13.8333 3.40491 13.6558 2.97628 13.3397 2.66024Z", fill: "currentColor" }) });
Chat16.displayName = "Chat16";
const Memo$1x = reactExports.memo(Chat16);
const Reports24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.12617 2.12617C4.62314 1.6292 5.29718 1.35001 6 1.35001H14C14.1724 1.35001 14.3377 1.41849 14.4596 1.54039L20.4596 7.54039C20.5815 7.66229 20.65 7.82762 20.65 8.00001V20C20.65 20.7028 20.3708 21.3769 19.8738 21.8738C19.3769 22.3708 18.7028 22.65 18 22.65H6C5.29718 22.65 4.62314 22.3708 4.12617 21.8738C3.6292 21.3769 3.35 20.7028 3.35 20V4.00001C3.35 3.29718 3.6292 2.62314 4.12617 2.12617ZM6 2.65001C5.64196 2.65001 5.29858 2.79224 5.04541 3.04541C4.79223 3.29859 4.65 3.64196 4.65 4.00001V20C4.65 20.358 4.79223 20.7014 5.04541 20.9546C5.29858 21.2078 5.64196 21.35 6 21.35H18C18.358 21.35 18.7014 21.2078 18.9546 20.9546C19.2078 20.7014 19.35 20.358 19.35 20V8.26925L13.7308 2.65001H6Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.35 9.00001C7.35 8.64102 7.64102 8.35001 8 8.35001H10C10.359 8.35001 10.65 8.64102 10.65 9.00001C10.65 9.35899 10.359 9.65001 10 9.65001H8C7.64102 9.65001 7.35 9.35899 7.35 9.00001ZM7.35 13C7.35 12.641 7.64102 12.35 8 12.35H16C16.359 12.35 16.65 12.641 16.65 13C16.65 13.359 16.359 13.65 16 13.65H8C7.64102 13.65 7.35 13.359 7.35 13ZM7.35 17C7.35 16.641 7.64102 16.35 8 16.35H16C16.359 16.35 16.65 16.641 16.65 17C16.65 17.359 16.359 17.65 16 17.65H8C7.64102 17.65 7.35 17.359 7.35 17Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14 1.35001C14.359 1.35001 14.65 1.64102 14.65 2.00001V7.35001H20C20.359 7.35001 20.65 7.64102 20.65 8.00001C20.65 8.35899 20.359 8.65001 20 8.65001H14C13.641 8.65001 13.35 8.35899 13.35 8.00001V2.00001C13.35 1.64102 13.641 1.35001 14 1.35001Z", fill: "currentColor" })] });
Reports24.displayName = "Reports24";
const Memo$1w = reactExports.memo(Reports24);
const Reports16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.70364 1.37031C3.04746 1.02649 3.51377 0.833336 4 0.833336H9.33334C9.46595 0.833336 9.59312 0.886014 9.68689 0.979783L13.6869 4.97978C13.7807 5.07355 13.8333 5.20073 13.8333 5.33334V13.3333C13.8333 13.8196 13.6402 14.2859 13.2964 14.6297C12.9525 14.9735 12.4862 15.1667 12 15.1667H4C3.51377 15.1667 3.04746 14.9735 2.70364 14.6297C2.35983 14.2859 2.16667 13.8196 2.16667 13.3333V2.66667C2.16667 2.18044 2.35983 1.71412 2.70364 1.37031ZM4 1.83334C3.77899 1.83334 3.56703 1.92113 3.41075 2.07741C3.25447 2.23369 3.16667 2.44566 3.16667 2.66667V13.3333C3.16667 13.5543 3.25447 13.7663 3.41075 13.9226C3.56703 14.0789 3.77899 14.1667 4 14.1667H12C12.221 14.1667 12.433 14.0789 12.5893 13.9226C12.7455 13.7663 12.8333 13.5543 12.8333 13.3333V5.54044L9.12623 1.83334H4Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83333 11.3333C4.83333 11.0572 5.05719 10.8333 5.33333 10.8333H10.6667C10.9428 10.8333 11.1667 11.0572 11.1667 11.3333C11.1667 11.6095 10.9428 11.8333 10.6667 11.8333H5.33333C5.05719 11.8333 4.83333 11.6095 4.83333 11.3333Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83333 8.66667C4.83333 8.39053 5.05719 8.16667 5.33333 8.16667H10.6667C10.9428 8.16667 11.1667 8.39053 11.1667 8.66667C11.1667 8.94281 10.9428 9.16667 10.6667 9.16667H5.33333C5.05719 9.16667 4.83333 8.94281 4.83333 8.66667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83333 6C4.83333 5.72386 5.05719 5.5 5.33333 5.5H6.66666C6.9428 5.5 7.16666 5.72386 7.16666 6C7.16666 6.27614 6.9428 6.5 6.66666 6.5H5.33333C5.05719 6.5 4.83333 6.27614 4.83333 6Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.33334 0.833336C9.60948 0.833336 9.83333 1.05719 9.83333 1.33334V4.83334H13.3333C13.6095 4.83334 13.8333 5.05719 13.8333 5.33334C13.8333 5.60948 13.6095 5.83334 13.3333 5.83334H9.33333C9.05719 5.83334 8.83333 5.60948 8.83333 5.33334V1.33334C8.83333 1.05719 9.05719 0.833336 9.33334 0.833336Z", fill: "currentColor" })] });
Reports16.displayName = "Reports16";
const Memo$1v = reactExports.memo(Reports16);
const Finish24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20.4488 6.52983C20.7085 6.7777 20.7181 7.18914 20.4702 7.44882L10.9247 17.4488C10.8021 17.5773 10.6322 17.65 10.4545 17.65C10.2769 17.65 10.107 17.5773 9.98436 17.4488L5.52982 12.7821C5.28195 12.5225 5.29152 12.111 5.55119 11.8632C5.81086 11.6153 6.22231 11.6249 6.47018 11.8845L10.4545 16.0586L19.5298 6.5512C19.7777 6.29152 20.1891 6.28196 20.4488 6.52983Z", fill: "currentColor" }) });
Finish24.displayName = "Finish24";
const Memo$1u = reactExports.memo(Finish24);
const Finish16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13.6786 4.30499C13.8783 4.49566 13.8857 4.81216 13.695 5.01191L7.33138 11.6786C7.23703 11.7774 7.10634 11.8333 6.9697 11.8333C6.83306 11.8333 6.70237 11.7774 6.60802 11.6786L3.63832 8.56747C3.44765 8.36772 3.45501 8.05122 3.65476 7.86055C3.85451 7.66988 4.17101 7.67724 4.36168 7.87699L6.9697 10.6092L12.9717 4.32143C13.1623 4.12169 13.4788 4.11433 13.6786 4.30499Z", fill: "currentColor" }) });
Finish16.displayName = "Finish16";
const Memo$1t = reactExports.memo(Finish16);
const FinishFilled16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_1558_24081)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM12.9717 5.94721C13.2187 5.68669 13.2077 5.27528 12.9472 5.0283C12.6867 4.78132 12.2753 4.79229 12.0283 5.0528L6.9681 10.3903L4.47019 7.77342C4.22232 7.51375 3.81087 7.50418 3.5512 7.75205C3.29152 7.99992 3.28196 8.41137 3.52983 8.67104L6.49952 11.7821C6.62244 11.9109 6.79279 11.9836 6.97081 11.9833C7.14883 11.983 7.31893 11.9097 7.44141 11.7805L12.9717 5.94721Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1558_24081", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, rx: 8, fill: "white" }) }) })] });
FinishFilled16.displayName = "FinishFilled16";
const Memo$1s = reactExports.memo(FinishFilled16);
const Edit24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0224 3.02239C14.2762 2.76855 14.6878 2.76855 14.9416 3.02239L20.9779 9.05863C21.2317 9.31247 21.2317 9.72403 20.9779 9.97787L11.0486 19.9072C10.9267 20.0291 10.7614 20.0976 10.589 20.0976L4.55275 20.0976C4.19376 20.0976 3.90275 19.8066 3.90275 19.4476L3.90274 13.4114C3.90275 13.239 3.97122 13.0737 4.09312 12.9518L14.0224 3.02239ZM14.482 4.40125L11.5208 7.36245L16.6378 12.4794L19.599 9.51825L14.482 4.40125ZM15.7186 13.3987L10.6016 8.28169L5.20274 13.6806V18.7976H10.3197L15.7186 13.3987Z", fill: "currentColor" }) });
Edit24.displayName = "Edit24";
const Memo$1r = reactExports.memo(Edit24);
const Edit16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_1049_4202)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.48808 1.45422C9.68334 1.25896 9.99992 1.25896 10.1952 1.45422L14.5459 5.80497C14.7412 6.00023 14.7412 6.31682 14.5459 6.51208L7.38921 13.6689C7.29544 13.7627 7.16826 13.8153 7.03565 13.8153L2.6849 13.8153C2.40876 13.8153 2.1849 13.5915 2.1849 13.3153L2.1849 8.96459C2.1849 8.83198 2.23758 8.70481 2.33134 8.61104L9.48808 1.45422ZM9.84163 2.51488L7.75183 4.60469L11.3955 8.24833L13.4853 6.15852L9.84163 2.51488ZM10.6884 8.95544L7.04473 5.3118L3.1849 9.17169L3.1849 12.8153L6.82854 12.8153L10.6884 8.95544Z", fill: "currentColor" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1049_4202", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
Edit16.displayName = "Edit16";
const Memo$1q = reactExports.memo(Edit16);
const Prefs24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65001C11.6902 2.65001 11.393 2.77308 11.174 2.99216C10.9549 3.21124 10.8318 3.50837 10.8318 3.81819V3.97273L10.8318 3.97533C10.8301 4.39462 10.7059 4.80428 10.4744 5.15387C10.2429 5.50346 9.91418 5.77773 9.52878 5.9429C9.466 5.96981 9.39947 5.98661 9.33169 5.99278C8.97398 6.12338 8.58712 6.15691 8.21077 6.08867C7.78807 6.01203 7.39803 5.81052 7.09093 5.51012L7.08581 5.50511L7.03129 5.45053C6.9228 5.34192 6.7937 5.2555 6.65189 5.19671C6.51007 5.13793 6.35806 5.10767 6.20455 5.10767C6.05103 5.10767 5.89902 5.13793 5.7572 5.19671C5.61539 5.2555 5.48655 5.34167 5.37806 5.45028C5.26944 5.55877 5.18277 5.68812 5.12398 5.82994C5.06519 5.97175 5.03493 6.12376 5.03493 6.27728C5.03493 6.4308 5.06519 6.58281 5.12398 6.72462C5.18277 6.86644 5.26893 6.99528 5.37755 7.10377L5.43742 7.16364C5.73781 7.47074 5.9393 7.86081 6.01594 8.2835C6.09136 8.69946 6.04246 9.12827 5.87559 9.51635C5.72535 9.91311 5.46101 10.2567 5.11568 10.5037C4.76478 10.7547 4.34649 10.8943 3.9152 10.9044L3.9 10.9046H3.81818C3.50836 10.9046 3.21123 11.0276 2.99215 11.2467C2.77308 11.4658 2.65 11.7629 2.65 12.0727C2.65 12.3826 2.77308 12.6797 2.99215 12.8988C3.21123 13.1178 3.50836 13.2409 3.81818 13.2409H3.97532C4.39462 13.2426 4.80428 13.3668 5.15387 13.5984C5.50249 13.8292 5.77621 14.1567 5.94153 14.5408C6.11385 14.9329 6.1651 15.3677 6.08867 15.7892C6.01202 16.2119 5.81051 16.602 5.51012 16.9091L5.5051 16.9142L5.45052 16.9687C5.34191 17.0772 5.2555 17.2063 5.19671 17.3481C5.13792 17.4899 5.10766 17.6419 5.10766 17.7955C5.10766 17.949 5.13792 18.101 5.19671 18.2428C5.2555 18.3846 5.34166 18.5135 5.45027 18.622C5.55876 18.7306 5.68811 18.8172 5.82993 18.876C5.97174 18.9348 6.12375 18.9651 6.27727 18.9651C6.43079 18.9651 6.5828 18.9348 6.72462 18.876C6.86643 18.8172 6.99527 18.7311 7.10376 18.6225L7.16363 18.5626C7.47073 18.2622 7.8608 18.0607 8.2835 17.9841C8.69945 17.9086 9.12825 17.9575 9.51633 18.1244C9.9131 18.2746 10.2567 18.539 10.5037 18.8843C10.7547 19.2352 10.8943 19.6535 10.9044 20.0848L10.9045 20.1V20.1818C10.9045 20.4916 11.0276 20.7888 11.2467 21.0079C11.4658 21.2269 11.7629 21.35 12.0727 21.35C12.3825 21.35 12.6797 21.2269 12.8988 21.0079C13.1178 20.7888 13.2409 20.4916 13.2409 20.1818V20.0273L13.2409 20.0247C13.2426 19.6054 13.3668 19.1957 13.5983 18.8461C13.8292 18.4975 14.1568 18.2238 14.5408 18.0584C14.933 17.8862 15.3677 17.8349 15.7892 17.9113C16.2119 17.988 16.602 18.1895 16.9091 18.4899L16.9142 18.4949L16.9687 18.5495C17.0772 18.6581 17.2063 18.7445 17.3481 18.8033C17.4899 18.8621 17.6419 18.8923 17.7955 18.8923C17.949 18.8923 18.101 18.8621 18.2428 18.8033C18.3846 18.7445 18.5135 18.6583 18.6219 18.5497C18.7306 18.4412 18.8172 18.3119 18.876 18.1701C18.9348 18.0283 18.9651 17.8763 18.9651 17.7227C18.9651 17.5692 18.9348 17.4172 18.876 17.2754C18.8172 17.1336 18.7311 17.0047 18.6225 16.8962L18.5626 16.8364C18.2622 16.5293 18.0607 16.1392 17.9841 15.7165C17.9076 15.295 17.9589 14.8603 18.1312 14.4681C18.2965 14.0841 18.5702 13.7565 18.9189 13.5256C19.2685 13.2941 19.6781 13.1699 20.0974 13.1682L20.1 13.1682L20.1818 13.1682C20.4916 13.1682 20.7888 13.0451 21.0078 12.826C21.2269 12.607 21.35 12.3098 21.35 12C21.35 11.6902 21.2269 11.3931 21.0078 11.174C20.7888 10.9549 20.4916 10.8318 20.1818 10.8318H20.0273L20.0247 10.8318C19.6054 10.8301 19.1957 10.7059 18.8461 10.4744C18.4965 10.2429 18.2223 9.91419 18.0571 9.52879C18.0302 9.466 18.0134 9.39949 18.0072 9.3317C17.8766 8.97399 17.8431 8.58713 17.9113 8.21078C17.988 7.78808 18.1895 7.39804 18.4899 7.09094L18.4949 7.08582L18.5495 7.0313C18.6581 6.92281 18.7445 6.79371 18.8033 6.6519C18.8621 6.51008 18.8923 6.35807 18.8923 6.20455C18.8923 6.05103 18.8621 5.89902 18.8033 5.75721C18.7445 5.61539 18.6583 5.48656 18.5497 5.37806C18.4412 5.26945 18.3119 5.18277 18.1701 5.12399C18.0283 5.0652 17.8762 5.03494 17.7227 5.03494C17.5692 5.03494 17.4172 5.0652 17.2754 5.12399C17.1336 5.18277 17.0047 5.26894 16.8962 5.37755L16.8364 5.43742C16.5293 5.73782 16.1392 5.9393 15.7165 6.01595C15.295 6.09238 14.8602 6.04113 14.468 5.86881C14.084 5.70349 13.7565 5.42977 13.5256 5.08114C13.2941 4.73155 13.1699 4.3219 13.1682 3.9026L13.1682 3.90001V3.81819C13.1682 3.50837 13.0451 3.21124 12.826 2.99216C12.607 2.77308 12.3098 2.65001 12 2.65001ZM10.2547 2.07292C10.7176 1.61005 11.3454 1.35001 12 1.35001C12.6546 1.35001 13.2824 1.61005 13.7453 2.07292C14.2081 2.53579 14.4682 3.16358 14.4682 3.81819V3.89845C14.469 4.06386 14.5181 4.22543 14.6095 4.36335C14.701 4.50156 14.831 4.60999 14.9833 4.67529L14.9897 4.67804C15.1451 4.74661 15.3175 4.7671 15.4846 4.7368C15.6507 4.70669 15.804 4.6278 15.9251 4.51023L15.9765 4.45882C16.2057 4.22934 16.4779 4.04729 16.7776 3.92308C17.0772 3.79887 17.3984 3.73494 17.7227 3.73494C18.0471 3.73494 18.3683 3.79887 18.6679 3.92308C18.9674 4.04725 19.2395 4.22921 19.4687 4.45857C19.6981 4.68774 19.88 4.95986 20.0042 5.25939C20.1284 5.55902 20.1923 5.8802 20.1923 6.20455C20.1923 6.52891 20.1284 6.85008 20.0042 7.14972C19.88 7.44935 19.6979 7.72156 19.4685 7.95079L19.4171 8.00218C19.2995 8.12325 19.2206 8.2766 19.1905 8.44271C19.1602 8.60982 19.1806 8.78218 19.2492 8.93756C19.2733 8.99214 19.2897 9.04964 19.2981 9.10843C19.3635 9.22128 19.4544 9.31797 19.5639 9.39052C19.7018 9.48184 19.8634 9.53094 20.0287 9.53182H20.1818C20.8364 9.53182 21.4642 9.79186 21.9271 10.2547C22.39 10.7176 22.65 11.3454 22.65 12C22.65 12.6546 22.39 13.2824 21.9271 13.7453C21.4642 14.2081 20.8364 14.4682 20.1818 14.4682H20.1016C19.9361 14.469 19.7746 14.5182 19.6367 14.6095C19.4984 14.701 19.39 14.831 19.3247 14.9833L19.322 14.9897C19.2534 15.1451 19.2329 15.3175 19.2632 15.4846C19.2933 15.6507 19.3722 15.804 19.4898 15.9251L19.5412 15.9765C19.7707 16.2057 19.9527 16.4779 20.0769 16.7776C20.2011 17.0772 20.2651 17.3984 20.2651 17.7227C20.2651 18.0471 20.2011 18.3683 20.0769 18.6679C19.9528 18.9674 19.7708 19.2395 19.5414 19.4687C19.3123 19.6981 19.0401 19.88 18.7406 20.0042C18.441 20.1284 18.1198 20.1923 17.7955 20.1923C17.4711 20.1923 17.1499 20.1284 16.8503 20.0042C16.5507 19.88 16.2784 19.6979 16.0492 19.4685L15.9978 19.4171C15.8767 19.2995 15.7234 19.2206 15.5573 19.1905C15.3902 19.1602 15.2178 19.1806 15.0624 19.2492L15.0561 19.252C14.9037 19.3173 14.7737 19.4257 14.6822 19.5639C14.5909 19.7019 14.5418 19.8634 14.5409 20.0288V20.1818C14.5409 20.8364 14.2809 21.4642 13.818 21.9271C13.3551 22.39 12.7273 22.65 12.0727 22.65C11.4181 22.65 10.7903 22.39 10.3275 21.9271C9.86459 21.4642 9.60455 20.8364 9.60455 20.1818V20.1087C9.59932 19.9405 9.54427 19.7776 9.44632 19.6406C9.3471 19.5019 9.20844 19.3962 9.04836 19.3373C9.03551 19.3326 9.02281 19.3275 9.01028 19.3219C8.8549 19.2534 8.68255 19.2329 8.51543 19.2632C8.34934 19.2933 8.19599 19.3722 8.07492 19.4898L8.02351 19.5412C7.79428 19.7707 7.52207 19.9527 7.22244 20.0769C6.92281 20.2011 6.60163 20.2651 6.27727 20.2651C5.95292 20.2651 5.63174 20.2011 5.33211 20.0769C5.03259 19.9528 4.76046 19.7708 4.53129 19.5414C4.30193 19.3123 4.11997 19.0401 3.9958 18.7406C3.87159 18.441 3.80766 18.1198 3.80766 17.7955C3.80766 17.4711 3.87159 17.1499 3.9958 16.8503C4.12001 16.5507 4.30206 16.2785 4.53155 16.0492L4.58295 15.9978C4.70052 15.8767 4.77941 15.7234 4.80952 15.5573C4.83982 15.3902 4.81937 15.2178 4.75079 15.0625L4.74798 15.0561C4.68268 14.9037 4.57428 14.7738 4.43607 14.6822C4.29815 14.5909 4.13658 14.5418 3.97117 14.5409H3.81818C3.16358 14.5409 2.53579 14.2809 2.07291 13.818C1.61004 13.3551 1.35 12.7273 1.35 12.0727C1.35 11.4181 1.61004 10.7903 2.07291 10.3275C2.53579 9.86459 3.16358 9.60455 3.81818 9.60455H3.89133C4.05953 9.59932 4.22245 9.54428 4.35941 9.44633C4.49814 9.3471 4.60381 9.20844 4.66268 9.04837C4.66741 9.03551 4.67254 9.02281 4.67807 9.01029C4.74664 8.85491 4.7671 8.68255 4.7368 8.51544C4.70668 8.34934 4.62779 8.19599 4.51022 8.07492L4.45882 8.02352C4.22934 7.79429 4.04728 7.52208 3.92308 7.22245C3.79887 6.92281 3.73493 6.60164 3.73493 6.27728C3.73493 5.95292 3.79887 5.63175 3.92308 5.33211C4.04724 5.03259 4.2292 4.76047 4.45856 4.5313C4.68774 4.30193 4.95986 4.11997 5.25938 3.99581C5.55901 3.8716 5.88019 3.80767 6.20455 3.80767C6.5289 3.80767 6.85008 3.8716 7.14971 3.99581C7.44934 4.12002 7.72156 4.30207 7.95078 4.53155L8.00219 4.58295C8.12326 4.70052 8.2766 4.77941 8.4427 4.80953C8.60982 4.83983 8.78218 4.81937 8.93755 4.7508C8.99214 4.72671 9.04965 4.71031 9.10844 4.70194C9.22129 4.63646 9.31797 4.54562 9.39051 4.43608C9.48184 4.29818 9.53094 4.13665 9.53182 3.97127V3.81819C9.53182 3.16358 9.79186 2.53579 10.2547 2.07292ZM12 9.65001C10.7021 9.65001 9.65 10.7021 9.65 12C9.65 13.2979 10.7021 14.35 12 14.35C13.2979 14.35 14.35 13.2979 14.35 12C14.35 10.7021 13.2979 9.65001 12 9.65001ZM8.35 12C8.35 9.98417 9.98416 8.35001 12 8.35001C14.0158 8.35001 15.65 9.98417 15.65 12C15.65 14.0158 14.0158 15.65 12 15.65C9.98416 15.65 8.35 14.0158 8.35 12Z", fill: "currentColor" }) });
Prefs24.displayName = "Prefs24";
const Memo$1p = reactExports.memo(Prefs24);
const Prefs16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("g", { clipPath: "url(#clip0_1049_4211)", children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.4158 10.4004C12.3801 10.2037 12.4042 10.001 12.4848 9.81818C12.5617 9.63892 12.6892 9.48605 12.8518 9.37836C13.0144 9.27068 13.205 9.21289 13.4 9.21212H13.4545C13.776 9.21212 14.0843 9.08441 14.3116 8.85709C14.539 8.62978 14.6667 8.32147 14.6667 8C14.6667 7.67852 14.539 7.37021 14.3116 7.1429C14.0843 6.91558 13.776 6.78787 13.4545 6.78787H13.3515C13.1565 6.7871 12.966 6.72931 12.8034 6.62163C12.6408 6.51394 12.5132 6.36107 12.4364 6.18181V6.13333C12.3557 5.95053 12.3316 5.74776 12.3673 5.55115C12.4029 5.35455 12.4966 5.17313 12.6364 5.0303L12.6727 4.99393C12.7854 4.88136 12.8748 4.74768 12.9358 4.60053C12.9968 4.45338 13.0282 4.29565 13.0282 4.13636C13.0282 3.97707 12.9968 3.81934 12.9358 3.67219C12.8748 3.52504 12.7854 3.39136 12.6727 3.27878C12.5602 3.16608 12.4265 3.07668 12.2793 3.01568C12.1322 2.95468 11.9744 2.92328 11.8152 2.92328C11.6559 2.92328 11.4981 2.95468 11.351 3.01568C11.2038 3.07668 11.0701 3.16608 10.9576 3.27878L10.9212 3.31515C10.7784 3.45487 10.597 3.54859 10.4004 3.58424C10.2038 3.61989 10.001 3.59582 9.81818 3.51515C9.63893 3.43832 9.48605 3.31076 9.37837 3.14816C9.27069 2.98556 9.2129 2.79502 9.21212 2.59999V2.54545C9.21212 2.22397 9.08441 1.91567 8.8571 1.68835C8.62978 1.46103 8.32147 1.33333 8 1.33333C7.67852 1.33333 7.37022 1.46103 7.1429 1.68835C6.91558 1.91567 6.78788 2.22397 6.78788 2.54545V2.64848C6.7871 2.8435 6.72931 3.03404 6.62163 3.19664C6.51395 3.35924 6.36107 3.48681 6.18182 3.56363H6.13333C5.95053 3.64431 5.74776 3.66837 5.55116 3.63273C5.35455 3.59708 5.17314 3.50335 5.0303 3.36363L4.99394 3.32727C4.88136 3.21457 4.74768 3.12516 4.60053 3.06416C4.45338 3.00317 4.29565 2.97177 4.13636 2.97177C3.97707 2.97177 3.81934 3.00317 3.67219 3.06416C3.52504 3.12516 3.39136 3.21457 3.27879 3.32727C3.16609 3.43984 3.07668 3.57352 3.01568 3.72067C2.95468 3.86782 2.92329 4.02555 2.92329 4.18484C2.92329 4.34414 2.95468 4.50186 3.01568 4.64901C3.07668 4.79616 3.16609 4.92985 3.27879 5.04242L3.31515 5.07878C3.45487 5.22162 3.5486 5.40304 3.58424 5.59964C3.61989 5.79624 3.59583 5.99902 3.51515 6.18181C3.44589 6.37014 3.32157 6.53327 3.15836 6.65C2.99515 6.76673 2.8006 6.83167 2.6 6.83636H2.54545C2.22398 6.83636 1.91567 6.96406 1.68835 7.19138C1.46104 7.4187 1.33333 7.72701 1.33333 8.04848C1.33333 8.36995 1.46104 8.67826 1.68835 8.90558C1.91567 9.1329 2.22398 9.2606 2.54545 9.2606H2.64848C2.84351 9.26138 3.03404 9.31917 3.19664 9.42685C3.35924 9.53453 3.48681 9.68741 3.56364 9.86666C3.64431 10.0495 3.66838 10.2522 3.63273 10.4488C3.59708 10.6454 3.50335 10.8269 3.36364 10.9697L3.32727 11.0061C3.21457 11.1186 3.12517 11.2523 3.06417 11.3995C3.00317 11.5466 2.97177 11.7043 2.97177 11.8636C2.97177 12.0229 3.00317 12.1807 3.06417 12.3278C3.12517 12.475 3.21457 12.6086 3.32727 12.7212C3.43984 12.8339 3.57353 12.9233 3.72068 12.9843C3.86783 13.0453 4.02556 13.0767 4.18485 13.0767C4.34414 13.0767 4.50187 13.0453 4.64902 12.9843C4.79617 12.9233 4.92985 12.8339 5.04242 12.7212L5.07879 12.6848C5.22162 12.5451 5.40304 12.4514 5.59964 12.4158C5.79625 12.3801 5.99902 12.4042 6.18182 12.4848C6.37014 12.5541 6.53327 12.6784 6.65001 12.8416C6.76674 13.0048 6.83167 13.1994 6.83636 13.4V13.4545C6.83636 13.776 6.96407 14.0843 7.19138 14.3116C7.4187 14.539 7.72701 14.6667 8.04848 14.6667C8.36996 14.6667 8.67827 14.539 8.90558 14.3116C9.1329 14.0843 9.2606 13.776 9.2606 13.4545V13.3515C9.26138 13.1565 9.31917 12.966 9.42685 12.8033C9.53453 12.6407 9.68741 12.5132 9.86667 12.4364C10.0495 12.3557 10.2522 12.3316 10.4488 12.3673C10.6454 12.4029 10.8269 12.4966 10.9697 12.6364L11.0061 12.6727C11.1186 12.7854 11.2523 12.8748 11.3995 12.9358C11.5466 12.9968 11.7043 13.0282 11.8636 13.0282C12.0229 13.0282 12.1807 12.9968 12.3278 12.9358C12.475 12.8748 12.6086 12.7854 12.7212 12.6727C12.8339 12.5601 12.9233 12.4265 12.9843 12.2793C13.0453 12.1322 13.0767 11.9744 13.0767 11.8151C13.0767 11.6559 13.0453 11.4981 12.9843 11.351C12.9233 11.2038 12.8339 11.0701 12.7212 10.9576L12.6848 10.9212C12.5451 10.7784 12.4514 10.597 12.4158 10.4004ZM10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" }) }), jsxRuntimeExports.jsx("defs", { children: jsxRuntimeExports.jsx("clipPath", { id: "clip0_1049_4211", children: jsxRuntimeExports.jsx("rect", { width: 16, height: 16, fill: "white" }) }) })] });
Prefs16.displayName = "Prefs16";
const Memo$1o = reactExports.memo(Prefs16);
const More24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z", fill: "currentColor" })] });
More24.displayName = "More24";
const Memo$1n = reactExports.memo(More24);
const More16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M13 7C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M3 7C3.55228 7 4 7.44772 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7Z", fill: "currentColor" })] });
More16.displayName = "More16";
const Memo$1m = reactExports.memo(More16);
const Link16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.44729 10.5C4.43799 10.4994 4.42864 10.499 4.41927 10.4987C3.07625 10.4564 2 9.35371 2 8C2 6.64629 3.07625 5.54357 4.41927 5.50127C4.42864 5.50097 4.43798 5.50055 4.44729 5.5H4.5H6.5C6.77614 5.5 7 5.27614 7 5C7 4.72386 6.77614 4.5 6.5 4.5H5.38779H4.5H4.38868C4.38819 4.5 4.38779 4.5004 4.38779 4.5009C4.38779 4.50138 4.3874 4.50178 4.38692 4.50179C2.50626 4.56149 1 6.10484 1 8C1 9.89516 2.50626 11.4385 4.38692 11.4982C4.3874 11.4982 4.38779 11.4986 4.38779 11.4991C4.38779 11.4996 4.38819 11.5 4.38868 11.5H4.5H5.38779H6.5C6.77614 11.5 7 11.2761 7 11C7 10.7239 6.77614 10.5 6.5 10.5H4.5H4.44729ZM11.5 10.5H9.5C9.22386 10.5 9 10.7239 9 11C9 11.2761 9.22386 11.5 9.5 11.5H10.6122H11.5H11.6113C11.6118 11.5 11.6122 11.4996 11.6122 11.4991C11.6122 11.4986 11.6126 11.4982 11.6131 11.4982C13.4937 11.4385 15 9.89516 15 8C15 6.10484 13.4937 4.56149 11.6131 4.50179C11.6126 4.50178 11.6122 4.50138 11.6122 4.5009C11.6122 4.5004 11.6118 4.5 11.6113 4.5H11.5H10.6122H9.5C9.22386 4.5 9 4.72386 9 5C9 5.27614 9.22386 5.5 9.5 5.5H11.5H11.5527C11.562 5.50055 11.5714 5.50097 11.5807 5.50127C12.9237 5.54357 14 6.64629 14 8C14 9.35371 12.9237 10.4564 11.5807 10.4987C11.5714 10.499 11.562 10.4994 11.5527 10.5H11.5ZM11 8C11 7.72386 10.7761 7.5 10.5 7.5H5.5C5.22386 7.5 5 7.72386 5 8C5 8.27614 5.22386 8.5 5.5 8.5H10.5C10.7761 8.5 11 8.27614 11 8Z", fill: "currentColor" }) });
Link16.displayName = "Link16";
const Memo$1l = reactExports.memo(Link16);
const History16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 3C6.20275 3 4.62612 3.94834 3.74466 5.37319H5C5.27614 5.37319 5.5 5.59704 5.5 5.87319C5.5 6.14933 5.27614 6.37319 5 6.37319H2V3.5C2 3.22386 2.22386 3 2.5 3C2.77614 3 3 3.22386 3 3.5V4.68239C4.07457 3.06609 5.91237 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C5.66763 14 3.64699 12.6691 2.6545 10.7276C2.52881 10.4817 2.62624 10.1805 2.87212 10.0548C3.118 9.92911 3.41922 10.0265 3.54491 10.2724C4.37314 11.8926 6.05767 13 8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3ZM8 5C8.27614 5 8.5 5.22386 8.5 5.5V7.79289L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L7.5 8.20711V5.5C7.5 5.22386 7.72386 5 8 5Z", fill: "currentColor" }) });
History16.displayName = "History16";
const Memo$1k = reactExports.memo(History16);
const Community24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65001C6.83614 2.65001 2.65 6.83614 2.65 12C2.65 17.1639 6.83614 21.35 12 21.35C17.1639 21.35 21.35 17.1639 21.35 12C21.35 6.83614 17.1639 2.65001 12 2.65001ZM1.35 12C1.35 6.11817 6.11817 1.35001 12 1.35001C17.8818 1.35001 22.65 6.11817 22.65 12C22.65 17.8818 17.8818 22.65 12 22.65C6.11817 22.65 1.35 17.8818 1.35 12Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 8.65001C10.1498 8.65001 8.65 10.1499 8.65 12C8.65 13.8502 10.1498 15.35 12 15.35C13.8502 15.35 15.35 13.8502 15.35 12C15.35 10.1499 13.8502 8.65001 12 8.65001ZM7.35 12C7.35 9.43188 9.43187 7.35001 12 7.35001C14.5681 7.35001 16.65 9.43188 16.65 12C16.65 14.5681 14.5681 16.65 12 16.65C9.43187 16.65 7.35 14.5681 7.35 12Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.47038 4.47039C4.72422 4.21655 5.13578 4.21655 5.38962 4.47039L9.62962 8.71039C9.88346 8.96423 9.88346 9.37578 9.62962 9.62963C9.37578 9.88347 8.96422 9.88347 8.71038 9.62963L4.47038 5.38963C4.21654 5.13578 4.21654 4.72423 4.47038 4.47039ZM19.5296 4.47039C19.7835 4.72423 19.7835 5.13578 19.5296 5.38963L18.8203 6.09898L15.2896 9.62963C15.0358 9.88347 14.6242 9.88347 14.3704 9.62963C14.1165 9.37578 14.1165 8.96423 14.3704 8.71039L18.6104 4.47039C18.8642 4.21655 19.2758 4.21655 19.5296 4.47039ZM9.62962 14.3704C9.88346 14.6242 9.88346 15.0358 9.62962 15.2896L5.38962 19.5296C5.13578 19.7835 4.72422 19.7835 4.47038 19.5296C4.21654 19.2758 4.21654 18.8642 4.47038 18.6104L8.71038 14.3704C8.96422 14.1165 9.37578 14.1165 9.62962 14.3704ZM14.3704 14.3704C14.6242 14.1165 15.0358 14.1165 15.2896 14.3704L19.5296 18.6104C19.7835 18.8642 19.7835 19.2758 19.5296 19.5296C19.2758 19.7835 18.8642 19.7835 18.6104 19.5296L14.3704 15.2896C14.1165 15.0358 14.1165 14.6242 14.3704 14.3704Z", fill: "currentColor" })] });
Community24.displayName = "Community24";
const Memo$1j = reactExports.memo(Community24);
const Users24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.3703 2.96878C15.4594 2.62101 15.8135 2.41128 16.1612 2.50032C17.1615 2.75642 18.048 3.33813 18.6811 4.15375C19.3142 4.96938 19.6578 5.97251 19.6578 7.00501C19.6578 8.0375 19.3142 9.04064 18.6811 9.85626C18.048 10.6719 17.1615 11.2536 16.1612 11.5097C15.8135 11.5987 15.4594 11.389 15.3703 11.0412C15.2813 10.6935 15.491 10.3394 15.8388 10.2503C16.5594 10.0658 17.1981 9.64673 17.6542 9.05913C18.1103 8.47154 18.3578 7.74885 18.3578 7.00501C18.3578 6.26116 18.1103 5.53848 17.6542 4.95088C17.1981 4.36328 16.5594 3.9442 15.8388 3.75969C15.491 3.67065 15.2813 3.31655 15.3703 2.96878ZM1.71195 15.712C2.584 14.8399 3.76674 14.35 5 14.35H13C14.2333 14.35 15.416 14.8399 16.288 15.712C17.1601 16.584 17.65 17.7668 17.65 19V21C17.65 21.359 17.359 21.65 17 21.65C16.641 21.65 16.35 21.359 16.35 21V19C16.35 18.1115 15.9971 17.2594 15.3688 16.6312C14.7406 16.003 13.8885 15.65 13 15.65H5C4.11152 15.65 3.25944 16.003 2.63119 16.6312C2.00294 17.2594 1.65 18.1115 1.65 19V21C1.65 21.359 1.35898 21.65 0.999998 21.65C0.641013 21.65 0.349998 21.359 0.349998 21V19C0.349998 17.7668 0.839908 16.584 1.71195 15.712ZM19.3706 14.9675C19.4604 14.6199 19.8149 14.4109 20.1625 14.5006C21.1601 14.7582 22.0439 15.3398 22.6751 16.1541C23.3063 16.9684 23.6492 17.9692 23.65 18.9995V21C23.65 21.359 23.359 21.65 23 21.65C22.641 21.65 22.35 21.359 22.35 21V19.0005C22.3494 18.2582 22.1024 17.5372 21.6476 16.9506C21.1929 16.3639 20.5562 15.9449 19.8375 15.7594C19.4899 15.6696 19.2809 15.3151 19.3706 14.9675Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9 3.65001C7.14984 3.65001 5.65 5.14985 5.65 7.00001C5.65 8.85016 7.14984 10.35 9 10.35C10.8502 10.35 12.35 8.85016 12.35 7.00001C12.35 5.14985 10.8502 3.65001 9 3.65001ZM4.35 7.00001C4.35 4.43188 6.43187 2.35001 9 2.35001C11.5681 2.35001 13.65 4.43188 13.65 7.00001C13.65 9.56813 11.5681 11.65 9 11.65C6.43187 11.65 4.35 9.56813 4.35 7.00001Z", fill: "currentColor" })] });
Users24.displayName = "Users24";
const Memo$1i = reactExports.memo(Users24);
const People16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.9603 9.61389C12.0294 9.34652 12.3021 9.18573 12.5695 9.25477C13.1535 9.40556 13.6709 9.74603 14.0404 10.2227C14.4099 10.6994 14.6107 11.2854 14.6111 11.8885V13C14.6111 13.2761 14.3873 13.5 14.1111 13.5C13.835 13.5 13.6111 13.2761 13.6111 13V11.8893C13.6108 11.5077 13.4838 11.1369 13.25 10.8354C13.0163 10.5338 12.6889 10.3184 12.3195 10.223C12.0521 10.154 11.8913 9.88127 11.9603 9.61389Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.18618 9.96398C2.6967 9.45346 3.38911 9.16666 4.11108 9.16666H8.55553C9.27751 9.16666 9.96992 9.45346 10.4804 9.96398C10.9909 10.4745 11.2778 11.1669 11.2778 11.8889V13C11.2778 13.2761 11.0539 13.5 10.7778 13.5C10.5016 13.5 10.2778 13.2761 10.2778 13V11.8889C10.2778 11.4321 10.0963 10.9941 9.77332 10.6711C9.45034 10.3481 9.01229 10.1667 8.55553 10.1667H4.11108C3.65432 10.1667 3.21627 10.3481 2.89329 10.6711C2.57031 10.9941 2.38886 11.4321 2.38886 11.8889V13C2.38886 13.2761 2.165 13.5 1.88886 13.5C1.61272 13.5 1.38886 13.2761 1.38886 13V11.8889C1.38886 11.1669 1.67567 10.4745 2.18618 9.96398Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.73774 2.94818C9.80623 2.68067 10.0786 2.51934 10.3461 2.58783C10.9317 2.73776 11.4507 3.07831 11.8213 3.55579C12.192 4.03327 12.3931 4.62053 12.3931 5.22498C12.3931 5.82943 12.192 6.41669 11.8213 6.89417C11.4507 7.37166 10.9317 7.71221 10.3461 7.86213C10.0786 7.93063 9.80623 7.76929 9.73774 7.50178C9.66924 7.23427 9.83058 6.96188 10.0981 6.89338C10.4685 6.79853 10.7969 6.58308 11.0314 6.281C11.2659 5.97892 11.3931 5.60739 11.3931 5.22498C11.3931 4.84258 11.2659 4.47105 11.0314 4.16896C10.7969 3.86688 10.4685 3.65143 10.0981 3.55658C9.83058 3.48809 9.66924 3.2157 9.73774 2.94818Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.33331 3.5C5.38216 3.5 4.61109 4.27107 4.61109 5.22222C4.61109 6.17338 5.38216 6.94444 6.33331 6.94444C7.28447 6.94444 8.05554 6.17338 8.05554 5.22222C8.05554 4.27107 7.28447 3.5 6.33331 3.5ZM3.61109 5.22222C3.61109 3.71878 4.82987 2.5 6.33331 2.5C7.83676 2.5 9.05554 3.71878 9.05554 5.22222C9.05554 6.72566 7.83676 7.94444 6.33331 7.94444C4.82987 7.94444 3.61109 6.72566 3.61109 5.22222Z", fill: "currentColor" })] });
People16.displayName = "People16";
const Memo$1h = reactExports.memo(People16);
const Area16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83334 3.49999H11.1667V4.49999H4.83334V3.49999ZM4.50001 4.83332V11.1667H3.50001V4.83332H4.50001ZM12.5 4.83332V11.1667H11.5V4.83332H12.5ZM4.83334 11.5H11.1667V12.5H4.83334V11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.66667 11.6667V12.3333H4.33334V11.6667H3.66667ZM3.16667 10.6667C2.89053 10.6667 2.66667 10.8905 2.66667 11.1667V12.8333C2.66667 13.1095 2.89053 13.3333 3.16667 13.3333H4.83334C5.10948 13.3333 5.33334 13.1095 5.33334 12.8333V11.1667C5.33334 10.8905 5.10948 10.6667 4.83334 10.6667H3.16667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.66667 3.66666V4.33332H4.33334V3.66666H3.66667ZM3.16667 2.66666C2.89053 2.66666 2.66667 2.89051 2.66667 3.16666V4.83332C2.66667 5.10947 2.89053 5.33332 3.16667 5.33332H4.83334C5.10948 5.33332 5.33334 5.10947 5.33334 4.83332V3.16666C5.33334 2.89051 5.10948 2.66666 4.83334 2.66666H3.16667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 3.66666V4.33332H12.3333V3.66666H11.6667ZM11.1667 2.66666C10.8905 2.66666 10.6667 2.89051 10.6667 3.16666V4.83332C10.6667 5.10947 10.8905 5.33332 11.1667 5.33332H12.8333C13.1095 5.33332 13.3333 5.10947 13.3333 4.83332V3.16666C13.3333 2.89051 13.1095 2.66666 12.8333 2.66666H11.1667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 11.6667V12.3333H12.3333V11.6667H11.6667ZM11.1667 10.6667C10.8905 10.6667 10.6667 10.8905 10.6667 11.1667V12.8333C10.6667 13.1095 10.8905 13.3333 11.1667 13.3333H12.8333C13.1095 13.3333 13.3333 13.1095 13.3333 12.8333V11.1667C13.3333 10.8905 13.1095 10.6667 12.8333 10.6667H11.1667Z", fill: "currentColor" })] });
Area16.displayName = "Area16";
const Memo$1g = reactExports.memo(Area16);
const Map16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.7152 2.08904C1.84999 1.99563 2.02201 1.97426 2.17556 2.03184L6 3.466L9.82444 2.03184C9.93763 1.98939 10.0624 1.98939 10.1756 2.03184L14.1756 3.53184C14.3707 3.60502 14.5 3.79158 14.5 4V13.5C14.5 13.664 14.4196 13.8176 14.2848 13.911C14.15 14.0044 13.978 14.0257 13.8244 13.9682L10 12.534L6.17556 13.9682C6.06237 14.0106 5.93763 14.0106 5.82444 13.9682L1.82444 12.4682C1.62929 12.395 1.5 12.2084 1.5 12V2.5C1.5 2.33601 1.58042 2.18245 1.7152 2.08904ZM10.5 11.6535L13.5 12.7785V4.3465L10.5 3.2215V11.6535ZM9.5 3.2215V11.6535L6.5 12.7785V4.3465L9.5 3.2215ZM5.5 4.3465L2.5 3.2215V11.6535L5.5 12.7785V4.3465Z", fill: "currentColor" }) });
Map16.displayName = "Map16";
const Memo$1f = reactExports.memo(Map16);
const Map24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.62977 3.21574C2.80499 3.09431 3.02862 3.06653 3.22824 3.14138L9.00001 5.30579L14.7718 3.14138C14.9189 3.0862 15.0811 3.0862 15.2282 3.14138L21.2282 5.39138C21.4819 5.48652 21.65 5.72905 21.65 5.99999V20.25C21.65 20.4632 21.5455 20.6628 21.3702 20.7842C21.195 20.9057 20.9714 20.9335 20.7718 20.8586L15 18.6942L9.22824 20.8586C9.08109 20.9138 8.91893 20.9138 8.77178 20.8586L2.77178 18.6086C2.51808 18.5135 2.35001 18.2709 2.35001 18V3.74999C2.35001 3.53681 2.45455 3.33717 2.62977 3.21574ZM15.65 17.5495L20.35 19.312V6.45044L15.65 4.68794V17.5495ZM14.35 4.68794V17.5495L9.65001 19.312V6.45044L14.35 4.68794ZM8.35001 6.45044L3.65001 4.68794V17.5495L8.35001 19.312V6.45044Z", fill: "currentColor" }) });
Map24.displayName = "Map24";
const Memo$1e = reactExports.memo(Map24);
const List24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.35 6.00001C2.35 5.64102 2.64101 5.35001 3 5.35001H3.01C3.36898 5.35001 3.66 5.64102 3.66 6.00001C3.66 6.35899 3.36898 6.65001 3.01 6.65001H3C2.64101 6.65001 2.35 6.35899 2.35 6.00001ZM7.35 6.00001C7.35 5.64102 7.64101 5.35001 8 5.35001H21C21.359 5.35001 21.65 5.64102 21.65 6.00001C21.65 6.35899 21.359 6.65001 21 6.65001H8C7.64101 6.65001 7.35 6.35899 7.35 6.00001ZM2.35 12C2.35 11.641 2.64101 11.35 3 11.35H3.01C3.36898 11.35 3.66 11.641 3.66 12C3.66 12.359 3.36898 12.65 3.01 12.65H3C2.64101 12.65 2.35 12.359 2.35 12ZM7.35 12C7.35 11.641 7.64101 11.35 8 11.35H21C21.359 11.35 21.65 11.641 21.65 12C21.65 12.359 21.359 12.65 21 12.65H8C7.64101 12.65 7.35 12.359 7.35 12ZM2.35 18C2.35 17.641 2.64101 17.35 3 17.35H3.01C3.36898 17.35 3.66 17.641 3.66 18C3.66 18.359 3.36898 18.65 3.01 18.65H3C2.64101 18.65 2.35 18.359 2.35 18ZM7.35 18C7.35 17.641 7.64101 17.35 8 17.35H21C21.359 17.35 21.65 17.641 21.65 18C21.65 18.359 21.359 18.65 21 18.65H8C7.64101 18.65 7.35 18.359 7.35 18Z", fill: "currentColor" }) });
List24.displayName = "List24";
const Memo$1d = reactExports.memo(List24);
const Share24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 2.65001C16.7021 2.65001 15.65 3.70214 15.65 5.00001C15.65 5.41394 15.757 5.80288 15.9449 6.14067C15.9542 6.15413 15.963 6.16804 15.9714 6.18239C15.9797 6.19662 15.9874 6.21104 15.9945 6.22562C16.4076 6.90003 17.1512 7.35001 18 7.35001C19.2979 7.35001 20.35 6.29788 20.35 5.00001C20.35 3.70214 19.2979 2.65001 18 2.65001ZM15.2247 7.37076C15.8941 8.15372 16.8891 8.65001 18 8.65001C20.0158 8.65001 21.65 7.01585 21.65 5.00001C21.65 2.98417 20.0158 1.35001 18 1.35001C15.9842 1.35001 14.35 2.98417 14.35 5.00001C14.35 5.43842 14.4273 5.85878 14.569 6.24821L8.77535 9.62926C8.1059 8.8463 7.11091 8.35001 6.00001 8.35001C3.98417 8.35001 2.35001 9.98417 2.35001 12C2.35001 14.0158 3.98417 15.65 6.00001 15.65C7.11105 15.65 8.10614 15.1536 8.7756 14.3705L14.5706 17.7474C14.4279 18.138 14.35 18.5599 14.35 19C14.35 21.0158 15.9842 22.65 18 22.65C20.0158 22.65 21.65 21.0158 21.65 19C21.65 16.9842 20.0158 15.35 18 15.35C16.8908 15.35 15.8972 15.8448 15.2277 16.6257L9.43114 13.2478C9.57276 12.8585 9.65001 12.4383 9.65001 12C9.65001 11.5616 9.57271 11.1412 9.431 10.7518L15.2247 7.37076ZM8.00549 10.7744C8.0126 10.789 8.0203 10.8034 8.02861 10.8176C8.03698 10.832 8.04583 10.8459 8.0551 10.8593C8.24298 11.1971 8.35001 11.5861 8.35001 12C8.35001 12.4139 8.24299 12.8029 8.05511 13.1407C8.04575 13.1542 8.03684 13.1683 8.0284 13.1827C8.02017 13.1969 8.01254 13.2112 8.00549 13.2256C7.59246 13.9 6.84878 14.35 6.00001 14.35C4.70214 14.35 3.65001 13.2979 3.65001 12C3.65001 10.7021 4.70214 9.65001 6.00001 9.65001C6.84878 9.65001 7.59245 10.1 8.00549 10.7744ZM15.9198 17.9058C15.9424 17.8785 15.9632 17.8489 15.9816 17.8173C15.9995 17.7866 16.0145 17.7551 16.0269 17.723C16.4457 17.0772 17.173 16.65 18 16.65C19.2979 16.65 20.35 17.7021 20.35 19C20.35 20.2979 19.2979 21.35 18 21.35C16.7021 21.35 15.65 20.2979 15.65 19C15.65 18.6049 15.7475 18.2326 15.9198 17.9058Z", fill: "currentColor" }) });
Share24.displayName = "Share24";
const Memo$1c = reactExports.memo(Share24);
const Image24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5 3.65001C4.25441 3.65001 3.65 4.25442 3.65 5.00001V19C3.65 19.7456 4.25441 20.35 5 20.35H19C19.7456 20.35 20.35 19.7456 20.35 19V5.00001C20.35 4.25442 19.7456 3.65001 19 3.65001H5ZM2.35 5.00001C2.35 3.53645 3.53644 2.35001 5 2.35001H19C20.4636 2.35001 21.65 3.53645 21.65 5.00001V19C21.65 20.4636 20.4636 21.65 19 21.65H5C3.53644 21.65 2.35 20.4636 2.35 19V5.00001Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.5404 9.54039C15.7942 9.28655 16.2058 9.28655 16.4596 9.54039L21.4596 14.5404C21.7135 14.7942 21.7135 15.2058 21.4596 15.4596C21.2058 15.7135 20.7942 15.7135 20.5404 15.4596L16 10.9192L5.45962 21.4596C5.20578 21.7135 4.79422 21.7135 4.54038 21.4596C4.28654 21.2058 4.28654 20.7942 4.54038 20.5404L15.5404 9.54039Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.5 7.65001C8.03056 7.65001 7.65 8.03056 7.65 8.50001C7.65 8.96945 8.03056 9.35001 8.5 9.35001C8.96944 9.35001 9.35 8.96945 9.35 8.50001C9.35 8.03056 8.96944 7.65001 8.5 7.65001ZM6.35 8.50001C6.35 7.31259 7.31259 6.35001 8.5 6.35001C9.68741 6.35001 10.65 7.31259 10.65 8.50001C10.65 9.68742 9.68741 10.65 8.5 10.65C7.31259 10.65 6.35 9.68742 6.35 8.50001Z", fill: "currentColor" })] });
Image24.displayName = "Image24";
const Memo$1b = reactExports.memo(Image24);
const Image16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.33333 2.5C2.8731 2.5 2.5 2.8731 2.5 3.33333V12.6667C2.5 13.1269 2.8731 13.5 3.33333 13.5H12.6667C13.1269 13.5 13.5 13.1269 13.5 12.6667V3.33333C13.5 2.8731 13.1269 2.5 12.6667 2.5H3.33333ZM1.5 3.33333C1.5 2.32081 2.32081 1.5 3.33333 1.5H12.6667C13.6792 1.5 14.5 2.32081 14.5 3.33333V12.6667C14.5 13.6792 13.6792 14.5 12.6667 14.5H3.33333C2.32081 14.5 1.5 13.6792 1.5 12.6667V3.33333Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.3131 6.31311C10.5084 6.11785 10.825 6.11785 11.0202 6.31311L14.3536 9.64645C14.5488 9.84171 14.5488 10.1583 14.3536 10.3536C14.1583 10.5488 13.8417 10.5488 13.6464 10.3536L10.6667 7.37377L3.68689 14.3536C3.49163 14.5488 3.17504 14.5488 2.97978 14.3536C2.78452 14.1583 2.78452 13.8417 2.97978 13.6464L10.3131 6.31311Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.66666 5.16667C5.39052 5.16667 5.16666 5.39052 5.16666 5.66667C5.16666 5.94281 5.39052 6.16667 5.66666 6.16667C5.94281 6.16667 6.16666 5.94281 6.16666 5.66667C6.16666 5.39052 5.94281 5.16667 5.66666 5.16667ZM4.16666 5.66667C4.16666 4.83824 4.83824 4.16667 5.66666 4.16667C6.49509 4.16667 7.16666 4.83824 7.16666 5.66667C7.16666 6.49509 6.49509 7.16667 5.66666 7.16667C4.83824 7.16667 4.16666 6.49509 4.16666 5.66667Z", fill: "currentColor" })] });
Image16.displayName = "Image16";
const Memo$1a = reactExports.memo(Image16);
const Globe24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65001C6.83614 2.65001 2.65 6.83614 2.65 12C2.65 17.1639 6.83614 21.35 12 21.35C17.1639 21.35 21.35 17.1639 21.35 12C21.35 6.83614 17.1639 2.65001 12 2.65001ZM1.35 12C1.35 6.11817 6.11817 1.35001 12 1.35001C17.8818 1.35001 22.65 6.11817 22.65 12C22.65 17.8818 17.8818 22.65 12 22.65C6.11817 22.65 1.35 17.8818 1.35 12Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 1.35001C12.1826 1.35001 12.3568 1.42681 12.4799 1.56163C14.944 4.25925 16.4029 7.71589 16.6239 11.35H22C22.359 11.35 22.65 11.641 22.65 12C22.65 12.359 22.359 12.65 22 12.65H16.6239C16.4029 16.2841 14.944 19.7408 12.4799 22.4384C12.3568 22.5732 12.1826 22.65 12 22.65C11.8174 22.65 11.6432 22.5732 11.5201 22.4384C9.056 19.7408 7.59714 16.2841 7.37611 12.65H2C1.64101 12.65 1.35 12.359 1.35 12C1.35 11.641 1.64101 11.35 2 11.35H7.37611C7.59714 7.71589 9.056 4.25925 11.5201 1.56163C11.6432 1.42681 11.8174 1.35001 12 1.35001ZM8.67873 12.65C8.88182 15.716 10.0442 18.6407 12 21.0091C13.9558 18.6407 15.1182 15.716 15.3213 12.65H8.67873ZM15.3213 11.35H8.67873C8.88182 8.28401 10.0442 5.35934 12 2.99088C13.9558 5.35934 15.1182 8.28401 15.3213 11.35Z", fill: "currentColor" })] });
Globe24.displayName = "Globe24";
const Memo$19 = reactExports.memo(Globe24);
const RouteDirection24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M8.06667 4.5C8.06667 5.88071 6.93246 7 5.53333 7C4.13421 7 3 5.88071 3 4.5C3 3.11929 4.13421 2 5.53333 2C6.93246 2 8.06667 3.11929 8.06667 4.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M20.7333 19.5C20.7333 20.8807 19.5991 22 18.2 22C16.8009 22 15.6667 20.8807 15.6667 19.5C15.6667 18.1193 16.8009 17 18.2 17C19.5991 17 20.7333 18.1193 20.7333 19.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.35 4.50001C9.35 4.14102 9.64102 3.85001 10 3.85001H13.2308C14.5512 3.85001 15.7929 4.18802 16.7188 4.93039C17.6635 5.68784 18.2167 6.81779 18.2167 8.25001C18.2167 9.68222 17.6635 10.8122 16.7188 11.5696C15.7929 12.312 14.5512 12.65 13.2308 12.65L8.70038 12.65L8.7 12L8.70003 11.35L13.2308 11.35C14.3463 11.35 15.2725 11.063 15.9056 10.5554C16.5199 10.0628 16.9167 9.31779 16.9167 8.25001C16.9167 7.18222 16.5199 6.43718 15.9056 5.94462C15.2725 5.43699 14.3463 5.15001 13.2308 5.15001H10C9.64102 5.15001 9.35 4.85899 9.35 4.50001ZM11.9051 18.85H8.7C7.53068 18.85 6.57986 18.5606 5.9361 18.0523C5.3128 17.5602 4.91667 16.8172 4.91667 15.75C4.91667 14.6828 5.3128 13.9398 5.9361 13.4477C6.57986 12.9395 7.53106 12.65 8.70038 12.65L8.7 12L8.70003 11.35C7.33602 11.35 6.07015 11.6856 5.13057 12.4273C4.17054 13.1852 3.61667 14.3172 3.61667 15.75C3.61667 17.1828 4.17054 18.3148 5.13057 19.0727C6.07015 19.8145 7.33599 20.15 8.7 20.15H11.9051L10.1226 21.8923C9.86586 22.1432 9.86117 22.5548 10.1121 22.8115C10.363 23.0682 10.7746 23.0729 11.0313 22.822L13.9543 19.9648C14.0795 19.8425 14.15 19.675 14.15 19.5C14.15 19.325 14.0795 19.1575 13.9543 19.0352L11.0313 16.178C10.7746 15.9271 10.363 15.9318 10.1121 16.1885C9.86117 16.4452 9.86586 16.8568 10.1226 17.1077L11.9051 18.85Z", fill: "currentColor" })] });
RouteDirection24.displayName = "RouteDirection24";
const Memo$18 = reactExports.memo(RouteDirection24);
const Route24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M8.72222 5.74999C8.72222 6.90058 7.77705 7.83332 6.61111 7.83332C5.44518 7.83332 4.5 6.90058 4.5 5.74999C4.5 4.5994 5.44518 3.66666 6.61111 3.66666C7.77705 3.66666 8.72222 4.5994 8.72222 5.74999Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M19.2778 18.25C19.2778 19.4006 18.3326 20.3333 17.1667 20.3333C16.0007 20.3333 15.0556 19.4006 15.0556 18.25C15.0556 17.0994 16.0007 16.1667 17.1667 16.1667C18.3326 16.1667 19.2778 17.0994 19.2778 18.25Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.0939 6.40001V5.10001H13.0256C14.143 5.10001 15.2041 5.38594 16.0001 6.02414C16.8148 6.67742 17.2889 7.65112 17.2889 8.87501C17.2889 10.0989 16.8148 11.0726 16.0001 11.7259C15.2041 12.3641 14.143 12.65 13.0256 12.65L9.25007 12.65L9.24999 12L9.25002 11.35L13.0256 11.35C13.9382 11.35 14.6837 11.1151 15.1869 10.7116C15.6713 10.3233 15.9889 9.73446 15.9889 8.87501C15.9889 8.01556 15.6713 7.42676 15.1869 7.03837C14.6837 6.63491 13.9382 6.40001 13.0256 6.40001H7.0939ZM6.20833 12.2711C7.01597 11.6335 8.09712 11.35 9.25002 11.35L9.24999 12L9.25007 12.65C8.29186 12.65 7.52568 12.8874 7.01387 13.2914C6.52251 13.6793 6.20555 14.2662 6.20555 15.125C6.20555 15.9839 6.52251 16.5707 7.01387 16.9586C7.52568 17.3626 8.29178 17.6 9.24999 17.6H15.9999V18.9H9.24999C8.09709 18.9 7.01597 18.6165 6.20833 17.9789C5.38025 17.3252 4.90555 16.3495 4.90555 15.125C4.90555 13.9005 5.38025 12.9248 6.20833 12.2711Z", fill: "currentColor" })] });
Route24.displayName = "Route24";
const Memo$17 = reactExports.memo(Route24);
const LayerUrban = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M12 5.1547L17.9282 8.57735L17.9282 15.4226L12 18.8453L6.0718 15.4227L6.0718 8.57735L12 5.1547Z", fill: "white", stroke: "#FF6D00", strokeWidth: 2 }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.1962 9.57735C17.1962 9.22008 17.0056 8.88996 16.6962 8.71132L12.5 6.28868C12.1906 6.11004 11.8094 6.11004 11.5 6.28868L7.30385 8.71132C6.99445 8.88996 6.80385 9.22008 6.80385 9.57735V14.4226C6.80385 14.7799 6.99445 15.11 7.30385 15.2887L11.5 17.7113C11.8094 17.89 12.1906 17.89 12.5 17.7113L16.6962 15.2887C17.0056 15.11 17.1962 14.7799 17.1962 14.4226V9.57735ZM14.9417 10.879C14.9417 10.5217 14.7511 10.1916 14.4417 10.0129L12.5 8.8919C12.1906 8.71327 11.8094 8.71327 11.5 8.8919L9.55831 10.0129C9.24891 10.1916 9.05831 10.5217 9.05831 10.879V13.121C9.05831 13.4783 9.24891 13.8084 9.55831 13.9871L11.5 15.1081C11.8094 15.2867 12.1906 15.2867 12.5 15.1081L14.4417 13.9871C14.7511 13.8084 14.9417 13.4783 14.9417 13.121V10.879Z", fill: "#FFD4B5" })] });
LayerUrban.displayName = "LayerUrban";
const Memo$16 = reactExports.memo(LayerUrban);
const LayerPeriphery = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M12 5.1547L17.9282 8.57735L17.9282 15.4226L12 18.8453L6.0718 15.4227L6.0718 8.57735L12 5.1547Z", fill: "white", stroke: "#24D225", strokeWidth: 2 }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.1962 9.57735C17.1962 9.22008 17.0056 8.88996 16.6962 8.71132L12.5 6.28868C12.1906 6.11004 11.8094 6.11004 11.5 6.28868L7.30385 8.71132C6.99445 8.88996 6.80385 9.22008 6.80385 9.57735V14.4226C6.80385 14.7799 6.99445 15.11 7.30385 15.2887L11.5 17.7113C11.8094 17.89 12.1906 17.89 12.5 17.7113L16.6962 15.2887C17.0056 15.11 17.1962 14.7799 17.1962 14.4226V9.57735ZM14.9417 10.879C14.9417 10.5217 14.7511 10.1916 14.4417 10.0129L12.5 8.8919C12.1906 8.71327 11.8094 8.71327 11.5 8.8919L9.55831 10.0129C9.24891 10.1916 9.05831 10.5217 9.05831 10.879V13.121C9.05831 13.4783 9.24891 13.8084 9.55831 13.9871L11.5 15.1081C11.8094 15.2867 12.1906 15.2867 12.5 15.1081L14.4417 13.9871C14.7511 13.8084 14.9417 13.4783 14.9417 13.121V10.879Z", fill: "#9DF09E" })] });
LayerPeriphery.displayName = "LayerPeriphery";
const Memo$15 = reactExports.memo(LayerPeriphery);
const LayerLegend = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("rect", { x: 2, y: 2, width: 12, height: 12, rx: 6, fill: "currentColor" }) });
LayerLegend.displayName = "LayerLegend";
const Memo$14 = reactExports.memo(LayerLegend);
const LayerLegendSmall = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("rect", { x: 4, y: 4, width: 8, height: 8, rx: 4, fill: "currentColor" }) });
LayerLegendSmall.displayName = "LayerLegendSmall";
const Memo$13 = reactExports.memo(LayerLegendSmall);
const User24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 3.65001C7.38843 3.65001 3.65001 7.38843 3.65001 12C3.65001 13.7427 4.18386 15.3607 5.09694 16.6993C5.98766 14.8398 7.60752 13.3958 9.58672 12.7384C8.82837 12.0696 8.35001 11.0907 8.35001 10C8.35001 7.98417 9.98417 6.35001 12 6.35001C14.0158 6.35001 15.65 7.98417 15.65 10C15.65 11.0907 15.1716 12.0696 14.4133 12.7384C16.3925 13.3958 18.0124 14.8398 18.9031 16.6993C19.8162 15.3607 20.35 13.7427 20.35 12C20.35 7.38843 16.6116 3.65001 12 3.65001ZM17.9719 17.836C17.0869 15.3939 14.7463 13.65 12 13.65C9.25369 13.65 6.91313 15.3939 6.02809 17.836C7.54417 19.3872 9.65965 20.35 12 20.35C14.3404 20.35 16.4558 19.3872 17.9719 17.836ZM2.35001 12C2.35001 6.67046 6.67046 2.35001 12 2.35001C17.3296 2.35001 21.65 6.67046 21.65 12C21.65 17.3296 17.3296 21.65 12 21.65C6.67046 21.65 2.35001 17.3296 2.35001 12ZM12 7.65001C10.7021 7.65001 9.65001 8.70214 9.65001 10C9.65001 11.2979 10.7021 12.35 12 12.35C13.2979 12.35 14.35 11.2979 14.35 10C14.35 8.70214 13.2979 7.65001 12 7.65001Z", fill: "currentColor" }) });
User24.displayName = "User24";
const Memo$12 = reactExports.memo(User24);
const InfoOutline16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00002 2.66669C5.0545 2.66669 2.66669 5.0545 2.66669 8.00002C2.66669 10.9455 5.0545 13.3334 8.00002 13.3334C10.9455 13.3334 13.3334 10.9455 13.3334 8.00002C13.3334 5.0545 10.9455 2.66669 8.00002 2.66669ZM1.66669 8.00002C1.66669 4.50222 4.50222 1.66669 8.00002 1.66669C11.4978 1.66669 14.3334 4.50222 14.3334 8.00002C14.3334 11.4978 11.4978 14.3334 8.00002 14.3334C4.50222 14.3334 1.66669 11.4978 1.66669 8.00002Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 6.87481C8.27614 6.87481 8.5 7.09867 8.5 7.37481V11C8.5 11.2761 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.2761 7.5 11V7.37481C7.5 7.09867 7.72386 6.87481 8 6.87481Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 4.5C8.27614 4.5 8.5 4.72386 8.5 5V5.01C8.5 5.28614 8.27614 5.51 8 5.51C7.72386 5.51 7.5 5.28614 7.5 5.01V5C7.5 4.72386 7.72386 4.5 8 4.5Z", fill: "currentColor" })] });
InfoOutline16.displayName = "InfoOutline16";
const Memo$11 = reactExports.memo(InfoOutline16);
const Record16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00002 1.66669C4.50222 1.66669 1.66669 4.50222 1.66669 8.00002C1.66669 11.4978 4.50222 14.3334 8.00002 14.3334C11.4978 14.3334 14.3334 11.4978 14.3334 8.00002C14.3334 4.50222 11.4978 1.66669 8.00002 1.66669ZM2.66669 8.00002C2.66669 5.0545 5.0545 2.66669 8.00002 2.66669C10.9455 2.66669 13.3334 5.0545 13.3334 8.00002C13.3334 10.9455 10.9455 13.3334 8.00002 13.3334C5.0545 13.3334 2.66669 10.9455 2.66669 8.00002Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z", fill: "currentColor" })] });
Record16.displayName = "Record16";
const Memo$10 = reactExports.memo(Record16);
const InfoErrorOutline16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00002 13.3334C10.9455 13.3334 13.3334 10.9455 13.3334 8.00002C13.3334 5.0545 10.9455 2.66669 8.00002 2.66669C5.0545 2.66669 2.66669 5.0545 2.66669 8.00002C2.66669 10.9455 5.0545 13.3334 8.00002 13.3334ZM14.3334 8.00002C14.3334 11.4978 11.4978 14.3334 8.00002 14.3334C4.50222 14.3334 1.66669 11.4978 1.66669 8.00002C1.66669 4.50222 4.50222 1.66669 8.00002 1.66669C11.4978 1.66669 14.3334 4.50222 14.3334 8.00002Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00004 9.12523C7.7239 9.12523 7.50004 8.90137 7.50004 8.62523V5.00004C7.50004 4.7239 7.7239 4.50004 8.00004 4.50004C8.27618 4.50004 8.50004 4.7239 8.50004 5.00004V8.62523C8.50004 8.90137 8.27618 9.12523 8.00004 9.12523Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00004 11.5C7.7239 11.5 7.50004 11.2762 7.50004 11V10.99C7.50004 10.7139 7.7239 10.49 8.00004 10.49C8.27618 10.49 8.50004 10.7139 8.50004 10.99V11C8.50004 11.2762 8.27618 11.5 8.00004 11.5Z", fill: "currentColor" })] });
InfoErrorOutline16.displayName = "InfoErrorOutline16";
const Memo$$ = reactExports.memo(InfoErrorOutline16);
const Update24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.0914 4.94056C12.8672 4.59424 11.573 4.55683 10.3298 4.83193C9.08668 5.10703 7.93643 5.68535 6.98596 6.51158C6.03558 7.33774 5.31606 8.38464 4.89305 9.55378C4.77091 9.89135 4.39824 10.066 4.06068 9.94385C3.72311 9.82172 3.54846 9.44905 3.6706 9.11148C4.16971 7.73202 5.01741 6.5003 6.13308 5.53046C7.24868 4.56069 8.596 3.88416 10.0489 3.56264C11.5018 3.24113 13.0142 3.28479 14.4453 3.68966C15.87 4.0927 17.1691 4.84099 18.2221 5.86657L21.35 8.57676V5C21.35 4.64101 21.641 4.35 22 4.35C22.359 4.35 22.65 4.64101 22.65 5V10C22.65 10.359 22.359 10.65 22 10.65H17C16.641 10.65 16.35 10.359 16.35 10C16.35 9.64101 16.641 9.35 17 9.35H20.2572L17.3562 6.83643C17.3463 6.82783 17.3366 6.81894 17.3272 6.80976C16.4286 5.93043 15.3156 5.28687 14.0914 4.94056ZM1.35001 14C1.35001 13.641 1.64102 13.35 2.00001 13.35H7.00001C7.35899 13.35 7.65001 13.641 7.65001 14C7.65001 14.359 7.35899 14.65 7.00001 14.65H3.74281L6.64383 17.1636C6.65375 17.1722 6.66341 17.1811 6.67279 17.1902C7.57142 18.0696 8.68444 18.7131 9.90859 19.0594C11.1328 19.4058 12.4271 19.4432 13.6702 19.1681C14.9133 18.893 16.0636 18.3146 17.0141 17.4884C17.9644 16.6623 18.684 15.6154 19.107 14.4462C19.2291 14.1086 19.6018 13.934 19.9393 14.0561C20.2769 14.1783 20.4515 14.5509 20.3294 14.8885C19.8303 16.268 18.9826 17.4997 17.8669 18.4695C16.7513 19.4393 15.404 20.1158 13.9511 20.4374C12.4982 20.7589 10.9859 20.7152 9.55471 20.3103C8.13001 19.9073 6.83086 19.159 5.77795 18.1334L2.65001 15.4232V19C2.65001 19.359 2.35899 19.65 2.00001 19.65C1.64102 19.65 1.35001 19.359 1.35001 19V14Z", fill: "currentColor" }) });
Update24.displayName = "Update24";
const Memo$_ = reactExports.memo(Update24);
const Play24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65C6.83614 2.65 2.65001 6.83614 2.65001 12C2.65001 17.1639 6.83614 21.35 12 21.35C17.1639 21.35 21.35 17.1639 21.35 12C21.35 6.83614 17.1639 2.65 12 2.65ZM1.35001 12C1.35001 6.11817 6.11817 1.35 12 1.35C17.8818 1.35 22.65 6.11817 22.65 12C22.65 17.8818 17.8818 22.65 12 22.65C6.11817 22.65 1.35001 17.8818 1.35001 12Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.6933 7.42691C9.90465 7.3138 10.1611 7.32619 10.3606 7.45917L16.3606 11.4592C16.5414 11.5797 16.65 11.7827 16.65 12C16.65 12.2173 16.5414 12.4203 16.3606 12.5408L10.3606 16.5408C10.1611 16.6738 9.90465 16.6862 9.6933 16.5731C9.48195 16.46 9.35001 16.2397 9.35001 16V8C9.35001 7.76028 9.48195 7.54002 9.6933 7.42691ZM10.65 9.21453V14.7855L14.8282 12L10.65 9.21453Z", fill: "currentColor" })] });
Play24.displayName = "Play24";
const Memo$Z = reactExports.memo(Play24);
const PlayActive24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10.3606 7.45917C10.1611 7.3262 9.90464 7.3138 9.69329 7.42691C9.48194 7.54002 9.35 7.76028 9.35 8V16C9.35 16.2397 9.48194 16.46 9.69329 16.5731C9.90464 16.6862 10.1611 16.6738 10.3606 16.5408L16.3606 12.5408C16.5414 12.4203 16.65 12.2173 16.65 12C16.65 11.7827 16.5414 11.5797 16.3606 11.4592L10.3606 7.45917ZM14.8282 12L10.65 14.7855V9.21454L14.8282 12Z", fill: "currentColor" }) });
PlayActive24.displayName = "PlayActive24";
const Memo$Y = reactExports.memo(PlayActive24);
const StepBackward24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 5.35C7.35898 5.35 7.65 5.64101 7.65 6V18C7.65 18.359 7.35898 18.65 7 18.65C6.64101 18.65 6.35 18.359 6.35 18V6C6.35 5.64101 6.64101 5.35 7 5.35ZM16.5404 5.54038C16.7942 5.28654 17.2058 5.28654 17.4596 5.54038C17.7135 5.79422 17.7135 6.20578 17.4596 6.45962L11.9192 12L17.4596 17.5404C17.7135 17.7942 17.7135 18.2058 17.4596 18.4596C17.2058 18.7135 16.7942 18.7135 16.5404 18.4596L10.5404 12.4596C10.4185 12.3377 10.35 12.1724 10.35 12C10.35 11.8276 10.4185 11.6623 10.5404 11.5404L16.5404 5.54038Z", fill: "currentColor" }) });
StepBackward24.displayName = "StepBackward24";
const Memo$X = reactExports.memo(StepBackward24);
const PlayTimeline24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.35 6.4798C6.35 5.2407 7.67873 4.45642 8.76381 5.0529L18.806 10.5731C19.9314 11.1917 19.9313 12.8083 18.806 13.4269L8.76381 18.9471C7.67873 19.5436 6.35 18.7593 6.35 17.5202V6.4798ZM8.13758 6.19212C7.91784 6.07133 7.65 6.23055 7.65 6.4798V17.5202C7.65 17.7695 7.91783 17.9287 8.13757 17.8079L18.1797 12.2877C18.4068 12.1629 18.4068 11.8371 18.1797 11.7123L8.13758 6.19212Z", fill: "currentColor" }) });
PlayTimeline24.displayName = "PlayTimeline24";
const Memo$W = reactExports.memo(PlayTimeline24);
const StepForward24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.54038 5.54038C6.79422 5.28654 7.20578 5.28654 7.45962 5.54038L13.4596 11.5404C13.5815 11.6623 13.65 11.8276 13.65 12C13.65 12.1724 13.5815 12.3377 13.4596 12.4596L7.45962 18.4596C7.20578 18.7135 6.79422 18.7135 6.54038 18.4596C6.28654 18.2058 6.28654 17.7942 6.54038 17.5404L12.0808 12L6.54038 6.45962C6.28654 6.20578 6.28654 5.79422 6.54038 5.54038ZM17 18.65C16.641 18.65 16.35 18.359 16.35 18V6C16.35 5.64101 16.641 5.35 17 5.35C17.359 5.35 17.65 5.64101 17.65 6V18C17.65 18.359 17.359 18.65 17 18.65Z", fill: "currentColor" }) });
StepForward24.displayName = "StepForward24";
const Memo$V = reactExports.memo(StepForward24);
const Pause24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.35 7C6.35 6.08873 7.08873 5.35 8 5.35H9C9.91127 5.35 10.65 6.08873 10.65 7V17C10.65 17.9113 9.91127 18.65 9 18.65H8C7.08873 18.65 6.35 17.9113 6.35 17V7ZM8 6.65C7.8067 6.65 7.65 6.8067 7.65 7V17C7.65 17.1933 7.8067 17.35 8 17.35H9C9.1933 17.35 9.35 17.1933 9.35 17V7C9.35 6.8067 9.1933 6.65 9 6.65H8ZM13.35 7C13.35 6.08873 14.0887 5.35 15 5.35H16C16.9113 5.35 17.65 6.08873 17.65 7V17C17.65 17.9113 16.9113 18.65 16 18.65H15C14.0887 18.65 13.35 17.9113 13.35 17V7ZM15 6.65C14.8067 6.65 14.65 6.8067 14.65 7V17C14.65 17.1933 14.8067 17.35 15 17.35H16C16.1933 17.35 16.35 17.1933 16.35 17V7C16.35 6.8067 16.1933 6.65 16 6.65H15Z", fill: "currentColor" }) });
Pause24.displayName = "Pause24";
const Memo$U = reactExports.memo(Pause24);
const ToStart24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 5.35C4.35898 5.35 4.65 5.64101 4.65 6V18C4.65 18.359 4.35898 18.65 4 18.65C3.64101 18.65 3.35 18.359 3.35 18V6C3.35 5.64101 3.64101 5.35 4 5.35ZM13.5404 5.54038C13.7942 5.28654 14.2058 5.28654 14.4596 5.54038C14.7135 5.79422 14.7135 6.20578 14.4596 6.45962L8.91924 12L14.4596 17.5404C14.7135 17.7942 14.7135 18.2058 14.4596 18.4596C14.2058 18.7135 13.7942 18.7135 13.5404 18.4596L7.54038 12.4596C7.41848 12.3377 7.35 12.1724 7.35 12C7.35 11.8276 7.41848 11.6623 7.54038 11.5404L13.5404 5.54038ZM19.5404 5.54038C19.7942 5.28654 20.2058 5.28654 20.4596 5.54038C20.7135 5.79422 20.7135 6.20578 20.4596 6.45962L14.9192 12L20.4596 17.5404C20.7135 17.7942 20.7135 18.2058 20.4596 18.4596C20.2058 18.7135 19.7942 18.7135 19.5404 18.4596L13.5404 12.4596C13.4185 12.3377 13.35 12.1724 13.35 12C13.35 11.8276 13.4185 11.6623 13.5404 11.5404L19.5404 5.54038Z", fill: "currentColor" }) });
ToStart24.displayName = "ToStart24";
const Memo$T = reactExports.memo(ToStart24);
const DoubleChevronLeft24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.4596 6.54039C11.7135 6.79423 11.7135 7.20578 11.4596 7.45963L6.91924 12L11.4596 16.5404C11.7135 16.7942 11.7135 17.2058 11.4596 17.4596C11.2058 17.7135 10.7942 17.7135 10.5404 17.4596L5.54038 12.4596C5.41848 12.3377 5.35 12.1724 5.35 12C5.35 11.8276 5.41848 11.6623 5.54038 11.5404L10.5404 6.54039C10.7942 6.28655 11.2058 6.28655 11.4596 6.54039ZM17.4596 6.54039C17.7135 6.79423 17.7135 7.20578 17.4596 7.45963L12.9192 12L17.4596 16.5404C17.7135 16.7942 17.7135 17.2058 17.4596 17.4596C17.2058 17.7135 16.7942 17.7135 16.5404 17.4596L11.5404 12.4596C11.2865 12.2058 11.2865 11.7942 11.5404 11.5404L16.5404 6.54039C16.7942 6.28655 17.2058 6.28655 17.4596 6.54039Z", fill: "currentColor" }) });
DoubleChevronLeft24.displayName = "DoubleChevronLeft24";
const Memo$S = reactExports.memo(DoubleChevronLeft24);
const DoubleChevronRight24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.54038 6.54039C5.79422 6.28655 6.20578 6.28655 6.45962 6.54039L11.4596 11.5404C11.5815 11.6623 11.65 11.8276 11.65 12C11.65 12.1724 11.5815 12.3377 11.4596 12.4596L6.45962 17.4596C6.20578 17.7135 5.79422 17.7135 5.54038 17.4596C5.28654 17.2058 5.28654 16.7942 5.54038 16.5404L10.0808 12L5.54038 7.45963C5.28654 7.20578 5.28654 6.79423 5.54038 6.54039ZM11.5404 6.54039C11.7942 6.28655 12.2058 6.28655 12.4596 6.54039L17.4596 11.5404C17.5815 11.6623 17.65 11.8276 17.65 12C17.65 12.1724 17.5815 12.3377 17.4596 12.4596L12.4596 17.4596C12.2058 17.7135 11.7942 17.7135 11.5404 17.4596C11.2865 17.2058 11.2865 16.7942 11.5404 16.5404L16.0808 12L11.5404 7.45963C11.2865 7.20578 11.2865 6.79423 11.5404 6.54039Z", fill: "currentColor" }) });
DoubleChevronRight24.displayName = "DoubleChevronRight24";
const Memo$R = reactExports.memo(DoubleChevronRight24);
const ColumnWidth16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M2.93751 3.34375C2.93751 3.01583 2.67167 2.75 2.34375 2.75C2.01583 2.75 1.75 3.01583 1.75 3.34375L1.75001 12.6562C1.75001 12.9842 2.01584 13.25 2.34376 13.25C2.67168 13.25 2.93751 12.9842 2.93751 12.6562V3.34375ZM14.25 3.34375C14.25 3.01583 13.9842 2.75 13.6563 2.75C13.3283 2.75 13.0625 3.01583 13.0625 3.34375V12.6562C13.0625 12.9842 13.3283 13.25 13.6563 13.25C13.9842 13.25 14.25 12.9842 14.25 12.6562V3.34375ZM12.2703 7.87969L10.2766 6.30625C10.2599 6.29313 10.2398 6.28497 10.2187 6.28271C10.1976 6.28045 10.1763 6.28419 10.1572 6.29348C10.1382 6.30278 10.1221 6.31726 10.1109 6.33527C10.0996 6.35328 10.0937 6.37409 10.0938 6.39531V7.4375H5.90626V6.45625C5.90626 6.3625 5.79688 6.30937 5.72344 6.36719L3.72969 7.94219C3.7162 7.95261 3.70528 7.96599 3.69776 7.98129C3.69025 7.9966 3.68634 8.01342 3.68634 8.03047C3.68634 8.04752 3.69025 8.06434 3.69776 8.07965C3.70528 8.09495 3.7162 8.10833 3.72969 8.11875L5.72188 9.69375C5.79532 9.75156 5.90469 9.7 5.90469 9.60469V8.5625H10.0922V9.54375C10.0922 9.6375 10.2016 9.69063 10.275 9.63281L12.2672 8.05781C12.3266 8.0125 12.3266 7.925 12.2703 7.87969Z", fill: "currentColor" }) });
ColumnWidth16.displayName = "ColumnWidth16";
const Memo$Q = reactExports.memo(ColumnWidth16);
const Twoxtwo16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M7.25 2.25H2.5C2.3625 2.25 2.25 2.3625 2.25 2.5V7.25C2.25 7.3875 2.3625 7.5 2.5 7.5H7.25C7.3875 7.5 7.5 7.3875 7.5 7.25V2.5C7.5 2.3625 7.3875 2.25 7.25 2.25ZM6.4375 6.4375H3.3125V3.3125H6.4375V6.4375ZM13.5 2.25H8.75C8.6125 2.25 8.5 2.3625 8.5 2.5V7.25C8.5 7.3875 8.6125 7.5 8.75 7.5H13.5C13.6375 7.5 13.75 7.3875 13.75 7.25V2.5C13.75 2.3625 13.6375 2.25 13.5 2.25ZM12.6875 6.4375H9.5625V3.3125H12.6875V6.4375ZM7.25 8.5H2.5C2.3625 8.5 2.25 8.6125 2.25 8.75V13.5C2.25 13.6375 2.3625 13.75 2.5 13.75H7.25C7.3875 13.75 7.5 13.6375 7.5 13.5V8.75C7.5 8.6125 7.3875 8.5 7.25 8.5ZM6.4375 12.6875H3.3125V9.5625H6.4375V12.6875ZM13.5 8.5H8.75C8.6125 8.5 8.5 8.6125 8.5 8.75V13.5C8.5 13.6375 8.6125 13.75 8.75 13.75H13.5C13.6375 13.75 13.75 13.6375 13.75 13.5V8.75C13.75 8.6125 13.6375 8.5 13.5 8.5ZM12.6875 12.6875H9.5625V9.5625H12.6875V12.6875Z", fill: "currentColor" }) });
Twoxtwo16.displayName = "Twoxtwo16";
const Memo$P = reactExports.memo(Twoxtwo16);
const Tags16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M7.54938 12.3487L13.4588 6.43774C13.4853 6.41118 13.4978 6.37524 13.4947 6.3393L13.0963 1.62993C13.0853 1.50805 12.99 1.41274 12.8681 1.4018L8.15875 1.00493C8.12281 1.0018 8.08531 1.0143 8.06031 1.04086L2.15094 6.95024C2.12767 6.97373 2.11462 7.00546 2.11462 7.03852C2.11462 7.07158 2.12767 7.10331 2.15094 7.1268L7.37281 12.3487C7.42125 12.3987 7.50094 12.3987 7.54938 12.3487ZM8.5275 2.16586L12.0369 2.46274L12.3338 5.97211L7.46031 10.844L3.65406 7.0393L8.5275 2.16586ZM9.4675 5.07571C9.53715 5.14535 9.61984 5.20059 9.71084 5.23828C9.80184 5.27596 9.89937 5.29535 9.99787 5.29535C10.0964 5.29534 10.1939 5.27593 10.2849 5.23823C10.3759 5.20053 10.4586 5.14528 10.5282 5.07563C10.5978 5.00598 10.6531 4.92329 10.6908 4.83229C10.7285 4.74129 10.7479 4.64376 10.7478 4.54526C10.7478 4.44677 10.7284 4.34924 10.6907 4.25824C10.653 4.16725 10.5978 4.08457 10.5281 4.01493C10.4585 3.94528 10.3758 3.89004 10.2848 3.85236C10.1938 3.81467 10.0963 3.79528 9.99776 3.79529C9.89926 3.79529 9.80173 3.8147 9.71074 3.8524C9.61974 3.8901 9.53707 3.94535 9.46742 4.015C9.39778 4.08466 9.34254 4.16734 9.30486 4.25834C9.26717 4.34934 9.24778 4.44688 9.24778 4.54537C9.24779 4.64387 9.2672 4.7414 9.3049 4.83239C9.3426 4.92339 9.39785 5.00607 9.4675 5.07571ZM13.9009 8.43461L13.2822 7.81743C13.2587 7.79416 13.227 7.78111 13.1939 7.78111C13.1608 7.78111 13.1291 7.79416 13.1056 7.81743L7.44938 13.4627L3.73687 9.75961C3.71338 9.73635 3.68166 9.7233 3.64859 9.7233C3.61553 9.7233 3.58381 9.73635 3.56031 9.75961L2.94156 10.3768C2.9183 10.4003 2.90525 10.432 2.90525 10.4651C2.90525 10.4981 2.9183 10.5299 2.94156 10.5534L6.74156 14.3471L7.36031 14.9643C7.40875 15.0127 7.48844 15.0127 7.53687 14.9643L13.9009 8.61118C13.9494 8.56274 13.9494 8.48305 13.9009 8.43461Z", fill: "currentColor" }) });
Tags16.displayName = "Tags16";
const Memo$O = reactExports.memo(Tags16);
const Upload24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 3.492C12.1724 3.492 12.3378 3.56049 12.4597 3.68238L16.4751 7.69786C16.729 7.9517 16.729 8.36326 16.4751 8.6171C16.2213 8.87094 15.8098 8.87094 15.5559 8.6171L12.65 5.71124V14.5155C12.65 14.8745 12.359 15.1655 12 15.1655C11.641 15.1655 11.35 14.8745 11.35 14.5155V5.71125L8.44419 8.6171C8.19035 8.87094 7.77879 8.87094 7.52495 8.6171C7.27111 8.36326 7.27111 7.95171 7.52495 7.69787L11.5404 3.68239C11.6623 3.56049 11.8276 3.492 12 3.492ZM3.98615 13.4203C4.34514 13.4203 4.63615 13.7113 4.63615 14.0703V18.858C4.63615 19.0513 4.79285 19.208 4.98615 19.208H19.0139C19.2072 19.208 19.3639 19.0513 19.3639 18.858V14.0703C19.3639 13.7113 19.6549 13.4203 20.0139 13.4203C20.3728 13.4203 20.6639 13.7113 20.6639 14.0703V18.858C20.6639 19.7693 19.9251 20.508 19.0139 20.508H4.98615C4.07488 20.508 3.33615 19.7693 3.33615 18.858V14.0703C3.33615 13.7113 3.62717 13.4203 3.98615 13.4203Z", fill: "currentColor" }) });
Upload24.displayName = "Upload24";
const Memo$N = reactExports.memo(Upload24);
const AdvancedAnalytics24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.38382 2.91069C3.84953 2.44497 4.48118 2.18333 5.1398 2.18333H15.1936C15.366 2.18333 15.5313 2.25182 15.6532 2.37371L21.1532 7.87372C21.2751 7.99561 21.3436 8.16094 21.3436 8.33333V19.3333C21.3436 19.992 21.0819 20.6236 20.6162 21.0893C20.1505 21.555 19.5188 21.8167 18.8602 21.8167H5.1398C4.48118 21.8167 3.84953 21.555 3.38382 21.0893C2.9181 20.6236 2.65646 19.992 2.65646 19.3333V4.66667C2.65646 4.00805 2.9181 3.3764 3.38382 2.91069ZM5.1398 3.48333C4.82596 3.48333 4.52497 3.60801 4.30305 3.82992C4.08114 4.05184 3.95646 4.35283 3.95646 4.66667V19.3333C3.95646 19.6472 4.08114 19.9482 4.30305 20.1701C4.52497 20.392 4.82596 20.5167 5.1398 20.5167H18.8602C19.1741 20.5167 19.475 20.392 19.697 20.1701C19.9189 19.9482 20.0436 19.6472 20.0436 19.3333V8.60257L14.9243 3.48333H5.1398Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.37869 6.5C5.37869 6.14102 5.6697 5.85 6.02869 5.85H7.86202C8.221 5.85 8.51202 6.14102 8.51202 6.5C8.51202 6.85899 8.221 7.15 7.86202 7.15H6.02869C5.6697 7.15 5.37869 6.85899 5.37869 6.5ZM10.2803 6.5C10.2803 6.14102 10.5713 5.85 10.9303 5.85H12.7636C13.1226 5.85 13.4136 6.14102 13.4136 6.5C13.4136 6.85899 13.1226 7.15 12.7636 7.15H10.9303C10.5713 7.15 10.2803 6.85899 10.2803 6.5ZM5.37869 10.1667C5.37869 9.80768 5.6697 9.51667 6.02869 9.51667H7.86202C8.221 9.51667 8.51202 9.80768 8.51202 10.1667C8.51202 10.5257 8.221 10.8167 7.86202 10.8167H6.02869C5.6697 10.8167 5.37869 10.5257 5.37869 10.1667ZM10.2803 10.1667C10.2803 9.80768 10.5713 9.51667 10.9303 9.51667H12.7636C13.1226 9.51667 13.4136 9.80768 13.4136 10.1667C13.4136 10.5257 13.1226 10.8167 12.7636 10.8167H10.9303C10.5713 10.8167 10.2803 10.5257 10.2803 10.1667ZM5.37869 13.8333C5.37869 13.4743 5.6697 13.1833 6.02869 13.1833H7.86202C8.221 13.1833 8.51202 13.4743 8.51202 13.8333C8.51202 14.1923 8.221 14.4833 7.86202 14.4833H6.02869C5.6697 14.4833 5.37869 14.1923 5.37869 13.8333ZM10.2803 13.8333C10.2803 13.4743 10.5713 13.1833 10.9303 13.1833H12.7636C13.1226 13.1833 13.4136 13.4743 13.4136 13.8333C13.4136 14.1923 13.1226 14.4833 12.7636 14.4833H10.9303C10.5713 14.4833 10.2803 14.1923 10.2803 13.8333ZM15.182 13.8333C15.182 13.4743 15.473 13.1833 15.832 13.1833H17.6653C18.0243 13.1833 18.3153 13.4743 18.3153 13.8333C18.3153 14.1923 18.0243 14.4833 17.6653 14.4833H15.832C15.473 14.4833 15.182 14.1923 15.182 13.8333ZM5.37869 17.5C5.37869 17.141 5.6697 16.85 6.02869 16.85H7.86202C8.221 16.85 8.51202 17.141 8.51202 17.5C8.51202 17.859 8.221 18.15 7.86202 18.15H6.02869C5.6697 18.15 5.37869 17.859 5.37869 17.5ZM10.2803 17.5C10.2803 17.141 10.5713 16.85 10.9303 16.85H12.7636C13.1226 16.85 13.4136 17.141 13.4136 17.5C13.4136 17.859 13.1226 18.15 12.7636 18.15H10.9303C10.5713 18.15 10.2803 17.859 10.2803 17.5ZM15.182 17.5C15.182 17.141 15.473 16.85 15.832 16.85H17.6653C18.0243 16.85 18.3153 17.141 18.3153 17.5C18.3153 17.859 18.0243 18.15 17.6653 18.15H15.832C15.473 18.15 15.182 17.859 15.182 17.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.1936 2.18333C15.5525 2.18333 15.8436 2.47435 15.8436 2.83333V7.68333H20.6936C21.0525 7.68333 21.3436 7.97435 21.3436 8.33333C21.3436 8.69232 21.0525 8.98333 20.6936 8.98333H15.1936C14.8346 8.98333 14.5436 8.69232 14.5436 8.33333V2.83333C14.5436 2.47435 14.8346 2.18333 15.1936 2.18333Z", fill: "currentColor" })] });
AdvancedAnalytics24.displayName = "AdvancedAnalytics24";
const Memo$M = reactExports.memo(AdvancedAnalytics24);
const Legend24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.5176 4.5913C10.5176 4.23231 10.8086 3.9413 11.1676 3.9413H21.3786C21.7376 3.9413 22.0286 4.23231 22.0286 4.5913C22.0286 4.95028 21.7376 5.2413 21.3786 5.2413H11.1676C10.8086 5.2413 10.5176 4.95028 10.5176 4.5913ZM10.5175 11.9317C10.5175 11.5727 10.8085 11.2817 11.1675 11.2817H21.3785C21.7375 11.2817 22.0285 11.5727 22.0285 11.9317C22.0285 12.2906 21.7375 12.5817 21.3785 12.5817H11.1675C10.8085 12.5817 10.5175 12.2906 10.5175 11.9317ZM10.5176 19.4009C10.5176 19.0419 10.8086 18.7509 11.1676 18.7509H21.3786C21.7376 18.7509 22.0286 19.0419 22.0286 19.4009C22.0286 19.7599 21.7376 20.0509 21.3786 20.0509H11.1676C10.8086 20.0509 10.5176 19.7599 10.5176 19.4009Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.48068 16.9238C5.68921 16.9238 5.88508 17.0239 6.00731 17.1929L8.40767 20.5108C8.5508 20.7086 8.57097 20.97 8.45989 21.1875C8.34882 21.4049 8.12523 21.5418 7.88104 21.5418H3.0801C2.83591 21.5418 2.61232 21.4049 2.50124 21.1874C2.39016 20.97 2.41034 20.7086 2.55348 20.5108L4.95405 17.1928C5.07629 17.0239 5.27216 16.9238 5.48068 16.9238ZM4.35267 20.2418H6.60853L5.48065 18.6828L4.35267 20.2418Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.68014 6.93857C3.32115 6.93857 3.03014 6.64755 3.03014 6.28857L3.03014 2.89379C3.03014 2.5348 3.32115 2.24379 3.68014 2.24379L7.07491 2.24379C7.4339 2.24379 7.72491 2.5348 7.72491 2.89379V6.28857C7.72491 6.64755 7.4339 6.93857 7.07491 6.93857H3.68014ZM4.33014 5.63857L6.42491 5.63857L6.42491 3.54379L4.33014 3.54379L4.33014 5.63857Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.48051 10.7809C4.84517 10.7809 4.33012 11.2959 4.33012 11.9313C4.33012 12.5666 4.84517 13.0817 5.48051 13.0817C6.11586 13.0817 6.63091 12.5666 6.63091 11.9313C6.63091 11.2959 6.11586 10.7809 5.48051 10.7809ZM3.03012 11.9313C3.03012 10.5779 4.1272 9.48087 5.48051 9.48087C6.83383 9.48087 7.93091 10.5779 7.93091 11.9313C7.93091 13.2846 6.83383 14.3817 5.48051 14.3817C4.1272 14.3817 3.03012 13.2846 3.03012 11.9313Z", fill: "currentColor" })] });
Legend24.displayName = "Legend24";
const Memo$L = reactExports.memo(Legend24);
const BivariateMatrix24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.5404 1.40799C11.7942 1.15415 12.2058 1.15415 12.4596 1.40799L16.2593 5.20764C16.3812 5.32954 16.4496 5.49487 16.4496 5.66726C16.4496 5.83965 16.3812 6.00498 16.2593 6.12688L12.4596 9.92653C12.2058 10.1804 11.7942 10.1804 11.5404 9.92653L7.74072 6.12688C7.48688 5.87304 7.48688 5.46148 7.74072 5.20764L11.5404 1.40799ZM12 2.78684L9.11958 5.66726L12 8.54768L14.8804 5.66726L12 2.78684ZM5.20785 7.74072C5.46169 7.48688 5.87325 7.48688 6.12709 7.74072L9.92675 11.5404C10.1806 11.7942 10.1806 12.2058 9.92675 12.4596L6.12709 16.2593C6.00519 16.3812 5.83986 16.4497 5.66747 16.4497C5.49508 16.4497 5.32975 16.3812 5.20785 16.2593L1.4082 12.4596C1.15436 12.2058 1.15436 11.7942 1.4082 11.5404L5.20785 7.74072ZM17.8733 7.74072C18.1272 7.48688 18.5387 7.48688 18.7926 7.74072L22.5922 11.5404C22.8461 11.7942 22.8461 12.2058 22.5922 12.4596L18.7926 16.2593C18.6707 16.3812 18.5053 16.4497 18.3329 16.4497C18.1606 16.4497 17.9952 16.3812 17.8733 16.2593L14.0737 12.4596C13.8198 12.2058 13.8198 11.7942 14.0737 11.5404L17.8733 7.74072ZM2.78706 12L5.66747 14.8804L8.54789 12L5.66747 9.11958L2.78706 12ZM15.4525 12L18.3329 14.8804L21.2134 12L18.3329 9.11958L15.4525 12ZM9.11958 18.3327L12 21.2131L14.8804 18.3327L12 15.4523L9.11958 18.3327ZM11.5404 14.0735C11.7942 13.8196 12.2058 13.8196 12.4596 14.0735L16.2593 17.8731C16.3812 17.995 16.4496 18.1603 16.4496 18.3327C16.4496 18.5051 16.3812 18.6705 16.2593 18.7924L12.4596 22.592C12.2058 22.8458 11.7942 22.8458 11.5404 22.592L7.74072 18.7924C7.48688 18.5385 7.48688 18.127 7.74072 17.8731L11.5404 14.0735Z", fill: "currentColor" }) });
BivariateMatrix24.displayName = "BivariateMatrix24";
const Memo$K = reactExports.memo(BivariateMatrix24);
const Disasters24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.91853 1.53128C10.1152 1.34236 10.4088 1.29625 10.6539 1.4158C11.3546 1.75765 12.4102 2.41152 13.3498 3.28613C14.2789 4.15109 15.1719 5.30393 15.4023 6.65244C15.6217 7.93704 15.3906 9.16501 15.0314 10.161C14.9485 10.3908 14.858 10.6104 14.7633 10.8178C15.3639 10.5268 15.8848 10.1564 16.1772 9.72851C16.9068 8.66078 17.0401 7.86599 17.0401 7.71428C17.0401 7.46186 17.1862 7.23227 17.4149 7.12541C17.6435 7.01854 17.9134 7.05373 18.107 7.21565C19.3865 8.28562 21.5326 11.3976 20.2637 15.5244C19.5299 17.9106 18.4601 19.5109 17.3801 20.6031C16.3017 21.6937 15.2363 22.2535 14.5585 22.5842C14.3786 22.6719 14.1684 22.6719 13.9885 22.5842L13.9771 22.5786C13.4918 22.3419 12.7207 21.9657 12.0061 21.4587C11.2994 20.9573 10.5527 20.2628 10.2419 19.353C10.0735 18.8603 9.95939 18.419 9.88198 18.0301C9.6785 18.4215 9.55464 18.8078 9.55464 19.1428C9.55464 20.1784 9.85354 20.9978 9.97118 21.2273C10.1055 21.4895 10.0468 21.8092 9.82804 22.0065C9.6093 22.2038 9.28524 22.2293 9.03831 22.0687C8.26056 21.5628 7.11122 20.6404 6.14848 19.4882C5.19719 18.3497 4.35001 16.8933 4.35001 15.3333C4.35001 13.5041 4.89805 12.2943 5.76963 11.1823C6.1908 10.645 6.68801 10.1296 7.20997 9.59087C7.22638 9.57393 7.24283 9.55695 7.25932 9.53993C7.77319 9.0096 8.32212 8.44308 8.89847 7.76831C10.6321 5.73861 10.2022 3.23679 9.77376 2.26141C9.6641 2.01176 9.72191 1.7202 9.91853 1.53128ZM11.3941 3.37282C11.5878 4.86018 11.3797 6.86494 9.88697 8.61262C9.28364 9.31898 8.70992 9.91105 8.19935 10.438C8.1807 10.4572 8.16214 10.4764 8.14366 10.4954C7.6132 11.043 7.16475 11.5097 6.7928 11.9843C6.07812 12.8961 5.65001 13.8292 5.65001 15.3333C5.65001 16.44 6.26706 17.6027 7.14607 18.6546C7.50932 19.0894 7.90403 19.4893 8.29056 19.84C8.26781 19.6181 8.25464 19.3847 8.25464 19.1428C8.25464 18.4015 8.56484 17.6862 8.89535 17.1315C9.23171 16.5671 9.63398 16.0946 9.91496 15.8205C10.1021 15.6379 10.3804 15.5852 10.6213 15.6867C10.8622 15.7883 11.0189 16.0243 11.0189 16.2857V16.2927C11.0189 16.7358 11.0188 17.6062 11.472 18.9327C11.6493 19.4515 12.1228 19.9475 12.7583 20.3985C13.2667 20.7591 13.8181 21.0496 14.271 21.2746C14.8723 20.9651 15.659 20.4947 16.4557 19.689C17.3826 18.7517 18.3465 17.3361 19.0211 15.1423C19.8546 12.4316 18.9425 10.2572 18.0256 9.0292C17.8552 9.45548 17.6051 9.94316 17.2506 10.4619C16.7663 11.1707 15.9965 11.6688 15.2985 12.0029C14.59 12.3421 13.8781 12.5489 13.4218 12.638C13.1528 12.6904 12.8798 12.5686 12.7393 12.3333C12.5988 12.098 12.6209 11.7998 12.7947 11.5878C13.0728 11.2487 13.4999 10.5755 13.8085 9.71991C14.1163 8.86671 14.2919 7.87247 14.1209 6.87135C13.9608 5.93414 13.3082 5.0235 12.464 4.23766C12.1158 3.91349 11.748 3.6228 11.3941 3.37282Z", fill: "currentColor" }) });
Disasters24.displayName = "Disasters24";
const Memo$J = reactExports.memo(Disasters24);
const EditOsm24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.98131 7.95182C10.2352 7.69798 10.6467 7.69798 10.9006 7.95182L15.8503 12.9016C16.1041 13.1554 16.1041 13.567 15.8503 13.8208L7.70825 21.963C7.58635 22.0849 7.42102 22.1533 7.24863 22.1533H2.29888C1.9399 22.1533 1.64888 21.8623 1.64888 21.5033L1.64888 16.5536C1.64888 16.3812 1.71736 16.2159 1.83926 16.094L9.98131 7.95182ZM10.4409 9.33068L8.17819 11.5934L12.2087 15.6239L14.4714 13.3612L10.4409 9.33068ZM11.2895 16.5432L7.25896 12.5127L2.94888 16.8228L2.94888 20.8533H6.97939L11.2895 16.5432Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16.176 2.6718C15.8171 2.6718 15.526 2.38078 15.526 2.0218C15.526 1.66281 15.8171 1.3718 16.176 1.3718H22.176C22.535 1.3718 22.826 1.66281 22.826 2.0218V8.0218C22.826 8.38078 22.535 8.6718 22.176 8.6718C21.8171 8.6718 21.526 8.38078 21.526 8.0218V3.59103L16.6357 8.48142C16.3818 8.73526 15.9703 8.73526 15.7164 8.48142C15.4626 8.22757 15.4626 7.81602 15.7164 7.56218L20.6068 2.6718H16.176Z", fill: "currentColor" })] });
EditOsm24.displayName = "EditOsm24";
const Memo$I = reactExports.memo(EditOsm24);
const Layers24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.7232 3.41187C11.8985 3.32938 12.1015 3.32938 12.2768 3.41187L20.7768 7.41187C21.0046 7.51908 21.15 7.74822 21.15 8.00001C21.15 8.25179 21.0046 8.48093 20.7768 8.58814L12.2768 12.5881C12.1015 12.6706 11.8985 12.6706 11.7232 12.5881L3.22324 8.58814C2.99542 8.48093 2.85001 8.25179 2.85001 8.00001C2.85001 7.74822 2.99542 7.51908 3.22324 7.41187L11.7232 3.41187ZM5.02656 8.00001L12 11.2816L18.9735 8.00001L12 4.71838L5.02656 8.00001ZM2.91187 11.7232C3.06473 11.3984 3.45196 11.259 3.77678 11.4119L12 15.2816L20.2232 11.4119C20.5481 11.259 20.9353 11.3984 21.0881 11.7232C21.241 12.0481 21.1016 12.4353 20.7768 12.5881L12.2768 16.5881C12.1015 16.6706 11.8985 16.6706 11.7232 16.5881L3.22324 12.5881C2.89842 12.4353 2.75902 12.0481 2.91187 11.7232ZM2.91187 15.7232C3.06473 15.3984 3.45196 15.259 3.77678 15.4119L12 19.2816L20.2232 15.4119C20.5481 15.259 20.9353 15.3984 21.0881 15.7232C21.241 16.0481 21.1016 16.4353 20.7768 16.5881L12.2768 20.5881C12.1015 20.6706 11.8985 20.6706 11.7232 20.5881L3.22324 16.5881C2.89842 16.4353 2.75902 16.0481 2.91187 15.7232Z", fill: "currentColor" }) });
Layers24.displayName = "Layers24";
const Memo$H = reactExports.memo(Layers24);
const Trash24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.21842 5.17118C8.21842 4.25991 8.95715 3.52118 9.86842 3.52118H14.1315C15.0428 3.52118 15.7815 4.25991 15.7815 5.17118V6.65262H19.0461C19.4051 6.65262 19.6961 6.94364 19.6961 7.30262C19.6961 7.66161 19.4051 7.95262 19.0461 7.95262H18.1302V18.8289C18.1302 19.7401 17.3915 20.4789 16.4802 20.4789H7.51977C6.6085 20.4789 5.86977 19.7401 5.86977 18.8289V7.95262H4.95405C4.59506 7.95262 4.30405 7.66161 4.30405 7.30262C4.30405 6.94364 4.59506 6.65262 4.95405 6.65262H8.21842V5.17118ZM9.51842 6.65262H14.4815V5.17118C14.4815 4.97788 14.3248 4.82118 14.1315 4.82118H9.86842C9.67512 4.82118 9.51842 4.97788 9.51842 5.17118V6.65262ZM7.16977 7.95262V18.8289C7.16977 19.0222 7.32647 19.1789 7.51977 19.1789H16.4802C16.6735 19.1789 16.8302 19.0222 16.8302 18.8289V7.95262H7.16977ZM10.4341 10.5671C10.7931 10.5671 11.0841 10.8582 11.0841 11.2171V15.9145C11.0841 16.2735 10.7931 16.5645 10.4341 16.5645C10.0752 16.5645 9.78414 16.2735 9.78414 15.9145V11.2171C9.78414 10.8582 10.0752 10.5671 10.4341 10.5671ZM13.5657 10.5671C13.9247 10.5671 14.2157 10.8582 14.2157 11.2171V15.9145C14.2157 16.2735 13.9247 16.5645 13.5657 16.5645C13.2067 16.5645 12.9157 16.2735 12.9157 15.9145V11.2171C12.9157 10.8582 13.2067 10.5671 13.5657 10.5671Z", fill: "currentColor" }) });
Trash24.displayName = "Trash24";
const Memo$G = reactExports.memo(Trash24);
const Error24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2.65001C6.83614 2.65001 2.65001 6.83614 2.65001 12C2.65001 17.1639 6.83614 21.35 12 21.35C17.1639 21.35 21.35 17.1639 21.35 12C21.35 6.83614 17.1639 2.65001 12 2.65001ZM1.35001 12C1.35001 6.11817 6.11817 1.35001 12 1.35001C17.8818 1.35001 22.65 6.11817 22.65 12C22.65 17.8818 17.8818 22.65 12 22.65C6.11817 22.65 1.35001 17.8818 1.35001 12ZM8.35001 9.00001C8.35001 8.64102 8.64102 8.35001 9.00001 8.35001H9.01001C9.36899 8.35001 9.66001 8.64102 9.66001 9.00001C9.66001 9.35899 9.36899 9.65001 9.01001 9.65001H9.00001C8.64102 9.65001 8.35001 9.35899 8.35001 9.00001ZM14.35 9.00001C14.35 8.64102 14.641 8.35001 15 8.35001H15.01C15.369 8.35001 15.66 8.64102 15.66 9.00001C15.66 9.35899 15.369 9.65001 15.01 9.65001H15C14.641 9.65001 14.35 9.35899 14.35 9.00001ZM8.68019 14.4743C9.43948 13.9221 10.5709 13.35 12 13.35C13.4291 13.35 14.5605 13.9221 15.3198 14.4743C15.7007 14.7513 15.9951 15.0283 16.1959 15.2378C16.2965 15.3428 16.3744 15.4316 16.4286 15.4962C16.4557 15.5285 16.4769 15.5548 16.4922 15.5741L16.5106 15.5977L16.5164 15.6053L16.5185 15.608L16.5193 15.6091C16.5195 15.6093 16.52 15.61 16 16L16.52 15.61C16.7354 15.8972 16.6772 16.3046 16.39 16.52C16.1034 16.735 15.6969 16.6774 15.4812 16.3916C15.4809 16.3912 15.4806 16.3908 15.4803 16.3904L15.4729 16.381C15.465 16.371 15.4516 16.3543 15.4328 16.3319C15.3952 16.2871 15.3363 16.2197 15.2573 16.1372C15.0986 15.9717 14.8618 15.7487 14.5552 15.5257C13.9395 15.0779 13.0709 14.65 12 14.65C10.9291 14.65 10.0605 15.0779 9.44482 15.5257C9.13821 15.7487 8.90137 15.9717 8.74274 16.1372C8.66369 16.2197 8.60484 16.2871 8.56723 16.3319C8.54844 16.3543 8.53502 16.371 8.52709 16.381L8.51946 16.3907C8.304 16.6776 7.89707 16.7353 7.61001 16.52C7.32282 16.3046 7.26462 15.8972 7.48001 15.61L8.00001 16C7.48001 15.61 7.47984 15.6102 7.48001 15.61L7.48151 15.608L7.48358 15.6053L7.48941 15.5977L7.50783 15.5741C7.5231 15.5548 7.54435 15.5285 7.57146 15.4962C7.62564 15.4316 7.70351 15.3428 7.80415 15.2378C8.00489 15.0283 8.2993 14.7513 8.68019 14.4743Z", fill: "currentColor" }) });
Error24.displayName = "Error24";
const Memo$F = reactExports.memo(Error24);
const CornerUpLeft24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.45963 3.54039C9.71347 3.79423 9.71347 4.20578 9.45963 4.45963L5.56925 8.35001H16C17.2333 8.35001 18.416 8.83992 19.2881 9.71196C20.1601 10.584 20.65 11.7667 20.65 13V20C20.65 20.359 20.359 20.65 20 20.65C19.641 20.65 19.35 20.359 19.35 20V13C19.35 12.1115 18.9971 11.2594 18.3688 10.6312C17.7406 10.003 16.8885 9.65001 16 9.65001H5.56925L9.45963 13.5404C9.71347 13.7942 9.71347 14.2058 9.45963 14.4596C9.20578 14.7135 8.79423 14.7135 8.54039 14.4596L3.54039 9.45963C3.28655 9.20578 3.28655 8.79423 3.54039 8.54039L8.54039 3.54039C8.79423 3.28655 9.20578 3.28655 9.45963 3.54039Z", fill: "currentColor" }) });
CornerUpLeft24.displayName = "CornerUpLeft24";
const Memo$E = reactExports.memo(CornerUpLeft24);
const Merge24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.00001 5.65001C5.493 5.65001 2.65001 8.493 2.65001 12C2.65001 15.507 5.493 18.35 9.00001 18.35C12.507 18.35 15.35 15.507 15.35 12C15.35 8.493 12.507 5.65001 9.00001 5.65001ZM1.35001 12C1.35001 7.77503 4.77503 4.35001 9.00001 4.35001C13.225 4.35001 16.65 7.77503 16.65 12C16.65 16.225 13.225 19.65 9.00001 19.65C4.77503 19.65 1.35001 16.225 1.35001 12Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15 5.65001C11.493 5.65001 8.65001 8.493 8.65001 12C8.65001 15.507 11.493 18.35 15 18.35C18.507 18.35 21.35 15.507 21.35 12C21.35 8.493 18.507 5.65001 15 5.65001ZM7.35001 12C7.35001 7.77503 10.775 4.35001 15 4.35001C19.225 4.35001 22.65 7.77503 22.65 12C22.65 16.225 19.225 19.65 15 19.65C10.775 19.65 7.35001 16.225 7.35001 12Z", fill: "currentColor" })] });
Merge24.displayName = "Merge24";
const Memo$D = reactExports.memo(Merge24);
const SetArea24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 4.65001C5.64196 4.65001 5.29858 4.79224 5.0454 5.04541C4.79223 5.29859 4.65 5.64196 4.65 6.00001V9.00001C4.65 9.35899 4.35898 9.65001 4 9.65001C3.64101 9.65001 3.35 9.35899 3.35 9.00001V6.00001C3.35 5.29718 3.62919 4.62314 4.12617 4.12617C4.62314 3.6292 5.29717 3.35001 6 3.35001H9C9.35898 3.35001 9.65 3.64102 9.65 4.00001C9.65 4.35899 9.35898 4.65001 9 4.65001H6ZM14.35 4.00001C14.35 3.64102 14.641 3.35001 15 3.35001H18C18.7028 3.35001 19.3769 3.6292 19.8738 4.12617C20.3708 4.62314 20.65 5.29718 20.65 6.00001V9.00001C20.65 9.35899 20.359 9.65001 20 9.65001C19.641 9.65001 19.35 9.35899 19.35 9.00001V6.00001C19.35 5.64196 19.2078 5.29859 18.9546 5.04541C18.7014 4.79224 18.358 4.65001 18 4.65001H15C14.641 4.65001 14.35 4.35899 14.35 4.00001ZM4 14.35C4.35898 14.35 4.65 14.641 4.65 15V18C4.65 18.358 4.79223 18.7014 5.0454 18.9546C5.29858 19.2078 5.64196 19.35 6 19.35H9C9.35898 19.35 9.65 19.641 9.65 20C9.65 20.359 9.35898 20.65 9 20.65H6C5.29717 20.65 4.62314 20.3708 4.12617 19.8738C3.62919 19.3769 3.35 18.7028 3.35 18V15C3.35 14.641 3.64101 14.35 4 14.35ZM20 14.35C20.359 14.35 20.65 14.641 20.65 15V18C20.65 18.7028 20.3708 19.3769 19.8738 19.8738C19.3769 20.3708 18.7028 20.65 18 20.65H15C14.641 20.65 14.35 20.359 14.35 20C14.35 19.641 14.641 19.35 15 19.35H18C18.358 19.35 18.7014 19.2078 18.9546 18.9546C19.2078 18.7014 19.35 18.358 19.35 18V15C19.35 14.641 19.641 14.35 20 14.35Z", fill: "currentColor" }) });
SetArea24.displayName = "SetArea24";
const Memo$C = reactExports.memo(SetArea24);
const Analytics24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.01396 12.6935C2.01396 7.63456 6.10498 3.54355 11.164 3.54355C11.5229 3.54355 11.814 3.83456 11.814 4.19355V12.0435H19.664C20.0229 12.0435 20.314 12.3346 20.314 12.6935C20.314 17.7525 16.2229 21.8435 11.164 21.8435C6.10498 21.8435 2.01396 17.7525 2.01396 12.6935ZM10.514 4.86997C6.47799 5.19954 3.31396 8.57143 3.31396 12.6935C3.31396 17.0346 6.82295 20.5435 11.164 20.5435C15.2861 20.5435 18.658 17.3795 18.9875 13.3435H11.164C10.805 13.3435 10.514 13.0525 10.514 12.6935V4.86997Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13.6675 2.14377C13.6675 1.78479 13.9585 1.49377 14.3175 1.49377C18.802 1.49377 22.4285 5.12028 22.4285 9.60473C22.4285 9.96371 22.1375 10.2547 21.7785 10.2547H14.3175C13.9585 10.2547 13.6675 9.96371 13.6675 9.60473V2.14377ZM14.9675 2.82427V8.95473H21.098C20.7917 5.70801 18.2142 3.13051 14.9675 2.82427Z", fill: "currentColor" })] });
Analytics24.displayName = "Analytics24";
const Memo$B = reactExports.memo(Analytics24);
const Layers16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.88092 10.4538C1.9985 10.2039 2.29637 10.0967 2.54623 10.2143L8 12.7807L13.4538 10.2143C13.7036 10.0967 14.0015 10.2039 14.1191 10.4538C14.2367 10.7036 14.1294 11.0015 13.8796 11.1191L8.2129 13.7857C8.07806 13.8492 7.92194 13.8492 7.7871 13.7857L2.12043 11.1191C1.87057 11.0015 1.76334 10.7036 1.88092 10.4538Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.88092 7.78711C1.9985 7.53725 2.29637 7.43002 2.54623 7.5476L8 10.1141L13.4538 7.5476C13.7036 7.43002 14.0015 7.53725 14.1191 7.78711C14.2367 8.03696 14.1294 8.33483 13.8796 8.45241L8.2129 11.1191C8.07806 11.1825 7.92194 11.1825 7.7871 11.1191L2.12043 8.45241C1.87057 8.33483 1.76334 8.03696 1.88092 7.78711Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.7871 2.21426C7.92194 2.15081 8.07806 2.15081 8.2129 2.21426L13.8796 4.88093C14.0548 4.9634 14.1667 5.13966 14.1667 5.33334C14.1667 5.52702 14.0548 5.70328 13.8796 5.78575L8.2129 8.45241C8.07806 8.51587 7.92194 8.51587 7.7871 8.45241L2.12043 5.78575C1.94519 5.70328 1.83333 5.52702 1.83333 5.33334C1.83333 5.13966 1.94519 4.9634 2.12043 4.88093L7.7871 2.21426ZM3.5076 5.33334L8 7.44741L12.4924 5.33334L8 3.21927L3.5076 5.33334Z", fill: "currentColor" })] });
Layers16.displayName = "Layers16";
const Memo$A = reactExports.memo(Layers16);
const Disasters16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.56616 0.972793C6.71741 0.827471 6.94328 0.791997 7.1318 0.883959C7.60411 1.11437 8.31348 1.55385 8.94527 2.14197C9.56908 2.72267 10.1767 3.50365 10.3339 4.42375C10.4827 5.29468 10.3258 6.12532 10.0836 6.79665C10.0502 6.88931 10.0149 6.97953 9.97831 7.06703C10.3015 6.89096 10.5707 6.68084 10.7298 6.44808C11.2109 5.74396 11.2934 5.22701 11.2934 5.14286C11.2934 4.9487 11.4058 4.77209 11.5817 4.68989C11.7576 4.60768 11.9652 4.63475 12.1141 4.75931C12.9815 5.48468 14.4288 7.58545 13.5728 10.3692C13.0806 11.9699 12.362 13.0462 11.6341 13.7823C10.9075 14.5171 10.1895 14.8943 9.73488 15.1161C9.59653 15.1835 9.4348 15.1835 9.29645 15.1161L9.2878 15.1118C8.96444 14.9541 8.44632 14.7014 7.96545 14.3602C7.49071 14.0233 6.97889 13.5501 6.76482 12.9236C6.67852 12.671 6.61337 12.4384 6.56418 12.2261C6.48252 12.4182 6.43642 12.6012 6.43642 12.7619C6.43642 13.4413 6.63297 13.9772 6.70678 14.1212C6.81012 14.3228 6.76494 14.5688 6.59667 14.7205C6.42841 14.8723 6.17913 14.8919 5.98919 14.7684C5.46601 14.4281 4.69453 13.8089 4.04782 13.0349C3.40992 12.2715 2.83333 11.2854 2.83333 10.2222C2.83333 8.98605 3.20484 8.16538 3.79394 7.41378C4.07725 7.05233 4.41122 6.70627 4.75876 6.34754C4.76959 6.33636 4.78043 6.32517 4.7913 6.31395C5.13408 5.96019 5.49876 5.58382 5.88161 5.13559C7.01495 3.80872 6.73432 2.17077 6.4548 1.53443C6.37044 1.34239 6.41491 1.11812 6.56616 0.972793ZM7.67935 2.3909C7.77725 3.37944 7.60257 4.66045 6.642 5.78506C6.23839 6.25759 5.85464 6.65362 5.5144 7.00473C5.50187 7.01767 5.48939 7.03054 5.47698 7.04335C5.12291 7.40883 4.82644 7.71752 4.581 8.03067C4.11259 8.62828 3.83333 9.23619 3.83333 10.2222C3.83333 10.9368 4.2329 11.6968 4.8152 12.3937C5.01606 12.6341 5.23155 12.8584 5.44624 13.0611C5.43989 12.9639 5.43642 12.864 5.43642 12.7619C5.43642 12.2502 5.65001 11.761 5.87296 11.3869C6.10041 11.0052 6.3723 10.6857 6.56341 10.4993C6.70736 10.3588 6.92144 10.3183 7.10676 10.3964C7.29209 10.4745 7.41258 10.656 7.41258 10.8571V10.8625C7.41257 11.1545 7.41254 11.7264 7.71111 12.6003C7.82242 12.9261 8.12407 13.2466 8.54414 13.5446C8.86781 13.7743 9.2186 13.9611 9.51341 14.1083C9.90665 13.9037 10.4117 13.5963 10.9231 13.0792C11.5332 12.4622 12.1703 11.5279 12.617 10.0753C13.1441 8.36108 12.6089 6.97413 12.033 6.15482C11.9198 6.41642 11.7642 6.70676 11.5554 7.01225C11.2229 7.49883 10.6976 7.8372 10.2278 8.0621C9.74995 8.29086 9.2699 8.43041 8.96065 8.49075C8.75373 8.53113 8.54371 8.43737 8.43562 8.25637C8.32752 8.07536 8.34458 7.846 8.47825 7.68297C8.6588 7.46279 8.93975 7.02065 9.14295 6.45733C9.34548 5.89586 9.45972 5.24501 9.34819 4.59214C9.24506 3.98843 8.82233 3.39375 8.2639 2.87392C8.07374 2.6969 7.87472 2.53498 7.67935 2.3909Z", fill: "currentColor" }) });
Disasters16.displayName = "Disasters16";
const Memo$z = reactExports.memo(Disasters16);
const AdvancedAnalytics16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.20874 1.89331C2.53172 1.57033 2.96977 1.38889 3.42653 1.38889H10.129C10.2617 1.38889 10.3888 1.44156 10.4826 1.53533L14.1493 5.202C14.243 5.29577 14.2957 5.42294 14.2957 5.55555V12.8889C14.2957 13.3456 14.1143 13.7837 13.7913 14.1067C13.4683 14.4297 13.0303 14.6111 12.5735 14.6111H3.42653C2.96977 14.6111 2.53172 14.4297 2.20874 14.1067C1.88576 13.7837 1.70431 13.3456 1.70431 12.8889V3.11111C1.70431 2.65435 1.88576 2.21629 2.20874 1.89331ZM3.42653 2.38889C3.23499 2.38889 3.05129 2.46498 2.91585 2.60042C2.7804 2.73586 2.70431 2.91956 2.70431 3.11111V12.8889C2.70431 13.0804 2.7804 13.2641 2.91585 13.3996C3.05129 13.535 3.23499 13.6111 3.42653 13.6111H12.5735C12.765 13.6111 12.9487 13.535 13.0842 13.3996C13.2196 13.2641 13.2957 13.0804 13.2957 12.8889V5.76266L9.92194 2.38889H3.42653Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.51913 9.22222C3.51913 8.94608 3.74299 8.72222 4.01913 8.72222H5.24135C5.51749 8.72222 5.74135 8.94608 5.74135 9.22222C5.74135 9.49836 5.51749 9.72222 5.24135 9.72222H4.01913C3.74299 9.72222 3.51913 9.49836 3.51913 9.22222Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.78684 9.22222C6.78684 8.94608 7.0107 8.72222 7.28684 8.72222H8.50906C8.78521 8.72222 9.00906 8.94608 9.00906 9.22222C9.00906 9.49836 8.78521 9.72222 8.50906 9.72222H7.28684C7.0107 9.72222 6.78684 9.49836 6.78684 9.22222Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.0546 9.22222C10.0546 8.94608 10.2785 8.72222 10.5546 8.72222H11.7769C12.053 8.72222 12.2769 8.94608 12.2769 9.22222C12.2769 9.49836 12.053 9.72222 11.7769 9.72222H10.5546C10.2785 9.72222 10.0546 9.49836 10.0546 9.22222Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.51913 11.6667C3.51913 11.3905 3.74299 11.1667 4.01913 11.1667H5.24135C5.51749 11.1667 5.74135 11.3905 5.74135 11.6667C5.74135 11.9428 5.51749 12.1667 5.24135 12.1667H4.01913C3.74299 12.1667 3.51913 11.9428 3.51913 11.6667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.78684 11.6667C6.78684 11.3905 7.0107 11.1667 7.28684 11.1667H8.50906C8.78521 11.1667 9.00906 11.3905 9.00906 11.6667C9.00906 11.9428 8.78521 12.1667 8.50906 12.1667H7.28684C7.0107 12.1667 6.78684 11.9428 6.78684 11.6667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.0546 11.6667C10.0546 11.3905 10.2785 11.1667 10.5546 11.1667H11.7769C12.053 11.1667 12.2769 11.3905 12.2769 11.6667C12.2769 11.9428 12.053 12.1667 11.7769 12.1667H10.5546C10.2785 12.1667 10.0546 11.9428 10.0546 11.6667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.51913 6.77777C3.51913 6.50163 3.74299 6.27777 4.01913 6.27777H5.24135C5.51749 6.27777 5.74135 6.50163 5.74135 6.77777C5.74135 7.05392 5.51749 7.27777 5.24135 7.27777H4.01913C3.74299 7.27777 3.51913 7.05392 3.51913 6.77777Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.78684 6.77777C6.78684 6.50163 7.0107 6.27777 7.28684 6.27777H8.50906C8.7852 6.27777 9.00906 6.50163 9.00906 6.77777C9.00906 7.05392 8.7852 7.27777 8.50906 7.27777H7.28684C7.0107 7.27777 6.78684 7.05392 6.78684 6.77777Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.51913 4.33333C3.51913 4.05719 3.74299 3.83333 4.01913 3.83333H5.24135C5.51749 3.83333 5.74135 4.05719 5.74135 4.33333C5.74135 4.60947 5.51749 4.83333 5.24135 4.83333H4.01913C3.74299 4.83333 3.51913 4.60947 3.51913 4.33333Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.78684 4.33333C6.78684 4.05719 7.0107 3.83333 7.28684 3.83333H8.50906C8.7852 3.83333 9.00906 4.05719 9.00906 4.33333C9.00906 4.60947 8.7852 4.83333 8.50906 4.83333H7.28684C7.0107 4.83333 6.78684 4.60947 6.78684 4.33333Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.129 1.38889C10.4052 1.38889 10.629 1.61274 10.629 1.88889V5.05555H13.7957C14.0719 5.05555 14.2957 5.27941 14.2957 5.55555C14.2957 5.8317 14.0719 6.05555 13.7957 6.05555H10.129C9.8529 6.05555 9.62904 5.83169 9.62904 5.55555V1.88889C9.62904 1.61274 9.8529 1.38889 10.129 1.38889Z", fill: "currentColor" })] });
AdvancedAnalytics16.displayName = "AdvancedAnalytics16";
const Memo$y = reactExports.memo(AdvancedAnalytics16);
const Legend16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.94504 12.9339C6.94504 12.6578 7.1689 12.4339 7.44504 12.4339H14.2524C14.5285 12.4339 14.7524 12.6578 14.7524 12.9339C14.7524 13.21 14.5285 13.4339 14.2524 13.4339H7.44504C7.1689 13.4339 6.94504 13.21 6.94504 12.9339Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.94502 7.95443C6.94502 7.67829 7.16888 7.45443 7.44502 7.45443H14.2524C14.5285 7.45443 14.7524 7.67829 14.7524 7.95443C14.7524 8.23058 14.5285 8.45443 14.2524 8.45443H7.44502C7.16888 8.45443 6.94502 8.23058 6.94502 7.95443Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.94504 3.06086C6.94504 2.78472 7.1689 2.56086 7.44504 2.56086H14.2524C14.5285 2.56086 14.7524 2.78472 14.7524 3.06086C14.7524 3.337 14.5285 3.56086 14.2524 3.56086H7.44504C7.1689 3.56086 6.94504 3.337 6.94504 3.06086Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.65379 11.2159C3.8142 11.2159 3.96486 11.2929 4.05889 11.4228L5.65913 13.6348C5.76923 13.787 5.78475 13.988 5.6993 14.1553C5.61386 14.3226 5.44187 14.4278 5.25403 14.4278H2.0534C1.86556 14.4278 1.69357 14.3226 1.60813 14.1553C1.52268 13.988 1.5382 13.7869 1.64831 13.6348L3.24869 11.4228C3.34272 11.2928 3.49339 11.2159 3.65379 11.2159ZM3.03231 13.4278H4.27518L3.65377 12.5689L3.03231 13.4278Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.45343 4.69237C2.17728 4.69237 1.95343 4.46851 1.95343 4.19237L1.95343 1.92918C1.95343 1.65304 2.17728 1.42918 2.45343 1.42918L4.71661 1.42918C4.99275 1.42918 5.21661 1.65304 5.21661 1.92918L5.21661 4.19237C5.21661 4.46851 4.99275 4.69237 4.71661 4.69237H2.45343ZM2.95343 3.69237H4.21661L4.21661 2.42918L2.95343 2.42918V3.69237Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.65368 7.2539C3.26693 7.2539 2.95342 7.56742 2.95342 7.95416C2.95342 8.34091 3.26693 8.65443 3.65368 8.65443C4.04042 8.65443 4.35394 8.34091 4.35394 7.95416C4.35394 7.56742 4.04042 7.2539 3.65368 7.2539ZM1.95342 7.95416C1.95342 7.01513 2.71465 6.2539 3.65368 6.2539C4.59271 6.2539 5.35394 7.01513 5.35394 7.95416C5.35394 8.89319 4.59271 9.65443 3.65368 9.65443C2.71465 9.65443 1.95342 8.89319 1.95342 7.95416Z", fill: "currentColor" })] });
Legend16.displayName = "Legend16";
const Memo$x = reactExports.memo(Legend16);
const BivariateMatrix16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.33531 8.35355C9.14005 8.15829 9.14005 7.84171 9.33531 7.64645L11.8684 5.11334C12.0637 4.91808 12.3803 4.91808 12.5755 5.11334L15.1086 7.64645C15.3039 7.84171 15.3039 8.15829 15.1086 8.35355L12.5755 10.8867C12.3803 11.0819 12.0637 11.0819 11.8684 10.8867L9.33531 8.35355ZM10.396 8L12.222 9.826L14.048 8L12.222 6.174L10.396 8Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.11334 12.5754C4.91808 12.3801 4.91808 12.0635 5.11334 11.8683L7.64645 9.33517C7.84171 9.1399 8.15829 9.1399 8.35355 9.33517L10.8867 11.8683C11.0819 12.0635 11.0819 12.3801 10.8867 12.5754L8.35355 15.1085C8.15829 15.3037 7.84171 15.3037 7.64645 15.1085L5.11334 12.5754ZM6.174 12.2218L8 14.0478L9.826 12.2218L8 10.3958L6.174 12.2218Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.11334 4.13173C4.91808 3.93647 4.91808 3.61988 5.11334 3.42462L7.64645 0.891518C7.84171 0.696256 8.15829 0.696256 8.35355 0.891518L10.8867 3.42462C11.0819 3.61988 11.0819 3.93647 10.8867 4.13173L8.35355 6.66483C8.15829 6.86009 7.84171 6.86009 7.64645 6.66483L5.11334 4.13173ZM6.174 3.77817L8 5.60417L9.826 3.77817L8 1.95218L6.174 3.77817Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0.891663 8.35355C0.696401 8.15829 0.696401 7.84171 0.891663 7.64645L3.42477 5.11334C3.62003 4.91808 3.93661 4.91808 4.13187 5.11334L6.66498 7.64645C6.86024 7.84171 6.86024 8.15829 6.66498 8.35355L4.13187 10.8867C3.93661 11.0819 3.62003 11.0819 3.42477 10.8867L0.891663 8.35355ZM1.95232 8L3.77832 9.826L5.60432 8L3.77832 6.174L1.95232 8Z", fill: "currentColor" })] });
BivariateMatrix16.displayName = "BivariateMatrix16";
const Memo$w = reactExports.memo(BivariateMatrix16);
const Analytics16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.27597 8.46237C1.27597 5.05289 4.03316 2.2957 7.44264 2.2957C7.71878 2.2957 7.94264 2.51956 7.94264 2.7957V7.96237H13.1093C13.3854 7.96237 13.6093 8.18622 13.6093 8.46237C13.6093 11.8718 10.8521 14.629 7.44264 14.629C4.03316 14.629 1.27597 11.8718 1.27597 8.46237ZM6.94264 3.31949C4.32078 3.57032 2.27597 5.77387 2.27597 8.46237C2.27597 11.3196 4.58545 13.629 7.44264 13.629C10.1311 13.629 12.3347 11.5842 12.5855 8.96237H7.44264C7.16649 8.96237 6.94264 8.73851 6.94264 8.46237V3.31949Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.045 1.42918C9.045 1.15304 9.26886 0.929184 9.545 0.929184C12.5715 0.929184 15.019 3.3767 15.019 6.40315C15.019 6.6793 14.7951 6.90315 14.519 6.90315H9.545C9.26886 6.90315 9.045 6.6793 9.045 6.40315V1.42918ZM10.045 1.9567V5.90315H13.9915C13.7617 3.82918 12.119 2.18648 10.045 1.9567Z", fill: "currentColor" })] });
Analytics16.displayName = "Analytics16";
const Memo$v = reactExports.memo(Analytics16);
const DoubleChevronUp24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.5 5.85C11.6724 5.85 11.8377 5.91848 11.9596 6.04038L16.9596 11.0404C17.2135 11.2942 17.2135 11.7058 16.9596 11.9596C16.7058 12.2135 16.2942 12.2135 16.0404 11.9596L11.5 7.41924L6.95962 11.9596C6.70578 12.2135 6.29422 12.2135 6.04038 11.9596C5.78654 11.7058 5.78654 11.2942 6.04038 11.0404L11.0404 6.04038C11.1623 5.91848 11.3276 5.85 11.5 5.85ZM6.04038 17.0404L11.0404 12.0404C11.2942 11.7865 11.7058 11.7865 11.9596 12.0404L16.9596 17.0404C17.2135 17.2942 17.2135 17.7058 16.9596 17.9596C16.7058 18.2135 16.2942 18.2135 16.0404 17.9596L11.5 13.4192L6.95962 17.9596C6.70578 18.2135 6.29422 18.2135 6.04038 17.9596C5.78654 17.7058 5.78654 17.2942 6.04038 17.0404Z", fill: "currentColor" }) });
DoubleChevronUp24.displayName = "DoubleChevronUp24";
const Memo$u = reactExports.memo(DoubleChevronUp24);
const DoubleChevronDown24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.04038 6.04038C6.29422 5.78654 6.70578 5.78654 6.95962 6.04038L11.5 10.5808L16.0404 6.04038C16.2942 5.78654 16.7058 5.78654 16.9596 6.04038C17.2135 6.29422 17.2135 6.70578 16.9596 6.95962L11.9596 11.9596C11.8377 12.0815 11.6724 12.15 11.5 12.15C11.3276 12.15 11.1623 12.0815 11.0404 11.9596L6.04038 6.95962C5.78654 6.70578 5.78654 6.29422 6.04038 6.04038ZM6.04038 12.0404C6.29422 11.7865 6.70578 11.7865 6.95962 12.0404L11.5 16.5808L16.0404 12.0404C16.2942 11.7865 16.7058 11.7865 16.9596 12.0404C17.2135 12.2942 17.2135 12.7058 16.9596 12.9596L11.9596 17.9596C11.7058 18.2135 11.2942 18.2135 11.0404 17.9596L6.04038 12.9596C5.78654 12.7058 5.78654 12.2942 6.04038 12.0404Z", fill: "currentColor" }) });
DoubleChevronDown24.displayName = "DoubleChevronDown24";
const Memo$t = reactExports.memo(DoubleChevronDown24);
const History24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.7412 7.86976H7.09091C7.4499 7.86976 7.74091 8.16077 7.74091 8.51976C7.74091 8.87874 7.4499 9.16976 7.09091 9.16976H3C2.64102 9.16976 2.35 8.87874 2.35 8.51976V4.63636C2.35 4.27738 2.64102 3.98636 3 3.98636C3.35899 3.98636 3.65 4.27738 3.65 4.63636V7.15975C5.32022 4.28456 8.43359 2.35 12 2.35C17.3295 2.35 21.65 6.67045 21.65 12C21.65 17.3295 17.3295 21.65 12 21.65C8.249 21.65 4.99901 19.5097 3.40257 16.3868C3.23918 16.0671 3.36583 15.6755 3.68548 15.5121C4.00512 15.3487 4.3967 15.4754 4.5601 15.795C5.94301 18.5003 8.75605 20.35 12 20.35C16.6116 20.35 20.35 16.6116 20.35 12C20.35 7.38842 16.6116 3.65 12 3.65C8.89174 3.65 6.17896 5.34846 4.7412 7.86976ZM12 7.25909C12.359 7.25909 12.65 7.5501 12.65 7.90909V11.7308L15.7324 14.8131C15.9862 15.0669 15.9862 15.4785 15.7324 15.7323C15.4785 15.9862 15.067 15.9862 14.8131 15.7323L11.5404 12.4596C11.4185 12.3377 11.35 12.1724 11.35 12V7.90909C11.35 7.5501 11.641 7.25909 12 7.25909Z", fill: "currentColor" }) });
History24.displayName = "History24";
const Memo$s = reactExports.memo(History24);
const Video24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 6.65C3.25441 6.65 2.65 7.25441 2.65 8V16C2.65 16.7456 3.25441 17.35 4 17.35H14C14.7456 17.35 15.35 16.7456 15.35 16V8C15.35 7.25441 14.7456 6.65 14 6.65H4ZM1.35 8C1.35 6.53644 2.53644 5.35 4 5.35H14C15.4636 5.35 16.65 6.53644 16.65 8V10.6122L21.5839 6.50065C21.7776 6.33919 22.0473 6.30439 22.2757 6.41137C22.5041 6.51834 22.65 6.74779 22.65 7V17C22.65 17.2522 22.5041 17.4817 22.2757 17.5886C22.0473 17.6956 21.7776 17.6608 21.5839 17.4993L16.65 13.3878V16C16.65 17.4636 15.4636 18.65 14 18.65H4C2.53644 18.65 1.35 17.4636 1.35 16V8ZM17.0153 12L21.35 15.6122V8.38778L17.0153 12Z", fill: "currentColor" }) });
Video24.displayName = "Video24";
const Memo$r = reactExports.memo(Video24);
const TimelinePoint24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M18 9C18 13.1682 14.3081 18.181 12.7163 20.1486C12.3421 20.6111 11.6579 20.6111 11.2837 20.1486C9.69194 18.181 6 13.1682 6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9Z", fill: "currentColor" }) });
TimelinePoint24.displayName = "TimelinePoint24";
const Memo$q = reactExports.memo(TimelinePoint24);
const TimelinePoints24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.7163 20.1486C14.3081 18.181 18 13.1682 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 13.1682 9.69194 18.181 11.2837 20.1486C11.6579 20.6111 12.3421 20.6111 12.7163 20.1486ZM8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9ZM11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9ZM15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8Z", fill: "currentColor" }) });
TimelinePoints24.displayName = "TimelinePoints24";
const Memo$p = reactExports.memo(TimelinePoints24);
const Ninja24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M23 12C23 18.0723 18.078 23 12 23C5.92202 23 1 18.0723 1 12C1 5.92771 5.92202 1 12 1C18.078 1 23 5.92771 23 12ZM12 22C17.5254 22 22 17.5203 22 12C22 6.47967 17.5254 2 12 2C6.47463 2 2 6.47967 2 12C2 17.5203 6.47463 22 12 22Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.0455 8.03394C8.07302 8.03394 4.69296 9.6045 3.43677 11.7975C4.69296 13.9904 8.07302 15.561 12.0455 15.561C16.0181 15.561 19.3981 13.9904 20.6543 11.7975C19.3981 9.6045 16.0181 8.03394 12.0455 8.03394ZM17.3348 10.6499L12.8579 12.9116C13.3369 13.417 14.0416 13.7363 14.8272 13.7363C16.2705 13.7363 17.4404 12.6588 17.4404 11.3296C17.4404 11.0935 17.4035 10.8654 17.3348 10.6499ZM6.5893 10.6499L11.0662 12.9116C10.5871 13.417 9.88248 13.7363 9.09684 13.7363C7.65361 13.7363 6.48364 12.6588 6.48364 11.3296C6.48364 11.0935 6.52054 10.8654 6.5893 10.6499Z", fill: "currentColor" })] });
Ninja24.displayName = "Ninja24";
const Memo$o = reactExports.memo(Ninja24);
const Kontur24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M14.2361 7.31354L10.5888 11.3033C10.5626 11.3325 10.5282 11.353 10.4901 11.362C10.452 11.3711 10.4121 11.3682 10.3757 11.3539C10.3392 11.3395 10.308 11.3144 10.2861 11.2818C10.2643 11.2491 10.2528 11.2106 10.2533 11.1713V7.55703C10.2533 7.41309 10.1964 7.27505 10.0952 7.17327C9.99393 7.07149 9.85663 7.01431 9.71347 7.01431H8.87605C8.73288 7.01431 8.59558 7.07149 8.49435 7.17327C8.39312 7.27505 8.33625 7.41309 8.33625 7.55703V16.4665C8.33508 16.5383 8.3482 16.6097 8.37485 16.6764C8.40149 16.7431 8.44111 16.8038 8.49139 16.8549C8.54167 16.906 8.6016 16.9465 8.66765 16.974C8.7337 17.0015 8.80456 17.0154 8.87605 17.015H9.71055C9.7813 17.0154 9.85143 17.0017 9.9169 16.9748C9.98237 16.9478 10.0419 16.9081 10.0921 16.858C10.1422 16.8078 10.182 16.7482 10.2092 16.6825C10.2364 16.6168 10.2503 16.5464 10.2503 16.4753V14.5127C10.2747 14.3738 10.3263 14.2412 10.4021 14.1225C10.5056 14.0095 10.6316 13.9197 10.7718 13.8589C10.9121 13.7981 11.0636 13.7677 11.2163 13.7697C11.3691 13.7716 11.5197 13.8058 11.6584 13.8702C11.7971 13.9345 11.9208 14.0275 12.0215 14.143L14.2332 16.6865C14.3204 16.7884 14.4282 16.8704 14.5495 16.9271C14.6708 16.9838 14.8027 17.0137 14.9364 17.015H16.0481C16.1223 17.0187 16.1958 17 16.2594 16.9614C16.323 16.9228 16.3737 16.866 16.405 16.7983C16.4363 16.7306 16.4468 16.6551 16.4352 16.5813C16.4236 16.5076 16.3904 16.439 16.3399 16.3843L12.5467 12.2215C12.4941 12.1668 12.4647 12.0937 12.4647 12.0176C12.4647 11.9415 12.4941 11.8684 12.5467 11.8137L16.3399 7.64797C16.3904 7.59329 16.4236 7.52469 16.4352 7.45094C16.4468 7.37719 16.4363 7.30164 16.405 7.23394C16.3737 7.16624 16.323 7.10946 16.2594 7.07086C16.1958 7.03226 16.1223 7.0136 16.0481 7.01724H14.9218C14.7934 7.01639 14.6661 7.04228 14.5481 7.09327C14.4301 7.14426 14.3239 7.21926 14.2361 7.31354Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M1.58147 16.6073V1.73964C1.58147 1.69996 1.59714 1.6619 1.62505 1.63385C1.65296 1.60579 1.69081 1.59003 1.73027 1.59003H16.2115C16.2605 1.59003 16.3091 1.58031 16.3544 1.56144C16.3997 1.54257 16.4409 1.51491 16.4756 1.48004C16.5103 1.44517 16.5378 1.40378 16.5565 1.35822C16.5753 1.31266 16.585 1.26383 16.585 1.21452V0.375504C16.585 0.275914 16.5456 0.180403 16.4756 0.109983C16.4055 0.0395619 16.3105 0 16.2115 0H0.373483C0.274429 0 0.179432 0.0395619 0.109391 0.109983C0.0393489 0.180403 0 0.275914 0 0.375504V16.6073C0 16.7068 0.0393489 16.8024 0.109391 16.8728C0.179432 16.9432 0.274429 16.9828 0.373483 16.9828H1.20798C1.3068 16.982 1.40135 16.9422 1.47123 16.8719C1.54111 16.8017 1.5807 16.7066 1.58147 16.6073Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M22.4214 7.39274V22.2604C22.4214 22.3 22.4058 22.3381 22.3779 22.3662C22.3499 22.3942 22.3121 22.41 22.2726 22.41H7.70973C7.61068 22.41 7.51568 22.4495 7.44564 22.52C7.3756 22.5904 7.33625 22.6859 7.33625 22.7855V23.6245C7.33625 23.7241 7.3756 23.8196 7.44564 23.89C7.51568 23.9604 7.61068 24 7.70973 24H23.6265C23.7256 24 23.8206 23.9604 23.8906 23.89C23.9606 23.8196 24 23.7241 24 23.6245V7.39274C24 7.29315 23.9606 7.19764 23.8906 7.12722C23.8206 7.0568 23.7256 7.01724 23.6265 7.01724H22.7949C22.6959 7.01724 22.6009 7.0568 22.5308 7.12722C22.4608 7.19764 22.4214 7.29315 22.4214 7.39274Z", fill: "currentColor" })] });
Kontur24.displayName = "Kontur24";
const Memo$n = reactExports.memo(Kontur24);
const Minus16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { d: "M13 8C13 7.72386 12.7761 7.5 12.5 7.5L3.49999 7.5C3.22385 7.5 2.99999 7.72386 2.99999 8C2.99999 8.27615 3.22385 8.5 3.49999 8.5H12.5C12.7761 8.5 13 8.27614 13 8Z", fill: "currentColor" }) });
Minus16.displayName = "Minus16";
const Memo$m = reactExports.memo(Minus16);
const ZoomTo16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.50007 1.00005C1.22392 1.00005 1.00005 1.22392 1.00005 1.50007V5.00025C1.00005 5.2764 1.22392 5.50027 1.50007 5.50027C1.77623 5.50027 2.0001 5.2764 2.0001 5.00025V2.20011C2.0001 2.08965 2.08965 2.0001 2.20011 2.0001H5.00025C5.2764 2.0001 5.50027 1.77623 5.50027 1.50007C5.50027 1.22392 5.2764 1.00005 5.00025 1.00005H1.50007ZM11.0005 1.00005C10.7244 1.00005 10.5005 1.22392 10.5005 1.50007C10.5005 1.77623 10.7244 2.0001 11.0005 2.0001H13.8007C13.9111 2.0001 14.0007 2.08965 14.0007 2.20011V5.00025C14.0007 5.2764 14.2246 5.50027 14.5007 5.50027C14.7769 5.50027 15.0007 5.2764 15.0007 5.00025V1.50007C15.0007 1.22392 14.7769 1.00005 14.5007 1.00005H11.0005ZM15.0007 11.0005C15.0007 10.7244 14.7769 10.5005 14.5007 10.5005C14.2246 10.5005 14.0007 10.7244 14.0007 11.0005V13.8007C14.0007 13.9111 13.9111 14.0007 13.8007 14.0007H11.0005C10.7244 14.0007 10.5005 14.2246 10.5005 14.5007C10.5005 14.7769 10.7244 15.0007 11.0005 15.0007H14.5007C14.7769 15.0007 15.0007 14.7769 15.0007 14.5007V11.0005ZM5.00025 15.0007C5.2764 15.0007 5.50027 14.7769 5.50027 14.5007C5.50027 14.2246 5.2764 14.0007 5.00025 14.0007H2.20011C2.08965 14.0007 2.0001 13.9111 2.0001 13.8007V11.0005C2.0001 10.7244 1.77623 10.5005 1.50007 10.5005C1.22392 10.5005 1.00005 10.7244 1.00005 11.0005V14.5007C1.00005 14.7769 1.22392 15.0007 1.50007 15.0007H5.00025Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.0004 12.0006C10.2096 12.0006 12.0006 10.2096 12.0006 8.0004C12.0006 5.79115 10.2096 4.0002 8.0004 4.0002C5.79115 4.0002 4.0002 5.79115 4.0002 8.0004C4.0002 10.2096 5.79115 12.0006 8.0004 12.0006ZM8.0004 13.0006C10.762 13.0006 13.0006 10.762 13.0006 8.0004C13.0006 5.23884 10.762 3.00015 8.0004 3.00015C5.23884 3.00015 3.00015 5.23884 3.00015 8.0004C3.00015 10.762 5.23884 13.0006 8.0004 13.0006Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.0004 5.00025C8.27655 5.00025 8.50042 5.22412 8.50042 5.50027L8.50042 10.5005C8.50042 10.7767 8.27655 11.0005 8.0004 11.0005C7.72424 11.0005 7.50037 10.7767 7.50037 10.5005L7.50037 5.50027C7.50037 5.22412 7.72424 5.00025 8.0004 5.00025Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.0005 8.0004C11.0005 8.27655 10.7767 8.50042 10.5005 8.50042L5.50027 8.50042C5.22412 8.50042 5.00025 8.27655 5.00025 8.0004C5.00025 7.72424 5.22412 7.50037 5.50027 7.50037L10.5005 7.50037C10.7767 7.50037 11.0005 7.72424 11.0005 8.0004Z", fill: "currentColor" })] });
ZoomTo16.displayName = "ZoomTo16";
const Memo$l = reactExports.memo(ZoomTo16);
const North16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.0607 12.4582L4.03999 12.5027C3.99526 12.5929 3.99524 12.6588 4.00567 12.7082C4.01779 12.7657 4.05166 12.8313 4.11224 12.8889C4.23127 13.0022 4.39129 13.0381 4.5618 12.9507L6.90708 11.7493C7.59238 11.3983 8.40762 11.3983 9.09292 11.7493L11.4382 12.9507C11.6087 13.0381 11.7687 13.0022 11.8878 12.8889C11.9483 12.8313 11.9822 12.7657 11.9943 12.7082C12.0048 12.6588 12.0047 12.5929 11.96 12.5027L11.9393 12.4582L8.33279 4.18746C8.26693 4.06774 8.14877 4 8 4C7.85123 4 7.73307 4.06774 7.66721 4.18745L4.0607 12.4582ZM6.76335 3.75845C7.26472 2.74718 8.73528 2.74718 9.23665 3.75845L12.8559 12.0585C13.4352 13.227 12.1572 14.4426 10.9823 13.8407L8.637 12.6394C8.23796 12.435 7.76204 12.435 7.36299 12.6394L5.01772 13.8407C3.84276 14.4426 2.56475 13.227 3.14406 12.0585L6.76335 3.75845Z", fill: "currentColor" }) });
North16.displayName = "North16";
const Memo$k = reactExports.memo(North16);
const Ruler16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.09091 2.16666C5.22352 2.16666 5.35069 2.21933 5.44446 2.3131L13.6869 10.5555C13.8821 10.7508 13.8821 11.0674 13.6869 11.2626L11.2626 13.6869C11.0674 13.8821 10.7508 13.8821 10.5555 13.6869L2.31311 5.44445C2.21934 5.35068 2.16666 5.22351 2.16666 5.0909C2.16666 4.95829 2.21934 4.83111 2.31311 4.73735L4.73735 2.3131C4.83112 2.21933 4.9583 2.16666 5.09091 2.16666ZM3.37377 5.0909L4.4582 6.17532L5.37758 5.30379C5.57799 5.11381 5.89446 5.12226 6.08444 5.32267C6.27441 5.52308 6.26596 5.83955 6.06555 6.02953L5.16555 6.88268L6.59718 8.31431L7.52532 7.43448C7.72572 7.24451 8.04219 7.25296 8.23217 7.45337C8.42215 7.65378 8.41369 7.97024 8.21329 8.16022L7.30454 9.02167L8.79153 10.5087L9.71091 9.63712C9.91132 9.44714 10.2278 9.4556 10.4178 9.65601C10.6077 9.85641 10.5993 10.1729 10.3989 10.3629L9.49889 11.216L10.9091 12.6262L12.6262 10.9091L5.09091 3.37376L3.37377 5.0909Z", fill: "currentColor" }) });
Ruler16.displayName = "Ruler16";
const Memo$j = reactExports.memo(Ruler16);
const Line16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.0404 4.66666L4.66666 12.0404L3.95956 11.3333L11.3333 3.95955L12.0404 4.66666Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.66666 11.6667V12.3333H4.33333V11.6667H3.66666ZM3.16666 10.6667C2.89052 10.6667 2.66666 10.8905 2.66666 11.1667V12.8333C2.66666 13.1095 2.89052 13.3333 3.16666 13.3333H4.83333C5.10947 13.3333 5.33333 13.1095 5.33333 12.8333V11.1667C5.33333 10.8905 5.10947 10.6667 4.83333 10.6667H3.16666Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 3.66666V4.33332H12.3333V3.66666H11.6667ZM11.1667 2.66666C10.8905 2.66666 10.6667 2.89051 10.6667 3.16666V4.83332C10.6667 5.10947 10.8905 5.33332 11.1667 5.33332H12.8333C13.1095 5.33332 13.3333 5.10947 13.3333 4.83332V3.16666C13.3333 2.89051 13.1095 2.66666 12.8333 2.66666H11.1667Z", fill: "currentColor" })] });
Line16.displayName = "Line16";
const Memo$i = reactExports.memo(Line16);
const SelectArea16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.90258 0.921969C4.14172 0.783898 4.44752 0.865835 4.58559 1.10498L5.758 3.13565C5.89607 3.37479 5.81413 3.68059 5.57498 3.81866C5.33584 3.95673 5.03004 3.87479 4.89197 3.63565L3.71957 1.60498C3.58149 1.36584 3.66343 1.06004 3.90258 0.921969Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.54398 0.442576C7.81071 0.514047 7.969 0.788216 7.89753 1.05495L7.29065 3.31986C7.21918 3.58659 6.94501 3.74488 6.67828 3.67341C6.41154 3.60194 6.25325 3.32777 6.32472 3.06104L6.9316 0.79613C7.00308 0.529397 7.27724 0.371105 7.54398 0.442576Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.4578 2.67844C10.5959 2.91759 10.514 3.22339 10.2748 3.36146L8.24414 4.53386C8.005 4.67193 7.6992 4.58999 7.56113 4.35085C7.42306 4.1117 7.505 3.80591 7.74414 3.66784L9.77481 2.49543C10.014 2.35736 10.3197 2.4393 10.4578 2.67844Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.0427 5.80486C5.18077 6.044 5.09884 6.3498 4.85969 6.48787L2.82903 7.66027C2.58988 7.79834 2.28408 7.71641 2.14601 7.47726C2.00794 7.23811 2.08988 6.93232 2.32903 6.79425L4.35969 5.62184C4.59884 5.48377 4.90463 5.56571 5.0427 5.80486Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.89744 4.70154C4.82597 4.96827 4.5518 5.12656 4.28507 5.05509L2.02016 4.44821C1.75343 4.37674 1.59513 4.10257 1.66661 3.83584C1.73808 3.5691 2.01225 3.41081 2.27898 3.48228L4.54389 4.08917C4.81062 4.16064 4.96891 4.4348 4.89744 4.70154Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.44827 5.3054C6.62512 5.2033 6.84629 5.219 7.00694 5.34506L13.2126 10.2148C13.3702 10.3384 13.4388 10.5443 13.3868 10.7378C13.3349 10.9313 13.1724 11.0751 12.974 11.1032L10.0358 11.5193L8.2064 13.8558C8.08288 14.0135 7.87712 14.0823 7.68357 14.0306C7.49001 13.9788 7.34604 13.8165 7.31773 13.6182L6.20329 5.80905C6.17444 5.60689 6.27142 5.4075 6.44827 5.3054ZM8.14202 12.3159L9.37264 10.7442C9.45231 10.6424 9.56827 10.5755 9.69622 10.5574L11.6727 10.2775L7.36917 6.90045L8.14202 12.3159Z", fill: "currentColor" })] });
SelectArea16.displayName = "SelectArea16";
const Memo$h = reactExports.memo(SelectArea16);
const Poly16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.86877 1.07162C2.02855 0.975441 2.22858 0.976181 2.38765 1.07354L9.29715 5.30257L13.7684 4.34443C13.9337 4.30903 14.1056 4.35947 14.2255 4.47853C14.3454 4.59759 14.3971 4.76916 14.3628 4.93464L12.3628 14.6013C12.3342 14.7396 12.2485 14.8593 12.1268 14.9309C12.0051 15.0025 11.8588 15.0194 11.7241 14.9772L6.50822 13.3473L2.96265 13.9919C2.82212 14.0175 2.67737 13.9817 2.56492 13.8936C2.45246 13.8056 2.38305 13.6736 2.37418 13.531L1.62759 1.53105C1.61601 1.34491 1.70899 1.1678 1.86877 1.07162ZM2.68534 2.42819L3.33731 12.9074L6.45044 12.3414C6.52998 12.3269 6.61185 12.332 6.68902 12.3561L11.4954 13.8581L13.2282 5.48289L9.31131 6.32223C9.18589 6.34911 9.05493 6.32676 8.94552 6.25979L2.68534 2.42819Z", fill: "currentColor" }) });
Poly16.displayName = "Poly16";
const Memo$g = reactExports.memo(Poly16);
const EditInOsm16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.50427 5.91531L12.534 0.968197C13.0037 0.506179 13.7581 0.509301 14.224 0.975191L15.0232 1.77442C15.4946 2.24579 15.4914 3.01101 15.0161 3.47847L10.0166 8.39589L8.17342 9.13318C7.37865 9.45109 6.57562 8.69332 6.84702 7.88143L7.50427 5.91531ZM7.80203 8.2047C7.79808 8.20628 7.79408 8.20251 7.79543 8.19847L8.3766 6.45996L11.9056 2.98893L12.9876 4.07101L9.45868 7.54204L7.80203 8.2047ZM13.7006 3.36976L12.6185 2.28768L13.2352 1.68113C13.3135 1.60413 13.4392 1.60465 13.5169 1.6823L14.3161 2.48152C14.3946 2.56009 14.3941 2.68762 14.3149 2.76553L13.7006 3.36976Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.30091 3.40809C1.14736 3.35051 0.975333 3.37188 0.840546 3.46529C0.705759 3.5587 0.625343 3.71226 0.625343 3.87625V13.3763C0.625343 13.5847 0.75463 13.7712 0.949782 13.8444L4.94978 15.3444C5.06297 15.3869 5.18771 15.3869 5.30091 15.3444L9.12534 13.9103L12.9498 15.3444C13.1033 15.402 13.2754 15.3806 13.4101 15.2872C13.5449 15.1938 13.6253 15.0402 13.6253 14.8763V7.93955C13.6253 7.66341 13.4015 7.43955 13.1253 7.43955C12.8492 7.43955 12.6253 7.66341 12.6253 7.93955V14.1548L9.62534 13.0298V10.7921C9.62534 10.516 9.40149 10.2921 9.12534 10.2921C8.8492 10.2921 8.62534 10.516 8.62534 10.7921V13.0298L5.62534 14.1548V5.72346L6.342 5.45626C6.60075 5.35979 6.7323 5.07183 6.63583 4.81309C6.53936 4.55435 6.2514 4.4228 5.99266 4.51927L5.12585 4.84244L1.30091 3.40809ZM4.62534 5.72275V14.1548L1.62534 13.0298V4.59775L4.62534 5.72275Z", fill: "currentColor" })] });
EditInOsm16.displayName = "EditInOsm16";
const Memo$f = reactExports.memo(EditInOsm16);
const EditGeometry16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.00432 3.44917C1.13039 3.33724 1.30438 3.29638 1.46709 3.34048L5.77797 4.50893C6.04449 4.58117 6.20199 4.85579 6.12975 5.12232C6.05751 5.38885 5.78289 5.54634 5.51636 5.4741L1.94199 4.50528L3.26718 13.5165L10.2921 12.1656L11.3348 7.265C11.3923 6.9949 11.6578 6.82253 11.9279 6.88C12.198 6.93748 12.3704 7.20302 12.3129 7.47312L11.2011 12.698C11.1593 12.8946 11.0039 13.047 10.8065 13.085L2.94294 14.5972C2.80897 14.623 2.67029 14.5929 2.55906 14.5139C2.44782 14.4349 2.37368 14.3139 2.35384 14.179L0.841608 3.89582C0.81708 3.72902 0.878255 3.5611 1.00432 3.44917Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.61305 5.93421C6.66306 5.7846 6.74777 5.64894 6.86023 5.53832L11.7188 0.759487C12.1885 0.297469 12.9429 0.300592 13.4088 0.766481L14.208 1.56571C14.6794 2.03708 14.6763 2.8023 14.201 3.26976L9.34477 8.04627C9.25021 8.13928 9.13808 8.21255 9.01493 8.26181L7.35829 8.92447C6.56351 9.24238 5.76048 8.48461 6.03188 7.67272L6.61305 5.93421ZM6.98689 7.99599C6.98294 7.99757 6.97894 7.9938 6.9803 7.98976L7.56146 6.25125L12.42 1.47242C12.4983 1.39542 12.6241 1.39594 12.7017 1.47359L13.5009 2.27281C13.5795 2.35138 13.579 2.47891 13.4998 2.55682L8.64354 7.33333L6.98689 7.99599Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.3102 3.99999L10.9769 2.66665L11.684 1.95955L13.0173 3.29288L12.3102 3.99999Z", fill: "currentColor" })] });
EditGeometry16.displayName = "EditGeometry16";
const Memo$e = reactExports.memo(EditGeometry16);
const Tools24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.13847 20.7L20.7 5.13848V20.7H5.13847ZM4.41421 22C3.52331 22 3.07714 20.9229 3.7071 20.2929L20.2929 3.70711C20.9229 3.07714 22 3.52331 22 4.41421V21C22 21.5523 21.5523 22 21 22H4.41421Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.1461 12.1001C17.4611 11.7852 17.9996 12.0082 17.9996 12.4537V17.4996C17.9996 17.7758 17.7758 17.9996 17.4996 17.9996H12.4537C12.0082 17.9996 11.7851 17.4611 12.1001 17.1461L17.1461 12.1001ZM14.3851 16.6996L16.6996 14.3851V16.6996H14.3851Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.4765 9.79074L10.5806 0.836119C11.1653 0.260953 12.1045 0.264836 12.6845 0.844825L14.3621 2.52242C14.9489 3.10924 14.9449 4.06186 14.3533 4.6438L5.28767 13.5606L2.04859 14.8562C1.01699 15.2689 -0.0260327 14.2854 0.32645 13.231L1.4765 9.79074ZM2.61052 10.4988L11.4922 1.76293C11.5681 1.68829 11.69 1.68879 11.7652 1.76406L13.4428 3.44166C13.519 3.51782 13.5185 3.64145 13.4417 3.71698L4.56231 12.4506L1.56578 13.6492C1.56195 13.6507 1.55807 13.6471 1.55938 13.6432L2.61052 10.4988Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.1077 6.32258L8.70269 3.91758L9.62193 2.99834L12.0269 5.40334L11.1077 6.32258Z", fill: "currentColor" })] });
Tools24.displayName = "Tools24";
const Memo$d = reactExports.memo(Tools24);
const Car24 = (props) => jsxRuntimeExports.jsxs("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M21.4603 10.8253C21.0922 10.6816 20.8095 10.3783 20.6919 10.0011L19.1476 5.04641C18.4721 3.35779 16.9129 2.3 15.175 2.3H8.825C7.08749 2.3 5.5279 3.35785 4.85236 5.04641L3.30812 10.0011C3.19054 10.3783 2.90778 10.6816 2.53969 10.8253C1.82528 11.1041 1.3 11.8172 1.3 12.6773V15.682C1.3 16.1781 1.48294 16.6311 1.78994 16.9918C1.99009 17.2269 2.1 17.5256 2.1 17.8344V21.1592H4.3V18.9673C4.3 18.2494 4.88203 17.6673 5.6 17.6673H18.4C19.118 17.6673 19.7 18.2494 19.7 18.9673V21.1592H21.9V17.8344C21.9 17.5254 22.0101 17.2266 22.2104 16.9914C22.5169 16.6316 22.7 16.1788 22.7 15.682V12.6773C22.7 11.8172 22.1747 11.1041 21.4603 10.8253ZM3.6255 4.61387C4.481 2.41834 6.522 1 8.825 1H15.175C17.4785 1 19.519 2.41834 20.3745 4.61387L21.933 9.61427C23.139 10.085 24 11.2739 24 12.6773V15.682C24 16.51 23.692 17.2569 23.2 17.8344V21.8092C23.2 22.1682 22.909 22.4592 22.55 22.4592H19.05C18.691 22.4592 18.4 22.1682 18.4 21.8092V18.9673H5.6V21.8092C5.6 22.1682 5.30899 22.4592 4.95 22.4592H1.45C1.09101 22.4592 0.8 22.1682 0.8 21.8092V17.8344C0.308 17.2564 0 16.5095 0 15.682V12.6773C0 11.2739 0.861 10.085 2.067 9.61427L3.6255 4.61387Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.63097 5.96274L7.05613 8.09205H16.9439L16.369 5.96275C16.1505 5.41512 15.6992 5.1479 15.2947 5.1479H8.70526C8.30076 5.1479 7.84949 5.41512 7.63097 5.96274ZM17.6073 5.56161L18.4202 8.57264C18.5317 8.98575 18.2205 9.39205 17.7926 9.39205H6.20739C5.77949 9.39205 5.46833 8.98575 5.57985 8.57264L6.39272 5.56161C6.77097 4.52668 7.68675 3.8479 8.70526 3.8479H15.2947C16.3133 3.8479 17.229 4.52668 17.6073 5.56161Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M19.2933 13.014C17.7276 13.1807 17.0028 13.9463 16.6501 14.6175H19.2933V13.014ZM19.2313 11.7137C20.011 11.6395 20.5933 12.2807 20.5933 12.9809V14.6179C20.5933 15.3365 20.0106 15.9175 19.2933 15.9175H16.5348C16.1248 15.9175 15.7501 15.726 15.5184 15.4168C15.2794 15.0979 15.1987 14.6556 15.3909 14.2339C15.8827 13.1554 16.9778 11.9282 19.2313 11.7137Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.70671 13.014C6.27241 13.1807 6.99716 13.9463 7.34989 14.6174H4.70671V13.014ZM4.76868 11.7137C3.98896 11.6395 3.40671 12.2807 3.40671 12.9809V14.6179C3.40671 15.3365 3.98935 15.9174 4.70671 15.9174H7.46522C7.87523 15.9174 8.24987 15.726 8.48159 15.4168C8.7206 15.0979 8.80133 14.6556 8.60908 14.2339C8.11733 13.1554 7.02219 11.9281 4.76868 11.7137Z", fill: "currentColor" })] });
Car24.displayName = "Car24";
const Memo$c = reactExports.memo(Car24);
const Copyright16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.00002 2.66669C5.0545 2.66669 2.66669 5.0545 2.66669 8.00002C2.66669 10.9455 5.0545 13.3334 8.00002 13.3334C10.9455 13.3334 13.3334 10.9455 13.3334 8.00002C13.3334 5.0545 10.9455 2.66669 8.00002 2.66669ZM1.66669 8.00002C1.66669 4.50222 4.50222 1.66669 8.00002 1.66669C11.4978 1.66669 14.3334 4.50222 14.3334 8.00002C14.3334 11.4978 11.4978 14.3334 8.00002 14.3334C4.50222 14.3334 1.66669 11.4978 1.66669 8.00002Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M7.84806 11.2536C7.40006 11.2536 7.00006 11.1776 6.64806 11.0256C6.29606 10.8736 6.00006 10.6576 5.76006 10.3776C5.52006 10.0896 5.33606 9.74564 5.20806 9.34564C5.08006 8.93764 5.01606 8.48564 5.01606 7.98964C5.01606 7.49364 5.08006 7.04564 5.20806 6.64564C5.33606 6.23764 5.52006 5.89364 5.76006 5.61364C6.00006 5.32564 6.29606 5.10564 6.64806 4.95364C7.00006 4.80164 7.40006 4.72564 7.84806 4.72564C8.47206 4.72564 8.98406 4.86564 9.38406 5.14564C9.65503 5.33532 9.87643 5.56721 10.0483 5.84132C10.1889 6.06557 10.0728 6.34902 9.83298 6.46094L9.70152 6.52229C9.42613 6.65081 9.10755 6.49263 8.90801 6.26341C8.8498 6.19655 8.78448 6.13596 8.71206 6.08164C8.49606 5.90564 8.20806 5.81764 7.84806 5.81764C7.36806 5.81764 7.00406 5.96964 6.75606 6.27364C6.51606 6.56964 6.39606 6.95764 6.39606 7.43764V8.55364C6.39606 9.03364 6.51606 9.42564 6.75606 9.72964C7.00406 10.0256 7.36806 10.1736 7.84806 10.1736C8.23206 10.1736 8.53606 10.0816 8.76006 9.89764C8.86302 9.81243 8.95653 9.7154 9.04059 9.60656C9.21855 9.3761 9.53166 9.25806 9.78893 9.39444L9.90903 9.45811C10.1357 9.57825 10.2395 9.85384 10.1075 10.0738C9.91601 10.393 9.67086 10.6503 9.37206 10.8456C8.95606 11.1176 8.44806 11.2536 7.84806 11.2536Z", fill: "currentColor" })] });
Copyright16.displayName = "Copyright16";
const Memo$b = reactExports.memo(Copyright16);
const Clock16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 3C5.24568 3 3 5.24568 3 8C3 10.7543 5.24568 13 8 13C10.7543 13 13 10.7543 13 8C13 5.24568 10.7543 3 8 3ZM2 8C2 4.6934 4.6934 2 8 2C11.3066 2 14 4.6934 14 8C14 11.3066 11.3066 14 8 14C4.6934 14 2 11.3066 2 8Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.9 4.4H7.9V8.04133L10.3293 10.4707L9.62223 11.1778L6.9 8.45554V4.4Z", fill: "currentColor" })] });
Clock16.displayName = "Clock16";
const Memo$a = reactExports.memo(Clock16);
const ExternalLink16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.33333 4.5C3.11232 4.5 2.90036 4.5878 2.74408 4.74408C2.5878 4.90036 2.5 5.11232 2.5 5.33333V12.6667C2.5 12.8877 2.5878 13.0996 2.74408 13.2559C2.90036 13.4122 3.11232 13.5 3.33333 13.5H10.6667C10.8877 13.5 11.0996 13.4122 11.2559 13.2559C11.4122 13.0996 11.5 12.8877 11.5 12.6667V8.66667C11.5 8.39052 11.7239 8.16667 12 8.16667C12.2761 8.16667 12.5 8.39052 12.5 8.66667V12.6667C12.5 13.1529 12.3068 13.6192 11.963 13.963C11.6192 14.3068 11.1529 14.5 10.6667 14.5H3.33333C2.8471 14.5 2.38079 14.3068 2.03697 13.963C1.69315 13.6192 1.5 13.1529 1.5 12.6667V5.33333C1.5 4.8471 1.69315 4.38079 2.03697 4.03697C2.38079 3.69315 2.8471 3.5 3.33333 3.5H7.33333C7.60948 3.5 7.83333 3.72386 7.83333 4C7.83333 4.27614 7.60948 4.5 7.33333 4.5H3.33333Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.5 2C9.5 1.72386 9.72386 1.5 10 1.5H14C14.2761 1.5 14.5 1.72386 14.5 2V6C14.5 6.27614 14.2761 6.5 14 6.5C13.7239 6.5 13.5 6.27614 13.5 6V2.5H10C9.72386 2.5 9.5 2.27614 9.5 2Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.3536 1.64645C14.5488 1.84171 14.5488 2.15829 14.3536 2.35355L7.02023 9.68689C6.82497 9.88215 6.50839 9.88215 6.31313 9.68689C6.11786 9.49162 6.11786 9.17504 6.31313 8.97978L13.6465 1.64645C13.8417 1.45118 14.1583 1.45118 14.3536 1.64645Z", fill: "currentColor" })] });
ExternalLink16.displayName = "ExternalLink16";
const Memo$9 = reactExports.memo(ExternalLink16);
const SmartCity24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.06097 6.061C9.89597 5.402 10.917 5 12 5C13.083 5 14.104 5.402 14.939 6.061L16.006 4.994C14.902 4.072 13.511 3.5 12 3.5C10.489 3.5 9.09797 4.072 7.99397 4.994L9.06097 6.061ZM17.389 3.611L18.452 2.548C16.711 0.984 14.459 0 12 0C9.54097 0 7.28897 0.984 5.54797 2.548L6.61097 3.611C8.08797 2.312 9.97297 1.5 12 1.5C14.027 1.5 15.912 2.312 17.389 3.611ZM12 6.95898C10.068 6.95898 8.5 8.52698 8.5 10.459C8.5 13.084 12 16.959 12 16.959C12 16.959 15.5 13.084 15.5 10.459C15.5 8.52598 13.932 6.95898 12 6.95898ZM12 12.008C11.172 12.008 10.5 11.336 10.5 10.508C10.5 9.67999 11.172 9.00798 12 9.00798C12.828 9.00798 13.5 9.67999 13.5 10.508C13.5 11.336 12.828 12.008 12 12.008ZM14.839 15.7609C15.058 15.4439 15.279 15.1029 15.494 14.7469L23 18.4999L12 23.9999L1 18.4999L8.505 14.7479C8.72 15.1039 8.941 15.4449 9.16 15.7619L7.35 16.6669L12.424 19.2039L14.291 18.2709L13.285 17.7679C13.461 17.5649 13.737 17.2369 14.064 16.8159L15.632 17.5999L17.074 16.8789L14.839 15.7609ZM6.008 17.3369L3.683 18.4999L8.758 21.0369L11.083 19.8739L6.008 17.3369ZM10.1 21.7079L12 22.6579L14.325 21.4949L12.425 20.5449L10.1 21.7079ZM13.767 19.8749L15.667 20.8249L17.534 19.8919L15.634 18.9419L13.767 19.8749ZM16.975 18.2709L18.875 19.2209L20.317 18.4999L18.417 17.5499L16.975 18.2709Z", fill: "currentColor" }) });
SmartCity24.displayName = "SmartCity24";
const Memo$8 = reactExports.memo(SmartCity24);
const Car16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M14.1446 6.89163C14.1899 7.03672 14.2986 7.15337 14.4402 7.20863C15.0551 7.44864 15.5 8.05823 15.5 8.78489V10.788C15.5 11.2126 15.3427 11.5974 15.0861 11.8987C15.009 11.9891 14.9667 12.1041 14.9667 12.2229V14.8061H12.7667V12.9782C12.7667 12.7021 12.5428 12.4782 12.2667 12.4782H3.73333C3.45719 12.4782 3.23333 12.7021 3.23333 12.9782V14.8061H1.03333V12.2229C1.03333 12.1042 0.991059 11.9893 0.914079 11.8989C0.657234 11.5971 0.5 11.2122 0.5 10.788V8.78489C0.5 8.05823 0.944877 7.44864 1.5598 7.20863C1.70138 7.15337 1.81013 7.03672 1.85535 6.89163L2.88901 3.57516C3.39031 2.30663 4.56571 1.5 5.88333 1.5H10.1167C11.4346 1.5 12.6097 2.3066 13.111 3.57515L14.1446 6.89163Z", stroke: "currentColor", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M4.22531 6.09469L4.73846 4.19387C4.9301 3.69115 5.36193 3.39859 5.80351 3.39859H10.1965C10.6381 3.39859 11.0699 3.69115 11.2615 4.19387L11.7747 6.09469L12.2574 5.96437L11.7747 6.09469H4.22531Z", stroke: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M11.0921 10.6378H12.7955C13.0717 10.6378 13.2955 10.4145 13.2955 10.1383V8.94804C13.2955 8.6719 13.0699 8.44401 12.7959 8.47821C11.5199 8.63748 10.9287 9.40382 10.6592 10.0578C10.5394 10.3485 10.7776 10.6378 11.0921 10.6378Z", stroke: "currentColor", strokeLinejoin: "round" }), jsxRuntimeExports.jsx("path", { d: "M4.90792 10.6378H3.20447C2.92833 10.6378 2.70447 10.4145 2.70447 10.1383V8.94804C2.70447 8.6719 2.93007 8.44401 3.20409 8.47821C4.48009 8.63748 5.07127 9.40382 5.3408 10.0578C5.46063 10.3485 5.2224 10.6378 4.90792 10.6378Z", stroke: "currentColor", strokeLinejoin: "round" })] });
Car16.displayName = "Car16";
const Memo$7 = reactExports.memo(Car16);
const UploadAnalysis16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.88093 9.7871C1.99851 9.53724 2.29638 9.43001 2.54624 9.54759L8.00001 12.1141L13.4538 9.54759C13.7036 9.43001 14.0015 9.53724 14.1191 9.7871C14.2367 10.037 14.1294 10.3348 13.8796 10.4524L8.2129 13.1191C8.07806 13.1825 7.92195 13.1825 7.78711 13.1191L2.12044 10.4524C1.87058 10.3348 1.76335 10.037 1.88093 9.7871Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.88093 12.4538C1.99851 12.2039 2.29638 12.0967 2.54624 12.2142L8.00001 14.7807L13.4538 12.2142C13.7036 12.0967 14.0015 12.2039 14.1191 12.4538C14.2367 12.7036 14.1294 13.0015 13.8796 13.1191L8.21291 15.7857C8.07807 15.8492 7.92195 15.8492 7.78711 15.7857L2.12044 13.1191C1.87058 13.0015 1.76335 12.7036 1.88093 12.4538Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.5102 7.58233C8.5102 7.85847 8.28634 8.08233 8.0102 8.08233C7.73405 8.08233 7.5102 7.85847 7.5102 7.58233V1.87377L5.68678 3.6972C5.49151 3.89246 5.17493 3.89246 4.97967 3.6972C4.78441 3.50193 4.78441 3.18535 4.97967 2.99009L7.65664 0.313104C7.8519 0.117841 8.16849 0.117841 8.36375 0.313102L11.0407 2.99009C11.236 3.18535 11.236 3.50193 11.0407 3.6972C10.8455 3.89246 10.5289 3.89246 10.3336 3.6972L8.5102 1.87376V7.58233Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M6.51151 5.91968V4.82504L2.12032 6.88093C1.94508 6.9634 1.83322 7.13966 1.83322 7.33334C1.83322 7.52702 1.94508 7.70328 2.12032 7.78575L7.78699 10.4524C7.92183 10.5159 8.07795 10.5159 8.21279 10.4524L13.8795 7.78575C14.0547 7.70328 14.1666 7.52702 14.1666 7.33334C14.1666 7.13966 14.0547 6.9634 13.8795 6.88093L9.5107 4.82504V5.93024L12.4923 7.33334L7.99989 9.44741L3.50749 7.33334L6.51151 5.91968Z", fill: "currentColor" })] });
UploadAnalysis16.displayName = "UploadAnalysis16";
const Memo$6 = reactExports.memo(UploadAnalysis16);
const Reference16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.5 2V5V8H12.7817L11.6385 5.98802C11.2904 5.37533 11.2904 4.62466 11.6385 4.01198L12.7817 2H5.5ZM4.5 9V12.5C4.5 12.7761 4.72386 13 5 13C5.27614 13 5.5 12.7761 5.5 12.5V9H12.7817C13.5484 9 14.0299 8.17263 13.6511 7.50599L12.508 5.49401C12.3339 5.18767 12.3339 4.81233 12.508 4.50599L13.6511 2.49401C14.0299 1.82737 13.5484 1 12.7817 1H5.5H5H4.5V1.5V2V5V8V9ZM3.6875 11.5598C3.30134 11.6302 2.94713 11.7317 2.64142 11.8596C2.32801 11.9908 2.04185 12.1598 1.82646 12.3729C1.60924 12.5879 1.4375 12.877 1.4375 13.2273C1.4375 13.5776 1.60924 13.8667 1.82646 14.0817C2.04185 14.2948 2.32801 14.4638 2.64142 14.595C3.27036 14.8583 4.10454 15.0092 5 15.0092C5.89546 15.0092 6.72964 14.8583 7.35858 14.595C7.67199 14.4638 7.95815 14.2948 8.17354 14.0817C8.39076 13.8667 8.5625 13.5776 8.5625 13.2273C8.5625 12.877 8.39076 12.5879 8.17354 12.3729C7.95815 12.1598 7.67199 11.9908 7.35858 11.8596C7.05287 11.7317 6.69866 11.6302 6.3125 11.5598V12.5795C6.56136 12.6341 6.78376 12.7031 6.97245 12.7821C7.21324 12.8829 7.37557 12.9901 7.47012 13.0837C7.56252 13.1751 7.5625 13.2233 7.5625 13.2273V13.2273V13.2274C7.5625 13.2313 7.56252 13.2795 7.47012 13.3709C7.37557 13.4645 7.21324 13.5718 6.97245 13.6726C6.49298 13.8733 5.79592 14.0092 5 14.0092C4.20408 14.0092 3.50702 13.8733 3.02755 13.6726C2.78676 13.5718 2.62443 13.4645 2.52988 13.3709C2.43748 13.2795 2.4375 13.2313 2.4375 13.2274V13.2273V13.2273C2.4375 13.2233 2.43748 13.1751 2.52988 13.0837C2.62443 12.9901 2.78676 12.8829 3.02755 12.7821C3.21624 12.7031 3.43864 12.6341 3.6875 12.5795V11.5598Z", fill: "currentColor" }) });
Reference16.displayName = "Reference16";
const Memo$5 = reactExports.memo(Reference16);
const Rubber16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.24179 8.1663L7.9081 2.5C8.68914 1.71895 9.95547 1.71895 10.7365 2.5L13 4.7635C13.7811 5.54454 13.7811 6.81087 13 7.59192L7.75056 12.8414H14V13.8414H6.02235C5.47679 13.8693 4.92198 13.6749 4.50529 13.2582L2.24179 10.9947C1.46074 10.2137 1.46074 8.94735 2.24179 8.1663ZM2.9489 8.87341C2.55837 9.26394 2.55837 9.8971 2.9489 10.2876L5.21239 12.5511C5.60292 12.9416 6.23608 12.9416 6.62661 12.5511L7.95324 11.2245L4.27553 7.54678L2.9489 8.87341ZM12.2929 6.88482L8.66034 10.5174L4.98264 6.83967L8.6152 3.20711C9.00573 2.81658 9.63889 2.81658 10.0294 3.20711L12.2929 5.4706C12.6834 5.86113 12.6834 6.49429 12.2929 6.88482Z", fill: "currentColor" }) });
Rubber16.displayName = "Rubber16";
const Memo$4 = reactExports.memo(Rubber16);
const Rubber24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.40053 13.5028L13.035 2.86833C13.9332 1.97013 15.3895 1.97013 16.2877 2.86833L21.1317 7.71234C22.0299 8.61054 22.0299 10.0668 21.1317 10.965L11.1245 20.9722L21 20.9722V22.2722H8.93542C8.89241 22.2734 8.84936 22.2734 8.80634 22.2722H8.73169V22.2689C8.19029 22.2363 7.65822 22.0132 7.24454 21.5995L2.40053 16.7555C1.50232 15.8573 1.50232 14.401 2.40053 13.5028ZM8.9134 20.9722H8.82836C8.58679 20.962 8.34822 20.8647 8.16378 20.6802L3.31977 15.8362C2.92924 15.4457 2.92924 14.8125 3.31977 14.422L6.21543 11.5264L12.4736 17.7846L9.57799 20.6802C9.39354 20.8647 9.15497 20.962 8.9134 20.9722ZM20.2124 10.0458L13.3929 16.8653L7.13467 10.6071L13.9542 3.78757C14.3447 3.39705 14.9779 3.39705 15.3684 3.78757L20.2124 8.63158C20.603 9.0221 20.603 9.65527 20.2124 10.0458Z", fill: "currentColor" }) });
Rubber24.displayName = "Rubber24";
const Memo$3 = reactExports.memo(Rubber24);
const Diamond24 = (props) => jsxRuntimeExports.jsx("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.76076 4.09452C5.06012 3.60243 5.59442 3.30206 6.17042 3.30206H17.8296C18.4056 3.30206 18.9399 3.60243 19.2392 4.09452L21.9716 8.5861C22.3254 9.16766 22.2857 9.90678 21.8717 10.4471L13.312 21.6196C12.6516 22.4815 11.3532 22.4817 10.6927 21.6199L2.12859 10.4473C1.71439 9.90692 1.67462 9.16763 2.02847 8.58596L4.76076 4.09452ZM6.4601 4.60206L7.69543 8.00844L10.4819 4.60206H6.4601ZM15.3215 8.85987L12 4.79936L8.67849 8.85987H15.3215ZM13.5181 4.60206L16.3046 8.00843L17.5399 4.60206H13.5181ZM18.5879 5.52526L17.3786 8.85987H20.6165L18.5879 5.52526ZM8.47564 10.1599L12 19.8782L15.5244 10.1599H8.47564ZM6.62135 8.85987L5.41205 5.52525L3.38349 8.85987H6.62135ZM7.0928 10.1599L10.2774 18.9413L3.54625 10.1599H7.0928ZM13.7193 18.9504L16.9072 10.1599H20.4541L13.7193 18.9504Z", fill: "currentColor" }) });
Diamond24.displayName = "Diamond24";
const Memo$2 = reactExports.memo(Diamond24);
const FavAdded16 = (props) => jsxRuntimeExports.jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.5044 5.8292C14.9445 5.86715 15.1228 6.41542 14.7892 6.70497L11.5859 9.48502C11.53 9.53357 11.5055 9.60907 11.5222 9.68124L12.4799 13.8117C12.5797 14.2423 12.1128 14.5811 11.7345 14.3527L8.00001 12.0988L4.26747 14.3516C3.88881 14.5801 3.42169 14.2406 3.52217 13.8099L4.5127 9.56394L1.21441 6.70663C0.880106 6.41702 1.05881 5.86789 1.49952 5.8305L5.54113 5.48761C5.72592 5.47194 5.88685 5.35527 5.95922 5.18452L7.54 1.45479C7.71224 1.04839 8.28815 1.04824 8.46061 1.45454L10.0409 5.1775C10.1132 5.3479 10.2738 5.46439 10.4582 5.48029L14.5044 5.8292Z", fill: "currentColor" }) });
FavAdded16.displayName = "FavAdded16";
const Memo$1 = reactExports.memo(FavAdded16);
const OsmGaps16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { d: "M10.1756 2.03184C10.0627 1.9895 9.93829 1.98938 9.82533 2.0315C9.70622 2.07591 9.31663 2.2219 8.82509 2.4062C8.56653 2.50315 8.43551 2.79135 8.53246 3.04992C8.62941 3.30848 8.91761 3.4395 9.17618 3.34255L9.5 3.22114V3.6875C9.5 3.96364 9.72386 4.1875 10 4.1875C10.2761 4.1875 10.5 3.96364 10.5 3.6875V3.2215L10.8244 3.34316C11.083 3.44012 11.3712 3.30912 11.4682 3.05056C11.5651 2.792 11.4341 2.5038 11.1756 2.40684L10.1756 2.03184Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.17553 4.09297C7.43408 3.99597 7.56504 3.70774 7.46804 3.4492C7.37104 3.19065 7.08281 3.0597 6.82426 3.1567L5.99995 3.46598L2.17556 2.03184C2.02201 1.97426 1.84999 1.99563 1.7152 2.08904C1.58042 2.18245 1.5 2.33601 1.5 2.5V12C1.5 12.2084 1.62929 12.395 1.82444 12.4682L5.82444 13.9682C5.93736 14.0105 6.06179 14.0106 6.17478 13.9685L10.0097 12.5377L10.8244 12.8432C11.083 12.9401 11.3712 12.8091 11.4682 12.5506C11.5651 12.292 11.4341 12.0038 11.1756 11.9068L10.5 11.6535V10.8125C10.5 10.5364 10.2761 10.3125 10 10.3125C9.72386 10.3125 9.5 10.5364 9.5 10.8125V11.6535L8.82444 11.9068C8.80136 11.9155 8.7793 11.9257 8.75832 11.9372L6.5 12.7798V4.34643L7.17553 4.09297ZM5.5 12.7785L2.5 11.6535V3.2215L5.5 4.3465V12.7785Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M13.1756 3.15684C12.917 3.05988 12.6288 3.19088 12.5318 3.44944C12.4349 3.708 12.5659 3.9962 12.8244 4.09316L13.5 4.3465V5.1875C13.5 5.46364 13.7239 5.6875 14 5.6875C14.2761 5.6875 14.5 5.46364 14.5 5.1875V4C14.5 3.79158 14.3707 3.60502 14.1756 3.53184L13.1756 3.15684Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M10.5 6.0625C10.5 5.78636 10.2761 5.5625 10 5.5625C9.72386 5.5625 9.5 5.78636 9.5 6.0625V8.4375C9.5 8.71364 9.72386 8.9375 10 8.9375C10.2761 8.9375 10.5 8.71364 10.5 8.4375V6.0625Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M14.5 7.5625C14.5 7.28636 14.2761 7.0625 14 7.0625C13.7239 7.0625 13.5 7.28636 13.5 7.5625V9.9375C13.5 10.2136 13.7239 10.4375 14 10.4375C14.2761 10.4375 14.5 10.2136 14.5 9.9375V7.5625Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { d: "M14.5 12.3125C14.5 12.0364 14.2761 11.8125 14 11.8125C13.7239 11.8125 13.5 12.0364 13.5 12.3125V12.7785L13.1756 12.6568C12.917 12.5599 12.6288 12.6909 12.5318 12.9494C12.4349 13.208 12.5659 13.4962 12.8244 13.5932L13.8244 13.9682C13.978 14.0257 14.15 14.0044 14.2848 13.911C14.4196 13.8176 14.5 13.664 14.5 13.5V12.3125Z", fill: "currentColor" })] });
OsmGaps16.displayName = "OsmGaps16";
const Memo = reactExports.memo(OsmGaps16);
const icons = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AddLayer24: Memo$2O,
  AddLayerIcon,
  AdvancedAnalytics16: Memo$y,
  AdvancedAnalytics24: Memo$M,
  Alarm24: Memo$2w,
  Analytics16: Memo$v,
  Analytics24: Memo$B,
  AnalyticsPanelIcon,
  Area16: Memo$1g,
  Area24: Memo$29,
  ArrowExternal16: Memo$1O,
  ArrowExternal24: Memo$1P,
  ArrowLeft16: Memo$1T,
  ArrowLeft24: Memo$2R,
  ArrowRight16: Memo$1S,
  ArrowRight24: Memo$2S,
  Bi24: Memo$26,
  BivariateMatrix16: Memo$w,
  BivariateMatrix24: Memo$K,
  BivariatePanelIcon,
  BookOpen24: Memo$2k,
  BoundarySelectorIcon,
  Branch24: Memo$2A,
  Calendar16: Memo$2u,
  Calendar24: Memo$2y,
  CallIcon,
  Car16: Memo$7,
  Car24: Memo$c,
  Chart24: Memo$2F,
  ChartColumn24: Memo$2E,
  Chat16: Memo$1x,
  Chat24: Memo$1y,
  ChevronDown16: Memo$20,
  ChevronDown24: Memo$21,
  ChevronLeft16: Memo$1Y,
  ChevronLeft24: Memo$1Z,
  ChevronRight16: Memo$1W,
  ChevronRight24: Memo$1X,
  ChevronUp16: Memo$1_,
  ChevronUp24: Memo$1$,
  Circle: Memo$2c,
  Clock16: Memo$a,
  Close16: Memo$22,
  Close24: Memo$23,
  CloseFilled16: Memo$1L,
  CloseFilled24: Memo$1M,
  CloseIcon,
  Collapse224: Memo$2B,
  Collapse24: Memo$2C,
  ColumnWidth16: Memo$Q,
  Community24: Memo$1j,
  Copyright16: Memo$b,
  CornerUpLeft16: Memo$2n,
  CornerUpLeft24: Memo$E,
  CornerUpRight16: Memo$2q,
  CornerUpRight24: Memo$2P,
  Database24: Memo$2Q,
  Delete16: Memo$1D,
  Delete24: Memo$1E,
  Diamond24: Memo$2,
  Disasters16: Memo$z,
  Disasters24: Memo$J,
  DisastersListIcon: DisasterListIcon,
  DollarCircle16: Memo$1R,
  DollarSquare16: Memo$1Q,
  DoubleChevronDown24: Memo$t,
  DoubleChevronLeft24: Memo$S,
  DoubleChevronRight24: Memo$R,
  DoubleChevronUp24: Memo$u,
  Download16: Memo$2i,
  Download24: Memo$2j,
  DrawLineIcon,
  DrawPointIcon,
  DrawPolygonIcon,
  DrawToolsIcon,
  Edit16: Memo$1q,
  Edit24: Memo$1r,
  EditGeometry16: Memo$e,
  EditInOsm16: Memo$f,
  EditLine24: Memo$28,
  EditOsm24: Memo$I,
  Error16: Memo$1J,
  Error24: Memo$F,
  Expand24: Memo$2D,
  ExternalLink16: Memo$9,
  Eye16: Memo$1z,
  Eye24: Memo$1A,
  EyeBallCrossedIcon,
  EyeBallIcon,
  EyeOff16: Memo$1B,
  EyeOff24: Memo$1C,
  FavAdded16: Memo$1,
  FilterOff16: Memo$2t,
  FilterOn16: Memo$2s,
  Filters24: Memo$2x,
  Finish16: Memo$1t,
  Finish24: Memo$1u,
  FinishFilled16: Memo$1s,
  FireTruckIcon,
  FlameIcon,
  Globe24: Memo$19,
  History16: Memo$1k,
  History24: Memo$s,
  HydrantIcon,
  Image16: Memo$1a,
  Image24: Memo$1b,
  Info24: Memo$2K,
  InfoAlarm16: Memo$2v,
  InfoError16: Memo$1K,
  InfoErrorOutline16: Memo$$,
  InfoFilled16: Memo$2z,
  InfoIcon,
  InfoOutline16: Memo$11,
  Intercom: Memo$1F,
  Kontur24: Memo$n,
  LayerLegend: Memo$14,
  LayerLegendSmall: Memo$13,
  LayerPeriphery: Memo$15,
  LayerUrban: Memo$16,
  Layers16: Memo$A,
  Layers24: Memo$H,
  LayersPanelIcon,
  Legend16: Memo$x,
  Legend24: Memo$L,
  LegendPanelIcon,
  Line16: Memo$i,
  Line24: Memo$2a,
  Link16: Memo$1l,
  List24: Memo$1d,
  Loader24: Memo$2I,
  Loading16: Memo$2H,
  Locate16: Memo$2r,
  Locate24: Memo$2J,
  Location24: Memo$2N,
  LocationFilled16: Memo$2L,
  LocationFilled24: Memo$2M,
  Map16: Memo$1f,
  Map24: Memo$1e,
  MarkerIcon,
  Measure24: Memo$2G,
  Merge24: Memo$D,
  Minus16: Memo$m,
  More16: Memo$1m,
  More24: Memo$1n,
  Ninja24: Memo$o,
  North16: Memo$k,
  OsmGaps16: Memo,
  Pause24: Memo$U,
  People16: Memo$1h,
  Play24: Memo$Z,
  PlayActive24: Memo$Y,
  PlayOutlineTv24: Memo$2T,
  PlayTimeline24: Memo$W,
  Plus16: Memo$2l,
  Plus24: Memo$2m,
  PointFilled16: Memo$2b,
  PointFilled24: Memo$2e,
  PointOutline16: Memo$2f,
  PointOutline24: Memo$2g,
  Poly16: Memo$g,
  Poly24: Memo$27,
  Prefs16: Memo$1o,
  Prefs24: Memo$1p,
  Record16: Memo$10,
  Reference16: Memo$5,
  Reports16: Memo$1v,
  Reports24: Memo$1w,
  Route24: Memo$17,
  RouteDirection24: Memo$18,
  Rubber16: Memo$4,
  Rubber24: Memo$3,
  Ruler16: Memo$j,
  Ruler24: Memo$24,
  Search16: Memo$1G,
  Search24: Memo$1H,
  SearchIcon,
  SelectArea16: Memo$h,
  SelectArea24: Memo$25,
  SetArea16: Memo$2p,
  SetArea24: Memo$C,
  Share24: Memo$1c,
  SmartCity24: Memo$8,
  SortDrag16: Memo$1I,
  SortIcon,
  StartLoc: Memo$2d,
  StepBackward24: Memo$X,
  StepForward24: Memo$V,
  Tags16: Memo$O,
  TimelinePoint24: Memo$q,
  TimelinePoints24: Memo$p,
  ToStart24: Memo$T,
  Tools24: Memo$d,
  Trash16: Memo$1N,
  Trash24: Memo$G,
  TrashBinIcon,
  TriangleDown16: Memo$1V,
  TriangleUp16: Memo$1U,
  TripleDotIcon,
  Twoxtwo16: Memo$P,
  Update16: Memo$2o,
  Update24: Memo$_,
  Upload16: Memo$2h,
  Upload24: Memo$N,
  UploadAnalysis16: Memo$6,
  UploadFileIcon,
  User24: Memo$12,
  Users24: Memo$1i,
  Video24: Memo$r,
  ZoomTo16: Memo$l
}, Symbol.toStringTag, { value: "Module" }));
function Text$1({ children, type, className }) {
  return reactExports.isValidElement(children) ? reactExports.cloneElement(children, { className: `k-font-${type} ${children.props.className} ${className}` }) : jsxRuntimeExports.jsx("span", { className: `k-font-${type} ${className}`, children });
}
const button = "_button_1231j_1";
const buttonDark = "_buttonDark_1231j_58";
const buttonInner = "_buttonInner_1231j_75";
const tiny = "_tiny_1231j_80";
const withContent = "_withContent_1231j_81";
const small = "_small_1231j_92";
const medium = "_medium_1231j_96";
const large = "_large_1231j_108";
const withIcon = "_withIcon_1231j_114";
const buttonContent = "_buttonContent_1231j_52";
const iconBefore = "_iconBefore_1231j_155";
const iconAfter = "_iconAfter_1231j_156";
const primary = "_primary_1231j_163";
const active$1 = "_active_1231j_174";
const invert = "_invert_1231j_180";
const s$i = {
  button,
  buttonDark,
  buttonInner,
  tiny,
  withContent,
  small,
  medium,
  large,
  withIcon,
  buttonContent,
  iconBefore,
  iconAfter,
  primary,
  active: active$1,
  "invert-outline": "_invert-outline_1231j_180",
  invert
};
const Button = reactExports.forwardRef(({ children, className, active: active2, variant = "primary", size = "medium", dark = false, iconBefore: iconBefore2, iconAfter: iconAfter2, ...props }, ref) => {
  const hasContent = reactExports.Children.count(children) > 0;
  const hasIcon = iconBefore2 || iconAfter2;
  return jsxRuntimeExports.jsx("button", { ref, className: clsx(s$i.button, {
    [s$i.buttonDark]: dark
  }, s$i[variant], s$i[size], {
    [s$i.active]: active2,
    [s$i.withContent]: hasContent,
    [s$i.withIcon]: hasIcon
  }, className), ...props, children: jsxRuntimeExports.jsxs("div", { className: clsx(s$i.buttonInner), children: [iconBefore2 && jsxRuntimeExports.jsx("div", { className: s$i.iconBefore, children: iconBefore2 }), hasContent && jsxRuntimeExports.jsx("span", { className: s$i.buttonContent, children }), iconAfter2 && jsxRuntimeExports.jsx("div", { className: s$i.iconAfter, children: iconAfter2 })] }) });
});
Button.displayName = "Button";
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value2, end) {
  return max(start, min(value2, end));
}
function evaluate(value2, param) {
  return typeof value2 === "function" ? value2(param) : value2;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis2) {
  return axis2 === "x" ? "y" : "x";
}
function getAxisLength(axis2) {
  return axis2 === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x: x2,
    y: y2,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y2,
    left: x2,
    right: x2 + width,
    bottom: y2 + height,
    x: x2,
    y: y2
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config2) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config2;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x2,
    y: y2
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset: reset2
    } = await fn({
      x: x2,
      y: y2,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x2 = nextX != null ? nextX : x2;
    y2 = nextY != null ? nextY : y2;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset2 && resetCount <= 50) {
      resetCount++;
      if (typeof reset2 === "object") {
        if (reset2.placement) {
          statefulPlacement = reset2.placement;
        }
        if (reset2.rects) {
          rects = reset2.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset2.rects;
        }
        ({
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x: x2,
    y: y2,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x2,
    y: y2,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x: x2,
    y: y2,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$4 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x: x2,
      y: y2,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x: x2,
      y: y2
    };
    const axis2 = getAlignmentAxis(placement);
    const length = getAxisLength(axis2);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis2 === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis2] - coords[axis2] - rects.floating[length];
    const startDiff = coords[axis2] - rects.reference[axis2];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis2]: coords[axis2] + alignmentOffset,
      data: {
        [axis2]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a2, b2) => a2.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d2.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b2) => a2[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x: x2,
        y: y2,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x2 + diffCoords.x,
        y: y2 + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x: x2,
        y: y2,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x3,
              y: y3
            } = _ref;
            return {
              x: x3,
              y: y3
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x: x2,
        y: y2
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x2,
          y: limitedCoords.y - y2,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow$1(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value2) {
  if (!hasWindow()) {
    return false;
  }
  return value2 instanceof Node || value2 instanceof getWindow$1(value2).Node;
}
function isElement$1(value2) {
  if (!hasWindow()) {
    return false;
  }
  return value2 instanceof Element || value2 instanceof getWindow$1(value2).Element;
}
function isHTMLElement(value2) {
  if (!hasWindow()) {
    return false;
  }
  return value2 instanceof HTMLElement || value2 instanceof getWindow$1(value2).HTMLElement;
}
function isShadowRoot$1(value2) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value2 instanceof ShadowRoot || value2 instanceof getWindow$1(value2).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css2 = isElement$1(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return css2.transform !== "none" || css2.perspective !== "none" || (css2.containerType ? css2.containerType !== "normal" : false) || !webkit && (css2.backdropFilter ? css2.backdropFilter !== "none" : false) || !webkit && (css2.filter ? css2.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value2) => (css2.willChange || "").includes(value2)) || ["paint", "layout", "strict", "content"].some((value2) => (css2.contain || "").includes(value2));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow$1(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement$1(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot$1(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot$1(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow$1(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css2 = getComputedStyle$1(element);
  let width = parseFloat(css2.width) || 0;
  let height = parseFloat(css2.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement$1(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x2 = ($2 ? round(rect.width) : rect.width) / width;
  let y2 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y2 || !Number.isFinite(y2)) {
    y2 = 1;
  }
  return {
    x: x2,
    y: y2
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow$1(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow$1(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement$1(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y2 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow$1(domElement);
    const offsetWin = offsetParent && isElement$1(offsetParent) ? getWindow$1(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css2 = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css2.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css2.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y2 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y2 += top;
      currentWin = getWindow$1(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y2
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x2 = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y2 = htmlRect.top + scroll.scrollTop;
  return {
    x: x2,
    y: y2
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y2 = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x2 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow$1(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x2 = 0;
  let y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y2 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement$1(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement$1(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement$1(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement$1(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y2 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x: x2,
    y: y2,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow$1(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement$1(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: isElement$1,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId2;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId2);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId2 = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const arrow$3 = arrow$4;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
const arrow$2 = (options) => {
  const {
    element,
    padding
  } = options;
  function isRef(value2) {
    return Object.prototype.hasOwnProperty.call(value2, "current");
  }
  return {
    name: "arrow",
    options,
    fn(args) {
      if (isRef(element)) {
        if (element.current != null) {
          return arrow$3({
            element: element.current,
            padding
          }).fn(args);
        }
        return {};
      } else if (element) {
        return arrow$3({
          element,
          padding
        }).fn(args);
      }
      return {};
    }
  };
};
var index$1 = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function deepEqual$1(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  if (typeof a2 !== typeof b2) {
    return false;
  }
  if (typeof a2 === "function" && a2.toString() === b2.toString()) {
    return true;
  }
  let length, i2, keys;
  if (a2 && b2 && typeof a2 == "object") {
    if (Array.isArray(a2)) {
      length = a2.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; ) {
        if (!deepEqual$1(a2[i2], b2[i2])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a2);
    length = keys.length;
    if (length !== Object.keys(b2).length) {
      return false;
    }
    for (i2 = length; i2-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) {
        return false;
      }
    }
    for (i2 = length; i2-- !== 0; ) {
      const key = keys[i2];
      if (key === "_owner" && a2.$$typeof) {
        continue;
      }
      if (!deepEqual$1(a2[key], b2[key])) {
        return false;
      }
    }
    return true;
  }
  return a2 !== a2 && b2 !== b2;
}
function useLatestRef$1(value2) {
  const ref = reactExports.useRef(value2);
  index$1(() => {
    ref.current = value2;
  });
  return ref;
}
function useFloating$1(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = reactExports.useState({
    x: null,
    y: null,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = reactExports.useState(middleware);
  if (!deepEqual$1(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const referenceRef = reactExports.useRef(null);
  const floatingRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef(data);
  const whileElementsMountedRef = useLatestRef$1(whileElementsMounted);
  const platformRef = useLatestRef$1(platform2);
  const [reference, _setReference] = reactExports.useState(null);
  const [floating, _setFloating] = reactExports.useState(null);
  const setReference = reactExports.useCallback((node) => {
    if (referenceRef.current !== node) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = reactExports.useCallback((node) => {
    if (floatingRef.current !== node) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const update = reactExports.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config2 = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config2.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config2).then((data2) => {
      const fullData = {
        ...data2,
        isPositioned: true
      };
      if (isMountedRef.current && !deepEqual$1(dataRef.current, fullData)) {
        dataRef.current = fullData;
        reactDomExports.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef]);
  index$1(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data2) => ({
        ...data2,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = reactExports.useRef(false);
  index$1(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index$1(() => {
    if (reference && floating) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(reference, floating, update);
      } else {
        update();
      }
    }
  }, [reference, floating, update, whileElementsMountedRef]);
  const refs = reactExports.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = reactExports.useMemo(() => ({
    reference,
    floating
  }), [reference, floating]);
  return reactExports.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    reference: setReference,
    floating: setFloating
  }), [data, update, refs, elements, setReference, setFloating]);
}
const tooltipContainer = "_tooltipContainer_g6vht_4";
const hoverTooltip = "_hoverTooltip_g6vht_15";
const popup = "_popup_g6vht_18";
const contentBody = "_contentBody_g6vht_23";
const bodyBottom = "_bodyBottom_g6vht_36";
const unset = "_unset_g6vht_41";
const arrow$1 = "_arrow_g6vht_45";
const arrowInner = "_arrowInner_g6vht_74";
const tooltipContent$1 = "_tooltipContent_g6vht_81";
const closeIcon = "_closeIcon_g6vht_88";
const s$h = {
  tooltipContainer,
  hoverTooltip,
  popup,
  contentBody,
  bodyBottom,
  unset,
  arrow: arrow$1,
  "arrow-top": "_arrow-top_g6vht_58",
  "arrow-bottom": "_arrow-bottom_g6vht_62",
  "arrow-left": "_arrow-left_g6vht_66",
  "arrow-right": "_arrow-right_g6vht_70",
  arrowInner,
  tooltipContent: tooltipContent$1,
  closeIcon
};
function mapPlacement(deprecadedPlacement) {
  switch (deprecadedPlacement) {
    case "top-left":
      return "top-start";
    case "top-right":
      return "top-end";
    case "bottom-left":
      return "bottom-start";
    case "bottom-right":
      return "bottom-end";
  }
}
function calculatePlacement(deprecadedPlacement, placement, position) {
  if (deprecadedPlacement && placement)
    console.error("You should not use both placement and deprecadedPlacement props at the same time. Placement prop will be used.");
  if (placement)
    return placement;
  if (position) {
    if (typeof deprecadedPlacement === "function") {
      return mapPlacement(deprecadedPlacement(position));
    } else if (deprecadedPlacement)
      return mapPlacement(deprecadedPlacement);
  }
  return;
}
const defaultPlacement = "top";
function Tooltip({ children, position, triggerRef, transitionRef, placement: placementProp, getPlacement, classes, hoverBehavior = false, onOuterClick, onClose, open = true, offset: offsetValue = 7 }) {
  const onClickOuter = reactExports.useCallback((e) => {
    if (onOuterClick && hoverBehavior === true) {
      return;
    }
    if (onOuterClick) {
      onOuterClick(e);
      return;
    }
    onClose == null ? void 0 : onClose(e);
  }, [hoverBehavior, onOuterClick, onClose]);
  const arrowRef = reactExports.useRef(null);
  const placement = reactExports.useMemo(() => calculatePlacement(getPlacement, placementProp, position) || defaultPlacement, [getPlacement, placementProp, position]);
  const { refs, x: floatingX, y: floatingY, strategy, middlewareData: { arrow: { x: arrowX2, y: arrowY2 } = {} }, placement: finalPlacement } = useFloating$1({
    placement,
    open,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetValue), flip(), shift({ padding: 5 }), arrow$2({ element: arrowRef })]
  });
  const positionVariables = reactExports.useMemo(() => ({
    "--tooltip-arrox-x-position": arrowX2 != null ? `${arrowX2}px` : "",
    "--tooltip-arrow-y-position": arrowY2 != null ? `${arrowY2}px` : "",
    "--tooltip-x-position": `${floatingX ?? 0}px`,
    "--tooltip-y-position": `${floatingY ?? 0}px`,
    "--tooltip-placement": strategy
  }), [arrowX2, arrowY2, floatingX, floatingY, strategy]);
  const arrowSide = reactExports.useMemo(() => {
    const side = finalPlacement.split("-")[0] || defaultPlacement;
    return `arrow-${side}`;
  }, [finalPlacement]);
  reactExports.useLayoutEffect(() => {
    if (triggerRef) {
      refs.setReference(triggerRef.current);
    } else if (position) {
      const { x: x2, y: y2 } = position;
      refs.setReference({
        getBoundingClientRect() {
          return { width: 0, height: 0, x: x2, y: y2, top: y2, left: x2, right: x2, bottom: y2 };
        }
      });
    }
  }, [position, refs, triggerRef]);
  if (position && triggerRef) {
    console.error("Both position and triggerRef are provided. Tooltip will be rendered with triggerRef");
  }
  if (!position && !triggerRef) {
    console.error("Tooltip will not be rendered because neither position nor triggerRef are provided");
    return null;
  }
  if (!open)
    return null;
  const onCloseProp = hoverBehavior ? void 0 : onClose;
  return jsxRuntimeExports.jsx("div", { ref: transitionRef, className: clsx(s$h.tooltipContainer, { [s$h.hoverTooltip]: hoverBehavior }), onClick: onClickOuter, style: positionVariables, children: jsxRuntimeExports.jsxs("div", { ref: refs.setFloating, className: s$h.tooltipContent, children: [jsxRuntimeExports.jsxs("div", { className: clsx(s$h.contentBody, clsx), children: [jsxRuntimeExports.jsxs("div", { children: [children, jsxRuntimeExports.jsx("div", { className: s$h.bodyBottom })] }), onCloseProp && jsxRuntimeExports.jsx("div", { className: s$h.closeIcon, onClick: onCloseProp, children: jsxRuntimeExports.jsx(Memo$22, {}) })] }), jsxRuntimeExports.jsx("div", { ref: arrowRef, className: clsx(s$h.arrow, s$h[arrowSide]), children: jsxRuntimeExports.jsx("div", { className: s$h.arrowInner }) })] }) });
}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var isInert = function isInert2(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && isInert2(node.parentNode);
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a2, b2) {
  return a2.tabIndex === b2.tabIndex ? a2.documentOrder - b2.documentOrder : a2.tabIndex - b2.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r2 = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r2;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i2 = 0; i2 < nodes.length; i2++) {
    if (nodes[i2].checked && nodes[i2].form === form) {
      return nodes[i2];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i2 = 0; i2 < parentNode.children.length; i2++) {
          var child = parentNode.children.item(i2);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i2) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i2,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container2, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container2], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container2, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
function _extends$3() {
  _extends$3 = Object.assign || function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}
var index = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
let serverHandoffComplete = false;
let count = 0;
const genId = () => "floating-ui-" + count++;
function useFloatingId() {
  const [id, setId] = reactExports.useState(() => serverHandoffComplete ? genId() : void 0);
  index(() => {
    if (id == null) {
      setId(genId());
    }
  }, []);
  reactExports.useEffect(() => {
    if (!serverHandoffComplete) {
      serverHandoffComplete = true;
    }
  }, []);
  return id;
}
const useReactId = React$1[/* @__PURE__ */ "useId".toString()];
const useId = useReactId || useFloatingId;
const FloatingArrow = /* @__PURE__ */ reactExports.forwardRef(function FloatingArrow2(_ref, ref) {
  var _rest$style;
  let {
    context: {
      placement,
      elements: {
        floating
      },
      middlewareData: {
        arrow: arrow2
      }
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d: d2,
    ...rest
  } = _ref;
  strokeWidth *= 2;
  const halfStrokeWidth = strokeWidth / 2;
  const svgX = width / 2 * (tipRadius / -8 + 1);
  const svgY = height / 2 * tipRadius / 4;
  const [side, alignment] = placement.split("-");
  const isRTL2 = floating ? platform.isRTL(floating) : false;
  const isCustomShape = !!d2;
  const isVerticalSide = side === "top" || side === "bottom";
  const yOffsetProp = staticOffset && alignment === "end" ? "bottom" : "top";
  let xOffsetProp = staticOffset && alignment === "end" ? "right" : "left";
  if (staticOffset && isRTL2) {
    xOffsetProp = alignment === "end" ? "left" : "right";
  }
  const arrowOffsetY = isCustomShape ? 0 : halfStrokeWidth;
  const arrowX2 = (arrow2 == null ? void 0 : arrow2.x) != null ? staticOffset || arrow2.x : "";
  const arrowY2 = (arrow2 == null ? void 0 : arrow2.y) != null ? staticOffset || arrow2.y + arrowOffsetY : "";
  const dValue = d2 || "M0,0" + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + " Z";
  const rotation = {
    top: isCustomShape ? "rotate(180deg)" : "",
    left: isCustomShape ? "rotate(90deg)" : "rotate(-90deg)",
    bottom: isCustomShape ? "" : "rotate(180deg)",
    right: isCustomShape ? "rotate(-90deg)" : "rotate(90deg)"
  }[side];
  const clipPathId = useId();
  return /* @__PURE__ */ reactExports.createElement("svg", _extends$3({}, rest, {
    // @ts-ignore
    suppressHydrationWarning: true,
    "aria-hidden": true,
    ref,
    width: isCustomShape ? width : width + strokeWidth,
    height: width,
    viewBox: "0 0 " + width + " " + (height > width ? height : width),
    style: {
      ...rest.style,
      position: "absolute",
      pointerEvents: "none",
      [xOffsetProp]: arrowX2,
      [yOffsetProp]: arrowY2,
      [side]: isVerticalSide || isCustomShape ? "100%" : "calc(100% - " + strokeWidth / 2 + "px)",
      transform: "" + rotation + ((_rest$style = rest.style) != null && _rest$style.transform ? " " + rest.style.transform : "")
    }
  }), strokeWidth > 0 && /* @__PURE__ */ reactExports.createElement("path", {
    clipPath: "url(#" + clipPathId + ")",
    fill: "none",
    stroke,
    strokeWidth: strokeWidth + (d2 ? 0 : 1),
    d: dValue
  }), /* @__PURE__ */ reactExports.createElement("path", {
    stroke: strokeWidth && !d2 ? rest.fill : "none",
    d: dValue
  }), /* @__PURE__ */ reactExports.createElement("clipPath", {
    id: clipPathId
  }, /* @__PURE__ */ reactExports.createElement("rect", {
    x: -halfStrokeWidth,
    y: halfStrokeWidth * (isCustomShape ? -1 : 1),
    width: width + strokeWidth,
    height: width
  })));
});
function createPubSub() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event, data) {
      var _map$get;
      (_map$get = map.get(event)) == null ? void 0 : _map$get.forEach((handler) => handler(data));
    },
    on(event, listener) {
      map.set(event, [...map.get(event) || [], listener]);
    },
    off(event, listener) {
      map.set(event, (map.get(event) || []).filter((l2) => l2 !== listener));
    }
  };
}
const FloatingNodeContext = /* @__PURE__ */ reactExports.createContext(null);
const FloatingTreeContext = /* @__PURE__ */ reactExports.createContext(null);
const useFloatingParentNodeId = () => {
  var _React$useContext;
  return ((_React$useContext = reactExports.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
};
const useFloatingTree = () => reactExports.useContext(FloatingTreeContext);
function getDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}
function getWindow(value2) {
  return getDocument(value2).defaultView || window;
}
function isElement(value2) {
  return value2 ? value2 instanceof getWindow(value2).Element : false;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isSafari() {
  return /apple/i.test(navigator.vendor);
}
function isMouseLikePointerType(pointerType, strict) {
  const values = ["mouse", "pen"];
  {
    values.push("", void 0);
  }
  return values.includes(pointerType);
}
function useLatestRef(value2) {
  const ref = reactExports.useRef(value2);
  index(() => {
    ref.current = value2;
  });
  return ref;
}
const safePolygonIdentifier = "data-floating-ui-safe-polygon";
function getDelay(value2, prop, pointerType) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value2 === "number") {
    return value2;
  }
  return value2 == null ? void 0 : value2[prop];
}
const useHover = function(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements: {
      domReference,
      floating
    },
    refs
  } = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true
  } = props;
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const pointerTypeRef = reactExports.useRef();
  const timeoutRef = reactExports.useRef();
  const handlerRef = reactExports.useRef();
  const restTimeoutRef = reactExports.useRef();
  const blockMouseMoveRef = reactExports.useRef(true);
  const performedPointerEventsMutationRef = reactExports.useRef(false);
  const unbindMouseMoveRef = reactExports.useRef(() => {
  });
  const isHoverOpen = reactExports.useCallback(() => {
    var _dataRef$current$open;
    const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
    return (type == null ? void 0 : type.includes("mouse")) && type !== "mousedown";
  }, [dataRef]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return;
    }
    function onDismiss() {
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      blockMouseMoveRef.current = true;
    }
    events.on("dismiss", onDismiss);
    return () => {
      events.off("dismiss", onDismiss);
    };
  }, [enabled, events]);
  reactExports.useEffect(() => {
    if (!enabled || !handleCloseRef.current || !open) {
      return;
    }
    function onLeave() {
      if (isHoverOpen()) {
        onOpenChange(false);
      }
    }
    const html = getDocument(floating).documentElement;
    html.addEventListener("mouseleave", onLeave);
    return () => {
      html.removeEventListener("mouseleave", onLeave);
    };
  }, [floating, open, onOpenChange, enabled, handleCloseRef, dataRef, isHoverOpen]);
  const closeWithDelay = reactExports.useCallback(function(runElseBranch) {
    if (runElseBranch === void 0) {
      runElseBranch = true;
    }
    const closeDelay = getDelay(delayRef.current, "close", pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onOpenChange(false), closeDelay);
    } else if (runElseBranch) {
      clearTimeout(timeoutRef.current);
      onOpenChange(false);
    }
  }, [delayRef, onOpenChange]);
  const cleanupMouseMoveHandler = reactExports.useCallback(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = void 0;
  }, []);
  const clearPointerEvents = reactExports.useCallback(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(refs.floating.current).body;
      body.style.pointerEvents = "";
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  }, [refs]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return;
    }
    function isClickLikeOpenEvent() {
      return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
    }
    function onMouseEnter(event) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;
      if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && getDelay(delayRef.current, "open") === 0) {
        return;
      }
      dataRef.current.openEvent = event;
      const openDelay = getDelay(delayRef.current, "open", pointerTypeRef.current);
      if (openDelay) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange(true);
        }, openDelay);
      } else {
        onOpenChange(true);
      }
    }
    function onMouseLeave(event) {
      if (isClickLikeOpenEvent()) {
        return;
      }
      unbindMouseMoveRef.current();
      const doc = getDocument(floating);
      clearTimeout(restTimeoutRef.current);
      if (handleCloseRef.current) {
        if (!open) {
          clearTimeout(timeoutRef.current);
        }
        handlerRef.current = handleCloseRef.current({
          ...context,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            closeWithDelay();
          }
        });
        const handler = handlerRef.current;
        doc.addEventListener("mousemove", handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener("mousemove", handler);
        };
        return;
      }
      closeWithDelay();
    }
    function onScrollMouseLeave(event) {
      if (isClickLikeOpenEvent()) {
        return;
      }
      handleCloseRef.current == null ? void 0 : handleCloseRef.current({
        ...context,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          closeWithDelay();
        }
      })(event);
    }
    if (isElement(domReference)) {
      const ref = domReference;
      open && ref.addEventListener("mouseleave", onScrollMouseLeave);
      floating == null ? void 0 : floating.addEventListener("mouseleave", onScrollMouseLeave);
      move && ref.addEventListener("mousemove", onMouseEnter, {
        once: true
      });
      ref.addEventListener("mouseenter", onMouseEnter);
      ref.addEventListener("mouseleave", onMouseLeave);
      return () => {
        open && ref.removeEventListener("mouseleave", onScrollMouseLeave);
        floating == null ? void 0 : floating.removeEventListener("mouseleave", onScrollMouseLeave);
        move && ref.removeEventListener("mousemove", onMouseEnter);
        ref.removeEventListener("mouseenter", onMouseEnter);
        ref.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [domReference, floating, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, tree, delayRef, handleCloseRef, dataRef]);
  index(() => {
    var _handleCloseRef$curre;
    if (!enabled) {
      return;
    }
    if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
      const body = getDocument(floating).body;
      body.setAttribute(safePolygonIdentifier, "");
      body.style.pointerEvents = "none";
      performedPointerEventsMutationRef.current = true;
      if (isElement(domReference) && floating) {
        var _tree$nodesRef$curren, _tree$nodesRef$curren2;
        const ref = domReference;
        const parentFloating = tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find((node) => node.id === parentId)) == null ? void 0 : (_tree$nodesRef$curren2 = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren2.elements.floating;
        if (parentFloating) {
          parentFloating.style.pointerEvents = "";
        }
        ref.style.pointerEvents = "auto";
        floating.style.pointerEvents = "auto";
        return () => {
          ref.style.pointerEvents = "";
          floating.style.pointerEvents = "";
        };
      }
    }
  }, [enabled, open, parentId, floating, domReference, tree, handleCloseRef, dataRef, isHoverOpen]);
  index(() => {
    if (!open) {
      pointerTypeRef.current = void 0;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
  reactExports.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [enabled, cleanupMouseMoveHandler, clearPointerEvents]);
  return reactExports.useMemo(() => {
    if (!enabled) {
      return {};
    }
    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }
    return {
      reference: {
        onPointerDown: setPointerRef,
        onPointerEnter: setPointerRef,
        onMouseMove() {
          if (open || restMs === 0) {
            return;
          }
          clearTimeout(restTimeoutRef.current);
          restTimeoutRef.current = setTimeout(() => {
            if (!blockMouseMoveRef.current) {
              onOpenChange(true);
            }
          }, restMs);
        }
      },
      floating: {
        onMouseEnter() {
          clearTimeout(timeoutRef.current);
        },
        onMouseLeave() {
          events.emit("dismiss", {
            type: "mouseLeave",
            data: {
              returnFocus: false
            }
          });
          closeWithDelay(false);
        }
      }
    };
  }, [events, enabled, restMs, open, onOpenChange, closeWithDelay]);
};
function activeElement(doc) {
  let activeElement2 = doc.activeElement;
  while (((_activeElement = activeElement2) == null ? void 0 : (_activeElement$shadow = _activeElement.shadowRoot) == null ? void 0 : _activeElement$shadow.activeElement) != null) {
    var _activeElement, _activeElement$shadow;
    activeElement2 = activeElement2.shadowRoot.activeElement;
  }
  return activeElement2;
}
function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      if (next && parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function getTabbableIn(container2, direction) {
  const allTabbable = tabbable(container2, getTabbableOptions());
  if (direction === "prev") {
    allTabbable.reverse();
  }
  const activeIndex = allTabbable.indexOf(activeElement(getDocument(container2)));
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getNextTabbable() {
  return getTabbableIn(document.body, "next");
}
function getPreviousTabbable() {
  return getTabbableIn(document.body, "prev");
}
function isOutsideEvent(event, container2) {
  const containerElement = container2 || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}
function disableFocusInside(container2) {
  const tabbableElements = tabbable(container2, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute("tabindex") || "";
    element.setAttribute("tabindex", "-1");
  });
}
function enableFocusInside(container2) {
  const elements = container2.querySelectorAll("[data-tabindex]");
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute("tabindex", tabindex);
    } else {
      element.removeAttribute("tabindex");
    }
  });
}
const HIDDEN_STYLES = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "fixed",
  whiteSpace: "nowrap",
  width: "1px",
  top: 0,
  left: 0
};
let timeoutId;
function setActiveElementOnTab(event) {
  if (event.key === "Tab") {
    event.target;
    clearTimeout(timeoutId);
  }
}
const FocusGuard = /* @__PURE__ */ reactExports.forwardRef(function FocusGuard2(props, ref) {
  const [role, setRole] = reactExports.useState();
  index(() => {
    if (isSafari()) {
      setRole("button");
    }
    document.addEventListener("keydown", setActiveElementOnTab);
    return () => {
      document.removeEventListener("keydown", setActiveElementOnTab);
    };
  }, []);
  return /* @__PURE__ */ reactExports.createElement("span", _extends$3({}, props, {
    ref,
    tabIndex: 0,
    role,
    "aria-hidden": role ? void 0 : true,
    "data-floating-ui-focus-guard": "",
    style: HIDDEN_STYLES
  }));
});
const PortalContext = /* @__PURE__ */ reactExports.createContext(null);
const useFloatingPortalNode = function(_temp) {
  let {
    id,
    enabled = true
  } = _temp === void 0 ? {} : _temp;
  const [portalEl, setPortalEl] = reactExports.useState(null);
  const uniqueId = useId();
  const portalContext = usePortalContext();
  index(() => {
    if (!enabled) {
      return;
    }
    const rootNode = id ? document.getElementById(id) : null;
    if (rootNode) {
      rootNode.setAttribute("data-floating-ui-portal", "");
      setPortalEl(rootNode);
    } else {
      const newPortalEl = document.createElement("div");
      if (id !== "") {
        newPortalEl.id = id || uniqueId;
      }
      newPortalEl.setAttribute("data-floating-ui-portal", "");
      setPortalEl(newPortalEl);
      const container2 = (portalContext == null ? void 0 : portalContext.portalNode) || document.body;
      container2.appendChild(newPortalEl);
      return () => {
        container2.removeChild(newPortalEl);
      };
    }
  }, [id, portalContext, uniqueId, enabled]);
  return portalEl;
};
const FloatingPortal = (_ref) => {
  let {
    children,
    id,
    root = null,
    preserveTabOrder = true
  } = _ref;
  const portalNode = useFloatingPortalNode({
    id,
    enabled: !root
  });
  const [focusManagerState, setFocusManagerState] = reactExports.useState(null);
  const beforeOutsideRef = reactExports.useRef(null);
  const afterOutsideRef = reactExports.useRef(null);
  const beforeInsideRef = reactExports.useRef(null);
  const afterInsideRef = reactExports.useRef(null);
  const shouldRenderGuards = (
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!focusManagerState && // Guards are only for non-modal focus management.
    !focusManagerState.modal && !!(root || portalNode) && preserveTabOrder
  );
  reactExports.useEffect(() => {
    if (!portalNode || !preserveTabOrder || focusManagerState != null && focusManagerState.modal) {
      return;
    }
    function onFocus(event) {
      if (portalNode && isOutsideEvent(event)) {
        const focusing = event.type === "focusin";
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    portalNode.addEventListener("focusin", onFocus, true);
    portalNode.addEventListener("focusout", onFocus, true);
    return () => {
      portalNode.removeEventListener("focusin", onFocus, true);
      portalNode.removeEventListener("focusout", onFocus, true);
    };
  }, [portalNode, preserveTabOrder, focusManagerState == null ? void 0 : focusManagerState.modal]);
  return /* @__PURE__ */ reactExports.createElement(PortalContext.Provider, {
    value: reactExports.useMemo(() => ({
      preserveTabOrder,
      beforeOutsideRef,
      afterOutsideRef,
      beforeInsideRef,
      afterInsideRef,
      portalNode,
      setFocusManagerState
    }), [preserveTabOrder, portalNode])
  }, shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement(FocusGuard, {
    "data-type": "outside",
    ref: beforeOutsideRef,
    onFocus: (event) => {
      if (isOutsideEvent(event, portalNode)) {
        var _beforeInsideRef$curr;
        (_beforeInsideRef$curr = beforeInsideRef.current) == null ? void 0 : _beforeInsideRef$curr.focus();
      } else {
        const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        prevTabbable == null ? void 0 : prevTabbable.focus();
      }
    }
  }), shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement("span", {
    "aria-owns": portalNode.id,
    style: HIDDEN_STYLES
  }), root ? /* @__PURE__ */ reactDomExports.createPortal(children, root) : portalNode ? /* @__PURE__ */ reactDomExports.createPortal(children, portalNode) : null, shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement(FocusGuard, {
    "data-type": "outside",
    ref: afterOutsideRef,
    onFocus: (event) => {
      if (isOutsideEvent(event, portalNode)) {
        var _afterInsideRef$curre;
        (_afterInsideRef$curre = afterInsideRef.current) == null ? void 0 : _afterInsideRef$curre.focus();
      } else {
        const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        nextTabbable == null ? void 0 : nextTabbable.focus();
        (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false));
      }
    }
  }));
};
const usePortalContext = () => reactExports.useContext(PortalContext);
const useInsertionEffect = React$1[/* @__PURE__ */ "useInsertionEffect".toString()];
const useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());
function useEvent(callback) {
  const ref = reactExports.useRef(() => {
  });
  useSafeInsertionEffect(() => {
    ref.current = callback;
  });
  return reactExports.useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current == null ? void 0 : ref.current(...args);
  }, []);
}
function useMergeRefs(refs) {
  return reactExports.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (value2) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value2);
        } else if (ref != null) {
          ref.current = value2;
        }
      });
    };
  }, refs);
}
const useRole = function(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    floatingId
  } = context;
  const {
    enabled = true,
    role = "dialog"
  } = props;
  const referenceId = useId();
  return reactExports.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      role
    };
    if (!enabled) {
      return {};
    }
    if (role === "tooltip") {
      return {
        reference: {
          "aria-describedby": open ? floatingId : void 0
        },
        floating: floatingProps
      };
    }
    return {
      reference: {
        "aria-expanded": open ? "true" : "false",
        "aria-haspopup": role === "alertdialog" ? "dialog" : role,
        "aria-controls": open ? floatingId : void 0,
        ...role === "listbox" && {
          role: "combobox"
        },
        ...role === "menu" && {
          id: referenceId
        }
      },
      floating: {
        ...floatingProps,
        ...role === "menu" && {
          "aria-labelledby": referenceId
        }
      }
    };
  }, [enabled, role, open, floatingId, referenceId]);
};
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    open = false,
    onOpenChange: unstable_onOpenChange,
    nodeId
  } = options;
  const position = useFloating$1(options);
  const tree = useFloatingTree();
  const domReferenceRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef({});
  const events = reactExports.useState(() => createPubSub())[0];
  const floatingId = useId();
  const [domReference, setDomReference] = reactExports.useState(null);
  const setPositionReference = reactExports.useCallback((node) => {
    const positionReference = isElement(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      contextElement: node
    } : node;
    position.refs.setReference(positionReference);
  }, [position.refs]);
  const setReference = reactExports.useCallback((node) => {
    if (isElement(node) || node === null) {
      domReferenceRef.current = node;
      setDomReference(node);
    }
    if (isElement(position.refs.reference.current) || position.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !isElement(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs]);
  const refs = reactExports.useMemo(() => ({
    ...position.refs,
    setReference,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setPositionReference]);
  const elements = reactExports.useMemo(() => ({
    ...position.elements,
    domReference
  }), [position.elements, domReference]);
  const onOpenChange = useEvent(unstable_onOpenChange);
  const context = reactExports.useMemo(() => ({
    ...position,
    refs,
    elements,
    dataRef,
    nodeId,
    floatingId,
    events,
    open,
    onOpenChange
  }), [position, nodeId, floatingId, events, open, onOpenChange, refs, elements]);
  index(() => {
    const node = tree == null ? void 0 : tree.nodesRef.current.find((node2) => node2.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return reactExports.useMemo(() => ({
    ...position,
    context,
    refs,
    elements,
    reference: setReference,
    positionReference: setPositionReference
  }), [position, refs, elements, context, setReference, setPositionReference]);
}
function mergeProps(userProps, propsList, elementKey) {
  const map = /* @__PURE__ */ new Map();
  return {
    ...elementKey === "floating" && {
      tabIndex: -1
    },
    ...userProps,
    ...propsList.map((value2) => value2 ? value2[elementKey] : null).concat(userProps).reduce((acc, props) => {
      if (!props) {
        return acc;
      }
      Object.entries(props).forEach((_ref) => {
        let [key, value2] = _ref;
        if (key.indexOf("on") === 0) {
          if (!map.has(key)) {
            map.set(key, []);
          }
          if (typeof value2 === "function") {
            var _map$get;
            (_map$get = map.get(key)) == null ? void 0 : _map$get.push(value2);
            acc[key] = function() {
              var _map$get2;
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.forEach((fn) => fn(...args));
            };
          }
        } else {
          acc[key] = value2;
        }
      });
      return acc;
    }, {})
  };
}
const useInteractions = function(propsList) {
  if (propsList === void 0) {
    propsList = [];
  }
  const deps = propsList;
  const getReferenceProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  const getFloatingProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  const getItemProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "item"),
    // Granularly check for `item` changes, because the `getItemProps` getter
    // should be as referentially stable as possible since it may be passed as
    // a prop to many components. All `item` key values must therefore be
    // memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    propsList.map((key) => key == null ? void 0 : key.item)
  );
  return reactExports.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps
  }), [getReferenceProps, getFloatingProps, getItemProps]);
};
function createContext(rootName, defaultContext) {
  const Ctx = React.createContext(defaultContext);
  function Provider(props) {
    const { children, ...context } = props;
    const value2 = React.useMemo(() => context, Object.values(context));
    return jsxRuntimeExports.jsx(Ctx.Provider, { value: value2, children });
  }
  function useContext(childName) {
    const context = React.useContext(Ctx);
    if (context) {
      return context;
    }
    throw Error(`${childName} must be rendered inside of a ${rootName} component.`);
  }
  Ctx.displayName = `${rootName}Context`;
  Provider.displayName = `${rootName}Provider`;
  return [Provider, useContext];
}
const [TooltipProvider, useTooltipContext] = createContext("Tooltip");
const TooltipTrigger = reactExports.forwardRef(function TooltipTrigger2({ children, asChild = false, ...props }, propRef) {
  const { context } = useTooltipContext("Tooltip");
  const childrenRef = (children == null ? void 0 : children.ref) ?? null;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
  reactExports.useLayoutEffect(() => {
    if (propRef) {
      context.refs.setReference(propRef == null ? void 0 : propRef.current);
    }
  }, []);
  if (propRef)
    return null;
  if (asChild && reactExports.isValidElement(children)) {
    return reactExports.cloneElement(children, context.getReferenceProps({
      ref,
      ...props,
      ...children.props
    }));
  }
  return jsxRuntimeExports.jsx("div", { ref, ...context.getReferenceProps(props), children });
});
const tooltipContent = "_tooltipContent_17m80_3";
const bigger = "_bigger_17m80_14";
const arrow = "_arrow_17m80_26";
const s$g = {
  tooltipContent,
  bigger,
  "default": "_default_17m80_20",
  arrow
};
const TooltipContent = reactExports.forwardRef(function TooltipContent2(props, propRef) {
  const { context, arrowRef, size } = useTooltipContext("Tooltip");
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const { children, ...rest } = props;
  return jsxRuntimeExports.jsx(FloatingPortal, { children: context.open && jsxRuntimeExports.jsxs("div", { className: clsx(s$g.tooltipContent, s$g[size ?? "default"]), ref, style: {
    position: context.strategy,
    top: context.y ?? 0,
    left: context.x ?? 0,
    visibility: context.x == null ? "hidden" : "visible"
  }, ...context.getFloatingProps(rest), children: [children, jsxRuntimeExports.jsx(FloatingArrow, { ref: arrowRef, context: context.context, className: s$g.arrow, stroke: "transparent", strokeWidth: 2, height: 8, width: 16 })] }) });
});
const ARROW_HEIGHT = 8;
function useTooltip({ initialOpen = false, placement = "bottom", offset: offsetValue = 0, open: controlledOpen, onOpenChange: setControlledOpen } = {}, arrowRef) {
  const [uncontrolledOpen, setUncontrolledOpen] = reactExports.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue + ARROW_HEIGHT),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 5 }),
      arrow$2({ element: arrowRef })
    ]
  });
  const context = data.context;
  const hover = useHover(context);
  const role = useRole(context, { role: "tooltip" });
  const interactions = useInteractions([hover, role]);
  return reactExports.useMemo(() => ({
    open,
    setOpen,
    ...interactions,
    ...data
  }), [open, setOpen, interactions, data]);
}
function SimpleTooltip({ children, content, ...options }) {
  const arrowRef = reactExports.useRef(null);
  const context = useTooltip(options, arrowRef);
  return jsxRuntimeExports.jsxs(TooltipProvider, { context, arrowRef, size: options.size, children: [jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children }), context.open && jsxRuntimeExports.jsx(TooltipContent, { children: content })] });
}
const legendTitle = "_legendTitle_sgaz8_1";
const grid$1 = "_grid_sgaz8_6";
const cell = "_cell_sgaz8_11";
const colorCell = "_colorCell_sgaz8_17";
const yStepsCell = "_yStepsCell_sgaz8_26";
const xStepsCell = "_xStepsCell_sgaz8_45";
const xStepsCellNoLabel = "_xStepsCellNoLabel_sgaz8_46";
const arrowX = "_arrowX_sgaz8_70";
const arrowY = "_arrowY_sgaz8_71";
const axisLabelX = "_axisLabelX_sgaz8_88";
const axisLabelY = "_axisLabelY_sgaz8_89";
const arrowHeadX = "_arrowHeadX_sgaz8_107";
const arrowHeadY = "_arrowHeadY_sgaz8_108";
const arrowHeadY_angle0 = "_arrowHeadY_angle0_sgaz8_123";
const styles$1 = {
  legendTitle,
  grid: grid$1,
  cell,
  colorCell,
  yStepsCell,
  xStepsCell,
  xStepsCellNoLabel,
  arrowX,
  arrowY,
  axisLabelX,
  axisLabelY,
  arrowHeadX,
  arrowHeadY,
  arrowHeadY_angle0
};
function createTreads() {
  const treads = {};
  return {
    increment: (treadId) => {
      if (typeof treads[treadId] === "number") {
        treads[treadId] += 1;
      } else {
        treads[treadId] = 0;
      }
      return treads[treadId];
    }
  };
}
function fillTemplate(template, data) {
  const order2 = [];
  const treads = createTreads();
  template.forEach((row2, y2) => {
    row2.split(" ").forEach((cell2, x2) => {
      const position = treads.increment(cell2);
      const dataCell = data[cell2] && data[cell2][position];
      if (dataCell) {
        order2.push({ ...dataCell, _position: { x: x2, y: y2 } });
      }
    });
  });
  return order2;
}
function safeReverse(arr) {
  return [...arr].reverse();
}
const getCellPositionStyle = (col, row2) => ({
  gridColumn: `${col + 1} / ${col + 2}`,
  gridRow: `${row2 + 1} / ${row2 + 2}`
});
const ArrowHead = ({ className, type }) => jsxRuntimeExports.jsx("div", { className, children: type === "horizontal" ? jsxRuntimeExports.jsx("svg", { width: "6", height: "12", viewBox: "0 0 6 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsxRuntimeExports.jsx("path", { d: "M6,6L0,0l0,2.4L3.6,6L0,9.6L0,12L6,6z", fill: "currentColor" }) }) : jsxRuntimeExports.jsx("svg", { width: "12", height: "6", viewBox: "0 0 12 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsxRuntimeExports.jsx("path", { d: "M6,0L0,6l2.4,0L6,2.4L9.6,6L12,6L6,0z", fill: "currentColor" }) }) });
function Legend({ cells: cells2, size, axis: axis2, title: title2, showAxisLabels = false, showSteps = true, showArrowHeads = true, onCellPointerOver, onCellPointerLeave, renderXAxisLabel, renderYAxisLabel }) {
  const TEMPLATE = reactExports.useMemo(() => [
    `y ${new Array(size + 1).fill(".").join(" ")}`,
    ...new Array(size).fill(`y ${new Array(size).fill("c").join(" ")} .`),
    `. ${new Array(size + 1).fill("x").join(" ")}`
  ], [size]);
  const gridCells = fillTemplate(TEMPLATE, {
    x: showSteps ? axis2.x.steps.map((step) => ({
      label: step.label || step.value.toFixed(1),
      className: styles$1.xStepsCell
    })) : axis2.x.steps.map((step) => ({
      label: "",
      className: styles$1.xStepsCellNoLabel
    })),
    y: showSteps ? safeReverse(axis2.y.steps).map((step) => ({
      label: step.label || step.value.toFixed(1),
      className: styles$1.yStepsCell
    })) : safeReverse(axis2.y.steps).map((step) => ({
      label: "",
      className: styles$1.yStepsCellNoLabel
    })),
    c: cells2.map((cell2, i2) => ({
      label: jsxRuntimeExports.jsx("span", { children: cell2.label }),
      className: clsx(styles$1.cell, styles$1.colorCell),
      style: { backgroundColor: cell2.color },
      ...onCellPointerOver && { onPointerOver: (e) => onCellPointerOver(e, cell2, i2) },
      ...onCellPointerLeave && { onPointerLeave: (e) => onCellPointerLeave(e, cell2, i2) }
    }))
  });
  const xAxisLabel = () => renderXAxisLabel ? renderXAxisLabel(axis2.x, styles$1.axisLabelX) : jsxRuntimeExports.jsx("div", { className: styles$1.axisLabelX, children: axis2.x.label });
  const yAxisLabel = () => renderYAxisLabel ? renderYAxisLabel(axis2.y, styles$1.axisLabelY) : jsxRuntimeExports.jsx("div", { className: styles$1.axisLabelY, children: axis2.y.label });
  return jsxRuntimeExports.jsxs("div", { children: [title2 && jsxRuntimeExports.jsx("div", { className: styles$1.legendTitle, children: title2 }), jsxRuntimeExports.jsxs("div", { className: styles$1.grid, style: {
    gridTemplateColumns: `repeat(${size + 2}, auto)`,
    gridTemplateRows: `repeat(${size + 2}, auto)`
  }, children: [showAxisLabels && axis2.x.label ? xAxisLabel() : null, showAxisLabels && axis2.y.label ? yAxisLabel() : null, jsxRuntimeExports.jsx("div", { className: styles$1.arrowX, children: showArrowHeads && jsxRuntimeExports.jsx(ArrowHead, { type: "horizontal", className: styles$1.arrowHeadX }) }), jsxRuntimeExports.jsx("div", { className: styles$1.arrowY, children: showArrowHeads && jsxRuntimeExports.jsx(ArrowHead, { type: "vertical", className: clsx({ [styles$1.arrowHeadY]: true, [styles$1.arrowHeadY_angle0]: !showAxisLabels }) }) }), gridCells.map((cell2) => jsxRuntimeExports.jsx("div", { style: Object.assign(getCellPositionStyle(cell2._position.x, cell2._position.y), cell2.style), className: clsx(cell2.className, styles$1.cell), onPointerOver: cell2.onPointerOver, onPointerLeave: cell2.onPointerLeave, children: cell2.label }, `${cell2._position.x}|${cell2._position.y}`))] })] });
}
function _objectWithoutPropertiesLoose(r2, e) {
  if (null == r2) return {};
  var t2 = {};
  for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
    if (e.includes(n2)) continue;
    t2[n2] = r2[n2];
  }
  return t2;
}
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends$2.apply(null, arguments);
}
function _setPrototypeOf(t2, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e2) {
    return t3.__proto__ = e2, t3;
  }, _setPrototypeOf(t2, e);
}
function _inheritsLoose(t2, o2) {
  t2.prototype = Object.create(o2.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o2);
}
const NAVIGATE_EVENT = "KNT_NAVIGATE_TO";
const goTo = (slug) => {
  const evt = new CustomEvent(NAVIGATE_EVENT, { detail: { payload: slug } });
  globalThis.dispatchEvent(evt);
};
const impossibleValue = Symbol(), callSafely = function(fn) {
  try {
    return fn(...[].slice.call(arguments, 1));
  } catch (err) {
    return setTimeout(() => {
      throw err;
    }), err instanceof Error ? err : err = new Error(err);
  }
};
function throwReatomError(condition, message) {
  if (condition) throw new Error(`Reatom error: ${message}`);
}
const isAtom$1 = (thing) => void 0 !== (thing == null ? void 0 : thing.__reatom), isConnected$1 = (cache) => cache.subs.size + cache.listeners.size > 0;
function assertFunction(thing) {
  throwReatomError("function" != typeof thing, `invalid "${typeof thing}", function expected`);
}
const getRootCause$2 = (cause) => null === cause.cause ? cause : getRootCause$2(cause.cause), isBrowser = () => {
  var _a;
  return !!((_a = globalThis.navigator) == null ? void 0 : _a.userAgent);
};
let CTX, initiations = 0;
const createCtx = ({ callLateEffect = callSafely, callNearEffect = callSafely, restrictMultipleContexts = isBrowser() } = {}) => {
  restrictMultipleContexts && 1 == initiations++ && console.warn("Reatom: multiple contexts detected, which is irrelevant in browser, you should use only one context");
  let caches = /* @__PURE__ */ new WeakMap(), read = (proto) => caches.get(proto), logsListeners = /* @__PURE__ */ new Set(), nearEffects = [], lateEffects = [], inTr = false, trError = null, trUpdates = [], trRollbacks = [], trLogs = [], trNearEffectsStart = 0, trLateEffectsStart = 0, effectsProcessing = false, walkNearEffects = () => {
    for (let effect of nearEffects) callNearEffect(effect, ctx);
    nearEffects = [];
  }, walkLateEffects = () => {
    if (!effectsProcessing) {
      effectsProcessing = true, walkNearEffects();
      for (let effect of lateEffects) callLateEffect(effect, ctx), nearEffects.length > 0 && walkNearEffects();
      lateEffects = [], effectsProcessing = false;
    }
  }, addPatch = ({ state, proto, pubs, subs, listeners }, cause) => (proto.actual = false, trLogs.push(proto.patch = { state, proto, cause, pubs, subs, listeners }), proto.patch), enqueueComputers = (cache) => {
    for (let subProto of cache.subs) {
      let subCache = subProto.patch ?? read(subProto);
      subProto.patch && !subProto.actual || 0 === addPatch(subCache, cache).listeners.size && enqueueComputers(subCache);
    }
  }, disconnect = (proto, pubPatch) => {
    if (pubPatch.subs.delete(proto) && (trRollbacks.push(() => pubPatch.subs.add(proto)), !isConnected$1(pubPatch))) {
      null !== pubPatch.proto.disconnectHooks && nearEffects.push(...pubPatch.proto.disconnectHooks);
      for (let parentParent of pubPatch.pubs) disconnect(pubPatch.proto, parentParent);
    }
  }, connect = (proto, pubPatch) => {
    if (!pubPatch.subs.has(proto)) {
      let wasConnected = isConnected$1(pubPatch);
      if (pubPatch.subs.add(proto), trRollbacks.push(() => pubPatch.subs.delete(proto)), !wasConnected) {
        null !== pubPatch.proto.connectHooks && nearEffects.push(...pubPatch.proto.connectHooks);
        for (let parentParentPatch of pubPatch.pubs) connect(pubPatch.proto, parentParentPatch);
      }
    }
  }, actualize = (ctx2, proto, updater) => {
    let { patch, actual } = proto, updating = void 0 !== updater;
    if (!updating && actual && (0 === patch.pubs.length || isConnected$1(patch))) return patch;
    let cache = patch ?? read(proto), isInt = !cache, cause = updating ? ctx2.cause : read(__root);
    if (isInt) cache = { state: proto.initState(ctx2), proto, cause, pubs: [], subs: /* @__PURE__ */ new Set(), listeners: /* @__PURE__ */ new Set() };
    else if (null === proto.computer && !updating) return cache;
    patch && !actual || (patch = addPatch(cache, cause));
    let { state } = patch, patchCtx = { get: ctx2.get, spy: void 0, schedule: ctx2.schedule, subscribe: ctx2.subscribe, cause: patch };
    try {
      proto.computer && ((patchCtx2, patch2) => {
        let { proto: proto2, pubs } = patch2, isDepsChanged = false;
        if (0 === pubs.length || pubs.some(({ proto: proto3, state: state2 }) => !Object.is(state2, (patch2.cause = actualize(patchCtx2, proto3)).state))) {
          let newPubs = [];
          if (patchCtx2.spy = ({ __reatom: depProto }, cb) => {
            let depPatch = actualize(patchCtx2, depProto), prevDepPatch = newPubs.push(depPatch) <= pubs.length ? pubs[newPubs.length - 1] : void 0, isDepChanged = (prevDepPatch == null ? void 0 : prevDepPatch.proto) !== depPatch.proto;
            isDepsChanged || (isDepsChanged = isDepChanged);
            let state2 = depProto.isAction && !isDepChanged ? depPatch.state.slice(prevDepPatch.state.length) : depPatch.state;
            if (!cb || !isDepChanged && Object.is(state2, prevDepPatch.state)) return state2;
            if (depProto.isAction) for (const call of state2) cb(call);
            else cb(state2, isDepChanged ? void 0 : prevDepPatch == null ? void 0 : prevDepPatch.state);
          }, patch2.state = patch2.proto.computer(patchCtx2, patch2.state), patch2.pubs = newPubs, (isDepsChanged || pubs.length > newPubs.length) && isConnected$1(patch2)) {
            for (let { proto: depProto } of pubs) newPubs.every((dep) => dep.proto !== depProto) && disconnect(proto2, depProto.patch ?? read(depProto));
            for (let { proto: depProto } of newPubs) pubs.every((dep) => dep.proto !== depProto) && connect(proto2, depProto.patch ?? read(depProto));
          }
          patchCtx2.spy = () => throwReatomError(true, "async spy"), patch2 = proto2 = pubs = newPubs = null;
        }
      })(patchCtx, patch), updating && (patch.cause = ctx2.cause, updater(patchCtx, patch)), proto.actual = true;
    } catch (error2) {
      throw patch.error = error2;
    }
    if (!Object.is(state, patch.state) && (patch.subs.size > 0 && (updating || patch.listeners.size > 0) && enqueueComputers(patch), proto.updateHooks)) {
      let ctx3 = { get: patchCtx.get, spy: void 0, schedule: patchCtx.schedule, subscribe: patchCtx.subscribe, cause: patchCtx.cause };
      proto.updateHooks.forEach((hook) => trUpdates.push(() => hook(ctx3, patch)));
    }
    return patch;
  }, ctx = { get(atomOrCb) {
    if (throwReatomError(CTX && getRootCause$2(CTX.cause) !== read(__root), "cause collision"), isAtom$1(atomOrCb)) {
      let proto = atomOrCb.__reatom;
      if (inTr) return actualize(this, proto).state;
      let cache = read(proto);
      return void 0 === cache || null !== proto.computer && !isConnected$1(cache) ? this.get(() => actualize(this, proto).state) : cache.state;
    }
    if (throwReatomError(null !== trError, "tr failed"), inTr) return atomOrCb(read, actualize);
    inTr = true, trNearEffectsStart = nearEffects.length, trLateEffectsStart = lateEffects.length;
    let start = void 0 === CTX;
    start && (CTX = this);
    try {
      var result = atomOrCb(read, actualize);
      for (let i2 = 0; i2 < trLogs.length; i2++) {
        let { listeners, proto } = trLogs[i2];
        if (listeners.size > 0 && actualize(this, proto), trUpdates.length > 0) for (let commit of trUpdates.splice(0)) commit(this);
      }
      if (trLogs.length) for (let log of logsListeners) log(trLogs);
      for (let patch of trLogs) {
        let { proto, state } = patch;
        if (proto.isAction && (patch.state = []), patch === proto.patch) if (proto.patch = null, proto.actual = false, caches.set(proto, patch), proto.isAction) {
          if (0 === state.length) continue;
          for (let cb of patch.listeners) nearEffects.push(() => cb(state));
        } else for (let cb of patch.listeners) lateEffects.push(() => cb(read(proto).state));
      }
    } catch (e) {
      trError = e = e instanceof Error ? e : new Error(String(e));
      for (let log of logsListeners) log(trLogs, e);
      for (let cb of trRollbacks) callSafely(cb, e);
      for (let { proto } of trLogs) proto.patch = null, proto.actual = false;
      throw nearEffects.length = trNearEffectsStart, lateEffects.length = trLateEffectsStart, e;
    } finally {
      inTr = false, trError = null, trUpdates = [], trRollbacks = [], trLogs = [], trNearEffectsStart = 0, trLateEffectsStart = 0, start && (CTX = void 0);
    }
    return walkLateEffects(), result;
  }, spy: void 0, schedule(cb, step = 1) {
    return assertFunction(cb), throwReatomError(!this, "missed context"), new Promise((res, rej) => {
      -1 === step ? inTr && trRollbacks.push(cb) : 0 === step ? inTr && trUpdates.push(() => cb(this)) : ((1 === step ? nearEffects : lateEffects).push(() => {
        try {
          let result = cb(this);
          return result instanceof Promise ? result.then(res, rej) : res(result), result;
        } catch (error2) {
          throw rej(error2), error2;
        }
      }), inTr || walkLateEffects());
    });
  }, subscribe(atom2, cb = atom2) {
    if (assertFunction(cb), atom2 === cb) return logsListeners.add(cb), () => logsListeners.delete(cb);
    let { __reatom: proto } = atom2, lastState = impossibleValue, listener = (state) => Object.is(lastState, state) || cb(lastState = state), cache = read(proto);
    return void 0 !== cache && isConnected$1(cache) ? cache.listeners.add(listener) : this.get(() => {
      cache = actualize(this, proto, (patchCtx, patch) => {
      }), cache.listeners.add(listener), trRollbacks.push(() => proto.patch.listeners.delete(listener)), null !== proto.connectHooks && nearEffects.push(...proto.connectHooks);
      for (let pubPatch of cache.pubs) connect(proto, pubPatch);
    }), lastState === impossibleValue && listener((proto.patch ?? read(proto)).state), () => {
      if (cache.listeners.delete(listener) && !isConnected$1(cache)) {
        proto.disconnectHooks && nearEffects.push(...proto.disconnectHooks);
        for (let pubCache of cache.pubs) disconnect(proto, pubCache);
        inTr || (trRollbacks.length = 0, walkLateEffects());
      }
    };
  }, cause: void 0 };
  return (ctx.cause = ctx.get(() => actualize(ctx, __root))).cause = null, ctx;
};
let i = 0, __count = (name) => `${name}#${++i}`;
function pipe() {
  return [].slice.call(arguments).reduce((acc, fn) => fn(acc), this);
}
function onChange(cb) {
  var _a;
  const hook = (ctx, patch) => cb(ctx, patch.state);
  return ((_a = this.__reatom).updateHooks ?? (_a.updateHooks = /* @__PURE__ */ new Set())).add(hook), () => this.__reatom.updateHooks.delete(hook);
}
function onCall(cb) {
  return this.onChange((ctx, state) => {
    const { params, payload } = state[state.length - 1];
    cb(ctx, payload, params);
  });
}
function atom(initState, name = __count("_atom")) {
  let theAtom = (ctx, update) => ctx.get((read, actualize) => actualize(ctx, theAtom.__reatom, (patchCtx, patch) => {
    patch.state = "function" == typeof update ? update(patch.state, patchCtx) : update;
  }).state), computer = null;
  return "function" == typeof initState && (theAtom = {}, computer = initState, initState = void 0), theAtom.__reatom = { name, isAction: false, patch: null, initState: () => initState, computer, connectHooks: null, disconnectHooks: null, updateHooks: null, actual: false }, theAtom.pipe = pipe, theAtom.onChange = onChange, 0 === experimental_PLUGINS.length ? theAtom : theAtom.pipe(...experimental_PLUGINS);
}
const action = (fn, name) => {
  void 0 !== fn && "string" != typeof fn || (name = fn, fn = (ctx, v2) => v2), assertFunction(fn);
  let actionAtom = atom([], name ?? __count("_action"));
  return actionAtom.__reatom.isAction = true, actionAtom.__reatom.unstable_fn = fn, Object.assign(function() {
    var params = [].slice.call(arguments);
    let state = actionAtom(params[0], (state2, patchCtx) => (params[0] = patchCtx, [...state2, { params: params.slice(1), payload: patchCtx.cause.proto.unstable_fn(...params) }]));
    return state[state.length - 1].payload;
  }, actionAtom, { onCall });
}, experimental_PLUGINS = [], __root = atom(void 0, "root").__reatom;
function pushUnique(list, el) {
  list.includes(el) || list.push(el);
}
function isString$1(thing) {
  return "string" == typeof thing;
}
function isObject$1(thing) {
  return "object" == typeof thing && null !== thing;
}
function isFunction(thing) {
  return "function" == typeof thing;
}
function isAtom(thing) {
  return isFunction(thing) && "types" in thing;
}
function isActionCreator(thing) {
  return isFunction(thing) && "type" in thing;
}
function isAction(thing) {
  return isObject$1(thing) && isString$1(thing.type) && "payload" in thing;
}
function getState(atom2, store2 = defaultStore) {
  return store2.getState(atom2);
}
const getRootCause$1 = (cause) => null === cause.cause ? cause : getRootCause$1(cause.cause), spyChange = (ctx, anAtom, handler) => {
  let isChanged = false;
  return ctx.spy(anAtom, (newState, prevState) => {
    isChanged = true, handler == null ? void 0 : handler(newState, prevState);
  }), isChanged;
};
atom(null, "initializations").__reatom.initState = () => /* @__PURE__ */ new WeakMap();
let atomsCount = 0;
function createAtom$1(dependencies, reducer, options = {}) {
  let { v3atom, id = (v3atom == null ? void 0 : v3atom.__reatom.name) ?? "atom" + ++atomsCount, store: store2 = defaultStore } = isString$1(options) ? { id: options } : options;
  const trackedTypes = [], types = [], actionCreators = {}, externalActions = {};
  throwReatomError(!isFunction(reducer) || !isString$1(id), "atom arguments"), Object.entries(dependencies).forEach(([name, dep]) => {
    if (throwReatomError(!isFunction(dep), `Invalid atom dependencies (type ${typeof dep}) at ${name}`), isAtom(dep)) dep.types.forEach((type) => pushUnique(types, type));
    else {
      let type;
      if (isActionCreator(dep)) type = (externalActions[name] = dep).type;
      else {
        type = `${name}_${id}`;
        const actionCreator = function() {
          return { payload: dep(...[].slice.call(arguments)), type, targets: [atom$1], v3action: actionCreator.v3action };
        };
        actionCreator.type = type, actionCreator.dispatch = function() {
          return store2.dispatch(actionCreator(...[].slice.call(arguments)));
        }, actionCreator.v3action = action(type), actionCreators[name] = actionCreator, "_" != name[0] && (atom$1[name] = actionCreator);
      }
      pushUnique(trackedTypes, type), pushUnique(types, type);
    }
  });
  const cacheReducer = /* @__PURE__ */ function(reducer2, dependencies2, trackedTypes2, actionCreators2, externalActions2) {
    const create2 = function(name) {
      return actionCreators2[name](...[].slice.call(arguments, 1));
    };
    return (v3ctx, state) => {
      const rootCause = getRootCause$1(v3ctx.cause);
      ctxs.has(rootCause) || ctxs.set(rootCause, /* @__PURE__ */ new WeakMap()), ctxs.get(rootCause).has(reducer2) || ctxs.get(rootCause).set(reducer2, {});
      const ctx = ctxs.get(rootCause).get(reducer2);
      return reducer2({ create: create2, get: (name) => v3ctx.spy(dependencies2[name].v3atom), getUnlistedState: (targetAtom) => v3ctx.get(targetAtom.v3atom), onAction: (name, reaction) => {
        const ac = externalActions2[name] ?? actionCreators2[name];
        throwReatomError(void 0 === ac, "Unknown action"), spyChange(v3ctx, ac.v3action, ({ payload }) => {
          reaction(payload);
        });
      }, onChange: (name, reaction) => {
        spyChange(v3ctx, dependencies2[name].v3atom, (prev, next) => reaction(prev, next));
      }, onInit: (cb) => {
        v3ctx.get((read) => read(v3ctx.cause.proto)) || cb();
      }, schedule: (effect) => v3ctx.schedule(() => effect(getRootCause$1(v3ctx.cause).v2store.dispatch, ctx, []), 2), v3ctx }, state);
    };
  }(reducer, dependencies, 0, actionCreators, externalActions);
  function atom$1(transaction) {
    return transaction.v3ctx.get(atom$1.v3atom);
  }
  return atom$1.id = id, atom$1.getState = () => store2.getState(atom$1), atom$1.subscribe = (cb) => store2.subscribe(atom$1, cb), atom$1.types = types, (atom$1.v3atom = v3atom ?? atom(cacheReducer, id)).__reatom.v2atom = atom$1, atom$1;
}
const ctxs = /* @__PURE__ */ new WeakMap();
function createStore({ callSafety = callSafely, v3ctx = createCtx({ callNearEffect: callSafety, callLateEffect: callSafety }) } = {}) {
  const store2 = { dispatch: (action2) => {
    const actions = Array.isArray(action2) ? action2 : [action2];
    throwReatomError(0 == actions.length || !actions.every(isAction), "dispatch arguments"), v3ctx.get(() => {
      actions.forEach((action3) => action3.v3action(v3ctx, action3.payload)), actions.forEach(({ targets }) => targets == null ? void 0 : targets.forEach((target) => v3ctx.get(target.v3atom)));
    });
  }, getCache: (atom2) => v3ctx.get((read) => read(atom2.v3atom.__reatom)), getState: (atom2) => v3ctx.get(atom2.v3atom), subscribe: (atom2, cb) => v3ctx.subscribe(atom2.v3atom, (state) => cb(state, [])), v3ctx };
  return getRootCause$1(v3ctx.cause).v2store = store2, store2;
}
const defaultStore = createStore();
let n = 0;
function r(r2, c2, o2 = "primitive" + ++n) {
  c2 ?? (c2 = { set: (e, t2) => t2, change: (e, t2) => t2(e) });
  let { decorators: u2, ...a2 } = isString$1(o2) ? { id: o2 } : o2;
  const l2 = createAtom$1(Object.keys(c2).reduce((e, t2) => (e[t2] = function() {
    return [].slice.call(arguments);
  }, e), {}), (e, t2 = r2) => {
    for (const n2 in c2) e.onAction(n2, (e2) => {
      t2 = c2[n2](t2, ...e2);
    });
    return t2;
  }, a2);
  return l2;
}
let c$1 = 0;
function o$1(e = false, t2 = "boolean" + ++c$1) {
  return r(e, { toggle: (e2) => !e2, setTrue: () => true, setFalse: () => false, change: (e2, t3) => t3(e2), set: (e2, t3) => t3 }, t2);
}
const noop$2 = () => {
}, isObject = (thing) => "object" == typeof thing && null !== thing, isShallowEqual = (a2, b2, is = Object.is) => {
  if (Object.is(a2, b2)) return true;
  if (!isObject(a2) || !isObject(b2) || a2.__proto__ !== b2.__proto__ || a2 instanceof Error) return false;
  if (Symbol.iterator in a2) {
    let equal2 = a2 instanceof Map ? (a3, b3) => is(a3[0], b3[0]) && is(a3[1], b3[1]) : is, aIter = a2[Symbol.iterator](), bIter = b2[Symbol.iterator]();
    for (; ; ) {
      let aNext = aIter.next(), bNext = bIter.next();
      if (aNext.done || bNext.done || !equal2(aNext.value, bNext.value)) return aNext.done && bNext.done;
    }
  }
  if (a2 instanceof Date) return a2.getTime() === b2.getTime();
  if (a2 instanceof RegExp) return String(a2) === String(b2);
  for (let k2 in a2) if (k2 in b2 == 0 || !is(a2[k2], b2[k2])) return false;
  return Object.keys(a2).length === Object.keys(b2).length;
}, isDeepEqual = (a2, b2) => {
  const visited = /* @__PURE__ */ new WeakMap(), is = (a3, b3) => {
    if (isObject(a3)) {
      if (visited.has(a3)) return visited.get(a3) === b3;
      visited.set(a3, b3);
    }
    return isShallowEqual(a3, b3, is);
  };
  return isShallowEqual(a2, b2, is);
}, assign = Object.assign, merge = function() {
  return Object.assign({}, ...[].slice.call(arguments));
};
const { toString } = Object.prototype, toAbortError = (reason) => {
  if (reason instanceof Error == 0 || "AbortError" !== reason.name) {
    if (reason instanceof Error) {
      var options = { cause: reason };
      reason = reason.message;
    } else reason = isObject(reason) ? toString.call(reason) : String(reason);
    "undefined" == typeof DOMException ? (reason = new Error(reason, options)).name = "AbortError" : reason = assign(new DOMException(reason, "AbortError"), options);
  }
  return reason;
}, throwIfAborted = (controller) => {
  if (controller == null ? void 0 : controller.signal.aborted) throw toAbortError(controller.signal.reason);
}, isAbort = (thing) => thing instanceof Error && "AbortError" === thing.name, setTimeout$1 = Object.assign(function() {
  const intervalId = globalThis.setTimeout(...[].slice.call(arguments));
  return "number" == typeof intervalId ? intervalId : Object.assign(intervalId, { toJSON: () => -1 });
}, globalThis.setTimeout), MAX_SAFE_TIMEOUT = 2 ** 31 - 1;
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  return result && result.then ? result.then(void 0, recover) : result;
}
class CauseContext extends WeakMap {
  has(cause) {
    return super.has(cause) || null !== cause.cause && this.has(cause.cause);
  }
  get(cause) {
    for (; !super.has(cause) && cause.cause; ) cause = cause.cause;
    return super.get(cause);
  }
}
const abortCauseContext = new CauseContext(), getTopController = (patch) => abortCauseContext.get(patch) ?? null, onCtxAbort = (ctx, cb) => {
  const controller = getTopController(ctx.cause);
  if (controller) {
    const handler = () => cb(toAbortError(controller.signal.reason)), cleanup = () => controller.signal.removeEventListener("abort", handler);
    if (!controller.signal.aborted) return controller.signal.addEventListener("abort", handler), cleanup;
    handler();
  }
}, CHAINS = /* @__PURE__ */ new WeakMap(), __thenReatomed = (ctx, origin, onFulfill, onReject) => {
  let chain = CHAINS.get(origin);
  if (!chain) {
    const promise = origin.then((value2) => (ctx.get((read, actualize) => chain.then.forEach((cb) => cb(value2, read, actualize))), value2), (error2) => {
      throw ctx.get((read, actualize) => chain.catch.forEach((cb) => cb(error2, read, actualize))), isAbort(error2) && promise.catch(noop$2), error2;
    });
    CHAINS.set(origin, chain = { promise, then: [], catch: [] }), CHAINS.set(promise, chain);
  }
  return onFulfill && chain.then.push(onFulfill), onReject && chain.catch.push(onReject), chain.promise;
}, withAbortableSchedule = (ctx) => {
  const { schedule } = ctx;
  return merge(ctx, { schedule(cb, step = 1) {
    const _this = this;
    if (step < 1) return schedule.call(this, cb, step);
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res, reject = rej;
    }), unabort = onCtxAbort(this, (error2) => {
      promise.catch(noop$2), reject(error2);
    });
    return schedule.call(this, function(_ctx) {
      try {
        let _temp3 = function() {
          unabort == null ? void 0 : unabort();
        };
        const _temp2 = _catch(function() {
          const controller = getTopController(_this.cause);
          return throwIfAborted(controller), Promise.resolve(cb(_ctx)).then(function(value2) {
            throwIfAborted(controller), resolve(value2);
          });
        }, function(error2) {
          reject(error2);
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3());
      } catch (e) {
        return Promise.reject(e);
      }
    }, step).catch((error2) => {
      reject(error2), unabort == null ? void 0 : unabort();
    }), promise;
  } });
}, _spawn = action(function(ctx, fn, controller) {
  return abortCauseContext.set(ctx.cause, controller), fn(ctx, ...[].slice.call(arguments, 3));
}, "_spawn"), spawn = (ctx, fn, args = [], controller = new AbortController()) => _spawn(ctx, fn, controller, ...args);
const getRootCause = (cause) => null === cause.cause ? cause : getRootCause(cause.cause), isSameCtx = (ctx1, ctx2) => getRootCause(ctx1.cause) === getRootCause(ctx2.cause), addOnConnect = (anAtom, cb) => {
  var _a;
  return ((_a = anAtom.__reatom).connectHooks ?? (_a.connectHooks = /* @__PURE__ */ new Set())).add(cb);
}, addOnDisconnect = (anAtom, cb) => {
  var _a;
  return ((_a = anAtom.__reatom).disconnectHooks ?? (_a.disconnectHooks = /* @__PURE__ */ new Set())).add(cb);
}, _onConnect = action((ctx, anAtom, fn, controller) => {
  ctx.cause.cause = getRootCause(ctx.cause), abortCauseContext.set(ctx.cause, controller);
  const result = fn(withAbortableSchedule({ ...ctx, controller, isConnected: () => isConnected(ctx, anAtom) }));
  return result instanceof Promise && controller.signal.addEventListener("abort", () => result.catch(noop$2)), result;
}, "_onConnect"), onConnect = (anAtom, cb) => {
  const connectHook = (ctx) => {
    const controller = new AbortController(), cleanup = _onConnect(ctx, anAtom, cb, controller);
    cleanup instanceof Promise && cleanup.catch(noop$2);
    const cleanupHook = (_ctx) => {
      isSameCtx(ctx, _ctx) && disconnectHooks.delete(cleanupHook) && connectHooks.has(connectHook) && (controller.abort(toAbortError(`${anAtom.__reatom.name} disconnect`)), "function" == typeof cleanup && cleanup());
    }, disconnectHooks = addOnDisconnect(anAtom, cleanupHook);
  }, connectHooks = addOnConnect(anAtom, connectHook);
  return () => connectHooks.delete(connectHook);
}, isConnected = (ctx, { __reatom: proto }) => ctx.get((read) => {
  const cache = proto.patch ?? read(proto);
  return !!cache && cache.subs.size + cache.listeners.size > 0;
}), initializations = atom(null, "initializations");
initializations.__reatom.initState = () => /* @__PURE__ */ new WeakMap();
const withAssign = (getProps) => (target) => assign(target, getProps(target, target.__reatom.name)), reatomMap = (initState = /* @__PURE__ */ new Map(), name) => atom(initState, name).pipe(withAssign((target, name2) => {
  const getOrCreate = action((ctx, key, value2) => (actions.set(ctx, key, value2), value2), `${name2}.getOrCreate`), actions = { get: (ctx, key) => ctx.get(target).get(key), getOrCreate: (ctx, key, creator) => actions.has(ctx, key) ? actions.get(ctx, key) : getOrCreate(ctx, key, creator()), has: (ctx, key) => ctx.get(target).has(key), set: action((ctx, key, value2) => target(ctx, (prev) => {
    const valuePrev = prev.get(key);
    return Object.is(valuePrev, value2) && (void 0 !== value2 || prev.has(key)) ? prev : new Map(prev).set(key, value2);
  }), `${name2}.set`), delete: action((ctx, key) => target(ctx, (prev) => {
    if (!prev.has(key)) return prev;
    const next = new Map(prev);
    return next.delete(key), next;
  }), `${name2}.delete`), clear: action((ctx) => target(ctx, /* @__PURE__ */ new Map()), `${name2}.clear`), reset: action((ctx) => target(ctx, initState), `${name2}.reset`) };
  return actions;
}));
const handleEffect = (anAsync, params, { shouldPending = true, shouldFulfill = true, shouldReject = true, effect = anAsync.__reatom.unstable_fn } = {}) => {
  const pendingAtom = anAsync.pendingAtom, [ctx] = params;
  shouldPending && pendingAtom(ctx, (s2) => ++s2);
  const origin = ctx.schedule(() => new Promise((res, rej) => {
    throwIfAborted(ctx.controller), effect(...params).then(res, rej), ctx.controller.signal.addEventListener("abort", () => rej(toAbortError(ctx.controller.signal.reason)));
  }));
  return assign(__thenReatomed(ctx, origin, (v2) => {
    shouldFulfill && anAsync.onFulfill(ctx, v2), shouldPending && pendingAtom(ctx, (s2) => --s2);
  }, (e) => {
    shouldReject && !isAbort(e) && anAsync.onReject(ctx, e), shouldPending && pendingAtom(ctx, (s2) => --s2);
  }), { controller: ctx.controller });
}, NOOP_TIMEOUT_ID = -1, withCache = ({ ignoreAbort = true, length = 5, paramsLength, staleTime = 3e5, swr: swrOptions = true, withPersist, paramsToKey, isEqual: isEqual2 = (ctx, a2, b2) => isDeepEqual(a2, b2) } = {}) => (anAsync) => {
  if (!anAsync.cacheAtom) {
    const swr = !!swrOptions, { shouldPending = false, shouldFulfill = swr, shouldReject = false } = swrOptions;
    Infinity !== staleTime && (staleTime = Math.min(MAX_SAFE_TIMEOUT, staleTime));
    const find = paramsToKey ? (ctx, params, state = ctx.get(cacheAtom)) => {
      const key = paramsToKey(ctx, params);
      return { cached: state.get(key), key };
    } : (ctx, params, state = ctx.get(cacheAtom)) => {
      for (const [key, cached] of state) if (isEqual2(ctx, key, params)) return { cached, key };
      return { cached: void 0, key: params };
    }, findLatestWithValue = (ctx, state = ctx.get(cacheAtom)) => {
      for (const cached of state.values()) if (cached.version > 0 && (!latestCached || cached.lastUpdate > latestCached.lastUpdate)) var latestCached = cached;
      return latestCached;
    }, deleteOldest = (cache) => {
      for (const [key, cached] of cache) if (!oldestCached || oldestCached.lastUpdate > cached.lastUpdate) var oldestKey = key, oldestCached = cached;
      oldestCached && cache.delete(oldestKey);
    }, planCleanup = (ctx, key, time = staleTime) => {
      var _a;
      const clearTimeoutId = Infinity === staleTime ? NOOP_TIMEOUT_ID : setTimeout$1(() => {
        var _a2;
        ((_a2 = cacheAtom.get(ctx, key)) == null ? void 0 : _a2.clearTimeoutId) === clearTimeoutId && cacheAtom.delete(ctx, key);
      }, time);
      return (_a = clearTimeoutId.unref) == null ? void 0 : _a.call(clearTimeoutId), ctx.schedule(() => clearTimeout(clearTimeoutId), -1), clearTimeoutId;
    }, cacheAtom = anAsync.cacheAtom = reatomMap(/* @__PURE__ */ new Map(), `${anAsync.__reatom.name}._cacheAtom`).pipe(withAssign((target, name) => ({ setWithParams: action((ctx, params, value2) => {
      const { cached, key } = find(ctx, params);
      cacheAtom.set(ctx, key, { clearTimeoutId: planCleanup(ctx, key), promise: void 0, value: value2, version: cached ? cached.version + 1 : 1, controller: new AbortController(), lastUpdate: Date.now(), params });
    }), deleteWithParams: action((ctx, params) => {
      const { cached, key } = find(ctx, params);
      cached && cacheAtom.delete(ctx, key);
    }) })));
    cacheAtom.invalidate = action((ctx) => {
      const latest = findLatestWithValue(ctx);
      return cacheAtom.clear(ctx), "promiseAtom" in anAsync ? anAsync(ctx) : latest ? anAsync(ctx, ...latest.params) : null;
    }, `${cacheAtom.__reatom.name}.invalidate`), cacheAtom.options = { ignoreAbort, length, paramsLength, staleTime, swr, withPersist }, withPersist && cacheAtom.pipe(withPersist({ key: cacheAtom.__reatom.name, fromSnapshot: (ctx, snapshot, state = /* @__PURE__ */ new Map()) => {
      if (snapshot.length <= (state == null ? void 0 : state.size) && snapshot.every(([, { params, value: value2 }]) => {
        const { cached } = find(ctx, params, state);
        return !!cached && isDeepEqual(cached.value, value2);
      })) return state;
      const newState = new Map(snapshot);
      for (const [key, rec] of newState) staleTime - (Date.now() - rec.lastUpdate) <= 0 ? newState.delete(key) : rec.clearTimeoutId = planCleanup(ctx, key, staleTime - (Date.now() - rec.lastUpdate));
      for (const [key, rec] of state) if (rec.promise) {
        const { cached } = find(ctx, rec.params, newState);
        cached ? cached.promise = rec.promise : newState.set(key, rec);
      }
      return newState;
    }, time: Math.min(staleTime, MAX_SAFE_TIMEOUT), toSnapshot: (ctx, cache) => [...cache].filter(([, rec]) => !rec.promise) }));
    const swrPendingAtom = anAsync.swrPendingAtom = atom(0, `${anAsync.__reatom.name}.swrPendingAtom`), handlePromise = (ctx, key, cached, swr2) => {
      cached.clearTimeoutId = planCleanup(ctx, key);
      const isSame = () => {
        var _a;
        return ((_a = cacheAtom.get(ctx, key)) == null ? void 0 : _a.clearTimeoutId) === cached.clearTimeoutId;
      }, { unstable_fn } = anAsync.__reatom;
      let res, rej;
      return cached.promise = new Promise(function() {
        return [res, rej] = [].slice.call(arguments);
      }), function() {
        try {
          let _temp2 = function() {
            return cached.promise;
          };
          var a2;
          a2 = [].slice.call(arguments);
          const _temp = function(body, recover) {
            try {
              var result = Promise.resolve(ignoreAbort ? spawn(a2[0], function(ctx2) {
                return unstable_fn({ ...ctx2, controller: getTopController(ctx2.cause) }, ...[].slice.call(arguments, 1));
              }, a2.slice(1)) : unstable_fn(...a2)).then(function(value2) {
                res(value2), ctx.get(() => {
                  isSame() && cacheAtom.set(ctx, key, { ...cached, promise: void 0, value: value2, version: cached.version + 1 }), swr2 && swrPendingAtom(ctx, (s2) => s2 - 1);
                });
              });
            } catch (e) {
              return recover(e);
            }
            return result && result.then ? result.then(void 0, recover) : result;
          }(0, function(error2) {
            rej(error2), ctx.get(() => {
              isSame() && (cached.version > 0 ? cacheAtom.set(ctx, key, { ...cached, promise: void 0 }) : cacheAtom.delete(ctx, key)), swr2 && swrPendingAtom(ctx, (s2) => s2 - 1);
            });
          });
          return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2());
        } catch (e) {
          return Promise.reject(e);
        }
      };
    };
    if (anAsync._handleCache = action(function() {
      var params = [].slice.call(arguments);
      const [ctx] = params, controller = getTopController(ctx.cause.cause);
      abortCauseContext.set(ctx.cause, ctx.controller = controller);
      const paramsKey = params.slice(1, 1 + (paramsLength ?? params.length));
      let { cached = { clearTimeoutId: NOOP_TIMEOUT_ID, promise: void 0, value: void 0, version: 0, controller, lastUpdate: -1, params: [] }, key } = find(ctx, paramsKey);
      const prevController = cached.controller;
      cached = { ...cached, lastUpdate: Date.now(), params: paramsKey, controller };
      const cache = cacheAtom.set(ctx, key, cached);
      return cache.size > length && deleteOldest(cache), 0 === cached.version && !cached.promise || cached.promise && prevController.signal.aborted ? handleEffect(anAsync, params, { effect: handlePromise(ctx, key, cached, false) }) : (cached.version > 0 && anAsync.onFulfill(ctx, cached.value), cached.promise || !swr ? handleEffect(anAsync, params, { effect: function() {
        try {
          return Promise.resolve(cached.promise ?? cached.value);
        } catch (e) {
          return Promise.reject(e);
        }
      }, shouldPending: false, shouldFulfill, shouldReject }) : (swr && swrPendingAtom(ctx, (s2) => s2 + 1), handleEffect(anAsync, params, { effect: handlePromise(ctx, key, cached, swr), shouldPending, shouldFulfill, shouldReject })));
    }, `${anAsync.__reatom.name}._handleCache`), "dataAtom" in anAsync) {
      const { initState } = anAsync.dataAtom.__reatom;
      anAsync.dataAtom.__reatom.initState = (ctx) => {
        const cached = findLatestWithValue(ctx), iniState = initState(ctx);
        return cached ? anAsync.dataAtom.mapFulfill ? anAsync.dataAtom.mapFulfill(ctx, cached.value, iniState) : cached.value : iniState;
      };
    }
    withPersist && "dataAtom" in anAsync && onConnect(anAsync.dataAtom, (ctx) => ctx.subscribe(cacheAtom, () => {
    }));
  }
  return anAsync;
}, resolved = /* @__PURE__ */ new WeakSet(), reatomResource = (asyncComputed, name = __count("asyncAtom")) => {
  const promises = new CauseContext(), theAsync = reatomAsync((ctx) => {
    const promise = promises.get(ctx.cause);
    return throwReatomError(!promise, "reaction manual call"), promise;
  }, name), promiseAtom = atom((_ctx, state) => {
    if (state && !_ctx.cause.pubs.length) return state;
    const params = [], ctx = merge(_ctx, { spy(anAtom, cb) {
      throwReatomError(cb, "spy reactions are unsupported in ResourceAtom");
      const value2 = _ctx.spy(anAtom);
      return params.push(value2), value2;
    } }), controller = new AbortController(), unabort = onCtxAbort(ctx, (error2) => {
      isConnected(ctx, theReaction) || controller.abort(error2);
    });
    unabort && controller.signal.addEventListener("abort", unabort), abortCauseContext.set(ctx.cause, ctx.controller = controller);
    const computedPromise = asyncComputed(withAbortableSchedule(ctx));
    computedPromise.catch(noop$2), promises.set(ctx.cause, computedPromise);
    const pendingBefore = ctx.get(theAsync.pendingAtom), fulfillCallsBefore = ctx.get(theAsync.onFulfill);
    let promise = theAsync(ctx, ...params);
    promise.controller.signal.addEventListener("abort", () => {
      var _a;
      ((_a = theReaction.cacheAtom) == null ? void 0 : _a.options.ignoreAbort) || controller.abort(promise.controller.signal.reason);
    });
    const cached = pendingBefore === ctx.get(theAsync.pendingAtom), fulfillCalls = ctx.get(theAsync.onFulfill);
    return cached && controller.abort(toAbortError("cached")), cached && fulfillCallsBefore !== fulfillCalls && (promise = Object.assign(Promise.resolve(fulfillCalls[fulfillCalls.length - 1].payload), { controller })), __thenReatomed(ctx, promise, () => resolved.add(promise), () => resolved.add(promise)).catch(noop$2), state == null ? void 0 : state.controller.abort(toAbortError("concurrent")), promise;
  }, `${name}._promiseAtom`);
  onConnect(theAsync, (ctx) => ctx.subscribe(promiseAtom, noop$2)), onConnect(promiseAtom, (ctx) => () => {
    ctx.get((read) => {
      var _a;
      const state = (_a = read(promiseAtom.__reatom)) == null ? void 0 : _a.state;
      state == null ? void 0 : state.controller.abort(ctx.controller.signal.reason), resolved.has(state) || reset(ctx, promiseAtom.__reatom, ctx.controller.signal.reason);
    });
  });
  const theReaction = Object.assign((ctx) => ctx.get((read, actualize) => {
    var _a;
    reset(ctx, promiseAtom.__reatom, toAbortError("force")), actualize(ctx, promiseAtom.__reatom, noop$2);
    const state = ctx.get(theAsync), payload = (_a = state[state.length - 1]) == null ? void 0 : _a.payload;
    return throwReatomError(!payload, "unexpectedly failed invalidation. Please, report the issue"), payload;
  }), theAsync, { promiseAtom, init: (ctx) => ctx.subscribe(promiseAtom, noop$2), reset: action((ctx) => {
    reset(ctx, promiseAtom.__reatom, toAbortError("reset"));
  }, `${name}.reset`) });
  return Object.defineProperty(theAsync, "_handleCache", { get: () => theReaction._handleCache }), theReaction;
}, reset = (ctx, proto, reason) => ctx.get((read, actualize) => {
  if (read(proto)) {
    const { computer } = proto;
    proto.computer = null;
    try {
      actualize(ctx, proto, (patchCtx, patch) => {
        var _a;
        (_a = patch.state) == null ? void 0 : _a.controller.abort(reason), patch.pubs = [], patch.state = void 0;
      });
    } finally {
      proto.computer = computer;
    }
  }
}), reatomAsync = (effect, options = {}) => {
  const { name = __count("async"), onEffect: onEffectHook, onFulfill: onFulfillHook, onReject: onRejectHook, onSettle: onSettleHook } = "string" == typeof options ? { name: options } : options, pendingAtom = atom(0, `${name}.pendingAtom`), theAsync = Object.assign(function() {
    var params = [].slice.call(arguments);
    return params[0].get((read, actualize) => {
      const { state } = actualize(params[0], theAsync.__reatom, (ctx, patch) => {
        abortCauseContext.set(ctx.cause, ctx.controller = new AbortController());
        const unabort = onCtxAbort(params[0], (error2) => {
          payload == null ? void 0 : payload.catch(noop$2), ctx.controller.abort(error2);
        });
        unabort && ctx.controller.signal.addEventListener("abort", unabort), params[0] = withAbortableSchedule(ctx);
        var payload = theAsync._handleCache ? theAsync._handleCache(...params) : handleEffect(theAsync, params);
        __thenReatomed(ctx, payload, void 0, () => {
          onReject.__reatom.updateHooks.size > 1 && payload.catch(noop$2);
        }), patch.state = [...patch.state, { params: params.slice(1), payload }];
      });
      return state[state.length - 1].payload;
    });
  }, action(effect, name)), onFulfill = action(`${name}.onFulfill`), onReject = action(`${name}.onReject`), onSettle = action(`${name}._onSettle`);
  return onFulfill.onCall((ctx) => onSettle(ctx)), onReject.onCall((ctx) => onSettle(ctx)), onEffectHook && theAsync.onCall((ctx, promise, params) => onEffectHook(ctx, params, promise)), onFulfillHook && onFulfill.onCall(onFulfillHook), onRejectHook && onReject.onCall(onRejectHook), onSettleHook && onSettle.onCall(onSettleHook), onConnect(pendingAtom, (ctx) => ctx.subscribe(theAsync, noop$2)), assign(theAsync, { onFulfill, onReject, onSettle, pendingAtom });
};
reatomAsync.from = (effect, options = {}) => (effect.name.length > 2 && ("object" == typeof options ? options.name ?? (options.name = effect.name) : options ?? (options = effect.name)), reatomAsync(function(ctx) {
  return effect(...[].slice.call(arguments, 1));
}, options));
const withDataAtom = (initState, mapFulfill) => (anAsync) => {
  if (!anAsync.dataAtom) {
    const dataAtom = anAsync.dataAtom = Object.assign(atom(initState, `${anAsync.__reatom.name}.dataAtom`), { reset: action((ctx) => {
      dataAtom(ctx, initState);
    }, `${anAsync.__reatom.name}.dataAtom.reset`), mapFulfill });
    dataAtom.__reatom.computer = (ctx, state) => (ctx.spy(anAsync.onFulfill, ({ payload }) => {
      state = payload;
    }), state), anAsync.onFulfill.onCall((ctx) => {
      ctx.get(dataAtom);
    }), onConnect(dataAtom, (ctx) => ctx.subscribe(anAsync, noop$2));
  }
  return anAsync;
};
const getCause = (patch, log = "") => log.length > 1e4 ? `${log} ...` : null !== patch.cause && patch.cause.proto !== __root ? getCause(patch.cause, log + " <-- " + (patch.cause.proto.name ?? "unnamed")) : log || "root", getTimeStampDefault = () => {
  let ms = (/* @__PURE__ */ new Date()).getMilliseconds();
  return ms = ms.toString().padStart(3, "0"), `${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${ms}ms`;
};
let timesPrecision = 10 ** 15;
const createLogBatched = ({ debounce = 500, getTimeStamp = getTimeStampDefault, limit = 5e3, log = console.log, domain = "", shouldGroup = false, shouldLogGraph = false } = {}) => {
  domain && (domain = `(${domain}) `);
  let queue = [], isBatching = false, batchingStart = Date.now();
  return (msg) => {
    0 !== Object.keys(msg.changes).length && (isBatching || (isBatching = true, batchingStart = Date.now()), setTimeout((length) => {
      if (isBatching = queue.length !== length && Date.now() - batchingStart < limit, isBatching) return;
      const isFewTransactions = queue.length > 0;
      console.groupCollapsed(`Reatom ${domain}${length} transaction${length > 1 ? "s" : ""}`), shouldLogGraph && ((logsSet) => {
        const visited = /* @__PURE__ */ new Set(), checkCause = (patch) => {
          !patch.cause || patch.cause.proto === __root || patch.cause.proto.name.startsWith("_") && patch.cause.proto.name.includes("._") || logsSet.has(patch.cause) || visited.has(patch.cause) || (checkCause(patch.cause), visited.add(patch.cause));
        };
        for (const patch of logsSet) checkCause(patch);
        const logs = [...logsSet], maxDistance = logs.reduce((acc, patch, i2) => Math.max(acc, i2 - ((patch.cause && logs.indexOf(patch.cause)) ?? i2)), 0), shiftRatio = 20 * maxDistance, x2 = Math.floor(maxDistance / logs.length * shiftRatio) + 20;
        let y2 = 30, body = "", width = x2;
        for (const patch of logs) {
          const { isAction: isAction2, name } = patch.proto, color = isAction2 ? name.endsWith(".onFulfill") ? "#E6DC73" : "#ffff80" : "#151134";
          body += `<circle cx="${x2}" cy="${y2}" r="10" fill="${color}" />`, body += `<text x="${x2 + 15}" y="${y2 + 5}" font-size="10" fill="gray">${name}</text>`, y2 += 30, width = Math.max(width, x2 + 10 * name.length);
        }
        logs.forEach(({ cause }, idx) => {
          if (!cause || cause.proto === __root || 0 === idx) return;
          const causeIdx = logs.indexOf(cause);
          if (causeIdx < 0) return;
          const causeY = 30 * causeIdx + 30, shiftX = Math.floor(x2 - (idx - causeIdx) / logs.length * shiftRatio - 10), shiftY = Math.floor(30 * (causeIdx + (idx - causeIdx) / 2)) + 30, idxY = 30 * idx + 30, lineX = Math.floor(x2 - 10);
          body += `<polyline points="${lineX},${causeY} ${shiftX},${shiftY} ${lineX},${idxY}" stroke="gray" fill="none" />`;
        });
        const dataUrl = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y2}" style="font-family: monospace;">${body}</svg>`)}`;
        console.log("%c                         ", `font-size:${y2}px; background: url(${dataUrl}) no-repeat; font-family: monospace;`);
      })(new Set(queue.flatMap(({ changes }) => Object.values(changes)).sort((a2, b2) => a2.time - b2.time).map(({ patch }) => patch)));
      for (const { changes, time, error: error2 } of queue) {
        console.log(`%c ${time}`, `padding-left: calc(50% - ${time.length / 2}em); font-size: 0.7rem;`), error2 && console.error(error2);
        let inGroup = false;
        Object.entries(changes).forEach(([k2, change], i2, arr) => {
          var _a;
          const isAction2 = "payload" in change, style = (isAction2 ? "background: #ffff80; color: #151134;" : "background: #151134; color: white;") + "font-weight: 400; padding: 0.15em;  padding-right: 1ch;", name = k2.replace(/(\d)*\./, ""), head = name.replace(/\..*/, ""), nextK = (_a = arr[i2 + 1]) == null ? void 0 : _a[0], nextName = nextK == null ? void 0 : nextK.replace(/(\d)*\./, ""), isGroup = nextName == null ? void 0 : nextName.startsWith(head);
          shouldGroup && !inGroup && isGroup && isFewTransactions && (inGroup = true, console.groupCollapsed(`%c ${head}`, style));
          const data = isAction2 ? change.payload : change.newState;
          console.groupCollapsed(`%c ${name}`, style), console.log(change), console.groupEnd(), isAction2 && !isShallowEqual(change.params, [data]) && log(...change.params), log(data), shouldGroup && !isGroup && inGroup && (inGroup = false, console.groupEnd());
        });
      }
      console.log("\n\n", "transactions:", queue), console.groupEnd(), queue = [];
    }, debounce, queue.push(Object.assign(msg, { time: getTimeStamp() }))));
  };
}, connectLogger = (ctx, { devtools = false, historyLength = 10, domain = "", log = createLogBatched({ domain }), showCause = true, skip = () => false, skipUnnamed = true } = {}) => {
  const history = /* @__PURE__ */ new WeakMap();
  let read;
  ctx.get((r2) => read = r2);
  const ctxUnsubscribe = ctx.subscribe((logs, error2) => {
    let i2 = -1;
    try {
      const states = /* @__PURE__ */ new WeakMap(), changes = {};
      for (; ++i2 < logs.length; ) {
        const patch = logs[i2], { cause, proto, state } = patch, { isAction: isAction2 } = proto;
        let { name } = proto;
        if (skip(patch)) continue;
        if (!name || name.startsWith("_") || /\._/.test(name)) {
          if (skipUnnamed) continue;
          name ?? (name = "unnamed");
        }
        const oldCache = read(proto), oldState = states.has(proto) ? states.get(proto) : oldCache == null ? void 0 : oldCache.state;
        if (states.set(proto, state), Object.is(state, oldState) || isAction2 && 0 === state.length) continue;
        let atomHistory = history.get(proto) ?? [];
        if (historyLength && (atomHistory = atomHistory.slice(0, historyLength - 1), atomHistory.unshift(isAction2 ? { ...patch, state: [...state] } : patch), history.set(proto, atomHistory)), !(oldCache || "root" !== cause.proto.name || isAction2 && 0 !== state.length)) continue;
        const changeMsg = changes[`${i2 + 1}.${name}`] = { patch, history: atomHistory, time: (globalThis.performance ?? Date).now() + 1 / timesPrecision-- };
        if (isAction2) {
          const call = state.at(-1);
          changeMsg.params = call.params, changeMsg.payload = call.payload;
        } else changeMsg.newState = state, changeMsg.oldState = oldState;
        changeMsg.patch = patch, showCause && (changeMsg.cause = getCause(patch));
      }
      log({ error: error2, changes, logs, ctx });
    } catch (error3) {
      console.error("Reatom/logger error with", logs[i2]), console.log(error3);
    }
  });
  return () => {
    ctxUnsubscribe();
  };
};
class ConfigRepository {
  constructor() {
    __privateAdd(this, _config);
    /* -- Intercom staff -- */
    __privateAdd(this, _readSessionIntercomSetting, (key) => sessionStorage.getItem(`kontur.intercom.${key}`));
    __privateAdd(this, _setIntercomSetting, (k2, v2) => {
      const key = `kontur.intercom.${k2}`;
      v2 ? sessionStorage.setItem(key, v2) : sessionStorage.removeItem(key);
    });
  }
  set({
    baseUrl,
    initialUrl,
    initialUrlData,
    stageConfig,
    appConfig,
    baseMapUrl,
    initialUser,
    defaultLayers,
    activeLayers
  }) {
    __privateSet(this, _config, {
      baseUrl,
      initialUrl,
      initialUrlData,
      ...stageConfig,
      ...appConfig,
      mapBaseStyle: baseMapUrl,
      features: Object.keys(appConfig.features).length > 0 ? appConfig.features : stageConfig.featuresByDefault,
      initialUser,
      defaultLayers,
      activeLayers
    });
  }
  get() {
    return __privateGet(this, _config);
  }
  getIntercomSettings() {
    return {
      intercomAppId: __privateGet(this, _config).intercomAppId,
      intercomSelector: __privateGet(this, _config).intercomSelector,
      name: __privateGet(this, _readSessionIntercomSetting).call(this, "name"),
      email: __privateGet(this, _readSessionIntercomSetting).call(this, "email"),
      phone: __privateGet(this, _readSessionIntercomSetting).call(this, "phone")
    };
  }
  updateIntercomSettings(settings) {
    Object.entries(settings).forEach(([k2, v2]) => __privateGet(this, _setIntercomSetting).call(this, k2, v2));
  }
}
_config = new WeakMap();
_readSessionIntercomSetting = new WeakMap();
_setIntercomSetting = new WeakMap();
const configRepo = new ConfigRepository();
const METRICS_EVENT = "METRICS";
function dispatchMetricsEvent(name, payload) {
  if (!globalThis.CustomEvent) return;
  const evt = new CustomEvent(METRICS_EVENT, {
    detail: {
      name,
      payload
    }
  });
  globalThis.dispatchEvent(evt);
}
class FallbackStorage {
  constructor() {
    __publicField(this, "storage", /* @__PURE__ */ new Map());
  }
  setItem(key, value2) {
    this.storage.set(key, value2);
  }
  getItem(key) {
    return this.storage.get(key);
  }
  removeItem(key) {
    this.storage.delete(key);
  }
  clear() {
    this.storage.clear();
  }
  get length() {
    return this.storage.size;
  }
  key(index2) {
    return this.storage.keys()[index2] ?? null;
  }
}
class StableStorage {
  constructor(type) {
    __publicField(this, "storage");
    if (this.storageAvailable(type)) {
      this.storage = globalThis[type];
    } else {
      this.storage = new FallbackStorage();
    }
  }
  storageAvailable(type) {
    try {
      const storage = globalThis[type];
      const x2 = "__storage_test__";
      storage.setItem(x2, x2);
      storage.removeItem(x2);
      return true;
    } catch (e) {
    }
  }
  setItem(key, value2) {
    return this.storage.setItem(key, value2);
  }
  getItem(key) {
    return this.storage.getItem(key);
  }
  get length() {
    return this.storage.length;
  }
  clear() {
    return this.storage.clear();
  }
  key(index2) {
    return this.storage.key(index2);
  }
  removeItem(key) {
    return this.storage.removeItem(key);
  }
}
new StableStorage("sessionStorage");
const localStorage$1 = new StableStorage("localStorage");
const KONTUR_DEBUG = !!localStorage$1.getItem("KONTUR_DEBUG");
!!localStorage$1.getItem("KONTUR_METRICS_DEBUG");
const KONTUR_WARN = !!localStorage$1.getItem("KONTUR_WARN");
const KONTUR_TRACE_TYPE = localStorage$1.getItem("KONTUR_TRACE_TYPE");
const KONTUR_TRACE_PATCH = !!localStorage$1.getItem("KONTUR_TRACE_PATCH");
const store = createStore({});
if (KONTUR_TRACE_PATCH) {
  connectLogger(store.v3ctx, {
    historyLength: 10,
    showCause: KONTUR_TRACE_PATCH,
    skipUnnamed: true,
    domain: "Kontur"
  });
}
store.v3ctx.subscribe((patches) => {
  patches == null ? void 0 : patches.forEach((patch) => {
    var _a;
    const atomName = (_a = patch.proto) == null ? void 0 : _a.name;
    if (atomName) {
      dispatchMetricsEvent(atomName, patch == null ? void 0 : patch.state);
      KONTUR_WARN && console.warn(atomName, patch);
      if (KONTUR_TRACE_TYPE) {
        if (atomName.includes(KONTUR_TRACE_TYPE)) {
          console.trace("TRACE:", atomName, patch);
        }
      }
    }
  });
});
const addStoreInOptions = (options) => ({
  store,
  ...typeof options === "string" ? { id: options } : options
});
const createAtom = (deps, reducer, options) => createAtom$1(deps, reducer, addStoreInOptions(options));
const createBooleanAtom = (initState, options) => o$1(initState, addStoreInOptions(options));
const JSON_MIME = "application/json";
const CONTENT_TYPE_HEADER = "Content-Type";
const FETCH_ERROR = Symbol();
const CATCHER_FALLBACK = Symbol();
function extractContentType(headers = {}) {
  var _a;
  const normalizedHeaders = headers instanceof Array ? Object.fromEntries(headers) : headers;
  return (_a = Object.entries(normalizedHeaders).find(([k2]) => k2.toLowerCase() === CONTENT_TYPE_HEADER.toLowerCase())) === null || _a === void 0 ? void 0 : _a[1];
}
function isLikelyJsonMime(value2) {
  return /^application\/.*json.*/.test(value2);
}
const mix = function(one, two, mergeArrays = false) {
  return Object.entries(two).reduce((acc, [key, newValue]) => {
    const value2 = one[key];
    if (Array.isArray(value2) && Array.isArray(newValue)) {
      acc[key] = mergeArrays ? [...value2, ...newValue] : newValue;
    } else if (typeof value2 === "object" && typeof newValue === "object") {
      acc[key] = mix(value2, newValue, mergeArrays);
    } else {
      acc[key] = newValue;
    }
    return acc;
  }, { ...one });
};
const config$2 = {
  // Default options
  options: {},
  // Error type
  errorType: "text",
  // Polyfills
  polyfills: {
    // fetch: null,
    // FormData: null,
    // URL: null,
    // URLSearchParams: null,
    // performance: null,
    // PerformanceObserver: null,
    // AbortController: null,
  },
  polyfill(p2, doThrow = true, instance2 = false, ...args) {
    const res = this.polyfills[p2] || (typeof self !== "undefined" ? self[p2] : null) || (typeof global !== "undefined" ? global[p2] : null);
    if (doThrow && !res)
      throw new Error(p2 + " is not defined");
    return instance2 && res ? new res(...args) : res;
  }
};
function setOptions(options, replace = false) {
  config$2.options = replace ? options : mix(config$2.options, options);
}
function setPolyfills(polyfills, replace = false) {
  config$2.polyfills = replace ? polyfills : mix(config$2.polyfills, polyfills);
}
function setErrorType(errorType) {
  config$2.errorType = errorType;
}
const middlewareHelper = (middlewares) => (fetchFunction) => {
  return middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) || fetchFunction;
};
class WretchError extends Error {
}
const resolver = (wretch) => {
  const sharedState = /* @__PURE__ */ Object.create(null);
  wretch = wretch._addons.reduce((w2, addon) => addon.beforeRequest && addon.beforeRequest(w2, wretch._options, sharedState) || w2, wretch);
  const { _url: url2, _options: opts, _config: config2, _catchers, _resolvers: resolvers, _middlewares: middlewares, _addons: addons } = wretch;
  const catchers = new Map(_catchers);
  const finalOptions = mix(config2.options, opts);
  let finalUrl = url2;
  const _fetchReq = middlewareHelper(middlewares)((url3, options) => {
    finalUrl = url3;
    return config2.polyfill("fetch")(url3, options);
  })(url2, finalOptions);
  const referenceError = new Error();
  const throwingPromise = _fetchReq.catch((error2) => {
    throw { [FETCH_ERROR]: error2 };
  }).then((response) => {
    var _a;
    if (!response.ok) {
      const err = new WretchError();
      err["cause"] = referenceError;
      err.stack = err.stack + "\nCAUSE: " + referenceError.stack;
      err.response = response;
      err.status = response.status;
      err.url = finalUrl;
      if (response.type === "opaque") {
        throw err;
      }
      const jsonErrorType = config2.errorType === "json" || ((_a = response.headers.get("Content-Type")) === null || _a === void 0 ? void 0 : _a.split(";")[0]) === "application/json";
      const bodyPromise = !config2.errorType ? Promise.resolve(response.body) : jsonErrorType ? response.text() : response[config2.errorType]();
      return bodyPromise.then((body) => {
        err.message = typeof body === "string" ? body : response.statusText;
        if (body) {
          if (jsonErrorType && typeof body === "string") {
            err.text = body;
            err.json = JSON.parse(body);
          } else {
            err[config2.errorType] = body;
          }
        }
        throw err;
      });
    }
    return response;
  });
  const catchersWrapper = (promise) => {
    return promise.catch((err) => {
      const fetchErrorFlag = Object.prototype.hasOwnProperty.call(err, FETCH_ERROR);
      const error2 = fetchErrorFlag ? err[FETCH_ERROR] : err;
      const catcher = (error2 === null || error2 === void 0 ? void 0 : error2.status) && catchers.get(error2.status) || catchers.get(error2 === null || error2 === void 0 ? void 0 : error2.name) || fetchErrorFlag && catchers.has(FETCH_ERROR) && catchers.get(FETCH_ERROR);
      if (catcher)
        return catcher(error2, wretch);
      const catcherFallback = catchers.get(CATCHER_FALLBACK);
      if (catcherFallback)
        return catcherFallback(error2, wretch);
      throw error2;
    });
  };
  const bodyParser = (funName) => (cb) => funName ? (
    // If a callback is provided, then callback with the body result otherwise return the parsed body itself.
    catchersWrapper(throwingPromise.then((_2) => _2 && _2[funName]()).then((_2) => cb ? cb(_2) : _2))
  ) : (
    // No body parsing method - return the response
    catchersWrapper(throwingPromise.then((_2) => cb ? cb(_2) : _2))
  );
  const responseChain = {
    _wretchReq: wretch,
    _fetchReq,
    _sharedState: sharedState,
    res: bodyParser(null),
    json: bodyParser("json"),
    blob: bodyParser("blob"),
    formData: bodyParser("formData"),
    arrayBuffer: bodyParser("arrayBuffer"),
    text: bodyParser("text"),
    error(errorId, cb) {
      catchers.set(errorId, cb);
      return this;
    },
    badRequest(cb) {
      return this.error(400, cb);
    },
    unauthorized(cb) {
      return this.error(401, cb);
    },
    forbidden(cb) {
      return this.error(403, cb);
    },
    notFound(cb) {
      return this.error(404, cb);
    },
    timeout(cb) {
      return this.error(408, cb);
    },
    internalError(cb) {
      return this.error(500, cb);
    },
    fetchError(cb) {
      return this.error(FETCH_ERROR, cb);
    }
  };
  const enhancedResponseChain = addons.reduce((chain, addon) => ({
    ...chain,
    ...typeof addon.resolver === "function" ? addon.resolver(chain) : addon.resolver
  }), responseChain);
  return resolvers.reduce((chain, r2) => r2(chain, wretch), enhancedResponseChain);
};
const core = {
  _url: "",
  _options: {},
  _config: config$2,
  _catchers: /* @__PURE__ */ new Map(),
  _resolvers: [],
  _deferred: [],
  _middlewares: [],
  _addons: [],
  addon(addon) {
    return { ...this, _addons: [...this._addons, addon], ...addon.wretch };
  },
  errorType(errorType) {
    return {
      ...this,
      _config: {
        ...this._config,
        errorType
      }
    };
  },
  polyfills(polyfills, replace = false) {
    return {
      ...this,
      _config: {
        ...this._config,
        polyfills: replace ? polyfills : mix(this._config.polyfills, polyfills)
      }
    };
  },
  url(_url, replace = false) {
    if (replace)
      return { ...this, _url };
    const split = this._url.split("?");
    return {
      ...this,
      _url: split.length > 1 ? split[0] + _url + "?" + split[1] : this._url + _url
    };
  },
  options(options, replace = false) {
    return { ...this, _options: replace ? options : mix(this._options, options) };
  },
  headers(headerValues) {
    const headers = !headerValues ? {} : Array.isArray(headerValues) ? Object.fromEntries(headerValues) : "entries" in headerValues ? Object.fromEntries(headerValues.entries()) : headerValues;
    return { ...this, _options: mix(this._options, { headers }) };
  },
  accept(headerValue) {
    return this.headers({ Accept: headerValue });
  },
  content(headerValue) {
    return this.headers({ [CONTENT_TYPE_HEADER]: headerValue });
  },
  auth(headerValue) {
    return this.headers({ Authorization: headerValue });
  },
  catcher(errorId, catcher) {
    const newMap = new Map(this._catchers);
    newMap.set(errorId, catcher);
    return { ...this, _catchers: newMap };
  },
  catcherFallback(catcher) {
    return this.catcher(CATCHER_FALLBACK, catcher);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolve(resolver2, clear = false) {
    return { ...this, _resolvers: clear ? [resolver2] : [...this._resolvers, resolver2] };
  },
  defer(callback, clear = false) {
    return {
      ...this,
      _deferred: clear ? [callback] : [...this._deferred, callback]
    };
  },
  middlewares(middlewares, clear = false) {
    return {
      ...this,
      _middlewares: clear ? middlewares : [...this._middlewares, ...middlewares]
    };
  },
  fetch(method = this._options.method, url2 = "", body = null) {
    let base = this.url(url2).options({ method });
    const contentType = extractContentType(base._options.headers);
    const formDataClass = this._config.polyfill("FormData", false);
    const jsonify = typeof body === "object" && !(formDataClass && body instanceof formDataClass) && (!base._options.headers || !contentType || isLikelyJsonMime(contentType));
    base = !body ? base : jsonify ? base.json(body, contentType) : base.body(body);
    return resolver(base._deferred.reduce((acc, curr) => curr(acc, acc._url, acc._options), base));
  },
  get(url2 = "") {
    return this.fetch("GET", url2);
  },
  delete(url2 = "") {
    return this.fetch("DELETE", url2);
  },
  put(body, url2 = "") {
    return this.fetch("PUT", url2, body);
  },
  post(body, url2 = "") {
    return this.fetch("POST", url2, body);
  },
  patch(body, url2 = "") {
    return this.fetch("PATCH", url2, body);
  },
  head(url2 = "") {
    return this.fetch("HEAD", url2);
  },
  opts(url2 = "") {
    return this.fetch("OPTIONS", url2);
  },
  body(contents) {
    return { ...this, _options: { ...this._options, body: contents } };
  },
  json(jsObject, contentType) {
    const currentContentType = extractContentType(this._options.headers);
    return this.content(contentType || isLikelyJsonMime(currentContentType) && currentContentType || JSON_MIME).body(JSON.stringify(jsObject));
  }
};
function factory(_url = "", _options = {}) {
  return { ...core, _url, _options };
}
factory["default"] = factory;
factory.options = setOptions;
factory.errorType = setErrorType;
factory.polyfills = setPolyfills;
factory.WretchError = WretchError;
function stringify(value2) {
  return typeof value2 !== "undefined" ? value2 : "";
}
const appendQueryParams = (url2, qp, replace, omitUndefinedOrNullValues, config2) => {
  let queryString2;
  if (typeof qp === "string") {
    queryString2 = qp;
  } else {
    const usp = config2.polyfill("URLSearchParams", true, true);
    for (const key in qp) {
      const value2 = qp[key];
      if (omitUndefinedOrNullValues && (value2 === null || value2 === void 0))
        continue;
      if (qp[key] instanceof Array) {
        for (const val of value2)
          usp.append(key, stringify(val));
      } else {
        usp.append(key, stringify(value2));
      }
    }
    queryString2 = usp.toString();
  }
  const split = url2.split("?");
  if (!queryString2)
    return replace ? split[0] : url2;
  if (replace || split.length < 2)
    return split[0] + "?" + queryString2;
  return url2 + "&" + queryString2;
};
const queryString = {
  wretch: {
    query(qp, replace = false, omitUndefinedOrNullValues = false) {
      return { ...this, _url: appendQueryParams(this._url, qp, replace, omitUndefinedOrNullValues, this._config) };
    }
  }
};
const AUTH_REQUIREMENT = {
  MUST: "must",
  OPTIONAL: "optional",
  NEVER: "never"
};
const wait = (sec = 1, opt = {}) => new Promise(
  (res, rej) => setTimeout(
    (opt == null ? void 0 : opt.failWithMessage) ? () => rej({ message: opt.failWithMessage }) : res,
    sec * 1e3
  )
);
class ApiClientError extends Error {
  constructor(message, problem, status = 0) {
    super(message);
    __publicField(this, "problem");
    __publicField(this, "status", 0);
    this.problem = problem;
    this.status = status;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
function isApiError(error2) {
  return error2 instanceof ApiClientError;
}
function getApiErrorKind(error2) {
  return isApiError(error2) ? error2.problem.kind : null;
}
function parseApiError(errorObj) {
  var _a;
  if (errorObj == null ? void 0 : errorObj.json) {
    const errorData = errorObj == null ? void 0 : errorObj.json;
    if (errorData == null ? void 0 : errorData.message) return errorData.message;
    if (errorData == null ? void 0 : errorData.error_description) return errorData.error_description;
    if (errorData !== null) {
      if (Array.isArray(errorData)) {
        return errorData.map(
          (errorMsg) => errorMsg.name && errorMsg.message ? `${errorMsg.name}: ${errorMsg.message}` : errorMsg
        ).join("<br/>");
      }
      if (errorData == null ? void 0 : errorData.error) return errorData["error"];
      if ((errorData == null ? void 0 : errorData.errors) && Array.isArray(errorData["errors"])) {
        return errorData["errors"].reduce((acc, errorObj2) => {
          if (errorObj2 == null ? void 0 : errorObj2.message) {
            acc.push(errorObj2["message"]);
          }
          return acc;
        }, []).join("<br/>");
      }
    }
    return String(errorData);
  }
  let res = ((_a = errorObj == null ? void 0 : errorObj.response) == null ? void 0 : _a.statusText) ?? (errorObj == null ? void 0 : errorObj.message) ?? (errorObj == null ? void 0 : errorObj.text);
  if (res == null ? void 0 : res.startsWith("<html>")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(res, "text/html");
    const title2 = doc.querySelector("title");
    res = title2 == null ? void 0 : title2.innerText;
  }
  return res ?? "Unknown Error";
}
function createApiError(err) {
  var _a, _b;
  let errorMessage = "";
  let problem = { kind: "unknown", temporary: true };
  let status = 0;
  if (err instanceof ApiClientError) {
    return err;
  }
  if (KONTUR_DEBUG) {
    console.error("Raw error:", err);
  }
  if (err instanceof DOMException && err.name === "AbortError" || err instanceof factory.WretchError && err.name === "AbortError" || err instanceof factory.WretchError && err.cause instanceof DOMException && err.cause.name === "AbortError" || err instanceof factory.WretchError && err.message === "The operation was aborted" || err instanceof Error && err.name === "AbortError") {
    problem = { kind: "canceled" };
  } else if (err instanceof factory.WretchError) {
    status = err.status;
    if (status === 400) {
      problem = { kind: "bad-request" };
    } else if (status === 401) {
      problem = { kind: "unauthorized", data: (_a = err.json) == null ? void 0 : _a.error };
      if ((_b = err.json) == null ? void 0 : _b.message) {
        errorMessage = err.json.message;
      }
    } else if (status === 403) {
      problem = { kind: "forbidden" };
    } else if (status === 404) {
      problem = { kind: "not-found" };
    } else if (status === 408 || status === 504) {
      errorMessage = "Server not available, please try later";
      problem = { kind: "timeout", temporary: true };
    } else if (status >= 500) {
      problem = { kind: "server", data: (err == null ? void 0 : err.json) ?? (err == null ? void 0 : err.text) };
    }
  } else {
    problem = { kind: "client-unknown" };
  }
  if (!errorMessage) {
    errorMessage = parseApiError(err);
  }
  return new ApiClientError(errorMessage || "Unknown error", problem, status);
}
const ApiMethodTypes = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete"
};
async function autoParseBody(res) {
  if (res.status === 204) {
    res.data = null;
    return res;
  }
  if (res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      res.data = await res.json();
    } else {
      res.data = await res.text();
    }
  }
  return res;
}
class ApiClient {
  constructor({ on } = {}) {
    __publicField(this, "AUTH_REQUIREMENT", AUTH_REQUIREMENT);
    __publicField(this, "listeners", {
      error: /* @__PURE__ */ new Set(),
      poolUpdate: /* @__PURE__ */ new Set(),
      idle: /* @__PURE__ */ new Set()
    });
    __publicField(this, "baseURL");
    __publicField(this, "requestPool", /* @__PURE__ */ new Map());
    __publicField(this, "authService");
    if (on) {
      Object.entries(on).forEach(
        ([event, cb]) => {
          if (cb) this.on(event, cb);
        }
      );
    }
  }
  on(event, cb) {
    this.listeners[event].add(cb);
    return () => {
      this.listeners[event].delete(cb);
    };
  }
  _emit(type, payload) {
    this.listeners[type].forEach((l2) => l2(payload));
  }
  init(cfg) {
    let baseURL = cfg.baseUrl ?? "";
    this.baseURL = baseURL;
  }
  updateRequestPool(requestId, status) {
    if (status === null) {
      this.requestPool.delete(requestId);
    } else {
      this.requestPool.set(requestId, status);
    }
    this._emit("poolUpdate", new Map(this.requestPool));
    this._emit("idle", this.requestPool.size === 0);
  }
  /**
   * Makes an HTTP request with configurable authentication behavior
   * @template T - The expected response type
   * @param {ApiMethod} method - HTTP method to use
   * @param {string} path - Request URL or path
   * @param {unknown} [requestParams] - Query parameters or body data
   * @param {CustomRequestConfig} [requestConfig] - Additional request configuration
   * @param {AuthRequirement} [requestConfig.authRequirement] - Authentication requirement level:
   *   - MUST: Request will fail if user is not authenticated
   *   - OPTIONAL (default): Will attempt to use auth if available, but proceed without if not possible
   *   - NEVER: Explicitly prevents authentication
   * @returns {Promise<T | null>} The response data
   * @throws {ApiClientError} On request failure or auth requirement not met
   */
  async call(method, path2, requestParams, requestConfig = {}) {
    var _a;
    const RequestsWithBody = ["post", "put", "patch"];
    const requestId = Math.random().toString(36).substring(7);
    this.updateRequestPool(requestId, "pending");
    const { origin, pathname, search: search2 } = path2.startsWith("http") ? new URL(path2) : {
      origin: this.baseURL,
      pathname: path2,
      search: ""
    };
    let req = factory(origin, { mode: "cors" }).addon(queryString).url(pathname + search2);
    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }
    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }
    let isAuthenticatedRequest = false;
    const authRequirement = requestConfig.authRequirement ?? AUTH_REQUIREMENT.OPTIONAL;
    if (authRequirement !== AUTH_REQUIREMENT.NEVER) {
      try {
        const requireAuth = authRequirement === AUTH_REQUIREMENT.MUST;
        const token = await this.authService.getAccessToken(requireAuth);
        if (token) {
          isAuthenticatedRequest = true;
          req = req.auth(`Bearer ${token}`);
        }
      } catch (error2) {
        if (authRequirement === AUTH_REQUIREMENT.OPTIONAL) {
          console.warn("Authentication failed but proceeding with request:", error2);
        } else {
          throw error2;
        }
      }
    }
    if (requestParams) {
      req = RequestsWithBody.includes(method) ? req.json(requestParams) : req.query(requestParams);
    }
    try {
      const response = await req[method]().res(autoParseBody);
      this.updateRequestPool(requestId, null);
      return response.data;
    } catch (err) {
      this.updateRequestPool(requestId, null);
      const apiError = createApiError(err);
      if (getApiErrorKind(apiError) === "canceled") {
        throw apiError;
      }
      if (isAuthenticatedRequest && getApiErrorKind(apiError) === "unauthorized") {
        try {
          const token = await this.authService.getAccessToken();
          if (!token) {
            throw apiError;
          }
        } catch (error2) {
          throw apiError;
        }
        throw apiError;
      }
      const defaultRetryConfig = {
        attempts: 0,
        delayMs: 1e3,
        onErrorKinds: ["timeout"]
      };
      const retryConfig = {
        ...defaultRetryConfig,
        ...requestConfig.retry,
        onErrorKinds: ((_a = requestConfig.retry) == null ? void 0 : _a.onErrorKinds) ?? defaultRetryConfig.onErrorKinds
      };
      if (retryConfig.attempts > 0) {
        const shouldRetry = retryConfig.onErrorKinds.includes(
          getApiErrorKind(apiError)
        );
        if (shouldRetry) {
          if (retryConfig.delayMs) {
            await wait(retryConfig.delayMs / 1e3);
          }
          return this.call(method, path2, requestParams, {
            ...requestConfig,
            retry: {
              ...retryConfig,
              attempts: retryConfig.attempts - 1
            }
          });
        }
      }
      const errorsConfig = requestConfig.errorsConfig;
      if (errorsConfig && errorsConfig.messages) {
        if (typeof errorsConfig.messages !== "string") {
          if (apiError.status in errorsConfig.messages) {
            apiError.message = errorsConfig.messages[apiError.status];
          }
        } else {
          apiError.message = errorsConfig.messages;
        }
      }
      if ((errorsConfig == null ? void 0 : errorsConfig.hideErrors) !== true) {
        this._emit("error", apiError);
      }
      throw apiError;
    }
  }
  // method shortcuts
  async get(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.GET, path2, requestParams, requestConfig);
  }
  async post(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.POST, path2, requestParams, requestConfig);
  }
  async put(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.PUT, path2, requestParams, requestConfig);
  }
  async patch(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.PATCH, path2, requestParams, requestConfig);
  }
  async delete(path2, requestConfig) {
    return this.call(ApiMethodTypes.DELETE, path2, void 0, requestConfig);
  }
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const currentNotificationAtom = createAtom(
  {
    showNotification: (type, message, lifetimeSec) => ({ type, message, lifetimeSec }),
    removeNotification: (id) => id
  },
  ({ onAction, schedule, create: create2 }, state = []) => {
    onAction("showNotification", ({ type, message, lifetimeSec }) => {
      const id = nanoid(4);
      const onClose = () => currentNotificationAtom.removeNotification.dispatch(id);
      state = [...state, { id, type, message, lifetimeSec, onClose }];
      schedule((dispatch) => {
        setTimeout(onClose, lifetimeSec * 1e3);
      });
    });
    onAction(
      "removeNotification",
      (idToDelete) => state = state.filter(({ id }) => id !== idToDelete)
    );
    return [...state];
  },
  "[Shared state] currentNotificationAtom"
);
const _NotificationService = class _NotificationService {
  constructor() {
    __publicField(this, "defaultLifetimeSec", 10);
  }
  static getInstance() {
    if (!_NotificationService.instance) {
      throw new Error("You have to initialize api client first!");
    } else {
      return _NotificationService.instance;
    }
  }
  static init() {
    _NotificationService.instance = new _NotificationService();
  }
  error(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "error",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  warning(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "warning",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  info(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "info",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  success(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "success",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
};
__publicField(_NotificationService, "instance");
let NotificationService = _NotificationService;
NotificationService.init();
const notificationServiceInstance = NotificationService.getInstance();
const apiClient = new ApiClient({
  on: {
    error: (error2) => {
      switch (error2.problem.kind) {
        default:
          notificationServiceInstance.error({
            title: "Error",
            description: error2.message
          });
      }
    },
    idle: () => dispatchMetricsEvent("apiClient_isIdle")
  }
});
new ApiClient({
  on: {
    error: (error2) => {
      switch (error2.problem.kind) {
        default:
          notificationServiceInstance.error({
            title: "Error",
            description: error2.message
          });
      }
    },
    idle: () => dispatchMetricsEvent("reportsClient_isIdle")
  }
});
async function getCurrentUserSubscription() {
  return await apiClient.get(
    "/users/current_user/billing_subscription",
    { appId: configRepo.get().id },
    { authRequirement: apiClient.AUTH_REQUIREMENT.MUST }
  );
}
reatomResource(async () => {
  return await getCurrentUserSubscription();
}, "currentUserSubscriptionResource").pipe(withDataAtom(), withCache());
createBooleanAtom(false, "intercomVisibleAtom");
function openIntercomChat() {
  if (globalThis.Intercom && globalThis.intercomSettings) {
    globalThis.Intercom("showMessages");
  } else {
    console.warn("Intercom is not available");
  }
}
function isExternalLink(href) {
  const externalProtocols = ["http://", "https://", "mailto:", "ftp://", "tel:"];
  return externalProtocols.some((protocol) => href.startsWith(protocol));
}
function isInnerAnchorLink(href) {
  return href.startsWith("#");
}
const MEDIA_PARAMS_SEPARATOR = "::";
const MEDIA_PARAMS_DELIMITER = ",";
function parseMediaParams(url2) {
  const parts = url2.split(MEDIA_PARAMS_SEPARATOR);
  if (parts.length !== 2) return { originalUrl: url2, params: null };
  const [width, height, fullscreen] = parts[1].split(MEDIA_PARAMS_DELIMITER);
  return {
    originalUrl: parts[0],
    params: {
      ...width && { width: parseInt(width) },
      ...height && { height: parseInt(height) },
      ...fullscreen !== void 0 && { allowFullscreen: fullscreen === "1" }
    }
  };
}
const YOUTUBE_DOMAINS = ["youtube.com", "youtu.be"];
const isYoutubeUrl = (url2) => {
  try {
    const parsedUrl = new URL(url2);
    return YOUTUBE_DOMAINS.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
};
function getYoutubeEmbedUrl(url2) {
  try {
    const parsedUrl = new URL(url2);
    let videoId = null;
    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.slice(1);
    } else {
      if (parsedUrl.pathname.includes("shorts")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      } else if (parsedUrl.pathname.includes("embed")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      } else {
        videoId = parsedUrl.searchParams.get("v");
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url2;
  } catch {
    return url2;
  }
}
const appProtocolHandlers = {
  intercom: () => openIntercomChat()
  // Add more handlers here:
  // someCommand: (url) => { /* handle someCommand */ },
};
function handleAppProtocol(url2) {
  const handler = appProtocolHandlers[url2.hostname];
  if (handler) {
    handler(url2);
    return true;
  }
  console.warn(`Unknown app protocol handler: ${url2.hostname}`);
  return false;
}
function MarkdownLink({
  children,
  href,
  title: title2
}) {
  const handleClick = reactExports.useCallback(
    (e) => {
      if (isInnerAnchorLink(href)) {
        return;
      }
      try {
        const url2 = new URL(href);
        if (url2.protocol === "app:") {
          handleAppProtocol(url2);
          e.preventDefault();
          return;
        }
      } catch {
      }
      goTo(href);
      e.preventDefault();
    },
    [href]
  );
  if (isExternalLink(href)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { title: title2, href, target: "_blank", rel: "noreferrer", className: "external", children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { title: title2, href, onClick: handleClick, className: "internal", children });
}
function buildAssetUrl(asset) {
  return `${configRepo.get().apiGateway}/apps/${configRepo.get().id}/assets/${asset}`;
}
function MarkdownMedia({
  title: title2,
  alt,
  src
}) {
  const { originalUrl, params } = parseMediaParams(src);
  if (isYoutubeUrl(originalUrl)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        src: getYoutubeEmbedUrl(originalUrl),
        width: (params == null ? void 0 : params.width) || 560,
        height: (params == null ? void 0 : params.height) || 315,
        title: title2 || alt || "YouTube video player",
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: (params == null ? void 0 : params.allowFullscreen) ?? true,
        referrerPolicy: "strict-origin-when-cross-origin"
      }
    );
  }
  let realSrc = originalUrl;
  if (!isExternalLink(originalUrl)) {
    realSrc = buildAssetUrl(originalUrl);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: realSrc,
      alt,
      title: title2,
      ...(params == null ? void 0 : params.width) && { width: params.width },
      ...(params == null ? void 0 : params.height) && { height: params.height }
    }
  );
}
function wrapContentInSection(content, idPrefix, classPrefix) {
  const result = [];
  const stack2 = [];
  let keyCounter = 0;
  const parentCounters = /* @__PURE__ */ new Map();
  const wrapAndPushContent = (level) => {
    while (stack2.length > 0 && stack2[stack2.length - 1].level >= level) {
      const { level: stackLevel, content: content2, id } = stack2.pop();
      if (content2.length > 0) {
        const wrappedContent = React.createElement(
          "div",
          {
            className: `${classPrefix}-${id}`,
            key: `div-h${stackLevel}-${++keyCounter}`
          },
          content2
        );
        if (stack2.length > 0) {
          stack2[stack2.length - 1].content.push(wrappedContent);
        } else {
          result.push(wrappedContent);
        }
      }
    }
  };
  const processElement = (element) => {
    const headingMatch = element.type.toString().match(/^h([1-6])$/);
    if (headingMatch) {
      const level = Number.parseInt(headingMatch[1]);
      wrapAndPushContent(level);
      const parentId = stack2.length > 0 ? stack2[stack2.length - 1].id : "";
      const currentCount = (parentCounters.get(parentId) || 0) + 1;
      parentCounters.set(parentId, currentCount);
      const fullId = parentId ? `${parentId}-${currentCount}` : `${idPrefix}-${currentCount}`;
      const clonedElement = React.cloneElement(element, {
        key: `heading-${++keyCounter}`,
        id: fullId
      });
      if (stack2.length > 0 && level > stack2[stack2.length - 1].level) {
        stack2[stack2.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
      stack2.push({ level, content: [], id: fullId });
    } else {
      const clonedElement = React.cloneElement(element, {
        key: `content-${++keyCounter}`
      });
      if (stack2.length > 0) {
        stack2[stack2.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
    }
  };
  React.Children.forEach(content, (element) => {
    if (React.isValidElement(element)) {
      processElement(element);
    }
  });
  wrapAndPushContent(0);
  return result;
}
function splitIntoSections(compiled) {
  const sections = [];
  let currentSection = [];
  React.Children.forEach(compiled, (element) => {
    if (React.isValidElement(element) && element.type === "hr") {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else {
      currentSection.push(element);
    }
  });
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }
  return sections;
}
function structureMarkdownContent(compiled, idPrefix = "hdr", classPrefix = "wrap") {
  const sections = splitIntoSections(compiled);
  return sections.map(
    (section, index2) => React.createElement(
      "section",
      { key: `section-${index2}` },
      wrapContentInSection(section, idPrefix, classPrefix)
    )
  );
}
const markdownOptions = {
  overrides: {
    a: MarkdownLink,
    img: MarkdownMedia,
    h1: { props: { id: void 0 } },
    h2: { props: { id: void 0 } },
    h3: { props: { id: void 0 } },
    h4: { props: { id: void 0 } },
    h5: { props: { id: void 0 } },
    h6: { props: { id: void 0 } }
  },
  wrapper: null
};
function MarkdownContent({ content }) {
  const compiled = Ze(content, markdownOptions);
  return structureMarkdownContent(compiled);
}
var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var fastDeepEqual = function equal(a2, b2) {
  if (a2 === b2) return true;
  if (a2 && b2 && typeof a2 == "object" && typeof b2 == "object") {
    var arrA = isArray(a2), arrB = isArray(b2), i2, length, key;
    if (arrA && arrB) {
      length = a2.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; )
        if (!equal(a2[i2], b2[i2])) return false;
      return true;
    }
    if (arrA != arrB) return false;
    var dateA = a2 instanceof Date, dateB = b2 instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a2.getTime() == b2.getTime();
    var regexpA = a2 instanceof RegExp, regexpB = b2 instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a2.toString() == b2.toString();
    var keys = keyList(a2);
    length = keys.length;
    if (length !== keyList(b2).length)
      return false;
    for (i2 = length; i2-- !== 0; )
      if (!hasProp.call(b2, keys[i2])) return false;
    for (i2 = length; i2-- !== 0; ) {
      key = keys[i2];
      if (!equal(a2[key], b2[key])) return false;
    }
    return true;
  }
  return a2 !== a2 && b2 !== b2;
};
var __values = commonjsGlobal && commonjsGlobal.__values || function(o2) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
  if (m2) return m2.call(o2);
  if (o2 && typeof o2.length === "number") return {
    next: function() {
      if (o2 && i2 >= o2.length) o2 = void 0;
      return { value: o2 && o2[i2++], done: !o2 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = commonjsGlobal && commonjsGlobal.__read || function(o2, n2) {
  var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
  if (!m2) return o2;
  var i2 = m2.call(o2), r2, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
  } catch (error2) {
    e = { error: error2 };
  } finally {
    try {
      if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
    if (ar || !(i2 in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
      ar[i2] = from[i2];
    }
  }
  return to2.concat(ar || Array.prototype.slice.call(from));
};
var deepEqual = fastDeepEqual;
var promiseCaches = [];
var usePromise = function(promise, inputs, lifespan) {
  var e_1, _a;
  if (lifespan === void 0) {
    lifespan = 0;
  }
  try {
    for (var promiseCaches_1 = __values(promiseCaches), promiseCaches_1_1 = promiseCaches_1.next(); !promiseCaches_1_1.done; promiseCaches_1_1 = promiseCaches_1.next()) {
      var promiseCache_1 = promiseCaches_1_1.value;
      if (deepEqual(inputs, promiseCache_1.inputs)) {
        if (Object.prototype.hasOwnProperty.call(promiseCache_1, "error")) {
          throw promiseCache_1.error;
        } else if (Object.prototype.hasOwnProperty.call(promiseCache_1, "response")) {
          return promiseCache_1.response;
        }
        throw promiseCache_1.promise;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (promiseCaches_1_1 && !promiseCaches_1_1.done && (_a = promiseCaches_1.return)) _a.call(promiseCaches_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  var promiseCache = {
    promise: promise.apply(void 0, __spreadArray([], __read(inputs), false)).then(function(response) {
      promiseCache.response = response;
    }).catch(function(e) {
      promiseCache.error = e;
    }).then(function() {
      if (lifespan > 0) {
        setTimeout(function() {
          var index2 = promiseCaches.indexOf(promiseCache);
          if (index2 !== -1) {
            promiseCaches.splice(index2, 1);
          }
        }, lifespan);
      }
    }),
    inputs
  };
  promiseCaches.push(promiseCache);
  throw promiseCache.promise;
};
var build = usePromise;
const usePromise$1 = /* @__PURE__ */ getDefaultExportFromCjs(build);
const article = "_article_b9f5o_1";
const s$f = {
  article
};
function Article({
  children,
  className = "",
  id = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: `${s$f.article} ${className}`, id, children });
}
const isString = (obj) => typeof obj === "string";
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
const copy = (a2, s2, t2) => {
  a2.forEach((m2) => {
    if (s2[m2]) t2[m2] = s2[m2];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
const canNotTraverseDeeper = (object) => !object || isString(object);
const getLastOfPath = (object, path2, Empty) => {
  const stack2 = !isString(path2) ? path2 : path2.split(".");
  let stackIndex = 0;
  while (stackIndex < stack2.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack2[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack2[stackIndex])
  };
};
const setPath = (object, path2, newValue) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2, Object);
  if (obj !== void 0 || path2.length === 1) {
    obj[k2] = newValue;
    return;
  }
  let e = path2[path2.length - 1];
  let p2 = path2.slice(0, path2.length - 1);
  let last = getLastOfPath(object, p2, Object);
  while (last.obj === void 0 && p2.length) {
    e = `${p2[p2.length - 1]}.${e}`;
    p2 = p2.slice(0, p2.length - 1);
    last = getLastOfPath(object, p2, Object);
    if (last && last.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path2, newValue, concat) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2, Object);
  obj[k2] = obj[k2] || [];
  obj[k2].push(newValue);
};
const getPath = (object, path2) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2);
  if (!obj) return void 0;
  return obj[k2];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value2 = getPath(data, key);
  if (value2 !== void 0) {
    return value2;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s2) => _entityMap[s2]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [" ", ",", "?", "!", ";"];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c2) => nsSeparator.indexOf(c2) < 0 && keySeparator.indexOf(c2) < 0);
  if (possibleChars.length === 0) return true;
  const r2 = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c2) => c2 === "?" ? "\\?" : c2).join("|")})`);
  let matched = !r2.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r2.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = function(obj, path2) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj) return void 0;
  if (obj[path2]) return obj[path2];
  const tokens = path2.split(keySeparator);
  let current = obj;
  for (let i2 = 0; i2 < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j2 = i2; j2 < tokens.length; ++j2) {
      if (j2 !== i2) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j2];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j2 < tokens.length - 1) {
          continue;
        }
        i2 += j2 - i2 + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = (code) => code && code.replace("_", "-");
const consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};
class Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();
class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach((_ref) => {
        let [observer, numTimesAdded] = _ref;
        for (let i2 = 0; i2 < numTimesAdded; i2++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach((_ref2) => {
        let [observer, numTimesAdded] = _ref2;
        for (let i2 = 0; i2 < numTimesAdded; i2++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
}
class ResourceStore extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index2 = this.options.ns.indexOf(ns);
    if (index2 > -1) {
      this.options.ns.splice(index2, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path2;
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
    } else {
      path2 = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path2.push(...key);
        } else if (isString(key) && keySeparator) {
          path2.push(...key.split(keySeparator));
        } else {
          path2.push(key);
        }
      }
    }
    const result = getPath(this.data, path2);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path2[0];
      ns = path2[1];
      key = path2.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
  }
  addResource(lng, ns, key, value2) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path2 = [lng, ns];
    if (key) path2 = path2.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
      value2 = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path2, value2);
    if (!options.silent) this.emit("added", lng, ns, key, value2);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m2 in resources) {
      if (isString(resources[m2]) || Array.isArray(resources[m2])) this.addResource(lng, ns, m2, resources[m2], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path2 = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path2) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path2, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    if (this.options.compatibilityAPI === "v1") return {
      ...{},
      ...this.getResource(lng, ns)
    };
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n2 = data && Object.keys(data) || [];
    return !!n2.find((v2) => data[v2] && Object.keys(data[v2]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value2, key, options, translator) {
    processors.forEach((processor) => {
      if (this.processors[processor]) value2 = this.processors[processor].process(value2, key, options, translator);
    });
    return value2;
  }
};
const checkedLoadedFor = {};
class Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key === void 0 || key === null) {
      return false;
    }
    const resolved2 = this.resolve(key, options);
    return resolved2 && resolved2.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m2 = key.match(this.interpolator.nestingRegexp);
      if (m2 && m2.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object") options = {
      ...options
    };
    if (!options) options = {};
    if (keys === void 0 || keys === null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(options)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(options)
        };
      }
      return key;
    }
    const resolved2 = this.resolve(keys, options);
    let res = resolved2 && resolved2.res;
    const resUsedKey = resolved2 && resolved2.usedKey || key;
    const resExactUsedKey = resolved2 && resolved2.exactUsedKey || key;
    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = !isString(res) && typeof res !== "boolean" && typeof res !== "number";
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(res))) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r2 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved2.res = r2;
          resolved2.usedParams = this.getUsedParamsDetails(options);
          return resolved2;
        }
        return r2;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(res);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m2 in res) {
          if (Object.prototype.hasOwnProperty.call(res, m2)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m2}`;
            copy2[m2] = this.translate(deepKey, {
              ...options,
              ...{
                joinArrays: false,
                ns: namespaces
              }
            });
            if (copy2[m2] === deepKey) copy2[m2] = res[m2];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const hasDefaultValue = Translator.hasDefaultValue(options);
      const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
      const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
        ordinal: false
      }) : "";
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i2 = 0; i2 < fallbackLngs.length; i2++) {
            lngs.push(fallbackLngs[i2]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l2, k2, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l2, namespace, k2, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l2, namespace, k2, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l2, namespace, k2, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language2) => {
              const suffixes = this.pluralResolver.getSuffixes(language2, options);
              if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language2], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, options, resolved2, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        if (this.options.compatibilityAPI !== "v1") {
          res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
        } else {
          res = this.options.parseMissingKeyHandler(res);
        }
      }
    }
    if (returnDetails) {
      resolved2.res = res;
      resolved2.usedParams = this.getUsedParamsDetails(options);
      return resolved2;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved2, lastKey) {
    var _this = this;
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, options.lng || this.language || resolved2.usedLng, resolved2.usedNS, resolved2.usedKey, {
        resolved: resolved2
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation) this.interpolator.init({
        ...options,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...options.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = options.replace && !isString(options.replace) ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved2.usedLng, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) options.nest = false;
      }
      if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved2 && resolved2.res) options.lng = this.language || resolved2.usedLng;
      if (options.nest !== false) res = this.interpolator.nest(res, function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey && lastKey[0] === args[0] && !options.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, options);
      if (options.interpolation) this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved2,
          usedParams: this.getUsedParamsDetails(options)
        },
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach((k2) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k2, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const needsContextHandling = options.context !== void 0 && (isString(options.context) || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
}
const capitalize$1 = (string) => string.charAt(0).toUpperCase() + string.slice(1);
class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p2 = code.split("-");
    if (p2.length === 2) return null;
    p2.pop();
    if (p2[p2.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p2.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p2 = code.split("-");
    return this.formatLanguageCode(p2[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf("-") > -1) {
      if (typeof Intl !== "undefined" && typeof Intl.getCanonicalLocales !== "undefined") {
        try {
          let formattedCode = Intl.getCanonicalLocales(code)[0];
          if (formattedCode && this.options.lowerCaseLng) {
            formattedCode = formattedCode.toLowerCase();
          }
          if (formattedCode) return formattedCode;
        } catch (e) {
        }
      }
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p2 = code.split("-");
      if (this.options.lowerCaseLng) {
        p2 = p2.map((part) => part.toLowerCase());
      } else if (p2.length === 2) {
        p2[0] = p2[0].toLowerCase();
        p2[1] = p2[1].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize$1(p2[1].toLowerCase());
      } else if (p2.length === 3) {
        p2[0] = p2[0].toLowerCase();
        if (p2[1].length === 2) p2[1] = p2[1].toUpperCase();
        if (p2[0] !== "sgn" && p2[2].length === 2) p2[2] = p2[2].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize$1(p2[1].toLowerCase());
        if (specialCases.indexOf(p2[2].toLowerCase()) > -1) p2[2] = capitalize$1(p2[2].toLowerCase());
      }
      return p2.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c2) => {
      if (!c2) return;
      if (this.isSupportedCode(c2)) {
        codes.push(c2);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c2}`);
      }
    };
    if (isString(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
}
let sets = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}];
let _rulesPluralsTypes = {
  1: (n2) => Number(n2 > 1),
  2: (n2) => Number(n2 != 1),
  3: (n2) => 0,
  4: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  5: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : n2 == 2 ? 2 : n2 % 100 >= 3 && n2 % 100 <= 10 ? 3 : n2 % 100 >= 11 ? 4 : 5),
  6: (n2) => Number(n2 == 1 ? 0 : n2 >= 2 && n2 <= 4 ? 1 : 2),
  7: (n2) => Number(n2 == 1 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  8: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 != 8 && n2 != 11 ? 2 : 3),
  9: (n2) => Number(n2 >= 2),
  10: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 < 7 ? 2 : n2 < 11 ? 3 : 4),
  11: (n2) => Number(n2 == 1 || n2 == 11 ? 0 : n2 == 2 || n2 == 12 ? 1 : n2 > 2 && n2 < 20 ? 2 : 3),
  12: (n2) => Number(n2 % 10 != 1 || n2 % 100 == 11),
  13: (n2) => Number(n2 !== 0),
  14: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 == 3 ? 2 : 3),
  15: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  16: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 !== 0 ? 1 : 2),
  17: (n2) => Number(n2 == 1 || n2 % 10 == 1 && n2 % 100 != 11 ? 0 : 1),
  18: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : 2),
  19: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 1 && n2 % 100 < 11 ? 1 : n2 % 100 > 10 && n2 % 100 < 20 ? 2 : 3),
  20: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 0 && n2 % 100 < 20 ? 1 : 2),
  21: (n2) => Number(n2 % 100 == 1 ? 1 : n2 % 100 == 2 ? 2 : n2 % 100 == 3 || n2 % 100 == 4 ? 3 : 0),
  22: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : (n2 < 0 || n2 > 10) && n2 % 10 == 0 ? 2 : 3)
};
const nonIntlVersions = ["v1", "v2", "v3"];
const intlVersions = ["v4"];
const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const createRules = () => {
  const rules = {};
  sets.forEach((set) => {
    set.lngs.forEach((l2) => {
      rules[l2] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
};
class PluralResolver {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
      this.options.compatibilityJSON = "v3";
      this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
    }
    this.rules = createRules();
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
      const type = options.ordinal ? "ordinal" : "cardinal";
      const cacheKey = JSON.stringify({
        cleanedCode,
        type
      });
      if (cacheKey in this.pluralRulesCache) {
        return this.pluralRulesCache[cacheKey];
      }
      let rule;
      try {
        rule = new Intl.PluralRules(cleanedCode, {
          type
        });
      } catch (err) {
        if (!code.match(/-|_/)) return;
        const lngPart = this.languageUtils.getLanguagePartFromCode(code);
        rule = this.getRule(lngPart, options);
      }
      this.pluralRulesCache[cacheKey] = rule;
      return rule;
    }
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (this.shouldUseIntlApi()) {
      return rule && rule.resolvedOptions().pluralCategories.length > 1;
    }
    return rule && rule.numbers.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (!rule) {
      return [];
    }
    if (this.shouldUseIntlApi()) {
      return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
    }
    return rule.numbers.map((number) => this.getSuffix(code, number, options));
  }
  getSuffix(code, count2) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      if (this.shouldUseIntlApi()) {
        return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count2)}`;
      }
      return this.getSuffixRetroCompatible(rule, count2);
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return "";
  }
  getSuffixRetroCompatible(rule, count2) {
    const idx = rule.noAbs ? rule.plurals(count2) : rule.plurals(Math.abs(count2));
    let suffix = rule.numbers[idx];
    if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }
    }
    const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
    if (this.options.compatibilityJSON === "v1") {
      if (suffix === 1) return "";
      if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
      return returnSuffix();
    } else if (this.options.compatibilityJSON === "v2") {
      return returnSuffix();
    } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      return returnSuffix();
    }
    return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
  }
  shouldUseIntlApi() {
    return !nonIntlVersions.includes(this.options.compatibilityJSON);
  }
}
const deepFindWithDefaults = function(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path2 = getPathWithDefaults(data, defaultData, key);
  if (!path2 && ignoreJSONStructure && isString(key)) {
    path2 = deepFind(data, key, keySeparator);
    if (path2 === void 0) path2 = deepFind(defaultData, key, keySeparator);
  }
  return path2;
};
const regexSafe = (val) => val.replace(/\$/g, "$$$$");
class Interpolator {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || ((value2) => value2);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp && existingRegExp.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value2;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path2 = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path2, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path2;
      }
      const p2 = key.split(this.formatSeparator);
      const k2 = p2.shift().trim();
      const f2 = p2.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k2, this.options.keySeparator, this.options.ignoreJSONStructure), f2, lng, {
        ...options,
        ...data,
        interpolationkey: k2
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value2 = handleFormat(matchedVar);
        if (value2 === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value2 = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value2 = "";
          } else if (skipOnVariables) {
            value2 = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value2 = "";
          }
        } else if (!isString(value2) && !this.useRawValueToEscape) {
          value2 = makeString(value2);
        }
        const safeValue = todo.safeValue(value2);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value2.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value2;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c2 = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c2[1]}`;
      key = c2[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r2 = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r2.shift();
        formatters = r2;
        doReduce = true;
      }
      value2 = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value2 && match[0] === str && !isString(value2)) return value2;
      if (!isString(value2)) value2 = makeString(value2);
      if (!value2) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value2 = "";
      }
      if (doReduce) {
        value2 = formatters.reduce((v2, f2) => this.format(v2, f2, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value2.trim());
      }
      str = str.replace(match[0], value2);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}
const parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p2 = formatStr.split("(");
    formatName = p2[0].toLowerCase().trim();
    const optStr = p2[1].substring(0, p2[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = (fn) => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: void 0
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
class Formatter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ",";
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value2, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f2) => f2.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f2) => f2.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f2) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f2);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
          const l2 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l2, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error2) {
          this.logger.warn(error2);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value2);
    return result;
  }
}
const removePending = (q2, name) => {
  if (q2.pending[name] !== void 0) {
    delete q2.pending[name];
    q2.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store2, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store2;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s2 = name.split("|");
    const lng = s2[0];
    const ns = s2[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q2) => {
      pushPath(q2.loaded, [lng], ns);
      removePending(q2, name);
      if (err) q2.errors.push(err);
      if (q2.pendingCount === 0 && !q2.done) {
        Object.keys(q2.loaded).forEach((l2) => {
          if (!loaded[l2]) loaded[l2] = {};
          const loadedKeys = q2.loaded[l2];
          if (loadedKeys.length) {
            loadedKeys.forEach((n2) => {
              if (loaded[l2][n2] === void 0) loaded[l2][n2] = true;
            });
          }
        });
        q2.done = true;
        if (q2.errors.length) {
          q2.callback(q2.errors);
        } else {
          q2.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q2) => !q2.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait: wait2,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver2 = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait2 * 2, callback);
        }, wait2);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r2 = fc(lng, ns);
        if (r2 && typeof r2.then === "function") {
          r2.then((data) => resolver2(null, data)).catch(resolver2);
        } else {
          resolver2(null, r2);
        }
      } catch (err) {
        resolver2(err);
      }
      return;
    }
    return fc(lng, ns, resolver2);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s2 = name.split("|");
    const lng = s2[0];
    const ns = s2[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend && this.backend.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r2;
          if (fc.length === 5) {
            r2 = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r2 = fc(languages, namespace, key, fallbackValue);
          }
          if (r2 && typeof r2.then === "function") {
            r2.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r2);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}
const get = () => ({
  debug: false,
  initImmediate: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value2) => value2,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  }
});
const transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
const noop$1 = () => {
};
const bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initImmediate) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options.defaultNS && options.defaultNS !== false && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    if (this.options.compatibilityAPI !== "v1") {
      this.options.interpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation
      };
    }
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else if (typeof Intl !== "undefined") {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s2 = this.services;
      s2.logger = baseLogger;
      s2.resourceStore = this.store;
      s2.languageUtils = lu;
      s2.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s2.formatter = createClassOnDemand(formatter);
        s2.formatter.init(s2, this.options);
        this.options.interpolation.format = s2.formatter.format.bind(s2.formatter);
      }
      s2.interpolator = new Interpolator(this.options);
      s2.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s2.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s2.resourceStore, s2, this.options);
      s2.backendConnector.on("*", function(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s2.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s2.languageDetector.init) s2.languageDetector.init(s2, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s2.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s2.i18nFormat.init) s2.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach((m2) => {
        if (m2.init) m2.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop$1;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language2) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
    let usedCallback = callback;
    const usedLng = isString(language2) ? language2 : this.language;
    if (typeof language2 === "function") usedCallback = language2;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng && usedLng.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l2) => {
          if (l2 === "cimode") return;
          if (toLoad.indexOf(l2) < 0) toLoad.push(l2);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l2) => append(l2));
      } else {
        append(usedLng);
      }
      if (this.options.preload) {
        this.options.preload.forEach((l2) => append(l2));
      }
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop$1;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l2) {
    if (!l2 || !this.languages) return;
    if (["cimode", "dev"].indexOf(l2) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l2) => {
      this.language = l2;
      this.languages = this.services.languageUtils.toResolveHierarchy(l2);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l2);
    };
    const done = (err, l2) => {
      if (l2) {
        setLngProps(l2);
        this.translator.changeLanguage(l2);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l2);
        this.logger.log("languageChanged", l2);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback) callback(err, function() {
        return _this2.t(...arguments);
      });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l2 = isString(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l2) {
        if (!this.language) {
          setLngProps(l2);
        }
        if (!this.translator.language) this.translator.changeLanguage(l2);
        if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l2);
      }
      this.loadResources(l2, (err) => {
        done(err, l2);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k2) => `${options.keyPrefix}${keySeparator}${k2}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l2, n2) => {
      const loadState = this.services.backendConnector.state[`${l2}|${n2}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n2) => {
      if (this.options.ns.indexOf(n2) < 0) this.options.ns.push(n2);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m2) => {
      clone[m2] = this[m2];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      clone.store = new ResourceStore(this.store.data, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", function(event) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
};
const unescapeHtmlEntity = (m2) => htmlEntities[m2];
const unescape = (text2) => text2.replace(matchHtmlEntity, unescapeHtmlEntity);
let defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
  }
};
const {
  slice,
  forEach
} = [];
function defaults(obj) {
  forEach.call(slice.call(arguments, 1), (source) => {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const serializeCookie = function(name, val) {
  let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  };
  const opt = options;
  const value2 = encodeURIComponent(val);
  let str = `${name}=${value2}`;
  if (opt.maxAge > 0) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge)) throw new Error("maxAge should be a Number");
    str += `; Max-Age=${Math.floor(maxAge)}`;
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
};
const cookie = {
  create(name, value2, minutes, domain) {
    let cookieOptions = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    if (minutes) {
      cookieOptions.expires = /* @__PURE__ */ new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1e3);
    }
    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, encodeURIComponent(value2), cookieOptions);
  },
  read(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i2 = 0; i2 < ca.length; i2++) {
      let c2 = ca[i2];
      while (c2.charAt(0) === " ") c2 = c2.substring(1, c2.length);
      if (c2.indexOf(nameEQ) === 0) return c2.substring(nameEQ.length, c2.length);
    }
    return null;
  },
  remove(name) {
    this.create(name, "", -1);
  }
};
var cookie$1 = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(_ref) {
    let {
      lookupCookie
    } = _ref;
    if (lookupCookie && typeof document !== "undefined") {
      return cookie.read(lookupCookie) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupCookie,
      cookieMinutes,
      cookieDomain,
      cookieOptions
    } = _ref2;
    if (lookupCookie && typeof document !== "undefined") {
      cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
    }
  }
};
var querystring = {
  name: "querystring",
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(_ref) {
    var _a;
    let {
      lookupQuerystring
    } = _ref;
    let found;
    if (typeof window !== "undefined") {
      let {
        search: search2
      } = window.location;
      if (!window.location.search && ((_a = window.location.hash) == null ? void 0 : _a.indexOf("?")) > -1) {
        search2 = window.location.hash.substring(window.location.hash.indexOf("?"));
      }
      const query = search2.substring(1);
      const params = query.split("&");
      for (let i2 = 0; i2 < params.length; i2++) {
        const pos = params[i2].indexOf("=");
        if (pos > 0) {
          const key = params[i2].substring(0, pos);
          if (key === lookupQuerystring) {
            found = params[i2].substring(pos + 1);
          }
        }
      }
    }
    return found;
  }
};
let hasLocalStorageSupport = null;
const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
  try {
    hasLocalStorageSupport = typeof window !== "undefined" && window.localStorage !== null;
    if (!hasLocalStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.localStorage.setItem(testKey, "foo");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }
  return hasLocalStorageSupport;
};
var localStorage = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(_ref) {
    let {
      lookupLocalStorage
    } = _ref;
    if (lookupLocalStorage && localStorageAvailable()) {
      return window.localStorage.getItem(lookupLocalStorage) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupLocalStorage
    } = _ref2;
    if (lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(lookupLocalStorage, lng);
    }
  }
};
let hasSessionStorageSupport = null;
const sessionStorageAvailable = () => {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
  try {
    hasSessionStorageSupport = typeof window !== "undefined" && window.sessionStorage !== null;
    if (!hasSessionStorageSupport) {
      return false;
    }
    const testKey = "i18next.translate.boo";
    window.sessionStorage.setItem(testKey, "foo");
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }
  return hasSessionStorageSupport;
};
var sessionStorage$1 = {
  name: "sessionStorage",
  lookup(_ref) {
    let {
      lookupSessionStorage
    } = _ref;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      return window.sessionStorage.getItem(lookupSessionStorage) || void 0;
    }
    return void 0;
  },
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupSessionStorage
    } = _ref2;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(lookupSessionStorage, lng);
    }
  }
};
var navigator$1 = {
  name: "navigator",
  lookup(options) {
    const found = [];
    if (typeof navigator !== "undefined") {
      const {
        languages,
        userLanguage,
        language: language2
      } = navigator;
      if (languages) {
        for (let i2 = 0; i2 < languages.length; i2++) {
          found.push(languages[i2]);
        }
      }
      if (userLanguage) {
        found.push(userLanguage);
      }
      if (language2) {
        found.push(language2);
      }
    }
    return found.length > 0 ? found : void 0;
  }
};
var htmlTag = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(_ref) {
    let {
      htmlTag: htmlTag2
    } = _ref;
    let found;
    const internalHtmlTag = htmlTag2 || (typeof document !== "undefined" ? document.documentElement : null);
    if (internalHtmlTag && typeof internalHtmlTag.getAttribute === "function") {
      found = internalHtmlTag.getAttribute("lang");
    }
    return found;
  }
};
var path = {
  name: "path",
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(_ref) {
    var _a;
    let {
      lookupFromPathIndex
    } = _ref;
    if (typeof window === "undefined") return void 0;
    const language2 = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    if (!Array.isArray(language2)) return void 0;
    const index2 = typeof lookupFromPathIndex === "number" ? lookupFromPathIndex : 0;
    return (_a = language2[index2]) == null ? void 0 : _a.replace("/", "");
  }
};
var subdomain = {
  name: "subdomain",
  lookup(_ref) {
    var _a, _b;
    let {
      lookupFromSubdomainIndex
    } = _ref;
    const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === "number" ? lookupFromSubdomainIndex + 1 : 1;
    const language2 = typeof window !== "undefined" && ((_b = (_a = window.location) == null ? void 0 : _a.hostname) == null ? void 0 : _b.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i));
    if (!language2) return void 0;
    return language2[internalLookupFromSubdomainIndex];
  }
};
let canCookies = false;
try {
  document.cookie;
  canCookies = true;
} catch (e) {
}
const order = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
if (!canCookies) order.splice(1, 1);
const getDefaults = () => ({
  order,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  // cache user language
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'
  convertDetectedLanguage: (l2) => l2
});
class Browser {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector";
    this.detectors = {};
    this.init(services, options);
  }
  init() {
    let services = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    };
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let i18nOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults());
    if (typeof this.options.convertDetectedLanguage === "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1) {
      this.options.convertDetectedLanguage = (l2) => l2.replace("-", "_");
    }
    if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    this.i18nOptions = i18nOptions;
    this.addDetector(cookie$1);
    this.addDetector(querystring);
    this.addDetector(localStorage);
    this.addDetector(sessionStorage$1);
    this.addDetector(navigator$1);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
  }
  addDetector(detector) {
    this.detectors[detector.name] = detector;
    return this;
  }
  detect() {
    let detectionOrder = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order;
    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === "string") lookup = [lookup];
        if (lookup) detected = detected.concat(lookup);
      }
    });
    detected = detected.map((d2) => this.options.convertDetectedLanguage(d2));
    if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected;
    return detected.length > 0 ? detected[0] : null;
  }
  cacheUserLanguage(lng) {
    let caches = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
}
Browser.type = "languageDetector";
const km$8 = "km";
const m$8 = "m";
const to$8 = "to";
const or$2 = "or";
const logout$3 = "Log out";
const save$8 = "Save";
const cancel$8 = "Cancel";
const ok$3 = "OK";
const create$8 = "Create";
const disasters$8 = "Disasters";
const loading$8 = "Loading...";
const preparing_data = "Preparing data";
const loading_events$2 = "Loading disasters";
const legend$8 = "Legend";
const maps$8 = "maps";
const vertical_direction$8 = "Vertical direction";
const horizontal_direction$8 = "Horizontal direction";
const legend_presentation$8 = "Legend presentation";
const layers$8 = "Layers";
const toolbar$8 = {
  map_ruler: "Measure distance",
  locate_me: "Locate me",
  panel_title: "Toolbar",
  download: "Download",
  "delete": "Delete",
  boundary_selector: "Select admin boundary",
  create_layer: "Create layer",
  geometry_uploader: "Upload GeoJSON",
  focused_geometry_editor: "Draw or edit geometry",
  edit_in_osm: "Edit map in OSM",
  record_sensors: "Record sensors",
  tools_label: "Tools",
  selected_area_label: "Selected area",
  upload_mcda: "Upload MCDA"
};
const layer_actions$8 = {
  tooltips: {
    erase: "Erase",
    download: "Download",
    edit: "Edit",
    hide: "Hide",
    show: "Show",
    "delete": "Delete"
  }
};
const feed$8 = "Feed";
const deselect$8 = "Deselect";
const spinner_text$8 = "Gathering data";
const updated$8 = "Updated";
const started$2 = "Started";
const created = "Created";
const mapping_types = "Mapping types";
const osm_gaps = "OSM gaps";
const no_data_received$8 = "No data received";
const wrong_data_received$8 = "Wrong data received";
const error$a = "Error";
const sort_icon$8 = "Sort Icon";
const configs$8 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "The feed contains real-time data about Cyclones, Droughts, Earthquakes, Floods, Volcanoes, Wildfires."
};
const errors$8 = {
  "default": "Sorry, we are having issues which will be fixed soon",
  timeout: "Request timeout",
  cannot_connect: "Cannot connect to server",
  forbidden: "Forbidden",
  not_found: "Not found",
  unknown: "Unknown",
  server_error: "Server error",
  error_try_again: "Something went wrong. Please try again"
};
const categories$8 = {
  overlays: "Overlays",
  basemap: "Basemap"
};
const groups$8 = {
  layers_in_selected_area: "Layers in selected area",
  your_layers: "Your layers",
  kontur_analytics: "Kontur analytics",
  qa: "OpenStreetMap inspector",
  osmbasedmap: "OpenStreetMap based",
  other: "Other",
  elevation: "Elevation",
  photo: "Imagery",
  map: "Map"
};
const advanced_analytics_data_list$8 = {
  load_world_data: "Load World Data",
  numerator: "Numerator",
  normalized_by: "Normalized By",
  sum: "Sum",
  min: "Min",
  max: "Max",
  mean: "Mean",
  stddev: "Stddev",
  median: "Median",
  filter_numerator: "Filter Numerator",
  filter_denominator: "Filter Denominator"
};
const mcda$8 = {
  title: "Multi-criteria decision analysis",
  name: "Create MCDA",
  modal_title: "Multi-criteria decision analysis",
  modal_input_name: "Analysis name",
  modal_input_name_placeholder: "e.g., Climate change",
  modal_input_indicators: "Layer list",
  modal_input_indicators_placeholder: "Select layers",
  modal_input_indicators_no_options: "No options",
  btn_save: "Save analysis",
  error_analysis_name_cannot_be_empty: "Analysis name cannot be empty",
  error_invalid_file: "Invalid MCDA file format",
  error_invalid_parameter: "Invalid '{{parameter}}' parameter",
  error_invalid_layer_parameter: "Invalid '{{parameter}}' parameter in '{{axisName}}' layer",
  error_wrong_mcda_version: "Wrong MCDA version",
  legend_title: "Legend",
  legend_subtitle: "Hexagons are colored based on analysis layer settings. Click a hexagon to see its values.",
  layer_editor: {
    save_changes: "Save changes",
    range: "Value range",
    outliers: "Outliers",
    reverse_to_good_bad: "Reverse to Good → Bad",
    reverse_to_bad_good: "Reverse to Bad → Good",
    weight: "Weight",
    transform: "Transform",
    transformation: "Transformation",
    normalize: "Normalize",
    normalization: "Normalization",
    range_buttons: {
      full_range: "Full range",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    outliers_options: {
      clamp: "Clamp",
      hide: "Hide",
      dont_modify: "Don't modify"
    },
    transformations: {
      no_transformation: "No transformation",
      square_root: "Square root: sign(x)⋅√|x|",
      cube_root: "Cube root: ∛x",
      log_one: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "No",
    max_min: "Max-min",
    errors: {
      weight_cannot_be_empty: "Weight cannot be empty",
      weight_must_be_a_number: "Weight must be a valid number",
      range_from_cannot_be_bigger: "The ‘from’ value cannot be bigger than the ‘to’ value",
      range_cannot_be_empty: "Range cannot be empty",
      range_must_be_a_number: "Range must be a valid number"
    },
    tips: {
      range: "The values that will be considered the worst and the best in your analysis.",
      sentiment: "Determine the direction of sentiment for the layer's impact on the analysis:\n* **Bad → Good**: Higher values indicate a positive sentiment.\n* **Good → Bad**: Higher values indicate a negative sentiment.",
      weight: "By default, all layers contribute equally to the analysis through a weighted average. Adjusting the increased weight of a layer (2, 3, etc.) allows you to assign additional importance to it in the analysis.",
      transform: "Apply calculations to the values. Achieving a more linear distribution will provide more useful information for analysis.\n\n **Note**: Calculations are done before normalization.",
      normalize: "Adjusts values to a standardized scale. This helps compare them easily and make decisions.\n* **Standard score scaling**: This option adjusts values to a standardized scale, ensuring they are all comparable.\n* **No (for specialists only)**: Leaves values unmodified.",
      outliers: "* **Clamp**: Set values above the range to 1 and below the range to 0.\n* **Don’t modify**: Keep 0 and 1 for min and max, but allow outlier scores beyond this range.\n* **Exclude**: Exclude areas where values are out of range."
    }
  },
  bad: "Bad",
  good: "Good"
};
const multivariate$8 = {
  multivariate_analysis: "Multivariate Analysis",
  create_analysis_layer: "Create analysis layer",
  upload_analysis_layer: "Upload analysis layer",
  popup: {
    score_header: "Score {{level}}",
    compare_header: "Compare {{level}}"
  },
  score: "Score",
  compare: "Compare",
  hide_area: "Hide area"
};
const search$8 = {
  search_location: "Search location",
  info_block: "You can search for 📍 locations",
  info_block_with_mcda: "You can search for 📍 locations or ask ✨ AI your question like “Where is dead wood”",
  input_placeholder: "Search",
  input_placeholder_mcda: "Search or ask AI",
  locations_no_result: "No locations found",
  mcda_loading_message: "AI is generating an analysis for you",
  mcda_no_result: "No AI suggestion",
  mcda_error_message: "AI engine did not respond. Please try again later",
  mcda_create_analysis: "Create analysis",
  upload_analysis: "“{{name}}” Multi-Criteria Decision Analysis has been created"
};
const event_list$8 = {
  warning_title: "Cannot filter by map view",
  warning_description: "Map is not ready yet, try later",
  bbox_filter_button: "Filter by map view",
  analytics: {
    affected_people: {
      tooltip: "Affected people",
      value: "No humanitarian impact"
    },
    settled_area_tooltip: "Settled area",
    loss_tooltip: "Estimated loss"
  },
  no_event_in_feed: "The disaster was not found in the current disaster feed",
  no_selected_disaster: "No disaster selected",
  chose_disaster: "Choose disaster",
  no_historical_disasters: "No historical disasters in this area",
  no_feed_disasters: "No disasters in this feed",
  no_feed_disasters_matching_your_filters: "No disasters matching your filters",
  no_disasters: "No disasters",
  severity_unknown: "Unknown",
  severity_termination: "Termination",
  severity_minor: "Minor",
  severity_moderate: "Moderate",
  severity_severe: "Severe",
  severity_extreme: "Extreme",
  open_timeline_button: "Timeline"
};
const create_layer$8 = {
  edit_layer: "Edit Layer",
  edit_features: "Edit Features",
  delete_layer: "Delete Layer",
  create_layer: "Create Layer",
  saving_layer: "Saving layer...",
  field_name: "Field name",
  layer_name: "Layer name",
  marker_icon: "Marker icon",
  type: "Type",
  select: "Select",
  short_text: "Short Text",
  long_text: "Long Text",
  link: "Link",
  image: "Image",
  fields: "Fields",
  add_field: "Add field",
  location: "Location",
  edit_feature_placeholder: "Select some feature for start edit feature properties"
};
const analytics_panel$8 = {
  header_title: "Analytics",
  error_loading: "Failed receiving data about selected area. It may be too large.",
  info_short: "Calculations are made for selected area"
};
const advanced_analytics_panel$8 = {
  header_title: "Advanced analytics",
  error: "Error while fetching advanced analytics data"
};
const advanced_analytics_empty$8 = {
  not_found: "Sorry, the requested disaster was not found",
  error: "An error occurred",
  analytics_for_selected: "Analytics for selected area",
  will_be_provided: "will be provided here",
  no_analytics: "No analytics for the selected area"
};
const llm_analytics$8 = {
  header: "AI insights",
  placeholder: {
    select_area: "Select area (<icon1 />,<icon2 />,<icon3 />) you want to explore to get AI Insights.",
    you_can_also: "You can also:",
    fill_bio: "<icon /> <lnk>Fill out analysis objectives</lnk> to personalize AI analysis",
    select_and_save_as_reference_area: "<icon /> Select an area and save it as a reference to compare with another one",
    learn_more: "<lnk><icon/> Learn more about AI Insights</lnk>"
  }
};
const draw_tools$8 = {
  area: "Polygon",
  line: "Line",
  point: "Point",
  finish_drawing: "Finish Drawing",
  caption: "Click on the map to begin drawing",
  no_geometry_error: "No drawn geometry to download",
  overlap_error: "Polygon should not overlap itself",
  save_features: "Save features"
};
const boundary_selector$8 = {
  title: "Focus to administrative boundary"
};
const geometry_uploader$8 = {
  title: "Focus to uploaded geometry",
  error: "Error while reading uploaded file"
};
const focus_geometry$8 = {
  title: "Focus to freehand geometry"
};
const focus_geometry_layer$3 = {
  settings: {
    name: "Selected area"
  }
};
const reference_area_layer$8 = {
  settings: {
    name: "Reference area"
  }
};
const drawings$3 = {
  self_directions_not_supported: "Self intersections are not supported"
};
const bivariate$8 = {
  panel: {
    header: "Bivariate matrix"
  },
  matrix: {
    caption: {
      base_axis: "Base axis",
      annex_axis: "Annex axis",
      tooltip: {
        p1: "Charts involving the Base and Annex axes help establish a relationship between two data sets.",
        li1: "Annex axis - parameters that we analyse",
        li2: "Base axis - reference point in the analysis",
        b: "Ex: the best location to open a cafe",
        p2: "We can explore the number of eatery places (Annex axis) against Population density (Base axis).",
        p3: "In this scenario, we are first interested in a small number of eatery places, and the number of people in that place gives us additional information."
      }
    },
    header: {
      title: "Choose two layers to explore correlations",
      hint: "Layers and correlations are displayed for the current Selected Area"
    },
    icon: {
      population: "Value divided by Population",
      area_km2: "Value divided by Area",
      total_building_count: "Value divided by Total Buildings Estimate",
      populated_area_km2: "Value divided by Populated Area",
      one: "Without divider",
      roads: "Value divided by Total Roads Length"
    },
    progress: {
      rendering: "Rendering",
      applied: "Applied on the map"
    },
    loading_error: "Unfortunately, we cannot display the matrix. Try refreshing the page or come back later."
  },
  legend: {
    high: "High",
    low: "Low",
    medium: "Medium"
  },
  color_manager: {
    not_defined: "Not defined",
    sentiments_combinations_filter: "Sentiments combinations",
    layers_filter: "Layers",
    no_legends: "There are no legends satisfying the conditions.",
    no_data: "No Data.",
    sentiments_tab: "Sentiments",
    color_legends_tab: "Color Legends",
    layers_tab: "Layers (indicators)"
  }
};
const sidebar$8 = {
  biv_color_manager: "Сolor manager",
  edit_osm: "Edit in OpenStreetMap",
  ruler: "Ruler",
  collapse: "Collapse",
  expand: "Expand",
  icon_alt: "Application logo"
};
const login$8 = {
  email: "Email",
  password: "Password",
  login_button: "Login",
  sign_up: "Sign up",
  logging_in: "Logging in...",
  log_in: "Log in",
  forgot_password: "Forgot password?",
  description: "Please log in to change your settings",
  error: {
    email_empty: "Email cannot be empty",
    email_invalid: "Email has to be valid",
    password: "Password cannot be empty",
    connect: "Could not connect to authentication service"
  }
};
const currency$8 = {
  usd: "USD"
};
const subscription$8 = {
  title: "Plans & Pricing",
  price_summary: "* Billed as ${{pricePerYear}} USD once yearly",
  unauthorized_button: "Sign in to subscribe",
  current_plan_button: "Current plan",
  sales_button: "Contact sales",
  book_demo_button: "Book a demo",
  request_trial_button: "Request trial",
  errors: {
    payment_initialization: "There was an error during payment initialization. Please try again or contact our support"
  },
  success_modal: {
    title: "Success",
    thank_you_for_subscribing: "Thank you for subscribing to our platform!",
    after_the_page_refreshes: "After the page refreshes, you can start using Kontur Atlas"
  }
};
const reports$8 = {
  title: "Disaster Ninja Reports",
  no_data: "No data for this report",
  sorting: "Sorting data...",
  loading: "Loading data",
  open_josm: "Open via JOSM remote control",
  josm_logo_alt: "JOSM logo",
  see_all: "See all reports",
  wrong_id: "Wrong report ID",
  description: "<0>Kontur </0> generates several reports that help validate OpenStreetMap quality. They contain links to areas on <4>osm.org </4> and links to open them in the JOSM editor with enabled remote control for editing."
};
const modes$8 = {
  map: "Map",
  about: "About",
  cookies: "Cookies",
  reports: "Reports",
  report: "Report",
  profile: "Profile",
  privacy: "Privacy",
  terms: "Terms",
  user_guide: "User guide",
  external: {
    upload_imagery: "Upload imagery",
    imagery_catalog: "Imagery catalog"
  }
};
const profile$8 = {
  interfaceTheme: "Theme",
  interfaceLanguage: "Language",
  units: "Units",
  fullName: "Full name",
  email: "Email",
  metric: "metric",
  imperialBeta: "imperial (beta)",
  profileSettingsHeader: "Personalize your experience",
  your_current_job: "your current job",
  area_of_expertise: "area of expertise",
  challenges: "challenges",
  personalization_prompt: "For better personalization, please include details such as:",
  ai_tools_compatibility: "This information is compatible with AI tools",
  improves_analysis: "Improves analysis",
  bio_placeholder: "Bio",
  bio_textarea_placeholder: "e.g. GIS specialist with 5+ years of experience in disaster risk analysis, focused on urban resilience.",
  analysis_objectives: "Analysis objectives",
  objectives_textarea_placeholder: "e.g. Urban planning analysis with a focus on climate resilience. My current challenge is improving flood risk mapping.",
  appSettingsHeader: "Settings",
  your_organization: "Your organization",
  your_contacts: "Your contact info",
  organization_name: "Organization name",
  position: "Position",
  gis_specialists: "GIS specialists in your team",
  saveButton: "Save changes",
  phone_number: "Phone number with country code",
  linkedin: "LinkedIn profile",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Default disaster feed",
  defaultOSMeditor: "Default OpenStreetMap editor (beta)",
  successNotification: "All changes have been applied successfully",
  dont_know: "I don’t know",
  languageOption: {
    en: "English",
    es: "Spanish",
    ar: "Arabic",
    ko: "Korean",
    id: "Indonesian",
    de: "German",
    be: "Belarusian",
    ru: "Russian",
    uk: "Ukrainian"
  },
  reference_area: {
    title: "Reference area",
    freehand_geometry: "Freehand geometry",
    to_replace_reference_area: 'You can redefine your reference area on map. Select an area and click "Save as reference area" on toolbar.\n',
    description: "Save an area you are familiar with as a reference. We will use it as a baseline to compare other areas and explain the differences.",
    set_the_reference_area: "Set area on map",
    tooltip_text: "1.Select an area of interest on the map using the Admin Boundary or Draw Geometry tool. <br/> 2. Click the 'Save as Reference' button on the toolbar.",
    accessing_location: "Accessing your location",
    accessing_location_error: "Error. Try another way.",
    select_location: "Select my current location",
    notification: "Your reference area {{name}} has been saved"
  }
};
const current_event$3 = {
  not_found_request: "Sorry, the requested disaster was not found"
};
const locate_me$8 = {
  get_location_error: "Error while getting location",
  feature_title: "Locate me"
};
const episode$3 = "Timeline";
const loading_episodes$8 = "Loading Episodes";
const zoom_to_world$2 = "Zoom to the whole world";
const cookie_banner$8 = {
  header: "We value your privacy",
  body: "We use absolutely necessary cookies to provide you personalized services and optional cookies to improve {{appName}} and your experience. You can manage cookie settings or withdraw consent to optional cookies at any time.\nFor more information, please, check our [Privacy Policy](about/privacy)",
  decline_all: "Decline optional cookies",
  accept_all: "Accept optional cookies"
};
const live_sensor$8 = {
  start: "Start sensor recording",
  finish: "Stop sensor recording",
  finishMessage: "Recording has been finished",
  startMessage: "Recording has been started",
  noSensorsError: "Your device does not have the required sensors"
};
const layer_features_panel$8 = {
  empty: "Layer features within selected area will be provided here",
  noFeatureSelected: "No layer feature selected",
  chooseFeature: "Choose layer feature",
  listInfo: "The list is filtered by selected area and sorted by project number",
  error_loading: "Failed to load layer features data. Please try again.",
  no_features: "No features found in the selected area."
};
const reference_area$8 = {
  save_as_reference_area: "Save as reference area",
  error_couldnt_save: "Unfortunately, we could not save your reference area. Please try again.",
  selected_area_saved_as_reference_area: "Selected area has been saved as reference area in your profile"
};
const en_common = {
  km: km$8,
  m: m$8,
  to: to$8,
  or: or$2,
  logout: logout$3,
  save: save$8,
  cancel: cancel$8,
  ok: ok$3,
  create: create$8,
  disasters: disasters$8,
  loading: loading$8,
  preparing_data,
  loading_events: loading_events$2,
  legend: legend$8,
  maps: maps$8,
  vertical_direction: vertical_direction$8,
  horizontal_direction: horizontal_direction$8,
  legend_presentation: legend_presentation$8,
  layers: layers$8,
  toolbar: toolbar$8,
  layer_actions: layer_actions$8,
  feed: feed$8,
  deselect: deselect$8,
  spinner_text: spinner_text$8,
  updated: updated$8,
  started: started$2,
  created,
  mapping_types,
  osm_gaps,
  no_data_received: no_data_received$8,
  wrong_data_received: wrong_data_received$8,
  error: error$a,
  sort_icon: sort_icon$8,
  configs: configs$8,
  errors: errors$8,
  categories: categories$8,
  groups: groups$8,
  advanced_analytics_data_list: advanced_analytics_data_list$8,
  mcda: mcda$8,
  multivariate: multivariate$8,
  search: search$8,
  event_list: event_list$8,
  create_layer: create_layer$8,
  analytics_panel: analytics_panel$8,
  advanced_analytics_panel: advanced_analytics_panel$8,
  advanced_analytics_empty: advanced_analytics_empty$8,
  llm_analytics: llm_analytics$8,
  draw_tools: draw_tools$8,
  boundary_selector: boundary_selector$8,
  geometry_uploader: geometry_uploader$8,
  focus_geometry: focus_geometry$8,
  focus_geometry_layer: focus_geometry_layer$3,
  reference_area_layer: reference_area_layer$8,
  drawings: drawings$3,
  bivariate: bivariate$8,
  sidebar: sidebar$8,
  login: login$8,
  currency: currency$8,
  subscription: subscription$8,
  reports: reports$8,
  modes: modes$8,
  profile: profile$8,
  current_event: current_event$3,
  locate_me: locate_me$8,
  episode: episode$3,
  loading_episodes: loading_episodes$8,
  zoom_to_world: zoom_to_world$2,
  cookie_banner: cookie_banner$8,
  live_sensor: live_sensor$8,
  layer_features_panel: layer_features_panel$8,
  reference_area: reference_area$8
};
const km$7 = "km";
const m$7 = "m";
const to$7 = "a";
const maps$7 = "mapas";
const save$7 = "Guardar";
const cancel$7 = "Cancelar";
const mcda$7 = {
  btn_cancel: "Cancelar",
  legend_title: "Leyenda",
  layer_editor: {
    outliers_options: {},
    save_changes: "Guardar cambios",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$7 = "Crear";
const disasters$7 = "Desastres";
const loading$7 = "Cargando...";
const legend$7 = "Leyenda";
const vertical_direction$7 = "Dirección vertical";
const horizontal_direction$7 = "Dirección horizontal";
const legend_presentation$7 = "Presentación de la leyenda";
const layers$7 = "Capas";
const bivariate$7 = {
  color_manager: {
    layers_filter: "Capas",
    not_defined: "No definido",
    sentiments_combinations_filter: "Combinaciones de sentimientos",
    no_legends: "No hay leyendas que cumplan las condiciones.",
    no_data: "No hay datos.",
    sentiments_tab: "Sentimientos",
    color_legends_tab: "Leyendas de colores",
    layers_tab: "Capas (indicadores)"
  },
  matrix: {
    caption: {
      base_axis: "Eje base",
      annex_axis: "Eje anexo",
      tooltip: {
        p1: "Las gráficas que incluyen los ejes base y anexo ayudan a establecer una relación entre dos conjuntos de datos.",
        li1: "Eje anexo: parámetros que analizamos",
        li2: "Eje base: punto de referencia en el análisis",
        b: "Ej.: la mejor ubicación para abrir una cafetería",
        p2: "Podemos explorar el número de locales de comida (eje anexo) frente a la densidad de población (eje base).",
        p3: "En este escenario, en primer lugar nos interesa un número reducido de locales de comida, y la cantidad de personas presentes nos da información adicional."
      }
    },
    header: {
      title: "Elija dos capas para explorar las correlaciones",
      hint: "Las capas y correlaciones se muestran para el área seleccionada actual"
    },
    icon: {
      population: "Valor dividido por la población",
      area_km2: "Valor dividido por el área",
      total_building_count: "Valor dividido por la estimación total de edificios",
      populated_area_km2: "Valor dividido por el área poblada",
      one: "Sin divisor",
      roads: "Valor dividido por la longitud total de las carreteras"
    },
    progress: {
      rendering: "Renderizado",
      applied: "Aplicado en el mapa"
    }
  },
  legend: {
    high: "Alto",
    low: "Bajo",
    medium: "Medio"
  }
};
const toolbar$7 = {
  locate_me: "Localizarme"
};
const locate_me$7 = {
  feature_title: "Localizarme",
  get_location_error: "Error al obtener la ubicación"
};
const layer_actions$7 = {
  tooltips: {}
};
const feed$7 = "Fuente";
const deselect$7 = "Anular la selección";
const spinner_text$7 = "Recopilación de datos";
const updated$7 = "Actualizado";
const no_data_received$7 = "No se han recibido datos";
const wrong_data_received$7 = "Se han recibido datos erróneos";
const error$9 = "Error";
const sort_icon$7 = "Icono de ordenar";
const configs$7 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "El feed contiene datos en tiempo real sobre Ciclones, Sequías, Terremotos, Inundaciones, Volcanes, Incendios forestales."
};
const errors$7 = {
  forbidden: "Prohibido",
  not_found: "No encontrado",
  unknown: "Desconocido"
};
const event_list$7 = {
  severity_unknown: "Desconocido",
  analytics: {
    affected_people: {
      value: "Sin impacto humanitario"
    },
    loss_tooltip: "Pérdida estimada"
  },
  no_selected_disaster: "No se ha seleccionado ningún desastre",
  chose_disaster: "Seleccione el desastre"
};
const categories$7 = {
  overlays: "Superposiciones",
  basemap: "Mapa base"
};
const groups$7 = {
  layers_in_selected_area: "Capas en el área seleccionada",
  other: "Otros",
  elevation: "Elevación",
  map: "Mapa"
};
const modes$7 = {
  map: "Mapa",
  about: "Acerca de",
  reports: "Informes",
  profile: "Perfil"
};
const advanced_analytics_data_list$7 = {
  load_world_data: "Cargar datos mundiales",
  numerator: "Numerador",
  normalized_by: "Normalizado por",
  sum: "Suma",
  min: "Mín.",
  max: "Máx.",
  mean: "Media",
  stddev: "Desv. est.",
  median: "Mediana",
  filter_denominator: "Filtrar Denominador"
};
const profile$7 = {
  saveButton: "Guardar cambios",
  reference_area: {},
  email: "Correo electrónico",
  interfaceTheme: "Tema",
  interfaceLanguage: "Idioma",
  units: "Unidades",
  metric: "métricas",
  imperialBeta: "imperiales (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Ajustes",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Feed de desastres predeterminado",
  defaultOSMeditor: "Editor predeterminado de OpenStreetMap (beta)",
  successNotification: "Todos los cambios se han aplicado correctamente",
  languageOption: {
    en: "Inglés",
    es: "Español",
    ar: "Árabe",
    ko: "Сoreano",
    id: "Indonesio",
    de: "Alemán",
    uk: "Ucranio"
  }
};
const multivariate$7 = {
  popup: {}
};
const search$7 = {
  search_location: "Buscar ubicación"
};
const create_layer$7 = {
  edit_layer: "Editar capa",
  edit_features: "Editar características",
  delete_layer: "Eliminar capa",
  create_layer: "Crear capa",
  saving_layer: "Guardando capa...",
  field_name: "Nombre de campo",
  layer_name: "Nombre de la capa",
  marker_icon: "Icono de marcador",
  type: "Tipo",
  select: "Seleccionar",
  short_text: "Texto corto",
  long_text: "Texto largo",
  link: "Enlace",
  image: "Imagen",
  fields: "Campos",
  add_field: "Agregar campo",
  location: "Ubicación",
  edit_feature_placeholder: "Seleccione una característica para comenzar a editar las propiedades de la misma"
};
const analytics_panel$7 = {
  header_title: "Análisis"
};
const advanced_analytics_panel$7 = {
  header_title: "Análisis avanzado",
  error: "Error en la obtención de datos de análisis Avanzado"
};
const advanced_analytics_empty$7 = {};
const llm_analytics$7 = {
  placeholder: {}
};
const draw_tools$7 = {
  line: "Línea",
  point: "Punto",
  finish_drawing: "Terminar el dibujo",
  caption: "Haga clic en el mapa para empezar a dibujar",
  no_geometry_error: "No hay geometría dibujada para descargar",
  overlap_error: "El polígono no debe superponerse sobre sí mismo",
  save_features: "Guardar características"
};
const boundary_selector$7 = {
  title: "Enfocar en el límite administrativo"
};
const geometry_uploader$7 = {
  title: "Enfocar en la geometría cargada",
  error: "Error al leer el archivo cargado"
};
const focus_geometry$7 = {
  title: "Enfocar en la geometría a mano"
};
const reference_area_layer$7 = {
  settings: {}
};
const sidebar$7 = {
  biv_color_manager: "Administrador de color",
  edit_osm: "Editar en OpenStreetMap",
  ruler: "Regla",
  collapse: "Contraer",
  expand: "Expandir",
  icon_alt: "Logotipo de la aplicación"
};
const login$7 = {
  email: "Correo electrónico",
  password: "Contraseña",
  login_button: "Inicio de sesión",
  sign_up: "Registrarse",
  logging_in: "Iniciando sesión...",
  log_in: "Iniciar sesión",
  description: "Acceda a su cuenta para cambiar los ajustes"
};
const currency$7 = {};
const subscription$7 = {
  errors: {},
  success_modal: {}
};
const reports$7 = {
  title: "Informes de Disaster Ninja",
  no_data: "No hay datos para este informe",
  sorting: "Ordenando datos...",
  loading: "Cargando datos",
  open_josm: "Abrir a través del control remoto JOSM",
  josm_logo_alt: "Logotipo de JOSM",
  see_all: "Ver todos los informes",
  wrong_id: "ID de informe incorrecto",
  description: "<0>Kontur </0> genera una serie de informes útiles para validar la calidad de OpenStreetMap. Contienen enlaces a zonas en <4>osm.org </4> y enlaces para abrirlas en el editor JOSM con control remoto habilitado para la edición."
};
const about$7 = {
  title: "¡Bienvenido a Disaster Ninja!",
  intro: "¿Desea recibir notificaciones sobre desastres en curso? ¿Le interesan los datos de población instantáneos y otros datos analíticos de alguna región del mundo? Disaster Ninja muestra algunas de las capacidades de <2>Kontur</2> para ocuparse de estas necesidades.<br/><br/> Inicialmente la diseñamos como una herramienta de apoyo a los mapeadores de servicios humanitarios. Ahora ha ampliado sus funcionalidades y aplicaciones prácticas. Tanto si trabaja en la gestión de desastres como si construye una ciudad inteligente o realiza investigaciones sobre el cambio climático, Disaster Ninja puede ayudarle a:",
  l1: "1. Estar al día con los últimos eventos peligrosos a nivel mundial.",
  p1: "El panel de Desastres se actualiza continuamente para informarle sobre los acontecimientos en curso. Utiliza la información proporcionada por <2>Kontur Event Feed</2>, a la que también puede acceder a través de la interfaz de la aplicación.",
  l2: "2. Centrarse en su área de interés.",
  p2: "El panel de Herramientas de Dibujo le permite dibujar o subir su propia geometría en el mapa. También puede centrarse en un área o en una unidad administrativa - país, ciudad o región — expuesta a desastres.",
  l3: "3. Recibir análisis de su área de interés.",
  p3: "El panel de Análisis le muestra el número de personas que viven en la zona según <2>Kontur Population</2> y según una estimación de las zonas sin mapear en OpenStreetMap. Los clientes de Kontur tienen acceso a cientos de otros indicadores a través de Advance Analytics.",
  l4: "4. Explorar los datos del mapa y sacar sus propias conclusiones.",
  p4: "El panel Capas le ofrece varias opciones para mostrar dos indicadores en simultáneo en un mapa bivariado, p. ej:, la densidad de población y la distancia a la estación de bomberos más cercana. Utilice las leyendas de colores para evaluar qué áreas requieren atención. <br/>Consejo: en general, el verde indica riesgo bajo / pocas zonas sin mapear, el rojo — riesgo alto / muchas zonas sin mapear.",
  p5: "Además, puede cambiar a Informes en el panel de la izquierda para acceder a los datos sobre posibles errores e inconsistencias en OpenStreetMap y ayudarle a realizar correcciones mapeando la zona correspondiente con el editor JOSM.",
  goToMap: "Ir al mapa ahora",
  p6: "Esperamos que esta herramienta le resulte valiosa. Utilice el chat de Disaster Ninja si tiene alguna pregunta sobre sus funcionalidades y estaremos encantados de ayudarle. También puede contactarnos por correo electrónico en <1>hello@kontur.io</1> si tiene algún comentario o sugerencia para mejorar la herramienta.<br/><br/> Disaster Ninja es un proyecto de código abierto. Encuentre el código en la <8>cuenta de GitHub de Kontur</8>."
};
const loading_episodes$7 = "Cargando episodios";
const cookie_banner$7 = {};
const live_sensor$7 = {};
const layer_features_panel$7 = {};
const reference_area$7 = {};
const es_common = {
  km: km$7,
  m: m$7,
  to: to$7,
  maps: maps$7,
  save: save$7,
  cancel: cancel$7,
  mcda: mcda$7,
  create: create$7,
  disasters: disasters$7,
  loading: loading$7,
  legend: legend$7,
  vertical_direction: vertical_direction$7,
  horizontal_direction: horizontal_direction$7,
  legend_presentation: legend_presentation$7,
  layers: layers$7,
  bivariate: bivariate$7,
  toolbar: toolbar$7,
  locate_me: locate_me$7,
  layer_actions: layer_actions$7,
  feed: feed$7,
  deselect: deselect$7,
  spinner_text: spinner_text$7,
  updated: updated$7,
  no_data_received: no_data_received$7,
  wrong_data_received: wrong_data_received$7,
  error: error$9,
  sort_icon: sort_icon$7,
  configs: configs$7,
  errors: errors$7,
  event_list: event_list$7,
  categories: categories$7,
  groups: groups$7,
  modes: modes$7,
  advanced_analytics_data_list: advanced_analytics_data_list$7,
  profile: profile$7,
  multivariate: multivariate$7,
  search: search$7,
  create_layer: create_layer$7,
  analytics_panel: analytics_panel$7,
  advanced_analytics_panel: advanced_analytics_panel$7,
  advanced_analytics_empty: advanced_analytics_empty$7,
  llm_analytics: llm_analytics$7,
  draw_tools: draw_tools$7,
  boundary_selector: boundary_selector$7,
  geometry_uploader: geometry_uploader$7,
  focus_geometry: focus_geometry$7,
  reference_area_layer: reference_area_layer$7,
  sidebar: sidebar$7,
  login: login$7,
  currency: currency$7,
  subscription: subscription$7,
  reports: reports$7,
  about: about$7,
  loading_episodes: loading_episodes$7,
  cookie_banner: cookie_banner$7,
  live_sensor: live_sensor$7,
  layer_features_panel: layer_features_panel$7,
  reference_area: reference_area$7
};
const km$6 = "كم";
const m$6 = "م";
const to$6 = "إلى";
const maps$6 = "خرائط";
const save$6 = "حفظ";
const cancel$6 = "إلغاء";
const mcda$6 = {
  btn_cancel: "إلغاء",
  legend_title: "عنوان تفسيري",
  layer_editor: {
    outliers_options: {},
    save_changes: "حفظ التغييرات",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$6 = "إنشاء";
const disasters$6 = "كوارث";
const loading$6 = "جارٍ التحميل...";
const legend$6 = "عنوان تفسيري";
const vertical_direction$6 = "الاتجاه الرأسي";
const horizontal_direction$6 = "الاتجاه الأفقي";
const legend_presentation$6 = "عرض العنوان التفسيري";
const layers$6 = "طبقات";
const bivariate$6 = {
  color_manager: {
    layers_filter: "طبقات",
    not_defined: "غير معرف",
    sentiments_combinations_filter: "تركيبات المشاعر",
    no_legends: "لا توجد ملاحظات تفي بالشروط.",
    no_data: "لايوجد بيانات.",
    sentiments_tab: "المشاعر",
    color_legends_tab: "مؤشرات اللون",
    layers_tab: "الطبقات (المؤشرات)"
  },
  matrix: {
    caption: {
      base_axis: "المحور الأساسي",
      annex_axis: "المحور الملحق",
      tooltip: {
        p1: "تساعد المخططات التي تتضمن محوري القاعدة والملحق في إنشاء علاقة بين مجموعتي بيانات.",
        li1: "محور الملحق - المعلمات التي نقوم بتحليلها",
        li2: "المحور الأساسي - النقطة المرجعية في التحليل",
        b: "مثال: أفضل موقع لفتح مقهى",
        p2: "يمكننا استكشاف عدد أماكن المطاعم (المحور الملحق) مقابل الكثافة السكانية (المحور الأساسي).",
        p3: "في هذا السيناريو، نهتم أولاً بعدد صغير من أماكن تناول الطعام ويعطينا عدد الأشخاص في هذا المكان معلومات إضافية."
      }
    },
    header: {
      title: "اختر طبقتين لاستكشاف الارتباطات",
      hint: "يتم عرض الطبقات والارتباطات للمنطقة المحددة الحالية"
    },
    icon: {
      population: "القيمة مقسومة على عدد السكان",
      area_km2: "القيمة مقسومة على المنطقة",
      total_building_count: "القيمة مقسومة على تقدير إجمالي المباني",
      populated_area_km2: "القيمة مقسومة على المنطقة المأهولة",
      one: "بدون فاصل",
      roads: "القيمة مقسومة على إجمالي طول الطرق"
    },
    progress: {
      rendering: "استدعاء",
      applied: "مطبق على الخريطة"
    }
  },
  legend: {
    high: "مرتفع",
    low: "منخفض",
    medium: "متوسط"
  }
};
const toolbar$6 = {
  locate_me: "حدد موقعي"
};
const locate_me$6 = {
  feature_title: "حدد موقعي",
  get_location_error: "حدث خطأ أثناء الحصول على الموقع"
};
const layer_actions$6 = {
  tooltips: {}
};
const feed$6 = "تغذية";
const deselect$6 = "إلغاء";
const spinner_text$6 = "جمع البيانات";
const updated$6 = "تحديث";
const no_data_received$6 = "لم تُستقبل أي بيانات";
const wrong_data_received$6 = "تم استلام بيانات خاطئة";
const error$8 = "خطأ";
const sort_icon$6 = "أيقونة الترتيب";
const configs$6 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "يحتوي الموجز على بيانات فورية عن الأعاصير والجفاف والزلازل والفيضانات والبراكين وحرائق الغابات."
};
const errors$6 = {
  forbidden: "محظور",
  not_found: "لم يتم العثور على",
  unknown: "غير معروف"
};
const event_list$6 = {
  severity_unknown: "غير معروف",
  analytics: {
    affected_people: {
      value: "لا أثر إنساني"
    },
    loss_tooltip: "الخسارة المقدرة"
  },
  no_selected_disaster: "لم يتم اختيار كارثة",
  chose_disaster: "اختر كارثة"
};
const categories$6 = {
  overlays: "تراكميات",
  basemap: "الخريطة الأساسية"
};
const groups$6 = {
  layers_in_selected_area: "طبقات في المنطقة المختارة",
  other: "آخر",
  elevation: "ارتفاع",
  map: "الخريطة"
};
const modes$6 = {
  map: "الخريطة",
  about: "عن",
  reports: "التقارير",
  profile: "الملف الشخصي"
};
const advanced_analytics_data_list$6 = {
  load_world_data: "تحميل بيانات العالم",
  numerator: "البسط",
  normalized_by: "تطبيع بواسطة",
  sum: "مجموع",
  min: "الحد الأدنى",
  max: "الحد الأقصى",
  mean: "المتوسط",
  stddev: "Stddev",
  median: "الوسيط",
  filter_denominator: "مقام المرشح"
};
const profile$6 = {
  saveButton: "حفظ التغييرات",
  reference_area: {},
  email: "البريد الإلكتروني",
  interfaceTheme: "النسق",
  interfaceLanguage: "اللغة",
  units: "الوحدات",
  metric: "المقياس",
  imperialBeta: "إمبريالي (بيتا)",
  bio_placeholder: "السيرة",
  appSettingsHeader: "الإعدادات",
  konturTheme: "Kontur",
  HOTTheme: "حار",
  defaultDisasterFeed: "موجز الكوارث الافتراضي",
  defaultOSMeditor: "محرر OpenStreetMap الافتراضي (بيتا)",
  successNotification: "تم تطبيق جميع التغييرات بنجاح",
  languageOption: {
    en: "الإنجليزية",
    es: "الإسبانية",
    ar: "العربية",
    ko: "الكورية",
    id: "الأندونيسية",
    de: "ألمانية",
    uk: "الأوكرانية"
  }
};
const multivariate$6 = {
  popup: {}
};
const search$6 = {
  search_location: "البحث عن الموقع"
};
const create_layer$6 = {
  edit_layer: "تعديل الطبقة",
  edit_features: "تعديل الميزات",
  delete_layer: "حذف الطبقة",
  create_layer: "خلق الطبقة",
  saving_layer: "حفظ الطبقة...",
  field_name: "اسم المجال",
  layer_name: "اسم الطبقة",
  marker_icon: "رمز العلامة",
  type: "النوع",
  select: "تحديد",
  short_text: "نص قصير",
  long_text: "نص طويل",
  link: "رابط",
  image: "صورة",
  fields: "مجالات",
  add_field: "إضافة مجال",
  location: "موقع",
  edit_feature_placeholder: "حدد بعض الميزات لبدء تحرير خصائص الميزة"
};
const analytics_panel$6 = {
  header_title: "التحليلات"
};
const advanced_analytics_panel$6 = {
  header_title: "تحليلات متقدمة",
  error: "خطأ أثناء جلب بيانات التحليلات المتقدمة"
};
const advanced_analytics_empty$6 = {};
const llm_analytics$6 = {
  placeholder: {}
};
const draw_tools$6 = {
  line: "خط",
  point: "نقطة",
  finish_drawing: "إنهاء الرسم",
  caption: "انقر على الخريطة لبدء الرسم",
  no_geometry_error: "لا يوجد مجسم مرسوم للتنزيل",
  overlap_error: "يجب ألا يتداخل المضلع مع نفسه",
  save_features: "حفظ الميزات"
};
const boundary_selector$6 = {
  title: "التركيز على الحدود الإدارية"
};
const geometry_uploader$6 = {
  title: "التركيز على المجسم المحمل",
  error: "خطأ أثناء قراءة الملف الذي تم تحميله"
};
const focus_geometry$6 = {
  title: "ركز على المجسم الحر"
};
const reference_area_layer$6 = {
  settings: {}
};
const sidebar$6 = {
  biv_color_manager: "مدير الألوان",
  edit_osm: "التعديل في OpenStreetMap",
  ruler: "المسطرة",
  collapse: "إغلاق",
  expand: "فتح",
  icon_alt: "شعار التطبيق"
};
const login$6 = {
  email: "البريد الإلكتروني",
  password: "كلمة السر",
  login_button: "تسجيل الدخول",
  sign_up: "إنشاء حساب",
  logging_in: "جارٍ تسجيل الدخول...",
  log_in: "تسجيل الدخول",
  description: "يرجى تسجيل الدخول لتغيير إعداداتك"
};
const currency$6 = {};
const subscription$6 = {
  errors: {},
  success_modal: {}
};
const reports$6 = {
  title: "تقارير Disaster Ninja",
  no_data: "لا توجد بيانات لهذا التقرير",
  sorting: "جارٍ ترتيب البيانات...",
  loading: "جارٍ تحميل البيانات",
  open_josm: "الفتح من خلال وحدة تحكم JOSM عن بعد",
  josm_logo_alt: "شعار JOSM",
  see_all: "عرض جميع التقارير",
  wrong_id: "معرف التقرير خاطئ",
  description: "ينشئ <0> Kontur</0> عدة تقارير تساعد في التحقق من جودة OpenStreetMap. تحتوي هذه التقارير على روابط لمناطق على <4> osm.org </4> وروابط يمكن فتحها في محرر JOSM مع تمكين التحكم عن بعد للتحرير."
};
const about$6 = {};
const loading_episodes$6 = "جارٍ تجميل الحلقات";
const cookie_banner$6 = {};
const live_sensor$6 = {};
const layer_features_panel$6 = {};
const reference_area$6 = {};
const ar_common = {
  km: km$6,
  m: m$6,
  to: to$6,
  maps: maps$6,
  save: save$6,
  cancel: cancel$6,
  mcda: mcda$6,
  create: create$6,
  disasters: disasters$6,
  loading: loading$6,
  legend: legend$6,
  vertical_direction: vertical_direction$6,
  horizontal_direction: horizontal_direction$6,
  legend_presentation: legend_presentation$6,
  layers: layers$6,
  bivariate: bivariate$6,
  toolbar: toolbar$6,
  locate_me: locate_me$6,
  layer_actions: layer_actions$6,
  feed: feed$6,
  deselect: deselect$6,
  spinner_text: spinner_text$6,
  updated: updated$6,
  no_data_received: no_data_received$6,
  wrong_data_received: wrong_data_received$6,
  error: error$8,
  sort_icon: sort_icon$6,
  configs: configs$6,
  errors: errors$6,
  event_list: event_list$6,
  categories: categories$6,
  groups: groups$6,
  modes: modes$6,
  advanced_analytics_data_list: advanced_analytics_data_list$6,
  profile: profile$6,
  multivariate: multivariate$6,
  search: search$6,
  create_layer: create_layer$6,
  analytics_panel: analytics_panel$6,
  advanced_analytics_panel: advanced_analytics_panel$6,
  advanced_analytics_empty: advanced_analytics_empty$6,
  llm_analytics: llm_analytics$6,
  draw_tools: draw_tools$6,
  boundary_selector: boundary_selector$6,
  geometry_uploader: geometry_uploader$6,
  focus_geometry: focus_geometry$6,
  reference_area_layer: reference_area_layer$6,
  sidebar: sidebar$6,
  login: login$6,
  currency: currency$6,
  subscription: subscription$6,
  reports: reports$6,
  about: about$6,
  loading_episodes: loading_episodes$6,
  cookie_banner: cookie_banner$6,
  live_sensor: live_sensor$6,
  layer_features_panel: layer_features_panel$6,
  reference_area: reference_area$6
};
const km$5 = "킬로미터";
const m$5 = "미터";
const to$5 = "목적지";
const maps$5 = "지도";
const save$5 = "저장";
const cancel$5 = "취소";
const mcda$5 = {
  btn_cancel: "취소",
  legend_title: "범례",
  layer_editor: {
    outliers_options: {},
    save_changes: "변경 사항 저장",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$5 = "생성";
const disasters$5 = "재난";
const loading$5 = "로딩 중...";
const legend$5 = "범례";
const vertical_direction$5 = "수직 방향";
const horizontal_direction$5 = "수평 방향";
const legend_presentation$5 = "범례 표시";
const layers$5 = "레이어";
const bivariate$5 = {
  color_manager: {
    layers_filter: "레이어",
    not_defined: "정의되지 않음",
    sentiments_combinations_filter: "감정 조합",
    no_legends: "조건을 충족하는 범례가 없습니다.",
    no_data: "데이터가 없습니다.",
    sentiments_tab: "감정",
    color_legends_tab: "색상 범례",
    layers_tab: "레이어(지표)"
  },
  matrix: {
    caption: {
      base_axis: "기본 축",
      annex_axis: "보조 축",
      tooltip: {
        p1: "기본 축과 보조 축이 포함된 차트를 통해 두 데이터 세트 간의 관계를 설정할 수 있습니다.",
        li1: "보조 축 - 분석 대상 매개변수",
        li2: "기본 축 - 분석의 기준점",
        b: "예: 카페 개업에 최적의 위치",
        p2: "인구 밀도(기본 축)에 대한 음식점 개수(보조 축)를 알아볼 수 있습니다.",
        p3: "이 경우에는 주로 소수의 음식점에 관심이 있는 것이며, 추가적으로 그 장소에 있는 사람 수를 알아볼 수 있습니다."
      }
    },
    header: {
      title: "상관 관계를 알아보려면 두 개의 레이어를 선택합니다.",
      hint: "레이어와 상관 관계가 현재 선택된 영역에 표시됩니다."
    },
    icon: {
      population: "인구로 나눈 값",
      area_km2: "영역으로 나눈 값",
      total_building_count: "전체 건물 추정치로 나눈 값",
      populated_area_km2: "인구 밀집 지역으로 나눈 값",
      one: "나누지 않음",
      roads: "전체 도로 길이로 나눈 값"
    },
    progress: {
      rendering: "렌더링",
      applied: "지도에 적용됨"
    }
  },
  legend: {
    high: "높음",
    low: "낮음",
    medium: "중간"
  }
};
const toolbar$5 = {
  locate_me: "내 위치 확인"
};
const locate_me$5 = {
  feature_title: "내 위치 확인",
  get_location_error: "위치를 가져오는 중에 오류가 발생했습니다."
};
const layer_actions$5 = {
  tooltips: {}
};
const feed$5 = "피드";
const deselect$5 = "선택 취소";
const spinner_text$5 = "데이터 수집";
const updated$5 = "업데이트됨";
const no_data_received$5 = "수신한 데이터 없음";
const wrong_data_received$5 = "잘못된 데이터 수신";
const error$7 = "오류";
const sort_icon$5 = "정렬 아이콘";
const configs$5 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "피드에는 사이클론, 가뭄, 지진, 홍수, 화산 폭발, 산불에 대한 실시간 데이터가 포함됩니다."
};
const errors$5 = {
  forbidden: "사용할 수 없음",
  not_found: "찾을 수 없음",
  unknown: "알 수 없음"
};
const event_list$5 = {
  severity_unknown: "알 수 없음",
  analytics: {
    affected_people: {
      value: "인도주의적 영향 없음"
    },
    loss_tooltip: "예상 손해"
  },
  no_selected_disaster: "선택된 재난 없음",
  chose_disaster: "재난 선택"
};
const categories$5 = {
  overlays: "오버레이",
  basemap: "백지도"
};
const groups$5 = {
  layers_in_selected_area: "선택 영역 내 레이어",
  other: "기타",
  elevation: "입면도",
  map: "지도"
};
const modes$5 = {
  map: "지도",
  about: "정보",
  reports: "보고서",
  profile: "프로필"
};
const advanced_analytics_data_list$5 = {
  load_world_data: "전 세계 데이터 로드하기",
  numerator: "분자",
  normalized_by: "정규화 기준:",
  sum: "합계",
  min: "최소",
  max: "최대",
  mean: "평균",
  stddev: "표본 표준 편차",
  median: "중앙값",
  filter_denominator: "분모 필터"
};
const profile$5 = {
  saveButton: "변경 사항 저장",
  reference_area: {},
  email: "이메일",
  interfaceTheme: "주제",
  interfaceLanguage: "언어",
  units: "단위",
  metric: "미터법",
  imperialBeta: "영국식 단위(베타)",
  bio_placeholder: "Bio",
  appSettingsHeader: "설정",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "기본 재난 피드",
  defaultOSMeditor: "기본 OpenStreetMap 편집기(베타)",
  successNotification: "모든 변경 사항이 성공적으로 적용되었습니다.",
  languageOption: {
    en: "영어",
    es: "스페인어",
    ar: "아랍어",
    ko: "한국어",
    id: "인도네시아 인",
    de: "독일 말",
    uk: "우크라이나 인"
  }
};
const multivariate$5 = {
  popup: {}
};
const search$5 = {
  search_location: "위치 검색"
};
const create_layer$5 = {
  edit_layer: "레이어 편집",
  edit_features: "특성 편집",
  delete_layer: "레이어 삭제",
  create_layer: "레이어 생성",
  saving_layer: "레이어 저장 중...",
  field_name: "필드 이름",
  layer_name: "레이어 이름",
  marker_icon: "마커 아이콘",
  type: "유형",
  select: "선택",
  short_text: "짧은 텍스트",
  long_text: "긴 텍스트",
  link: "링크",
  image: "이미지",
  fields: "필드",
  add_field: "필드 추가",
  location: "위치",
  edit_feature_placeholder: "일부 특성을 선택하여 특성 속성 편집을 시작하세요."
};
const analytics_panel$5 = {
  header_title: "분석"
};
const advanced_analytics_panel$5 = {
  header_title: "고급 분석",
  error: "고급 분석 데이터를 가져오는 중에 오류가 발생했습니다."
};
const advanced_analytics_empty$5 = {};
const llm_analytics$5 = {
  placeholder: {}
};
const draw_tools$5 = {
  line: "라인",
  point: "점",
  finish_drawing: "그리기 완료",
  caption: "그리기를 시작하려면 지도를 클릭하세요.",
  no_geometry_error: "다운로드할 수 있는 기하 도형이 없습니다.",
  overlap_error: "다각형은 그 자체로 겹치지 않아야 합니다.",
  save_features: "특성 저장"
};
const boundary_selector$5 = {
  title: "행정 경계에 초점 맞추기"
};
const geometry_uploader$5 = {
  title: "업로드된 기하 도형에 초점 맞추기",
  error: "업로드된 파일을 읽는 중 오류가 발생했습니다."
};
const focus_geometry$5 = {
  title: "손으로 직접 그린 기하 도형에 초점 맞추기"
};
const reference_area_layer$5 = {
  settings: {}
};
const sidebar$5 = {
  biv_color_manager: "색상 관리자",
  edit_osm: "OpenStreetMap에서 편집",
  ruler: "눈금자",
  collapse: "접기",
  expand: "펼치기",
  icon_alt: "애플리케이션 로고"
};
const login$5 = {
  email: "이메일",
  password: "비밀번호",
  login_button: "로그인",
  sign_up: "가입",
  logging_in: "로그인 중...",
  log_in: "로그인",
  description: "설정을 변경하려면 로그인하세요."
};
const currency$5 = {};
const subscription$5 = {
  errors: {},
  success_modal: {}
};
const reports$5 = {
  title: "Disaster Ninja 보고서",
  no_data: "이 보고서에 데이터가 없습니다.",
  sorting: "데이터 정렬 중...",
  loading: "데이터 로딩 중",
  open_josm: "JOSM 원격 제어를 통해 열기",
  josm_logo_alt: "JOSM 로고",
  see_all: "모든 보고서 보기",
  wrong_id: "잘못된 보고서 ID",
  description: "<0>Kontur</0>는 몇 가지 보고서를 생성하여 OpenStreetMap 품질을 평가하도록 지원합니다. 보고서에는 <4>osm.org </4>의 영역으로 연결되는 링크, 원격 제어가 활성화된 JOSM 편집기에서 해당 영역을 열어 편집할 수 있는 링크가 포함되어 있습니다."
};
const about$5 = {
  title: "Disaster Ninja에 오신 것을 환영합니다!",
  intro: "현재 진행 중인 재난에 대해 알림을 받아보시겠습니까? 전 세계 모든 지역의 인구 데이터와 기타 분석 사항을 즉시 알아보고 싶으신가요? Disaster Ninja에서는 이러한 요구 사항을 해결하기 위해 몇 가지 <2>Kontur</2> 기능을 사용합니다.<br/><br/>처음에는 인도주의적인 문제를 다루기 위한 의사 결정 지원 도구로 고안되었지만, 이제는 기능과 용법이 여러 가지로 늘어났습니다. 재난 관리, 스마트 시티 구축, 기후 변화에 관한 연구 수행 등 어떤 업무를 하더라도 다음과 같은 도움을 드릴 수 있습니다.",
  l1: "1. 전 세계의 최신 위험 이벤트의 동향을 알려 드립니다.",
  p1: "재난 패널이 지속적으로 새로 고침 되어 현재 일어나는 이벤트에 대한 정보를 제공합니다. <2>Kontur 이벤트 피드</2>의 데이터를 사용하며, API를 통해서도 해당 데이터에 액세스할 수 있습니다.",
  l2: "2. 관심 영역을 집중적으로 보여 드립니다.",
  p2: "그리기 도구 패널을 사용하면 자체 기하 도형을 지도에 그리거나 업로드할 수 있습니다. 재난에 노출된 영역이나 행정 단위(예: 국가, 도시, 지역)에 초점을 맞출 수도 있습니다.",
  l3: "3. 집중 영역에 대한 분석을 제공합니다.",
  p3: "분석 패널은 <2>Kontur 인구</2>당 해당 영역에 거주하는 사람의 수와 OpenStreetMap 내 예상 매핑 갭을 보여줍니다. 그 외에도 Kontur 고객은 고급 분석을 통해 수백 가지 지표에 액세스할 수 있습니다.",
  l4: "4. 지도의 데이터를 탐색하여 결론을 내릴 수 있습니다.",
  p4: "레이어 패널을 사용하면 이변수 지도에서 두 가지 지표를 동시에 표시하는 다양한 옵션을 사용할 수 있게 됩니다(예: 인구 밀도, 가장 가까운 소방서까지의 거리). 색상 범례를 사용하여 주의가 필요한 영역을 평가하세요. <br/>힌트: 일반적으로 녹색은 저위험/적은 갭을 의미하고 빨간색은 고위험/많은 갭을 의미합니다.",
  p5: "또한, 왼쪽 패널의 보고서로 이동하여 OpenStreetMap의 잠재적인 오류 및 불일치 데이터에 액세스하고, JOSM 편집기를 통해 각 영역을 매핑하여 해당 데이터를 수정할 수도 있습니다.",
  goToMap: "지금 바로 지도로 이동하세요.",
  p6: "이 도구가 많은 도움이 되기를 바랍니다. 기능에 대해 궁금한 점은 Disaster Ninja의 챗박스를 통해 언제든지 문의해 주시면 도와 드리겠습니다. 도구 개선에 대한 피드백이나 제안 사항이 있을 경우, <1>hello@kontur.io</1> 로 이메일 주셔도 됩니다.<br/><br/>Disaster Ninja는 오픈 소스 프로젝트입니다. <8>Kontur의 GitHub 계정</8>에서 코드를 찾아보세요."
};
const loading_episodes$5 = "에피소드 로딩 중";
const cookie_banner$5 = {};
const live_sensor$5 = {};
const layer_features_panel$5 = {};
const reference_area$5 = {};
const ko_common = {
  km: km$5,
  m: m$5,
  to: to$5,
  maps: maps$5,
  save: save$5,
  cancel: cancel$5,
  mcda: mcda$5,
  create: create$5,
  disasters: disasters$5,
  loading: loading$5,
  legend: legend$5,
  vertical_direction: vertical_direction$5,
  horizontal_direction: horizontal_direction$5,
  legend_presentation: legend_presentation$5,
  layers: layers$5,
  bivariate: bivariate$5,
  toolbar: toolbar$5,
  locate_me: locate_me$5,
  layer_actions: layer_actions$5,
  feed: feed$5,
  deselect: deselect$5,
  spinner_text: spinner_text$5,
  updated: updated$5,
  no_data_received: no_data_received$5,
  wrong_data_received: wrong_data_received$5,
  error: error$7,
  sort_icon: sort_icon$5,
  configs: configs$5,
  errors: errors$5,
  event_list: event_list$5,
  categories: categories$5,
  groups: groups$5,
  modes: modes$5,
  advanced_analytics_data_list: advanced_analytics_data_list$5,
  profile: profile$5,
  multivariate: multivariate$5,
  search: search$5,
  create_layer: create_layer$5,
  analytics_panel: analytics_panel$5,
  advanced_analytics_panel: advanced_analytics_panel$5,
  advanced_analytics_empty: advanced_analytics_empty$5,
  llm_analytics: llm_analytics$5,
  draw_tools: draw_tools$5,
  boundary_selector: boundary_selector$5,
  geometry_uploader: geometry_uploader$5,
  focus_geometry: focus_geometry$5,
  reference_area_layer: reference_area_layer$5,
  sidebar: sidebar$5,
  login: login$5,
  currency: currency$5,
  subscription: subscription$5,
  reports: reports$5,
  about: about$5,
  loading_episodes: loading_episodes$5,
  cookie_banner: cookie_banner$5,
  live_sensor: live_sensor$5,
  layer_features_panel: layer_features_panel$5,
  reference_area: reference_area$5
};
const km$4 = "km";
const m$4 = "m";
const to$4 = "ke";
const maps$4 = "peta";
const save$4 = "Simpan";
const cancel$4 = "Batalkan";
const mcda$4 = {
  btn_cancel: "Batalkan",
  legend_title: "Legenda",
  layer_editor: {
    outliers_options: {},
    save_changes: "Simpan perubahan",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$4 = "Buat";
const disasters$4 = "Bencana";
const loading$4 = "Memuat...";
const legend$4 = "Legenda";
const vertical_direction$4 = "Arah vertikal";
const horizontal_direction$4 = "Arah horizontal";
const legend_presentation$4 = "Penyajian legenda";
const layers$4 = "Lapisan";
const bivariate$4 = {
  color_manager: {
    layers_filter: "Lapisan",
    not_defined: "Tidak terdefinisi",
    sentiments_combinations_filter: "Gabungan sentimen",
    no_legends: "Tidak ada legenda yang memenuhi kondisi ini.",
    no_data: "Tidak Ada Data.",
    sentiments_tab: "Sentimen",
    color_legends_tab: "Legenda Warna",
    layers_tab: "Lapisan (indikator)"
  },
  matrix: {
    caption: {
      base_axis: "Sumbu Dasar",
      annex_axis: "Sumbu Tambahan",
      tooltip: {
        p1: "Diagram yang mencakup sumbu Dasar dan sumbu Tambahan membantu menetapkan hubungan antara dua kumpulan data.",
        li1: "Sumbu Tambahan - parameter yang kita analisis",
        li2: "Sumbu Dasar - titik referensi dalam analisis",
        b: "Contoh: lokasi terbaik untuk membuka kafe",
        p2: "Kita dapat menyelidiki jumlah tempat makan (sumbu Tambahan) terhadap Kerapatan populasi (sumbu Dasar).",
        p3: "Dalam skenario ini, pada awalnya kita tertarik dengan beberapa tempat makan, lalu kita mendapatkan informasi tambahan dari jumlah orang di tempat itu."
      }
    },
    header: {
      title: "Pilih dua lapisan untuk memeriksa korelasi",
      hint: "Lapisan dan korelasi ditampilkan untuk Area Pilihan terkini"
    },
    icon: {
      population: "Nilai dibagi dengan Populasi",
      area_km2: "Nilai dibagi dengan Area",
      total_building_count: "Nilai dibagi dengan Perkiraan Jumlah Bangunan",
      populated_area_km2: "Nilai dibagi dengan Area Berpenduduk",
      one: "Tanpa pembagi",
      roads: "Nilai dibagi dengan Total Panjang Jalan"
    },
    progress: {
      rendering: "Merender",
      applied: "Diterapkan pada peta"
    }
  },
  legend: {
    high: "Tinggi",
    low: "Rendah",
    medium: "Sedang"
  }
};
const toolbar$4 = {
  locate_me: "Temukan saya"
};
const locate_me$4 = {
  feature_title: "Temukan saya",
  get_location_error: "Kesalahan saat memperoleh lokasi"
};
const layer_actions$4 = {
  tooltips: {}
};
const feed$4 = "Feed";
const deselect$4 = "Batalkan Pilihan";
const spinner_text$4 = "Mengumpulkan data";
const updated$4 = "Diperbarui";
const no_data_received$4 = "Tidak ada data yang diterima";
const wrong_data_received$4 = "Data yang diterima salah";
const error$6 = "Kesalahan";
const sort_icon$4 = "Sortir Ikon";
const configs$4 = {
  Kontur_public_feed: "Publik Kontur",
  Kontur_public_feed_description: "Feed berisi data waktu-nyata tentang Angin Topan, Kekeringan, Gempa, Banjir, Gunung Meletus, Kebakaran Hutan."
};
const errors$4 = {
  forbidden: "Terlarang",
  not_found: "Tidak ditemukan",
  unknown: "Tidak diketahui"
};
const event_list$4 = {
  severity_unknown: "Tidak diketahui",
  analytics: {
    affected_people: {
      value: "Tidak berdampak kemanusiaan"
    },
    loss_tooltip: "Estimasi kerugian"
  },
  no_selected_disaster: "Tidak ada bencana yang dipilih",
  chose_disaster: "Pilih bencana"
};
const categories$4 = {
  overlays: "Tumpang Susun",
  basemap: "Peta Dasar"
};
const groups$4 = {
  layers_in_selected_area: "Lapisan di area pilihan",
  other: "Lainnya",
  elevation: "Elevasi",
  map: "Peta"
};
const modes$4 = {
  map: "Peta",
  about: "Tentang",
  reports: "Laporan",
  profile: "Profil"
};
const advanced_analytics_data_list$4 = {
  load_world_data: "Memuat Data Dunia",
  numerator: "Pembilang",
  normalized_by: "Dinormalkan Dengan",
  sum: "Jumlah",
  min: "Min",
  max: "Maks",
  mean: "Rerata",
  stddev: "Simpangan baku",
  median: "Median",
  filter_denominator: "Filter Penyebut"
};
const profile$4 = {
  saveButton: "Simpan perubahan",
  reference_area: {},
  email: "Email",
  interfaceTheme: "Tema",
  interfaceLanguage: "Bahasa",
  units: "Satuan",
  metric: "metrik",
  imperialBeta: "imperial (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Pengaturan",
  konturTheme: "Kontur",
  HOTTheme: "HANGAT",
  defaultDisasterFeed: "Feed bencana bawaan",
  defaultOSMeditor: "Editor OpenStreetMap bawaan (beta)",
  successNotification: "Semua perubahan telah berhasil diterapkan",
  languageOption: {
    en: "Inggris",
    es: "Spanyol",
    ar: "Arab",
    ko: "Korea",
    id: "Indonesia",
    de: "Jerman",
    uk: "Orang Ukraina"
  }
};
const multivariate$4 = {
  popup: {}
};
const search$4 = {
  search_location: "Cari lokasi"
};
const create_layer$4 = {
  edit_layer: "Edit Lapisan",
  edit_features: "Edit Fitur",
  delete_layer: "Hapus Lapisan",
  create_layer: "Buat Lapisan",
  saving_layer: "Menyimpan lapisan...",
  field_name: "Nama bidang",
  layer_name: "Nama lapisan",
  marker_icon: "Ikon penanda",
  type: "Jenis",
  select: "Pilih",
  short_text: "Teks Singkat",
  long_text: "Teks Panjang",
  link: "Tautan",
  image: "Gambar",
  fields: "Bidang",
  add_field: "Tambahkan bidang",
  location: "Lokasi",
  edit_feature_placeholder: "Pilih beberapa fitur untuk mulai mengedit properti fitur"
};
const analytics_panel$4 = {
  header_title: "Analitik"
};
const advanced_analytics_panel$4 = {
  header_title: "Analitik tingkat lanjut",
  error: "Kesalahan saat mengambil data analitik tingkat lanjut"
};
const advanced_analytics_empty$4 = {};
const llm_analytics$4 = {
  placeholder: {}
};
const draw_tools$4 = {
  line: "Garis",
  point: "Titik",
  finish_drawing: "Selesai Menggambar",
  caption: "Klik peta untuk mulai menggambar",
  no_geometry_error: "Tidak ada gambar geometri untuk diunduh",
  overlap_error: "Poligon tidak boleh bertumpang-tindih sendiri",
  save_features: "Simpan fitur"
};
const boundary_selector$4 = {
  title: "Fokus ke batas administratif"
};
const geometry_uploader$4 = {
  title: "Fokus ke geometri unggahan",
  error: "Kesalahan saat membaca file unggahan"
};
const focus_geometry$4 = {
  title: "Fokus ke geometri bebas"
};
const reference_area_layer$4 = {
  settings: {}
};
const sidebar$4 = {
  biv_color_manager: "Pengelola warna",
  edit_osm: "Edit di OpenStreetMap",
  ruler: "Penggaris",
  collapse: "Ciutkan",
  expand: "Bentangkan",
  icon_alt: "Logo aplikasi"
};
const login$4 = {
  email: "Email",
  password: "Kata Sandi",
  login_button: "Masuk",
  sign_up: "Daftar",
  logging_in: "Masuk...",
  log_in: "Masuk",
  description: "Masuk untuk mengubah pengaturan Anda"
};
const currency$4 = {};
const subscription$4 = {
  errors: {},
  success_modal: {}
};
const reports$4 = {
  title: "Laporan Disaster Ninja",
  no_data: "Tidak ada data untuk laporan ini",
  sorting: "Menyortir data...",
  loading: "Memuat data",
  open_josm: "Buka melalui kendali jarak jaruh JOSM",
  josm_logo_alt: "Logo JOSM",
  see_all: "Lihat semua laporan",
  wrong_id: "ID laporan salah",
  description: "<0>Kontur </0> menghasilkan beberapa laporan yang membantu memvalidasi kualitas OpenStreetMap. Laporan tersebut berisi tautan ke area di <4>osm.org </4> dan tautan untuk membukanya di editor JOSM dengan kendali jarak jauh untuk pengeditan yang diaktifkan."
};
const about$4 = {
  title: "Selamat datang di Disaster Ninja!",
  intro: "Apakah Anda ingin menerima kabar tentang bencana yang sedang terjadi? Anda tertarik dengan data populasi dan analitik lainnya yang tersaji seketika untuk wilayah mana pun di dunia? Disaster Ninja menampilkan beberapa kemampuan dari <2>Kontur</2> dalam mengatasi berbagai kebutuhan ini.<br/><br/>Pada awalnya, kami merancang alat ini sebagai alat bantu untuk pemetaan kemanusiaan. Kini, fungsionalitas dan kasus penggunaannya telah bertambah. Apakah Anda bekerja pada pengelolaan bencana, membangun kota cerdas, ataupun meneliti perubahan iklim, Disaster Ninja dapat membantu Anda untuk:",
  l1: "1. Selalu mendapatkan kabar terbaru tentang kejadian berbahaya terkini di seluruh dunia.",
  p1: "Panel Bencana disegarkan secara terus-menerus untuk memberi tahu Anda kejadian yang sedang berlangsung. Panel ini memakai data dari <2>Feed Kejadian Kontur</2>, yang juga dapat diakses melalui API.",
  l2: "2. Fokus pada area perhatian Anda.",
  p2: "Panel Peralatan Gambar memungkinkan Anda menggambar atau mengunggah geometri Anda sendiri pada peta. Anda juga dapat berfokus pada area yang terpapar bencana atau satuan administratif — negara, kota, atau wilayah.",
  l3: "3. Dapatkan analitik untuk area yang menjadi fokus.",
  p3: "Panel Analitik memperlihatkan jumlah orang yang tinggal di area tersebut untuk setiap <2>Populasi Kontur</2> dan perkiraan kesenjangan pemetaan di OpenStreetMap. Pelanggan Kontur memiliki akses ke ratusan indikator lainnya melalui Analitik Lanjut.",
  l4: "4. Selidiki data pada peta dan buat kesimpulan.",
  p4: "Panel Lapisan memberi Anda berbagai opsi untuk menampilkan dua indikator secara serentak pada peta bivariat, misalnya kepadatan populasi dan jarak ke stasiun pemadam kebakaran terdekat. Gunakan legenda warna untuk menilai area mana yang perlu diperhatikan. <br/>Petunjuk: secara umum, warna hijau menunjukkan risiko rendah/sedikit kesenjangan, warna merah — risiko tinggi/banyak kesenjangan.",
  p5: "Selain itu, Anda dapat beralih ke Laporan di panel kiri untuk mengakses data tentang potensi kesalahan dan inkonsistensi di OpenStreetMap serta membantu memperbaikinya dengan memetakan masing-masing area menggunakan editor JOSM.",
  goToMap: "Buka peta sekarang",
  p6: "Kami berharap agar alat ini bermanfaat bagi Anda. Gunakan kotak obrolan di Disaster Ninja untuk setiap pertanyaan tentang fungsionalitas, dan kami dengan senang hati akan memandu Anda. Anda juga dapat menghubungi kami melalui email di <1>hello@kontur.io</1> jika Anda memiliki tanggapan atau saran untuk meningkatkan alat ini.<br/><br/>Disaster Ninja adalah proyek sumber terbuka. Temukan kodenya di <8>akun GitHub Kontur</8>."
};
const loading_episodes$4 = "Memuat Episode";
const cookie_banner$4 = {};
const live_sensor$4 = {};
const layer_features_panel$4 = {};
const reference_area$4 = {};
const id_common = {
  km: km$4,
  m: m$4,
  to: to$4,
  maps: maps$4,
  save: save$4,
  cancel: cancel$4,
  mcda: mcda$4,
  create: create$4,
  disasters: disasters$4,
  loading: loading$4,
  legend: legend$4,
  vertical_direction: vertical_direction$4,
  horizontal_direction: horizontal_direction$4,
  legend_presentation: legend_presentation$4,
  layers: layers$4,
  bivariate: bivariate$4,
  toolbar: toolbar$4,
  locate_me: locate_me$4,
  layer_actions: layer_actions$4,
  feed: feed$4,
  deselect: deselect$4,
  spinner_text: spinner_text$4,
  updated: updated$4,
  no_data_received: no_data_received$4,
  wrong_data_received: wrong_data_received$4,
  error: error$6,
  sort_icon: sort_icon$4,
  configs: configs$4,
  errors: errors$4,
  event_list: event_list$4,
  categories: categories$4,
  groups: groups$4,
  modes: modes$4,
  advanced_analytics_data_list: advanced_analytics_data_list$4,
  profile: profile$4,
  multivariate: multivariate$4,
  search: search$4,
  create_layer: create_layer$4,
  analytics_panel: analytics_panel$4,
  advanced_analytics_panel: advanced_analytics_panel$4,
  advanced_analytics_empty: advanced_analytics_empty$4,
  llm_analytics: llm_analytics$4,
  draw_tools: draw_tools$4,
  boundary_selector: boundary_selector$4,
  geometry_uploader: geometry_uploader$4,
  focus_geometry: focus_geometry$4,
  reference_area_layer: reference_area_layer$4,
  sidebar: sidebar$4,
  login: login$4,
  currency: currency$4,
  subscription: subscription$4,
  reports: reports$4,
  about: about$4,
  loading_episodes: loading_episodes$4,
  cookie_banner: cookie_banner$4,
  live_sensor: live_sensor$4,
  layer_features_panel: layer_features_panel$4,
  reference_area: reference_area$4
};
const km$3 = "km";
const m$3 = "m";
const to$3 = "bis";
const maps$3 = "Karten";
const save$3 = "Speichern";
const cancel$3 = "Abbrechen";
const mcda$3 = {
  btn_cancel: "Abbrechen",
  legend_title: "Legende",
  layer_editor: {
    outliers_options: {},
    save_changes: "Änderungen speichern",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$3 = "Erstellen";
const disasters$3 = "Katastrophen";
const loading$3 = "Wird geladen...";
const legend$3 = "Legende";
const vertical_direction$3 = "Vertikale Richtung";
const horizontal_direction$3 = "Horizontale Richtung";
const legend_presentation$3 = "Darstellung der Legende";
const layers$3 = "Ebenen";
const bivariate$3 = {
  color_manager: {
    layers_filter: "Ebenen",
    not_defined: "Nicht definiert",
    sentiments_combinations_filter: "Stimmungs-Kombinationen",
    no_legends: "Es gibt keine Legenden, die den Kriterien entsprechen.",
    no_data: "Keine Daten.",
    sentiments_tab: "Stimmungen",
    color_legends_tab: "Farbe Legenden",
    layers_tab: "Ebenen (Indikatoren)"
  },
  matrix: {
    caption: {
      base_axis: "Basisachse",
      annex_axis: "Hilfsachse",
      tooltip: {
        p1: "Diagramme mit der Basis- und der Hilfsachse helfen, eine Beziehung zwischen zwei Datensätzen herzustellen.",
        li1: "Hilfsachse - Parameter, die wir analysieren",
        li2: "Basisachse - Referenzpunkt in der Analyse",
        b: "Beispiel: der beste Standort für die Eröffnung eines Cafés",
        p2: "Wir können die Anzahl der Lokale (Hilfsachse) gegen die Bevölkerungsdichte (Basisachse) untersuchen.",
        p3: "In diesem Szenario liegt unser Interesse zunächst auf einer kleinen Anzahl von Lokalen, wobei uns die Anzahl der Personen in diesem Ort zusätzliche Informationen liefert."
      }
    },
    header: {
      title: "Wählen Sie zwei Ebenen, um Zusammenhänge zu untersuchen",
      hint: "Die Ebenen und Zusammenhänge werden für den aktuellen ausgewählten Bereich angezeigt"
    },
    icon: {
      population: "Wert geteilt durch Einwohnerzahl",
      area_km2: "Wert geteilt durch Fläche",
      total_building_count: "Wert geteilt durch geschätzte Gesamtbebauung",
      populated_area_km2: "Wert geteilt durch bevölkerte Fläche",
      one: "Ohne Teilung",
      roads: "Wert geteilt durch die Gesamtlänge der Straßen"
    },
    progress: {
      rendering: "Übertragung",
      applied: "Wird auf die Karte angewendet"
    }
  },
  legend: {
    high: "Hoch",
    low: "Niedrig",
    medium: "Mittel"
  }
};
const toolbar$3 = {
  locate_me: "Standort finden"
};
const locate_me$3 = {
  feature_title: "Standort finden",
  get_location_error: "Fehler beim Abrufen des Standorts"
};
const layer_actions$3 = {
  tooltips: {}
};
const feed$3 = "Feed";
const deselect$3 = "Auswahl aufheben";
const spinner_text$3 = "Daten sammeln";
const updated$3 = "Aktualisiert";
const no_data_received$3 = "Keine Daten erhalten";
const wrong_data_received$3 = "Falsche Daten empfangen";
const error$5 = "Fehler";
const sort_icon$3 = "Sortiersymbol";
const configs$3 = {
  Kontur_public_feed: "Kontur Öffentlichkeit",
  Kontur_public_feed_description: "Der Feed enthält Echtzeitdaten über Wirbelstürme, Dürren, Erdbeben, Überschwemmungen, Vulkanausbrüche und Waldbrände."
};
const errors$3 = {
  forbidden: "Verboten",
  not_found: "Nicht gefunden",
  unknown: "Unbekannt"
};
const event_list$3 = {
  severity_unknown: "Unbekannt",
  analytics: {
    affected_people: {
      value: "Keine humanitären Auswirkungen"
    },
    loss_tooltip: "Geschätzter Verlust"
  },
  no_selected_disaster: "Keine Katastrophe ausgewählt",
  chose_disaster: "Katastrophe auswählen"
};
const categories$3 = {
  overlays: "Überlagerungen",
  basemap: "Basiskarte"
};
const groups$3 = {
  layers_in_selected_area: "Ebenen im ausgewählten Bereich",
  other: "Andere",
  elevation: "Höhe",
  map: "Karte"
};
const modes$3 = {
  map: "Karte",
  about: "Über uns",
  reports: "Berichte",
  profile: "Profil"
};
const advanced_analytics_data_list$3 = {
  load_world_data: "Weltdaten laden",
  numerator: "Zähler",
  normalized_by: "Normalisiert auf",
  sum: "Summe",
  min: "Min",
  max: "Max",
  mean: "Mittelwert",
  stddev: "SD",
  median: "Median",
  filter_denominator: "Filter Nenner"
};
const profile$3 = {
  saveButton: "Änderungen speichern",
  reference_area: {},
  email: "E-Mail",
  interfaceTheme: "Thema",
  interfaceLanguage: "Sprache",
  units: "Einheiten",
  metric: "metrisch",
  imperialBeta: "imperial (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Einstellungen",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Standardmäßige Katastrophenmeldung",
  defaultOSMeditor: "Standardmäßiger OpenStreetMap-Editor (Beta)",
  successNotification: "Alle Änderungen wurden erfolgreich übernommen",
  languageOption: {
    en: "Englisch",
    es: "Spanisch",
    ar: "Arabisch",
    ko: "Koreanisch",
    id: "Indonesisch",
    de: "Deutsch",
    uk: "Ukrainisch"
  }
};
const multivariate$3 = {
  popup: {}
};
const search$3 = {
  search_location: "Standort suchen"
};
const create_layer$3 = {
  edit_layer: "Ebene bearbeiten",
  edit_features: "Merkmale bearbeiten",
  delete_layer: "Ebene löschen",
  create_layer: "Ebene erstellen",
  saving_layer: "Ebene wird gespeichert...",
  field_name: "Feldname",
  layer_name: "Name der Ebene",
  marker_icon: "Markierungssymbol",
  type: "Typ",
  select: "Auswählen",
  short_text: "Kurzer Text",
  long_text: "Langer Text",
  link: "Link",
  image: "Bild",
  fields: "Felder",
  add_field: "Feld hinzufügen",
  location: "Standort",
  edit_feature_placeholder: "Wählen Sie einige Merkmale aus, um Merkmalseigenschaften zu bearbeiten"
};
const analytics_panel$3 = {
  header_title: "Analytik"
};
const advanced_analytics_panel$3 = {
  header_title: "Erweiterte Analytik",
  error: "Fehler beim Abrufen von erweiterten Analysedaten"
};
const advanced_analytics_empty$3 = {};
const llm_analytics$3 = {
  placeholder: {}
};
const draw_tools$3 = {
  line: "Linie",
  point: "Punkt",
  finish_drawing: "Zeichnen beenden",
  caption: "Klicken Sie auf die Karte, um mit dem Zeichnen zu beginnen",
  no_geometry_error: "Keine gezeichnete Formen zum Herunterladen",
  overlap_error: "Das Polygon darf sich nicht überschneiden",
  save_features: "Merkmale speichern"
};
const boundary_selector$3 = {
  title: "Fokus auf die Verwaltungsgrenze"
};
const geometry_uploader$3 = {
  title: "Fokus auf die hochgeladene geometrische Form",
  error: "Fehler beim Lesen der hochgeladenen Datei"
};
const focus_geometry$3 = {
  title: "Fokus auf freihändig gezeichnete Formen"
};
const reference_area_layer$3 = {
  settings: {}
};
const sidebar$3 = {
  biv_color_manager: "Farbmanager",
  edit_osm: "In OpenStreetMap bearbeiten",
  ruler: "Lineal",
  collapse: "Zusammenklappen",
  expand: "Erweitern",
  icon_alt: "Logo der Anwendung"
};
const login$3 = {
  email: "E-Mail",
  password: "Passwort",
  login_button: "Anmelden",
  sign_up: "Registrieren",
  logging_in: "Anmelden...",
  log_in: "Einloggen",
  description: "Bitte melden Sie sich an, um Ihre Einstellungen zu ändern"
};
const currency$3 = {};
const subscription$3 = {
  errors: {},
  success_modal: {}
};
const reports$3 = {
  title: "Disaster Ninja Berichte",
  no_data: "Keine Daten für diesen Bericht",
  sorting: "Daten werden sortiert...",
  loading: "Daten werden geladen",
  open_josm: "Öffnen über die JOSM-Fernsteuerung",
  josm_logo_alt: "JOSM-Logo",
  see_all: "Alle Berichte anzeigen",
  wrong_id: "Falsche Berichts-ID",
  description: "<0>Kontur </0> generiert verschiedene Berichte, die bei der Überprüfung der Qualität von OpenStreetMap helfen. Sie enthalten Links zu Gebieten auf <4>osm.org </4> und Links, um sie im JOSM-Editor mit aktivierter Fernsteuerung zur Bearbeitung öffnen zu können."
};
const about$3 = {
  title: "Willkommen bei Disaster Ninja!",
  intro: "Möchten Sie über aktuelle Katastrophen informiert werden? Sind Sie an sofortigen Bevölkerungsdaten und anderen Analysen für eine beliebige Region auf der Welt interessiert? Disaster Ninja zeigt Ihnen einige der Funktionen von <2>Kontur</2>, mit denen diese Anforderungen umgesetzt werden können.<br/><br/>Ursprünglich haben wir es als Entscheidungshilfe für Kartografen im humanitären Bereich entwickelt. Mittlerweile ist der Funktionsumfang und der Anwendungsbereich des Programms erweitert worden. Ganz gleich, ob Sie im Katastrophenmanagement tätig sind, eine intelligente Stadt bauen oder über den Klimawandel forschen, Disaster Ninja kann Ihnen dabei helfen:",
  l1: "1. Über die aktuellen Gefahrenereignisse weltweit auf dem Laufenden zu bleiben.",
  p1: "Das Bedienfeld von Disasters wird kontinuierlich aktualisiert, um Sie über aktuelle Ereignisse zu informieren. Es bezieht die Daten aus dem <2>Kontur Ereignis-Feed</2>, auf den Sie auch über eine API zugreifen können.",
  l2: "2. Den Fokus auf Ihr Interessengebiet zu legen.",
  p2: "Mit den Zeichenwerkzeugen können Sie Ihre eigene geometrische Form auf die Karte zeichnen oder hochladen. Sie können sich auch auf ein von einer Katastrophe betroffenes Gebiet oder eine Verwaltungseinheit - ein Land, eine Stadt oder eine Region - konzentrieren.",
  l3: "3. Die Analytik für den ausgewählten Bereich aufrufen.",
  p3: "Das Bedienfeld Analytik zeigt die Anzahl der in diesem Gebiet lebenden Menschen pro <2>Kontur Bevölkerung</2> und geschätzte Kartierungslücken in OpenStreetMap. Kontur-Kunden haben über Erweiterte Analytik Zugang zu Hunderten von weiteren Indikatoren.",
  l4: "4. Die Daten auf der Karte entdecken und Schlussfolgerungen ziehen.",
  p4: "Das Ebenen-Panel bietet Ihnen verschiedene Optionen, um zwei Indikatoren gleichzeitig auf einer bivariaten Karte anzuzeigen, z. B. die Bevölkerungsdichte und die Entfernung zur nächsten Feuerwache. Verwenden Sie die Farblegende, um zu beurteilen, welche Bereiche Aufmerksamkeit erfordern. <br/>Tipp: Im Allgemeinen bedeutet grün ein geringes Risiko / wenige Lücken, rot ein hohes Risiko / viele Lücken.",
  p5: "Außerdem können Sie im linken Bereich zu Berichte wechseln, um auf Daten zu potenziellen Fehlern und Unstimmigkeiten in OpenStreetMap zuzugreifen und dabei zu helfen, diese zu beheben, indem Sie das entsprechende Gebiet mit dem JOSM-Editor kartieren.",
  goToMap: "Jetzt die Karte aufrufen",
  p6: "Wir hoffen, dass dieses Tool Ihnen von Nutzen ist. Wenn Sie Fragen zur Funktionalität haben, können Sie die Chatbox auf Disaster Ninja nutzen, und wir helfen Ihnen gerne weiter. Sie können uns auch eine E-Mail an <1>hello@kontur.io</1> schreiben, wenn Sie Feedback oder Vorschläge zur Verbesserung des Tools haben.<br/><br/>Disaster Ninja ist ein Open-Source-Projekt. Sie finden den Code in <8>Konturs GitHub-Konto</8>."
};
const loading_episodes$3 = "Episoden werden geladen";
const cookie_banner$3 = {};
const live_sensor$3 = {};
const layer_features_panel$3 = {};
const reference_area$3 = {};
const de_common = {
  km: km$3,
  m: m$3,
  to: to$3,
  maps: maps$3,
  save: save$3,
  cancel: cancel$3,
  mcda: mcda$3,
  create: create$3,
  disasters: disasters$3,
  loading: loading$3,
  legend: legend$3,
  vertical_direction: vertical_direction$3,
  horizontal_direction: horizontal_direction$3,
  legend_presentation: legend_presentation$3,
  layers: layers$3,
  bivariate: bivariate$3,
  toolbar: toolbar$3,
  locate_me: locate_me$3,
  layer_actions: layer_actions$3,
  feed: feed$3,
  deselect: deselect$3,
  spinner_text: spinner_text$3,
  updated: updated$3,
  no_data_received: no_data_received$3,
  wrong_data_received: wrong_data_received$3,
  error: error$5,
  sort_icon: sort_icon$3,
  configs: configs$3,
  errors: errors$3,
  event_list: event_list$3,
  categories: categories$3,
  groups: groups$3,
  modes: modes$3,
  advanced_analytics_data_list: advanced_analytics_data_list$3,
  profile: profile$3,
  multivariate: multivariate$3,
  search: search$3,
  create_layer: create_layer$3,
  analytics_panel: analytics_panel$3,
  advanced_analytics_panel: advanced_analytics_panel$3,
  advanced_analytics_empty: advanced_analytics_empty$3,
  llm_analytics: llm_analytics$3,
  draw_tools: draw_tools$3,
  boundary_selector: boundary_selector$3,
  geometry_uploader: geometry_uploader$3,
  focus_geometry: focus_geometry$3,
  reference_area_layer: reference_area_layer$3,
  sidebar: sidebar$3,
  login: login$3,
  currency: currency$3,
  subscription: subscription$3,
  reports: reports$3,
  about: about$3,
  loading_episodes: loading_episodes$3,
  cookie_banner: cookie_banner$3,
  live_sensor: live_sensor$3,
  layer_features_panel: layer_features_panel$3,
  reference_area: reference_area$3
};
const km$2 = "км";
const m$2 = "м";
const to$2 = "до";
const maps$2 = "мапи";
const logout$2 = "Вийти";
const save$2 = "Зберегти";
const cancel$2 = "Скасувати";
const mcda$2 = {
  btn_cancel: "Скасувати",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Приховати"
    },
    save_changes: "Зберегти зміни",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const ok$2 = "OK";
const create$2 = "Створити";
const disasters$2 = "Катастрофа";
const loading$2 = "Завантаження...";
const legend$2 = "Легенда";
const vertical_direction$2 = "По вертикалі";
const horizontal_direction$2 = "По горизонталі";
const legend_presentation$2 = "Презентація легенди";
const layers$2 = "Шари";
const bivariate$2 = {
  color_manager: {
    layers_filter: "Шари",
    not_defined: "Не задано",
    sentiments_combinations_filter: "Комбінація сентиментів",
    no_legends: "Немає легенд, що задовольняють умовам.",
    no_data: "Немає даних.",
    sentiments_tab: "Сентименти",
    color_legends_tab: "Легенда кольорів",
    layers_tab: "Шари (індикатори)"
  },
  panel: {
    header: "Біваріативна Матриця"
  },
  matrix: {
    caption: {
      base_axis: "Базова вісь",
      annex_axis: "Додаткова вісь",
      tooltip: {
        p1: "Діаграми, що містять базову та додаткову осі, допомагають встановити зв’язок між двома наборами даних.",
        li1: "Додаткова вісь - параметри, які ми аналізуємо",
        li2: "Базова вісь - орієнтир при аналізі",
        b: "Наприклад: найкраще місце щоб відкрити кафе",
        p2: "Ми можемо дослідити кількість закладів харчування (додаткова вісь) проти щільності населення (базова вісь).",
        p3: "У цьому сценарії нас спочатку цікавить невелика кількість закладів харчування, а кількість людей у цьому місці дає нам додаткову інформацію."
      }
    },
    header: {
      title: "Виберіть два шари, щоб дослідити їх кореляції",
      hint: "Шари та кореляції показані для виділеної області"
    },
    icon: {
      population: "Значення, поділене на кількість населення",
      area_km2: "Значення, поділене на площу",
      total_building_count: "Значення, поділене на загальну кількість будівель",
      populated_area_km2: "Значення, поділене на заселену площу",
      one: "Без знаменника",
      roads: "Значення, поділене на загальну довжину доріг"
    },
    progress: {
      rendering: "Візуалізація",
      applied: "Нанесено на карту"
    },
    loading_error: "На жаль, ми не можемо показати матрицю. Спробуйте оновити сторінку або зачекать."
  },
  legend: {
    high: "Високий",
    low: "Низький",
    medium: "Середній"
  }
};
const toolbar$2 = {
  map_ruler: "Виміряти відстань",
  locate_me: "Знайти мене",
  panel_title: "Панель інструментів",
  download: "Завантажити",
  "delete": "Видалити",
  boundary_selector: "Вибрати адміністративний кордон",
  create_layer: "Створити шар",
  geometry_uploader: "Завантажити GeoJSON",
  focused_geometry_editor: "Намалювати або редагувати геометрію",
  edit_in_osm: "Редагувати мапу в OpenStreetMap",
  record_sensors: "Записати дані сенсорів",
  tools_label: "Інструменти",
  selected_area_label: "Вибрана область",
  upload_mcda: "Завантажити MCDA"
};
const locate_me$2 = {
  feature_title: "Знайти мене",
  get_location_error: "Помилка під час визначення місцеположення"
};
const layer_actions$2 = {
  tooltips: {
    download: "Завантажити",
    erase: "Стерти",
    edit: "Редагувати",
    hide: "Приховати",
    show: "Показати"
  }
};
const focus_geometry_layer$2 = {
  settings: {
    name: "Вибрана область"
  }
};
const feed$2 = "Стрічка";
const deselect$2 = "Зняти вибір";
const spinner_text$2 = "Збираємо дані";
const updated$2 = "Оновлено";
const no_data_received$2 = "Немає даних";
const wrong_data_received$2 = "Отримано неправильні дані";
const error$4 = "Помилка";
const sort_icon$2 = "Значок сортування";
const configs$2 = {
  Kontur_public_feed_description: "Стрічка містить дані в реальному часі про циклони, посухи, землетруси, повені, вулкани, лісові пожежі."
};
const errors$2 = {
  "default": "Вибачте, у нас виникли проблеми, які незабаром будуть вирішені",
  timeout: "Час очікування запиту минув",
  cannot_connect: "Не вдається під'єднатися до сервера",
  forbidden: "Заборонено",
  not_found: "Не знайдено",
  unknown: "Невідомий",
  server_error: "Помилка серверу",
  error_try_again: "Щось пішло не так. Будь ласка, спробуйте знову"
};
const event_list$2 = {
  severity_unknown: "Невідомий",
  warning_description: "Карта ще не готова, спробуйте пізніше",
  analytics: {
    affected_people: {
      tooltip: "Люди які постраждали",
      value: "Жодного гуманітарного впливу"
    },
    settled_area_tooltip: "Заселений район",
    loss_tooltip: "Орієнтовні збитки"
  },
  no_selected_disaster: "Катастрофа не вибрана",
  chose_disaster: "Виберіть катастрофу",
  no_historical_disasters: "Катастроф на цій території не знайдено",
  no_feed_disasters: "У стрічці немає катастроф",
  no_disasters: "Ніяких катастроф",
  severity_termination: "Припинення",
  severity_minor: "Незначний",
  severity_moderate: "Помірний",
  severity_severe: "Сильний",
  severity_extreme: "Екстримальний",
  open_timeline_button: "Відкрити темпоральну шкалу"
};
const categories$2 = {
  overlays: "Оверлеї",
  basemap: "Базова карта"
};
const groups$2 = {
  layers_in_selected_area: "Шари у вибраній області",
  your_layers: "Ваші шари",
  kontur_analytics: "Аналітика Kontur",
  qa: "Інспектор OpenStreetMap",
  osmbasedmap: "На основі OpenStreetMap",
  other: "Інше",
  elevation: "Рел'єф",
  photo: "Зображення",
  map: "Мапа"
};
const modes$2 = {
  map: "Мапа",
  about: "Про нас",
  reports: "Звіти",
  profile: "Профіль",
  privacy: "Конфіденційність"
};
const advanced_analytics_data_list$2 = {
  load_world_data: "Завантажити дані на всю планету",
  numerator: "Чисельник",
  normalized_by: "Нормалізовано за",
  sum: "Сума",
  min: "Мін.",
  max: "Макс.",
  mean: "Середнє",
  stddev: "Стандартне відхилення",
  median: "Медіана",
  filter_numerator: "Фільтр чисельника",
  filter_denominator: "Фільтр знаменника"
};
const profile$2 = {
  saveButton: "Зберегти зміни",
  reference_area: {},
  email: "Електронна пошта",
  interfaceTheme: "Тема",
  interfaceLanguage: "Мова",
  units: "Одиниці вимірювання",
  metric: "метрична система",
  imperialBeta: "англійська система (бета)",
  bio_placeholder: "Про себе",
  appSettingsHeader: "Налаштування",
  position: "Позиція",
  defaultDisasterFeed: "Стрічка катастроф за замовчуванням",
  defaultOSMeditor: "Редактор OpenStreetMap за замовчуванням (бета)",
  successNotification: "Усі зміни успішно застосовано",
  languageOption: {
    en: "Англійська",
    es: "Іспанська",
    ar: "Арабська",
    ko: "Корейська",
    id: "Індонезійська",
    de: "Німецька",
    be: "Білоруська",
    ru: "Російська",
    uk: "Українська"
  }
};
const multivariate$2 = {
  popup: {}
};
const search$2 = {
  search_location: "Знайти місцеположення",
  mcda_create_analysis: "Створити аналіз"
};
const episode$2 = "Відкрити темпоральну шкалу";
const create_layer$2 = {
  edit_layer: "Редагувати шар",
  edit_features: "Редагувати об'єкт",
  delete_layer: "Видалити шар",
  create_layer: "Створити шар",
  saving_layer: "Зберігаємо зміни...",
  field_name: "Назва поля",
  layer_name: "Назва шару",
  marker_icon: "Значок маркера",
  type: "Тип",
  select: "Вибрати",
  short_text: "Текст(короткий)",
  long_text: "Текст(довгий)",
  link: "Посилання",
  image: "Зображення",
  fields: "Поля",
  add_field: "Додати поле",
  location: "Позиція",
  edit_feature_placeholder: "Виберіть об’єкт для редагування його значень"
};
const analytics_panel$2 = {
  header_title: "Аналітика",
  info_short: "Аналітика для обраної території"
};
const advanced_analytics_panel$2 = {
  header_title: "Розширена аналітика",
  error: "Помилка під час отримання даних розширеної аналітики"
};
const advanced_analytics_empty$2 = {
  not_found: "Вибачте, запитана катастрофа не знайдена",
  error: "Сталася помилка",
  analytics_for_selected: "Аналітика для обраної території",
  will_be_provided: "буде надано тут"
};
const current_event$2 = {
  not_found_request: "Вибачте, запитана катастрофа не знайдена"
};
const llm_analytics$2 = {
  placeholder: {}
};
const draw_tools$2 = {
  line: "Лінія",
  point: "Точка",
  finish_drawing: "Закінчити малювання",
  caption: "Натисніть на карту, щоб почати малювати",
  no_geometry_error: "Немає геометрії для завантаження",
  overlap_error: "Полігон не має перетинати сам себе",
  save_features: "Зберегти об'єкти"
};
const boundary_selector$2 = {
  title: "Фокусувати на адміністративну одиницю"
};
const geometry_uploader$2 = {
  title: "Фокусувати на завантажену геометрію",
  error: "Помилка під час завантаження файлу"
};
const focus_geometry$2 = {
  title: "Фокусувати на намальовану геометрію"
};
const reference_area_layer$2 = {
  settings: {}
};
const drawings$2 = {
  self_directions_not_supported: "Самоперетин не підтримується!"
};
const sidebar$2 = {
  biv_color_manager: "Редактор кольорів",
  edit_osm: "Редагувати в OpenStreetMap",
  ruler: "Лінійка",
  collapse: "Згорнути",
  expand: "Розгорнути",
  icon_alt: "Логотип аплікації"
};
const login$2 = {
  email: "Електронна пошта",
  password: "Пароль",
  login_button: "Логін",
  sign_up: "Зареєструватися",
  logging_in: "Входимо...",
  log_in: "Увійти",
  forgot_password: "Забули пароль?",
  description: "Увійдіть, щоб змінити налаштування",
  error: {
    email_empty: "Електронна пошта не може бути пустою",
    email_invalid: "Електронна пошта має бути коректною",
    password: "Пароль не може бути пустим",
    connect: "Не вдалося під'єднатися до служби аутентифікації"
  }
};
const currency$2 = {};
const subscription$2 = {
  errors: {},
  success_modal: {}
};
const reports$2 = {
  title: "Звіти Disaster Ninja",
  no_data: "Нема даних для звіту",
  sorting: "Сортуємо дані...",
  loading: "Завантажуємо дані",
  open_josm: "Відкрити в JOSM",
  josm_logo_alt: "Логотип JOSM",
  see_all: "Дивитися всі звіти",
  wrong_id: "Неправильний ID звіту",
  description: "<0>Kontur </0> генерує декілька звітів які допомагають перевіряти якість даних OpenStreetMap. Вони містять посилання на <4>osm.org</4> і посилання, щоб відкрити їх у редакторі JOSM для редагування."
};
const about$2 = {
  title: "Вітаємо на Disaster Ninja!",
  intro: "Ви хочете отримувати повідомлення про катастрофи? Вас цікавлять миттєві дані про населення та інша аналітика для будь-якого регіону світу? Disaster Ninja від <2>Kontur</2> може задовольнити ці потреби.<br/><br/> Ми розробили це як інструмент підтримки прийняття рішень для гуманітарних картографів. Тепер його функціональність зросла. Незалежно від того, чи працюєте ви в сфері боротьби зі стихійними лихами, будуєте розумне місто чи проводите дослідження щодо зміни клімату, Disaster Ninja може вам допомогти:",
  l1: "1. Будьте в курсі останніх катастроф у всьому світі.",
  p1: "Панель Катастроф постійно оновлюється, щоб інформувати вас про поточні події. Дані отримані з каналу подій <2>Kontur</2>, до якого також можна отримати доступ через API.",
  l2: "2. Фокусуйтеся на вашій сфері інтересів.",
  p2: 'Панель "Інструменти малювання" дозволяє малювати або завантажувати власну геометрію на карту. Ви також можете фокусуватися на області, що постраждала від стихійного лиха, або на адміністративній одиниці — країна, район чи місто.',
  l3: "3. Отримайте аналітику для вибраної області.",
  p3: "Панель Аналітика показує кількість людей, які проживають у цьому регіоні на основі <2>населення Kontur</2> і потенційні прогалини картографування в OpenStreetMap. Клієнти Kontur мають доступ до сотень інших показників за допомогою Детальної Аналітики.",
  l4: "4. Досліджуйте дані на карті та робіть висновки.",
  p4: 'Панель "Шари" надає різні параметри для одночасного відображення двох індикаторів на карті, наприклад, щільність населення та відстань до найближчої пожежної частини. Використовуйте легенду кольорів, щоб визначити, які області потребують уваги. <br/>Підказка: загалом зелений колір означає низький ризик / мало прогалин, червоний — високий ризик / багато прогалин.',
  p5: "Крім того, ви можете перейти до звітів на лівій панелі, щоб отримати доступ до даних про потенційні помилки та невідповідності в даних OpenStreetMap і допомогти їх виправити, наприклад за допомогою редактора JOSM.",
  goToMap: "Перейти до мапи",
  p6: "Ми сподіваємося, що цей інструмент буде корисний. Використовуйте вікно чату на Disaster Ninja, щоб задати будь-які запитання щодо функціональності, і ми з радістю допоможемо вам. Ви також можете зв’язатися з нами електронною поштою <1>hello@kontur.io</1> якщо у вас є відгуки чи пропозиції щодо вдосконалення інструменту.<br/><br/> Disaster Ninja є проєктом з відкритим кодом. Дивіться код в обліковому записі GitHub <8>Kontur</8>."
};
const loading_episodes$2 = "Завантаження епізодів";
const cookie_banner$2 = {
  header: "Ми цінуємо вашу приватність",
  body: "Ми використовуємо абсолютно необхідні файли cookies, щоб надавати вам персоналізовані послуги, і додаткові файли cookies, щоб покращити Disaster Ninja та ваш досвід. Ви можете будь-коли змінити налаштування файлів cookies або відкликати згоду на використання додаткових файлів cookies.\nЩоб дізнатися більше, перегляньте нашу [Політику конфіденційності](about/privacy)",
  decline_all: "Відхилити файли cookies",
  accept_all: "Прийняти файли cookies"
};
const live_sensor$2 = {
  start: "Почати запис даних з сенсорів",
  finish: "Зупинити запис даних з сенсорів",
  finishMessage: "Запис даних завершенно",
  startMessage: "Запис даних розпочато",
  noSensorsError: "Ваш пристрій не має необхідних сенсорів"
};
const layer_features_panel$2 = {};
const reference_area$2 = {};
const uk_common = {
  km: km$2,
  m: m$2,
  to: to$2,
  maps: maps$2,
  logout: logout$2,
  save: save$2,
  cancel: cancel$2,
  mcda: mcda$2,
  ok: ok$2,
  create: create$2,
  disasters: disasters$2,
  loading: loading$2,
  legend: legend$2,
  vertical_direction: vertical_direction$2,
  horizontal_direction: horizontal_direction$2,
  legend_presentation: legend_presentation$2,
  layers: layers$2,
  bivariate: bivariate$2,
  toolbar: toolbar$2,
  locate_me: locate_me$2,
  layer_actions: layer_actions$2,
  focus_geometry_layer: focus_geometry_layer$2,
  feed: feed$2,
  deselect: deselect$2,
  spinner_text: spinner_text$2,
  updated: updated$2,
  no_data_received: no_data_received$2,
  wrong_data_received: wrong_data_received$2,
  error: error$4,
  sort_icon: sort_icon$2,
  configs: configs$2,
  errors: errors$2,
  event_list: event_list$2,
  categories: categories$2,
  groups: groups$2,
  modes: modes$2,
  advanced_analytics_data_list: advanced_analytics_data_list$2,
  profile: profile$2,
  multivariate: multivariate$2,
  search: search$2,
  episode: episode$2,
  create_layer: create_layer$2,
  analytics_panel: analytics_panel$2,
  advanced_analytics_panel: advanced_analytics_panel$2,
  advanced_analytics_empty: advanced_analytics_empty$2,
  current_event: current_event$2,
  llm_analytics: llm_analytics$2,
  draw_tools: draw_tools$2,
  boundary_selector: boundary_selector$2,
  geometry_uploader: geometry_uploader$2,
  focus_geometry: focus_geometry$2,
  reference_area_layer: reference_area_layer$2,
  drawings: drawings$2,
  sidebar: sidebar$2,
  login: login$2,
  currency: currency$2,
  subscription: subscription$2,
  reports: reports$2,
  about: about$2,
  loading_episodes: loading_episodes$2,
  cookie_banner: cookie_banner$2,
  live_sensor: live_sensor$2,
  layer_features_panel: layer_features_panel$2,
  reference_area: reference_area$2
};
const km$1 = "км";
const m$1 = "м";
const to$1 = "да";
const or$1 = "ці";
const maps$1 = "Мапы";
const logout$1 = "Выйсці";
const save$1 = "Захаваць";
const cancel$1 = "Адмяніць";
const mcda$1 = {
  btn_cancel: "Адмяніць",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Схаваць",
      clamp: "Абмежаваць",
      dont_modify: "Не змяняць"
    },
    save_changes: "Захаваць змены",
    range: "Дыяпазон значэнняў",
    outliers: "Выбітныя значэнні",
    reverse_to_good_bad: "Перавярнуць на Добра → Дрэнна",
    reverse_to_bad_good: "Перавярнуць на Дрэнна → Добра",
    weight: "Вага",
    transform: "Трансфармаваць",
    transformation: "Трансфармацыя",
    normalize: "Нармалізаваць",
    normalization: "Нармалізацыя",
    range_buttons: {
      full_range: "Поўны дыяпазон",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    transformations: {
      no_transformation: "Без трансфармацыі",
      square_root: "Квадратны корань: sign(x)⋅√|x|",
      cube_root: "Кубічны корань: ∛x",
      log: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "Без нармалізацыі",
    max_min: "Максімум-мінімум",
    errors: {
      weight_cannot_be_empty: "Вага не можа быць пустой",
      weight_must_be_a_number: "Вага павінна быць лікам",
      range_from_cannot_be_bigger: "Значэнне ‘ад’ не можа быць большым за значэнне ‘да’",
      range_cannot_be_empty: "Дыяпазон не можа быць пустым",
      range_must_be_a_number: "Дыяпазон павінен быць лікам"
    },
    tips: {
      range: "Значэнні, якія будуць лічыцца найгоршымі і найлепшымі ў вашым аналізе.",
      sentiment: "Вызначце кірунак уздзеяння для аналізу:\n* **Дрэнна → Добра**: Больш высокія значэнні паказваюць на станоўчы напрамак.\n* **Добра → Дрэнна**: Больш высокія значэнні паказваюць на адмоўны напрамак.",
      weight: "Па змаўчанні ўсе слаі аднолькава ўплываюць на аналіз праз узважаную сярэднюю. Павелічэнне вагі слоя (напрыклад, 2, 3 і г.д.) дазваляе вам надаць яму большую важкасць у аналізе.",
      transform: "Прымяняйце разлікі да значэнняў. Атрыманне больш лінейнага размеркавання забяспечыць карысную інфармацыю для аналізу.\n\n **Заўвага**: Разлікі выконваюцца перад нармалізацыяй.",
      normalize: "Прыводзіць значэнні да стандартызаванай шкалы. Гэта дапамагае лёгка параўноўваць іх і прымаць рашэнні.\n* **Стандартная шкала адзнак**: Гэты варыянт прыводзіць значэнні да стандартызаванай шкалы, робячы іх супастаўнымі.\n* **Не (толькі для спецыялістаў)**: Пакідае значэнні без змен.",
      outliers: "* **Абмежаваць**: Задаць значэнні вышэй за дыяпазон як 1, ніжэй — як 0.\n* **Не змяняць**: Захаваць 0 і 1 як мінімум і максімум, але дапускаць значэнні за межамі гэтага дыяпазону.\n* **Выключыць**: Выключыць з аналізу вобласці, дзе значэнні выходзяць за межы дыяпазону."
    }
  },
  title: "Шматкрытэрыяльны аналіз",
  modal_title: "Шматкрытэрыяльны аналіз",
  name: "Стварыць аналіз",
  modal_input_name: "Назва аналізу",
  modal_input_name_placeholder: "Напрыклад, Кліматычныя змены",
  modal_input_indicators: "Спіс слаёў",
  modal_input_indicators_placeholder: "Абраць слаі",
  modal_input_indicators_no_options: "Няма варыянтаў",
  btn_save: "Захаваць аналіз",
  error_analysis_name_cannot_be_empty: "Назва аналізу не можа быць пустой",
  error_bad_layer_data: "Няправільныя даныя слоя шматкрытэрыяльнага аналізу",
  error_invalid_file: "Няправільны фармат файла шматкрытэрыяльнага аналізу",
  error_invalid_parameter: "Няправільны параметр '{{parameter}}'",
  error_invalid_layer_parameter: "Няправільны параметр '{{parameter}}' у слоі '{{axisName}}'",
  error_wrong_mcda_version: "Няправільная версія MCDA",
  legend_subtitle: "Шасцікутнікі афарбаваны згодна з наладамі аналітычных слаёў. Націсніце на шасцікутнік, каб убачыць яго значэнні.",
  bad: "Дрэнна",
  good: "Добра"
};
const ok$1 = "ОК";
const create$1 = "Стварыць";
const disasters$1 = "Катастрофы";
const loading$1 = "Загрузка...";
const loading_events$1 = "Загрузка катастроф";
const legend$1 = "Легенда";
const vertical_direction$1 = "Вертыкальны напрамак";
const horizontal_direction$1 = "Гарызантальны напрамак";
const legend_presentation$1 = "Адлюстраванне легенды";
const layers$1 = "Слаі";
const bivariate$1 = {
  color_manager: {
    layers_filter: "Слаі",
    not_defined: "Не вызначана",
    sentiments_combinations_filter: "Спалучэнні напрамкаў",
    no_legends: "Няма легенд, якія адпавядаюць умовам.",
    no_data: "Няма даных",
    sentiments_tab: "Напрамак",
    color_legends_tab: "Каляровыя легенды",
    layers_tab: "Слаі (індыкатары)"
  },
  panel: {
    header: "Біварыятыўная матрыца"
  },
  matrix: {
    caption: {
      base_axis: "Базавая вось",
      annex_axis: "Дапаможная вось",
      tooltip: {
        p1: "Графікі, якія выкарыстоўваюць базавую і дапаможную восі, дапамагаюць вызначыць сувязь паміж двума наборамі даных.",
        li1: "Дапаможная вось - параметры, якія мы аналізуем",
        li2: "Базавая вось - апорная кропка ў аналізе",
        b: "Напрыклад: найлепшае месца для адкрыцця кавярні",
        p2: "Мы можам даследаваць колькасць месцаў грамадскага харчавання (дапаможная вось) у параўнанні са шчыльнасцю насельніцтва (базавая вось).",
        p3: "У гэтым выпадку нас найперш цікавіць невялікая колькасць месцаў грамадскага харчавання, а колькасць людзей у гэтым месцы дае дадатковую інфармацыю."
      }
    },
    header: {
      title: "Выберыце два слоя для даследавання карэляцый",
      hint: "Слаі і карэляцыі адлюстроўваюцца для вылучанай вобласці"
    },
    icon: {
      population: "Значэнне, падзеленае на насельніцтва",
      area_km2: "Значэнне, падзеленае на плошчу",
      total_building_count: "Значэнне, падзеленае на агульную колькасць будынкаў",
      populated_area_km2: "Значэнне, падзеленае на заселеную тэрыторыю",
      one: "Без дзялення",
      roads: "Значэнне, падзеленае на агульную даўжыню дарог"
    },
    progress: {
      rendering: "Адмалёўка",
      applied: "Ужыта на карце"
    },
    loading_error: "На жаль, мы не можам адлюстраваць матрыцу. Паспрабуйце абнавіць старонку ці вярнуцца пазней."
  },
  legend: {
    high: "Высокі",
    low: "Нізкі",
    medium: "Сярэдні"
  }
};
const toolbar$1 = {
  map_ruler: "Вымераць адлегласць",
  locate_me: "Вызначыць маё месцазнаходжанне",
  panel_title: "Панэль інструментаў",
  download: "Спампаваць",
  "delete": "Выдаліць",
  boundary_selector: "Вылучыць адміністрацыйную мяжу",
  create_layer: "Стварыць слой",
  geometry_uploader: "Загрузіць GeoJSON",
  focused_geometry_editor: "Маляваць або рэдагаваць геаметрыю",
  edit_in_osm: "Рэдагаваць мапу ў OSM",
  record_sensors: "Запісваць даныя датчыкаў",
  tools_label: "Інструменты",
  selected_area_label: "Вылучаная вобласць",
  upload_mcda: "Загрузіць аналіз"
};
const locate_me$1 = {
  feature_title: "Вызначыць маё месцазнаходжанне",
  get_location_error: "Памылка пры атрыманні месцазнаходжання"
};
const layer_actions$1 = {
  tooltips: {
    download: "Спампаваць",
    erase: "Сцерці",
    edit: "Рэдагаваць",
    hide: "Схаваць",
    show: "Паказаць"
  }
};
const focus_geometry_layer$1 = {
  settings: {
    name: "Вылучаная вобласць"
  }
};
const feed$1 = "Стужка";
const deselect$1 = "Зняць вылучэнне";
const spinner_text$1 = "Збор даных";
const updated$1 = "Абноўлена";
const started$1 = "Пачалося";
const no_data_received$1 = "Даныя не атрыманы";
const wrong_data_received$1 = "Атрыманы памылковыя даныя";
const error$3 = "Памылка";
const sort_icon$1 = "Сартаванне";
const configs$1 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "Стужка змяшчае даныя ў рэжыме рэальнага часу аб цыклонах, засухах, землятрусах, паводках, вулканах і лясных пажарах."
};
const errors$1 = {
  "default": "Прабачце, узніклі праблемы, якія хутка будуць выпраўлены",
  timeout: "Час чакання запыту скончыўся",
  cannot_connect: "Не атрымалася злучыцца з серверам",
  forbidden: "Забаронена",
  not_found: "Не знойдзена",
  unknown: "Невядома",
  server_error: "Памылка сервера",
  error_try_again: "Нешта пайшло не так. Калі ласка, паспрабуйце зноў"
};
const event_list$1 = {
  severity_unknown: "Невядома",
  warning_title: "Немагчыма адфільтраваць па віду мапы",
  warning_description: "Мапа яшчэ не гатовая, паспрабуйце пазней",
  bbox_filter_button: "Адфільтраваць па віду мапы",
  analytics: {
    affected_people: {
      tooltip: "Пацярпелыя людзі",
      value: "Няма гуманітарных наступстваў"
    },
    settled_area_tooltip: "Заселеная тэрыторыя",
    loss_tooltip: "Прыблізныя страты"
  },
  no_event_in_feed: "Катастрофа не была знойдзеная ў цякучай стужцы катастроф",
  no_selected_disaster: "Катастрофа не выбрана",
  chose_disaster: "Выбраць катастрофу",
  no_historical_disasters: "Няма гістарычных катастроф у дадзеным раёне",
  no_feed_disasters: "Няма катастроф у гэтай стужцы",
  no_feed_disasters_matching_your_filters: "Няма катастроф, што адпавядаюць вашым фільтрам",
  no_disasters: "Няма катастроф",
  severity_termination: "Спыненне",
  severity_minor: "Нязначная",
  severity_moderate: "Умераная",
  severity_severe: "Сур'ёзная",
  severity_extreme: "Экстрэмальная",
  open_timeline_button: "Часавая шкала"
};
const categories$1 = {
  overlays: "Оверлэі",
  basemap: "Базавая мапа"
};
const groups$1 = {
  layers_in_selected_area: "Слаі ў вылучанай зоне",
  your_layers: "Вашы слаі",
  kontur_analytics: "Аналітыка Kontur",
  qa: "Інспектар OpenStreetMap",
  osmbasedmap: "На аснове OpenStreetMap",
  other: "Іншае",
  elevation: "Вышыня",
  photo: "Здымкі",
  map: "Мапа"
};
const modes$1 = {
  map: "Мапа",
  about: "Пра сервіс",
  cookies: "Файлы cookie",
  reports: "Справаздачы",
  report: "Справаздача",
  profile: "Профіль",
  privacy: "Прыватнасць",
  terms: "Умовы",
  user_guide: "Дапаможнік"
};
const advanced_analytics_data_list$1 = {
  load_world_data: "Загрузіць сусветныя даныя",
  numerator: "Лічнік",
  normalized_by: "Нармалізавана па",
  sum: "Сума",
  min: "Мінімум",
  max: "Максімум",
  mean: "Сярэдняе",
  stddev: "Стандартнае адхіленне",
  median: "Медыяна",
  filter_numerator: "Фільтр па лічніку",
  filter_denominator: "Фільтр па назоўніку"
};
const profile$1 = {
  saveButton: "Захаваць змены",
  reference_area: {
    title: "Эталонная вобласць",
    freehand_geometry: "Адвольная геаметрыя",
    to_replace_reference_area: 'Вы можаце пераназначыць вашу эталонную вобласць на карце. Вылучыце вобласць і націсніце "Захаваць як эталонную вобласць" у панэлі інструментаў.\n',
    description: "Захавайце знаёмую вам вобласць як эталонную. Мы будзем выкарыстоўваць яе як падставу для параўнання іншых абласцей і тлумачэння адрозненняў.",
    set_the_reference_area: "Вылучыць вобласць на карце",
    tooltip_text: "1. Вылучыце вобласць цікавасці на карце, выкарыстоўваючы інструменты 'Адміністрацыйныя межы' або 'Маляванне геаметрыі'. <br/> 2. Націсніце кнопку 'Захаваць як эталонную вобласць' у панэлі інструментаў.",
    accessing_location: "Атрыманне вашага месцазнаходжання",
    accessing_location_error: "Памылка. Паспрабуйце іншы спосаб.",
    select_location: "Абраць маю цякучае месцазнаходжанне",
    notification: "Ваша эталонная вобласць {{name}} была захаваная"
  },
  email: "Электронная пошта",
  interfaceTheme: "Тэма",
  interfaceLanguage: "Мова",
  units: "Адзінкі вымярэння",
  fullName: "Поўнае імя",
  metric: "метрычная сістэма",
  imperialBeta: "імперская сістэма (бэта)",
  profileSettingsHeader: "Наладзьце свой вопыт выкарыстання",
  your_current_job: "ваша цяперашняя праца",
  area_of_expertise: "сфера дзейнасці",
  challenges: "праблемы",
  personalization_prompt: "Для лепшай персаналізацыі, калі ласка, пазначце наступнае:",
  ai_tools_compatibility: "Гэтая інфармацыя сумяшчальная з інструментамі AI",
  improves_analysis: "Паляпшае аналіз",
  bio_placeholder: "Аб сабе",
  bio_textarea_placeholder: "Напрыклад, спецыяліст у галіне ГІС з 5+ гадамі вопыту ў аналізе рызыкаў катастроф, арыентаваны на гарадскую ўстойлівасць.",
  analysis_objectives: "Мэты аналізу",
  objectives_textarea_placeholder: "Напрыклад, аналіз гарадскога планавання з акцэнтам на кліматычную ўстойлівасць. Мая цяперашняя задача — паляпшэнне картаграфавання рызыкаў паводак.",
  appSettingsHeader: "Налады",
  your_organization: "Ваша арганізацыя",
  your_contacts: "Вашыя кантактныя даныя",
  organization_name: "Назва арганізацыі",
  position: "Пасада",
  gis_specialists: "ГІС-спецыялісты ў вашай камандзе",
  phone_number: "Нумар тэлефона з кодам краіны",
  linkedin: "Профіль у LinkedIn",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Стужка катастроф па змаўчанні",
  defaultOSMeditor: "Рэдактар OpenStreetMap па змаўчанні (бэта)",
  successNotification: "Усе змены былі паспяхова захаваны",
  dont_know: "Я не ведаю",
  languageOption: {
    en: "Англійская",
    es: "Іспанская",
    ar: "Арабская",
    ko: "Карэйская",
    id: "Інданезійская",
    de: "Нямецкая",
    be: "Беларуская",
    ru: "Руская",
    uk: "Украінская"
  }
};
const multivariate$1 = {
  upload_analysis_layer: "Загрузіць аналітычны слой",
  popup: {
    score_header: "Адзнака {{level}}",
    base_header: "Аснова {{level}}"
  }
};
const search$1 = {
  search_location: "Пошук месца",
  info_block: "Вы можаце шукаць 📍 месцы",
  info_block_with_mcda: "Вы можаце шукаць 📍 месцы або задаць ✨ AI ваша пытанне, напрыклад: «Дзе знаходзіцца сухастой?»",
  input_placeholder: "Пошук",
  input_placeholder_mcda: "Шукаць або спытацца ў AI",
  locations_no_result: "Няма знойдзеных месцаў",
  mcda_loading_message: "AI стварае аналіз для вас",
  mcda_no_result: "Няма прапаноў ад AI",
  mcda_error_message: "AI не адказаў. Паспрабуйце пазней",
  mcda_create_analysis: "Стварыць аналіз",
  upload_analysis: "“{{name}}” шматкрытэрыяльны аналіз быў створаны"
};
const episode$1 = "Часавая шкала";
const create_layer$1 = {
  edit_layer: "Рэдагаваць слой",
  edit_features: "Рэдагаваць аб'екты",
  delete_layer: "Выдаліць слой",
  create_layer: "Стварыць слой",
  saving_layer: "Захаванне слоя...",
  field_name: "Назва поля",
  layer_name: "Назва слоя",
  marker_icon: "Іконка маркера",
  type: "Тып",
  select: "Выбраць",
  short_text: "Кароткі тэкст",
  long_text: "Доўгі тэкст",
  link: "Спасылка",
  image: "Выява",
  fields: "Палі",
  add_field: "Дадаць поле",
  location: "Месцазнаходжанне",
  edit_feature_placeholder: "Выберыце аб'ект для пачатку рэдагавання яго ўласцівасцей"
};
const analytics_panel$1 = {
  header_title: "Аналітыка",
  error_loading: "Не атрымалася атрымаць даныя аб вылучанай вобласці. Магчыма, яна занадта вялікая.",
  info_short: "Разлікі зробленыя для вылучанай вобласці"
};
const advanced_analytics_panel$1 = {
  header_title: "Пашыраная аналітыка",
  error: "Памылка падчас атрымання даных пашыранай аналітыкі"
};
const advanced_analytics_empty$1 = {
  not_found: "Прабачце, запытаная катастрофа не знойдзена",
  error: "Адбылася памылка",
  analytics_for_selected: "Аналітыка для вылучанай вобласці",
  will_be_provided: "будзе пададзена тут",
  no_analytics: "Няма аналітыкі для вылучанай вобласці"
};
const current_event$1 = {
  not_found_request: "Прабачце, запытаная катастрофа не знойдзена"
};
const llm_analytics$1 = {
  header: "Аналітыка AI",
  placeholder: {
    select_area: "Вылучыце вобласць (<icon1 />,<icon2 />,<icon3 />), якую хочаце даследаваць для атрымання Аналітыкі AI.",
    you_can_also: "Вы таксама можаце:",
    fill_bio: "<icon /> <lnk>Запоўніце мэты аналізу</lnk>, каб персаналізаваць AI аналіз",
    select_and_save_as_reference_area: "<icon /> Вылучыце вобласць і захавайце яе як эталонную для параўнання з іншай",
    learn_more: "<lnk><icon/> Даведайцеся больш пра Аналітыку AI</lnk>"
  }
};
const draw_tools$1 = {
  area: "Шматкутнік",
  line: "Лінія",
  point: "Кропка",
  finish_drawing: "Скончыць маляванне",
  caption: "Націсніце на мапу, каб пачаць маляванне",
  no_geometry_error: "Няма намаляванай геаметрыі для загрузкі",
  overlap_error: "Шматкутнік не павінен перакрываць сам сябе",
  save_features: "Захаваць аб'екты"
};
const boundary_selector$1 = {
  title: "Фокус на адміністрацыйную мяжу"
};
const geometry_uploader$1 = {
  title: "Фокус на загружаную геаметрыю",
  error: "Памылка пры чытанні загружанага файла"
};
const focus_geometry$1 = {
  title: "Фокус на адвольную геаметрыю"
};
const reference_area_layer$1 = {
  settings: {
    name: "Эталонная вобласць"
  }
};
const drawings$1 = {
  self_directions_not_supported: "Самаперакрыцці не падтрымліваюцца"
};
const sidebar$1 = {
  edit_osm: "Рэдагаваць у OpenStreetMap",
  ruler: "Лінейка",
  collapse: "Згарнуць",
  expand: "Разгарнуць",
  icon_alt: "Лагатып дадатку"
};
const login$1 = {
  email: "Электронная пошта",
  password: "Пароль",
  login_button: "Увайсці",
  sign_up: "Зарэгістравацца",
  logging_in: "Уваход...",
  log_in: "Увайсці",
  forgot_password: "Забыліся пароль?",
  description: "Калі ласка, увайдзіце, каб змяніць налады",
  error: {
    email_empty: "Поле электроннай пошты не можа быць пустым",
    email_invalid: "Увядзіце сапраўдны адрас электроннай пошты",
    password: "Поле пароля не можа быць пустым",
    connect: "Не ўдалося падключыцца да службы аўтэнтыфікацыі"
  }
};
const currency$1 = {
  usd: "USD"
};
const subscription$1 = {
  title: "Тарыфы і цэны",
  price_summary: "* Выстаўляецца рахунак ${{pricePerYear}} USD раз на год",
  unauthorized_button: "Увайдзіце, каб аформіць падпіску",
  current_plan_button: "Цяперашні план",
  sales_button: "Звязацца з аддзелам продажаў",
  book_demo_button: "Замовіць дэма",
  request_trial_button: "Запытаць пробны перыяд",
  errors: {
    payment_initialization: "Адбылася памылка падчас ініцыялізацыі плацяжу. Калі ласка, паспрабуйце яшчэ раз ці звяжыцеся са службай падтрымкі"
  },
  success_modal: {
    title: "Паспяхова",
    thank_you_for_subscribing: "Дзякуй за падпіску на нашу платформу!",
    after_the_page_refreshes: "Пасля абнаўлення старонкі вы можаце пачаць выкарыстоўваць Kontur Atlas"
  }
};
const reports$1 = {
  title: "Справаздачы Disaster Ninja",
  no_data: "Няма даных для гэтай справаздачы",
  sorting: "Сартыроўка даных...",
  loading: "Загрузка даных",
  open_josm: "Адкрыць праз дыстанцыйнае кіраванне JOSM",
  josm_logo_alt: "Лагатып JOSM",
  see_all: "Паглядзець усе справаздачы",
  wrong_id: "Няправільны ідэнтыфікатар справаздачы",
  description: "<0>Kontur </0> стварае некалькі справаздач, якія дапамагаюць ацаніць якасць OpenStreetMap. Яны ўтрымліваюць спасылкі на вобласці на <4>osm.org </4> і спасылкі для адкрыцця іх у рэдактары JOSM з уключаным дыстанцыйным кіраваннем."
};
const about$1 = {};
const loading_episodes$1 = "Загрузка эпізодаў";
const zoom_to_world$1 = "Аддаліцца да ўсяго свету";
const cookie_banner$1 = {
  header: "Мы цэнім вашу прыватнасць",
  body: "Мы выкарыстоўваем неабходныя файлы cookie для прадастаўлення вам персаналізаваных паслуг, а таксама дадатковыя файлы cookie для паляпшэння {{appName}} і вашага вопыту выкарыстання. Вы можаце кіраваць наладамі cookie або адклікаць згоду на дадатковыя cookie ў любы момант.\nДля атрымання дадатковай інфармацыі азнаёмцеся з нашай [Палітыкай прыватнасці](about/privacy)",
  decline_all: "Адмовіцца ад дадатковых cookie",
  accept_all: "Прыняць дадатковыя cookie"
};
const live_sensor$1 = {
  start: "Пачаць запіс з датчыкаў",
  finish: "Спыніць запіс з датчыкаў",
  finishMessage: "Запіс завершаны",
  startMessage: "Запіс пачаты",
  noSensorsError: "Вашае прылада не мае неабходных датчыкаў"
};
const layer_features_panel$1 = {
  empty: "Аб'екты слоя ў вылучанай вобласці будуць паказаны тут",
  noFeatureSelected: "Не абраны аб'ект слоя",
  chooseFeature: "Абярыце аб'ект слоя",
  listInfo: "Спіс адфільтраваны па вылучанай вобласці і адсартаваны па нумары праекта",
  error_loading: "Не атрымалася загрузіць даныя аб'ектаў слоя. Калі ласка, паспрабуйце яшчэ раз.",
  no_features: "У вылучанай вобласці не знойдзена аб'ектаў."
};
const reference_area$1 = {
  save_as_reference_area: "Захаваць як эталонную вобласць",
  error_couldnt_save: "На жаль, не атрымалася захаваць вашу эталонную вобласць. Калі ласка, паспрабуйце яшчэ раз.",
  selected_area_saved_as_reference_area: "Вылучаная вобласць была захаваная як эталонная ў вашым профілі"
};
const be_common = {
  km: km$1,
  m: m$1,
  to: to$1,
  or: or$1,
  maps: maps$1,
  logout: logout$1,
  save: save$1,
  cancel: cancel$1,
  mcda: mcda$1,
  ok: ok$1,
  create: create$1,
  disasters: disasters$1,
  loading: loading$1,
  loading_events: loading_events$1,
  legend: legend$1,
  vertical_direction: vertical_direction$1,
  horizontal_direction: horizontal_direction$1,
  legend_presentation: legend_presentation$1,
  layers: layers$1,
  bivariate: bivariate$1,
  toolbar: toolbar$1,
  locate_me: locate_me$1,
  layer_actions: layer_actions$1,
  focus_geometry_layer: focus_geometry_layer$1,
  feed: feed$1,
  deselect: deselect$1,
  spinner_text: spinner_text$1,
  updated: updated$1,
  started: started$1,
  no_data_received: no_data_received$1,
  wrong_data_received: wrong_data_received$1,
  error: error$3,
  sort_icon: sort_icon$1,
  configs: configs$1,
  errors: errors$1,
  event_list: event_list$1,
  categories: categories$1,
  groups: groups$1,
  modes: modes$1,
  advanced_analytics_data_list: advanced_analytics_data_list$1,
  profile: profile$1,
  multivariate: multivariate$1,
  search: search$1,
  episode: episode$1,
  create_layer: create_layer$1,
  analytics_panel: analytics_panel$1,
  advanced_analytics_panel: advanced_analytics_panel$1,
  advanced_analytics_empty: advanced_analytics_empty$1,
  current_event: current_event$1,
  llm_analytics: llm_analytics$1,
  draw_tools: draw_tools$1,
  boundary_selector: boundary_selector$1,
  geometry_uploader: geometry_uploader$1,
  focus_geometry: focus_geometry$1,
  reference_area_layer: reference_area_layer$1,
  drawings: drawings$1,
  sidebar: sidebar$1,
  login: login$1,
  currency: currency$1,
  subscription: subscription$1,
  reports: reports$1,
  about: about$1,
  loading_episodes: loading_episodes$1,
  zoom_to_world: zoom_to_world$1,
  cookie_banner: cookie_banner$1,
  live_sensor: live_sensor$1,
  layer_features_panel: layer_features_panel$1,
  reference_area: reference_area$1
};
const km = "км";
const m = "м";
const to = "до";
const or = "или";
const maps = "Карты";
const logout = "Выйти";
const save = "Сохранить";
const cancel = "Отменить";
const mcda = {
  btn_cancel: "Отменить",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Скрыть",
      clamp: "Ограничить",
      dont_modify: "Не изменять"
    },
    save_changes: "Сохранить изменения",
    range: "Диапазон значений",
    outliers: "Выпадающие значения",
    reverse_to_good_bad: "Перевернуть: Хорошо → Плохо",
    reverse_to_bad_good: "Перевернуть: Плохо → Хорошо",
    weight: "Вес",
    transform: "Трансформировать",
    transformation: "Трансформация",
    normalize: "Нормализовать",
    normalization: "Нормализация",
    range_buttons: {
      full_range: "Полный диапазон",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    transformations: {
      no_transformation: "Без трансформации",
      square_root: "Квадратный корень: sign(x)⋅√|x|",
      cube_root: "Кубический корень: ∛x",
      log: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "Без нормализации",
    max_min: "Макс-мин",
    errors: {
      weight_cannot_be_empty: "Вес не может быть пустым",
      weight_must_be_a_number: "Вес должен быть числом",
      range_from_cannot_be_bigger: "Значение «от» не может быть больше, чем значение «до»",
      range_cannot_be_empty: "Диапазон не может быть пустым",
      range_must_be_a_number: "Диапазон должен быть числом"
    },
    tips: {
      range: "Значения, которые будут считаться наихудшими и наилучшими в вашем анализе.",
      sentiment: "Определите направление коннотаций слоя на анализ:\n* **Плохо → Хорошо**: Более высокие значения указывают на положительное направление.\n* **Хорошо → Плохо**: Более высокие значения указывают на отрицательное направление.",
      weight: "По умолчанию все слои вносят равный вклад в анализ через средневзвешенное значение. Увеличение веса слоя (2, 3 и т. д.) позволяет придать ему дополнительную значимость в анализе.",
      transform: "Примените вычисления к значениям. Достижение более линейного распределения обеспечит более полезную информацию для анализа.\n\n **Примечание**: Вычисления выполняются перед нормализацией.",
      normalize: "Приводит значения к стандартизированной шкале. Это упрощает их сравнение и принятие решений.\n* **Стандартная шкала оценки**: Этот вариант приводит значения к стандартизированной шкале, чтобы они были сопоставимы.\n* **Нет (только для специалистов)**: Оставляет значения без изменений.",
      outliers: "* **Ограничить**: Установить значения выше диапазона как 1, а ниже диапазона – как 0.\n* **Не изменять**: Сохранить 0 и 1 для минимального и максимального значений, но допустить выбросы за пределами этого диапазона.\n* **Исключить**: Исключить области, где значения выходят за пределы диапазона."
    }
  },
  title: "Многокритериальный анализ",
  modal_title: "Многокритериальный анализ",
  name: "Создать анализ",
  modal_input_name: "Название анализа",
  modal_input_name_placeholder: "Например, Изменение климата",
  modal_input_indicators: "Список слоёв",
  modal_input_indicators_placeholder: "Выберите слои",
  modal_input_indicators_no_options: "Нет доступных вариантов",
  btn_save: "Сохранить анализ",
  error_analysis_name_cannot_be_empty: "Название анализа не может быть пустым",
  error_bad_layer_data: "Некорректные данные слоя многокритериального анализа",
  error_invalid_file: "Некорректный формат файла многокритериального анализа",
  error_invalid_parameter: "Некорректный параметр '{{parameter}}'",
  error_invalid_layer_parameter: "Некорректный параметр '{{parameter}}' в слое '{{axisName}}'",
  error_wrong_mcda_version: "Неподдерживаемая версия многокритериального анализа",
  legend_subtitle: "Шестиугольники окрашены в соответствии с настройками анализа слоя. Нажмите на шестиугольник, чтобы увидеть его значения.",
  bad: "Плохо",
  good: "Хорошо"
};
const ok = "ОК";
const create = "Создать";
const disasters = "Катастрофы";
const loading = "Загрузка...";
const loading_events = "Загрузка катастроф";
const legend = "Легенда";
const vertical_direction = "Вертикальное направление";
const horizontal_direction = "Горизонтальное направление";
const legend_presentation = "Отображение легенды";
const layers = "Слои";
const bivariate = {
  color_manager: {
    layers_filter: "Слои",
    not_defined: "Не определено",
    sentiments_combinations_filter: "Комбинации направлений",
    no_legends: "Нет легенд, удовлетворяющих условиям.",
    no_data: "Нет данных.",
    sentiments_tab: "Направление",
    color_legends_tab: "Цветовые легенды",
    layers_tab: "Слои (индикаторы)"
  },
  panel: {
    header: "Бивариативная матрица"
  },
  matrix: {
    caption: {
      base_axis: "Базовая ось",
      annex_axis: "Дополнительная ось",
      tooltip: {
        p1: "Графики с базовой и дополнительной осями помогают установить взаимосвязь между двумя наборами данных.",
        li1: "Дополнительная ось – параметры, которые мы анализируем",
        li2: "Базовая ось – эталонная точка в анализе",
        b: "Например: лучшее место для открытия кафе",
        p2: "Мы можем изучить количество мест общественного питания (дополнительная ось) по отношению к плотности населения (базовая ось).",
        p3: "В этом сценарии нас интересует небольшое количество мест общественного питания, а количество людей в этом месте даёт дополнительную информацию."
      }
    },
    header: {
      title: "Выберите два слоя для исследования корреляций",
      hint: "Слои и корреляции отображаются для текущей выделенной области"
    },
    icon: {
      population: "Значение, делённое на население",
      area_km2: "Значение, делённое на площадь",
      total_building_count: "Значение, делённое на общее количество зданий",
      populated_area_km2: "Значение, делённое на заселённую площадь",
      one: "Без делителя",
      roads: "Значение, делённое на общую длину дорог"
    },
    progress: {
      rendering: "Отрисовка",
      applied: "Применено на карте"
    },
    loading_error: "К сожалению, мы не можем отобразить матрицу. Попробуйте обновить страницу или зайдите позже."
  },
  legend: {
    high: "Высокий",
    low: "Низкий",
    medium: "Средний"
  }
};
const toolbar = {
  map_ruler: "Измерить расстояние",
  locate_me: "Определить моё местоположение",
  panel_title: "Панель инструментов",
  download: "Скачать",
  "delete": "Удалить",
  boundary_selector: "Выделить административную границу",
  create_layer: "Создать слой",
  geometry_uploader: "Загрузить GeoJSON",
  focused_geometry_editor: "Рисовать или редактировать геометрию",
  edit_in_osm: "Редактировать карту в OSM",
  record_sensors: "Записать данные с датчиков",
  tools_label: "Инструменты",
  selected_area_label: "Выделенная область",
  upload_mcda: "Загрузить анализ"
};
const locate_me = {
  feature_title: "Определить моё местоположение",
  get_location_error: "Ошибка при определении местоположения"
};
const layer_actions = {
  tooltips: {
    download: "Скачать",
    erase: "Стереть",
    edit: "Редактировать",
    hide: "Скрыть",
    show: "Показать"
  }
};
const focus_geometry_layer = {
  settings: {
    name: "Выделенная область"
  }
};
const feed = "Лента";
const deselect = "Снять выделение";
const spinner_text = "Сбор данных";
const updated = "Обновлено";
const started = "Запущено";
const no_data_received = "Данные не получены";
const wrong_data_received = "Получены неверные данные";
const error$2 = "Ошибка";
const sort_icon = "Сортировка";
const configs = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "Лента содержит данные в реальном времени о циклонах, засухах, землетрясениях, наводнениях, вулканах, лесных пожарах."
};
const errors = {
  "default": "Извините, у нас возникли проблемы, которые скоро будут исправлены",
  timeout: "Время ожидания запроса истекло",
  cannot_connect: "Не удается подключиться к серверу",
  forbidden: "Доступ запрещен",
  not_found: "Не найдено",
  unknown: "Неизвестно",
  server_error: "Ошибка сервера",
  error_try_again: "Что-то пошло не так. Пожалуйста, попробуйте снова"
};
const event_list = {
  severity_unknown: "Неизвестно",
  warning_title: "Невозможно отфильтровать по виду карты",
  warning_description: "Карта еще не готова, попробуйте позже",
  bbox_filter_button: "Фильтровать по виду карты",
  analytics: {
    affected_people: {
      tooltip: "Пострадавшие люди",
      value: "Гуманитарного воздействия нет"
    },
    settled_area_tooltip: "Заселённая территория",
    loss_tooltip: "Предполагаемый ущерб"
  },
  no_event_in_feed: "Катастрофа не найдена в текущей ленте катастроф",
  no_selected_disaster: "Катастрофа не выбрана",
  chose_disaster: "Выберите катастрофу",
  no_historical_disasters: "В этой области нет исторических катастроф",
  no_feed_disasters: "В этой ленте нет катастроф",
  no_feed_disasters_matching_your_filters: "Нет катастроф, соответствующих вашим фильтрам",
  no_disasters: "Нет катастроф",
  severity_termination: "Прекращение",
  severity_minor: "Незначительное",
  severity_moderate: "Умеренное",
  severity_severe: "Серьезное",
  severity_extreme: "Экстремальное",
  open_timeline_button: "Таймлайн"
};
const categories = {
  overlays: "Оверлеи",
  basemap: "Базовая карта"
};
const groups = {
  layers_in_selected_area: "Слои в выделенной области",
  your_layers: "Ваши слои",
  kontur_analytics: "Аналитика Kontur",
  qa: "Инспектор OpenStreetMap",
  osmbasedmap: "На основе OpenStreetMap",
  other: "Другое",
  elevation: "Высота",
  photo: "Изображения",
  map: "Карта"
};
const modes = {
  map: "Карта",
  about: "О сервисе",
  cookies: "Файлы cookie",
  reports: "Отчёты",
  report: "Отчёт",
  profile: "Профиль",
  privacy: "Конфиденциальность",
  terms: "Условия",
  user_guide: "Руководство"
};
const advanced_analytics_data_list = {
  load_world_data: "Загрузить мировые данные",
  numerator: "Числитель",
  normalized_by: "Нормализовано по",
  sum: "Сумма",
  min: "Минимум",
  max: "Максимум",
  mean: "Среднее",
  stddev: "Стандартное отклонение",
  median: "Медиана",
  filter_numerator: "Фильтр числителя",
  filter_denominator: "Фильтр знаменателя"
};
const profile = {
  saveButton: "Сохранить изменения",
  reference_area: {
    title: "Эталонная область",
    freehand_geometry: "Свободная геометрия",
    to_replace_reference_area: 'Вы можете переопределить свою эталонную область на карте. Выберите область и нажмите "Сохранить как эталонную область" на панели инструментов.\n',
    description: "Сохраните знакомую вам область как эталонную. Мы будем использовать её в качестве основания для сравнения с другими областями и объяснения различий.",
    set_the_reference_area: "Выделить область на карте",
    tooltip_text: "1. Выделите интересующую область на карте, используя инструмент границ администраций или инструмент рисования геометрии. <br/> 2. Нажмите кнопку 'Сохранить как эталонную область' на панели инструментов.",
    accessing_location: "Определение вашего местоположения",
    accessing_location_error: "Ошибка. Попробуйте другой способ.",
    select_location: "Выбрать моё текущее местоположение",
    notification: "Ваша эталонная область {{name}} была сохранена"
  },
  email: "Электронная почта",
  interfaceTheme: "Тема",
  interfaceLanguage: "Язык",
  units: "Единицы измерения",
  fullName: "Полное имя",
  metric: "метрическая",
  imperialBeta: "имперская (бета)",
  profileSettingsHeader: "Персонализируйте свой опыт",
  your_current_job: "ваша текущая должность",
  area_of_expertise: "область экспертизы",
  challenges: "проблемы",
  personalization_prompt: "Для лучшей персонализации укажите, например:",
  ai_tools_compatibility: "Эта информация совместима с инструментами AI",
  improves_analysis: "Улучшает аналитику",
  bio_placeholder: "О себе",
  bio_textarea_placeholder: "Например, ГИС-специалист с более чем 5-летним опытом анализа рисков катастроф, с фокусом на устойчивость городов.",
  analysis_objectives: "Цели анализа",
  objectives_textarea_placeholder: "Например, анализ городского планирования с акцентом на устойчивость к климатическим изменениям. Моя текущая задача — улучшение картографирования рисков наводнений.",
  appSettingsHeader: "Настройки",
  your_organization: "Ваша организация",
  your_contacts: "Ваши контактные данные",
  organization_name: "Название организации",
  position: "Должность",
  gis_specialists: "ГИС-специалисты в вашей команде",
  phone_number: "Номер телефона с кодом страны",
  linkedin: "Профиль в LinkedIn",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Лента катастроф по умолчанию",
  defaultOSMeditor: "Редактор OpenStreetMap по умолчанию (бета)",
  successNotification: "Все изменения успешно применены",
  dont_know: "Не знаю",
  languageOption: {
    en: "Английский",
    es: "Испанский",
    ar: "Арабский",
    ko: "Корейский",
    id: "Индонезийский",
    de: "Немецкий",
    be: "Белорусский",
    ru: "Русский",
    uk: "Украинский"
  }
};
const multivariate = {
  upload_analysis_layer: "Загрузить слой анализа",
  popup: {
    score_header: "Оценка {{level}}",
    base_header: "Основа {{level}}"
  }
};
const search = {
  search_location: "Поиск мест",
  info_block: "Вы можете искать 📍 места",
  info_block_with_mcda: "Вы можете искать 📍 места или задать ✨ AI вопрос, например: «Где находится сухостой?»",
  input_placeholder: "Поиск",
  input_placeholder_mcda: "Найти или спросить AI",
  locations_no_result: "Места не найдены",
  mcda_loading_message: "AI создаёт анализ для вас",
  mcda_no_result: "Нет предложений от AI",
  mcda_error_message: "AI не ответил. Пожалуйста, попробуйте позже",
  mcda_create_analysis: "Создать анализ",
  upload_analysis: "Многокритериальный анализ «{{name}}» создан"
};
const episode = "Таймлайн";
const create_layer = {
  edit_layer: "Редактировать слой",
  edit_features: "Редактировать объекты",
  delete_layer: "Удалить слой",
  create_layer: "Создать слой",
  saving_layer: "Сохранение слоя...",
  field_name: "Название поля",
  layer_name: "Название слоя",
  marker_icon: "Иконка маркера",
  type: "Тип",
  select: "Выбрать",
  short_text: "Короткий текст",
  long_text: "Длинный текст",
  link: "Ссылка",
  image: "Изображение",
  fields: "Поля",
  add_field: "Добавить поле",
  location: "Местоположение",
  edit_feature_placeholder: "Выберите объект, чтобы начать редактирование его свойств"
};
const analytics_panel = {
  header_title: "Аналитика",
  error_loading: "Не удалось получить данные о выделенной области. Возможно, она слишком велика.",
  info_short: "Расчеты выполняются для выделенной области"
};
const advanced_analytics_panel = {
  header_title: "Расширенная аналитика",
  error: "Ошибка при получении данных расширенной аналитики"
};
const advanced_analytics_empty = {
  not_found: "Извините, запрашиваемая катастрофа не найдена",
  error: "Произошла ошибка",
  analytics_for_selected: "Аналитика для выделенной области",
  will_be_provided: "будет представлена здесь",
  no_analytics: "Нет аналитики для выделенной области"
};
const current_event = {
  not_found_request: "Извините, запрашиваемая катастрофа не найдена"
};
const llm_analytics = {
  header: "Аналитика AI",
  placeholder: {
    select_area: "Выберите область (<icon1 />,<icon2 />,<icon3 />), которую хотите исследовать, чтобы получить аналитику AI.",
    you_can_also: "Вы также можете:",
    fill_bio: "<icon /> <lnk>Заполните цели анализа</lnk>, чтобы персонализировать AI анализ",
    select_and_save_as_reference_area: "<icon /> Выберите область и сохраните её как эталонную, чтобы сравнивать с другой",
    learn_more: "<lnk><icon/> Узнать больше об аналитике AI</lnk>"
  }
};
const draw_tools = {
  area: "Многоугольник",
  line: "Линия",
  point: "Точка",
  finish_drawing: "Завершить рисование",
  caption: "Нажмите на карту, чтобы начать рисование",
  no_geometry_error: "Нет нарисованной геометрии для загрузки",
  overlap_error: "Полигон не должен пересекаться сам с собой",
  save_features: "Сохранить объекты"
};
const boundary_selector = {
  title: "Фокус на административной границе"
};
const geometry_uploader = {
  title: "Фокус на загруженной геометрии",
  error: "Ошибка при чтении загруженного файла"
};
const focus_geometry = {
  title: "Фокус на свободно нарисованной геометрии"
};
const reference_area_layer = {
  settings: {
    name: "Эталонная область"
  }
};
const drawings = {
  self_directions_not_supported: "Самопересечения не поддерживаются"
};
const sidebar = {
  biv_color_manager: "Менеджер цветов",
  edit_osm: "Редактировать в OpenStreetMap",
  ruler: "Линейка",
  collapse: "Свернуть",
  expand: "Развернуть",
  icon_alt: "Логотип приложения"
};
const login = {
  email: "Электронная почта",
  password: "Пароль",
  login_button: "Войти",
  sign_up: "Регистрация",
  logging_in: "Вход в систему...",
  log_in: "Войти",
  forgot_password: "Забыли пароль?",
  description: "Пожалуйста, войдите в систему, чтобы изменить настройки",
  error: {
    email_empty: "Поле электронной почты не может быть пустым",
    email_invalid: "Введите корректный адрес электронной почты",
    password: "Пароль не может быть пустым",
    connect: "Не удалось подключиться к службе аутентификации"
  }
};
const currency = {
  usd: "USD"
};
const subscription = {
  title: "Тарифы и цены",
  price_summary: "* Выставляется счёт на ${{pricePerYear}} USD раз в год",
  unauthorized_button: "Войдите, чтобы подписаться",
  current_plan_button: "Текущий план",
  sales_button: "Связаться с отделом продаж",
  book_demo_button: "Записаться на демонстрацию",
  request_trial_button: "Запросить пробную версию",
  errors: {
    payment_initialization: "Произошла ошибка при инициализации платежа. Попробуйте снова или свяжитесь со службой поддержки"
  },
  success_modal: {
    title: "Успех",
    thank_you_for_subscribing: "Спасибо за подписку на нашу платформу!",
    after_the_page_refreshes: "После обновления страницы вы сможете начать использовать Kontur Atlas"
  }
};
const reports = {
  title: "Отчёты Disaster Ninja",
  no_data: "Нет данных для этого отчёта",
  sorting: "Сортировка данных...",
  loading: "Загрузка данных",
  open_josm: "Открыть через удалённое управление JOSM",
  josm_logo_alt: "Логотип JOSM",
  see_all: "Посмотреть все отчёты",
  wrong_id: "Неверный идентификатор отчёта",
  description: "<0>Kontur </0> создаёт несколько отчётов, которые помогают проверять качество OpenStreetMap. Они содержат ссылки на области на <4>osm.org</4> и ссылки для открытия их в редакторе JOSM с включённым удалённым управлением."
};
const about = {};
const loading_episodes = "Загрузка эпизодов";
const zoom_to_world = "Отдалиться ко всему миру";
const cookie_banner = {
  header: "Мы ценим вашу конфиденциальность",
  body: "Мы используем исключительно необходимые файлы cookie для предоставления персонализированных услуг, а также дополнительные файлы cookie для улучшения {{appName}} и вашего опыта. Вы можете управлять настройками cookie или отозвать согласие на их использование в любое время.\nДополнительную информацию можно найти в нашей [Политике конфиденциальности](about/privacy).",
  decline_all: "Отклонить необязательные файлы cookie",
  accept_all: "Принять необязательные файлы cookie"
};
const live_sensor = {
  start: "Начать запись данных с сенсоров",
  finish: "Остановить запись данных с сенсоров",
  finishMessage: "Запись завершена",
  startMessage: "Запись началась",
  noSensorsError: "Ваше устройство не имеет необходимые сенсоры"
};
const layer_features_panel = {
  empty: "Здесь будут отображены объекты слоёв в выделенной области",
  noFeatureSelected: "Не выбрано ни одного объекта слоя",
  chooseFeature: "Выберите объект слоя",
  listInfo: "Список отфильтрован по выделенной области и отсортирован по номеру проекта",
  error_loading: "Не удалось загрузить данные об объектах слоя. Попробуйте снова.",
  no_features: "В выделенной области не найдено ни одного объекта."
};
const reference_area = {
  save_as_reference_area: "Сохранить как эталонную область",
  error_couldnt_save: "К сожалению, не удалось сохранить вашу эталонную область. Попробуйте снова.",
  selected_area_saved_as_reference_area: "Выбранная область сохранена как эталонная область в вашем профиле"
};
const ru_common = {
  km,
  m,
  to,
  or,
  maps,
  logout,
  save,
  cancel,
  mcda,
  ok,
  create,
  disasters,
  loading,
  loading_events,
  legend,
  vertical_direction,
  horizontal_direction,
  legend_presentation,
  layers,
  bivariate,
  toolbar,
  locate_me,
  layer_actions,
  focus_geometry_layer,
  feed,
  deselect,
  spinner_text,
  updated,
  started,
  no_data_received,
  wrong_data_received,
  error: error$2,
  sort_icon,
  configs,
  errors,
  event_list,
  categories,
  groups,
  modes,
  advanced_analytics_data_list,
  profile,
  multivariate,
  search,
  episode,
  create_layer,
  analytics_panel,
  advanced_analytics_panel,
  advanced_analytics_empty,
  current_event,
  llm_analytics,
  draw_tools,
  boundary_selector,
  geometry_uploader,
  focus_geometry,
  reference_area_layer,
  drawings,
  sidebar,
  login,
  currency,
  subscription,
  reports,
  about,
  loading_episodes,
  zoom_to_world,
  cookie_banner,
  live_sensor,
  layer_features_panel,
  reference_area
};
const I18N_FALLBACK_LANGUAGE = "en";
const languageResources = {
  en: { common: en_common },
  es: { common: es_common },
  ar: { common: ar_common },
  ko: { common: ko_common },
  id: { common: id_common },
  de: { common: de_common },
  uk: { common: uk_common },
  be: { common: be_common },
  ru: { common: ru_common }
};
instance.use(Browser).use(initReactI18next).init({
  fallbackLng: I18N_FALLBACK_LANGUAGE,
  debug: false,
  defaultNS: "common",
  interpolation: {
    escapeValue: false
  },
  contextSeparator: ":",
  pluralSeparator: ":",
  resources: {
    ...languageResources
  }
});
const TranslationService = {
  t: (key, options) => {
    const translation = instance.t(key, options);
    if (typeof translation === "string") return translation;
    if ((options == null ? void 0 : options.returnObjects) && typeof translation === "object") {
      return translation;
    }
    console.error(`Not supported translation result for key: ${key}`);
    return key;
  },
  getSupportedLanguage: (preferredLanguages, fallbackLanguage) => {
    for (const langCode of preferredLanguages) {
      try {
        const language2 = new Intl.Locale(langCode).language;
        if (language2 in languageResources) {
          return language2;
        }
      } catch {
        console.error("Couldn't parse language code:", langCode);
      }
    }
    if (!(fallbackLanguage in languageResources)) {
      console.error(`Provided fallback language (${fallbackLanguage}) isn't supported`);
    }
    return fallbackLanguage;
  },
  instance
};
function getAsset(asset, abortController) {
  const endpoint = `/apps/${configRepo.get().id}/assets`;
  return apiClient.get(`${endpoint}/${asset}`, void 0, {
    headers: { "user-language": TranslationService.instance.language },
    signal: void 0
  });
}
const PagesDocumentElementRenderers = {
  css: CssElement,
  md: MarkdownElement
};
function fetchPagesDocument(doc) {
  return Promise.all(
    doc.map(async (element) => {
      if (element.url) {
        try {
          const res = await getAsset(element.url);
          return { ...element, data: res };
        } catch (error2) {
          console.error(`Failed to load asset from ${element.url}:`, error2);
        }
      }
      return { ...element, data: element.data || "" };
    })
  );
}
function CssElement({ data }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: data });
}
function MarkdownElement({ data }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "app-pages-element-markdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkdownContent, { content: data }) });
}
function PagesDocument({
  doc,
  wrapperComponent: Wrapper = Article,
  id
}) {
  const data = usePromise$1(fetchPagesDocument, [doc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrapper, { id: `app-pages-docid-${id}`, children: data.map((element, index2) => {
    const Renderer = PagesDocumentElementRenderers[element.type];
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Renderer, { ...element }, index2);
  }) });
}
const PaymentPlanCardFooter = reactExports.memo(function PaymentPlanCardFooter2({
  planConfig,
  isUserAuthorized,
  currentSubscription,
  billingOption
}) {
  if (billingOption == null ? void 0 : billingOption.pricePerYear) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { type: "caption", children: TranslationService.t("subscription.price_summary", {
      pricePerYear: billingOption.pricePerYear.toLocaleString("en-US")
    }) });
  }
  return null;
});
const priceWrap = "_priceWrap_11z70_1";
const dollarSign = "_dollarSign_11z70_7";
const amount = "_amount_11z70_15";
const perMonth$1 = "_perMonth_11z70_21";
const s$e = {
  priceWrap,
  dollarSign,
  amount,
  perMonth: perMonth$1
};
function Price({ amount: amount2, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$e.priceWrap, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$e.dollarSign, children: "$" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$e.amount, children: amount2.toLocaleString("en-US") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s$e.perMonth, children: [
      TranslationService.t("currency.usd"),
      " / mo*"
    ] })
  ] });
}
const planCard = "_planCard_q8sg6_1";
const custom = "_custom_q8sg6_32";
const premium = "_premium_q8sg6_40";
const planType = "_planType_q8sg6_68";
const initialPrice = "_initialPrice_q8sg6_88";
const price = "_price_q8sg6_94";
const hidden = "_hidden_q8sg6_98";
const perMonth = "_perMonth_q8sg6_102";
const customPlanName = "_customPlanName_q8sg6_108";
const planDescription = "_planDescription_q8sg6_115";
const buttonWrapper = "_buttonWrapper_q8sg6_124";
const subscribeButtonsWrapper = "_subscribeButtonsWrapper_q8sg6_136";
const cancelButton = "_cancelButton_q8sg6_150";
const footerWrapper = "_footerWrapper_q8sg6_155";
const linkAsButton = "_linkAsButton_q8sg6_166";
const paymentPlanButton = "_paymentPlanButton_q8sg6_191";
const s$d = {
  planCard,
  custom,
  premium,
  planType,
  initialPrice,
  price,
  hidden,
  perMonth,
  customPlanName,
  planDescription,
  buttonWrapper,
  subscribeButtonsWrapper,
  cancelButton,
  footerWrapper,
  linkAsButton,
  paymentPlanButton
};
const pricingWrap = "_pricingWrap_wgpmi_1";
const pricingPlans = "_pricingPlans_wgpmi_7";
const togglerSwitch = "_togglerSwitch_wgpmi_14";
const withOffLabel = "_withOffLabel_wgpmi_20";
const togglerLabel = "_togglerLabel_wgpmi_25";
const active = "_active_wgpmi_31";
const note = "_note_wgpmi_36";
const plans = "_plans_wgpmi_46";
const ss = {
  pricingWrap,
  pricingPlans,
  togglerSwitch,
  withOffLabel,
  togglerLabel,
  active,
  note,
  plans
};
const config$1 = {
  billingMethodsDetails: [
    {
      id: "paypal",
      clientId: "AWJQJnM0O2nDEUgmMe9827bk73hjJdo3f4tPK9vwKvBVwFnDk1UGzk_Y2yeh5huiStwwdJVRmdOYWmhv"
    }
  ],
  billingCyclesDetails: [
    {
      id: "month",
      name: "Monthly",
      note: null
    },
    {
      id: "year",
      name: "Annually",
      note: "Save 5%"
    }
  ],
  plans: [
    {
      id: "kontur_atlas_edu",
      name: "Educational",
      style: "basic",
      billingCycles: [
        {
          id: "month",
          initialPricePerMonth: null,
          pricePerMonth: 100,
          pricePerYear: null,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-8GA97186HP797325NM2B7D7Y"
            }
          ]
        },
        {
          id: "year",
          initialPricePerMonth: 100,
          pricePerMonth: 95,
          pricePerYear: 1140,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-02L9453417504204DM2B7FDQ"
            }
          ]
        }
      ]
    },
    {
      id: "kontur_atlas_pro",
      name: "Professional",
      style: "premium",
      billingCycles: [
        {
          id: "month",
          initialPricePerMonth: null,
          pricePerMonth: 1e3,
          pricePerYear: null,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-47286102F9496000PM2B7FXA"
            }
          ]
        },
        {
          id: "year",
          initialPricePerMonth: 1e3,
          pricePerMonth: 950,
          pricePerYear: 11400,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-9TD56337G94931803M2B7GTI"
            }
          ]
        }
      ]
    },
    {
      id: "kontur_atlas_custom",
      name: "Custom",
      style: "custom"
    }
  ]
};
const _plans = "# Educational\n\nFor students, hobbyists, and anyone testing the entry-level option before upgrading\n\n###### **edu**\n\n- Multi-criteria decision analyses\n- AI analytics\n- Favorite area of interest\n- Download analyses\n\n---\n\n# Professional\n\nFor GIS data analysts and managers who work with GIS on a daily basis\n\n###### **pro**\n\n- Multi-criteria decision analyses\n- AI analytics\n- Favorite area of interest\n- Download analyses\n- Customer support\n- Custom requests\n- Upload custom indicators for analytics\n\n---\n\n# Custom\n\n# Enterprise\n\nFor GIS data analysts and managers who work with GIS on a daily basis\nContact sales, book a demo or write to us at <info@kontur.io> for custom pricing and features\n\n###### **ent**\n\n- Multiple seats\n- Custom workflows\n- Custom features\n- Custom design\n- Training and onboarding\n- Support\n";
const css = `
.premium > .${s$d.planName}::before {
  content: '★';
  font-size: larger;
  padding-right: 4px;
}

.${s$d.planName} {
  font-family: var(--font-family);
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
}

.${ss.pricingWrap} {
  & ul {
    list-style-type: none;
    padding-left: 0;
    & li::before {
      content: "✔";
      display: inline-block;
      margin-right: var(--double-unit);
      color: var(--strong-color);
    }
  }
}
`;
const Plans_fixture = {
  Plans: /* @__PURE__ */ jsxRuntimeExports.jsx(Plans, { markdown: _plans, styling: css, isUserAuthorized: false })
};
function Plans({ styling = "", markdown: markdown2 = _plans, isUserAuthorized = false }) {
  const [currentBillingCycleId] = useFixtureSelect("buttonType", {
    options: ["month", "year"]
  });
  const currentSubscription = {
    id: "1",
    billingPlanId: "1",
    billingSubscriptionId: "1"
  };
  const compiled = Ze(markdown2, {
    overrides: {
      a: MarkdownLink,
      img: MarkdownMedia
    },
    wrapper: null
  });
  console.warn(compiled);
  const structured = splitIntoSections(compiled);
  console.warn(structured);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ss.pricingWrap, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styling }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: ss.pricingPlans, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: ss.plans, children: config$1.plans.map((plan, index2) => {
      var _a, _b, _c;
      const planContent = structured[index2];
      const planName = (_a = planContent.shift()) == null ? void 0 : _a.props.children[0];
      const highlightsBlock = planContent.pop();
      planContent.pop();
      const isCustom = !plan.billingCycles;
      const styleClass = plan.style;
      const billingOption = (_b = plan.billingCycles) == null ? void 0 : _b.find(
        (option) => option.id === currentBillingCycleId
      );
      const actionsBlock = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s$d.buttonWrapper, children: [
        !isUserAuthorized && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: clsx(s$d.paymentPlanButton, styleClass), children: "Sign in to subscribe" }),
        isUserAuthorized && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "[PAYPAL BUTTONS INJECTED HERE]" })
      ] });
      const priceBlock = !isCustom && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        billingOption && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: clsx(s$d.initialPrice, {
              [s$d.hidden]: billingOption.id === "month"
            }),
            children: `$${(_c = billingOption == null ? void 0 : billingOption.initialPricePerMonth) == null ? void 0 : _c.toLocaleString("en-US")} USD`
          }
        ),
        billingOption && /* @__PURE__ */ jsxRuntimeExports.jsx(Price, { className: s$d.price, amount: billingOption.pricePerMonth })
      ] });
      const footerBlock = !isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$d.footerWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaymentPlanCardFooter,
        {
          planConfig: plan,
          isUserAuthorized,
          currentSubscription,
          billingOption
        }
      ) });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$d.planCard, styleClass), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$d.planName, children: planName }),
        priceBlock,
        planContent,
        actionsBlock,
        highlightsBlock,
        footerBlock
      ] }, plan.id);
    }) }) })
  ] });
}
const fixture0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Plans_fixture
}, Symbol.toStringTag, { value: "Module" }));
const _configDataMock = {
  baseUrl: "/active/",
  initialUrl: "https://disaster.ninja/active/map?map=4.920/37.682/112.588&event=1c1eb9ce-2fb0-4660-ae2e-ee93d15f8874&layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry",
  initialUrlData: {
    layers: ["kontur_lines", "population_density"]
  },
  apiGateway: "https://disaster.ninja/active/api",
  reportsApiGateway: "/active/reports",
  bivariateTilesRelativeUrl: "api/tiles/bivariate/v1/",
  bivariateTilesIndicatorsClass: "all",
  refreshIntervalSec: 300,
  sentryDsn: "",
  keycloakUrl: "https://keycloak01.kontur.io",
  keycloakRealm: "kontur",
  keycloakClientId: "kontur_platform",
  // intercomDefaultName: null,
  intercomAppId: "e59cl64z",
  intercomSelector: "#kontur_header_chat_btn",
  defaultFeed: "kontur-public",
  osmEditors: [
    {
      id: "josm",
      title: "JOSM",
      url: "https://www.openstreetmap.org/edit?editor=remote#map="
    },
    {
      id: "id",
      title: "iD",
      url: "https://www.openstreetmap.org/edit?editor=id&node=2188188227#map="
    },
    {
      id: "rapid",
      title: "RapiD",
      url: "https://mapwith.ai/rapid#map="
    }
  ],
  autofocusZoom: 13,
  mapBlankSpaceId: "map-view",
  mapBaseStyle: "https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json",
  featuresByDefault: {
    events_list: true,
    current_event: true,
    reports: true,
    current_episode: true,
    episode_list: true,
    osm_edit_link: true,
    side_bar: true,
    analytics_panel: true,
    map_layers_panel: true,
    focused_geometry_layer: true,
    map_ruler: true,
    boundary_selector: true,
    draw_tools: true,
    geometry_uploader: true,
    legend_panel: true,
    // @ts-ignore
    url_store: true,
    feature_settings: true,
    layers_in_area: true,
    toasts: true,
    interactive_map: true,
    feed_selector: true,
    header: true,
    intercom: true,
    geocoder: true,
    communities: true,
    tooltip: true
  },
  id: "9043acf9-2cf3-48ac-9656-a5d7c4b7593d",
  name: "Kontur Atlas",
  description: "Kontur SAAS application",
  ownedByUser: false,
  extent: [-135, 0, 63, 62],
  sidebarIconUrl: "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
  faviconUrl: "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
  faviconPack: {
    "favicon.svg": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
    "favicon.ico": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.ico",
    "apple-touch-icon.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/apple-touch-icon.png",
    "icon-192x192.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-192x192.png",
    "icon-512x512.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-512x512.png"
  },
  // @ts-ignore
  features: {
    side_bar: true,
    intercom: true,
    tooltip: true,
    subscription: {
      billingMethodsDetails: [
        {
          id: "paypal",
          clientId: "xxxxxxx-xxxx-xxxxxxxxxxxxxx"
        }
      ],
      billingCyclesDetails: [
        {
          id: "month",
          name: "Monthly",
          note: null
        },
        {
          id: "year",
          name: "Annually",
          note: "Save 5%"
        }
      ],
      plans: [
        {
          id: "kontur_atlas_edu",
          name: "Educational",
          style: "basic",
          billingCycles: [
            {
              id: "month",
              initialPricePerMonth: null,
              pricePerMonth: 100,
              pricePerYear: null,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            },
            {
              id: "year",
              initialPricePerMonth: 100,
              pricePerMonth: 95,
              pricePerYear: 1140,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            }
          ]
        },
        {
          id: "kontur_atlas_pro",
          name: "Professional",
          style: "premium",
          billingCycles: [
            {
              id: "month",
              initialPricePerMonth: null,
              pricePerMonth: 1e3,
              pricePerYear: null,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            },
            {
              id: "year",
              initialPricePerMonth: 1e3,
              pricePerMonth: 950,
              pricePerYear: 11400,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            }
          ]
        },
        {
          id: "kontur_atlas_custom",
          name: "Custom",
          style: "custom",
          actions: [
            {
              name: "contact_sales",
              params: {
                link: "https://calendly.com/"
              }
            },
            {
              name: "book_a_demo"
            }
          ]
        }
      ]
    },
    app_login: true,
    toasts: true,
    use_3rdparty_analytics: true,
    about_page: {
      tabId: "about",
      assetUrl: "about.md",
      subTabs: [
        {
          tabId: "terms",
          assetUrl: "terms.md"
        },
        {
          tabId: "privacy",
          assetUrl: "privacy.md"
        },
        {
          tabId: "user-guide",
          assetUrl: "user_guide.md"
        }
      ]
    }
  },
  public: true,
  initialUser: {
    username: "",
    email: "",
    fullName: "",
    language: "en",
    useMetricUnits: true,
    subscribedToKonturUpdates: false,
    bio: "",
    osmEditor: "josm",
    defaultFeed: "kontur-public",
    theme: "kontur"
  },
  defaultLayers: [
    {
      id: "kontur_lines",
      source: {
        type: "maplibre-style-url",
        urls: [
          "https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json"
        ]
      },
      ownedByUser: false
    },
    {
      id: "population_density",
      // @ts-ignore
      source: {
        urls: [
          "https://disaster.ninja/active/api/tiles/bivariate/v1/{z}/{x}/{y}.mvt?indicatorsClass=general"
        ]
      },
      // @ts-ignore
      legend: {
        type: "simple",
        steps: [
          {
            stepName: "0 - 1.27",
            stepShape: "square",
            style: {
              color: "#F0F0D6",
              "fill-color": "#F0F0D6",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "1.27 - 2.45",
            stepShape: "square",
            style: {
              color: "#ECECC4",
              "fill-color": "#ECECC4",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "2.45 - 5.75",
            stepShape: "square",
            style: {
              color: "#EAEAB0",
              "fill-color": "#EAEAB0",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "5.75 - 12.43",
            stepShape: "square",
            style: {
              color: "#E8E89D",
              "fill-color": "#E8E89D",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "12.43 - 28.47",
            stepShape: "square",
            style: {
              color: "#E1D689",
              "fill-color": "#E1D689",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "28.47 - 66.03",
            stepShape: "square",
            style: {
              color: "#DAC075",
              "fill-color": "#DAC075",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "66.03 - 172.46",
            stepShape: "square",
            style: {
              color: "#D1A562",
              "fill-color": "#D1A562",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "172.46 - 535.67",
            stepShape: "square",
            style: {
              color: "#C98A50",
              "fill-color": "#C98A50",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "535.67 - 46200",
            stepShape: "square",
            style: {
              color: "#BF6C3F",
              "fill-color": "#BF6C3F",
              "fill-opacity": 0.8
            }
          }
        ]
      },
      ownedByUser: false
    }
  ],
  activeLayers: ["kontur_lines", "population_density"]
};
configRepo.get = () => _configDataMock;
const _md = `![Kontur Atlas](about-atlas-1.png)

# Kontur Atlas

Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.

![Geospatial Data with Ease](about-atlas-2.png)

## Geospatial Data with Ease

### Browse & Choose Data

We've got tons of info like who lives where and how people get around. Find the data that'll answer your questions.

### Make Maps

With a few clicks, Atlas turns that data into maps and visuals so it's easy to understand.

### Analyze & Decide

Use these insights to make smart decisions, like picking the perfect spot for your next big project or making concussions based on spatial patterns.

### Jump in and start exploring

Your next big opportunity is waiting to be mapped out!

## _[Subscribe to Atlas](/pricing)_ wrapped in "\\_"

### **[Subscribe to Atlas](/pricing)** "\\_\\_"

### **_[Subscribe to Atlas](/pricing)_** "\\_\\_\\*"

## How to Use

---

![youtube](https://www.youtube.com/embed/g7WMD10DMPs?si=Gl6RdNM0L3ufi0uF::800,470,true)

### Area Selection

To choose an area for analysis, you can use the toolbar to select an administrative unit, draw a shape manually, or import a GeoJSON file.

![youtube](https://www.youtube.com/embed/aCXaAYEW0oM::800,470,true)

### Analytics Panel

This panel displays essential data about your selected area.

#### AI Insights

Compares your area's data with global averages, alerting you to any significant discrepancies.

#### Personalized AI Insights

Reference Area: This allows you to set a known area as a reference point for comparisons and highlights differences.
Bio: Here, you can record details like who you're working for, your analysis purpose, and key topics, helping to personalize AI conclusions.

![youtube](https://www.youtube.com/embed/Md5Mex-POBo::800,470,true)

### Creating Custom Analysis

To create your own analysis, select the "MCDA" button in the toolbar.

#### Choosing Relevant Layers

Start by picking data layers appropriate for your requirements — this could include anything from population density to environmental risk factors.

#### Browse the map

By default, the map displays red hexagons in high-value areas and green hexagons where values are minimal. Click on any hexagon to access detailed info for that particular sector.

#### Layer Customization

Enhance your analysis by fine-tuning the range and what is bad and good of each layer. This means you can focus specifically on aspects crucial to your study.

---

### _[Learn more on kontur.io](https://www.kontur.io/atlas)_
`;
const _css = "article {\n  & * {\n    outline: lime solid thin;\n  }\n}\n";
console.info("test app id", configRepo.get().id);
const PagesDocument_fixture = {
  "PagesDocument with custom css": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: `
#Kontur Atlas
Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.
`
        },
        {
          type: "css",
          data: `
h1 { background-color: #f2f2f2; }
p { background-color: #BF6C3F; }
`
        }
      ]
    }
  ),
  "Links test": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: `
[Link](https://example.com)

Controller using this email: [hello@kontur.io](mailto:hello@kontur.io) or contact address.

Controller using this email: <hello@kontur.io> or contact address.

hello@kontur.io

kancelaria@uodo.gov.pl

ng: <kancelaria@uodo.gov.pl>

http://www.youronlinechoices.com/

ng: <http://www.youronlinechoices.com/>
`
        }
      ]
    }
  ),
  "PagesDocument markdown sample": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: _md
        },
        {
          type: "css",
          data: _css
        }
      ]
    }
  )
};
const fixture1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PagesDocument_fixture
}, Symbol.toStringTag, { value: "Module" }));
const eventCardLayoutTemplate = {
  type: "Card",
  action: "focusEvent",
  $props: { active: "active" },
  children: [
    {
      type: "Row",
      children: [
        { type: "Title", $value: "eventName" },
        { type: "Severity", $value: "severity" }
      ]
    },
    {
      type: "Text",
      $value: "location"
    },
    {
      type: "Row",
      children: [
        { type: "Field", $value: "affectedPopulation" },
        { type: "Field", $value: "settledArea" },
        { type: "Field", $value: "osmGaps" },
        { type: "Field", $value: "loss" }
      ]
    },
    {
      type: "Text",
      $value: "description",
      $if: "active"
    },
    {
      type: "IconButton",
      icon: "Play24",
      value: "Play episodes",
      action: "playEpisodes",
      $if: "showEpisodesButton"
    },
    {
      type: "Row",
      $if: "active",
      children: [
        {
          $value: "externalUrls",
          $template: {
            type: "Url"
          }
        }
      ]
    },
    {
      type: "Field",
      $value: "startedAt"
    },
    {
      type: "Field",
      $value: "updatedAt"
    }
  ]
};
const fieldsRegistry = {
  default: {
    type: "text"
  },
  affectedPopulation: {
    type: "number",
    tooltip: TranslationService.t("event_list.analytics.affected_people.tooltip"),
    icon: "People16",
    format: "number"
  },
  settledArea: {
    type: "number",
    tooltip: TranslationService.t("event_list.analytics.settled_area_tooltip"),
    icon: "Area16",
    format: "square_km"
  },
  osmGaps: {
    type: "number",
    tooltip: TranslationService.t("osm_gaps"),
    icon: "OsmGaps16",
    format: "percentage_rounded"
  },
  loss: {
    type: "number",
    tooltip: TranslationService.t("event_list.analytics.loss_tooltip"),
    icon: "DollarCircle16",
    format: "compact_currency"
  },
  // date
  startedAt: {
    type: "date",
    label: TranslationService.t("started"),
    format: "date"
  },
  created: {
    type: "date",
    label: TranslationService.t("created"),
    format: "date"
  },
  updatedAt: {
    type: "date",
    label: TranslationService.t("updated"),
    format: "date"
  },
  // HOT
  mappingTypes: {
    type: "text",
    label: TranslationService.t("mapping_types")
  },
  projectId: {
    type: "number",
    text: (v2) => `#${v2}`
  }
};
fieldsRegistry["lastUpdated"] = fieldsRegistry.updatedAt;
const language = TranslationService.instance.language || "default";
const dateFormatter = new Intl.DateTimeFormat(language, {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZoneName: "short"
}).format;
const numberFormatter = new Intl.NumberFormat(language);
const number_f000_Formatter = new Intl.NumberFormat(language, {
  maximumFractionDigits: 3
});
const percentFormatter = new Intl.NumberFormat(language, {
  style: "percent",
  maximumFractionDigits: 0
});
const currencyFormatter = new Intl.NumberFormat(language, {
  style: "currency",
  currency: "USD"
});
const compactCurrencyFormatter = new Intl.NumberFormat(language, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});
const formatsRegistry = {
  date(date) {
    return date ? dateFormatter(new Date(date)) : "";
  },
  square_km(value2) {
    return `${number_f000_Formatter.format(value2)} km²`;
  },
  percentage_rounded(value2) {
    return percentFormatter.format(value2 / 100);
  },
  currency(value2) {
    return currencyFormatter.format(value2);
  },
  compact_currency(value2) {
    return compactCurrencyFormatter.format(value2);
  },
  number(value2) {
    return numberFormatter.format(value2);
  },
  text(v2) {
    return "" + v2;
  },
  url_domain(url2, placeholder = "www") {
    try {
      const domain = new URL(url2).hostname.replace(/^www\./, "");
      return domain;
    } catch (_2) {
    }
    return placeholder;
  }
};
function compilePathAccessor(path2) {
  const segments = path2.split(".");
  const code = `
    return function(data) {
      return data${segments.map((segment) => {
    if (/^\\d+$/.test(segment)) {
      return `?.[${segment}]`;
    }
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
      return `?.${segment}`;
    }
    const safe = segment.replace(/"/g, `\\"`);
    return `?.["${safe}"]`;
  }).join("")};
    }
  `;
  return new Function(code)();
}
function compileAccessors(paths) {
  const accessors = {};
  for (const path2 of paths) {
    accessors[path2] = compilePathAccessor(path2);
  }
  return accessors;
}
function extractDataBindingPaths(node, seen = /* @__PURE__ */ new Set()) {
  if (!node || typeof node !== "object" || seen.has(node)) return [];
  seen.add(node);
  const paths = [];
  if (node.$value && typeof node.$value === "string") {
    paths.push(node.$value);
  }
  if (node.$context && typeof node.$context === "string") {
    paths.push(node.$context);
  }
  if (node.$props && typeof node.$props === "object") {
    for (const propPath of Object.values(node.$props)) {
      if (typeof propPath === "string") {
        paths.push(propPath);
      }
    }
  }
  if (node.$if && typeof node.$if === "string") {
    paths.push(node.$if);
  }
  if (node.$template && typeof node.$template === "object") {
    paths.push(...extractDataBindingPaths(node.$template, seen));
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      paths.push(...extractDataBindingPaths(child, seen));
    }
  } else if (node.children && typeof node.children === "object") {
    paths.push(...extractDataBindingPaths(node.children, seen));
  }
  return [...new Set(paths)];
}
function useUniLayoutCompiledAccessors(layoutDefinition) {
  return reactExports.useMemo(() => {
    const paths = extractDataBindingPaths(layoutDefinition);
    return compileAccessors(paths);
  }, [layoutDefinition]);
}
const UniLayoutContext = React.createContext(null);
const useUniLayoutContext = () => {
  const context = React.useContext(UniLayoutContext);
  if (!context) {
    throw new Error("useUniLayoutContext must be used within a UniLayout");
  }
  return context;
};
const defaultFormatter = (v2) => v2 !== null && v2 !== void 0 ? String(v2) : "";
function useUniLayoutContextValue({
  layout,
  actionHandler = () => {
  },
  customFieldsRegistry = {},
  customFormatsRegistry = {}
}) {
  const mergedFormatsRegistry = reactExports.useMemo(
    () => ({
      ...formatsRegistry,
      ...customFormatsRegistry
    }),
    [customFormatsRegistry]
  );
  const mergedFieldsRegistry = reactExports.useMemo(
    () => ({
      ...fieldsRegistry,
      ...customFieldsRegistry
    }),
    [customFieldsRegistry]
  );
  const precompiledAccessors = useUniLayoutCompiledAccessors(layout);
  const getFormattedValue = reactExports.useCallback(
    (fieldMeta, rawValue) => {
      if (rawValue === null || rawValue === void 0) return "";
      const formatKey = (fieldMeta == null ? void 0 : fieldMeta.format) || "text";
      const formatter = mergedFormatsRegistry[formatKey] || defaultFormatter;
      const formattedValue = formatter(rawValue);
      return (fieldMeta == null ? void 0 : fieldMeta.text) ? fieldMeta.text(formattedValue) : formattedValue;
    },
    [mergedFormatsRegistry]
  );
  return reactExports.useMemo(
    () => ({
      fieldsRegistry: mergedFieldsRegistry,
      formatsRegistry: mergedFormatsRegistry,
      precompiledAccessors,
      actionHandler,
      getFormattedValue
    }),
    [
      precompiledAccessors,
      actionHandler,
      mergedFieldsRegistry,
      mergedFormatsRegistry,
      getFormattedValue
    ]
  );
}
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toCapitalizedList = (arr) => arr.map(capitalize).join(", ");
const haveValue = (val) => val !== void 0 && val !== null;
const row = "_row_6zanc_1";
const s$c = {
  row
};
function Row({ wrap = true, children, className, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: clsx(s$c.row, className),
      style: { ...style, flexWrap: wrap ? "wrap" : "nowrap" },
      children
    }
  );
}
const card$1 = "_card_aste0_1";
const selected = "_selected_aste0_16";
const selectedFocused = "_selectedFocused_aste0_22";
const cardContent = "_cardContent_aste0_29";
const clickable = "_clickable_aste0_35";
const s$b = {
  card: card$1,
  selected,
  selectedFocused,
  cardContent,
  clickable
};
function Card({
  children,
  active: active2,
  action: action2,
  className,
  style,
  handleAction
}) {
  const handleClick = React.useCallback(() => {
    if (action2 && handleAction) {
      handleAction(action2);
    }
  }, [action2, handleAction]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: clsx(s$b.card, active2 && s$b.selected, action2 && s$b.clickable, className),
      style,
      onClick: action2 ? handleClick : void 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$b.cardContent, children })
    }
  );
}
const indicator$1 = "_indicator_h9oko_1";
const s$a = {
  indicator: indicator$1
};
const SEVERITY_CONFIG = {
  UNKNOWN: {
    level: 0,
    color: null,
    text: TranslationService.t("event_list.severity_unknown")
  },
  TERMINATION: {
    level: 1,
    color: "#FFDF35",
    text: TranslationService.t("event_list.severity_termination")
  },
  MINOR: {
    level: 2,
    color: "#FFB800",
    text: TranslationService.t("event_list.severity_minor")
  },
  MODERATE: {
    level: 3,
    color: "#FF8A00",
    text: TranslationService.t("event_list.severity_moderate")
  },
  SEVERE: {
    level: 4,
    color: "#FF3D00",
    text: TranslationService.t("event_list.severity_severe")
  },
  EXTREME: {
    level: 5,
    color: "#EA2A00",
    text: TranslationService.t("event_list.severity_extreme")
  }
};
const SEVERITY_LEVELS = Object.values(SEVERITY_CONFIG).filter(({ level }) => level > 0);
const COLORS = SEVERITY_LEVELS.map(({ color }) => color);
function SeverityIndicatorImpl({ value: value2, className }) {
  if (!SEVERITY_CONFIG[value2]) {
    return null;
  }
  const pivot = SEVERITY_CONFIG[value2].level;
  const tooltip = SEVERITY_CONFIG[value2].text;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleTooltip, { content: tooltip, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(s$a.indicator, className), children: COLORS.map((color, i2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        backgroundColor: i2 < pivot ? color ?? "none" : "#eceeef"
      }
    },
    i2
  )) }) });
}
const SeverityIndicator = reactExports.memo(SeverityIndicatorImpl);
const url = "_url_1o8yo_1";
const icon$2 = "_icon_1o8yo_12";
const s$9 = {
  url,
  icon: icon$2
};
function Url(props) {
  const { value: value2 = "#", label: label2, newTab = true, className } = props;
  const displayText = label2 || (value2 ? formatsRegistry.url_domain(value2) : "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: value2,
      className: clsx(s$9.url, className),
      target: newTab ? "_blank" : void 0,
      rel: newTab ? "noopener noreferrer" : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayText }),
        newTab && /* @__PURE__ */ jsxRuntimeExports.jsx(Memo$9, { className: s$9.icon })
      ]
    }
  );
}
const titleText = "_titleText_kpgt4_1";
const text = "_text_kpgt4_8";
const alignStart = "_alignStart_kpgt4_14";
const baseStyles = {
  titleText,
  text,
  alignStart
};
function Title({ value: value2, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(baseStyles.titleText, className), children: value2 });
}
function Text({ value: value2, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(baseStyles.text, className), children: value2 });
}
const badge = "_badge_108ln_1";
const error$1 = "_error_108ln_12";
const success = "_success_108ln_17";
const warning = "_warning_108ln_22";
const info = "_info_108ln_27";
const neutral = "_neutral_108ln_32";
const s$8 = {
  badge,
  error: error$1,
  success,
  warning,
  info,
  neutral
};
const Variants = {
  error: s$8.error,
  success: s$8.success,
  warning: s$8.warning,
  info: s$8.info,
  neutral: s$8.neutral
};
function Badge({
  value: value2,
  variant = "neutral",
  mapping,
  className = "",
  style = {}
}) {
  if (value2 === void 0) return null;
  const key = ("" + value2).toLowerCase();
  const computedVariant = (mapping == null ? void 0 : mapping[key]) ?? variant;
  const variantClass = Variants[computedVariant.toLowerCase()] ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(s$8.badge, variantClass, className), style, children: value2 });
}
const progress = "_progress_2aklk_1";
const caption = "_caption_2aklk_9";
const desc = "_desc_2aklk_13";
const stack = "_stack_2aklk_19";
const s$7 = {
  progress,
  caption,
  desc,
  stack
};
function StackedProgressBar({
  value: items,
  caption: caption2,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$7.progress, className), children: [
    caption2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$7.caption, children: caption2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$7.stack, children: items.map(({ color, value: value2 }, i2) => {
      const style = {};
      if (color) style["backgroundColor"] = color;
      const clampedValue = Math.max(0, Math.min(100, value2));
      style["width"] = clampedValue + "%";
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style }, i2);
    }).reverse() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$7.desc, children: items.map(({ color, title: title2, value: value2 }, i2) => {
      const style = {};
      if (color) style["color"] = color;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style, children: value2 + title2 }, i2);
    }) })
  ] });
}
function MappingProgress({
  percentValidated,
  percentMapped,
  caption: caption2
}) {
  const items = [
    {
      title: "% Validated",
      value: +percentValidated,
      color: "var(--success-strong)"
    },
    {
      title: "% Mapped",
      value: +percentMapped,
      color: "var(--faint-strong)"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StackedProgressBar, { value: items, caption: caption2 });
}
const Icon = reactExports.forwardRef(({ icon: icon2, ...svgProps }, ref) => {
  const KonturIcon = icons[icon2];
  reactExports.useEffect(() => {
    if (!icons[icon2]) console.error(`Icon "${icon2}" not found`);
  }, [icon2]);
  return KonturIcon ? /* @__PURE__ */ jsxRuntimeExports.jsx(KonturIcon, { ref, ...svgProps }) : null;
});
Icon.displayName = "SvgIcon";
const fieldText = "_fieldText_7g06j_1";
const container = "_container_7g06j_7";
const icon$1 = "_icon_7g06j_14";
const value = "_value_7g06j_19";
const label = "_label_7g06j_24";
const s$6 = {
  fieldText,
  container,
  icon: icon$1,
  value,
  label
};
function Field({
  value: value2,
  $meta,
  className = "",
  showLabel = true,
  format
}) {
  const context = useUniLayoutContext();
  if (value2 === void 0) return null;
  const fieldMeta = $meta == null ? void 0 : $meta.value;
  const formattedValue = format && context.formatsRegistry[format] ? context.formatsRegistry[format](value2) : context.getFormattedValue(fieldMeta, value2);
  const shouldShowLabel = showLabel && (fieldMeta == null ? void 0 : fieldMeta.label);
  const tooltip = fieldMeta == null ? void 0 : fieldMeta.tooltip;
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$6.container, className), children: [
    (fieldMeta == null ? void 0 : fieldMeta.icon) && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { icon: fieldMeta.icon, className: s$6.icon }),
    shouldShowLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$6.label, children: fieldMeta.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$6.value, children: formattedValue })
  ] });
  if (tooltip) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleTooltip, { content: tooltip, placement: "top", children: content });
  }
  return content;
}
const cardHeader = "_cardHeader_tv12g_1";
const imageContainer = "_imageContainer_tv12g_8";
const image = "_image_tv12g_8";
const icon = "_icon_tv12g_22";
const title = "_title_tv12g_27";
const subtitle = "_subtitle_tv12g_33";
const s$5 = {
  cardHeader,
  imageContainer,
  image,
  icon,
  title,
  subtitle
};
function CardHeader({ image: image2, icon: icon2, value: value2, subtitle: subtitle2, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$5.cardHeader, className), children: [
    image2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$5.imageContainer, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image2, alt: "", className: s$5.image }) }),
    icon2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { icon: icon2, className: s$5.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$5.title, children: value2 }),
    subtitle2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$5.subtitle, children: subtitle2 })
  ] });
}
function IconButton({
  value: value2,
  $meta,
  icon: icon2,
  variant = "invert-outline",
  action: action2,
  handleAction,
  ...props
}) {
  const context = useUniLayoutContext();
  const fieldMeta = $meta == null ? void 0 : $meta.value;
  const formattedValue = context.getFormattedValue(fieldMeta, value2);
  const tooltip = fieldMeta == null ? void 0 : fieldMeta.tooltip;
  const handler = reactExports.useCallback(() => {
    if (action2 && handleAction) {
      handleAction(action2);
    }
  }, [action2, handleAction]);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      className: baseStyles.alignStart,
      variant,
      size: "tiny",
      onClick: action2 ? handler : void 0,
      iconBefore: icon2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { icon: icon2, style: { height: 16 } }),
      ...props,
      children: formattedValue
    }
  );
  if (tooltip) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleTooltip, { content: tooltip, placement: "top", children: content });
  }
  return content;
}
const componentsRegistry = {
  Card,
  Row,
  CardHeader,
  Title,
  Text,
  Field,
  IconButton,
  Url,
  Badge,
  MappingProgress,
  Severity: SeverityIndicator
};
const ErrorComponent = ({ type, error: error2, severity = "error" }) => {
  const style = {
    color: "white",
    backgroundColor: severity === "error" ? "red" : "orange",
    fontSize: "12px"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style, children: error2 ? `Error in ${type}: ${error2}` : `Unknown Component: ${type}` });
};
function isComponentNode(node) {
  return node && typeof node === "object" && (typeof node.type === "string" || node.$template);
}
function resolveBinding(dataPath, contextData, context) {
  const accessor = context.precompiledAccessors[dataPath];
  if (!accessor) {
    return createBindingError(`No accessor for "${dataPath}"`);
  }
  try {
    const value2 = accessor(contextData);
    const fieldMeta = context.fieldsRegistry[dataPath] ?? context.fieldsRegistry.default;
    return { value: value2, fieldMeta };
  } catch (error2) {
    return createBindingError(`Execution failed for "${dataPath}": ${String(error2)}`);
  }
}
function createBindingError(error2) {
  console.error(error2);
  return { value: void 0, fieldMeta: { type: "text" }, error: error2 };
}
function resolveComponent(type) {
  return componentsRegistry[type] || null;
}
function applyOverrides(fieldMeta, overrides = {}) {
  if (!overrides) return fieldMeta;
  return { ...fieldMeta, ...overrides };
}
function processNodeProps(node, data, context) {
  const {
    props: staticProps,
    $value: dataBindingPath,
    $context: contextBindingPath,
    $props: propsBindings,
    overrides,
    type,
    key,
    children,
    $if,
    ...restNodeProps
  } = node;
  const resolvedProps = { ...restNodeProps, ...staticProps };
  let boundData = data;
  if (contextBindingPath && typeof contextBindingPath === "string") {
    const contextBindingResult = resolveBinding(contextBindingPath, data, context);
    boundData = contextBindingResult.value;
  }
  if (dataBindingPath && typeof dataBindingPath === "string") {
    const dataBindingResult = resolveBinding(dataBindingPath, boundData, context);
    const fieldMeta = (overrides == null ? void 0 : overrides.value) ? applyOverrides(dataBindingResult.fieldMeta, overrides.value) : dataBindingResult.fieldMeta;
    resolvedProps.value = dataBindingResult.value;
    resolvedProps.$meta = { value: fieldMeta };
  } else if (!dataBindingPath && haveValue(boundData) && !("value" in resolvedProps)) {
    resolvedProps.value = boundData;
    resolvedProps.$meta = { value: context.fieldsRegistry.default };
  }
  if (propsBindings && typeof propsBindings === "object") {
    if (!resolvedProps.$meta) {
      resolvedProps.$meta = { value: {} };
    }
    for (const [propName, propPath] of Object.entries(propsBindings)) {
      if (typeof propPath !== "string") {
        continue;
      }
      const propBindingResult = resolveBinding(propPath, boundData, context);
      const fieldMeta = (overrides == null ? void 0 : overrides[propName]) ? applyOverrides(propBindingResult.fieldMeta, overrides[propName]) : propBindingResult.fieldMeta;
      resolvedProps[propName] = propBindingResult.value;
      resolvedProps.$meta[propName] = fieldMeta;
    }
  }
  if (context.actionHandler) {
    resolvedProps.handleAction = (action2, actionData) => {
      context.actionHandler(action2, { ...boundData, ...actionData });
    };
  }
  return { resolvedProps, boundData };
}
function shouldProcessChildren(node) {
  return node.children !== void 0;
}
function renderChildren(children, data) {
  if (Array.isArray(children)) {
    return children.map((child, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutRendererInternal, { node: child, data }, (child == null ? void 0 : child.key) ?? index2));
  }
  if (children && (typeof children === "object" || typeof children === "string" || typeof children === "number" || reactExports.isValidElement(children))) {
    return reactExports.isValidElement(children) ? children : /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutRendererInternal, { node: children, data });
  }
  return null;
}
const LayoutRendererInternal = ({ node, data }) => {
  const context = useUniLayoutContext();
  if (node === null || node === void 0 || typeof node === "boolean") {
    return null;
  }
  if (typeof node === "string" || typeof node === "number") {
    return node;
  }
  if (reactExports.isValidElement(node)) {
    return node;
  }
  if (Array.isArray(node)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: node.map((childNode, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      LayoutRendererInternal,
      {
        node: childNode,
        data
      },
      (childNode == null ? void 0 : childNode.key) ?? index2
    )) });
  }
  if (!node || typeof node !== "object") {
    return null;
  }
  const { resolvedProps, boundData } = processNodeProps(node, data, context);
  if (node.$if) {
    const ifBindingResult = resolveBinding(node.$if, boundData, context);
    if (!ifBindingResult.value) {
      return null;
    }
  }
  if (node.$template && Array.isArray(resolvedProps.value)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: resolvedProps.value.map((item, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutRendererInternal, { node: node.$template, data: item }, index2)) });
  }
  if (!isComponentNode(node) || !node.type) {
    return null;
  }
  const Component = resolveComponent(node.type);
  if (!Component) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorComponent, { type: node.type, severity: "warning" });
  }
  const childrenDataContext = boundData !== void 0 ? boundData : data;
  const renderedChildren = shouldProcessChildren(node) ? renderChildren(node.children, childrenDataContext) : null;
  try {
    return React.createElement(
      Component,
      { ...node.key !== void 0 && { key: node.key }, ...resolvedProps },
      renderedChildren
    );
  } catch (error2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorComponent, { type: node.type, error: `Render error: ${String(error2)}` });
  }
};
const UniLayoutRenderer = reactExports.memo(LayoutRendererInternal);
const eventSampleData = [
  {
    eventId: "cf2027b7-7932-4db1-9532-5315537129f4",
    eventName: "Drought Eastern Mediterranean, Middle East-2024",
    eventType: "DROUGHT",
    description: "The  Drought alert level is Orange.",
    location: "Egypt, Israel, Iraq, Islamic Republic of Iran, Jordan, Lebanon, Gaza Strip, Saudi Arabia, Syria, Turkmenistan, Türkiye",
    severity: "SEVERE",
    affectedPopulation: 170326791,
    settledArea: 313256.1139786269,
    osmGaps: 32,
    startedAt: "2023-08-11T00:00:00Z",
    updatedAt: "2025-04-14T06:01:01.975Z",
    externalUrls: [
      "https://www.gdacs.org/report.aspx?eventtype=DR&eventid=1017535",
      "https://www.gdacs.org/report.aspx?eventid=1017535&episodeid=8&eventtype=DR"
    ],
    bbox: [29.000000000000057, 26.000000000000068, 59.99999999999994, 41.000000000000014],
    centroid: [34.000000000000135, 38.50000000000003],
    episodeCount: 1,
    active: true,
    showEpisodesButton: false
  },
  {
    eventId: "f84f21e0-65c9-48e0-8e37-f43dab2777f5",
    eventName: "Flood",
    eventType: "FLOOD",
    description: "On 17/11/2024, a flood started in Indonesia, lasting until 12/02/2025 (last update). The flood caused 37 deaths and 4190 displaced .",
    location: "Indonesia",
    severity: "MODERATE",
    affectedPopulation: 130969671,
    settledArea: 10031.986031753553,
    osmGaps: 3,
    startedAt: "2024-11-17T01:00:00Z",
    updatedAt: "2025-02-11T15:46:01.944Z",
    externalUrls: [
      "https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025",
      "https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL"
    ],
    bbox: [98.1180632, -10.2927858, 140.76358974504504, 4.2304443],
    centroid: [98.8796722168584, 1.1440190000000001],
    episodeCount: 1
  },
  {
    eventId: "b725a2e4-613b-4a10-9916-be7575658bf6",
    eventName: "PRIV Cyclone OPHELIA",
    eventType: "CYCLONE",
    description: "NOTICE... LAND-BASED TROPICAL CYCLONE WATCHES AND WARNINGS ARE NO LONGER INCLUDED IN THE TROPICAL CYCLONE FORECAST/ADVISORY...(TCM). CURRENT LAND-BASED COASTAL WATCHES AND WARNINGS CAN BE FOUND IN THE MOST RECENTLY ISSUED TROPICAL CYCLONE PUBLIC ADVISORY...(TCP). POST-",
    severity: "MODERATE",
    affectedPopulation: 51764949,
    settledArea: 372775.86719946715,
    osmGaps: 6,
    loss: 1067531784,
    startedAt: "2023-09-21T15:00:00Z",
    updatedAt: "2023-09-24T03:02:08.627Z",
    externalUrls: ["https://www.nhc.noaa.gov/text/refresh/MIATCMAT1+shtml/240240.shtml"],
    bbox: [-82.8981311673097, 25.988304006373998, -70.88844047428728, 41.301760744151665],
    centroid: [-77.19293581123283, 35.92034184848231],
    episodeCount: 14
  },
  {
    eventId: "b78cb252-ca5b-4142-81c4-2580cb7185c5",
    eventName: "Flood",
    description: "On 12/10/2024, a flood started in Philippines, lasting until 23/10/2024 (last update). The flood caused 3 deaths and 12793 displaced .",
    location: "Philippines",
    severity: "MODERATE",
    affectedPopulation: 91292456,
    settledArea: 226593.78501049057,
    osmGaps: 24,
    startedAt: "2024-10-20T06:10:00.801Z",
    updatedAt: "2024-10-24T06:16:02.801Z",
    externalUrls: [
      "https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1102952",
      "https://www.gdacs.org/report.aspx?eventid=1102952&episodeid=4&eventtype=FL"
    ],
    bbox: [114.1036921, 4.3833333, 126.8030411, 21.321928],
    centroid: [122.34333739191402, 13.3475474],
    episodeCount: 3,
    showEpisodesButton: true,
    active: true
  },
  {
    eventId: "7f76d4cd-9a6b-493c-8327-dcc5fb7ed62b",
    eventName: "Drought South America-2023",
    description: "The  Drought alert level is Orange.",
    location: "Bolivia, Brazil, Colombia, Ecuador, Peru, Venezuela",
    severity: "SEVERE",
    affectedPopulation: 83774237,
    settledArea: 22623.66198005802,
    osmGaps: 13,
    startedAt: "2024-12-01T01:01:05.006Z",
    updatedAt: "2024-12-08T06:01:05.566Z",
    externalUrls: [
      "https://www.gdacs.org/report.aspx?eventtype=DR&eventid=1016449",
      "https://www.gdacs.org/report.aspx?eventid=1016449&episodeid=44&eventtype=DR"
    ],
    bbox: [
      -79.99999999999982,
      -24.000999999999916,
      -40.80399999999995,
      10.999999999999964
    ],
    centroid: [-68.99999999999991, 8.499999999999986],
    episodeCount: 1
  },
  {
    eventId: "bc61af10-d5e0-4ac6-8209-517cc4cc1c18",
    eventName: "Cyclone KONG-REY-24",
    description: "From 25/10/2024 to 01/11/2024, a Tropical Storm (maximum wind speed of 241 km/h) KONG-REY-24 was active in NWPacific. The cyclone affects these countries: Philippines, Taiwan, China, Japan (vulnerability Medium). Estimated population affected by category 1 (120 km/h) wind speeds or higher is 15.764 million .",
    location: "Philippines, Taiwan, China, Japan",
    severity: "EXTREME",
    affectedPopulation: 327420839,
    settledArea: 338311.5725637373,
    osmGaps: 13,
    startedAt: "2024-11-01T10:01:01.723Z",
    updatedAt: "2024-11-02T10:06:02.723Z",
    externalUrls: [
      "https://www.gdacs.org/report.aspx?eventtype=TC&eventid=1001118",
      "https://www.gdacs.org/report.aspx?eventid=1001118&episodeid=32&eventtype=TC"
    ],
    bbox: [115.90902578825603, 12.11200000000004, 148.425513942233, 39.90399999999999],
    centroid: [120.5266357909849, 26.037351789489346],
    episodeCount: 1
  }
];
const hotData = [
  {
    teams: [],
    author: "naveenpf",
    k_type: "polygon",
    aoiBBOX: [75.956806, 10.176628, 76.874643, 10.774978],
    created: "2018-11-20T17:35:23.715104Z",
    private: false,
    campaigns: [{ id: 261, name: "2018 India Floods" }],
    interests: [{ id: 3, name: "disaster response" }],
    projectId: 5522,
    countryTag: ["India"],
    difficulty: "EASY",
    lastUpdated: "2019-11-27T02:54:50.781237Z",
    projectInfo: {
      name: "India flood mapping",
      locale: "en",
      description: "Monsoon rains have wreaked havoc throughout various states of India, resulting in a number of deaths and huge numbers of displaced citizens. OSM India, supported by HOT, have launched a response to aid relief efforts. This project is to map the buildings.\n\nNote that there may be some buildings already mapped -- please identify buildings that have NOT yet been mapped, and help to improve the quality of the building map edits that have already.",
      instructions: '**Imagery Source: Use Maxar Preimum Imagery to map.**\n\nPlease focus on adding only the buildings. Remember to trace the building footprint as accurately as possible - then press the "q" button on your keyboard to square the edges before tagging it as a building.\n\nMany of the tiles will already have buildings mapped -- if you find that the building footprints are not accurate, please correct them if possible.\n\n<h3>Video: Adding Buildings to Openstreetmap</h3>\n<iframe width="560" height="315" src="https://www.youtube.com/embed/E1YJV6I_rhY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\n\n\n\n #### #osm_in #2018IndiaFloods',
      shortDescription: "Supporting local flood response in India due to monsoons.",
      perTaskInstructions: ""
    },
    mappingTypes: ["ROADS", "BUILDINGS"],
    organisation: 29,
    activeMappers: 0,
    defaultLocale: "en",
    percentMapped: 33,
    mappingEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS"],
    projectPriority: "LOW",
    allowedUsernames: [],
    changesetComment: "#hotosm-project-5522 #osm_in #2018IndiaFloods #mmteamarm",
    organisationLogo: "https://cdn.hotosm.org/tasking-manager/uploads/1597218299183_817px-OpenStreetMap-India.svg.png",
    organisationName: "OSM India",
    organisationSlug: "osm-india",
    percentValidated: 0,
    taskCreationMode: "GRID",
    mappingPermission: "ANY",
    percentBadImagery: 0,
    validationEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS"],
    validationPermission: "ANY"
  },
  {
    teams: [],
    author: "naveenpf",
    k_type: "polygon",
    aoiBBOX: [75.956806, 10.176628, 76.874643, 10.774978],
    created: "2018-11-16T08:00:28.447658Z",
    private: false,
    campaigns: [{ id: 261, name: "2018 India Floods" }],
    interests: [{ id: 3, name: "disaster response" }],
    projectId: 5496,
    countryTag: ["India"],
    difficulty: "EASY",
    lastUpdated: "2020-11-14T21:19:03.811366Z",
    projectInfo: {
      name: "Thrissur, Kerala Floods, India Road Network Improvement",
      locale: "en",
      description: "`You could join HOTOSM local slack #disaster channel while mapping these tasks` (https://slack.hotosm.org)\n\nMapping project in response to 2018 Flooding in Kerala\nThrissur , Kerala, India Road Network Improvement",
      instructions: 'Please focus on adding only the missing roads which are OSM highway=unclassified tagged.\n\n[The India Highway Tagging Guide](https://wiki.openstreetmap.org/wiki/India:Tags/Highway) has more information on properly classifying roads in India\n\n<h3>Video: Adding roads to Openstreetmap</h3>\n<iframe width="560" height="315" src="https://www.youtube.com/embed/ZBLwb2nisJQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\nRoads Improvement Project Specific Instructions\n================================\n* The most recent imagery is DG Premium, be aware, DG Premium to zoom level 17 is newest, switches to older imagery zoomed past 17\n* Please add missing roads. Most will be "unclassified"\n\n #### #osm_in #2018IndiaFloods',
      shortDescription: "You can join HOTOSM local slack #disaster channel while mapping these tasks` (https://slack.hotosm.org)\n\nMapping project in response to 2018 Flooding in Kerala",
      perTaskInstructions: ""
    },
    mappingTypes: ["ROADS"],
    organisation: 29,
    activeMappers: 0,
    defaultLocale: "en",
    percentMapped: 98,
    mappingEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS"],
    projectPriority: "HIGH",
    allowedUsernames: [],
    changesetComment: "#hotosm-project-5496 #osm_in #2018IndiaFloods",
    organisationLogo: "https://cdn.hotosm.org/tasking-manager/uploads/1597218299183_817px-OpenStreetMap-India.svg.png",
    organisationName: "OSM India",
    organisationSlug: "osm-india",
    percentValidated: 33,
    taskCreationMode: "GRID",
    mappingPermission: "ANY",
    percentBadImagery: 0,
    validationEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS"],
    validationPermission: "ANY"
  },
  {
    teams: [],
    author: "geohacker",
    k_type: "polygon",
    aoiBBOX: [76.959254, 10.048946, 77.140251, 10.312653],
    created: "2020-08-10T05:25:03.149752Z",
    private: false,
    campaigns: [],
    interests: [
      {
        id: 3,
        name: "disaster response"
      },
      {
        id: 6,
        name: "disaster preparedness"
      }
    ],
    projectId: 9165,
    countryTag: ["India"],
    difficulty: "MODERATE",
    lastUpdated: "2023-07-08T15:10:18.497268Z",
    projectInfo: {
      name: "Munnar, Kerala - Landslide 2020 - Roads",
      locale: "en",
      description: "Over the last couple of years, the Monsoons have been causing unprecedented havoc through floods and landslides in the Kerala state. [In 2018](https://en.wikipedia.org/wiki/2018_Kerala_floods), Kerala saw the most devastating crises with 683 deaths and 140 people missing. With many parts of the state under red alert, more rains and flood is predicted. \n\nThis year, the community is coming together early to prepare. Currently the focus is Munnar, Kerala. The goal of this task is to map roads.\n\nIf you have questions about this task, join the [OSM Kerala Telegram Channel](https://t.me/osmkerala)",
      instructions: "### Imagery\nPlease use **Bing** & **Maxar Imagery** to trace the buildings.\nIf you find a huge offset with the existing data, please do not try to move all the data. See [LearnOSM](https://learnosm.org/en/hot-tips/imagery/)_ for detailed instructions on handling imagery offset, or Aerial Imagery & Alignment for adjusting in the iD editor.\n\n### Roads\n- Two-minute Tutorial: Roads - https://www.youtube.com/watch?v=ZBLwb2nisJQ\n- Map roads and paths that are visible using satellite imagery\n- Do not change alignment or delete existing data\n\n#### Quick tagging guide\n\nType | Tag \n-------|-------\nRoads connecting villages | `highway=unclassified`\nRoads connecting houses, drivable | `highway=residential`\nCongested residential areas, not wide | `highway=living_street`\nTrails covered by foot | `highway=path`\n\nMore detailed guide [is available here.](https://wiki.openstreetmap.org/wiki/India/Tags/Highway#Road_classification_and_tagging_scheme_for_India_.28proposal.29)",
      shortDescription: "OpenStreetMap India is mapping Munnar, Kerala which has been seeing higher rates of rainfalls again in 2020. Few days ago, a landslide claimed over 15 lives with more than 40 people still missing.\n\nThis task will focus on mapping roads. If you have questions about this task, join the [OSM Kerala Telegram Channel](https://t.me/osmkerala)",
      perTaskInstructions: ""
    },
    mappingTypes: ["ROADS"],
    organisation: 29,
    activeMappers: 0,
    defaultLocale: "en",
    percentMapped: 99,
    priorityAreas: [
      {
        type: "Polygon",
        coordinates: [
          [
            [77.032498, 10.191444],
            [77.070204, 10.196346],
            [77.086805, 10.176506],
            [77.050047, 10.145927],
            [77.02894, 10.130753],
            [77.006648, 10.130753],
            [76.988625, 10.136356],
            [76.972262, 10.154798],
            [76.985779, 10.159233],
            [77.009494, 10.176039],
            [77.013763, 10.181641],
            [77.033921, 10.180007],
            [77.032498, 10.191444]
          ]
        ]
      }
    ],
    mappingEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS", "CUSTOM"],
    projectPriority: "LOW",
    allowedUsernames: [],
    changesetComment: "#kerala-floods-2020",
    organisationLogo: "https://cdn.hotosm.org/tasking-manager/uploads/1597218299183_817px-OpenStreetMap-India.svg.png",
    organisationName: "OSM India",
    organisationSlug: "osm-india",
    percentValidated: 87,
    taskCreationMode: "GRID",
    mappingPermission: "ANY",
    percentBadImagery: 0,
    validationEditors: ["ID", "JOSM", "POTLATCH_2", "FIELD_PAPERS", "CUSTOM"],
    validationPermission: "ANY",
    enforceRandomTaskSelection: false
  }
];
const hotProjectLayoutTemplate = {
  type: "Card",
  children: [
    {
      type: "Row",
      children: [
        {
          type: "Badge",
          $value: "projectId"
        },
        // Project priority with proper binding and overrides
        {
          type: "Badge",
          $props: {
            value: "projectPriority",
            variant: "projectPriority"
          },
          props: {
            mapping: {
              low: "neutral",
              medium: "info",
              high: "warning",
              urgent: "error"
            }
          }
        }
      ]
    },
    {
      type: "Title",
      $value: "projectInfo.name"
    },
    {
      type: "MappingProgress",
      $props: {
        percentValidated: "percentValidated",
        percentMapped: "percentMapped"
      }
    },
    {
      type: "Text",
      $value: "projectInfo.shortDescription"
    },
    {
      type: "Field",
      $value: "mappingTypes",
      showLabel: true
    },
    {
      type: "Field",
      $value: "created"
    },
    {
      type: "Field",
      $value: "lastUpdated"
    },
    {
      type: "Text",
      $value: "mappingEditors"
    },
    {
      type: "Url",
      $value: "projectId",
      // pre-transform: 'https://tasks.hotosm.org/projects/{value}' -> projectUrl,
      label: "Open in Tasking Manager"
    }
  ]
};
const complexDataSamples = [
  {
    countries: [
      {
        id: 0,
        name: "Madagascar"
      },
      {
        id: 1,
        name: "Comoros"
      }
    ],
    countryProfiles: [
      {
        countryId: 0,
        indicators: [
          {
            indicator: "gdp",
            value: 1906
          },
          {
            indicator: "inform_risk",
            value: 5.1
          }
        ]
      },
      {
        countryId: 1,
        indicators: [
          {
            indicator: "gdp",
            value: 1500
          },
          {
            indicator: "inform_risk",
            value: 4.8
          }
        ]
      }
    ],
    analytics: {
      geometry: [
        {
          indicator: "area_km2",
          value: 458583
        },
        {
          indicator: "populated_area",
          value: 36896
        }
      ],
      countries: [
        {
          countryId: 0,
          indicators: [
            {
              indicator: "area_km2",
              value: 3e5
            },
            {
              indicator: "populated_area",
              value: 4e6
            }
          ]
        },
        {
          countryId: 1,
          indicators: [
            {
              indicator: "area_km2",
              value: 158583
            },
            {
              indicator: "populated_area",
              value: 1716509
            }
          ]
        }
      ],
      geometryCountryIntersections: [
        {
          countryId: 0,
          indicators: [
            {
              indicator: "area_km2",
              value: 28e4
            },
            {
              indicator: "populated_area",
              value: 35e5
            }
          ]
        },
        {
          countryId: 1,
          indicators: [
            {
              indicator: "area_km2",
              value: 15e4
            },
            {
              indicator: "populated_area",
              value: 16e5
            }
          ]
        }
      ]
    }
  }
];
const complexDataLayout = {
  type: "Card",
  props: {
    title: "Country Analysis",
    className: "country-analysis-card"
  },
  children: [
    {
      type: "CardHeader",
      image: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDFMMzEgOHYxNkwxNiAzMUwxIDI0VjhMMTYgMVoiIGZpbGw9IiNlZWUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZmlsbD0iY3VycmVudENvbG9yIj5BQjwvdGV4dD48L3N2Zz4=",
      icon: "Area16",
      value: "Countries",
      subtitle: "Report"
    },
    {
      type: "Row",
      children: [
        {
          type: "IconButton",
          value: "Play",
          icon: "Play24",
          action: "play"
        },
        {
          type: "IconButton",
          value: "No icon button",
          action: "test"
        }
      ]
    },
    {
      $value: "countries",
      $template: {
        type: "Badge",
        $value: "name",
        variant: "primary"
      }
    },
    {
      type: "Title",
      value: "Country Profiles"
    },
    {
      $value: "countryProfiles",
      $template: {
        type: "Card",
        props: {
          title: "Country Profile",
          size: "small"
        },
        children: [
          {
            type: "Field",
            showLabel: true,
            value: "Country ID:",
            $props: {
              value: "countryId"
            }
          },
          {
            $value: "indicators",
            $template: {
              type: "Row",
              children: [
                {
                  type: "Field",
                  $value: "indicator",
                  showLabel: true
                },
                {
                  type: "Field",
                  $value: "value",
                  showLabel: false,
                  overrides: {
                    value: {
                      format: "number"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: "Title",
      value: "Analytics"
    },
    {
      type: "Card",
      $context: "analytics",
      props: {
        title: "Geometry Indicators",
        size: "small"
      },
      children: [
        {
          $value: "geometry",
          $template: {
            type: "Row",
            children: [
              {
                type: "Field",
                $value: "indicator",
                showLabel: true
              },
              {
                type: "Field",
                $value: "value",
                showLabel: false,
                overrides: {
                  value: {
                    format: "number"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    {
      type: "Title",
      value: "Country Analytics",
      $context: "analytics"
    },
    {
      $value: "countries",
      $context: "analytics",
      $template: {
        type: "Card",
        props: {
          title: "Country Analysis",
          size: "small"
        },
        children: [
          {
            type: "Field",
            showLabel: true,
            value: "Country ID:",
            $props: {
              value: "countryId"
            }
          },
          {
            $value: "indicators",
            $template: {
              type: "Row",
              children: [
                {
                  type: "Field",
                  $value: "indicator",
                  showLabel: true
                },
                {
                  type: "Field",
                  $value: "value",
                  overrides: {
                    value: {
                      format: "number",
                      icon: "Area16"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: "Title",
      value: "Geometry-Country Intersections",
      $context: "analytics"
    },
    {
      $value: "geometryCountryIntersections",
      $context: "analytics",
      $template: {
        type: "Card",
        props: {
          title: "Intersection",
          size: "small"
        },
        children: [
          {
            type: "Field",
            showLabel: true,
            value: "Country ID:",
            $props: {
              value: "countryId"
            }
          },
          {
            $value: "indicators",
            $template: {
              type: "Row",
              children: [
                {
                  type: "Field",
                  $value: "indicator",
                  showLabel: true
                },
                {
                  type: "Field",
                  $value: "value",
                  overrides: {
                    value: {
                      format: "square_km",
                      icon: "Area16"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
const grid = "_grid_gg9uu_1";
const card = "_card_gg9uu_7";
const tcard = "_tcard_gg9uu_28";
const error = "_error_gg9uu_44";
const styles = {
  grid,
  card,
  tcard,
  error
};
const useJsonState = (initialValue) => {
  const [json, setJson] = reactExports.useState(JSON.stringify(initialValue, null, 4));
  return [json, setJson];
};
const JsonEditor = ({
  value: value2,
  onChange: onChange2,
  placeholder,
  className = "",
  title: title2,
  visible = true
}) => {
  const [localValue, setLocalValue] = reactExports.useState(value2);
  const [hasError, setHasError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setLocalValue(value2);
  }, [value2]);
  const handleChange = (newValue) => {
    setLocalValue(newValue);
    try {
      JSON.parse(newValue);
      onChange2(newValue);
      setHasError(false);
    } catch (error2) {
      setHasError(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: clsx(styles.tcard, { [styles.error]: hasError }, className),
      style: { display: visible ? "flex" : "none" },
      children: [
        title2 && /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { children: title2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: localValue,
            onChange: (e) => handleChange(e.target.value),
            placeholder
          }
        )
      ]
    }
  );
};
const createLayoutDebugger = (initialLayout, initialData) => {
  return function LayoutDebuggerInstance() {
    const [maxCards] = useFixtureInput("Limit Data Samples", 4);
    const [showLayoutEditor] = useFixtureInput("Show Layout Editor", true);
    const [showDataEditor] = useFixtureInput("Show Data Editor", true);
    const [layoutJson, setLayoutJson] = useJsonState(initialLayout);
    const [dataJson, setDataJson] = useJsonState(initialData);
    const layout = JSON.parse(layoutJson);
    const limitedData = Array.isArray(initialData) ? JSON.parse(dataJson).slice(0, maxCards) : [JSON.parse(dataJson)];
    const handleAction = (action2, payload) => {
      console.info("Action triggered:", action2, payload);
      alert(`Action triggered: ${action2}
Payload: ${JSON.stringify(payload)}`);
    };
    const contextValue = useUniLayoutContextValue({
      layout,
      actionHandler: handleAction
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UniLayoutContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.grid, children: limitedData.map((item, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.card, children: /* @__PURE__ */ jsxRuntimeExports.jsx(UniLayoutRenderer, { node: layout, data: item }) }, index2)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          JsonEditor,
          {
            value: layoutJson,
            onChange: setLayoutJson,
            placeholder: "Edit Layout JSON",
            title: "Layout Editor",
            visible: showLayoutEditor
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          JsonEditor,
          {
            value: dataJson,
            onChange: setDataJson,
            placeholder: "Edit Data JSON",
            title: "Data Editor",
            visible: showDataEditor
          }
        )
      ] })
    ] });
  };
};
const LayoutDebugger_fixture = {
  "Event Card": createLayoutDebugger(eventCardLayoutTemplate, eventSampleData),
  "HOT Project Card": createLayoutDebugger(hotProjectLayoutTemplate, hotData),
  "Complex Demo": createLayoutDebugger(complexDataLayout, complexDataSamples)
};
const fixture2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LayoutDebugger_fixture
}, Symbol.toStringTag, { value: "Module" }));
function UniLayout({
  layout,
  data,
  actionHandler = () => {
  },
  customFieldsRegistry = {},
  customFormatsRegistry = {},
  children
}) {
  const contextValue = useUniLayoutContextValue({
    layout,
    actionHandler,
    customFieldsRegistry,
    customFormatsRegistry
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(UniLayoutContext.Provider, { value: contextValue, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UniLayoutRenderer, { node: layout, data }),
    children
  ] });
}
function FieldWrapper({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UniLayout, { layout: { type: "Row" }, data: {}, children });
}
function FieldsRegistry() {
  const [sampleText] = useFixtureInput("Sample Text", "Foo Bar ...");
  const [sampleNumber] = useFixtureInput("Sample Number", -32465.27542);
  const [sampleDate] = useFixtureInput("Sample Date", "2023-05-28T14:30:00Z");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }, children: Object.entries(fieldsRegistry).map(([fieldName, fieldMeta]) => {
    let sampleValue = sampleText;
    if (fieldMeta.type === "number") {
      sampleValue = sampleNumber;
    } else if (fieldMeta.type === "date") {
      sampleValue = sampleDate;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: fieldName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fieldMeta.type }),
        fieldMeta.format && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Format" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fieldMeta.format })
        ] }),
        fieldMeta.label && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Label" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fieldMeta.label })
        ] }),
        fieldMeta.tooltip && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Tooltip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fieldMeta.tooltip })
        ] }),
        fieldMeta.icon && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Icon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { icon: fieldMeta.icon }),
            " ( ",
            fieldMeta.icon,
            " )"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Display" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldWrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            value: sampleValue,
            $meta: { value: fieldMeta },
            showLabel: true
          }
        ) }) })
      ] }, `${fieldName}-meta`)
    ] }, fieldName);
  }) });
}
const fixture3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FieldsRegistry
}, Symbol.toStringTag, { value: "Module" }));
function ComponentsRegistry() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: Object.keys(componentsRegistry).map((component) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: component }) }, component)) });
}
const fixture4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ComponentsRegistry
}, Symbol.toStringTag, { value: "Module" }));
const linkWidthWrap = "_linkWidthWrap_qkwt3_1";
const truncate = "_truncate_qkwt3_3";
const tail = "_tail_qkwt3_4";
const link = "_link_qkwt3_1";
const s$4 = {
  linkWidthWrap,
  truncate,
  tail,
  link
};
const splitTail = (str, tailSize) => {
  const tail2 = str.slice(tailSize * -1);
  const body = str.slice(0, Math.max(0, str.length - tailSize));
  return [body, tail2];
};
const LinkRenderer = reactExports.memo(function(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: props.href, target: "_blank", rel: "noreferrer", onClick: stopPropagation, children: props.children });
});
function ShortLinkRenderer({
  children: linksArr,
  maxWidth = 190,
  truncateAmount = 12,
  href
}) {
  const passedLink = (linksArr == null ? void 0 : linksArr[0]) ?? href;
  const [leftPart, rightPart] = splitTail(passedLink, truncateAmount);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$4.linkWidthWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$4.linkOverflowWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      className: s$4.link,
      target: "_blank",
      rel: "noreferrer",
      "data-truncate": rightPart,
      href,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s$4.truncate, style: { maxWidth: maxWidth || "unset" }, children: leftPart }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s$4.tail, children: rightPart })
      ]
    }
  ) }) });
}
function stopPropagation(e) {
  e.stopPropagation();
}
LinkRenderer.displayName = "LinkRenderer";
const LinkRenderer_fixture = /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "LinkRenderer: ",
  /* @__PURE__ */ jsxRuntimeExports.jsx(LinkRenderer, { href: "https://kontur.io", children: "kontur.io" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer short:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://kontur.io", children: ["kontur.io"] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer gdacs:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://www.gdacs.org/report.aspx?eventid=1102779&episodeid=6&eventtype=FL", children: ["gdacs.org/report.aspx?eventtype=EQ&eventid=1441158"] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer long:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry", children: [
    "https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry"
  ] })
] });
const fixture5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LinkRenderer_fixture
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @remix-run/router v1.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search: search2,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search: search2,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to2) {
    return typeof to2 === "string" ? to2 : createPath(to2);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value2, message) {
  if (value2 === false || value2 === null || typeof value2 === "undefined") {
    throw new Error(message);
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index2) {
  return {
    usr: location.state,
    key: location.key,
    idx: index2
  };
}
function createLocation(current, to2, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$1({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to2 === "string" ? parsePath(to2) : to2, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to2 && to2.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search: search2 = "",
    hash = ""
  } = _ref;
  if (search2 && search2 !== "?") pathname += search2.charAt(0) === "?" ? search2 : "?" + search2;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path2) {
  let parsedPath = {};
  if (path2) {
    let hashIndex = path2.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path2.substr(hashIndex);
      path2 = path2.substr(0, hashIndex);
    }
    let searchIndex = path2.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path2.substr(searchIndex);
      path2 = path2.substr(0, searchIndex);
    }
    if (path2) {
      parsedPath.pathname = path2;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action2 = Action.Pop;
  let listener = null;
  let index2 = getIndex();
  if (index2 == null) {
    index2 = 0;
    globalHistory.replaceState(_extends$1({}, globalHistory.state, {
      idx: index2
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action2 = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index2;
    index2 = nextIndex;
    if (listener) {
      listener({
        action: action2,
        location: history.location,
        delta
      });
    }
  }
  function push(to2, state) {
    action2 = Action.Push;
    let location = createLocation(history.location, to2, state);
    index2 = getIndex() + 1;
    let historyState = getHistoryState(location, index2);
    let url2 = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url2);
    } catch (error2) {
      if (error2 instanceof DOMException && error2.name === "DataCloneError") {
        throw error2;
      }
      window2.location.assign(url2);
    }
    if (v5Compat && listener) {
      listener({
        action: action2,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to2, state) {
    action2 = Action.Replace;
    let location = createLocation(history.location, to2, state);
    index2 = getIndex();
    let historyState = getHistoryState(location, index2);
    let url2 = history.createHref(location);
    globalHistory.replaceState(historyState, "", url2);
    if (v5Compat && listener) {
      listener({
        action: action2,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to2) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to2 === "string" ? to2 : createPath(to2);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action2;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to2) {
      return createHref(window2, to2);
    },
    createURL,
    encodeLocation(to2) {
      let url2 = createURL(to2);
      return {
        pathname: url2.pathname,
        search: url2.search,
        hash: url2.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
const alreadyWarned = {};
function warnOnce(key, message) {
  if (!alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}
const logDeprecation = (flag, msg, link2) => warnOnce(flag, "⚠️ React Router Future Flag Warning: " + msg + ". " + ("You can use the `" + flag + "` future flag to opt-in early. ") + ("For more information, see " + link2 + "."));
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if (!(renderFuture != null && renderFuture.v7_startTransition)) {
    logDeprecation("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition");
  }
  if (!(renderFuture != null && renderFuture.v7_relativeSplatPath) && !routerFuture) {
    logDeprecation("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath");
  }
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search: search2 = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search: search2,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search2, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
new Promise(() => {
});
/**
 * React Router DOM v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
var c = React.createContext(defaultStore), o = function(n2) {
  return n2();
};
function a(n2, t2) {
  return function() {
    var r2 = t2.apply(void 0, [].slice.call(arguments));
    r2 && o(function() {
      n2.dispatch(r2);
    });
  };
}
function f(n2, t2) {
  void 0 === t2 && (t2 = []);
  var r2 = React.useContext(c);
  return React.useCallback(a(r2, n2), t2.concat(r2));
}
function s$3(n2, o2, i2) {
  var f2 = n2;
  i2 = [];
  var s2 = React.useContext(c);
  i2 = i2.concat([n2, s2]);
  var l2 = React.useState(function() {
    return getState(n2, s2);
  }), v2 = l2[0], m2 = l2[1], p2 = React.useRef(v2);
  p2.current = v2 = getState(n2, s2);
  var b2 = React.useMemo(function() {
    return Object.entries(f2).reduce(function(n3, t2) {
      var r2 = t2[0], u2 = t2[1];
      return isActionCreator(u2) && (n3[r2] = a(s2, u2)), n3;
    }, {});
  }, i2);
  return React.useEffect(function() {
    return s2.subscribe(n2, function(n3) {
      return Object.is(n3, p2.current) || m2(p2.current = n3);
    });
  }, i2), React.useDebugValue(v2), [v2, b2];
}
const currentTooltipAtom = createAtom(
  {
    setCurrentTooltip: (tooltipData) => tooltipData,
    resetCurrentTooltip: () => null,
    turnOffById: (id) => id
  },
  ({ onAction }, state = null) => {
    onAction("setCurrentTooltip", (tooltipData) => state = tooltipData);
    onAction("resetCurrentTooltip", () => state = null);
    onAction("turnOffById", (id) => {
      if ((state == null ? void 0 : state.initiatorId) === id) state = null;
    });
    return state;
  },
  "[Shared state] currentTooltipAtom"
);
function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}
function addClass(element, className) {
  if (element.classList) element.classList.add(className);
  else if (!hasClass(element, className)) if (typeof element.className === "string") element.className = element.className + " " + className;
  else element.setAttribute("class", (element.className && element.className.baseVal || "") + " " + className);
}
function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp("(^|\\s)" + classToRemove + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
}
function removeClass$1(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else if (typeof element.className === "string") {
    element.className = replaceClassName(element.className, className);
  } else {
    element.setAttribute("class", replaceClassName(element.className && element.className.baseVal || "", className));
  }
}
const config = {
  disabled: false
};
const TransitionGroupContext = React.createContext(null);
var forceReflow = function forceReflow2(node) {
  return node.scrollTop;
};
var UNMOUNTED = "unmounted";
var EXITED = "exited";
var ENTERING = "entering";
var ENTERED = "entered";
var EXITING = "exiting";
var Transition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(Transition2, _React$Component);
  function Transition2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context;
    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;
    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }
    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }
  Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;
    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }
    return null;
  };
  var _proto = Transition2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;
    if (prevProps !== this.props) {
      var status = this.state.status;
      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }
    this.updateStatus(false, nextStatus);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };
  _proto.getTimeouts = function getTimeouts() {
    var timeout2 = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout2;
    if (timeout2 != null && typeof timeout2 !== "number") {
      exit = timeout2.exit;
      enter = timeout2.enter;
      appear = timeout2.appear !== void 0 ? timeout2.appear : enter;
    }
    return {
      exit,
      enter,
      appear
    };
  };
  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }
    if (nextStatus !== null) {
      this.cancelNextCallback();
      if (nextStatus === ENTERING) {
        if (this.props.unmountOnExit || this.props.mountOnEnter) {
          var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
          if (node) forceReflow(node);
        }
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };
  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;
    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;
    var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    if (!mounting && !enter || config.disabled) {
      this.safeSetState({
        status: ENTERED
      }, function() {
        _this2.props.onEntered(maybeNode);
      });
      return;
    }
    this.props.onEnter(maybeNode, maybeAppearing);
    this.safeSetState({
      status: ENTERING
    }, function() {
      _this2.props.onEntering(maybeNode, maybeAppearing);
      _this2.onTransitionEnd(enterTimeout, function() {
        _this2.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  };
  _proto.performExit = function performExit() {
    var _this3 = this;
    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    var maybeNode = this.props.nodeRef ? void 0 : ReactDOM.findDOMNode(this);
    if (!exit || config.disabled) {
      this.safeSetState({
        status: EXITED
      }, function() {
        _this3.props.onExited(maybeNode);
      });
      return;
    }
    this.props.onExit(maybeNode);
    this.safeSetState({
      status: EXITING
    }, function() {
      _this3.props.onExiting(maybeNode);
      _this3.onTransitionEnd(timeouts.exit, function() {
        _this3.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
      });
    });
  };
  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };
  _proto.safeSetState = function safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };
  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;
    var active2 = true;
    this.nextCallback = function(event) {
      if (active2) {
        active2 = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };
    this.nextCallback.cancel = function() {
      active2 = false;
    };
    return this.nextCallback;
  };
  _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
    this.setNextCallback(handler);
    var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
    var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
      this.props.addEndListener(maybeNode, maybeNextCallback);
    }
    if (timeout2 != null) {
      setTimeout(this.nextCallback, timeout2);
    }
  };
  _proto.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }
    var _this$props = this.props, children = _this$props.children;
    _this$props.in;
    _this$props.mountOnEnter;
    _this$props.unmountOnExit;
    _this$props.appear;
    _this$props.enter;
    _this$props.exit;
    _this$props.timeout;
    _this$props.addEndListener;
    _this$props.onEnter;
    _this$props.onEntering;
    _this$props.onEntered;
    _this$props.onExit;
    _this$props.onExiting;
    _this$props.onExited;
    _this$props.nodeRef;
    var childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return (
      // allows for nested Transitions
      /* @__PURE__ */ React.createElement(TransitionGroupContext.Provider, {
        value: null
      }, typeof children === "function" ? children(status, childProps) : React.cloneElement(React.Children.only(children), childProps))
    );
  };
  return Transition2;
}(React.Component);
Transition.contextType = TransitionGroupContext;
Transition.propTypes = {};
function noop() {
}
Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;
var _addClass = function addClass$1(node, classes) {
  return node && classes && classes.split(" ").forEach(function(c2) {
    return addClass(node, c2);
  });
};
var removeClass = function removeClass2(node, classes) {
  return node && classes && classes.split(" ").forEach(function(c2) {
    return removeClass$1(node, c2);
  });
};
var CSSTransition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(CSSTransition2, _React$Component);
  function CSSTransition2() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.appliedClasses = {
      appear: {},
      enter: {},
      exit: {}
    };
    _this.onEnter = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument[0], appearing = _this$resolveArgument[1];
      _this.removeClasses(node, "exit");
      _this.addClass(node, appearing ? "appear" : "enter", "base");
      if (_this.props.onEnter) {
        _this.props.onEnter(maybeNode, maybeAppearing);
      }
    };
    _this.onEntering = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument2 = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument2[0], appearing = _this$resolveArgument2[1];
      var type = appearing ? "appear" : "enter";
      _this.addClass(node, type, "active");
      if (_this.props.onEntering) {
        _this.props.onEntering(maybeNode, maybeAppearing);
      }
    };
    _this.onEntered = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument3 = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument3[0], appearing = _this$resolveArgument3[1];
      var type = appearing ? "appear" : "enter";
      _this.removeClasses(node, type);
      _this.addClass(node, type, "done");
      if (_this.props.onEntered) {
        _this.props.onEntered(maybeNode, maybeAppearing);
      }
    };
    _this.onExit = function(maybeNode) {
      var _this$resolveArgument4 = _this.resolveArguments(maybeNode), node = _this$resolveArgument4[0];
      _this.removeClasses(node, "appear");
      _this.removeClasses(node, "enter");
      _this.addClass(node, "exit", "base");
      if (_this.props.onExit) {
        _this.props.onExit(maybeNode);
      }
    };
    _this.onExiting = function(maybeNode) {
      var _this$resolveArgument5 = _this.resolveArguments(maybeNode), node = _this$resolveArgument5[0];
      _this.addClass(node, "exit", "active");
      if (_this.props.onExiting) {
        _this.props.onExiting(maybeNode);
      }
    };
    _this.onExited = function(maybeNode) {
      var _this$resolveArgument6 = _this.resolveArguments(maybeNode), node = _this$resolveArgument6[0];
      _this.removeClasses(node, "exit");
      _this.addClass(node, "exit", "done");
      if (_this.props.onExited) {
        _this.props.onExited(maybeNode);
      }
    };
    _this.resolveArguments = function(maybeNode, maybeAppearing) {
      return _this.props.nodeRef ? [_this.props.nodeRef.current, maybeNode] : [maybeNode, maybeAppearing];
    };
    _this.getClassNames = function(type) {
      var classNames = _this.props.classNames;
      var isStringClassNames = typeof classNames === "string";
      var prefix = isStringClassNames && classNames ? classNames + "-" : "";
      var baseClassName = isStringClassNames ? "" + prefix + type : classNames[type];
      var activeClassName = isStringClassNames ? baseClassName + "-active" : classNames[type + "Active"];
      var doneClassName = isStringClassNames ? baseClassName + "-done" : classNames[type + "Done"];
      return {
        baseClassName,
        activeClassName,
        doneClassName
      };
    };
    return _this;
  }
  var _proto = CSSTransition2.prototype;
  _proto.addClass = function addClass2(node, type, phase) {
    var className = this.getClassNames(type)[phase + "ClassName"];
    var _this$getClassNames = this.getClassNames("enter"), doneClassName = _this$getClassNames.doneClassName;
    if (type === "appear" && phase === "done" && doneClassName) {
      className += " " + doneClassName;
    }
    if (phase === "active") {
      if (node) forceReflow(node);
    }
    if (className) {
      this.appliedClasses[type][phase] = className;
      _addClass(node, className);
    }
  };
  _proto.removeClasses = function removeClasses(node, type) {
    var _this$appliedClasses$ = this.appliedClasses[type], baseClassName = _this$appliedClasses$.base, activeClassName = _this$appliedClasses$.active, doneClassName = _this$appliedClasses$.done;
    this.appliedClasses[type] = {};
    if (baseClassName) {
      removeClass(node, baseClassName);
    }
    if (activeClassName) {
      removeClass(node, activeClassName);
    }
    if (doneClassName) {
      removeClass(node, doneClassName);
    }
  };
  _proto.render = function render() {
    var _this$props = this.props;
    _this$props.classNames;
    var props = _objectWithoutPropertiesLoose(_this$props, ["classNames"]);
    return /* @__PURE__ */ React.createElement(Transition, _extends$2({}, props, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  };
  return CSSTransition2;
}(React.Component);
CSSTransition.defaultProps = {
  classNames: ""
};
CSSTransition.propTypes = {};
const fadeEnter = "_fadeEnter_1fjeq_1";
const fadeEnterActive = "_fadeEnterActive_1fjeq_5";
const fadeExit = "_fadeExit_1fjeq_10";
const fadeExitActive = "_fadeExitActive_1fjeq_14";
const s$2 = {
  fadeEnter,
  fadeEnterActive,
  fadeExit,
  fadeExitActive
};
const fadeClassNames = {
  enter: s$2.fadeEnter,
  enterActive: s$2.fadeEnterActive,
  exit: s$2.fadeExit,
  exitActive: s$2.fadeExitActive
};
const CSSTransitionWrapper = ({
  children,
  ...props
}) => {
  const nodeRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CSSTransition, { ...props, nodeRef, children: children(nodeRef) });
};
function parseLinksAsTags(text2) {
  if (!text2) return "";
  let parsed = text2;
  const regex = /(.?.?https|.?.?http)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
  const matchIterable = text2.matchAll(regex);
  let offset2 = 0;
  [...matchIterable].forEach((matchEntity) => {
    const [match, protocol, , domain, path2] = matchEntity;
    const matchIndex = matchEntity.index ?? 0;
    const matchLength = match.length;
    if (match.startsWith("](") || match.indexOf("[http") > -1) return;
    const linkStartIndex = match.indexOf("http");
    const fullLink = match.substring(linkStartIndex);
    const beforeLink = match.substring(0, linkStartIndex);
    const noW3domain = domain.replace("www.", "");
    const mdLinkWithPrefix = `${beforeLink}[${noW3domain}${path2 ?? ""}](${fullLink})`;
    const finalText = spliceString(parsed)(
      matchIndex + offset2,
      matchLength,
      mdLinkWithPrefix
    );
    offset2 += mdLinkWithPrefix.length - matchLength;
    parsed = finalText;
  });
  return parsed;
}
function spliceString(string) {
  return function(index2, count2, add) {
    if (index2 < 0) {
      index2 += string.length;
      if (index2 < 0) index2 = 0;
    }
    return string.slice(0, index2) + (add || "") + string.slice(index2 + count2);
  };
}
const currentLocationAtom = createAtom(
  {
    set: (location) => location
  },
  ({ onAction }, state = globalThis.location) => {
    onAction("set", (location) => state = location);
    return state;
  },
  "currentLocationAtom"
);
const closeOnLocationChangeAtom = createAtom(
  {
    currentLocationAtom
  },
  ({ onChange: onChange2, schedule, getUnlistedState }) => {
    onChange2("currentLocationAtom", (curr, prev) => {
      const tooltip = getUnlistedState(currentTooltipAtom);
      if (curr.pathname !== (prev == null ? void 0 : prev.pathname) && (tooltip == null ? void 0 : tooltip.position)) {
        schedule((dispatch) => {
          dispatch(currentTooltipAtom.resetCurrentTooltip());
        });
      }
    });
  },
  "closeOnLocationChangeAtom"
);
const markdown = "_markdown_4vdv7_1";
const s$1 = {
  markdown
};
function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = s$3(currentTooltipAtom);
  s$3(closeOnLocationChangeAtom);
  const closeHandler = reactExports.useCallback(
    (e) => {
      var _a;
      resetCurrentTooltip();
      (_a = tooltip == null ? void 0 : tooltip.onClose) == null ? void 0 : _a.call(tooltip, e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip]
  );
  const outerClickHandler = reactExports.useCallback(
    (e) => {
      var _a;
      (_a = tooltip == null ? void 0 : tooltip.onOuterClick) == null ? void 0 : _a.call(tooltip, e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CSSTransitionWrapper, { in: Boolean(tooltip), timeout: 300, classNames: fadeClassNames, children: (transitionRef) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(
    Tooltip,
    {
      transitionRef,
      position: tooltip.position,
      hoverBehavior: tooltip.hoverBehavior,
      getPlacement: tooltip.position.predefinedPosition,
      classes: tooltip.popupClasses,
      onClose: closeHandler,
      onOuterClick: outerClickHandler,
      children: typeof tooltip.popup === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Markdown,
        {
          options: { overrides: { a: LinkRenderer } },
          className: s$1.markdown,
          children: parseLinksAsTags(tooltip.popup)
        }
      ) : tooltip.popup
    }
  ) }) });
}
const BIVARIATE_LEGEND_SIZE = 3;
const CORNER_POINTS_INDEXES = [
  0,
  BIVARIATE_LEGEND_SIZE - 1,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - 1
];
const LOW = `↓${TranslationService.t("bivariate.legend.low")}`;
const HIGH = `↑${TranslationService.t("bivariate.legend.high")}`;
TranslationService.t("bivariate.legend.medium");
const isBottomSide = (index2) => {
  const bottomRowStartIndex = BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE;
  return Array.from(
    Array(BIVARIATE_LEGEND_SIZE),
    (_2, i2) => bottomRowStartIndex + i2
  ).includes(index2);
};
const isLeftSide = (index2) => Array.from(Array(BIVARIATE_LEGEND_SIZE), (_2, i2) => i2 * BIVARIATE_LEGEND_SIZE).includes(
  index2
);
const PopupTooltipWrapper = reactExports.memo(
  ({
    children,
    tooltipText,
    renderTooltip,
    tooltipId,
    hoverBehavior = true,
    popupClasses
  }) => {
    const setTooltip = f(currentTooltipAtom.setCurrentTooltip);
    const resetTooltip = f(currentTooltipAtom.resetCurrentTooltip);
    const renderTextTooltip = (e) => {
      if (tooltipText) {
        setTooltip({
          popupClasses,
          popup: tooltipText,
          position: { x: e.clientX, y: e.clientY },
          onOuterClick(e2, close) {
            close();
          },
          initiatorId: tooltipId,
          hoverBehavior
        });
      }
    };
    const showTooltip = (e, ...args) => {
      if (!renderTooltip) {
        renderTextTooltip(e);
      } else {
        renderTooltip(e, setTooltip, ...args);
      }
    };
    const hideTooltip = () => {
      resetTooltip();
    };
    return children({
      showTooltip,
      hideTooltip
    });
  }
);
PopupTooltipWrapper.displayName = "PopupTooltipWrapper";
const formatSentimentDirection = (input) => Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);
const tooltipRoot = "_tooltipRoot_zjmcz_1";
const tooltipRow = "_tooltipRow_zjmcz_11";
const sentimentDirection = "_sentimentDirection_zjmcz_17";
const sentimentLabel = "_sentimentLabel_zjmcz_21";
const sentimentInfo = "_sentimentInfo_zjmcz_25";
const indicator = "_indicator_zjmcz_29";
const s = {
  tooltipRoot,
  tooltipRow,
  sentimentDirection,
  sentimentLabel,
  sentimentInfo,
  indicator
};
const CornerTooltipWrapper = ({ children, hints }) => {
  const renderTooltip = (e, setTooltip, _cell, i2) => {
    if (hints && CORNER_POINTS_INDEXES.includes(i2)) {
      setTooltip({
        popup: /* @__PURE__ */ jsxRuntimeExports.jsx(BivariateLegendCornerTooltip, { cellIndex: i2, hints }),
        position: { x: e.clientX, y: e.clientY },
        hoverBehavior: true
      });
    }
  };
  return reactExports.isValidElement(children) ? /* @__PURE__ */ jsxRuntimeExports.jsx(PopupTooltipWrapper, { renderTooltip, children: ({ showTooltip, hideTooltip }) => reactExports.cloneElement(children, {
    // @ts-expect-error - react version update should fix that
    onCellPointerOver: showTooltip,
    onCellPointerLeave: hideTooltip
  }) }) : null;
};
const BivariateLegendCornerTooltip = ({
  hints,
  cellIndex
}) => {
  var _a, _b, _c, _d, _e2, _f;
  if (!hints) return null;
  const rows = [
    {
      label: (_a = hints.x) == null ? void 0 : _a.label,
      direction: (_c = (_b = hints.x) == null ? void 0 : _b.direction) == null ? void 0 : _c[isBottomSide(cellIndex) ? 0 : 1],
      indicator: isBottomSide(cellIndex) ? LOW : HIGH
    },
    {
      label: (_d = hints.y) == null ? void 0 : _d.label,
      direction: (_f = (_e2 = hints.y) == null ? void 0 : _e2.direction) == null ? void 0 : _f[isLeftSide(cellIndex) ? 0 : 1],
      indicator: isLeftSide(cellIndex) ? LOW : HIGH
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(s.tooltipRoot), children: rows.map(({ label: label2, direction, indicator: indicator2 }, i2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s.tooltipRow), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(s.indicator), children: indicator2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(s.sentimentInfo), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(s.sentimentLabel), children: [
        label2,
        " "
      ] }),
      direction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(s.sentimentDirection), children: formatSentimentDirection(direction) })
    ] })
  ] }, i2)) });
};
const meta = {
  hints: {
    x: {
      label: "Average NDVI, JUN 2019",
      direction: [["bad"], ["good"]]
    },
    y: {
      label: "Multi-hazard exposure PDC GRVA",
      direction: [["unimportant"], ["bad", "important"]]
    }
  }
};
const axis = {
  x: {
    label: "Multi-hazard exposure PDC GRVA to 1",
    steps: [
      {
        label: "",
        value: 0
      },
      {
        label: "",
        value: 0.48
      },
      {
        label: "",
        value: 0.62
      },
      {
        label: "",
        value: 1
      }
    ],
    quality: 0.997101882904748,
    quotient: ["mhe_index", "one"]
  },
  y: {
    label: "Average NDVI, JUN 2019 to 1",
    steps: [
      {
        label: "",
        value: -1
      },
      {
        label: "",
        value: 0.3625118070036407
      },
      {
        label: "",
        value: 0.6441754083082613
      },
      {
        label: "",
        value: 1
      }
    ],
    quality: 0.9410965072118505,
    quotient: ["avg_ndvi", "one"]
  }
};
const cells = [
  {
    label: "C1",
    color: "rgba(90,200,127,0.5)"
  },
  {
    label: "C2",
    color: "rgba(179,165,130,0.5)"
  },
  {
    label: "C3",
    color: "rgba(153,153,153,0.5)"
  },
  {
    label: "B1",
    color: "rgba(169,218,122,0.5)"
  },
  {
    label: "B2",
    color: "rgba(195,163,111,0.5)"
  },
  {
    label: "B3",
    color: "rgba(204,103,116,0.5)"
  },
  {
    label: "A1",
    color: "rgba(232,232,157,0.5)"
  },
  {
    label: "A2",
    color: "rgba(216,159,88,0.5)"
  },
  {
    label: "A3",
    color: "rgba(228,26,28,0.5)"
  }
];
function BivariateLegendFixture() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopupTooltip, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CornerTooltipWrapper, { meta, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Legend,
      {
        showAxisLabels: true,
        size: BIVARIATE_LEGEND_SIZE,
        axis,
        cells
      }
    ) })
  ] });
}
const fixture6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BivariateLegendFixture
}, Symbol.toStringTag, { value: "Module" }));
const UniComponents_fixture = /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { style: { width: 390 }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    StackedProgressBar,
    {
      value: [
        { title: "% processed", value: 57, color: "green" },
        { title: "% received", value: 75, color: "orange" }
      ],
      caption: "Stacked Progress Bar"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    StackedProgressBar,
    {
      value: [{ title: "%", value: 33, color: "red" }],
      caption: "Progress"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    StackedProgressBar,
    {
      value: [
        { title: "% jaw", value: 7, color: "green" },
        { title: "% drip", value: 26, color: "orange" },
        { title: "% flock", value: 75, color: "red" },
        { title: "% mass", value: 95, color: "blue" }
      ],
      caption: "5 step Progress"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityIndicator, { value: "MODERATE" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityIndicator, { value: "UNKNOWN" })
].map((Element2) => [Element2, /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {})]) });
const fixture7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UniComponents_fixture
}, Symbol.toStringTag, { value: "Module" }));
const rendererConfig = {
  "playgroundUrl": "http://127.0.0.1:5000",
  "containerQuerySelector": null
};
const fixtures = {
  "src/features/subscriptions/Plans.fixture.tsx": { module: fixture0 },
  "src/core/pages/PagesDocument.fixture.tsx": { module: fixture1 },
  "src/components/Uni/LayoutDebugger.fixture.tsx": { module: fixture2 },
  "src/components/Uni/FieldsRegistry.fixture.tsx": { module: fixture3 },
  "src/components/Uni/ComponentsRegistry.fixture.tsx": { module: fixture4 },
  "src/components/LinkRenderer/LinkRenderer.fixture.tsx": { module: fixture5 },
  "src/components/BivariateLegend/BivariateLegend.fixture.tsx": { module: fixture6 },
  "src/components/Uni/Components/UniComponents.fixture.tsx": { module: fixture7 }
};
const decorators = {};
const moduleWrappers = {
  lazy: false,
  fixtures,
  decorators
};
export {
  moduleWrappers,
  rendererConfig
};

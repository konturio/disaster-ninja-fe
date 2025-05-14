import { j as jsxRuntimeExports } from "./_virtual_cosmos-imports-Vi6DJNhH.js";
import { r as reactExports } from "./index-v1-MnN7S.js";
const BivariateGreetings = () => {
  reactExports.useEffect(() => {
    !function(t, n) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : ((t = "undefined" != typeof globalThis ? globalThis : t || self).__SVGATOR_PLAYER__ = t.__SVGATOR_PLAYER__ || {}, t.__SVGATOR_PLAYER__["5c7f360c"] = n());
    }(void 0, function() {
      function t(t2, n2) {
        var e2 = Object.keys(t2);
        if (Object.getOwnPropertySymbols) {
          var r2 = Object.getOwnPropertySymbols(t2);
          n2 && (r2 = r2.filter(function(n3) {
            return Object.getOwnPropertyDescriptor(t2, n3).enumerable;
          })), e2.push.apply(e2, r2);
        }
        return e2;
      }
      function n(n2) {
        for (var e2 = 1; e2 < arguments.length; e2++) {
          var r2 = null != arguments[e2] ? arguments[e2] : {};
          e2 % 2 ? t(Object(r2), true).forEach(function(t2) {
            o(n2, t2, r2[t2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n2, Object.getOwnPropertyDescriptors(r2)) : t(Object(r2)).forEach(function(t2) {
            Object.defineProperty(n2, t2, Object.getOwnPropertyDescriptor(r2, t2));
          });
        }
        return n2;
      }
      function e(t2) {
        return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
          return typeof t3;
        } : function(t3) {
          return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
        })(t2);
      }
      function r(t2, n2) {
        if (!(t2 instanceof n2)) throw new TypeError("Cannot call a class as a function");
      }
      function i(t2, n2) {
        for (var e2 = 0; e2 < n2.length; e2++) {
          var r2 = n2[e2];
          r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, r2.key, r2);
        }
      }
      function u(t2, n2, e2) {
        return n2 && i(t2.prototype, n2), e2 && i(t2, e2), t2;
      }
      function o(t2, n2, e2) {
        return n2 in t2 ? Object.defineProperty(t2, n2, {
          value: e2,
          enumerable: true,
          configurable: true,
          writable: true
        }) : t2[n2] = e2, t2;
      }
      function a(t2) {
        return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function(t3) {
          return t3.__proto__ || Object.getPrototypeOf(t3);
        })(t2);
      }
      function l(t2, n2) {
        return (l = Object.setPrototypeOf || function(t3, n3) {
          return t3.__proto__ = n3, t3;
        })(t2, n2);
      }
      function s() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" == typeof Proxy) return true;
        try {
          return Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function() {
            })
          ), true;
        } catch (t2) {
          return false;
        }
      }
      function f(t2, n2, e2) {
        return (f = s() ? Reflect.construct : function(t3, n3, e3) {
          var r2 = [null];
          r2.push.apply(r2, n3);
          var i2 = new (Function.bind.apply(t3, r2))();
          return e3 && l(i2, e3.prototype), i2;
        }).apply(null, arguments);
      }
      function c(t2, n2) {
        if (n2 && ("object" == typeof n2 || "function" == typeof n2)) return n2;
        if (void 0 !== n2)
          throw new TypeError("Derived constructors may only return object or undefined");
        return function(t3) {
          if (void 0 === t3)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return t3;
        }(t2);
      }
      function h(t2, n2, e2) {
        return (h = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t3, n3, e3) {
          var r2 = function(t4, n4) {
            for (; !Object.prototype.hasOwnProperty.call(t4, n4) && null !== (t4 = a(t4)); ) ;
            return t4;
          }(t3, n3);
          if (r2) {
            var i2 = Object.getOwnPropertyDescriptor(r2, n3);
            return i2.get ? i2.get.call(e3) : i2.value;
          }
        })(t2, n2, e2 || t2);
      }
      function v(t2) {
        return function(t3) {
          if (Array.isArray(t3)) return y(t3);
        }(t2) || function(t3) {
          if ("undefined" != typeof Symbol && null != t3[Symbol.iterator] || null != t3["@@iterator"])
            return Array.from(t3);
        }(t2) || function(t3, n2) {
          if (!t3) return;
          if ("string" == typeof t3) return y(t3, n2);
          var e2 = Object.prototype.toString.call(t3).slice(8, -1);
          "Object" === e2 && t3.constructor && (e2 = t3.constructor.name);
          if ("Map" === e2 || "Set" === e2) return Array.from(t3);
          if ("Arguments" === e2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e2))
            return y(t3, n2);
        }(t2) || function() {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }();
      }
      function y(t2, n2) {
        (null == n2 || n2 > t2.length) && (n2 = t2.length);
        for (var e2 = 0, r2 = new Array(n2); e2 < n2; e2++) r2[e2] = t2[e2];
        return r2;
      }
      Number.isInteger || (Number.isInteger = function(t2) {
        return "number" == typeof t2 && isFinite(t2) && Math.floor(t2) === t2;
      }), Number.EPSILON || (Number.EPSILON = 2220446049250313e-31);
      var g = d(Math.pow(10, -6));
      function d(t2) {
        var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6;
        if (Number.isInteger(t2)) return t2;
        var e2 = Math.pow(10, n2);
        return Math.round((+t2 + Number.EPSILON) * e2) / e2;
      }
      function p(t2, n2) {
        var e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : g;
        return Math.abs(t2 - n2) < e2;
      }
      var m = Math.PI / 180;
      function b(t2) {
        return t2;
      }
      function w(t2, n2, e2) {
        var r2 = 1 - e2;
        return 3 * e2 * r2 * (t2 * r2 + n2 * e2) + e2 * e2 * e2;
      }
      function x() {
        var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
        return t2 < 0 || t2 > 1 || e2 < 0 || e2 > 1 ? null : p(t2, n2) && p(e2, r2) ? b : function(i2) {
          if (i2 <= 0)
            return t2 > 0 ? i2 * n2 / t2 : 0 === n2 && e2 > 0 ? i2 * r2 / e2 : 0;
          if (i2 >= 1)
            return e2 < 1 ? 1 + (i2 - 1) * (r2 - 1) / (e2 - 1) : 1 === e2 && t2 < 1 ? 1 + (i2 - 1) * (n2 - 1) / (t2 - 1) : 1;
          for (var u2, o2 = 0, a2 = 1; o2 < a2; ) {
            var l2 = w(t2, e2, u2 = (o2 + a2) / 2);
            if (p(i2, l2)) break;
            l2 < i2 ? o2 = u2 : a2 = u2;
          }
          return w(n2, r2, u2);
        };
      }
      function A() {
        return 1;
      }
      function k(t2) {
        return 1 === t2 ? 1 : 0;
      }
      function _() {
        var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        if (1 === t2) {
          if (0 === n2) return k;
          if (1 === n2) return A;
        }
        var e2 = 1 / t2;
        return function(t3) {
          return t3 >= 1 ? 1 : (t3 += n2 * e2) - t3 % e2;
        };
      }
      var S = Math.sin, O = Math.cos, j = Math.acos, M = Math.asin, P = Math.tan, E = Math.atan2, I = Math.PI / 180, R = 180 / Math.PI, F = Math.sqrt, N = function() {
        function t2() {
          var n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, u2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, o2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, a2 = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0;
          r(this, t2), this.m = [n2, e2, i2, u2, o2, a2], this.i = null, this.w = null, this.s = null;
        }
        return u(
          t2,
          [
            {
              key: "determinant",
              get: function() {
                var t3 = this.m;
                return t3[0] * t3[3] - t3[1] * t3[2];
              }
            },
            {
              key: "isIdentity",
              get: function() {
                if (null === this.i) {
                  var t3 = this.m;
                  this.i = 1 === t3[0] && 0 === t3[1] && 0 === t3[2] && 1 === t3[3] && 0 === t3[4] && 0 === t3[5];
                }
                return this.i;
              }
            },
            {
              key: "point",
              value: function(t3, n2) {
                var e2 = this.m;
                return {
                  x: e2[0] * t3 + e2[2] * n2 + e2[4],
                  y: e2[1] * t3 + e2[3] * n2 + e2[5]
                };
              }
            },
            {
              key: "translateSelf",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                if (!t3 && !n2) return this;
                var e2 = this.m;
                return e2[4] += e2[0] * t3 + e2[2] * n2, e2[5] += e2[1] * t3 + e2[3] * n2, this.w = this.s = this.i = null, this;
              }
            },
            {
              key: "rotateSelf",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                if (t3 %= 360) {
                  var n2 = S(t3 *= I), e2 = O(t3), r2 = this.m, i2 = r2[0], u2 = r2[1];
                  r2[0] = i2 * e2 + r2[2] * n2, r2[1] = u2 * e2 + r2[3] * n2, r2[2] = r2[2] * e2 - i2 * n2, r2[3] = r2[3] * e2 - u2 * n2, this.w = this.s = this.i = null;
                }
                return this;
              }
            },
            {
              key: "scaleSelf",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                if (1 !== t3 || 1 !== n2) {
                  var e2 = this.m;
                  e2[0] *= t3, e2[1] *= t3, e2[2] *= n2, e2[3] *= n2, this.w = this.s = this.i = null;
                }
                return this;
              }
            },
            {
              key: "skewSelf",
              value: function(t3, n2) {
                if (n2 %= 360, (t3 %= 360) || n2) {
                  var e2 = this.m, r2 = e2[0], i2 = e2[1], u2 = e2[2], o2 = e2[3];
                  t3 && (t3 = P(t3 * I), e2[2] += r2 * t3, e2[3] += i2 * t3), n2 && (n2 = P(n2 * I), e2[0] += u2 * n2, e2[1] += o2 * n2), this.w = this.s = this.i = null;
                }
                return this;
              }
            },
            {
              key: "resetSelf",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, i2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, u2 = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0, o2 = this.m;
                return o2[0] = t3, o2[1] = n2, o2[2] = e2, o2[3] = r2, o2[4] = i2, o2[5] = u2, this.w = this.s = this.i = null, this;
              }
            },
            {
              key: "recomposeSelf",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null, i2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
                return this.isIdentity || this.resetSelf(), t3 && (t3.x || t3.y) && this.translateSelf(t3.x, t3.y), n2 && this.rotateSelf(n2), e2 && (e2.x && this.skewSelf(e2.x, 0), e2.y && this.skewSelf(0, e2.y)), !r2 || 1 === r2.x && 1 === r2.y || this.scaleSelf(r2.x, r2.y), i2 && (i2.x || i2.y) && this.translateSelf(i2.x, i2.y), this;
              }
            },
            {
              key: "decompose",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, e2 = this.m, r2 = e2[0] * e2[0] + e2[1] * e2[1], i2 = [
                  [e2[0], e2[1]],
                  [e2[2], e2[3]]
                ], u2 = F(r2);
                if (0 === u2)
                  return {
                    origin: { x: d(e2[4]), y: d(e2[5]) },
                    translate: { x: d(t3), y: d(n2) },
                    scale: { x: 0, y: 0 },
                    skew: { x: 0, y: 0 },
                    rotate: 0
                  };
                i2[0][0] /= u2, i2[0][1] /= u2;
                var o2 = e2[0] * e2[3] - e2[1] * e2[2] < 0;
                o2 && (u2 = -u2);
                var a2 = i2[0][0] * i2[1][0] + i2[0][1] * i2[1][1];
                i2[1][0] -= i2[0][0] * a2, i2[1][1] -= i2[0][1] * a2;
                var l2 = F(i2[1][0] * i2[1][0] + i2[1][1] * i2[1][1]);
                if (0 === l2)
                  return {
                    origin: { x: d(e2[4]), y: d(e2[5]) },
                    translate: { x: d(t3), y: d(n2) },
                    scale: { x: d(u2), y: 0 },
                    skew: { x: 0, y: 0 },
                    rotate: 0
                  };
                i2[1][0] /= l2, i2[1][1] /= l2, a2 /= l2;
                var s2 = 0;
                return i2[1][1] < 0 ? (s2 = j(i2[1][1]) * R, i2[0][1] < 0 && (s2 = 360 - s2)) : s2 = M(i2[0][1]) * R, o2 && (s2 = -s2), a2 = E(a2, F(i2[0][0] * i2[0][0] + i2[0][1] * i2[0][1])) * R, o2 && (a2 = -a2), {
                  origin: { x: d(e2[4]), y: d(e2[5]) },
                  translate: { x: d(t3), y: d(n2) },
                  scale: { x: d(u2), y: d(l2) },
                  skew: { x: d(a2), y: 0 },
                  rotate: d(s2)
                };
              }
            },
            {
              key: "clone",
              value: function() {
                var t3 = this.m;
                return new this.constructor(t3[0], t3[1], t3[2], t3[3], t3[4], t3[5]);
              }
            },
            {
              key: "toString",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : " ";
                if (null === this.s) {
                  var n2 = this.m.map(function(t4) {
                    return d(t4);
                  });
                  1 === n2[0] && 0 === n2[1] && 0 === n2[2] && 1 === n2[3] ? this.s = "translate(" + n2[4] + t3 + n2[5] + ")" : this.s = "matrix(" + n2.join(t3) + ")";
                }
                return this.s;
              }
            }
          ],
          [
            {
              key: "create",
              value: function(t3) {
                return t3 ? Array.isArray(t3) ? f(this, v(t3)) : t3 instanceof this ? t3.clone() : new this().recomposeSelf(
                  t3.origin,
                  t3.rotate,
                  t3.skew,
                  t3.scale,
                  t3.translate
                ) : new this();
              }
            }
          ]
        ), t2;
      }();
      function T(t2, n2, e2) {
        return t2 >= 0.5 ? e2 : n2;
      }
      function q(t2, n2, e2) {
        return 0 === t2 || n2 === e2 ? n2 : t2 * (e2 - n2) + n2;
      }
      function B(t2, n2, e2) {
        var r2 = q(t2, n2, e2);
        return r2 <= 0 ? 0 : r2;
      }
      function L(t2, n2, e2) {
        var r2 = q(t2, n2, e2);
        return r2 <= 0 ? 0 : r2 >= 1 ? 1 : r2;
      }
      function C(t2, n2, e2) {
        return 0 === t2 ? n2 : 1 === t2 ? e2 : { x: q(t2, n2.x, e2.x), y: q(t2, n2.y, e2.y) };
      }
      function D(t2, n2, e2) {
        var r2 = function(t3, n3, e3) {
          return Math.round(q(t3, n3, e3));
        }(t2, n2, e2);
        return r2 <= 0 ? 0 : r2 >= 255 ? 255 : r2;
      }
      function z(t2, n2, e2) {
        return 0 === t2 ? n2 : 1 === t2 ? e2 : {
          r: D(t2, n2.r, e2.r),
          g: D(t2, n2.g, e2.g),
          b: D(t2, n2.b, e2.b),
          a: q(t2, null == n2.a ? 1 : n2.a, null == e2.a ? 1 : e2.a)
        };
      }
      function V(t2, n2) {
        for (var e2 = [], r2 = 0; r2 < t2; r2++) e2.push(n2);
        return e2;
      }
      function G(t2, n2) {
        if (--n2 <= 0) return t2;
        var e2 = (t2 = Object.assign([], t2)).length;
        do {
          for (var r2 = 0; r2 < e2; r2++) t2.push(t2[r2]);
        } while (--n2 > 0);
        return t2;
      }
      var Y, $ = function() {
        function t2(n2) {
          r(this, t2), this.list = n2, this.length = n2.length;
        }
        return u(t2, [
          {
            key: "setAttribute",
            value: function(t3, n2) {
              for (var e2 = this.list, r2 = 0; r2 < this.length; r2++)
                e2[r2].setAttribute(t3, n2);
            }
          },
          {
            key: "removeAttribute",
            value: function(t3) {
              for (var n2 = this.list, e2 = 0; e2 < this.length; e2++)
                n2[e2].removeAttribute(t3);
            }
          },
          {
            key: "style",
            value: function(t3, n2) {
              for (var e2 = this.list, r2 = 0; r2 < this.length; r2++) e2[r2].style[t3] = n2;
            }
          }
        ]), t2;
      }(), U = /-./g, Q = function(t2, n2) {
        return n2.toUpperCase();
      };
      function H(t2) {
        return "function" == typeof t2 ? t2 : T;
      }
      function J(t2) {
        return t2 ? "function" == typeof t2 ? t2 : Array.isArray(t2) ? function(t3) {
          var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : b;
          if (!Array.isArray(t3)) return n2;
          switch (t3.length) {
            case 1:
              return _(t3[0]) || n2;
            case 2:
              return _(t3[0], t3[1]) || n2;
            case 4:
              return x(t3[0], t3[1], t3[2], t3[3]) || n2;
          }
          return n2;
        }(t2, null) : function(t3, n2) {
          var e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : b;
          switch (t3) {
            case "linear":
              return b;
            case "steps":
              return _(n2.steps || 1, n2.jump || 0) || e2;
            case "bezier":
            case "cubic-bezier":
              return x(n2.x1 || 0, n2.y1 || 0, n2.x2 || 0, n2.y2 || 0) || e2;
          }
          return e2;
        }(t2.type, t2.value, null) : null;
      }
      function Z(t2, n2, e2) {
        var r2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], i2 = n2.length - 1;
        if (t2 <= n2[0].t) return r2 ? [0, 0, n2[0].v] : n2[0].v;
        if (t2 >= n2[i2].t) return r2 ? [i2, 1, n2[i2].v] : n2[i2].v;
        var u2, o2 = n2[0], a2 = null;
        for (u2 = 1; u2 <= i2; u2++) {
          if (!(t2 > n2[u2].t)) {
            a2 = n2[u2];
            break;
          }
          o2 = n2[u2];
        }
        return null == a2 ? r2 ? [i2, 1, n2[i2].v] : n2[i2].v : o2.t === a2.t ? r2 ? [u2, 1, a2.v] : a2.v : (t2 = (t2 - o2.t) / (a2.t - o2.t), o2.e && (t2 = o2.e(t2)), r2 ? [u2, t2, e2(t2, o2.v, a2.v)] : e2(t2, o2.v, a2.v));
      }
      function K(t2, n2) {
        var e2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
        return t2 && t2.length ? "function" != typeof n2 ? null : ("function" != typeof e2 && (e2 = null), function(r2) {
          var i2 = Z(r2, t2, n2);
          return null != i2 && e2 && (i2 = e2(i2)), i2;
        }) : null;
      }
      function W(t2, n2) {
        return t2.t - n2.t;
      }
      function X(t2, n2, r2, i2, u2) {
        var o2, a2 = "@" === r2[0], l2 = "#" === r2[0], s2 = Y[r2], f2 = T;
        switch (a2 ? (o2 = r2.substr(1), r2 = o2.replace(U, Q)) : l2 && (r2 = r2.substr(1)), e(s2)) {
          case "function":
            if (f2 = s2(i2, u2, Z, J, r2, a2, n2, t2), l2) return f2;
            break;
          case "string":
            f2 = K(i2, H(s2));
            break;
          case "object":
            if ((f2 = K(i2, H(s2.i), s2.f)) && "function" == typeof s2.u)
              return s2.u(n2, f2, r2, a2, t2);
        }
        return f2 ? function(t3, n3, e2) {
          if (arguments.length > 3 && void 0 !== arguments[3] && arguments[3])
            return t3 instanceof $ ? function(r4) {
              return t3.style(n3, e2(r4));
            } : function(r4) {
              return t3.style[n3] = e2(r4);
            };
          if (Array.isArray(n3)) {
            var r3 = n3.length;
            return function(i3) {
              var u3 = e2(i3);
              if (null == u3) for (var o3 = 0; o3 < r3; o3++) t3[o3].removeAttribute(n3);
              else for (var a3 = 0; a3 < r3; a3++) t3[a3].setAttribute(n3, u3);
            };
          }
          return function(r4) {
            var i3 = e2(r4);
            null == i3 ? t3.removeAttribute(n3) : t3.setAttribute(n3, i3);
          };
        }(n2, r2, f2, a2) : null;
      }
      function tt(t2, n2, r2, i2) {
        if (!i2 || "object" !== e(i2)) return null;
        var u2 = null, o2 = null;
        return Array.isArray(i2) ? o2 = function(t3) {
          if (!t3 || !t3.length) return null;
          for (var n3 = 0; n3 < t3.length; n3++) t3[n3].e && (t3[n3].e = J(t3[n3].e));
          return t3.sort(W);
        }(i2) : (o2 = i2.keys, u2 = i2.data || null), o2 ? X(t2, n2, r2, o2, u2) : null;
      }
      function nt(t2, n2, e2) {
        if (!e2) return null;
        var r2 = [];
        for (var i2 in e2)
          if (e2.hasOwnProperty(i2)) {
            var u2 = tt(t2, n2, i2, e2[i2]);
            u2 && r2.push(u2);
          }
        return r2.length ? r2 : null;
      }
      function et(t2, n2) {
        if (!n2.settings.duration || n2.settings.duration < 0) return null;
        var e2, r2, i2, u2, o2, a2 = function(t3, n3) {
          if (!n3) return null;
          var e3 = [];
          if (Array.isArray(n3))
            for (var r3 = n3.length, i3 = 0; i3 < r3; i3++) {
              var u3 = n3[i3];
              if (2 === u3.length) {
                var o3 = null;
                if ("string" == typeof u3[0]) o3 = t3.getElementById(u3[0]);
                else if (Array.isArray(u3[0])) {
                  o3 = [];
                  for (var a3 = 0; a3 < u3[0].length; a3++)
                    if ("string" == typeof u3[0][a3]) {
                      var l2 = t3.getElementById(u3[0][a3]);
                      l2 && o3.push(l2);
                    }
                  o3 = o3.length ? 1 === o3.length ? o3[0] : new $(o3) : null;
                }
                if (o3) {
                  var s2 = nt(t3, o3, u3[1]);
                  s2 && (e3 = e3.concat(s2));
                }
              }
            }
          else
            for (var f2 in n3)
              if (n3.hasOwnProperty(f2)) {
                var c2 = t3.getElementById(f2);
                if (c2) {
                  var h2 = nt(t3, c2, n3[f2]);
                  h2 && (e3 = e3.concat(h2));
                }
              }
          return e3.length ? e3 : null;
        }(t2, n2.elements);
        return a2 ? (e2 = a2, r2 = n2.settings, i2 = r2.duration, u2 = e2.length, o2 = null, function(t3, n3) {
          var a3 = r2.iterations || 1 / 0, l2 = (r2.alternate && a3 % 2 == 0) ^ r2.direction > 0 ? i2 : 0, s2 = t3 % i2, f2 = 1 + (t3 - s2) / i2;
          n3 *= r2.direction, r2.alternate && f2 % 2 == 0 && (n3 = -n3);
          var c2 = false;
          if (f2 > a3)
            s2 = l2, c2 = true, -1 === r2.fill && (s2 = r2.direction > 0 ? 0 : i2);
          else if (n3 < 0 && (s2 = i2 - s2), s2 === o2) return false;
          o2 = s2;
          for (var h2 = 0; h2 < u2; h2++) e2[h2](s2);
          return c2;
        }) : null;
      }
      function rt(t2, n2) {
        if (Y = n2, !t2 || !t2.root || !Array.isArray(t2.animations)) return null;
        var e2 = function(t3) {
          for (var n3 = document.getElementsByTagName("svg"), e3 = 0; e3 < n3.length; e3++)
            if (n3[e3].id === t3.root && !n3[e3].svgatorAnimation)
              return n3[e3].svgatorAnimation = true, n3[e3];
          return null;
        }(t2);
        if (!e2) return null;
        var r2 = t2.animations.map(function(t3) {
          return et(e2, t3);
        }).filter(function(t3) {
          return !!t3;
        });
        return r2.length ? {
          svg: e2,
          animations: r2,
          animationSettings: t2.animationSettings,
          options: t2.options || void 0
        } : null;
      }
      function it(t2) {
        return +("0x" + (t2.replace(/[^0-9a-fA-F]+/g, "") || 27));
      }
      function ut(t2, n2, e2) {
        return !t2 || !e2 || n2 > t2.length ? t2 : t2.substring(0, n2) + ut(t2.substring(n2 + 1), e2, e2);
      }
      function ot(t2) {
        var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 27;
        return !t2 || t2 % n2 ? t2 % n2 : ot(t2 / n2, n2);
      }
      function at(t2, n2, e2) {
        if (t2 && t2.length) {
          var r2 = it(e2), i2 = it(n2), u2 = ot(r2) + 5, o2 = ut(t2, ot(r2, 5), u2);
          return o2 = o2.replace(/\x7c$/g, "==").replace(/\x2f$/g, "="), o2 = function(t3, n3, e3) {
            var r3 = +("0x" + t3.substring(0, 4));
            t3 = t3.substring(4);
            for (var i3 = n3 % r3 + e3 % 27, u3 = [], o3 = 0; o3 < t3.length; o3 += 2)
              if ("|" !== t3[o3]) {
                var a2 = +("0x" + t3[o3] + t3[o3 + 1]) - i3;
                u3.push(a2);
              } else {
                var l2 = +("0x" + t3.substring(o3 + 1, o3 + 1 + 4)) - i3;
                o3 += 3, u3.push(l2);
              }
            return String.fromCharCode.apply(String, u3);
          }(o2 = (o2 = atob(o2)).replace(/[\x41-\x5A]/g, ""), i2, r2), o2 = JSON.parse(o2);
        }
      }
      var lt = [
        { key: "alternate", def: false },
        { key: "fill", def: 1 },
        { key: "iterations", def: 0 },
        { key: "direction", def: 1 },
        { key: "speed", def: 1 },
        { key: "fps", def: 100 }
      ], st = function() {
        function t2(n2, e2) {
          var i2 = this, u2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
          r(this, t2), this._id = 0, this._running = false, this._rollingBack = false, this._animations = n2, this._settings = e2, (!u2 || u2 < "2022-05-02") && delete this._settings.speed, lt.forEach(function(t3) {
            i2._settings[t3.key] = i2._settings[t3.key] || t3.def;
          }), this.duration = e2.duration, this.offset = e2.offset || 0, this.rollbackStartOffset = 0;
        }
        return u(
          t2,
          [
            {
              key: "alternate",
              get: function() {
                return this._settings.alternate;
              }
            },
            {
              key: "fill",
              get: function() {
                return this._settings.fill;
              }
            },
            {
              key: "iterations",
              get: function() {
                return this._settings.iterations;
              }
            },
            {
              key: "direction",
              get: function() {
                return this._settings.direction;
              }
            },
            {
              key: "speed",
              get: function() {
                return this._settings.speed;
              }
            },
            {
              key: "fps",
              get: function() {
                return this._settings.fps;
              }
            },
            {
              key: "maxFiniteDuration",
              get: function() {
                return this.iterations > 0 ? this.iterations * this.duration : this.duration;
              }
            },
            {
              key: "_apply",
              value: function(t3) {
                for (var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, e2 = this._animations, r2 = e2.length, i2 = 0, u2 = 0; u2 < r2; u2++)
                  n2[u2] ? i2++ : (n2[u2] = e2[u2](t3, 1), n2[u2] && i2++);
                return i2;
              }
            },
            {
              key: "_rollback",
              value: function(t3) {
                var n2 = this, e2 = 1 / 0, r2 = null;
                this.rollbackStartOffset = t3, this._rollingBack = true, this._running = true;
                this._id = window.requestAnimationFrame(function i2(u2) {
                  if (n2._rollingBack) {
                    null == r2 && (r2 = u2);
                    var o2 = Math.round(t3 - (u2 - r2) * n2.speed);
                    if (o2 > n2.duration && e2 !== 1 / 0) {
                      var a2 = !!n2.alternate && o2 / n2.duration % 2 > 1, l2 = o2 % n2.duration;
                      o2 = (l2 += a2 ? n2.duration : 0) || n2.duration;
                    }
                    var s2 = (n2.fps ? 1e3 / n2.fps : 0) * n2.speed, f2 = Math.max(0, o2);
                    f2 < e2 - s2 && (n2.offset = f2, e2 = f2, n2._apply(f2));
                    var c2 = n2.iterations > 0 && -1 === n2.fill && o2 >= n2.maxFiniteDuration;
                    (o2 <= 0 || n2.offset < o2 || c2) && n2.stop(), n2._id = window.requestAnimationFrame(i2);
                  }
                });
              }
            },
            {
              key: "_start",
              value: function() {
                var t3 = this, n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, e2 = -1 / 0, r2 = null, i2 = {};
                this._running = true;
                var u2 = function u3(o2) {
                  null == r2 && (r2 = o2);
                  var a2 = Math.round((o2 - r2) * t3.speed + n2), l2 = (t3.fps ? 1e3 / t3.fps : 0) * t3.speed;
                  if (a2 > e2 + l2 && !t3._rollingBack && (t3.offset = a2, e2 = a2, t3._apply(a2, i2) === t3._animations.length))
                    return void t3.pause(true);
                  t3._id = window.requestAnimationFrame(u3);
                };
                this._id = window.requestAnimationFrame(u2);
              }
            },
            {
              key: "_pause",
              value: function() {
                this._id && window.cancelAnimationFrame(this._id), this._running = false;
              }
            },
            {
              key: "play",
              value: function() {
                if (!this._running)
                  return this._rollingBack ? this._rollback(this.offset) : this._start(this.offset);
              }
            },
            {
              key: "stop",
              value: function() {
                this._pause(), this.offset = 0, this.rollbackStartOffset = 0, this._rollingBack = false, this._apply(0);
              }
            },
            {
              key: "reachedToEnd",
              value: function() {
                return this.iterations > 0 && this.offset >= this.iterations * this.duration;
              }
            },
            {
              key: "restart",
              value: function() {
                var t3 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                this.stop(t3), this.play(t3);
              }
            },
            {
              key: "pause",
              value: function() {
                this._pause();
              }
            },
            {
              key: "reverse",
              value: function() {
                this.direction = -this.direction;
              }
            }
          ],
          [
            {
              key: "build",
              value: function(t3, n2) {
                delete t3.animationSettings, t3.options = at(t3.options, t3.root, "5c7f360c"), t3.animations.map(function(n3) {
                  n3.settings = at(n3.s, t3.root, "5c7f360c"), delete n3.s, t3.animationSettings || (t3.animationSettings = n3.settings);
                });
                var e2 = t3.version;
                if (!(t3 = rt(t3, n2))) return null;
                var r2 = t3.options || {}, i2 = new this(t3.animations, t3.animationSettings, e2);
                return { el: t3.svg, options: r2, player: i2 };
              }
            },
            {
              key: "push",
              value: function(t3) {
                return this.build(t3);
              }
            },
            {
              key: "init",
              value: function() {
                var t3 = this, n2 = window.__SVGATOR_PLAYER__ && window.__SVGATOR_PLAYER__["5c7f360c"];
                Array.isArray(n2) && n2.splice(0).forEach(function(n3) {
                  return t3.build(n3);
                });
              }
            }
          ]
        ), t2;
      }();
      function ft(t2) {
        return d(t2) + "";
      }
      function ct(t2) {
        var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : " ";
        return t2 && t2.length ? t2.map(ft).join(n2) : "";
      }
      function ht(t2) {
        if (!t2) return "transparent";
        if (null == t2.a || t2.a >= 1) {
          var n2 = function(t3) {
            return 1 === (t3 = parseInt(t3).toString(16)).length ? "0" + t3 : t3;
          }, e2 = function(t3) {
            return t3.charAt(0) === t3.charAt(1);
          }, r2 = n2(t2.r), i2 = n2(t2.g), u2 = n2(t2.b);
          return e2(r2) && e2(i2) && e2(u2) && (r2 = r2.charAt(0), i2 = i2.charAt(0), u2 = u2.charAt(0)), "#" + r2 + i2 + u2;
        }
        return "rgba(" + t2.r + "," + t2.g + "," + t2.b + "," + t2.a + ")";
      }
      function vt(t2) {
        return t2 ? "url(#" + t2 + ")" : "none";
      }
      !function() {
        for (var t2 = 0, n2 = ["ms", "moz", "webkit", "o"], e2 = 0; e2 < n2.length && !window.requestAnimationFrame; ++e2)
          window.requestAnimationFrame = window[n2[e2] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[n2[e2] + "CancelAnimationFrame"] || window[n2[e2] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(n3) {
          var e3 = Date.now(), r2 = Math.max(0, 16 - (e3 - t2)), i2 = window.setTimeout(function() {
            n3(e3 + r2);
          }, r2);
          return t2 = e3 + r2, i2;
        }, window.cancelAnimationFrame = window.clearTimeout);
      }();
      var yt = {
        f: null,
        i: function(t2, n2, e2) {
          return 0 === t2 ? n2 : 1 === t2 ? e2 : { x: B(t2, n2.x, e2.x), y: B(t2, n2.y, e2.y) };
        },
        u: function(t2, n2) {
          return function(e2) {
            var r2 = n2(e2);
            t2.setAttribute("rx", ft(r2.x)), t2.setAttribute("ry", ft(r2.y));
          };
        }
      }, gt = {
        f: null,
        i: function(t2, n2, e2) {
          return 0 === t2 ? n2 : 1 === t2 ? e2 : { width: B(t2, n2.width, e2.width), height: B(t2, n2.height, e2.height) };
        },
        u: function(t2, n2) {
          return function(e2) {
            var r2 = n2(e2);
            t2.setAttribute("width", ft(r2.width)), t2.setAttribute("height", ft(r2.height));
          };
        }
      };
      var dt = {}, pt = null;
      function mt(t2) {
        var n2 = function() {
          if (pt) return pt;
          if ("object" !== ("undefined" == typeof document ? "undefined" : e(document)) || !document.createElementNS)
            return {};
          var t3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          return t3 && t3.style ? (t3.style.position = "absolute", t3.style.opacity = "0.01", t3.style.zIndex = "-9999", t3.style.left = "-9999px", t3.style.width = "1px", t3.style.height = "1px", pt = { svg: t3 }) : {};
        }().svg;
        if (!n2)
          return function(t3) {
            return null;
          };
        var r2 = document.createElementNS(n2.namespaceURI, "path");
        r2.setAttributeNS(null, "d", t2), r2.setAttributeNS(null, "fill", "none"), r2.setAttributeNS(null, "stroke", "none"), n2.appendChild(r2);
        var i2 = r2.getTotalLength();
        return function(t3) {
          var n3 = r2.getPointAtLength(i2 * t3);
          return { x: n3.x, y: n3.y };
        };
      }
      function bt(t2) {
        return dt[t2] ? dt[t2] : dt[t2] = mt(t2);
      }
      function wt(t2, n2, e2, r2) {
        if (!t2 || !r2) return false;
        var i2 = ["M", t2.x, t2.y];
        if (n2 && e2 && (i2.push("C"), i2.push(n2.x), i2.push(n2.y), i2.push(e2.x), i2.push(e2.y)), n2 ? !e2 : e2) {
          var u2 = n2 || e2;
          i2.push("Q"), i2.push(u2.x), i2.push(u2.y);
        }
        return n2 || e2 || i2.push("L"), i2.push(r2.x), i2.push(r2.y), i2.join(" ");
      }
      function xt(t2, n2, e2, r2) {
        var i2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1, u2 = wt(t2, n2, e2, r2), o2 = bt(u2);
        try {
          return o2(i2);
        } catch (t3) {
          return null;
        }
      }
      function At(t2, n2, e2) {
        return t2 + (n2 - t2) * e2;
      }
      function kt(t2, n2, e2) {
        var r2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], i2 = { x: At(t2.x, n2.x, e2), y: At(t2.y, n2.y, e2) };
        return r2 && (i2.a = _t(t2, n2)), i2;
      }
      function _t(t2, n2) {
        return Math.atan2(n2.y - t2.y, n2.x - t2.x);
      }
      function St(t2, n2, e2, r2) {
        var i2 = 1 - r2;
        return i2 * i2 * t2 + 2 * i2 * r2 * n2 + r2 * r2 * e2;
      }
      function Ot(t2, n2, e2, r2) {
        return 2 * (1 - r2) * (n2 - t2) + 2 * r2 * (e2 - n2);
      }
      function jt(t2, n2, e2, r2) {
        var i2 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4], u2 = xt(t2, n2, null, e2, r2);
        return u2 || (u2 = { x: St(t2.x, n2.x, e2.x, r2), y: St(t2.y, n2.y, e2.y, r2) }), i2 && (u2.a = Mt(t2, n2, e2, r2)), u2;
      }
      function Mt(t2, n2, e2, r2) {
        return Math.atan2(Ot(t2.y, n2.y, e2.y, r2), Ot(t2.x, n2.x, e2.x, r2));
      }
      function Pt(t2, n2, e2, r2, i2) {
        var u2 = i2 * i2;
        return i2 * u2 * (r2 - t2 + 3 * (n2 - e2)) + 3 * u2 * (t2 + e2 - 2 * n2) + 3 * i2 * (n2 - t2) + t2;
      }
      function Et(t2, n2, e2, r2, i2) {
        var u2 = 1 - i2;
        return 3 * (u2 * u2 * (n2 - t2) + 2 * u2 * i2 * (e2 - n2) + i2 * i2 * (r2 - e2));
      }
      function It(t2, n2, e2, r2, i2) {
        var u2 = arguments.length > 5 && void 0 !== arguments[5] && arguments[5], o2 = xt(t2, n2, e2, r2, i2);
        return o2 || (o2 = { x: Pt(t2.x, n2.x, e2.x, r2.x, i2), y: Pt(t2.y, n2.y, e2.y, r2.y, i2) }), u2 && (o2.a = Rt(t2, n2, e2, r2, i2)), o2;
      }
      function Rt(t2, n2, e2, r2, i2) {
        return Math.atan2(Et(t2.y, n2.y, e2.y, r2.y, i2), Et(t2.x, n2.x, e2.x, r2.x, i2));
      }
      function Ft(t2, n2, e2) {
        var r2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        if (Tt(n2)) {
          if (qt(e2)) return jt(n2, e2.start, e2, t2, r2);
        } else if (Tt(e2)) {
          if (Bt(n2)) return jt(n2, n2.end, e2, t2, r2);
        } else {
          if (Bt(n2))
            return qt(e2) ? It(n2, n2.end, e2.start, e2, t2, r2) : jt(n2, n2.end, e2, t2, r2);
          if (qt(e2)) return jt(n2, e2.start, e2, t2, r2);
        }
        return kt(n2, e2, t2, r2);
      }
      function Nt(t2, n2, e2) {
        var r2 = Ft(t2, n2, e2, true);
        return r2.a = function(t3) {
          return arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? t3 + Math.PI : t3;
        }(r2.a) / m, r2;
      }
      function Tt(t2) {
        return !t2.type || "corner" === t2.type;
      }
      function qt(t2) {
        return null != t2.start && !Tt(t2);
      }
      function Bt(t2) {
        return null != t2.end && !Tt(t2);
      }
      var Lt = new N();
      var Ct = { f: ft, i: q }, Dt = { f: ft, i: L };
      function zt(t2, n2, e2) {
        return t2.map(function(t3) {
          return function(t4, n3, e3) {
            var r2 = t4.v;
            if (!r2 || "g" !== r2.t || r2.s || !r2.v || !r2.r) return t4;
            var i2 = e3.getElementById(r2.r), u2 = i2 && i2.querySelectorAll("stop") || [];
            return r2.s = r2.v.map(function(t5, n4) {
              var e4 = u2[n4] && u2[n4].getAttribute("offset");
              return { c: t5, o: e4 = d(parseInt(e4) / 100) };
            }), delete r2.v, t4;
          }(t3, 0, e2);
        });
      }
      var Vt = {
        gt: "gradientTransform",
        c: { x: "cx", y: "cy" },
        rd: "r",
        f: { x: "x1", y: "y1" },
        to: { x: "x2", y: "y2" }
      };
      function Gt(t2, n2, r2, i2, u2, o2, a2, l2) {
        return zt(t2, 0, l2), n2 = function(t3, n3, e2) {
          for (var r3, i3, u3, o3 = t3.length - 1, a3 = {}, l3 = 0; l3 <= o3; l3++)
            (r3 = t3[l3]).e && (r3.e = n3(r3.e)), r3.v && "g" === (i3 = r3.v).t && i3.r && (u3 = e2.getElementById(i3.r)) && (a3[i3.r] = { e: u3, s: u3.querySelectorAll("stop") });
          return a3;
        }(t2, i2, l2), function(i3) {
          var u3 = r2(i3, t2, Yt);
          if (!u3) return "none";
          if ("c" === u3.t) return ht(u3.v);
          if ("g" === u3.t) {
            if (!n2[u3.r]) return vt(u3.r);
            var o3 = n2[u3.r];
            return function(t3, n3) {
              for (var e2 = t3.s, r3 = e2.length; r3 < n3.length; r3++) {
                var i4 = e2[e2.length - 1].cloneNode();
                i4.id = Qt(i4.id), t3.e.appendChild(i4), e2 = t3.s = t3.e.querySelectorAll("stop");
              }
              for (var u4 = 0, o4 = e2.length, a3 = n3.length - 1; u4 < o4; u4++)
                e2[u4].setAttribute("stop-color", ht(n3[Math.min(u4, a3)].c)), e2[u4].setAttribute("offset", n3[Math.min(u4, a3)].o);
            }(o3, u3.s), Object.keys(Vt).forEach(function(t3) {
              if (void 0 !== u3[t3])
                if ("object" !== e(Vt[t3])) {
                  var n3, r3 = "gt" === t3 ? (n3 = u3[t3], Array.isArray(n3) ? "matrix(" + n3.join(" ") + ")" : "") : u3[t3], i4 = Vt[t3];
                  o3.e.setAttribute(i4, r3);
                } else
                  Object.keys(Vt[t3]).forEach(function(n4) {
                    if (void 0 !== u3[t3][n4]) {
                      var e2 = u3[t3][n4], r4 = Vt[t3][n4];
                      o3.e.setAttribute(r4, e2);
                    }
                  });
            }), vt(u3.r);
          }
          return "none";
        };
      }
      function Yt(t2, e2, r2) {
        if (0 === t2) return e2;
        if (1 === t2) return r2;
        if (e2 && r2) {
          var i2 = e2.t;
          if (i2 === r2.t)
            switch (e2.t) {
              case "c":
                return { t: i2, v: z(t2, e2.v, r2.v) };
              case "g":
                if (e2.r === r2.r) {
                  var u2 = { t: i2, s: $t(t2, e2.s, r2.s), r: e2.r };
                  return e2.gt && r2.gt && (u2.gt = function(t3, n2, e3) {
                    var r3 = n2.length;
                    if (r3 !== e3.length) return T(t3, n2, e3);
                    for (var i3 = new Array(r3), u3 = 0; u3 < r3; u3++)
                      i3[u3] = q(t3, n2[u3], e3[u3]);
                    return i3;
                  }(t2, e2.gt, r2.gt)), e2.c ? (u2.c = C(t2, e2.c, r2.c), u2.rd = B(t2, e2.rd, r2.rd)) : e2.f && (u2.f = C(t2, e2.f, r2.f), u2.to = C(t2, e2.to, r2.to)), u2;
                }
            }
          if ("c" === e2.t && "g" === r2.t || "c" === r2.t && "g" === e2.t) {
            var o2 = "c" === e2.t ? e2 : r2, a2 = "g" === e2.t ? n({}, e2) : n({}, r2), l2 = a2.s.map(function(t3) {
              return { c: o2.v, o: t3.o };
            });
            return a2.s = "c" === e2.t ? $t(t2, l2, a2.s) : $t(t2, a2.s, l2), a2;
          }
        }
        return T(t2, e2, r2);
      }
      function $t(t2, n2, e2) {
        if (n2.length === e2.length)
          return n2.map(function(n3, r3) {
            return Ut(t2, n3, e2[r3]);
          });
        for (var r2 = Math.max(n2.length, e2.length), i2 = [], u2 = 0; u2 < r2; u2++) {
          var o2 = Ut(t2, n2[Math.min(u2, n2.length - 1)], e2[Math.min(u2, e2.length - 1)]);
          i2.push(o2);
        }
        return i2;
      }
      function Ut(t2, n2, e2) {
        return { o: L(t2, n2.o, e2.o || 0), c: z(t2, n2.c, e2.c || {}) };
      }
      function Qt(t2) {
        return t2.replace(/-fill-([0-9]+)$/, function(t3, n2) {
          return "-fill-" + (+n2 + 1);
        });
      }
      var Ht = {
        fill: Gt,
        "fill-opacity": Dt,
        stroke: Gt,
        "stroke-opacity": Dt,
        "stroke-width": Ct,
        "stroke-dashoffset": { f: ft, i: q },
        "stroke-dasharray": {
          f: function(t2) {
            var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : " ";
            return t2 && t2.length > 0 && (t2 = t2.map(function(t3) {
              return d(t3, 4);
            })), ct(t2, n2);
          },
          i: function(t2, n2, e2) {
            var r2, i2, u2, o2 = n2.length, a2 = e2.length;
            if (o2 !== a2)
              if (0 === o2) n2 = V(o2 = a2, 0);
              else if (0 === a2) a2 = o2, e2 = V(o2, 0);
              else {
                var l2 = (u2 = (r2 = o2) * (i2 = a2) / function(t3, n3) {
                  for (var e3; n3; ) e3 = n3, n3 = t3 % n3, t3 = e3;
                  return t3 || 1;
                }(r2, i2)) < 0 ? -u2 : u2;
                n2 = G(n2, Math.floor(l2 / o2)), e2 = G(e2, Math.floor(l2 / a2)), o2 = a2 = l2;
              }
            for (var s2 = [], f2 = 0; f2 < o2; f2++) s2.push(d(B(t2, n2[f2], e2[f2])));
            return s2;
          }
        },
        opacity: Dt,
        transform: function(t2, n2, r2, i2) {
          if (!(t2 = function(t3, n3) {
            if (!t3 || "object" !== e(t3)) return null;
            var r3 = false;
            for (var i3 in t3)
              t3.hasOwnProperty(i3) && (t3[i3] && t3[i3].length ? (t3[i3].forEach(function(t4) {
                t4.e && (t4.e = n3(t4.e));
              }), r3 = true) : delete t3[i3]);
            return r3 ? t3 : null;
          }(t2, i2)))
            return null;
          var u2 = function(e2, i3, u3) {
            var o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
            return t2[e2] ? r2(i3, t2[e2], u3) : n2 && n2[e2] ? n2[e2] : o2;
          };
          return n2 && n2.a && t2.o ? function(n3) {
            var e2 = r2(n3, t2.o, Nt);
            return Lt.recomposeSelf(
              e2,
              u2("r", n3, q, 0) + e2.a,
              u2("k", n3, C),
              u2("s", n3, C),
              u2("t", n3, C)
            ).toString();
          } : function(t3) {
            return Lt.recomposeSelf(
              u2("o", t3, Ft, null),
              u2("r", t3, q, 0),
              u2("k", t3, C),
              u2("s", t3, C),
              u2("t", t3, C)
            ).toString();
          };
        },
        r: Ct,
        "#size": gt,
        "#radius": yt,
        _: function(t2, n2) {
          if (Array.isArray(t2)) for (var e2 = 0; e2 < t2.length; e2++) this[t2[e2]] = n2;
          else this[t2] = n2;
        }
      }, Jt = function(t2) {
        !function(t3, n3) {
          if ("function" != typeof n3 && null !== n3)
            throw new TypeError("Super expression must either be null or a function");
          t3.prototype = Object.create(n3 && n3.prototype, {
            constructor: { value: t3, writable: true, configurable: true }
          }), n3 && l(t3, n3);
        }(o2, t2);
        var n2, e2, i2 = (n2 = o2, e2 = s(), function() {
          var t3, r2 = a(n2);
          if (e2) {
            var i3 = a(this).constructor;
            t3 = Reflect.construct(r2, arguments, i3);
          } else t3 = r2.apply(this, arguments);
          return c(this, t3);
        });
        function o2() {
          return r(this, o2), i2.apply(this, arguments);
        }
        return u(o2, null, [
          {
            key: "build",
            value: function(t3) {
              var n3 = h(a(o2), "build", this).call(this, t3, Ht);
              if (!n3) return null;
              n3.el, n3.options, function(t4, n4, e3) {
                t4.play();
              }(n3.player);
            }
          }
        ]), o2;
      }(st);
      return Jt.init(), Jt;
    });
    (function(s, i, o, w, a, b) {
      w[o] = w[o] || {};
      w[o][s] = w[o][s] || [];
      w[o][s].push(i);
    })(
      "5c7f360c",
      {
        root: "eWMaDkTemOR1",
        version: "2022-05-04",
        animations: [
          {
            elements: {
              eWMaDkTemOR5: {
                opacity: [
                  { t: 6500, v: 0 },
                  { t: 6800, v: 1 },
                  { t: 9700, v: 1 },
                  { t: 1e4, v: 0 }
                ]
              },
              eWMaDkTemOR119: {
                opacity: [
                  { t: 3200, v: 0 },
                  { t: 3500, v: 0.1 },
                  { t: 6500, v: 0.11 },
                  { t: 6800, v: 0 },
                  { t: 6900, v: 0 },
                  { t: 1e4, v: 0 }
                ]
              },
              eWMaDkTemOR214: {
                opacity: [
                  { t: 3200, v: 0 },
                  { t: 3500, v: 1 },
                  { t: 6500, v: 1 },
                  { t: 6800, v: 0 },
                  { t: 6900, v: 0 },
                  { t: 1e4, v: 0 }
                ]
              },
              eWMaDkTemOR233: {
                opacity: [
                  { t: 0, v: 0 },
                  { t: 290, v: 1 },
                  { t: 3190, v: 1 },
                  { t: 3490, v: 0 },
                  { t: 3500, v: 0 },
                  { t: 1e4, v: 0 }
                ]
              }
            },
            s: "MGDA1NGI4NWZhMWIyVWBFmOWViMUxhNmFjYWIS1Zjc3VDZlNmQ2ZDZkWNmQ2OTVmYTFhNmFmYYTJhMGIxYTZhY2FiNWPY3NzZlNjk1ZmE2YjFFKYTJhZjllYjFhNmFjFYWJiMDVmNzc2ZDY5NCWZhM2E2YTlhOTVmSTWc3NmU2OTVmOWVhOWIAxYTJhZmFiOWViMWEyYNWY3N2EzOWVhOWIwYMTI2OTVmYjBhZGEyYTGJhMTVmNzc2ZWJh"
          }
        ],
        options: "MTDAxMDg4MmY4MDgxNmLU3ZjgxMmY0NzJmNzkF3YzZlNzEyZjhh"
      },
      "__SVGATOR_PLAYER__",
      window
    );
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      id: "eWMaDkTemOR1",
      xmlns: "http://www.w3.org/2000/svg",
      xmlnsXlink: "http://www.w3.org/1999/xlink",
      viewBox: "0 0 513 291",
      shapeRendering: "geometricPrecision",
      textRendering: "geometricPrecision",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: "eWMaDkTemOR106-fill",
              x1: "52.576",
              y1: "150.52606",
              x2: "0",
              y2: "150.52606",
              spreadMethod: "pad",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(0 0)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR106-fill-0", offset: "0%", stopColor: "#051626" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "stop",
                  {
                    id: "eWMaDkTemOR106-fill-1",
                    offset: "41.1571%",
                    stopColor: "rgba(5,22,38,0.89)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR106-fill-2", offset: "100%", stopColor: "rgba(5,22,38,0)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: "eWMaDkTemOR115-stroke",
              x1: "268",
              y1: "83.25",
              x2: "314.5",
              y2: "83.25",
              spreadMethod: "pad",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(0 0)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR115-stroke-0", offset: "0%", stopColor: "#26abff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR115-stroke-1", offset: "100%", stopColor: "#0cf" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: "eWMaDkTemOR207-fill",
              x1: "81.072",
              y1: "209.51",
              x2: "0",
              y2: "209.51",
              spreadMethod: "pad",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(0 0)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR207-fill-0", offset: "0%", stopColor: "#051626" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "stop",
                  {
                    id: "eWMaDkTemOR207-fill-1",
                    offset: "41.1571%",
                    stopColor: "rgba(5,22,38,0.89)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR207-fill-2", offset: "100%", stopColor: "rgba(5,22,38,0)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: "eWMaDkTemOR219-stroke",
              x1: "268",
              y1: "93.25",
              x2: "314.5",
              y2: "93.25",
              spreadMethod: "pad",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(0 0)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR219-stroke-0", offset: "0%", stopColor: "#26abff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR219-stroke-1", offset: "100%", stopColor: "#0cf" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: "eWMaDkTemOR262-stroke",
              x1: "268",
              y1: "83.25",
              x2: "314.5",
              y2: "83.25",
              spreadMethod: "pad",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(0 0)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR262-stroke-0", offset: "0%", stopColor: "#26abff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { id: "eWMaDkTemOR262-stroke-1", offset: "100%", stopColor: "#0cf" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#eWMaDkTemOR266)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                width: "513",
                height: "291",
                rx: "0",
                ry: "0",
                transform: "translate(0 0.000001)",
                fill: "#051626",
                strokeWidth: "0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { id: "eWMaDkTemOR5", opacity: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 111.529)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M23,184.295h-5.8182v-2.034c0-.405.0701-.739.2102-1.002.1383-.264.3249-.46.5597-.589.233-.128.4915-.193.7756-.193.25,0,.4564.045.6193.134.1629.087.2917.202.3864.346.0947.142.1647.297.2102.463h.0568c.0114-.178.0739-.357.1875-.536.1136-.18.2765-.331.4886-.452s.4716-.182.7784-.182c.2917,0,.554.066.787.199.2329.132.4176.342.554.628.1363.286.2045.658.2045,1.116v2.102Zm-.625-.704v-1.398c0-.46-.089-.787-.267-.98-.18-.195-.3978-.293-.6535-.293-.1969,0-.3787.051-.5454.151-.1686.1-.303.243-.4034.429-.1023.186-.1534.405-.1534.659v1.432h2.0227Zm-2.6364,0v-1.307c0-.212-.0416-.403-.125-.574-.0833-.172-.2007-.308-.3522-.409-.1516-.102-.3296-.153-.5341-.153-.2557,0-.4726.089-.6506.267-.1799.178-.2699.46-.2699.846v1.33h1.9318Zm3.3637-5.692c0,.277-.0521.528-.1563.753-.106.225-.2585.404-.4574.537-.2007.132-.4431.199-.7272.199-.25,0-.4527-.049-.608-.148-.1572-.098-.2803-.23-.3693-.395s-.1553-.346-.1989-.545c-.0454-.201-.0814-.403-.1079-.605-.0341-.266-.0597-.481-.0767-.645-.019-.167-.0502-.288-.0938-.364-.0435-.078-.1193-.116-.2273-.116h-.0227c-.2803,0-.4981.076-.6534.23-.1553.151-.2329.381-.2329.69c0,.32.07.571.2102.753s.2898.31.4488.383l-.2272.637c-.2652-.114-.4716-.265-.6193-.455-.1497-.191-.2538-.399-.3125-.625-.0607-.227-.091-.451-.091-.67c0-.14.0171-.301.0512-.483.0322-.184.0994-.361.2017-.531.1023-.173.2566-.316.4631-.429.2064-.114.4829-.171.8295-.171h2.875v.671h-.5909v.034c.0947.045.196.121.304.227s.1998.247.2755.423.1137.391.1137.645Zm-.6023-.102c0-.265-.0521-.489-.1563-.671-.1041-.183-.2386-.322-.4034-.414-.1647-.095-.338-.142-.5198-.142h-.6137c.0341.028.0654.091.0938.187.0265.095.0502.205.071.33.0189.123.036.243.0511.36.0133.116.0246.21.0341.282.0227.174.0597.337.1108.488.0493.15.1241.271.2244.364.0985.091.233.136.4035.136.2329,0,.409-.086.5284-.258.1174-.174.1761-.395.1761-.662Zm-2.8864-6.212l.1705.602c-.1004.038-.1979.094-.2926.167-.0966.072-.1762.171-.2387.296s-.0937.285-.0937.48c0,.267.0615.49.1846.668.1213.176.2756.264.4631.264.1667,0,.2983-.061.3949-.182s.1771-.311.2415-.568l.1591-.648c.0947-.39.2396-.681.4346-.872.1932-.191.4423-.287.7472-.287.25,0,.4735.072.6704.216.197.142.3523.341.466.596.1136.256.1704.554.1704.893c0,.445-.0966.813-.2898,1.105-.1931.291-.4753.476-.8466.554l-.159-.637c.2348-.06.4109-.175.5284-.344.1174-.17.1761-.392.1761-.667c0-.313-.0663-.561-.1989-.744-.1344-.186-.2954-.279-.4829-.279-.1515,0-.2784.053-.3807.159-.1042.106-.1818.269-.233.489l-.1704.727c-.0947.4-.2415.693-.4404.881-.2007.185-.4517.278-.7528.278-.2462,0-.464-.069-.6534-.207-.1894-.14-.3381-.331-.446-.571-.108-.243-.162-.517-.162-.824c0-.432.0947-.771.2841-1.017.1894-.248.4394-.424.75-.528Zm3.4773-2.919c0,.421-.0928.783-.2784,1.088-.1875.303-.4489.537-.7841.702-.3371.163-.7292.244-1.1761.244s-.8409-.081-1.1818-.244c-.3428-.165-.6099-.394-.8012-.688-.1932-.295-.2898-.64-.2898-1.034c0-.227.0379-.451.1137-.673.0757-.222.1988-.423.3693-.605.1686-.182.392-.327.6705-.435.2784-.108.6212-.162,1.0284-.162h.2841v3.364h-.5796v-2.682c-.2462,0-.4659.049-.6591.148-.1932.097-.3456.235-.4574.415-.1117.178-.1676.388-.1676.63c0,.267.0663.498.1989.694.1307.193.3011.341.5113.446.2103.104.4357.156.6762.156h.3863c.3296,0,.6089-.057.8381-.171.2273-.115.4006-.275.5199-.48.1174-.204.1761-.442.1761-.713c0-.176-.0246-.335-.0738-.477-.0512-.144-.1269-.268-.2273-.372-.1023-.104-.2292-.185-.3807-.242l.1818-.647c.2197.068.4129.182.5796.343.1648.161.2935.36.3863.597.091.237.1364.503.1364.798Zm.0114-6.361c0,.277-.0521.528-.1563.753-.106.226-.2585.405-.4574.537-.2007.133-.4431.199-.7272.199-.25,0-.4527-.049-.608-.148-.1572-.098-.2803-.23-.3693-.395-.089-.164-.1553-.346-.1989-.545-.0454-.201-.0814-.402-.1079-.605-.0341-.265-.0597-.48-.0767-.645-.019-.167-.0502-.288-.0938-.364-.0435-.077-.1193-.116-.2273-.116h-.0227c-.2803,0-.4981.077-.6534.23-.1553.151-.2329.382-.2329.69c0,.32.07.571.2102.753s.2898.31.4488.384l-.2272.636c-.2652-.114-.4716-.265-.6193-.455-.1497-.191-.2538-.399-.3125-.625-.0607-.227-.091-.45-.091-.67c0-.14.0171-.301.0512-.483.0322-.184.0994-.361.2017-.531.1023-.173.2566-.316.4631-.429.2064-.114.4829-.171.8295-.171h2.875v.671h-.5909v.034c.0947.045.196.121.304.227s.1998.247.2755.424c.0758.176.1137.391.1137.644Zm-.6023-.102c0-.265-.0521-.489-.1563-.67-.1041-.184-.2386-.322-.4034-.415-.1647-.095-.338-.142-.5198-.142h-.6137c.0341.028.0654.091.0938.187.0265.095.0502.205.071.33.0189.123.036.243.0511.361.0133.115.0246.209.0341.281.0227.174.0597.337.1108.489.0493.149.1241.27.2244.363.0985.091.233.137.4035.137.2329,0,.409-.087.5284-.259.1174-.174.1761-.395.1761-.662Zm-3.8636-3.621l1.7841-1.046-1.7841-1.045v-.773l2.1818,1.409L23,155.718v.773l-1.6932,1.045L23,158.582v.772l-2.1818-1.386-2.1818,1.386v-.772ZM23,154.761h-4.3636v-.67h4.3636v.67Zm-5.0909-.341c0,.131-.0445.244-.1335.339-.089.092-.1961.139-.3211.139s-.232-.047-.321-.139c-.089-.095-.1335-.208-.1335-.339c0-.13.0445-.242.1335-.335.089-.094.196-.142.321-.142s.2321.048.3211.142c.089.093.1335.205.1335.335Zm1.7045-4.648l.1705.602c-.1004.038-.1979.094-.2926.168-.0966.072-.1762.17-.2387.295s-.0937.285-.0937.48c0,.268.0615.49.1846.668.1213.176.2756.264.4631.264.1667,0,.2983-.06.3949-.182.0966-.121.1771-.31.2415-.568l.1591-.647c.0947-.391.2396-.681.4346-.873.1932-.191.4423-.287.7472-.287.25,0,.4735.072.6704.216.197.142.3523.341.466.597.1136.256.1704.553.1704.892c0,.445-.0966.813-.2898,1.105s-.4753.476-.8466.554l-.159-.636c.2348-.061.4109-.175.5284-.344.1174-.17.1761-.393.1761-.668c0-.312-.0663-.56-.1989-.744-.1344-.186-.2954-.278-.4829-.278-.1515,0-.2784.053-.3807.159-.1042.106-.1818.269-.233.488l-.1704.728c-.0947.399-.2415.693-.4404.88-.2007.186-.4517.279-.7528.279-.2462,0-.464-.069-.6534-.208-.1894-.14-.3381-.33-.446-.571-.108-.242-.162-.517-.162-.824c0-.431.0947-.77.2841-1.017.1894-.248.4394-.424.75-.528Z",
                  fill: "#9ea5ab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M23,144.057v.738l-5.8182-2.136v-.727L23,139.795v.739l-4.8977,1.739v.045L23,144.057Zm-2.2727-.273v-2.977h.625v2.977h-.625Zm-.3523-5.474h2.625v.67h-4.3636v-.648h.6818v-.056c-.2216-.103-.3996-.258-.5341-.466-.1364-.209-.2046-.478-.2046-.807c0-.296.0607-.554.1819-.776.1193-.221.3011-.394.5454-.517.2424-.123.5493-.184.9205-.184h2.7727v.67h-2.7273c-.3428,0-.6098.089-.8011.267-.1932.178-.2898.422-.2898.733c0,.214.0464.405.1392.574.0928.167.2282.298.4063.395.178.096.3939.145.6477.145Zm0-4.68h2.625v.67h-4.3636v-.647h.6818v-.057c-.2216-.102-.3996-.258-.5341-.466-.1364-.208-.2046-.477-.2046-.807c0-.295.0607-.554.1819-.775.1193-.222.3011-.394.5454-.517.2424-.124.5493-.185.9205-.185h2.7727v.67h-2.7273c-.3428,0-.6098.089-.8011.267-.1932.178-.2898.423-.2898.733c0,.214.0464.406.1392.574.0928.167.2282.298.4063.395s.3939.145.6477.145Zm2.7159-5.839c0,.421-.0928.783-.2784,1.088-.1875.303-.4489.537-.7841.702-.3371.163-.7292.244-1.1761.244s-.8409-.081-1.1818-.244c-.3428-.165-.6099-.394-.8012-.688-.1932-.295-.2898-.64-.2898-1.034c0-.227.0379-.451.1137-.673.0757-.222.1988-.423.3693-.605.1686-.182.392-.327.6705-.435.2784-.108.6212-.162,1.0284-.162h.2841v3.364h-.5796v-2.682c-.2462,0-.4659.049-.6591.148-.1932.097-.3456.235-.4574.415-.1117.178-.1676.388-.1676.63c0,.267.0663.498.1989.694.1307.193.3011.341.5113.446.2103.104.4357.156.6762.156h.3863c.3296,0,.6089-.057.8381-.171.2273-.115.4006-.275.5199-.48.1174-.204.1761-.442.1761-.713c0-.176-.0246-.335-.0738-.477-.0512-.144-.1269-.268-.2273-.372-.1023-.104-.2292-.185-.3807-.242l.1818-.647c.2197.068.4129.182.5796.343.1648.161.2935.36.3863.597.091.237.1364.503.1364.798Zm-4.4545-3.209l1.7841-1.046-1.7841-1.045v-.773l2.1818,1.409L23,121.718v.773l-1.6932,1.045L23,124.582v.772l-2.1818-1.386-2.1818,1.386v-.772Zm4.4659-7.355c0,.277-.0521.528-.1563.753-.106.225-.2585.404-.4574.537-.2007.133-.4431.199-.7272.199-.25,0-.4527-.049-.608-.148-.1572-.098-.2803-.23-.3693-.395-.089-.164-.1553-.346-.1989-.545-.0454-.201-.0814-.403-.1079-.605-.0341-.265-.0597-.48-.0767-.645-.019-.167-.0502-.288-.0938-.364-.0435-.077-.1193-.116-.2273-.116h-.0227c-.2803,0-.4981.076-.6534.23-.1553.151-.2329.381-.2329.69c0,.32.07.571.2102.753s.2898.31.4488.384l-.2272.636c-.2652-.114-.4716-.265-.6193-.455-.1497-.191-.2538-.399-.3125-.625-.0607-.227-.091-.45-.091-.67c0-.14.0171-.301.0512-.483.0322-.184.0994-.361.2017-.531.1023-.173.2566-.316.4631-.429.2064-.114.4829-.171.8295-.171h2.875v.671h-.5909v.034c.0947.045.196.121.304.227s.1998.247.2755.423c.0758.177.1137.391.1137.645Zm-.6023-.102c0-.265-.0521-.489-.1563-.67-.1041-.184-.2386-.322-.4034-.415-.1647-.095-.338-.142-.5198-.142h-.6137c.0341.028.0654.091.0938.187.0265.095.0502.205.071.33.0189.123.036.243.0511.361.0133.115.0246.209.0341.281.0227.174.0597.337.1108.488.0493.15.1241.271.2244.364.0985.091.233.136.4035.136.2329,0,.409-.086.5284-.258.1174-.174.1761-.395.1761-.662Zm-3.8636-3.621l1.7841-1.046-1.7841-1.045v-.773l2.1818,1.409L23,110.64v.773l-1.6932,1.045L23,113.504v.772l-2.1818-1.386-2.1818,1.386v-.772ZM23,109.683h-4.3636v-.67h4.3636v.67Zm-5.0909-.341c0,.131-.0445.244-.1335.338-.089.093-.1961.14-.3211.14s-.232-.047-.321-.14c-.089-.094-.1335-.207-.1335-.338c0-.13.0445-.242.1335-.335.089-.095.196-.142.321-.142s.2321.047.3211.142c.089.093.1335.205.1335.335Zm1.7045-4.648l.1705.602c-.1004.038-.1979.094-.2926.168-.0966.072-.1762.17-.2387.295s-.0937.285-.0937.48c0,.267.0615.49.1846.668.1213.176.2756.264.4631.264.1667,0,.2983-.06.3949-.182.0966-.121.1771-.31.2415-.568l.1591-.648c.0947-.39.2396-.68.4346-.872.1932-.191.4423-.287.7472-.287.25,0,.4735.072.6704.216.197.142.3523.341.466.597.1136.256.1704.553.1704.892c0,.445-.0966.813-.2898,1.105s-.4753.476-.8466.554l-.159-.636c.2348-.061.4109-.176.5284-.344.1174-.171.1761-.393.1761-.668c0-.312-.0663-.56-.1989-.744-.1344-.186-.2954-.278-.4829-.278-.1515,0-.2784.053-.3807.159-.1042.106-.1818.269-.233.488l-.1704.728c-.0947.399-.2415.693-.4404.88-.2007.186-.4517.279-.7528.279-.2462,0-.464-.07-.6534-.208-.1894-.14-.3381-.33-.446-.571-.108-.242-.162-.517-.162-.824c0-.431.0947-.77.2841-1.017.1894-.248.4394-.424.75-.528Z",
                  fill: "#9ea5ab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M21,198v19.5",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M19,215l2,3.5l2-3.5",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M20,93.5L20,74",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M22,76.5L20,73l-2,3.5",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "196",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 243)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 92.826)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "196",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 224)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "212",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 261)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "212",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 279)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 74.1232)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 205.043)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "196",
                  height: "15",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 55)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 186.341)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "196",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 37)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "215",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 19)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "215",
                  height: "14",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 0.999939)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "163.167",
                  height: "14.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 167.638)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 128.674001 165.918485)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "7.21806",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.434025 166.283149)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M142.476,169.918v-.628l2.358-2.581c.277-.302.505-.565.684-.788.179-.226.311-.438.398-.635.088-.2.132-.41.132-.628c0-.251-.06-.469-.181-.652-.119-.184-.282-.326-.489-.426s-.439-.15-.697-.15c-.275,0-.514.057-.719.171-.202.112-.359.269-.471.471-.109.202-.164.439-.164.711h-.823c0-.418.097-.786.29-1.102s.455-.563.788-.739c.335-.177.71-.265,1.127-.265.418,0,.789.088,1.112.265.324.176.577.415.761.715.183.3.275.633.275,1.001c0,.263-.047.52-.143.771-.093.249-.255.526-.488.833-.23.305-.55.677-.959,1.117l-1.605,1.716v.056h3.321v.767h-4.507Zm8.319.098c-.293-.005-.586-.061-.879-.168s-.56-.287-.802-.54c-.242-.256-.436-.602-.582-1.036-.147-.438-.22-.986-.22-1.647c0-.632.059-1.193.178-1.681.118-.491.29-.904.516-1.238.226-.338.498-.593.816-.768.321-.174.683-.261,1.085-.261.4,0,.756.08,1.067.24.314.158.57.379.768.663.197.284.325.61.383.98h-.851c-.079-.321-.232-.587-.46-.799-.228-.211-.53-.317-.907-.317-.553,0-.989.241-1.308.722-.316.481-.476,1.157-.478,2.027h.056c.13-.198.285-.367.464-.506.181-.142.381-.251.6-.328.218-.077.45-.115.694-.115.409,0,.784.102,1.123.307.34.202.612.482.816.84.205.356.307.764.307,1.225c0,.442-.099.846-.296,1.214-.198.365-.476.655-.834.872-.356.214-.774.318-1.256.314Zm0-.768c.293,0,.556-.073.789-.22.235-.146.419-.342.554-.589.138-.246.206-.521.206-.823c0-.296-.066-.564-.199-.806-.13-.244-.31-.438-.54-.582-.228-.145-.489-.217-.782-.217-.221,0-.426.044-.617.133-.191.086-.358.204-.502.356-.142.151-.254.324-.335.519-.082.193-.122.397-.122.611c0,.283.066.549.198.795.135.247.319.445.552.597.234.151.501.226.798.226Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 128.674001 165.918485)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.021989 185.910569)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.65018",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 168.059029 185.931412)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M165.335,182.767v7.144h-.865v-6.237h-.041l-1.745,1.158v-.879l1.786-1.186h.865Zm2.055,7.144v-.628l2.358-2.581c.277-.303.505-.565.684-.789.179-.225.311-.437.397-.635.089-.2.133-.409.133-.627c0-.252-.061-.469-.182-.653-.118-.183-.281-.325-.488-.425s-.439-.15-.698-.15c-.274,0-.513.057-.718.171-.202.111-.359.268-.471.471-.109.202-.164.439-.164.711h-.823c0-.418.096-.786.289-1.102s.456-.563.789-.74c.335-.176.71-.265,1.126-.265.419,0,.79.089,1.113.265.323.177.577.415.76.715.184.3.276.634.276,1.002c0,.262-.048.519-.143.77-.093.249-.256.527-.488.834-.231.305-.55.677-.96,1.116l-1.604,1.716v.056h3.321v.768h-4.507Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.021989 185.910569)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.369977 205.903653)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.563985 206.269432)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M186.904,210.001c-.409,0-.778-.081-1.105-.244-.328-.163-.591-.386-.789-.67-.197-.283-.306-.607-.324-.969h.837c.033.323.179.59.44.802.262.209.576.314.941.314.293,0,.554-.069.782-.206.23-.137.41-.326.54-.565.133-.242.199-.515.199-.82c0-.311-.068-.589-.206-.833-.135-.247-.321-.441-.558-.583s-.508-.214-.813-.216c-.218-.002-.442.031-.673.101-.23.067-.419.155-.568.262l-.81-.098.433-3.516h3.711v.767h-2.985l-.252,2.107h.042c.147-.116.33-.213.551-.289.221-.077.452-.116.691-.116.437,0,.827.105,1.169.314.344.207.613.491.809.852.197.36.296.772.296,1.234c0,.456-.102.863-.307,1.221-.202.356-.481.637-.837.844-.356.205-.76.307-1.214.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.369977 205.903653)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 186.999567 224.939631)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 207.194983 225.304704)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M206.535,229.037c-.41,0-.778-.081-1.106-.244s-.591-.386-.788-.67c-.198-.283-.306-.606-.325-.969h.837c.033.323.179.59.44.802.263.209.577.314.942.314.293,0,.553-.069.781-.206.23-.137.41-.325.541-.565.132-.242.198-.515.198-.82c0-.311-.068-.589-.205-.833-.135-.247-.321-.441-.558-.583-.238-.142-.509-.214-.813-.216-.219-.002-.443.031-.673.101-.231.068-.42.155-.569.262l-.809-.098.432-3.516h3.712v.767h-2.986l-.251,2.107h.042c.146-.116.33-.213.551-.289.221-.077.451-.115.69-.115.438,0,.827.104,1.169.314.344.207.614.49.809.851.198.36.297.772.297,1.234c0,.456-.103.863-.307,1.221-.203.356-.482.637-.837.844-.356.205-.761.307-1.214.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 186.999567 224.939631)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 205.999608 244.598615)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 226.194724 244.963687)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M225.535,248.697c-.41,0-.778-.082-1.106-.245-.328-.162-.591-.386-.788-.669-.198-.284-.306-.607-.325-.97h.837c.033.323.179.591.44.802.263.21.577.314.942.314.293,0,.553-.068.781-.206.23-.137.41-.325.541-.565.132-.242.198-.515.198-.819c0-.312-.068-.59-.205-.834-.135-.247-.321-.441-.558-.583-.238-.141-.509-.214-.813-.216-.219-.002-.443.032-.673.101-.231.068-.42.155-.569.262l-.809-.098.432-3.516h3.712v.768h-2.986l-.251,2.106h.042c.146-.116.33-.212.551-.289s.451-.115.69-.115c.438,0,.827.104,1.169.314.344.207.614.49.809.851.198.36.297.772.297,1.235c0,.455-.103.862-.307,1.22-.203.356-.482.638-.837.845-.356.204-.761.307-1.214.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 205.999608 244.598615)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.000001 68.903235)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 207.194969 69.26859)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M206.535,73.0012c-.41,0-.778-.0814-1.106-.2441s-.591-.3861-.788-.6698c-.198-.2837-.306-.6069-.325-.9697h.837c.033.3233.179.5907.44.8023.263.2093.577.3139.942.3139.293,0,.553-.0686.781-.2058.23-.1372.41-.3255.541-.565.132-.2419.198-.5151.198-.8197c0-.3116-.068-.5895-.205-.8337-.135-.2465-.321-.4407-.558-.5825-.238-.1419-.509-.2139-.813-.2163-.219-.0023-.443.0314-.673.1012-.231.0674-.42.1546-.569.2616l-.809-.0977.432-3.516h3.712v.7674h-2.986l-.251,2.1068h.042c.146-.1163.33-.2128.551-.2895s.451-.1151.69-.1151c.438,0,.827.1046,1.169.3139.344.207.614.4907.809.8511.198.3605.297.7721.297,1.2348c0,.4558-.103.8627-.307,1.2209-.203.3557-.482.6371-.837.8441-.356.2046-.761.3069-1.214.3069Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.000001 68.903235)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000003 88.562289)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 226.195002 88.927715)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M225.535,92.6604c-.41,0-.778-.0814-1.106-.2442s-.591-.386-.788-.6697c-.198-.2837-.306-.6069-.325-.9697h.837c.033.3233.179.5907.44.8023.263.2093.577.3139.942.3139.293,0,.553-.0686.781-.2058.23-.1372.41-.3255.541-.565.132-.2419.198-.5151.198-.8198c0-.3116-.068-.5894-.205-.8336-.135-.2465-.321-.4407-.558-.5825-.238-.1419-.509-.214-.813-.2163-.219-.0023-.443.0314-.673.1012-.231.0674-.42.1546-.569.2616l-.809-.0977.432-3.516h3.712v.7674h-2.986l-.251,2.1068h.042c.146-.1163.33-.2128.551-.2895s.451-.1151.69-.1151c.438,0,.827.1046,1.169.3139.344.207.614.4907.809.8511.198.3604.297.772.297,1.2348c0,.4558-.103.8627-.307,1.2208-.203.3558-.482.6372-.837.8442-.356.2046-.761.3069-1.214.3069Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000003 88.562289)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000011 48.563018)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 226.19498 48.928444)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M225.535,52.6604c-.41,0-.778-.0814-1.106-.2442s-.591-.386-.788-.6697c-.198-.2837-.306-.6069-.325-.9697h.837c.033.3233.179.5907.44.8023.263.2093.577.3139.942.3139.293,0,.553-.0686.781-.2058.23-.1372.41-.3255.541-.565.132-.2419.198-.5151.198-.8198c0-.3116-.068-.5894-.205-.8336-.135-.2465-.321-.4407-.558-.5825-.238-.1419-.509-.214-.813-.2163-.219-.0023-.443.0314-.673.1012-.231.0674-.42.1546-.569.2616l-.809-.0977.432-3.516h3.712v.7674h-2.986l-.251,2.1068h.042c.146-.1163.33-.2128.551-.2895s.451-.1151.69-.1151c.438,0,.827.1046,1.169.3139.344.207.614.4907.809.8511.198.3604.297.772.297,1.2348c0,.4558-.103.8627-.307,1.2208-.203.3558-.482.6372-.837.8442-.356.2046-.761.3069-1.214.3069Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000011 48.563018)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.022004 107.874784)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "1.23973",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.697004 108.785632)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M168.335,104.731v7.144h-.865v-6.237h-.041l-1.745,1.158v-.879l1.786-1.186h.865Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.022004 107.874784)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.584022 127.221756)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.779044 127.587536)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M187.119,131.32c-.409,0-.778-.081-1.106-.244-.327-.163-.59-.386-.788-.67s-.306-.607-.324-.97h.837c.032.324.179.591.439.803.263.209.577.314.942.314.293,0,.554-.069.781-.206.231-.137.411-.326.541-.565.133-.242.199-.515.199-.82c0-.311-.069-.589-.206-.834-.135-.246-.321-.44-.558-.582s-.508-.214-.813-.216c-.218-.003-.443.031-.673.101-.23.067-.42.154-.568.261l-.81-.097.433-3.516h3.711v.767h-2.986l-.251,2.107h.042c.147-.116.33-.213.551-.29.221-.076.451-.115.691-.115.437,0,.827.105,1.168.314.345.207.614.491.81.851.197.361.296.772.296,1.235c0,.456-.102.863-.307,1.221-.202.356-.481.637-.837.844-.356.205-.76.307-1.214.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.584022 127.221756)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.215027 146.258735)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 207.409035 146.623514)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M206.75,150.356c-.41,0-.778-.081-1.106-.244s-.591-.386-.789-.67c-.197-.283-.305-.607-.324-.969h.837c.033.323.179.59.44.802.263.209.576.314.942.314.293,0,.553-.069.781-.206.23-.137.41-.326.541-.565.132-.242.198-.515.198-.82c0-.311-.068-.589-.205-.833-.135-.247-.321-.441-.559-.583-.237-.142-.508-.214-.812-.216-.219-.003-.443.031-.673.101-.231.067-.42.155-.569.262l-.809-.098.432-3.516h3.712v.767h-2.986l-.251,2.107h.041c.147-.116.331-.213.552-.289.221-.077.451-.116.69-.116.437,0,.827.105,1.169.314.344.207.614.491.809.852.198.36.296.772.296,1.234c0,.456-.102.863-.306,1.221-.203.356-.482.637-.838.844-.355.205-.76.307-1.213.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.215027 146.258735)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.214968 165.917718)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.15755",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 226.408976 166.283498)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M225.75,170.015c-.41,0-.778-.081-1.106-.244s-.591-.386-.789-.669c-.197-.284-.305-.607-.324-.97h.837c.033.323.179.59.44.802.263.209.576.314.942.314.293,0,.553-.069.781-.206.23-.137.41-.325.541-.565.132-.242.198-.515.198-.82c0-.311-.068-.589-.205-.833-.135-.247-.321-.441-.559-.583-.237-.142-.508-.214-.812-.216-.219-.002-.443.031-.673.101-.231.068-.42.155-.569.262l-.809-.098.432-3.516h3.712v.767h-2.986l-.251,2.107h.041c.147-.116.331-.213.552-.289.221-.077.451-.115.69-.115.437,0,.827.104,1.169.314.344.207.614.49.809.851.198.36.296.772.296,1.234c0,.456-.102.863-.306,1.221-.203.356-.482.637-.838.844-.355.205-.76.307-1.213.307Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.214968 165.917718)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 128.673997 127.222281)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "10.7419",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.237027 127.222151)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M145.345,130.954c-.293-.004-.586-.06-.879-.167s-.56-.287-.802-.541c-.242-.256-.436-.601-.583-1.036-.146-.437-.219-.986-.219-1.646c0-.633.059-1.193.178-1.681.118-.491.29-.904.516-1.239.225-.337.498-.593.816-.767.321-.174.683-.262,1.085-.262.4,0,.756.081,1.067.241.314.158.57.379.768.663.197.283.325.61.383.98h-.851c-.079-.321-.232-.587-.46-.799-.228-.211-.53-.317-.907-.317-.554,0-.99.24-1.308.722-.316.481-.476,1.157-.478,2.026h.056c.13-.197.285-.366.464-.505.181-.142.381-.252.6-.328.218-.077.45-.115.694-.115.409,0,.783.102,1.123.307.339.202.612.482.816.84.205.356.307.764.307,1.225c0,.441-.099.846-.296,1.213-.198.365-.476.656-.834.872-.356.214-.774.319-1.256.314Zm0-.767c.293,0,.556-.073.789-.22.234-.146.419-.343.554-.589.137-.247.206-.521.206-.823c0-.296-.066-.564-.199-.806-.13-.244-.31-.439-.54-.583-.228-.144-.489-.216-.782-.216-.221,0-.427.044-.617.133-.191.086-.358.204-.502.355-.142.151-.254.325-.335.52-.082.193-.122.397-.122.61c0,.284.066.549.198.796.135.246.319.445.552.596.234.151.501.227.798.227Zm6.046.767c-.479,0-.902-.085-1.27-.254-.365-.172-.65-.408-.854-.708-.205-.303-.306-.647-.304-1.033-.002-.302.057-.581.178-.837.121-.258.286-.473.496-.645.211-.175.447-.285.708-.332v-.042c-.342-.088-.614-.28-.817-.575-.202-.298-.302-.636-.3-1.015-.002-.363.09-.687.276-.973s.442-.512.767-.677c.328-.165.701-.248,1.12-.248.414,0,.784.083,1.109.248.326.165.582.391.768.677.188.286.283.61.286.973-.003.379-.106.717-.311,1.015-.202.295-.471.487-.806.575v.042c.259.047.491.157.698.332.207.172.372.387.495.645.124.256.186.535.189.837-.003.386-.107.73-.314,1.033-.205.3-.49.536-.855.708-.362.169-.782.254-1.259.254Zm0-.767c.323,0,.602-.052.837-.157s.416-.252.544-.443.193-.414.196-.67c-.003-.269-.072-.508-.21-.715-.137-.207-.324-.37-.561-.488-.235-.119-.504-.178-.806-.178-.305,0-.577.059-.816.178-.237.118-.425.281-.562.488-.135.207-.201.446-.199.715-.002.256.06.479.185.67.128.191.311.338.548.443s.519.157.844.157Zm0-3.39c.256,0,.483-.052.68-.154.2-.102.357-.245.471-.429s.172-.399.175-.645c-.003-.242-.06-.453-.171-.632-.112-.181-.267-.321-.464-.418-.198-.1-.428-.15-.691-.15-.267,0-.501.05-.701.15-.2.097-.355.237-.464.418-.109.179-.163.39-.16.632-.003.246.052.461.164.645.113.184.27.327.47.429s.431.154.691.154Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 128.673997 127.222281)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.237029 146.570253)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "1.23973",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.912029 147.481101)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M168.55,143.426v7.144h-.865v-6.237h-.041l-1.745,1.158v-.879l1.786-1.186h.865Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 148.237029 146.570253)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.58401 166.563044)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "7.21806",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.344034 166.927708)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M181.387,170.563v-.628l2.358-2.581c.276-.303.504-.565.683-.789.179-.225.312-.437.398-.634.088-.2.133-.41.133-.628c0-.251-.061-.469-.182-.653-.118-.183-.281-.325-.488-.425s-.44-.15-.698-.15c-.274,0-.514.057-.718.171-.203.111-.36.268-.471.471-.109.202-.164.439-.164.711h-.823c0-.418.096-.786.289-1.102s.456-.563.788-.739c.335-.177.711-.266,1.127-.266.419,0,.79.089,1.113.266.323.176.577.415.76.715.184.3.276.633.276,1.001c0,.262-.048.519-.143.771-.093.248-.256.526-.489.833-.23.305-.549.677-.959,1.116l-1.604,1.717v.055h3.32v.768h-4.506Zm8.319.097c-.293-.004-.586-.06-.879-.167s-.561-.287-.802-.541c-.242-.255-.436-.601-.583-1.036-.146-.437-.22-.986-.22-1.646c0-.633.06-1.193.178-1.681.119-.491.291-.904.517-1.239.225-.337.497-.593.816-.767.321-.174.682-.262,1.085-.262.4,0,.755.081,1.067.241.314.158.57.379.767.663.198.284.326.61.384.98h-.851c-.079-.321-.233-.587-.461-.799-.227-.211-.53-.317-.906-.317-.554,0-.99.24-1.309.722-.316.481-.475,1.157-.477,2.026h.055c.131-.197.285-.366.464-.505.182-.142.382-.251.6-.328.219-.077.45-.115.694-.115.41,0,.784.102,1.124.307.339.202.611.482.816.84.204.356.307.764.307,1.225c0,.441-.099.846-.297,1.213-.197.366-.475.656-.833.872-.356.214-.775.319-1.256.314Zm0-.767c.293,0,.556-.073.788-.22.235-.146.42-.343.555-.589.137-.247.206-.521.206-.823c0-.296-.067-.564-.199-.806-.13-.244-.311-.439-.541-.583-.228-.144-.488-.216-.781-.216-.221,0-.427.044-.618.133-.19.086-.358.204-.502.355-.142.152-.253.325-.335.52-.081.193-.122.397-.122.611c0,.283.066.548.199.795.135.246.319.445.551.596.235.151.501.227.799.227Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.58401 166.563044)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.215008 185.599315)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "7.21806",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.975031 185.963979)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M201.017,189.599v-.628l2.358-2.581c.277-.302.505-.565.684-.789.179-.225.311-.437.397-.634.089-.2.133-.41.133-.628c0-.251-.061-.469-.181-.652-.119-.184-.282-.326-.489-.426s-.439-.15-.697-.15c-.275,0-.514.057-.719.171-.202.112-.359.268-.471.471-.109.202-.164.439-.164.711h-.823c0-.418.097-.786.29-1.102s.455-.563.788-.739c.335-.177.71-.265,1.127-.265.418,0,.789.088,1.112.265.323.176.577.415.761.715.183.3.275.633.275,1.001c0,.263-.047.52-.143.771-.093.248-.256.526-.488.833-.23.305-.55.677-.959,1.117l-1.605,1.716v.055h3.321v.768h-4.507Zm8.319.098c-.293-.005-.586-.061-.879-.168s-.56-.287-.802-.541c-.242-.255-.436-.601-.583-1.036-.146-.437-.219-.985-.219-1.646c0-.632.059-1.193.178-1.681.118-.491.29-.904.516-1.238.225-.338.498-.593.816-.768.321-.174.683-.261,1.085-.261.4,0,.756.08,1.067.24.314.158.57.379.768.663.197.284.325.61.383.98h-.851c-.079-.321-.232-.587-.46-.799-.228-.211-.53-.317-.907-.317-.554,0-.99.241-1.308.722-.316.481-.476,1.157-.478,2.027h.056c.13-.198.285-.367.464-.506.181-.142.381-.251.6-.328.218-.077.45-.115.694-.115.409,0,.783.102,1.123.307.339.202.612.482.816.84.205.356.307.764.307,1.225c0,.442-.099.846-.296,1.214-.198.365-.476.655-.834.872-.356.214-.774.318-1.256.314Zm0-.768c.293,0,.556-.073.789-.22.234-.146.419-.343.554-.589.137-.247.206-.521.206-.823c0-.296-.066-.564-.199-.806-.13-.244-.31-.438-.54-.583-.228-.144-.489-.216-.782-.216-.221,0-.427.044-.617.133-.191.086-.358.204-.502.356-.142.151-.254.324-.335.519-.082.193-.122.397-.122.611c0,.283.066.548.198.795.135.246.319.445.552.596.234.152.501.227.798.227Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.215008 185.599315)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.215049 205.258299)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "7.21806",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 225.97498 205.62367)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M220.017,209.258v-.628l2.358-2.581c.277-.302.505-.565.684-.788.179-.226.311-.438.397-.635.089-.2.133-.409.133-.628c0-.251-.061-.469-.181-.652-.119-.184-.282-.326-.489-.426s-.439-.15-.697-.15c-.275,0-.514.057-.719.171-.202.112-.359.269-.471.471-.109.202-.164.439-.164.712h-.823c0-.419.097-.786.29-1.103.193-.316.455-.562.788-.739.335-.177.71-.265,1.127-.265.418,0,.789.088,1.112.265s.577.415.761.715c.183.3.275.634.275,1.001c0,.263-.047.52-.143.771-.093.249-.256.527-.488.834-.23.304-.55.676-.959,1.116l-1.605,1.716v.056h3.321v.767h-4.507Zm8.319.098c-.293-.005-.586-.061-.879-.168s-.56-.287-.802-.54c-.242-.256-.436-.601-.583-1.036-.146-.438-.219-.986-.219-1.647c0-.632.059-1.193.178-1.681.118-.491.29-.903.516-1.238.225-.337.498-.593.816-.768.321-.174.683-.261,1.085-.261.4,0,.756.08,1.067.24.314.159.57.379.768.663.197.284.325.611.383.98h-.851c-.079-.321-.232-.587-.46-.798-.228-.212-.53-.318-.907-.318-.554,0-.99.241-1.308.722-.316.482-.476,1.157-.478,2.027h.056c.13-.198.285-.367.464-.506.181-.142.381-.251.6-.328.218-.077.45-.115.694-.115.409,0,.783.102,1.123.307.339.202.612.482.816.841.205.355.307.763.307,1.224c0,.442-.099.846-.296,1.214-.198.365-.476.656-.834.872-.356.214-.774.318-1.256.314Zm0-.768c.293,0,.556-.073.789-.219.234-.147.419-.343.554-.59.137-.246.206-.521.206-.823c0-.295-.066-.564-.199-.806-.13-.244-.31-.438-.54-.582-.228-.145-.489-.217-.782-.217-.221,0-.427.045-.617.133-.191.086-.358.205-.502.356-.142.151-.254.324-.335.519-.082.193-.122.397-.122.611c0,.284.066.549.198.795.135.247.319.445.552.597.234.151.501.226.798.226Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.215049 205.258299)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.370021 88.526297)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.6544",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 187.506998 88.891735)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M184.683,85.383v7.1436h-.865v-6.2367h-.042l-1.744,1.158v-.879l1.786-1.1859h.865Zm1.887,5.6786v-.7116l3.14-4.967h.516v1.1022h-.349l-2.372,3.7532v.0558h4.228v.7674h-5.163Zm3.363,1.465v-1.6813-.3313-5.131h.823v7.1436h-.823Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 167.370021 88.526297)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 186.999995 107.562559)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.6544",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 207.136998 107.927643)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M204.314,104.419v7.144h-.865v-6.237h-.042l-1.744,1.158v-.879l1.786-1.186h.865Zm1.887,5.679v-.712l3.139-4.967h.516v1.102h-.348l-2.372,3.754v.055h4.227v.768h-5.162Zm3.362,1.465v-1.682-.331-5.131h.824v7.144h-.824Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 186.999995 107.562559)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000036 127.221542)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "3.6544",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 226.137039 127.586627)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M223.314,124.078v7.144h-.865v-6.237h-.042l-1.744,1.158v-.879l1.786-1.186h.865Zm1.887,5.679v-.712l3.139-4.967h.516v1.103h-.348l-2.372,3.753v.056h4.227v.767h-5.162Zm3.362,1.465v-1.681-.332-5.131h.824v7.144h-.824Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 206.000036 127.221542)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "67",
                  height: "300",
                  rx: "0",
                  ry: "0",
                  transform: "translate(194-4.00006)",
                  fill: "url(#eWMaDkTemOR106-fill)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "98.9638",
                  height: "13.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.5 130.732)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "98.9638",
                  height: "13.1884",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.5 149.435)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 109.110969 146.569513)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "10.7419",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 128.673999 146.570383)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M125.783,150.302c-.293-.004-.586-.06-.879-.167s-.561-.287-.803-.541c-.242-.256-.436-.601-.582-1.036-.147-.437-.22-.986-.22-1.646c0-.633.059-1.193.178-1.681.118-.491.291-.904.516-1.239.226-.337.498-.593.816-.767.321-.175.683-.262,1.085-.262.4,0,.756.08,1.068.241.313.158.569.379.767.663.198.283.325.61.384.98h-.851c-.08-.321-.233-.587-.461-.799s-.53-.317-.907-.317c-.553,0-.989.24-1.308.722-.316.481-.475,1.157-.478,2.026h.056c.13-.197.285-.366.464-.505.181-.142.381-.252.6-.328.219-.077.45-.115.694-.115.409,0,.784.102,1.123.306.34.203.612.483.816.841.205.356.307.764.307,1.224c0,.442-.098.847-.296,1.214-.198.365-.476.656-.834.872-.356.214-.774.319-1.255.314Zm0-.767c.293,0,.555-.073.788-.22.235-.146.42-.343.554-.589.138-.247.206-.521.206-.824c0-.295-.066-.563-.199-.805-.13-.244-.31-.439-.54-.583-.228-.144-.489-.216-.782-.216-.22,0-.426.044-.617.132-.191.086-.358.205-.502.356-.142.151-.254.325-.335.52-.081.193-.122.396-.122.61c0,.284.066.549.199.796.135.246.318.445.551.596.235.151.501.227.799.227Zm6.045.767c-.479,0-.902-.085-1.269-.254-.365-.172-.65-.408-.855-.708-.205-.303-.306-.647-.303-1.033-.003-.302.057-.581.177-.837.121-.258.287-.473.496-.645.211-.175.447-.285.708-.332v-.042c-.342-.088-.614-.28-.816-.575-.203-.298-.303-.636-.3-1.015-.003-.363.089-.687.275-.973s.442-.512.768-.677c.328-.165.701-.248,1.119-.248.414,0,.784.083,1.11.248.325.165.581.391.767.677.188.286.284.61.286.973-.002.379-.106.717-.31,1.015-.203.295-.471.487-.806.575v.042c.258.047.49.157.697.332.207.172.372.387.496.645.123.256.186.535.188.837-.002.386-.107.73-.314,1.033-.205.3-.489.536-.854.708-.363.169-.783.254-1.26.254Zm0-.767c.324,0,.603-.052.837-.157.235-.105.417-.252.545-.443s.193-.414.195-.67c-.002-.27-.072-.508-.209-.715-.138-.207-.325-.37-.562-.488-.235-.119-.503-.178-.806-.178-.304,0-.576.059-.816.178-.237.118-.424.281-.561.488-.135.207-.202.445-.199.715-.003.256.059.479.185.67.127.191.31.338.547.443s.519.157.844.157Zm0-3.391c.256,0,.483-.051.681-.153.199-.102.356-.245.47-.429s.172-.399.175-.645c-.003-.242-.059-.453-.171-.632-.112-.181-.266-.321-.464-.418-.198-.1-.428-.15-.691-.15-.267,0-.501.05-.701.15-.2.097-.354.237-.464.418-.109.179-.162.39-.16.632-.002.246.052.461.164.645.114.184.271.327.471.429s.43.153.69.153Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "27.666",
                  height: "27.666",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 109.110969 146.569513)",
                  fill: "none",
                  stroke: "#0c9bed",
                  strokeWidth: "1.09139",
                  strokeDasharray: "2.18,2.18"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M305.66,126l-2.38-9.772h1.246l1.05,4.704.812,3.654h.028l.91-3.654l1.232-4.704h1.344l1.19,4.704.91,3.64h.042l.84-3.64l1.106-4.704h1.204L312.688,126h-1.302l-1.274-4.872-.896-3.584h-.028l-.924,3.584L306.962,126h-1.302Zm13.51.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588Zm10.964,6.622c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462Zm7.001,0c-.485,0-.929-.089-1.33-.266s-.747-.429-1.036-.756c-.28-.336-.499-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554s.378-.863.658-1.19c.289-.336.635-.593,1.036-.77s.845-.266,1.33-.266.924.089,1.316.266c.401.177.747.434,1.036.77.289.327.513.723.672,1.19s.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.289.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.607,0,1.101-.187,1.484-.56s.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708s-.877-.56-1.484-.56-1.101.187-1.484.56-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708s.877.56,1.484.56Zm9.556-.35h-.056c-.075.168-.168.336-.28.504-.103.159-.234.303-.392.434-.159.121-.35.219-.574.294s-.486.112-.784.112c-.747,0-1.34-.238-1.778-.714-.439-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.55,1.946,1.652,1.946.224,0,.438-.028.644-.084.214-.056.401-.14.56-.252.168-.112.298-.252.392-.42.102-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM350.196,126v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm9.553,0c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm9.309.168c-.504,0-.957-.089-1.358-.266-.402-.177-.742-.429-1.022-.756-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.62-.579,1.022-.756.401-.177.854-.266,1.358-.266.718,0,1.292.159,1.722.476.438.308.765.714.98,1.218l-.938.476c-.131-.373-.346-.663-.644-.868-.299-.205-.672-.308-1.12-.308-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.558-.42,1.96-1.26l.812.546c-.234.523-.584.938-1.05,1.246-.458.308-1.032.462-1.722.462Zm7.001,0c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm5.104.826v-7.224h1.12v1.33h.07c.13-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.607,0-1.083.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm5.14,0v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.789.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM400.249,126c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm7.875,0c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.044.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm3.872-8.918c-.242,0-.42-.056-.532-.168-.102-.121-.154-.275-.154-.462v-.182c0-.187.052-.336.154-.448.112-.121.29-.182.532-.182.243,0,.416.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.102.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm6.23,7.392c-.485,0-.928-.089-1.33-.266-.401-.177-.746-.429-1.036-.756-.28-.336-.499-.733-.658-1.19-.158-.467-.238-.989-.238-1.568c0-.569.08-1.087.238-1.554.159-.467.378-.863.658-1.19.29-.336.635-.593,1.036-.77.402-.177.845-.266,1.33-.266.486,0,.924.089,1.316.266.402.177.747.434,1.036.77.29.327.514.723.672,1.19.159.467.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.158.457-.382.854-.672,1.19-.289.327-.634.579-1.036.756-.392.177-.83.266-1.316.266Zm0-.994c.607,0,1.102-.187,1.484-.56.383-.373.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708-.382-.373-.877-.56-1.484-.56-.606,0-1.101.187-1.484.56-.382.373-.574.943-.574,1.708v1.036c0,.765.192,1.335.574,1.708.383.373.878.56,1.484.56Zm5.104.826v-7.224h1.12v1.176h.056c.178-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm11.658-6.244h-1.176v-.98h1.176v-1.456c0-.504.131-.91.392-1.218s.658-.462,1.19-.462h1.092v.98h-1.554v2.156h1.554v.98h-1.554v6.244h-1.12v-6.244Zm6.822,6.412c-.485,0-.928-.089-1.33-.266-.401-.177-.746-.429-1.036-.756-.28-.336-.499-.733-.658-1.19-.158-.467-.238-.989-.238-1.568c0-.569.08-1.087.238-1.554.159-.467.378-.863.658-1.19.29-.336.635-.593,1.036-.77.402-.177.845-.266,1.33-.266.486,0,.924.089,1.316.266.402.177.747.434,1.036.77.29.327.514.723.672,1.19.159.467.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.158.457-.382.854-.672,1.19-.289.327-.634.579-1.036.756-.392.177-.83.266-1.316.266Zm0-.994c.607,0,1.102-.187,1.484-.56.383-.373.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708-.382-.373-.877-.56-1.484-.56-.606,0-1.101.187-1.484.56-.382.373-.574.943-.574,1.708v1.036c0,.765.192,1.335.574,1.708.383.373.878.56,1.484.56Zm5.104.826v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12ZM306.906,146.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM317.124,146c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm8.136.952c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462Zm4.353-10.528h1.12v4.312h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12v-10.36Zm13.996,10.528c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm9.556-.35h-.056c-.075.168-.168.336-.28.504-.103.159-.234.303-.392.434-.159.121-.35.219-.574.294s-.486.112-.784.112c-.747,0-1.34-.238-1.778-.714-.439-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.55,1.946,1.652,1.946.224,0,.438-.028.644-.084.214-.056.401-.14.56-.252.168-.112.298-.252.392-.42.102-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM353.45,146v-7.224h1.12v1.33h.07c.13-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.607,0-1.083.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm13.069-1.176h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm10.613.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.045.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.242,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.562,0c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.618.952c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm7.369,0c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM405.987,146c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm7.181-8.918c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182s.415.061.518.182c.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12ZM306.36,166.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm7.368,0c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM319.886,166c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm5.34.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm7.656,6.622c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462Zm5.949-.168c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.973.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm9.588,5.278h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm13.922.84c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm5.448.784v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.788.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM386.686,166c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm10.353.784c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.988.168c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm14.502,1.624c0,.747-.294,1.293-.882,1.638-.578.355-1.451.532-2.618.532-1.129,0-1.941-.154-2.436-.462-.494-.308-.742-.747-.742-1.316c0-.392.103-.7.308-.924.206-.215.486-.373.84-.476v-.154c-.429-.205-.644-.541-.644-1.008c0-.364.117-.639.35-.826.234-.196.532-.341.896-.434v-.056c-.429-.205-.765-.499-1.008-.882-.233-.383-.35-.826-.35-1.33c0-.364.066-.7.196-1.008.131-.308.313-.569.546-.784.243-.224.528-.397.854-.518.336-.121.71-.182,1.12-.182.514,0,.971.093,1.372.28v-.126c0-.28.066-.509.196-.686.131-.187.346-.28.644-.28h1.078v.98h-1.372v.462c.262.224.462.495.602.812.15.308.224.658.224,1.05c0,.364-.065.7-.196,1.008-.13.308-.317.574-.56.798-.233.215-.518.383-.854.504s-.709.182-1.12.182c-.233,0-.466-.023-.7-.07-.242.065-.462.163-.658.294-.196.121-.294.294-.294.518c0,.215.103.359.308.434.206.075.472.112.798.112h1.54c.896,0,1.545.173,1.946.518.411.336.616.803.616,1.4Zm-1.05.084c0-.289-.112-.523-.336-.7-.214-.168-.602-.252-1.162-.252h-2.408c-.448.205-.672.532-.672.98c0,.317.117.588.35.812.243.224.649.336,1.218.336h1.036c.626,0,1.111-.098,1.456-.294.346-.196.518-.49.518-.882Zm-2.506-4.186c.476,0,.854-.112,1.134-.336.28-.233.42-.588.42-1.064v-.392c0-.476-.14-.826-.42-1.05-.28-.233-.658-.35-1.134-.35s-.854.117-1.134.35c-.28.224-.42.574-.42,1.05v.392c0,.476.14.831.42,1.064.28.224.658.336,1.134.336Zm5.423-5.614c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182.242,0,.415.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.276.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224ZM420.712,166l-2.534-7.224h1.12l1.26,3.584.784,2.464h.07l.784-2.464l1.288-3.584h1.078L422.014,166h-1.302Zm7.901.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm12.728-.77h1.106l-3.234,8.904c-.084.215-.168.392-.252.532-.084.149-.186.266-.308.35-.121.084-.275.145-.462.182-.177.037-.396.056-.658.056h-.574v-.98h1.134l.546-1.54-2.702-7.504h1.12l1.736,4.914.336,1.176h.07l.392-1.176l1.75-4.914Zm5.196,7.392c-.485,0-.928-.089-1.33-.266-.401-.177-.746-.429-1.036-.756-.28-.336-.499-.733-.658-1.19-.158-.467-.238-.989-.238-1.568c0-.569.08-1.087.238-1.554.159-.467.378-.863.658-1.19.29-.336.635-.593,1.036-.77.402-.177.845-.266,1.33-.266.486,0,.924.089,1.316.266.402.177.747.434,1.036.77.29.327.514.723.672,1.19.159.467.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.158.457-.382.854-.672,1.19-.289.327-.634.579-1.036.756-.392.177-.83.266-1.316.266Zm0-.994c.607,0,1.102-.187,1.484-.56.383-.373.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708-.382-.373-.877-.56-1.484-.56-.606,0-1.101.187-1.484.56-.382.373-.574.943-.574,1.708v1.036c0,.765.192,1.335.574,1.708.383.373.878.56,1.484.56Zm9.556-.35h-.056c-.074.168-.168.336-.28.504-.102.159-.233.303-.392.434-.158.121-.35.219-.574.294s-.485.112-.784.112c-.746,0-1.339-.238-1.778-.714-.438-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.551,1.946,1.652,1.946.224,0,.439-.028.644-.084.215-.056.402-.14.56-.252.168-.112.299-.252.392-.42.103-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM468.157,166c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294ZM304.19,175.64h1.12v4.312h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12v-10.36Zm8.517,1.442c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182s.415.061.518.182c.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm9.553,0c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.865-7.224h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L339.031,186h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L334.355,186h-1.358l-1.932-7.224Zm11.502-3.136h1.12v4.312h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12v-10.36ZM355.774,186c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.044.784c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm11.241-1.176h-.056c-.438.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.676-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.13-.467-.196-.989-.196-1.568s.066-1.101.196-1.568c.14-.467.336-.863.588-1.19.262-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.934.112,1.288.336.364.215.64.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.234-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.368-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.634,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.864.588,1.498.588Zm10.613.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm7.045.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.562,0c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.619.952c-.672,0-1.237-.126-1.694-.378-.448-.261-.836-.607-1.162-1.036l.798-.644c.28.355.592.63.938.826.345.187.746.28,1.204.28.476,0,.844-.103,1.106-.308.27-.205.406-.495.406-.868c0-.28-.094-.518-.28-.714-.178-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.528-.233-.742-.392-.206-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.13-.271.308-.495.532-.672.233-.177.508-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.696-.28-1.162-.28-.467,0-.822.103-1.064.308-.234.196-.35.467-.35.812c0,.355.116.611.35.77.242.159.588.275,1.036.35l.56.084c.802.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.13.602-1.96.602Zm7.368,0c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM410.307,186c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.483.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.836-.607-1.162-1.036l.798-.644c.28.355.592.63.938.826.345.187.746.28,1.204.28.476,0,.844-.103,1.106-.308.27-.205.406-.495.406-.868c0-.28-.094-.518-.28-.714-.178-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.528-.233-.742-.392-.206-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.13-.271.308-.495.532-.672.233-.177.508-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.696-.28-1.162-.28-.467,0-.822.103-1.064.308-.234.196-.35.467-.35.812c0,.355.116.611.35.77.242.159.588.275,1.036.35l.56.084c.802.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.13.602-1.96.602Zm7.205-7.392h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L430.961,186h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L426.285,186h-1.358l-1.932-7.224Zm11.502-3.136h1.12v4.312h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12v-10.36Zm10.687,10.528c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm9.556-.35h-.056c-.075.168-.168.336-.28.504-.103.159-.234.303-.392.434-.159.121-.35.219-.574.294s-.486.112-.784.112c-.747,0-1.34-.238-1.778-.714-.439-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.55,1.946,1.652,1.946.224,0,.438-.028.644-.084.214-.056.401-.14.56-.252.168-.112.298-.252.392-.42.102-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM459.435,186c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm7.244-1.176h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588ZM304.19,195.64h1.12v4.312h.056c.187-.457.457-.793.812-1.008.364-.224.798-.336,1.302-.336.448,0,.854.089,1.218.266s.672.429.924.756c.261.327.457.723.588,1.19.14.467.21.989.21,1.568s-.07,1.101-.21,1.568c-.131.467-.327.863-.588,1.19-.252.327-.56.579-.924.756s-.77.266-1.218.266c-.98,0-1.685-.448-2.114-1.344h-.056v1.176h-1.12v-10.36Zm2.982,9.52c.635,0,1.134-.196,1.498-.588.364-.401.546-.924.546-1.568v-1.232c0-.644-.182-1.162-.546-1.554-.364-.401-.863-.602-1.498-.602-.252,0-.495.037-.728.112-.224.065-.42.159-.588.28s-.303.271-.406.448c-.093.168-.14.35-.14.546v2.688c0,.233.047.443.14.63.103.177.238.331.406.462.168.121.364.215.588.28.233.065.476.098.728.098Zm7.855,1.008c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm8.836-2.464c-.242,0-.42-.056-.532-.168-.102-.121-.154-.275-.154-.462v-.182c0-.187.052-.336.154-.448.112-.121.29-.182.532-.182.243,0,.416.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.102.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.178-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm9.553,0c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.974.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM347.297,206v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.789.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588Zm7.137,6.622c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm6.153-.168c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm3.872-8.918c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182s.415.061.518.182c.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm14.047.798c0,.747-.294,1.293-.882,1.638-.579.355-1.451.532-2.618.532-1.129,0-1.941-.154-2.436-.462s-.742-.747-.742-1.316c0-.392.103-.7.308-.924.205-.215.485-.373.84-.476v-.154c-.429-.205-.644-.541-.644-1.008c0-.364.117-.639.35-.826.233-.196.532-.341.896-.434v-.056c-.429-.205-.765-.499-1.008-.882-.233-.383-.35-.826-.35-1.33c0-.364.065-.7.196-1.008s.313-.569.546-.784c.243-.224.527-.397.854-.518.336-.121.709-.182,1.12-.182.513,0,.971.093,1.372.28v-.126c0-.28.065-.509.196-.686.131-.187.345-.28.644-.28h1.078v.98h-1.372v.462c.261.224.462.495.602.812.149.308.224.658.224,1.05c0,.364-.065.7-.196,1.008s-.317.574-.56.798c-.233.215-.518.383-.854.504s-.709.182-1.12.182c-.233,0-.467-.023-.7-.07-.243.065-.462.163-.658.294-.196.121-.294.294-.294.518c0,.215.103.359.308.434s.471.112.798.112h1.54c.896,0,1.545.173,1.946.518.411.336.616.803.616,1.4Zm-1.05.084c0-.289-.112-.523-.336-.7-.215-.168-.602-.252-1.162-.252h-2.408c-.448.205-.672.532-.672.98c0,.317.117.588.35.812.243.224.649.336,1.218.336h1.036c.625,0,1.111-.098,1.456-.294s.518-.49.518-.882Zm-2.506-4.186c.476,0,.854-.112,1.134-.336.28-.233.42-.588.42-1.064v-.392c0-.476-.14-.826-.42-1.05-.28-.233-.658-.35-1.134-.35s-.854.117-1.134.35c-.28.224-.42.574-.42,1.05v.392c0,.476.14.831.42,1.064.28.224.658.336,1.134.336ZM395.446,206c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.988.168c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm13.662.826c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm5.449.784v-7.224h1.12v1.176h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12Zm13.207,0c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm6.638.784c-.392,0-.69-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm6.94-7.224h1.106l-3.234,8.904c-.084.215-.168.392-.252.532-.084.149-.187.266-.308.35s-.275.145-.462.182c-.177.037-.397.056-.658.056h-.574v-.98h1.134l.546-1.54-2.702-7.504h1.12l1.736,4.914.336,1.176h.07l.392-1.176l1.75-4.914Zm4.65,7.392c-.672,0-1.237-.126-1.694-.378-.448-.261-.836-.607-1.162-1.036l.798-.644c.28.355.592.63.938.826.345.187.746.28,1.204.28.476,0,.844-.103,1.106-.308.27-.205.406-.495.406-.868c0-.28-.094-.518-.28-.714-.178-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.528-.233-.742-.392-.206-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.13-.271.308-.495.532-.672.233-.177.508-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.696-.28-1.162-.28-.467,0-.822.103-1.064.308-.234.196-.35.467-.35.812c0,.355.116.611.35.77.242.159.588.275,1.036.35l.56.084c.802.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.13.602-1.96.602Zm7.368,0c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M310.06,101.24c-.92,0-1.753-.147-2.5-.44-.733-.307-1.367-.76-1.9-1.36-.52-.6-.92-1.34-1.2-2.22-.28-.8933-.42-1.9267-.42-3.1s.14-2.2133.42-3.12c.28-.92.68-1.6867,1.2-2.3.533-.6267,1.167-1.1,1.9-1.42.747-.32,1.58-.48,2.5-.48c1.253,0,2.293.2667,3.12.8s1.487,1.34,1.98,2.42l-2.26,1.2c-.2-.6267-.527-1.1267-.98-1.5-.453-.3867-1.073-.58-1.86-.58-.987,0-1.773.3333-2.36,1-.573.6667-.86,1.6-.86,2.8v2.2c0,1.2133.287,2.1467.86,2.8.587.64,1.373.96,2.36.96.787,0,1.427-.2133,1.92-.64.507-.4267.873-.9533,1.1-1.58l2.14,1.26c-.507,1.04-1.18,1.8533-2.02,2.44-.84.573-1.887.86-3.14.86Zm11.392,0c-.747,0-1.42-.127-2.02-.38-.587-.253-1.093-.62-1.52-1.1-.413-.48-.733-1.0533-.96-1.72-.227-.68-.34-1.44-.34-2.28s.113-1.5933.34-2.26.547-1.2333.96-1.7c.427-.48.933-.8467,1.52-1.1.6-.2533,1.273-.38,2.02-.38s1.42.1267,2.02.38s1.107.62,1.52,1.1c.427.4667.753,1.0333.98,1.7s.34,1.42.34,2.26-.113,1.6-.34,2.28c-.227.6667-.553,1.24-.98,1.72-.413.48-.92.847-1.52,1.1s-1.273.38-2.02.38Zm0-2.06c.68,0,1.213-.2067,1.6-.62s.58-1.02.58-1.82v-1.94c0-.7867-.193-1.3867-.58-1.8s-.92-.62-1.6-.62c-.667,0-1.193.2067-1.58.62s-.58,1.0133-.58,1.8v1.94c0,.8.193,1.4067.58,1.82s.913.62,1.58.62Zm7.13,1.82v-10.44h2.56v2.16h.1c.066-.28.166-.5467.3-.8.146-.2667.333-.5.56-.7.226-.2.493-.36.8-.48.32-.12.686-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.1267-1.96.38s-.66.6667-.66,1.24v6.4h-2.56Zm7.851,0v-10.44h2.56v2.16h.1c.067-.28.167-.5467.3-.8.147-.2667.333-.5.56-.7s.493-.36.8-.48c.32-.12.687-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.1267-1.96.38s-.66.6667-.66,1.24v6.4h-2.56Zm11.974.24c-.773,0-1.467-.127-2.08-.38-.6-.267-1.113-.633-1.54-1.1-.413-.48-.733-1.0533-.96-1.72-.227-.68-.34-1.44-.34-2.28c0-.8267.107-1.5733.32-2.24.227-.6667.547-1.2333.96-1.7.413-.48.92-.8467,1.52-1.1.6-.2667,1.28-.4,2.04-.4.813,0,1.52.14,2.12.42s1.093.66,1.48,1.14.673,1.04.86,1.68c.2.6267.3,1.3.3,2.02v.84h-6.94v.26c0,.76.213,1.3733.64,1.84.427.4533,1.06.68,1.9.68.64,0,1.16-.1333,1.56-.4.413-.2667.78-.6067,1.1-1.02l1.38,1.54c-.427.6-1.013,1.073-1.76,1.42-.733.333-1.587.5-2.56.5Zm-.04-9c-.68,0-1.22.2267-1.62.68s-.6,1.04-.6,1.76v.16h4.28v-.18c0-.72-.18-1.3-.54-1.74-.347-.4533-.853-.68-1.52-.68Zm9.532,8.76c-.88,0-1.526-.22-1.94-.66-.413-.44-.62-1.06-.62-1.86v-12.28h2.56v12.76h1.38v2.04h-1.38Zm10.999,0c-.56,0-1.006-.16-1.34-.48-.32-.333-.52-.7733-.6-1.32h-.12c-.173.68-.526,1.193-1.06,1.54-.533.333-1.193.5-1.98.5-1.066,0-1.886-.28-2.46-.84-.573-.56-.86-1.3067-.86-2.24c0-1.08.387-1.88,1.16-2.4.774-.5333,1.874-.8,3.3-.8h1.78v-.76c0-.5867-.153-1.04-.46-1.36-.306-.32-.8-.48-1.48-.48-.6,0-1.086.1333-1.46.4-.36.2533-.666.56-.92.92l-1.52-1.36c.387-.6.9-1.08,1.54-1.44.64-.3733,1.487-.56,2.54-.56c1.414,0,2.487.32,3.22.96.734.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.574,0,1.06-.1267,1.46-.38s.6-.6267.6-1.12v-1.38h-1.64c-1.333,0-2,.4267-2,1.28v.34c0,.4267.134.7467.4.96.28.2.674.3,1.18.3ZM375.572,101c-.88,0-1.553-.227-2.02-.68-.453-.4667-.68-1.1267-.68-1.98v-5.74h-1.54v-2.04h.8c.387,0,.647-.0867.78-.26.147-.1867.22-.46.22-.82v-1.78h2.3v2.86h2.14v2.04h-2.14v6.36h1.98v2.04h-1.84Zm5.501-11.96c-.534,0-.921-.12-1.161-.36-.226-.24-.34-.5467-.34-.92v-.4c0-.3733.114-.68.34-.92.24-.24.627-.36,1.161-.36.519,0,.899.12,1.14.36.24.24.36.5467.36.92v.4c0,.3733-.12.68-.361.92-.24.24-.62.36-1.139.36Zm-1.281,1.52h2.56v10.44h-2.56v-10.44Zm9.668,10.68c-.747,0-1.42-.127-2.02-.38-.587-.253-1.093-.62-1.52-1.1-.413-.48-.733-1.0533-.96-1.72-.227-.68-.34-1.44-.34-2.28s.113-1.5933.34-2.26.547-1.2333.96-1.7c.427-.48.933-.8467,1.52-1.1.6-.2533,1.273-.38,2.02-.38s1.42.1267,2.02.38s1.107.62,1.52,1.1c.427.4667.753,1.0333.98,1.7s.34,1.42.34,2.26-.113,1.6-.34,2.28c-.227.6667-.553,1.24-.98,1.72-.413.48-.92.847-1.52,1.1s-1.273.38-2.02.38Zm0-2.06c.68,0,1.213-.2067,1.6-.62s.58-1.02.58-1.82v-1.94c0-.7867-.193-1.3867-.58-1.8s-.92-.62-1.6-.62c-.667,0-1.193.2067-1.58.62s-.58,1.0133-.58,1.8v1.94c0,.8.193,1.4067.58,1.82s.913.62,1.58.62Zm7.129,1.82v-10.44h2.56v1.74h.1c.214-.56.547-1.0267,1-1.4.467-.3867,1.107-.58,1.92-.58c1.08,0,1.907.3533,2.48,1.06.574.7067.86,1.7133.86,3.02v6.6h-2.56v-6.34c0-.7467-.133-1.3067-.4-1.68-.266-.3733-.706-.56-1.32-.56-.266,0-.526.04-.78.12-.24.0667-.46.1733-.66.32-.186.1333-.34.3067-.46.52-.12.2-.18.44-.18.72v6.9h-2.56Zm16.485,0v-10.44h2.56v1.74h.1c.2-.5467.52-1.0133.96-1.4s1.053-.58,1.84-.58c.72,0,1.34.1733,1.86.52s.906.8733,1.16,1.58h.04c.186-.5867.553-1.08,1.1-1.48.56-.4133,1.26-.62,2.1-.62c1.026,0,1.813.3533,2.36,1.06.56.7067.84,1.7133.84,3.02v6.6h-2.56v-6.34c0-1.4933-.56-2.24-1.68-2.24-.254,0-.5.04-.74.12-.227.0667-.434.1733-.62.32-.174.1333-.314.3067-.42.52-.107.2-.16.44-.16.72v6.9h-2.56v-6.34c0-1.4933-.56-2.24-1.68-2.24-.24,0-.48.04-.72.12-.227.0667-.434.1733-.62.32-.174.1333-.32.3067-.44.52-.107.2-.16.44-.16.72v6.9h-2.56Zm25.434,0c-.56,0-1.007-.16-1.34-.48-.32-.333-.52-.7733-.6-1.32h-.12c-.174.68-.527,1.193-1.06,1.54-.534.333-1.194.5-1.98.5-1.067,0-1.887-.28-2.46-.84-.574-.56-.86-1.3067-.86-2.24c0-1.08.386-1.88,1.16-2.4.773-.5333,1.873-.8,3.3-.8h1.78v-.76c0-.5867-.154-1.04-.46-1.36-.307-.32-.8-.48-1.48-.48-.6,0-1.087.1333-1.46.4-.36.2533-.667.56-.92.92l-1.52-1.36c.386-.6.9-1.08,1.54-1.44.64-.3733,1.486-.56,2.54-.56c1.413,0,2.486.32,3.22.96.733.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.573,0,1.06-.1267,1.46-.38s.6-.6267.6-1.12v-1.38h-1.64c-1.334,0-2,.4267-2,1.28v.34c0,.4267.133.7467.4.96.28.2.673.3,1.18.3ZM445.181,101c-.88,0-1.553-.227-2.02-.68-.453-.4667-.68-1.1267-.68-1.98v-5.74h-1.54v-2.04h.8c.387,0,.647-.0867.78-.26.147-.1867.22-.46.22-.82v-1.78h2.3v2.86h2.14v2.04h-2.14v6.36h1.98v2.04h-1.84Zm4.221,0v-10.44h2.56v2.16h.1c.067-.28.167-.5467.3-.8.147-.2667.333-.5.56-.7s.493-.36.8-.48c.32-.12.687-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.1267-1.96.38s-.66.6667-.66,1.24v6.4h-2.56Zm9.131-11.96c-.533,0-.92-.12-1.16-.36-.226-.24-.34-.5467-.34-.92v-.4c0-.3733.114-.68.34-.92.24-.24.627-.36,1.16-.36.52,0,.9.12,1.14.36s.36.5467.36.92v.4c0,.3733-.12.68-.36.92s-.62.36-1.14.36Zm-1.28,1.52h2.56v10.44h-2.56v-10.44ZM461.681,101l3.56-5.3-3.48-5.14h2.92l2.16,3.46h.08l2.14-3.46h2.72l-3.54,5.18l3.56,5.26h-2.92l-2.2-3.6h-.08l-2.2,3.6h-2.72Z",
                  fill: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M314.5,56h-46.5v54.5",
                  fill: "none",
                  stroke: "url(#eWMaDkTemOR115-stroke)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(256.5 277.5)", fill: "#fff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(267.5 277.5)", fill: "#0c9bed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "7",
                  height: "7",
                  rx: "3.5",
                  ry: "3.5",
                  transform: "translate(242 274)",
                  fill: "#fff"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { id: "eWMaDkTemOR119", opacity: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 92.4052)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 63.4742)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "303.187",
                  height: "21.6562",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 266.384)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 34.5432)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 237.06)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "303.187",
                  height: "23.2031",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 4.96204)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 208.129)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "252.398",
                  height: "21.9477",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30 179.198)",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.635971 176.538063)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "11.1654",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 213.657025 175.889698)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M204.442,182.137v-.971l3.647-3.993c.428-.467.781-.874,1.058-1.219.277-.349.482-.676.615-.982.137-.309.205-.633.205-.971c0-.389-.093-.725-.28-1.009-.184-.285-.436-.504-.756-.659-.32-.154-.68-.232-1.079-.232-.424,0-.795.089-1.112.265-.312.172-.555.415-.728.728-.169.313-.254.68-.254,1.101h-1.273c0-.648.149-1.216.448-1.705.298-.489.705-.871,1.219-1.144.518-.273,1.099-.41,1.743-.41.648,0,1.221.137,1.721.41s.892.642,1.177,1.106c.284.464.426.98.426,1.549c0,.406-.074.804-.221,1.192-.144.385-.396.815-.756,1.29-.356.471-.85,1.046-1.484,1.726l-2.482,2.655v.086h5.137v1.187h-6.971Zm12.869.151c-.454-.007-.907-.093-1.36-.259-.453-.165-.867-.444-1.241-.836-.374-.396-.675-.93-.901-1.602-.227-.677-.34-1.526-.34-2.547c0-.979.092-1.846.275-2.601.184-.759.45-1.397.799-1.915.349-.522.769-.918,1.262-1.187.497-.27,1.056-.405,1.678-.405.619,0,1.169.124,1.651.372.486.245.882.587,1.187,1.025.306.439.504.945.594,1.517h-1.317c-.122-.497-.359-.909-.712-1.236-.352-.327-.82-.491-1.403-.491-.856,0-1.53.372-2.023,1.117-.489.744-.736,1.789-.739,3.135h.086c.201-.306.441-.567.718-.783.28-.219.59-.388.928-.507s.696-.178,1.073-.178c.634,0,1.213.158,1.738.475.525.313.946.746,1.262,1.3.317.551.475,1.182.475,1.894c0,.684-.153,1.31-.458,1.878-.306.565-.736,1.014-1.29,1.349-.55.331-1.198.493-1.942.485Zm0-1.187c.453,0,.859-.113,1.219-.34.363-.226.649-.53.858-.911.212-.382.318-.806.318-1.274c0-.457-.102-.872-.307-1.246-.202-.378-.48-.678-.837-.901-.352-.223-.755-.335-1.208-.335-.342,0-.66.069-.955.205-.295.133-.554.317-.777.551-.22.233-.392.501-.518.804-.126.298-.189.613-.189.944c0,.439.102.849.307,1.23.209.381.493.689.853.923.363.233.775.35,1.236.35Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.635971 176.538063)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.564954 207.464048)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "7.19325",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 243.567982 206.182813)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M239.355,201.914v11.05h-1.338v-9.647h-.065l-2.698,1.791v-1.36l2.763-1.834h1.338Zm3.178,11.05v-.971L246.18,208c.428-.467.781-.874,1.058-1.219.277-.349.482-.676.615-.982.137-.31.205-.633.205-.971c0-.389-.094-.725-.281-1.009-.183-.285-.435-.504-.755-.659-.32-.154-.68-.232-1.079-.232-.425,0-.795.088-1.112.265-.313.172-.555.415-.728.728-.169.313-.254.68-.254,1.101h-1.273c0-.648.149-1.216.448-1.705.298-.489.705-.871,1.219-1.144.518-.273,1.099-.41,1.743-.41.647,0,1.221.137,1.721.41s.892.642,1.176,1.106c.285.464.427.98.427,1.549c0,.406-.074.804-.222,1.192-.143.385-.395.815-.755,1.29-.356.471-.851,1.046-1.484,1.726l-2.482,2.655v.086h5.137v1.187h-6.971Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.564954 207.464048)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.493037 238.391448)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.371979 237.644489)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M272.352,244.042c-.633,0-1.203-.126-1.711-.378-.507-.252-.913-.597-1.219-1.036s-.473-.939-.502-1.5h1.295c.05.5.277.914.68,1.241.406.324.892.486,1.457.486.453,0,.856-.106,1.208-.318.356-.213.635-.504.837-.875.205-.374.307-.796.307-1.268c0-.482-.106-.911-.318-1.289-.209-.381-.496-.682-.863-.901-.367-.22-.786-.331-1.258-.335-.338-.003-.685.049-1.041.157-.356.104-.649.239-.879.404l-1.252-.151.669-5.438h5.741v1.187h-4.619l-.388,3.259h.064c.227-.18.511-.33.853-.448.342-.119.698-.178,1.068-.178.677,0,1.279.162,1.808.485.532.32.949.759,1.252,1.317.305.557.458,1.194.458,1.91c0,.705-.158,1.334-.475,1.888-.313.551-.744.986-1.295,1.306-.55.317-1.176.475-1.877.475Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.493037 238.391448)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858808 267.83691)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 303.73805 267.089951)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M302.718,273.488c-.634,0-1.204-.126-1.711-.377-.507-.252-.914-.598-1.219-1.036-.306-.439-.473-.939-.502-1.5h1.295c.05.5.277.913.68,1.241.406.323.892.485,1.457.485.453,0,.856-.106,1.208-.318.356-.212.635-.504.836-.874.206-.374.308-.797.308-1.268c0-.482-.106-.912-.318-1.29-.209-.381-.497-.681-.864-.901-.367-.219-.786-.331-1.257-.334-.338-.004-.685.048-1.041.156-.356.104-.649.239-.88.405l-1.251-.151.669-5.439h5.741v1.187h-4.619l-.389,3.259h.065c.227-.18.511-.329.853-.448.341-.119.698-.178,1.068-.178.676,0,1.279.162,1.808.486.532.32.949.759,1.251,1.316.306.558.459,1.194.459,1.91c0,.705-.158,1.335-.475,1.889-.313.55-.744.985-1.295,1.305-.55.317-1.176.475-1.877.475Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858808 267.83691)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250208 298.248159)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.129042 297.500492)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250208 298.248159)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858959 26.46896)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 303.737959 25.72186)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M302.718,32.1201c-.634,0-1.204-.1259-1.711-.3777s-.914-.5971-1.219-1.036c-.306-.4388-.473-.9388-.502-1.5h1.295c.05.5.277.9137.68,1.241.406.3238.892.4856,1.457.4856.453,0,.856-.1061,1.208-.3183.356-.2123.635-.5036.836-.8741.206-.3741.308-.7968.308-1.268c0-.482-.106-.9119-.318-1.2896-.209-.3813-.497-.6816-.864-.901s-.786-.331-1.257-.3346c-.338-.0036-.685.0486-1.041.1565-.356.1043-.649.2392-.88.4047l-1.251-.1511.669-5.4388h5.741v1.187h-4.619l-.389,3.259h.065c.227-.1799.511-.3291.853-.4479.341-.1187.698-.178,1.068-.178.676,0,1.279.1619,1.808.4856.532.3201.949.759,1.251,1.3165.306.5576.459,1.1943.459,1.9101c0,.705-.158,1.3345-.475,1.8885-.313.5504-.744.9856-1.295,1.3058-.55.3165-1.176.4748-1.877.4748Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858959 26.46896)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250005 56.879856)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.129005 56.132755)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M332.108,62.5306c-.633,0-1.203-.1259-1.71-.3777s-.914-.5971-1.22-1.036c-.305-.4388-.473-.9388-.501-1.5h1.294c.051.5.277.9137.68,1.241.407.3238.892.4856,1.457.4856.453,0,.856-.1061,1.209-.3183.356-.2122.635-.5036.836-.8741.205-.3741.308-.7968.308-1.268c0-.482-.106-.9119-.319-1.2895-.208-.3813-.496-.6817-.863-.9011-.367-.2195-.786-.331-1.257-.3346-.338-.0036-.685.0486-1.042.1565-.356.1043-.649.2392-.879.4047l-1.252-.1511.669-5.4388h5.741v1.187h-4.618l-.389,3.259h.065c.226-.1798.511-.3291.852-.4478.342-.1187.698-.1781,1.069-.1781.676,0,1.278.1619,1.807.4856.533.3202.95.759,1.252,1.3166.306.5575.459,1.1942.459,1.91c0,.7051-.159,1.3346-.475,1.8885-.313.5504-.745.9856-1.295,1.3058-.551.3165-1.176.4748-1.878.4748Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250005 56.879856)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.249995-4.995454)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.129002-5.742548)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M332.108,0.655473c-.633,0-1.203-.125899-1.71-.377698s-.914-.597121-1.22-1.035969c-.305-.438846-.473-.938846-.501-1.499996h1.294c.051.5.277.91367.68,1.241.407.323744.892.485614,1.457.485614.453,0,.856-.106115,1.209-.318345.356-.212229.635-.503599.836-.874099.205-.3741.308-.79676.308-1.26798c0-.48202-.106-.91187-.319-1.28957-.208-.38129-.496-.68165-.863-.90108s-.786-.33093-1.257-.33453c-.338-.0036-.685.04856-1.042.15647-.356.10432-.649.23921-.879.40468l-1.252-.15108.669-5.43879h5.741v1.187h-4.618l-.389,3.25899h.065c.226-.17986.511-.32914.852-.44784.342-.11871.698-.17806,1.069-.17806.676,0,1.278.16187,1.807.48561.533.32014.95.75899,1.252,1.31654.306.55756.459,1.19425.459,1.91007c0,.70504-.159,1.33453-.475,1.88849-.313.550359-.745.98561-1.295,1.305753-.551.316547-1.176.47482-1.878.47482Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.249995-4.995454)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.565002 86.751845)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "1.9177",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.867001 86.848756)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M243.855,81.2017v11.0504h-1.338v-9.6475h-.065l-2.698,1.7914v-1.3597l2.763-1.8346h1.338Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.565002 86.751845)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.826038 116.681015)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.704999 115.934056)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M272.684,122.332c-.633,0-1.203-.126-1.71-.377-.508-.252-.914-.598-1.22-1.036-.306-.439-.473-.939-.502-1.5h1.295c.051.5.277.913.68,1.241.407.323.892.485,1.457.485.453,0,.856-.106,1.209-.318.356-.212.635-.504.836-.874.205-.374.308-.797.308-1.268c0-.482-.107-.912-.319-1.29-.208-.381-.496-.681-.863-.901-.367-.219-.786-.331-1.257-.334-.338-.004-.685.048-1.042.156-.356.104-.649.239-.879.405l-1.252-.151.669-5.439h5.741v1.187h-4.619l-.388,3.259h.065c.226-.18.511-.329.852-.448.342-.119.698-.178,1.069-.178.676,0,1.278.162,1.807.486.533.32.95.759,1.252,1.316.306.558.459,1.194.459,1.91c0,.705-.159,1.335-.475,1.889-.313.55-.745.985-1.295,1.305-.551.317-1.176.475-1.878.475Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.826038 116.681015)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.192015 146.128184)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 304.07105 145.379518)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M303.05,151.779c-.633,0-1.203-.126-1.71-.378-.508-.252-.914-.597-1.22-1.036s-.473-.939-.502-1.5h1.295c.051.5.277.914.68,1.241.407.324.892.486,1.457.486.453,0,.856-.107,1.209-.319.356-.212.634-.503.836-.874.205-.374.307-.797.307-1.268c0-.482-.106-.912-.318-1.289-.209-.382-.496-.682-.863-.901-.367-.22-.786-.331-1.257-.335-.339-.004-.686.049-1.042.156-.356.105-.649.24-.879.405l-1.252-.151.669-5.439h5.741v1.187h-4.619l-.388,3.259h.065c.226-.18.51-.329.852-.448.342-.118.698-.178,1.068-.178.677,0,1.279.162,1.808.486.532.32.95.759,1.252,1.317.306.557.458,1.194.458,1.91c0,.705-.158,1.334-.474,1.888-.313.55-.745.986-1.295,1.306-.551.316-1.177.475-1.878.475Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.192015 146.128184)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.582001 176.538433)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "4.88433",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.461043 175.791474)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M332.44,182.189c-.633,0-1.203-.126-1.71-.378s-.914-.597-1.219-1.036c-.306-.439-.473-.939-.502-1.5h1.295c.05.5.277.914.68,1.241.406.324.892.486,1.456.486.454,0,.856-.106,1.209-.318.356-.213.635-.504.836-.875.205-.374.308-.796.308-1.268c0-.482-.106-.911-.318-1.289-.209-.381-.497-.682-.864-.901-.367-.22-.786-.331-1.257-.335-.338-.003-.685.049-1.041.157-.356.104-.65.239-.88.404l-1.252-.151.669-5.439h5.741v1.188h-4.618l-.389,3.259h.065c.227-.18.511-.33.853-.448.341-.119.697-.178,1.068-.178.676,0,1.279.162,1.807.485.533.32.95.759,1.252,1.317.306.557.459,1.194.459,1.91c0,.705-.158,1.334-.475,1.888-.313.551-.745.986-1.295,1.306-.55.317-1.176.475-1.878.475Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.582001 176.538433)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.63598 116.680772)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "16.6163",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.897039 116.681014)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M208.425,123.079c-.454-.007-.907-.094-1.36-.259-.453-.166-.867-.444-1.241-.836-.374-.396-.675-.93-.901-1.603-.227-.676-.34-1.525-.34-2.547c0-.978.092-1.845.275-2.6.183-.759.45-1.398.799-1.916.349-.521.769-.917,1.262-1.187.497-.27,1.056-.405,1.678-.405.619,0,1.169.125,1.651.373.486.244.882.586,1.187,1.025.306.439.504.944.594,1.516h-1.317c-.122-.496-.359-.908-.712-1.236-.352-.327-.82-.491-1.403-.491-.856,0-1.53.373-2.023,1.117-.489.745-.736,1.79-.739,3.135h.086c.201-.305.441-.566.718-.782.28-.22.59-.389.928-.507.338-.119.696-.178,1.073-.178.633,0,1.213.158,1.738.474.525.313.946.747,1.262,1.301.317.55.475,1.181.475,1.894c0,.683-.153,1.309-.458,1.877-.306.565-.736,1.015-1.29,1.349-.55.331-1.198.493-1.942.486Zm0-1.187c.453,0,.859-.113,1.219-.34.363-.227.649-.531.858-.912.212-.381.318-.806.318-1.273c0-.457-.102-.873-.307-1.247-.202-.377-.481-.678-.837-.901-.352-.223-.755-.334-1.208-.334-.342,0-.66.068-.955.205-.295.133-.554.316-.777.55-.22.234-.392.502-.518.804-.126.299-.189.613-.189.944c0,.439.102.849.307,1.231.209.381.493.688.853.922.363.234.775.351,1.236.351Zm9.352,1.187c-.741,0-1.396-.131-1.964-.394-.565-.266-1.006-.631-1.322-1.095-.317-.468-.473-1-.47-1.597-.003-.468.088-.9.275-1.295.187-.4.443-.732.767-.999.327-.269.692-.44,1.095-.512v-.065c-.529-.137-.95-.433-1.263-.89-.313-.461-.467-.984-.464-1.57-.003-.561.139-1.063.427-1.506.287-.442.683-.791,1.187-1.046.507-.256,1.084-.384,1.732-.384.64,0,1.212.128,1.715.384.504.255.9.604,1.188,1.046.291.443.438.945.442,1.506-.004.586-.164,1.109-.48,1.57-.313.457-.729.753-1.247.89v.065c.4.072.759.243,1.079.512.321.267.576.599.767.999.19.395.287.827.291,1.295-.004.597-.165,1.129-.486,1.597-.316.464-.757.829-1.322,1.095-.561.263-1.21.394-1.947.394Zm0-1.187c.5,0,.931-.081,1.295-.243.363-.162.643-.39.841-.685s.299-.64.302-1.036c-.003-.417-.111-.786-.323-1.106s-.502-.572-.869-.756c-.363-.183-.779-.275-1.246-.275-.472,0-.892.092-1.263.275-.367.184-.656.436-.869.756-.208.32-.311.689-.307,1.106-.004.396.092.741.286,1.036.198.295.48.523.847.685s.802.243,1.306.243Zm0-5.245c.395,0,.746-.079,1.052-.237.309-.158.552-.38.728-.664s.266-.617.27-.998c-.004-.374-.092-.7-.264-.977-.173-.28-.412-.496-.718-.647-.306-.155-.662-.232-1.068-.232-.414,0-.776.077-1.085.232-.309.151-.548.367-.718.647-.169.277-.251.603-.248.977-.003.381.081.714.254.998.176.284.419.506.728.664.31.158.666.237,1.069.237Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.63598 116.680772)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.89703 146.609306)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "1.9177",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 243.198977 146.706852)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M244.187,141.059v11.05h-1.338v-9.647h-.065l-2.698,1.791v-1.359l2.763-1.835h1.338Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 212.89703 146.609306)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.826021 177.535998)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "11.1654",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.846975 176.887634)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M264.632,183.135v-.971l3.647-3.993c.428-.468.781-.874,1.058-1.22.277-.348.482-.676.615-.982.137-.309.205-.633.205-.971c0-.388-.094-.725-.281-1.009-.183-.284-.435-.503-.755-.658s-.68-.232-1.079-.232c-.425,0-.795.088-1.112.264-.313.173-.556.416-.728.729-.169.313-.254.68-.254,1.1h-1.273c0-.647.149-1.215.448-1.705.298-.489.705-.87,1.219-1.143.518-.274,1.099-.411,1.743-.411.647,0,1.221.137,1.721.411.5.273.892.642,1.176,1.106.285.464.427.98.427,1.548c0,.407-.074.804-.222,1.193-.143.385-.395.814-.755,1.289-.356.471-.851,1.047-1.484,1.727l-2.482,2.655v.086h5.137v1.187h-6.971Zm12.868.151c-.453-.007-.906-.094-1.359-.259-.454-.165-.867-.444-1.241-.836-.374-.396-.675-.93-.901-1.603-.227-.676-.34-1.525-.34-2.547c0-.978.091-1.845.275-2.6.183-.759.449-1.398.798-1.916.349-.521.77-.917,1.263-1.187.496-.27,1.056-.405,1.678-.405.619,0,1.169.125,1.651.373.486.244.881.586,1.187,1.025s.504.944.594,1.516h-1.317c-.122-.496-.36-.908-.712-1.235-.353-.328-.82-.491-1.403-.491-.856,0-1.531.372-2.023,1.116-.49.745-.736,1.79-.74,3.135h.087c.201-.305.44-.566.717-.782.281-.219.59-.389.928-.507.339-.119.696-.178,1.074-.178.633,0,1.212.158,1.738.475.525.312.946.746,1.262,1.3.317.55.475,1.182.475,1.894c0,.683-.153,1.309-.459,1.877-.305.565-.735,1.015-1.289,1.349-.551.331-1.198.493-1.943.486Zm0-1.187c.454,0,.86-.113,1.22-.34.363-.227.649-.531.858-.912.212-.381.318-.806.318-1.273c0-.457-.102-.873-.308-1.247-.201-.377-.48-.678-.836-.901-.352-.223-.755-.334-1.208-.334-.342,0-.661.068-.956.205-.294.133-.553.316-.776.55-.22.234-.393.502-.518.804-.126.299-.189.613-.189.944c0,.439.102.849.307,1.231.209.381.493.688.853.922.363.234.775.351,1.235.351Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.826021 177.535998)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.191992 206.98246)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "11.1654",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 304.213046 206.334095)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M294.998,212.581v-.971l3.647-3.993c.428-.468.781-.874,1.058-1.219.277-.349.482-.677.615-.982.136-.31.205-.633.205-.972c0-.388-.094-.724-.281-1.009-.183-.284-.435-.503-.755-.658s-.68-.232-1.079-.232c-.425,0-.795.088-1.112.264-.313.173-.556.416-.728.729-.169.313-.254.68-.254,1.101h-1.273c0-.648.149-1.216.448-1.705.298-.49.705-.871,1.219-1.144.518-.274,1.099-.41,1.743-.41.647,0,1.221.136,1.721.41.5.273.892.642,1.176,1.106s.426.98.426,1.548c0,.407-.073.804-.221,1.193-.144.385-.395.815-.755,1.289-.356.472-.851,1.047-1.484,1.727l-2.482,2.655v.086h5.137v1.187h-6.971Zm12.868.151c-.453-.007-.906-.093-1.36-.259-.453-.165-.866-.444-1.241-.836-.374-.396-.674-.93-.901-1.603-.226-.676-.34-1.525-.34-2.546c0-.979.092-1.846.276-2.601.183-.759.449-1.398.798-1.916.349-.521.77-.917,1.263-1.187.496-.269,1.056-.404,1.678-.404.619,0,1.169.124,1.651.372.486.245.881.586,1.187,1.025s.504.944.594,1.516h-1.317c-.122-.496-.36-.908-.712-1.235-.353-.328-.82-.491-1.403-.491-.856,0-1.531.372-2.024,1.117-.489.744-.735,1.789-.739,3.134h.087c.201-.305.44-.566.717-.782.281-.219.59-.388.928-.507s.696-.178,1.074-.178c.633,0,1.212.158,1.737.475.526.313.946.746,1.263,1.3.317.55.475,1.182.475,1.894c0,.683-.153,1.309-.459,1.878-.306.564-.735,1.014-1.289,1.349-.551.33-1.198.492-1.943.485Zm0-1.187c.453,0,.86-.113,1.22-.34.363-.226.649-.53.858-.912.212-.381.318-.805.318-1.273c0-.457-.103-.872-.308-1.246-.201-.378-.48-.679-.836-.902-.353-.223-.755-.334-1.209-.334-.341,0-.66.068-.955.205-.295.133-.554.316-.777.55-.219.234-.392.502-.518.804-.126.299-.188.614-.188.944c0,.439.102.849.307,1.231.209.381.493.689.853.922.363.234.775.351,1.235.351Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.191992 206.98246)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.581977 237.391709)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "11.1654",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.603031 236.744344)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M324.388,242.992v-.972l3.647-3.992c.428-.468.781-.875,1.058-1.22.277-.349.482-.676.615-.982.137-.309.205-.633.205-.971c0-.389-.093-.725-.28-1.009-.184-.284-.436-.504-.756-.658-.32-.155-.68-.232-1.079-.232-.424,0-.795.088-1.111.264-.313.173-.556.415-.729.728-.169.313-.253.68-.253,1.101h-1.274c0-.647.149-1.216.448-1.705s.705-.87,1.219-1.144c.518-.273,1.099-.41,1.743-.41.648,0,1.221.137,1.721.41.5.274.893.642,1.177,1.106s.426.981.426,1.549c0,.406-.074.804-.221,1.192-.144.385-.396.815-.756,1.29-.356.471-.85,1.047-1.483,1.727l-2.483,2.654v.087h5.137v1.187h-6.971Zm12.869.151c-.454-.008-.907-.094-1.36-.259-.453-.166-.867-.445-1.241-.837-.374-.395-.675-.93-.901-1.602-.227-.676-.34-1.525-.34-2.547c0-.978.092-1.845.275-2.601.184-.759.45-1.397.799-1.915.349-.522.769-.917,1.262-1.187.497-.27,1.056-.405,1.678-.405.619,0,1.169.124,1.651.372.486.245.882.587,1.187,1.026.306.438.504.944.594,1.516h-1.317c-.122-.497-.359-.908-.712-1.236-.352-.327-.82-.491-1.403-.491-.856,0-1.53.373-2.023,1.117-.489.745-.736,1.79-.739,3.135h.086c.201-.306.441-.567.718-.782.28-.22.59-.389.928-.508.338-.118.696-.178,1.073-.178.634,0,1.213.159,1.738.475.525.313.946.747,1.262,1.301.317.55.475,1.181.475,1.893c0,.684-.153,1.31-.458,1.878-.306.565-.736,1.015-1.29,1.349-.55.331-1.198.493-1.942.486Zm0-1.187c.453,0,.859-.114,1.219-.34.363-.227.649-.531.858-.912.212-.381.318-.806.318-1.274c0-.456-.102-.872-.307-1.246-.202-.378-.48-.678-.837-.901-.352-.223-.755-.335-1.208-.335-.342,0-.66.069-.955.205-.295.134-.554.317-.777.551-.22.234-.392.502-.518.804-.126.298-.189.613-.189.944c0,.439.102.849.308,1.23.208.382.492.689.852.923.363.234.775.351,1.236.351Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.581977 237.391709)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.493027 56.823837)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "5.6529",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 273.65101 56.076454)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M269.283,51.2731v11.0504h-1.338v-9.6475h-.064l-2.698,1.7914v-1.3597l2.762-1.8346h1.338Zm2.919,8.7842v-1.1007l4.857-7.6835h.798v1.7051h-.539l-3.669,5.8057v.0864h6.539v1.187h-7.986Zm5.202,2.2662v-2.6007-.5126-7.9371h1.273v11.0504h-1.273Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 242.493027 56.823837)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858981 86.269582)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "5.6529",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 304.016963 85.522199)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M299.649,80.7196v11.0503h-1.338v-9.6475h-.065l-2.698,1.7914v-1.3597l2.763-1.8345h1.338Zm2.919,8.7841v-1.1007l4.856-7.6834h.799v1.705h-.54l-3.669,5.8057v.0864h6.54v1.187h-7.986Zm5.202,2.2662v-2.6007-.5126-7.937h1.273v11.0503h-1.273Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 272.858981 86.269582)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250004 116.680195)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "5.6529",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 333.406961 115.93266)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M329.04,111.13v11.05h-1.338v-9.647h-.065l-2.698,1.791v-1.359l2.763-1.835h1.338Zm2.919,8.784v-1.1l4.856-7.684h.799v1.705h-.54l-3.669,5.806v.086h6.539v1.187h-7.985Zm5.201,2.266v-2.6-.513-7.937h1.274v11.05h-1.274Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 302.250004 116.680195)",
                  fill: "none",
                  stroke: "#3f4c59",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "103.313",
                  height: "417.555",
                  rx: "0",
                  ry: "0",
                  transform: "translate(283.687-63)",
                  fill: "url(#eWMaDkTemOR207-fill)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M22,201.568h-8.7273v-3.051c0-.608.1051-1.109.3154-1.504.2074-.395.4872-.689.8395-.882.3494-.194.7372-.29,1.1633-.29.375,0,.6847.067.929.2.2443.131.4375.304.5795.52.1421.213.2472.445.3154.695h.0852c.017-.267.1108-.536.2812-.806.1705-.27.4148-.495.733-.677s.7074-.273,1.1676-.273c.4375,0,.831.099,1.1804.298s.6264.513.831.942.3068.987.3068,1.675v3.153Zm-.9375-1.057v-2.096c0-.691-.1335-1.181-.4006-1.47-.2699-.293-.5966-.439-.9801-.439-.2954,0-.5682.075-.8182.226-.2528.15-.4545.365-.6051.643-.1534.278-.2301.608-.2301.989v2.147h3.0341Zm-3.9545,0v-1.96c0-.318-.0625-.605-.1875-.861-.125-.258-.3012-.463-.5285-.613-.2272-.154-.4943-.23-.8011-.23-.3835,0-.7088.133-.9758.4-.2699.267-.4049.69-.4049,1.27v1.994h2.8978Zm5.0454-8.537c0,.414-.0781.791-.2344,1.129-.1591.338-.3878.607-.686.805-.3012.199-.6648.299-1.091.299-.375,0-.6789-.074-.9119-.222-.2358-.148-.4204-.345-.554-.592s-.2329-.52-.2983-.818c-.0681-.302-.1221-.604-.1619-.908-.0511-.398-.0895-.72-.115-.967-.0285-.25-.0753-.432-.1407-.546-.0653-.116-.179-.175-.3409-.175h-.0341c-.4204,0-.7471.115-.9801.346-.2329.227-.3494.572-.3494,1.035c0,.48.1051.857.3153,1.129.2102.273.4347.465.6733.576l-.3409.954c-.3977-.17-.7074-.398-.929-.682-.2244-.287-.3807-.599-.4687-.937-.0909-.341-.1364-.676-.1364-1.006c0-.21.0256-.452.0767-.724.0483-.276.1492-.541.3026-.797.1534-.259.3849-.473.6946-.644.3096-.17.7244-.255,1.2443-.255h4.3125v1.005h-.8864v.052c.1421.068.2941.181.456.34.1619.16.2997.371.4134.635.1136.265.1704.587.1704.968Zm-.9034-.154c0-.397-.0781-.733-.2344-1.005-.1562-.276-.3579-.483-.6051-.623-.2471-.142-.5071-.213-.7798-.213h-.9205c.0512.043.098.137.1407.282.0397.142.0752.306.1065.494.0284.185.054.365.0767.541.0199.173.0369.314.0511.422.0341.261.0895.506.1662.733.0739.224.1861.406.3367.545.1477.137.3494.205.6051.205.3494,0,.6136-.129.7926-.388.1761-.261.2642-.592.2642-.993Zm-4.3295-9.318l.2556.903c-.1505.057-.2968.141-.4389.252-.1449.108-.2642.255-.3579.443-.0938.187-.1407.427-.1407.72c0,.401.0924.734.277,1.001.1818.265.4134.397.6946.397.25,0,.4475-.091.5924-.273.1448-.182.2656-.466.3622-.852l.2386-.972c.1421-.585.3594-1.021.652-1.308.2898-.287.6633-.431,1.1207-.431.375,0,.7103.108,1.0057.324.2955.213.5284.512.6989.895.1704.384.2557.83.2557,1.338c0,.668-.1449,1.22-.4347,1.658-.2898.437-.7131.714-1.2699.831l-.2386-.955c.3523-.091.6165-.262.7926-.515.1761-.256.2642-.59.2642-1.002c0-.468-.0994-.841-.2983-1.116-.2017-.279-.4432-.418-.7244-.418-.2273,0-.4176.08-.5711.239-.1562.159-.2727.403-.3494.733l-.2557,1.091c-.142.599-.3622,1.04-.6605,1.321-.3011.278-.6775.417-1.1292.417-.3694,0-.6961-.103-.9802-.311-.284-.21-.5071-.495-.669-.856-.1619-.364-.2429-.776-.2429-1.236c0-.648.1421-1.156.4262-1.526.284-.372.659-.636,1.125-.792Zm5.2159-4.378c0,.631-.1392,1.175-.4177,1.632-.2812.455-.6732.806-1.1761,1.053-.5057.244-1.0937.366-1.7642.366s-1.2614-.122-1.7727-.366c-.5142-.247-.9148-.591-1.2017-1.031-.2898-.443-.4347-.961-.4347-1.551c0-.341.0568-.678.1705-1.01.1136-.333.2983-.635.5539-.908.2529-.273.5881-.49,1.0057-.652s.9318-.243,1.5426-.243h.4262v5.046h-.8693v-4.023c-.3694,0-.6989.074-.9887.221-.2897.145-.5184.353-.6861.623-.1676.267-.2514.582-.2514.946c0,.4.0995.747.2983,1.039.196.29.4517.513.7671.669.3153.157.6534.235,1.0142.235h.5795c.4943,0,.9134-.085,1.2571-.256.3409-.173.6009-.413.7798-.72.1762-.307.2643-.663.2643-1.07c0-.264-.037-.503-.1108-.716-.0767-.216-.1904-.402-.341-.558-.1534-.156-.3437-.277-.571-.362l.2728-.972c.3295.103.6193.274.8693.516.2471.241.4403.54.5795.895.1364.355.2046.754.2046,1.197Zm.017-9.541c0,.415-.0781.791-.2344,1.129-.1591.338-.3878.607-.686.806-.3012.199-.6648.298-1.091.298-.375,0-.6789-.074-.9119-.222-.2358-.147-.4204-.345-.554-.592s-.2329-.52-.2983-.818c-.0681-.301-.1221-.604-.1619-.908-.0511-.397-.0895-.72-.115-.967-.0285-.25-.0753-.432-.1407-.546-.0653-.116-.179-.174-.3409-.174h-.0341c-.4204,0-.7471.115-.9801.345-.2329.227-.3494.572-.3494,1.035c0,.481.1051.857.3153,1.13.2102.272.4347.464.6733.575l-.3409.955c-.3977-.171-.7074-.398-.929-.682-.2244-.287-.3807-.6-.4687-.938-.0909-.341-.1364-.676-.1364-1.005c0-.211.0256-.452.0767-.725.0483-.275.1492-.541.3026-.797.1534-.258.3849-.473.6946-.643.3096-.171.7244-.256,1.2443-.256h4.3125v1.006h-.8864v.051c.1421.068.2941.182.456.341s.2997.371.4134.635c.1136.264.1704.586.1704.967Zm-.9034-.153c0-.398-.0781-.733-.2344-1.006-.1562-.276-.3579-.483-.6051-.622-.2471-.142-.5071-.213-.7798-.213h-.9205c.0512.042.098.136.1407.281.0397.142.0752.307.1065.494.0284.185.054.365.0767.542.0199.173.0369.313.0511.421.0341.262.0895.506.1662.733.0739.225.1861.407.3367.546.1477.136.3494.204.6051.204.3494,0,.6136-.129.7926-.387.1761-.262.2642-.593.2642-.993Zm-5.7955-5.432l2.6762-1.569-2.6762-1.568v-1.159l3.2728,2.114L22,158.702v1.159l-2.5398,1.568L22,162.998v1.159l-3.2727-2.08-3.2728,2.08v-1.159ZM22,157.267h-6.5455v-1.006h6.5455v1.006Zm-7.6364-.511c0,.196-.0667.365-.2002.507-.1336.139-.2941.209-.4816.209s-.348-.07-.4815-.209c-.1335-.142-.2003-.311-.2003-.507s.0668-.364.2003-.503c.1335-.142.294-.213.4815-.213s.348.071.4815.213c.1336.139.2003.307.2003.503Zm2.5569-6.973l.2556.903c-.1505.057-.2968.141-.4389.252-.1449.108-.2642.256-.3579.443-.0938.188-.1407.428-.1407.72c0,.401.0924.735.277,1.002.1818.264.4134.396.6946.396.25,0,.4475-.091.5924-.273.1448-.182.2656-.466.3622-.852l.2386-.972c.1421-.585.3594-1.021.652-1.308.2898-.287.6633-.43,1.1207-.43.375,0,.7103.108,1.0057.324.2955.213.5284.511.6989.894.1704.384.2557.83.2557,1.339c0,.667-.1449,1.22-.4347,1.657-.2898.438-.7131.715-1.2699.831l-.2386-.954c.3523-.091.6165-.263.7926-.516.1761-.256.2642-.589.2642-1.001c0-.469-.0994-.841-.2983-1.117-.2017-.278-.4432-.418-.7244-.418-.2273,0-.4176.08-.5711.239-.1562.159-.2727.404-.3494.733l-.2557,1.091c-.142.599-.3622,1.04-.6605,1.321-.3011.278-.6775.418-1.1292.418-.3694,0-.6961-.104-.9802-.311-.284-.211-.5071-.496-.669-.857-.1619-.364-.2429-.776-.2429-1.236c0-.648.1421-1.156.4262-1.525.284-.373.659-.637,1.125-.793Z",
                  fill: "#9ea5ab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M22,141.21v1.108l-8.7273-3.204v-1.091L22,134.818v1.108l-7.3466,2.608v.068L22,141.21Zm-3.4091-.409v-4.466h.9375v4.466h-.9375Zm-.5284-8.212h3.9375v1.006h-6.5455v-.971h1.0228v-.086c-.3324-.153-.5995-.386-.8012-.699-.2045-.312-.3068-.715-.3068-1.21c0-.443.0909-.831.2727-1.163.179-.332.4517-.591.8182-.776.3637-.184.8239-.277,1.3807-.277h4.1591v1.006h-4.0909c-.5142,0-.9148.134-1.2017.401-.2898.267-.4347.633-.4347,1.099c0,.321.0696.608.2088.861.1392.25.3424.447.6094.592s.5909.217.9716.217Zm0-7.019h3.9375v1.006h-6.5455v-.972h1.0228v-.085c-.3324-.154-.5995-.387-.8012-.699-.2045-.313-.3068-.716-.3068-1.21c0-.443.0909-.831.2727-1.164.179-.332.4517-.591.8182-.775.3637-.185.8239-.277,1.3807-.277h4.1591v1.006h-4.0909c-.5142,0-.9148.133-1.2017.4-.2898.267-.4347.634-.4347,1.1c0,.321.0696.607.2088.86.1392.25.3424.448.6094.593s.5909.217.9716.217Zm4.0739-8.758c0,.63-.1392,1.175-.4177,1.632-.2812.454-.6732.805-1.1761,1.052-.5057.245-1.0937.367-1.7642.367s-1.2614-.122-1.7727-.367c-.5142-.247-.9148-.59-1.2017-1.031-.2898-.443-.4347-.96-.4347-1.551c0-.341.0568-.677.1705-1.01.1136-.332.2983-.635.5539-.908.2529-.272.5881-.49,1.0057-.652.4176-.161.9318-.242,1.5426-.242h.4262v5.045h-.8693v-4.023c-.3694,0-.6989.074-.9887.222-.2897.145-.5184.352-.6861.622-.1676.267-.2514.582-.2514.946c0,.401.0995.747.2983,1.04.196.29.4517.513.7671.669s.6534.234,1.0142.234h.5795c.4943,0,.9134-.085,1.2571-.255.3409-.174.6009-.414.7798-.721.1762-.306.2643-.663.2643-1.069c0-.264-.037-.503-.1108-.716-.0767-.216-.1904-.402-.341-.558-.1534-.157-.3437-.277-.571-.363l.2728-.971c.3295.102.6193.274.8693.515.2471.242.4403.54.5795.895.1364.355.2046.755.2046,1.198Zm-6.6819-4.814l2.6762-1.569-2.6762-1.568v-1.159l3.2728,2.114L22,107.702v1.159l-2.5398,1.568L22,111.998v1.159l-3.2727-2.08-3.2728,2.08v-1.159Zm6.6989-11.032c0,.415-.0781.791-.2344,1.129-.1591.338-.3878.607-.686.806-.3012.198-.6648.298-1.091.298-.375,0-.6789-.074-.9119-.222-.2358-.147-.4204-.345-.554-.592s-.2329-.52-.2983-.818c-.0681-.301-.1221-.604-.1619-.908-.0511-.398-.0895-.7201-.115-.9672-.0285-.25-.0753-.4319-.1407-.5455-.0653-.1165-.179-.1747-.3409-.1747h-.0341c-.4204,0-.7471.115-.9801.3452-.2329.2272-.3494.5724-.3494,1.0352c0,.48.1051.857.3153,1.13.2102.272.4347.464.6733.575l-.3409.954c-.3977-.17-.7074-.397-.929-.681-.2244-.287-.3807-.6-.4687-.938-.0909-.341-.1364-.676-.1364-1.006c0-.21.0256-.4513.0767-.7241.0483-.2755.1492-.5412.3026-.7968.1534-.2586.3849-.4731.6946-.6435s.7244-.2557,1.2443-.2557h4.3125v1.0057h-.8864v.0511c.1421.0682.2941.1818.456.3409s.2997.3708.4134.635c.1136.2644.1704.5864.1704.9674Zm-.9034-.154c0-.397-.0781-.732-.2344-1.0052-.1562-.2756-.3579-.4829-.6051-.6221-.2471-.1421-.5071-.2131-.7798-.2131h-.9205c.0512.0426.098.1364.1407.2812.0397.1421.0752.3069.1065.4944.0284.1846.054.3648.0767.5408.0199.174.0369.314.0511.422.0341.262.0895.506.1662.733.0739.225.1861.406.3367.546.1477.136.3494.204.6051.204.3494,0,.6136-.129.7926-.388.1761-.261.2642-.592.2642-.993Zm-5.7955-5.4317l2.6762-1.5682-2.6762-1.5681v-1.1591l3.2728,2.1136L22,91.0849v1.1591l-2.5398,1.5681L22,95.3803v1.1591l-3.2727-2.0795-3.2728,2.0795v-1.1591ZM22,89.6499h-6.5455v-1.0057h6.5455v1.0057Zm-7.6364-.5114c0,.196-.0667.3651-.2003.5071-.1335.1392-.294.2088-.4815.2088s-.348-.0696-.4815-.2088c-.1335-.142-.2003-.3111-.2003-.5071s.0668-.3636.2003-.5028c.1335-.1421.294-.2131.4815-.2131s.348.071.4815.2131c.1336.1392.2003.3068.2003.5028Zm2.5569-6.9727l.2556.9034c-.1505.0569-.2968.1407-.4389.2515-.1449.1079-.2642.2556-.3579.4431-.0938.1875-.1407.4276-.1407.7202c0,.4006.0924.7344.277,1.0014.1818.2642.4134.3963.6946.3963.25,0,.4475-.0909.5924-.2727.1448-.1818.2656-.4659.3622-.8523l.2386-.9715c.1421-.5853.3594-1.0214.652-1.3083.2898-.2869.6633-.4304,1.1207-.4304.375,0,.7103.108,1.0057.3239.2955.2131.5284.5113.6989.8949.1704.3835.2557.8295.2557,1.338c0,.6677-.1449,1.2202-.4347,1.6577s-.7131.7145-1.2699.831l-.2386-.9546c.3523-.0909.6165-.2628.7926-.5156.1761-.2557.2642-.5895.2642-1.0014c0-.4688-.0994-.8409-.2983-1.1165-.2017-.2784-.4432-.4176-.7244-.4176-.2273,0-.4176.0795-.5711.2386-.1562.1591-.2727.4034-.3494.733l-.2557,1.0909c-.142.5994-.3622,1.0398-.6605,1.321-.3011.2784-.6775.4176-1.1292.4176-.3694,0-.6961-.1037-.9802-.3111-.284-.2102-.5071-.4957-.669-.8565-.1619-.3636-.2429-.7756-.2429-1.2358c0-.6477.1421-1.1562.4262-1.5255.284-.3722.659-.6364,1.125-.7927Z",
                  fill: "#9ea5ab"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M19.5,222.125v29.25",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M16.5,247.625l3,5.25l3-5.25",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M18,65.375v-29.25",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M21,39.875l-3-5.25-3,5.25",
                  fill: "none",
                  stroke: "#9ea5ab",
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { id: "eWMaDkTemOR214", transform: "translate(0 0.000001)", opacity: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "16.6559",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.999998 146.332516)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.8978",
                  height: "42.8978",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 152.667028 146.333186)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M310.06,121.24c-.92,0-1.753-.147-2.5-.44-.733-.307-1.367-.76-1.9-1.36-.52-.6-.92-1.34-1.2-2.22-.28-.893-.42-1.927-.42-3.1s.14-2.213.42-3.12c.28-.92.68-1.687,1.2-2.3.533-.627,1.167-1.1,1.9-1.42.747-.32,1.58-.48,2.5-.48c1.253,0,2.293.267,3.12.8s1.487,1.34,1.98,2.42l-2.26,1.2c-.2-.627-.527-1.127-.98-1.5-.453-.387-1.073-.58-1.86-.58-.987,0-1.773.333-2.36,1-.573.667-.86,1.6-.86,2.8v2.2c0,1.213.287,2.147.86,2.8.587.64,1.373.96,2.36.96.787,0,1.427-.213,1.92-.64.507-.427.873-.953,1.1-1.58l2.14,1.26c-.507,1.04-1.18,1.853-2.02,2.44-.84.573-1.887.86-3.14.86Zm11.392,0c-.747,0-1.42-.127-2.02-.38-.587-.253-1.093-.62-1.52-1.1-.413-.48-.733-1.053-.96-1.72-.227-.68-.34-1.44-.34-2.28s.113-1.593.34-2.26.547-1.233.96-1.7c.427-.48.933-.847,1.52-1.1.6-.253,1.273-.38,2.02-.38s1.42.127,2.02.38s1.107.62,1.52,1.1c.427.467.753,1.033.98,1.7s.34,1.42.34,2.26-.113,1.6-.34,2.28c-.227.667-.553,1.24-.98,1.72-.413.48-.92.847-1.52,1.1s-1.273.38-2.02.38Zm0-2.06c.68,0,1.213-.207,1.6-.62s.58-1.02.58-1.82v-1.94c0-.787-.193-1.387-.58-1.8s-.92-.62-1.6-.62c-.667,0-1.193.207-1.58.62s-.58,1.013-.58,1.8v1.94c0,.8.193,1.407.58,1.82s.913.62,1.58.62Zm7.13,1.82v-10.44h2.56v2.16h.1c.066-.28.166-.547.3-.8.146-.267.333-.5.56-.7.226-.2.493-.36.8-.48.32-.12.686-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.127-1.96.38s-.66.667-.66,1.24v6.4h-2.56Zm7.851,0v-10.44h2.56v2.16h.1c.067-.28.167-.547.3-.8.147-.267.333-.5.56-.7s.493-.36.8-.48c.32-.12.687-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.127-1.96.38s-.66.667-.66,1.24v6.4h-2.56Zm11.974.24c-.773,0-1.467-.127-2.08-.38-.6-.267-1.113-.633-1.54-1.1-.413-.48-.733-1.053-.96-1.72-.227-.68-.34-1.44-.34-2.28c0-.827.107-1.573.32-2.24.227-.667.547-1.233.96-1.7.413-.48.92-.847,1.52-1.1.6-.267,1.28-.4,2.04-.4.813,0,1.52.14,2.12.42s1.093.66,1.48,1.14.673,1.04.86,1.68c.2.627.3,1.3.3,2.02v.84h-6.94v.26c0,.76.213,1.373.64,1.84.427.453,1.06.68,1.9.68.64,0,1.16-.133,1.56-.4.413-.267.78-.607,1.1-1.02l1.38,1.54c-.427.6-1.013,1.073-1.76,1.42-.733.333-1.587.5-2.56.5Zm-.04-9c-.68,0-1.22.227-1.62.68s-.6,1.04-.6,1.76v.16h4.28v-.18c0-.72-.18-1.3-.54-1.74-.347-.453-.853-.68-1.52-.68Zm9.532,8.76c-.88,0-1.526-.22-1.94-.66-.413-.44-.62-1.06-.62-1.86v-12.28h2.56v12.76h1.38v2.04h-1.38Zm10.999,0c-.56,0-1.006-.16-1.34-.48-.32-.333-.52-.773-.6-1.32h-.12c-.173.68-.526,1.193-1.06,1.54-.533.333-1.193.5-1.98.5-1.066,0-1.886-.28-2.46-.84-.573-.56-.86-1.307-.86-2.24c0-1.08.387-1.88,1.16-2.4.774-.533,1.874-.8,3.3-.8h1.78v-.76c0-.587-.153-1.04-.46-1.36-.306-.32-.8-.48-1.48-.48-.6,0-1.086.133-1.46.4-.36.253-.666.56-.92.92l-1.52-1.36c.387-.6.9-1.08,1.54-1.44.64-.373,1.487-.56,2.54-.56c1.414,0,2.487.32,3.22.96.734.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.574,0,1.06-.127,1.46-.38s.6-.627.6-1.12v-1.38h-1.64c-1.333,0-2,.427-2,1.28v.34c0,.427.134.747.4.96.28.2.674.3,1.18.3ZM375.572,121c-.88,0-1.553-.227-2.02-.68-.453-.467-.68-1.127-.68-1.98v-5.74h-1.54v-2.04h.8c.387,0,.647-.087.78-.26.147-.187.22-.46.22-.82v-1.78h2.3v2.86h2.14v2.04h-2.14v6.36h1.98v2.04h-1.84Zm5.501-11.96c-.534,0-.921-.12-1.161-.36-.226-.24-.34-.547-.34-.92v-.4c0-.373.114-.68.34-.92.24-.24.627-.36,1.161-.36.519,0,.899.12,1.14.36.24.24.36.547.36.92v.4c0,.373-.12.68-.361.92-.24.24-.62.36-1.139.36Zm-1.281,1.52h2.56v10.44h-2.56v-10.44Zm9.668,10.68c-.747,0-1.42-.127-2.02-.38-.587-.253-1.093-.62-1.52-1.1-.413-.48-.733-1.053-.96-1.72-.227-.68-.34-1.44-.34-2.28s.113-1.593.34-2.26.547-1.233.96-1.7c.427-.48.933-.847,1.52-1.1.6-.253,1.273-.38,2.02-.38s1.42.127,2.02.38s1.107.62,1.52,1.1c.427.467.753,1.033.98,1.7s.34,1.42.34,2.26-.113,1.6-.34,2.28c-.227.667-.553,1.24-.98,1.72-.413.48-.92.847-1.52,1.1s-1.273.38-2.02.38Zm0-2.06c.68,0,1.213-.207,1.6-.62s.58-1.02.58-1.82v-1.94c0-.787-.193-1.387-.58-1.8s-.92-.62-1.6-.62c-.667,0-1.193.207-1.58.62s-.58,1.013-.58,1.8v1.94c0,.8.193,1.407.58,1.82s.913.62,1.58.62Zm7.129,1.82v-10.44h2.56v1.74h.1c.214-.56.547-1.027,1-1.4.467-.387,1.107-.58,1.92-.58c1.08,0,1.907.353,2.48,1.06.574.707.86,1.713.86,3.02v6.6h-2.56v-6.34c0-.747-.133-1.307-.4-1.68-.266-.373-.706-.56-1.32-.56-.266,0-.526.04-.78.12-.24.067-.46.173-.66.32-.186.133-.34.307-.46.52-.12.2-.18.44-.18.72v6.9h-2.56Z",
                  fill: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M306.36,146.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm4.652-10.528h1.12v4.312h.056c.178-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12v-10.36Zm10.687,10.528c-.485,0-.928-.089-1.33-.266-.401-.177-.746-.429-1.036-.756-.28-.336-.499-.733-.658-1.19-.158-.467-.238-.989-.238-1.568c0-.569.08-1.087.238-1.554.159-.467.378-.863.658-1.19.29-.336.635-.593,1.036-.77.402-.177.845-.266,1.33-.266.486,0,.924.089,1.316.266.402.177.747.434,1.036.77.29.327.514.723.672,1.19.159.467.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.158.457-.382.854-.672,1.19-.289.327-.634.579-1.036.756-.392.177-.83.266-1.316.266Zm0-.994c.607,0,1.102-.187,1.484-.56.383-.373.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708-.382-.373-.877-.56-1.484-.56-.606,0-1.101.187-1.484.56-.382.373-.574.943-.574,1.708v1.036c0,.765.192,1.335.574,1.708.383.373.878.56,1.484.56Zm4.28-6.398h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L333.945,146h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L329.269,146h-1.358l-1.932-7.224Zm13.645,7.392c-.672,0-1.237-.126-1.694-.378-.448-.261-.836-.607-1.162-1.036l.798-.644c.28.355.592.63.938.826.345.187.746.28,1.204.28.476,0,.844-.103,1.106-.308.27-.205.406-.495.406-.868c0-.28-.094-.518-.28-.714-.178-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.528-.233-.742-.392-.206-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.13-.271.308-.495.532-.672.233-.177.508-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.696-.28-1.162-.28-.467,0-.822.103-1.064.308-.234.196-.35.467-.35.812c0,.355.116.611.35.77.242.159.588.275,1.036.35l.56.084c.802.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.13.602-1.96.602Zm7.961-10.528h1.12v4.312h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12v-10.36Zm10.687,10.528c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm4.279-6.398h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L370.517,146h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L365.841,146h-1.358l-1.932-7.224Zm19.431,6.048h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm10.613.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.044.784c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.563,0c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.618.952c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm7.368,0c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM421.45,146c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.482.168c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602ZM440.143,146c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm5.449.784v-7.224h1.12v1.33h.07c.13-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.607,0-1.083.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.788.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM304.19,166v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.607,0-1.083.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.788.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm5.36.21h-1.176v-.98h1.176v-1.456c0-.504.131-.91.392-1.218s.658-.462,1.19-.462h1.092v.98h-1.554v2.156h1.554v.98h-1.554v6.244h-1.12v-6.244ZM322.675,166c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm5.34.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm7.656,6.622c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462ZM341.62,166c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.217,0c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.242,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.987.168c-.485,0-.928-.089-1.33-.266-.401-.177-.746-.429-1.036-.756-.28-.336-.499-.733-.658-1.19-.158-.467-.238-.989-.238-1.568c0-.569.08-1.087.238-1.554.159-.467.378-.863.658-1.19.29-.336.635-.593,1.036-.77.402-.177.845-.266,1.33-.266.486,0,.924.089,1.316.266.402.177.747.434,1.036.77.29.327.514.723.672,1.19.159.467.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.158.457-.382.854-.672,1.19-.289.327-.634.579-1.036.756-.392.177-.83.266-1.316.266Zm0-.994c.607,0,1.102-.187,1.484-.56.383-.373.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708-.382-.373-.877-.56-1.484-.56-.606,0-1.101.187-1.484.56-.382.373-.574.943-.574,1.708v1.036c0,.765.192,1.335.574,1.708.383.373.878.56,1.484.56Zm11.129.994c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM377.17,166c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm8.137.952c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462Zm4.353-10.528h1.12v4.312h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12v-10.36Zm13.996,10.528c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm6.7.826c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.242,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm3.312-10.36h1.12v4.312h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12v-10.36Zm10.673,10.528c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266s.709.425.98.742c.271.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM426.088,166v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm9.01-8.918c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182.242,0,.415.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.276.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12ZM306.36,186.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm7.368,0c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM319.886,186c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm5.34.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm7.656,6.622c-.504,0-.957-.089-1.358-.266s-.742-.429-1.022-.756c-.271-.327-.481-.723-.63-1.19-.14-.467-.21-.989-.21-1.568s.07-1.101.21-1.568c.149-.467.359-.863.63-1.19.28-.327.621-.579,1.022-.756s.854-.266,1.358-.266c.719,0,1.293.159,1.722.476.439.308.765.714.98,1.218l-.938.476c-.131-.373-.345-.663-.644-.868s-.672-.308-1.12-.308c-.336,0-.63.056-.882.168-.252.103-.462.252-.63.448-.168.187-.294.415-.378.686-.084.261-.126.551-.126.868v1.232c0,.635.168,1.157.504,1.568.345.401.849.602,1.512.602.905,0,1.559-.42,1.96-1.26l.812.546c-.233.523-.583.938-1.05,1.246-.457.308-1.031.462-1.722.462Zm5.949-.168c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.973.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm9.588,5.278h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm13.922.84c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm5.448.784v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.788.168c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588ZM386.686,186c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M314.5,66h-46.5v54.5",
                  fill: "none",
                  stroke: "url(#eWMaDkTemOR219-stroke)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "153.084",
                  height: "20.4008",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.7734 151.041)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed",
                  strokeWidth: "1.54687"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "153.084",
                  height: "20.4008",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.7734 122.11)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed",
                  strokeWidth: "1.54687"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M38.984,137v-8.376h5.388v1.404h-3.804v2.028h3.312v1.404h-3.312v3.54h-1.584Zm7.617-7.176c-.32,0-.552-.072-.696-.216-.136-.144-.204-.328-.204-.552v-.24c0-.224.068-.408.204-.552.144-.144.376-.216.696-.216.312,0,.54.072.684.216s.216.328.216.552v.24c0,.224-.072.408-.216.552s-.372.216-.684.216Zm-.768.912h1.536v6.264h-1.536v-6.264ZM49.1686,137v-6.264h1.536v1.296h.06c.04-.168.1-.328.18-.48.088-.16.2-.3.336-.42s.296-.216.48-.288c.192-.072.412-.108.66-.108h.336v1.452h-.48c-.52,0-.912.076-1.176.228s-.396.4-.396.744v3.84h-1.536Zm7.2035.144c-.464,0-.88-.076-1.248-.228-.36-.16-.668-.38-.924-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368c0-.496.064-.944.192-1.344.136-.4.328-.74.576-1.02.248-.288.552-.508.912-.66.36-.16.768-.24,1.224-.24.488,0,.912.084,1.272.252s.656.396.888.684.404.624.516,1.008c.12.376.18.78.18,1.212v.504h-4.164v.156c0,.456.128.824.384,1.104.256.272.636.408,1.14.408.384,0,.696-.08.936-.24.248-.16.468-.364.66-.612l.828.924c-.256.36-.608.644-1.056.852-.44.2-.952.3-1.536.3Zm-.024-5.4c-.408,0-.732.136-.972.408s-.36.624-.36,1.056v.096h2.568v-.108c0-.432-.108-.78-.324-1.044-.208-.272-.512-.408-.912-.408Zm6.2546,5.4c-.6,0-1.104-.1-1.512-.3-.408-.208-.768-.492-1.08-.852l.936-.912c.232.264.484.472.756.624.28.152.6.228.96.228.368,0,.632-.064.792-.192.168-.128.252-.304.252-.528c0-.184-.06-.328-.18-.432-.112-.112-.308-.188-.588-.228l-.624-.084c-.68-.088-1.2-.28-1.56-.576-.352-.304-.528-.744-.528-1.32c0-.304.056-.576.168-.816.112-.248.272-.456.48-.624.208-.176.456-.308.744-.396.296-.096.624-.144.984-.144.304,0,.572.024.804.072.24.04.456.104.648.192.192.08.368.184.528.312.16.12.316.256.468.408l-.9.9c-.184-.192-.404-.352-.66-.48s-.536-.192-.84-.192c-.336,0-.58.06-.732.18-.144.12-.216.276-.216.468c0,.208.06.368.18.48.128.104.34.18.636.228l.636.084c1.352.192,2.028.808,2.028,1.848c0,.304-.064.584-.192.84-.12.248-.292.464-.516.648-.224.176-.496.316-.816.42-.312.096-.664.144-1.056.144Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.8978",
                  height: "42.8978",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 152.667028 146.333186)",
                  fill: "none",
                  stroke: "#0c9bed",
                  strokeWidth: "1.69227",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M38.984,166v-8.376h3.768c.384,0,.728.064,1.032.192.312.12.576.296.792.528.216.224.38.496.492.816s.168.672.168,1.056c0,.392-.056.748-.168,1.068-.112.312-.276.584-.492.816-.216.224-.48.4-.792.528-.304.12-.648.18-1.032.18h-2.184v3.192h-1.584Zm1.584-4.56h2.04c.304,0,.544-.08.72-.24.176-.168.264-.404.264-.708v-.552c0-.304-.088-.536-.264-.696s-.416-.24-.72-.24h-2.04v2.436Zm8.2763,4.704c-.448,0-.852-.076-1.212-.228-.352-.152-.656-.372-.912-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368s.068-.956.204-1.356.328-.74.576-1.02c.256-.288.56-.508.912-.66.36-.152.764-.228,1.212-.228s.852.076,1.212.228.664.372.912.66c.256.28.452.62.588,1.02s.204.852.204,1.356-.068.96-.204,1.368c-.136.4-.332.744-.588,1.032-.248.288-.552.508-.912.66s-.764.228-1.212.228Zm0-1.236c.408,0,.728-.124.96-.372s.348-.612.348-1.092v-1.164c0-.472-.116-.832-.348-1.08s-.552-.372-.96-.372c-.4,0-.716.124-.948.372s-.348.608-.348,1.08v1.164c0,.48.116.844.348,1.092s.548.372.948.372Zm4.2969-5.172h1.536v1.032h.048c.112-.36.324-.644.636-.852.312-.216.676-.324,1.092-.324.8,0,1.408.284,1.824.852.424.56.636,1.364.636,2.412c0,1.056-.212,1.868-.636,2.436-.416.568-1.024.852-1.824.852-.416,0-.78-.108-1.092-.324-.304-.216-.516-.504-.636-.864h-.048v3.444h-1.536v-8.664Zm2.82,5.136c.4,0,.724-.132.972-.396s.372-.62.372-1.068v-1.08c0-.448-.124-.804-.372-1.068-.248-.272-.572-.408-.972-.408-.368,0-.676.092-.924.276-.24.184-.36.428-.36.732v1.992c0,.328.12.58.36.756.248.176.556.264.924.264Zm8.1386.084h-.06c-.056.16-.132.312-.228.456-.088.136-.204.26-.348.372-.136.112-.304.2-.504.264-.192.064-.416.096-.672.096-.648,0-1.144-.212-1.488-.636s-.516-1.028-.516-1.812v-3.96h1.536v3.804c0,.432.084.764.252.996.168.224.436.336.804.336.152,0,.3-.02.444-.06.152-.04.284-.1.396-.18.112-.088.204-.192.276-.312.072-.128.108-.276.108-.444v-4.14h1.536v6.264h-1.536v-1.044ZM68.9656,166c-.528,0-.916-.132-1.164-.396s-.372-.636-.372-1.116v-7.368h1.536v7.656h.828v1.224h-.828Zm6.6186,0c-.336,0-.604-.096-.804-.288-.192-.2-.312-.464-.36-.792h-.072c-.104.408-.316.716-.636.924-.32.2-.716.3-1.188.3-.64,0-1.132-.168-1.476-.504s-.516-.784-.516-1.344c0-.648.232-1.128.696-1.44.464-.32,1.124-.48,1.98-.48h1.068v-.456c0-.352-.092-.624-.276-.816s-.48-.288-.888-.288c-.36,0-.652.08-.876.24-.216.152-.4.336-.552.552l-.912-.816c.232-.36.54-.648.924-.864.384-.224.892-.336,1.524-.336.848,0,1.492.192,1.932.576s.66.936.66,1.656v2.952h.624v1.224h-.852Zm-2.544-.972c.344,0,.636-.076.876-.228s.36-.376.36-.672v-.828h-.984c-.8,0-1.2.256-1.2.768v.204c0,.256.08.448.24.576.168.12.404.18.708.18Zm6.5674.972c-.528,0-.932-.136-1.212-.408-.272-.28-.408-.676-.408-1.188v-3.444h-.924v-1.224h.48c.232,0,.388-.052.468-.156.088-.112.132-.276.132-.492v-1.068h1.38v1.716h1.284v1.224h-1.284v3.816h1.188v1.224h-1.104Zm3.3195-7.176c-.32,0-.552-.072-.696-.216-.136-.144-.204-.328-.204-.552v-.24c0-.224.068-.408.204-.552.144-.144.376-.216.696-.216.312,0,.54.072.684.216s.216.328.216.552v.24c0,.224-.072.408-.216.552s-.372.216-.684.216Zm-.768.912h1.536v6.264h-1.536v-6.264Zm5.8196,6.408c-.448,0-.852-.076-1.212-.228-.352-.152-.656-.372-.912-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368s.068-.956.204-1.356.328-.74.576-1.02c.256-.288.56-.508.912-.66.36-.152.764-.228,1.212-.228s.852.076,1.212.228.664.372.912.66c.256.28.452.62.588,1.02s.204.852.204,1.356-.068.96-.204,1.368c-.136.4-.332.744-.588,1.032-.248.288-.552.508-.912.66s-.764.228-1.212.228Zm0-1.236c.408,0,.728-.124.96-.372s.348-.612.348-1.092v-1.164c0-.472-.116-.832-.348-1.08s-.552-.372-.96-.372c-.4,0-.716.124-.948.372s-.348.608-.348,1.08v1.164c0,.48.116.844.348,1.092s.548.372.948.372ZM92.2756,166v-6.264h1.536v1.044h.06c.128-.336.328-.616.6-.84.28-.232.664-.348,1.152-.348.648,0,1.144.212,1.488.636s.516,1.028.516,1.812v3.96h-1.536v-3.804c0-.448-.08-.784-.24-1.008s-.424-.336-.792-.336c-.16,0-.316.024-.468.072-.144.04-.276.104-.396.192-.112.08-.204.184-.276.312-.072.12-.108.264-.108.432v4.14h-1.536Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 152.375014 146.608822)",
                  fill: "none",
                  stroke: "#0c9bed",
                  strokeWidth: "1.68825",
                  strokeDasharray: "3.38,3.38"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M178.517,152.716c-.455-.007-.909-.094-1.363-.26-.455-.165-.869-.445-1.244-.838-.375-.397-.676-.932-.903-1.606-.228-.678-.341-1.529-.341-2.553c0-.981.092-1.85.276-2.607.184-.761.45-1.401.8-1.92.35-.523.772-.919,1.266-1.19.497-.27,1.058-.406,1.682-.406.62,0,1.172.125,1.655.374.487.245.883.587,1.19,1.027.306.44.505.947.595,1.52h-1.32c-.123-.498-.361-.91-.714-1.238-.353-.329-.822-.493-1.406-.493-.858,0-1.534.374-2.028,1.12-.491.746-.738,1.794-.741,3.142h.086c.202-.306.442-.568.72-.784.281-.22.591-.389.93-.508s.697-.179,1.076-.179c.635,0,1.215.159,1.742.476.526.314.948.748,1.265,1.304.318.551.476,1.184.476,1.898c0,.685-.153,1.312-.46,1.882-.306.566-.737,1.017-1.292,1.352-.552.332-1.201.494-1.947.487Zm0-1.19c.454,0,.861-.113,1.222-.341.364-.227.651-.531.86-.914.213-.382.319-.807.319-1.276c0-.458-.103-.874-.308-1.249-.202-.379-.482-.68-.838-.904-.354-.223-.758-.335-1.212-.335-.343,0-.662.069-.957.206-.296.133-.556.317-.779.551-.22.235-.393.503-.519.806-.127.299-.19.615-.19.947c0,.439.103.851.309,1.233.209.382.494.69.854.925.364.234.777.351,1.239.351Zm9.374,1.19c-.743,0-1.399-.132-1.969-.395-.566-.267-1.007-.633-1.325-1.098-.317-.468-.474-1.002-.47-1.601-.004-.468.088-.901.276-1.298.187-.4.443-.733.768-1c.328-.271.694-.442,1.098-.514v-.065c-.531-.137-.952-.434-1.266-.892-.314-.462-.469-.987-.465-1.574-.004-.563.139-1.066.427-1.509.289-.444.685-.794,1.19-1.05.508-.256,1.087-.384,1.736-.384.642,0,1.215.128,1.72.384s.901.606,1.19,1.05c.292.443.44.946.443,1.509-.003.587-.164,1.112-.481,1.574-.314.458-.73.755-1.249.892v.065c.4.072.76.243,1.081.514.321.267.577.6.768,1c.191.397.289.83.292,1.298-.003.599-.165,1.133-.486,1.601-.318.465-.759.831-1.325,1.098-.563.263-1.214.395-1.953.395Zm0-1.19c.501,0,.934-.081,1.298-.243.364-.163.646-.391.844-.687s.299-.642.303-1.039c-.004-.418-.112-.787-.325-1.108s-.503-.574-.871-.758c-.364-.183-.78-.275-1.249-.275-.472,0-.894.092-1.266.275-.367.184-.658.437-.87.758-.209.321-.312.69-.309,1.108-.003.397.092.743.287,1.039.198.296.481.524.849.687.368.162.804.243,1.309.243Zm0-5.257c.397,0,.748-.079,1.055-.238.31-.159.553-.38.73-.665s.267-.619.27-1.001c-.003-.375-.092-.701-.265-.979-.173-.281-.413-.497-.719-.649-.307-.155-.663-.232-1.071-.232-.415,0-.777.077-1.087.232-.31.152-.55.368-.719.649-.17.278-.253.604-.249.979-.004.382.081.716.254,1.001.177.285.42.506.73.665s.667.238,1.071.238Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "42.7958",
                  height: "42.7958",
                  rx: "0",
                  ry: "0",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 152.375014 146.608822)",
                  fill: "#051626"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  r: "16.6163",
                  transform: "matrix(.707107-.707107 0.707107 0.707107 182.635972 146.609064)",
                  fill: "#7fdcf1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M178.164,153.008c-.454-.008-.907-.094-1.36-.259-.453-.166-.867-.445-1.241-.837-.374-.395-.675-.93-.901-1.602-.227-.676-.34-1.525-.34-2.547c0-.978.092-1.845.275-2.601.183-.759.45-1.397.799-1.915.348-.522.769-.917,1.262-1.187.497-.27,1.056-.405,1.678-.405.619,0,1.169.124,1.651.372.486.245.882.587,1.187,1.026.306.438.504.944.594,1.516h-1.317c-.122-.497-.359-.908-.712-1.236-.352-.327-.82-.491-1.403-.491-.856,0-1.53.372-2.023,1.117-.489.745-.736,1.79-.739,3.135h.086c.201-.306.441-.567.718-.782.28-.22.589-.389.928-.508.338-.118.696-.178,1.073-.178.633,0,1.213.159,1.738.475.525.313.946.747,1.262,1.301.317.55.475,1.181.475,1.893c0,.684-.153,1.31-.458,1.878-.306.565-.736,1.015-1.29,1.349-.55.331-1.198.493-1.942.486Zm0-1.187c.453,0,.859-.114,1.219-.34.363-.227.649-.531.858-.912.212-.381.318-.806.318-1.274c0-.456-.102-.872-.307-1.246-.202-.378-.481-.678-.837-.901-.352-.223-.755-.335-1.208-.335-.342,0-.66.069-.955.205-.295.134-.554.317-.777.551-.22.234-.392.502-.518.804-.126.298-.189.613-.189.944c0,.439.102.849.307,1.23.209.382.493.689.853.923.363.234.775.351,1.236.351Zm9.352,1.187c-.741,0-1.396-.132-1.964-.394-.565-.266-1.006-.632-1.322-1.096-.317-.467-.473-1-.47-1.597-.003-.467.088-.899.275-1.295.187-.399.443-.732.767-.998.327-.27.692-.44,1.095-.512v-.065c-.529-.137-.95-.434-1.263-.89-.313-.461-.467-.984-.464-1.571-.003-.561.139-1.063.427-1.505.287-.442.683-.791,1.187-1.047.507-.255,1.084-.383,1.732-.383.64,0,1.212.128,1.715.383.504.256.9.605,1.187,1.047.292.442.439.944.443,1.505-.004.587-.164,1.11-.48,1.571-.313.456-.729.753-1.247.89v.065c.4.072.759.242,1.079.512.321.266.576.599.767.998.19.396.287.828.291,1.295-.004.597-.165,1.13-.486,1.597-.316.464-.757.83-1.322,1.096-.561.262-1.21.394-1.947.394Zm0-1.187c.5,0,.931-.081,1.295-.243.363-.162.643-.39.841-.685s.299-.641.302-1.036c-.003-.418-.111-.786-.323-1.107-.213-.32-.502-.571-.869-.755-.363-.183-.779-.275-1.246-.275-.472,0-.893.092-1.263.275-.367.184-.656.435-.869.755-.208.321-.311.689-.307,1.107-.004.395.091.741.286,1.036.198.295.48.523.847.685s.802.243,1.306.243Zm0-5.245c.395,0,.746-.079,1.052-.237.309-.159.552-.38.728-.664s.266-.617.27-.998c-.004-.374-.092-.7-.264-.977-.173-.28-.412-.496-.718-.647-.306-.155-.662-.232-1.068-.232-.414,0-.776.077-1.085.232-.309.151-.549.367-.718.647-.169.277-.251.603-.248.977-.003.381.081.714.254.998.176.284.419.505.728.664.31.158.666.237,1.069.237Z",
                  fill: "#2e3d4a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(256.5 277.5)", fill: "#0c9bed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(267.5 277.5)", fill: "#fff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "7",
                  height: "7",
                  rx: "3.5",
                  ry: "3.5",
                  transform: "translate(241.920994 274)",
                  fill: "#fff"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { id: "eWMaDkTemOR233", transform: "translate(.000001 0)", opacity: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "154",
                  height: "21",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.5 121.5)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "154",
                  height: "21",
                  rx: "0",
                  ry: "0",
                  transform: "translate(30.5 150.5)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M90.8002,158l-20.8-10.4v-20.8l20.8-10.4L111.6,126.8v20.8L90.8002,158Z",
                  fill: "#8c7f39"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M111.6,126.8L90.8001,116.4v-20.8001l20.7999-10.4l20.8,10.4v20.8001l-20.8,10.4Z",
                  fill: "#53986a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M132.4,158l-20.8-10.4v-20.8l20.8-10.4l20.8,10.4v20.8L132.4,158Z",
                  fill: "#53986a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M132.4,220.4L111.6,210v-20.8l20.8-10.4l20.8,10.4v20.8l-20.8,10.4Z",
                  fill: "#8cdb95"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M153.2,189.2l-20.8-10.4v-20.8l20.8-10.4L174,158v20.8l-20.8,10.4Z",
                  fill: "#8cdb95"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M90.8002,95.6l-20.8-10.4v-20.8l20.8-10.4L111.6,64.4v20.8L90.8002,95.6Z",
                  fill: "#53986a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M49.2002,95.6l-20.8-10.4v-20.8L49.2003,54L70.0002,64.4v20.8l-20.8,10.4Z",
                  fill: "#9fab57"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M49.2002,220.4l-20.8-10.4v-20.8l20.8-10.4l20.8,10.4v20.8l-20.8,10.4Z",
                  fill: "#9fab57"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M90.8002,220.4l-20.8-10.4v-20.8l20.8-10.4L111.6,189.2v20.8L90.8002,220.4Z",
                  fill: "#9fab57"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M111.6,189.2L90.8001,178.8v-20.8L111.6,147.6L132.4,158v20.8l-20.8,10.4Z",
                  fill: "#8c7f39"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M7.59996,220.4L-13.2,210v-20.8L7.59997,178.8L28.4,189.2v20.8L7.59996,220.4Z",
                  fill: "#9fab57"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M7.59996,158L-13.2,147.6v-20.8L7.59997,116.4L28.4,126.8v20.8L7.59996,158Z",
                  fill: "#a9da7a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M-13.2,189.2L-34,178.8v-20.8l20.8-10.4L7.59998,158v20.8L-13.2,189.2Z",
                  fill: "#a9da7a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M28.4003,126.8L7.60032,116.4v-20.8001l20.79998-10.4l20.8,10.4v20.8001l-20.8,10.4Z",
                  fill: "#9fab57"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M49.2002,158l-20.8-10.4v-20.8l20.8-10.4l20.8,10.4v20.8l-20.8,10.4Z",
                  fill: "#e41a1c"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M70.0002,189.2l-20.8-10.4v-20.8l20.8-10.4l20.8,10.4v20.8l-20.8,10.4Z",
                  fill: "#d89f58"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M28.4003,189.2L7.60032,178.8v-20.8L28.4003,147.6l20.8,10.4v20.8l-20.8,10.4Z",
                  fill: "#e8e89d"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M70.0002,126.8l-20.8-10.4v-20.8001l20.8-10.4l20.8,10.4v20.8001l-20.8,10.4Z",
                  fill: "#e41a1c"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "154",
                  height: "21",
                  rx: "0",
                  ry: "0",
                  transform: "translate(68.5 121.5)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M76.984,137v-8.376h5.388v1.404h-3.804v2.028h3.312v1.404h-3.312v3.54h-1.584Zm7.617-7.176c-.32,0-.552-.072-.696-.216-.136-.144-.204-.328-.204-.552v-.24c0-.224.068-.408.204-.552.144-.144.376-.216.696-.216.312,0,.54.072.684.216s.216.328.216.552v.24c0,.224-.072.408-.216.552s-.372.216-.684.216Zm-.768.912h1.536v6.264h-1.536v-6.264ZM87.1686,137v-6.264h1.536v1.296h.06c.04-.168.1-.328.18-.48.088-.16.2-.3.336-.42s.296-.216.48-.288c.192-.072.412-.108.66-.108h.336v1.452h-.48c-.52,0-.912.076-1.176.228s-.396.4-.396.744v3.84h-1.536Zm7.2035.144c-.464,0-.88-.076-1.248-.228-.36-.16-.668-.38-.924-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368c0-.496.064-.944.192-1.344.136-.4.328-.74.576-1.02.248-.288.552-.508.912-.66.36-.16.768-.24,1.224-.24.488,0,.912.084,1.272.252s.656.396.888.684.404.624.516,1.008c.12.376.18.78.18,1.212v.504h-4.164v.156c0,.456.128.824.384,1.104.256.272.636.408,1.14.408.384,0,.696-.08.936-.24.248-.16.468-.364.66-.612l.828.924c-.256.36-.608.644-1.056.852-.44.2-.952.3-1.536.3Zm-.024-5.4c-.408,0-.732.136-.972.408s-.36.624-.36,1.056v.096h2.568v-.108c0-.432-.108-.78-.324-1.044-.208-.272-.512-.408-.912-.408Zm6.2549,5.4c-.6,0-1.1043-.1-1.5123-.3-.408-.208-.768-.492-1.08-.852l.936-.912c.232.264.484.472.756.624.28.152.6003.228.9603.228.368,0,.632-.064.792-.192.168-.128.252-.304.252-.528c0-.184-.06-.328-.18-.432-.112-.112-.308-.188-.588-.228l-.624-.084c-.6803-.088-1.2003-.28-1.5603-.576-.352-.304-.528-.744-.528-1.32c0-.304.056-.576.168-.816.112-.248.272-.456.48-.624.208-.176.456-.308.744-.396.296-.096.6243-.144.9843-.144.304,0,.572.024.804.072.24.04.456.104.648.192.192.08.368.184.528.312.16.12.316.256.468.408l-.9.9c-.184-.192-.404-.352-.66-.48s-.536-.192-.84-.192c-.336,0-.58.06-.7323.18-.144.12-.216.276-.216.468c0,.208.06.368.18.48.1283.104.3403.18.6363.228l.636.084c1.352.192,2.028.808,2.028,1.848c0,.304-.064.584-.192.84-.12.248-.292.464-.516.648-.224.176-.496.316-.816.42-.312.096-.664.144-1.056.144Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "154",
                  height: "21",
                  rx: "0",
                  ry: "0",
                  transform: "translate(68.5 150.5)",
                  fill: "#2e3d4a",
                  stroke: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M76.984,166v-8.376h3.768c.384,0,.728.064,1.032.192.312.12.576.296.792.528.216.224.38.496.492.816s.168.672.168,1.056c0,.392-.056.748-.168,1.068-.112.312-.276.584-.492.816-.216.224-.48.4-.792.528-.304.12-.648.18-1.032.18h-2.184v3.192h-1.584Zm1.584-4.56h2.04c.304,0,.544-.08.72-.24.176-.168.264-.404.264-.708v-.552c0-.304-.088-.536-.264-.696s-.416-.24-.72-.24h-2.04v2.436Zm8.2763,4.704c-.448,0-.852-.076-1.212-.228-.352-.152-.656-.372-.912-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368s.068-.956.204-1.356.328-.74.576-1.02c.256-.288.56-.508.912-.66.36-.152.764-.228,1.212-.228s.852.076,1.212.228.664.372.912.66c.256.28.452.62.588,1.02s.204.852.204,1.356-.068.96-.204,1.368c-.136.4-.332.744-.588,1.032-.248.288-.552.508-.912.66s-.764.228-1.212.228Zm0-1.236c.408,0,.728-.124.96-.372s.348-.612.348-1.092v-1.164c0-.472-.116-.832-.348-1.08s-.552-.372-.96-.372c-.4,0-.716.124-.948.372s-.348.608-.348,1.08v1.164c0,.48.116.844.348,1.092s.548.372.948.372Zm4.2969-5.172h1.536v1.032h.048c.112-.36.324-.644.636-.852.312-.216.676-.324,1.092-.324.8,0,1.408.284,1.824.852.424.56.636,1.364.636,2.412c0,1.056-.212,1.868-.636,2.436-.416.568-1.024.852-1.824.852-.416,0-.78-.108-1.092-.324-.304-.216-.516-.504-.636-.864h-.048v3.444h-1.536v-8.664Zm2.82,5.136c.4,0,.724-.132.972-.396s.372-.62.372-1.068v-1.08c0-.448-.124-.804-.372-1.068-.248-.272-.572-.408-.972-.408-.368,0-.676.092-.924.276-.24.184-.36.428-.36.732v1.992c0,.328.12.58.36.756.248.176.556.264.924.264Zm8.1388.084h-.06c-.056.16-.132.312-.228.456-.088.136-.204.26-.348.372-.136.112-.304.2-.504.264-.192.064-.416.096-.672.096-.6482,0-1.1442-.212-1.4882-.636s-.516-1.028-.516-1.812v-3.96h1.536v3.804c0,.432.084.764.2522.996.168.224.436.336.804.336.152,0,.3-.02.444-.06.152-.04.284-.1.396-.18.112-.088.204-.192.276-.312.072-.128.108-.276.108-.444v-4.14h1.536v6.264h-1.536v-1.044ZM106.966,166c-.528,0-.916-.132-1.164-.396s-.372-.636-.372-1.116v-7.368h1.536v7.656h.828v1.224h-.828Zm6.618,0c-.336,0-.604-.096-.804-.288-.192-.2-.312-.464-.36-.792h-.072c-.104.408-.316.716-.636.924-.32.2-.716.3-1.188.3-.64,0-1.132-.168-1.476-.504s-.516-.784-.516-1.344c0-.648.232-1.128.696-1.44.464-.32,1.124-.48,1.98-.48h1.068v-.456c0-.352-.092-.624-.276-.816s-.48-.288-.888-.288c-.36,0-.652.08-.876.24-.216.152-.4.336-.552.552l-.912-.816c.232-.36.54-.648.924-.864.384-.224.892-.336,1.524-.336.848,0,1.492.192,1.932.576s.66.936.66,1.656v2.952h.624v1.224h-.852Zm-2.544-.972c.344,0,.636-.076.876-.228s.36-.376.36-.672v-.828h-.984c-.8,0-1.2.256-1.2.768v.204c0,.256.08.448.24.576.168.12.404.18.708.18Zm6.568.972c-.528,0-.932-.136-1.212-.408-.272-.28-.408-.676-.408-1.188v-3.444h-.924v-1.224h.48c.232,0,.388-.052.468-.156.088-.112.132-.276.132-.492v-1.068h1.38v1.716h1.284v1.224h-1.284v3.816h1.188v1.224h-1.104Zm3.319-7.176c-.32,0-.552-.072-.696-.216-.136-.144-.204-.328-.204-.552v-.24c0-.224.068-.408.204-.552.144-.144.376-.216.696-.216.312,0,.54.072.684.216s.216.328.216.552v.24c0,.224-.072.408-.216.552s-.372.216-.684.216Zm-.768.912h1.536v6.264h-1.536v-6.264Zm5.82,6.408c-.448,0-.852-.076-1.212-.228-.352-.152-.656-.372-.912-.66-.248-.288-.44-.632-.576-1.032-.136-.408-.204-.864-.204-1.368s.068-.956.204-1.356.328-.74.576-1.02c.256-.288.56-.508.912-.66.36-.152.764-.228,1.212-.228s.852.076,1.212.228.664.372.912.66c.256.28.452.62.588,1.02s.204.852.204,1.356-.068.96-.204,1.368c-.136.4-.332.744-.588,1.032-.248.288-.552.508-.912.66s-.764.228-1.212.228Zm0-1.236c.408,0,.728-.124.96-.372s.348-.612.348-1.092v-1.164c0-.472-.116-.832-.348-1.08s-.552-.372-.96-.372c-.4,0-.716.124-.948.372s-.348.608-.348,1.08v1.164c0,.48.116.844.348,1.092s.548.372.948.372ZM130.276,166v-6.264h1.536v1.044h.06c.128-.336.328-.616.6-.84.28-.232.664-.348,1.152-.348.648,0,1.144.212,1.488.636s.516,1.028.516,1.812v3.96h-1.536v-3.804c0-.448-.08-.784-.24-1.008s-.424-.336-.792-.336c-.16,0-.316.024-.468.072-.144.04-.276.104-.396.192-.112.08-.204.184-.276.312-.072.12-.108.264-.108.432v4.14h-1.536Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M155.252,45.764c0,.048.004.108.012.18s.016.148.024.228.016.156.024.228c.008.064.012.112.012.144c0,.344-.156.516-.468.516-.256,0-.436-.084-.54-.252l-.108-.864v-.096c0-.056-.004-.128-.012-.216s-.02-.176-.036-.264c-.008-.088-.016-.168-.024-.24s-.012-.124-.012-.156c.008-.056.012-.108.012-.156.008-.056.012-.112.012-.168c0-.088-.004-.168-.012-.24-.008-.08-.02-.16-.036-.24-.064.016-.2.04-.408.072-.208.024-.464.036-.768.036-.136,0-.264-.004-.384-.012-.112-.008-.216-.02-.312-.036-.096-.048-.404-.072-.924-.072-.016.184-.028.356-.036.516-.008.152-.012.292-.012.42c0,.264.02.464.06.6.032.392.056.688.072.888.024.2.04.344.048.432s.012.14.012.156s0,.036,0,.06c0,.232-.16.348-.48.348-.112,0-.212-.024-.3-.072-.08-.04-.148-.116-.204-.228-.056-.104-.1-.252-.132-.444s-.052-.432-.06-.72c-.048-.2-.072-.464-.072-.792c0-.104,0-.2,0-.288.008-.088.012-.164.012-.228s-.004-.116-.012-.156c0-.048,0-.088,0-.12c0,.016,0-.036,0-.156s.004-.26.012-.42c.016-.168.032-.332.048-.492.016-.168.04-.292.072-.372c0-.016-.004-.032-.012-.048c0-.024,0-.048,0-.072c0-.176.008-.332.024-.468s.032-.268.048-.396c.024-.128.048-.26.072-.396.032-.144.06-.312.084-.504.04-.272.088-.472.144-.6s.184-.192.384-.192c.104,0,.212.036.324.108.12.072.18.176.18.312c0,.072-.004.168-.012.288c0,.112-.008.26-.024.444-.016.176-.036.392-.06.648s-.056.56-.096.912c.104.04.248.06.432.06.064,0,.116,0,.156,0c.048-.008.092-.012.132-.012.112,0,.188.012.228.036.048.016.124.024.228.024.216,0,.38-.004.492-.012.112-.016.168-.02.168-.012h.18c.16,0,.308-.004.444-.012.144-.016.216-.068.216-.156c0-.216-.036-.512-.108-.888v-.216c0-.112-.004-.22-.012-.324-.008-.112-.024-.212-.048-.3c0-.32.2-.48.6-.48.184,0,.312.096.384.288.08.184.132.404.156.66.032.256.048.52.048.792.008.264.036.476.084.636c0,.208.004.456.012.744.016.28.04.608.072.984-.008.04-.012.088-.012.144s0,.116,0,.18c0,.072,0,.152,0,.24c0,.08.004.168.012.264Zm6.251.756c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Zm6.175-1.032c.128.08.192.232.192.456c0,.168-.044.312-.132.432s-.208.18-.36.18c-.096,0-.196-.024-.3-.072-.096-.056-.2-.084-.312-.084-.096,0-.192.02-.288.06-.088.032-.192.108-.312.228l-.36.36c0,.056,0,.112,0,.168.008.056.012.116.012.18c0,.096-.004.196-.012.3c0,.104-.004.216-.012.336l.108,1.092c-.024.368-.212.552-.564.552-.184,0-.32-.056-.408-.168-.088-.12-.148-.284-.18-.492s-.048-.452-.048-.732c.008-.28.008-.588,0-.924-.016-.504-.028-.756-.036-.756v.012c-.032-.12-.056-.224-.072-.312-.016-.096-.024-.18-.024-.252c0-.144.052-.26.156-.348.104-.096.256-.144.456-.144.128,0,.28.1.456.3.184-.144.324-.252.42-.324.104-.072.188-.124.252-.156.072-.032.14-.048.204-.048.064-.008.148-.012.252-.012.088-.008.168-.004.24.012.08.016.164.032.252.048l.42.108Zm5.494,3.6c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Zm12.269,1.632c.144.096.216.212.216.348c0,.072-.02.148-.06.228-.04.072-.092.14-.156.204-.064.056-.132.104-.204.144s-.144.06-.216.06c-.064-.024-.14-.064-.228-.12-.088-.064-.176-.132-.264-.204-.088-.08-.172-.168-.252-.264-.072-.096-.128-.192-.168-.288l-.084.204c-.152.288-.392.56-.72.816-.4.072-.632.108-.696.108-.152,0-.336-.024-.552-.072l-.66-.468c-.288-.272-.432-.644-.432-1.116c0-.168.024-.352.072-.552.056-.208.132-.416.228-.624.104-.208.228-.412.372-.612s.312-.38.504-.54c.232-.088.456-.16.672-.216.216-.064.38-.104.492-.12.152-.168.332-.252.54-.252.12,0,.224.06.312.18.096.112.176.256.24.432.072.176.128.372.168.588.04.208.068.408.084.6l.156.636c.048.2.124.372.228.516.112.144.248.272.408.384Zm-1.824-1.332c-.016-.008-.076-.26-.18-.756-.04,0-.1,0-.18,0s-.176.024-.288.072c-.104.04-.22.116-.348.228-.12.104-.236.264-.348.48-.168.312-.252.624-.252.936.136.264.348.472.636.624.088-.024.16-.052.216-.084.064-.032.12-.076.168-.132s.092-.124.132-.204c.048-.088.1-.196.156-.324.104-.184.176-.344.216-.48.048-.144.072-.264.072-.36Zm6.358-1.332c.128.08.192.232.192.456c0,.168-.044.312-.132.432s-.208.18-.36.18c-.096,0-.196-.024-.3-.072-.096-.056-.2-.084-.312-.084-.096,0-.192.02-.288.06-.088.032-.192.108-.312.228l-.36.36c0,.056,0,.112,0,.168.008.056.012.116.012.18c0,.096-.004.196-.012.3c0,.104-.004.216-.012.336l.108,1.092c-.024.368-.212.552-.564.552-.184,0-.32-.056-.408-.168-.088-.12-.148-.284-.18-.492s-.048-.452-.048-.732c.008-.28.008-.588,0-.924-.016-.504-.028-.756-.036-.756v.012c-.032-.12-.056-.224-.072-.312-.016-.096-.024-.18-.024-.252c0-.144.052-.26.156-.348.104-.096.256-.144.456-.144.128,0,.28.1.456.3.184-.144.324-.252.42-.324.104-.072.188-.124.252-.156.072-.032.14-.048.204-.048.064-.008.148-.012.252-.012.088-.008.168-.004.24.012.08.016.164.032.252.048l.42.108Zm5.494,3.6c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Zm12.27,1.632c.144.096.216.212.216.348c0,.072-.02.148-.06.228-.04.072-.092.14-.156.204-.064.056-.132.104-.204.144s-.144.06-.216.06c-.064-.024-.14-.064-.228-.12-.088-.064-.176-.132-.264-.204-.088-.08-.172-.168-.252-.264-.072-.096-.128-.192-.168-.288l-.084.204c-.152.288-.392.56-.72.816-.4.072-.632.108-.696.108-.152,0-.336-.024-.552-.072l-.66-.468c-.288-.272-.432-.644-.432-1.116c0-.168.024-.352.072-.552.056-.208.132-.416.228-.624.104-.208.228-.412.372-.612s.312-.38.504-.54c.232-.088.456-.16.672-.216.216-.064.38-.104.492-.12.152-.168.332-.252.54-.252.12,0,.224.06.312.18.096.112.176.256.24.432.072.176.128.372.168.588.04.208.068.408.084.6l.156.636c.048.2.124.372.228.516.112.144.248.272.408.384Zm-1.824-1.332c-.016-.008-.076-.26-.18-.756-.04,0-.1,0-.18,0s-.176.024-.288.072c-.104.04-.22.116-.348.228-.12.104-.236.264-.348.48-.168.312-.252.624-.252.936.136.264.348.472.636.624.088-.024.16-.052.216-.084.064-.032.12-.076.168-.132s.092-.124.132-.204c.048-.088.1-.196.156-.324.104-.184.176-.344.216-.48.048-.144.072-.264.072-.36Zm4.966-3.564c-.016.2-.064.428-.144.684-.072.248-.124.452-.156.612v.144c0,.112-.008.232-.024.36s-.032.252-.048.372c-.016.112-.036.212-.06.3-.016.088-.024.148-.024.18-.008.04-.012.136-.012.288s0,.356,0,.612v.144c0,.16-.008.3-.024.42s-.036.228-.06.324l.108.9c.032.088.14.22.324.396-.04.144-.144.276-.312.396-.168.112-.34.168-.516.168-.24,0-.424-.112-.552-.336-.12-.232-.18-.616-.18-1.152c0-.088.004-.164.012-.228.016-.064.024-.144.024-.24c0-.192-.024-.432-.072-.72.04-.088.068-.2.084-.336.024-.136.04-.264.048-.384.008-.128.012-.236.012-.324s0-.124,0-.108c0,.008.008-.048.024-.168.024-.12.048-.26.072-.42.024-.168.044-.34.06-.516.024-.176.036-.316.036-.42v-.096l.204-1.008c.104-.176.284-.264.54-.264.28,0,.492.14.636.42Zm4.833,6.012c-.104.072-.272.144-.504.216-.232.064-.472.12-.72.168l-.492-.096c-.072-.024-.192-.08-.36-.168-.16-.088-.324-.22-.492-.396-.168-.184-.316-.416-.444-.696-.128-.288-.192-.636-.192-1.044c0-.144.032-.312.096-.504.072-.2.176-.384.312-.552.136-.176.304-.324.504-.444.208-.12.448-.18.72-.18.544,0,1.036.176,1.476.528.384.528.576,1.112.576,1.752c0,.472-.16.944-.48,1.416Zm-.588-1.704c-.04-.312-.14-.556-.3-.732-.152-.184-.348-.276-.588-.276-.16,0-.312.08-.456.24-.136.152-.204.376-.204.672c0,.12.016.248.048.384.032.128.084.248.156.36.072.104.164.192.276.264.112.064.248.096.408.096.256,0,.432-.076.528-.228.096-.16.144-.356.144-.588c0-.032-.004-.06-.012-.084c0-.032,0-.068,0-.108Zm5.542-2.52c.088.072.132.204.132.396c0,.352-.132.528-.396.528h-.048c-.12.008-.26.02-.42.036-.16.008-.34.024-.54.048-.016.128-.032.3-.048.516-.016.208-.024.46-.024.756c0,.024,0,.048,0,.072.008.024.012.052.012.084v.552c0,.128.02.232.06.312.048.072.104.124.168.156l.336.108c.264.088.396.248.396.48c0,.136-.056.256-.168.36-.104.104-.24.156-.408.156-.048,0-.132-.012-.252-.036-.112-.032-.232-.072-.36-.12-.12-.048-.236-.108-.348-.18-.104-.072-.176-.152-.216-.24-.088-.184-.16-.376-.216-.576-.056-.208-.084-.424-.084-.648c0-.248.004-.424.012-.528s.016-.196.024-.276.016-.176.024-.288.012-.296.012-.552c-.152.016-.376.064-.672.144-.176,0-.328-.044-.456-.132-.12-.096-.18-.22-.18-.372c0-.112.032-.216.096-.312.072-.096.216-.18.432-.252.072-.024.136-.04.192-.048.064-.008.124-.016.18-.024.064-.008.132-.012.204-.012.072-.008.16-.02.264-.036.008-.2.02-.424.036-.672.024-.256.06-.492.108-.708.056-.216.132-.396.228-.54.104-.152.24-.228.408-.228.288,0,.464.132.528.396c0,.008-.012.064-.036.168-.016.096-.036.204-.06.324s-.048.236-.072.348c-.016.112-.024.184-.024.216l-.036.588c.056-.008.108-.012.156-.012.048-.008.1-.012.156-.012h.108c.056,0,.108,0,.156,0c.048-.008.092-.012.132-.012.24,0,.408.024.504.072Zm9.308,4.224c-.104.072-.272.144-.504.216-.232.064-.472.12-.72.168l-.492-.096c-.072-.024-.192-.08-.36-.168-.16-.088-.324-.22-.492-.396-.168-.184-.316-.416-.444-.696-.128-.288-.192-.636-.192-1.044c0-.144.032-.312.096-.504.072-.2.176-.384.312-.552.136-.176.304-.324.504-.444.208-.12.448-.18.72-.18.544,0,1.036.176,1.476.528.384.528.576,1.112.576,1.752c0,.472-.16.944-.48,1.416Zm-.588-1.704c-.04-.312-.14-.556-.3-.732-.152-.184-.348-.276-.588-.276-.16,0-.312.08-.456.24-.136.152-.204.376-.204.672c0,.12.016.248.048.384.032.128.084.248.156.36.072.104.164.192.276.264.112.064.248.096.408.096.256,0,.432-.076.528-.228.096-.16.144-.356.144-.588c0-.032-.004-.06-.012-.084c0-.032,0-.068,0-.108Zm5.326-1.728l-.648.06c-.032,0-.068.004-.108.012s-.088.016-.144.024c-.048.008-.104.016-.168.024l.096,1.092c.008.104.016.232.024.384.016.152.04.332.072.54-.008.064-.016.128-.024.192c0,.064,0,.136,0,.216c0,.12.004.252.012.396s.02.3.036.468c-.144.24-.348.36-.612.36-.24,0-.408-.116-.504-.348c0-.064,0-.14,0-.228.008-.096.012-.2.012-.312s-.004-.232-.012-.36c0-.136,0-.284,0-.444v-.06c0-.128-.008-.224-.024-.288-.008-.064-.02-.144-.036-.24-.016-.104-.036-.248-.06-.432s-.048-.464-.072-.84l-.444.084c-.024,0-.048,0-.072,0-.016-.008-.032-.012-.048-.012-.04,0-.076.004-.108.012-.032,0-.06,0-.084,0-.032.008-.06.012-.084.012-.256-.064-.384-.248-.384-.552c0-.12.012-.212.036-.276s.076-.112.156-.144.196-.056.348-.072c.16-.024.368-.056.624-.096-.008-.136-.024-.292-.048-.468-.016-.184-.024-.38-.024-.588c0-.32.144-.74.432-1.26.08-.04.156-.08.228-.12.08-.04.172-.076.276-.108.112-.04.24-.076.384-.108.152-.04.34-.076.564-.108h.048c.136,0,.24.052.312.156.08.104.12.224.12.36c0,.152-.036.268-.108.348-.064.072-.148.132-.252.18-.104.04-.22.076-.348.108-.12.024-.232.06-.336.108-.096.032-.156.092-.18.18-.016.088-.028.176-.036.264c0,.016.004.084.012.204.008.112.012.212.012.3c0,.024-.004.048-.012.072c0,.016,0,.032,0,.048c0,.032,0,.076,0,.132.008.048.016.116.024.204l.552-.072c.056-.008.108-.012.156-.012.056,0,.104,0,.144,0c.2,0,.344.036.432.108.096.072.144.196.144.372c0,.28-.092.456-.276.528Zm-78.082,12l-.648.06c-.032,0-.068.004-.108.012s-.088.016-.144.024c-.048.008-.104.016-.168.024l.096,1.092c.008.104.016.232.024.384.016.152.04.332.072.54-.008.064-.016.128-.024.192c0,.064,0,.136,0,.216c0,.12.004.252.012.396s.02.3.036.468c-.144.24-.348.36-.612.36-.24,0-.408-.116-.504-.348c0-.064,0-.14,0-.228.008-.096.012-.2.012-.312s-.004-.232-.012-.36c0-.136,0-.284,0-.444v-.06c0-.128-.008-.224-.024-.288-.008-.064-.02-.144-.036-.24-.016-.104-.036-.248-.06-.432s-.048-.464-.072-.84l-.444.084c-.024,0-.048,0-.072,0-.016-.008-.032-.012-.048-.012-.04,0-.076.004-.108.012-.032,0-.06,0-.084,0-.032.008-.06.012-.084.012-.256-.064-.384-.248-.384-.552c0-.12.012-.212.036-.276s.076-.112.156-.144.196-.056.348-.072c.16-.024.368-.056.624-.096-.008-.136-.024-.292-.048-.468-.016-.184-.024-.38-.024-.588c0-.32.144-.74.432-1.26.08-.04.156-.08.228-.12.08-.04.172-.076.276-.108.112-.04.24-.076.384-.108.152-.04.34-.076.564-.108h.048c.136,0,.24.052.312.156.08.104.12.224.12.36c0,.152-.036.268-.108.348-.064.072-.148.132-.252.18-.104.04-.22.076-.348.108-.12.024-.232.06-.336.108-.096.032-.156.092-.18.18-.016.088-.028.176-.036.264c0,.016.004.084.012.204.008.112.012.212.012.3c0,.024-.004.048-.012.072c0,.016,0,.032,0,.048c0,.032,0,.076,0,.132.008.048.016.116.024.204l.552-.072c.056-.008.108-.012.156-.012.056,0,.104,0,.144,0c.2,0,.344.036.432.108.096.072.144.196.144.372c0,.28-.092.456-.276.528Zm3.403-1.92c.016.064.024.124.024.18c0,.256-.076.472-.228.648-.24.096-.48.144-.72.144-.152-.096-.28-.204-.384-.324-.096-.128-.144-.252-.144-.372c0-.104.12-.36.36-.768.104.016.212.028.324.036.12.008.228.028.324.06.104.032.192.08.264.144.08.056.14.14.18.252Zm-.384,2.004v.156c0,.04,0,.084,0,.132s-.008.092-.024.132l-.096.54v.108c0,.048-.004.112-.012.192s-.02.16-.036.24c-.008.08-.016.156-.024.228s-.012.132-.012.18c0,.04,0,.072,0,.096.008.024.012.056.012.096c0,.072-.008.152-.024.24-.016.08-.024.172-.024.276c0,.096.012.196.036.3-.088.36-.272.54-.552.54-.392,0-.588-.368-.588-1.104c0-.248.012-.492.036-.732.024-.248.052-.476.084-.684s.064-.388.096-.54c.04-.16.072-.284.096-.372.12-.176.288-.264.504-.264.208,0,.384.08.528.24Zm5.407-.432c.128.08.192.232.192.456c0,.168-.044.312-.132.432s-.208.18-.36.18c-.096,0-.196-.024-.3-.072-.096-.056-.2-.084-.312-.084-.096,0-.192.02-.288.06-.088.032-.192.108-.312.228l-.36.36c0,.056,0,.112,0,.168.008.056.012.116.012.18c0,.096-.004.196-.012.3c0,.104-.004.216-.012.336l.108,1.092c-.024.368-.212.552-.564.552-.184,0-.32-.056-.408-.168-.088-.12-.148-.284-.18-.492s-.048-.452-.048-.732c.008-.28.008-.588,0-.924-.016-.504-.028-.756-.036-.756v.012c-.032-.12-.056-.224-.072-.312-.016-.096-.024-.18-.024-.252c0-.144.052-.26.156-.348.104-.096.256-.144.456-.144.128,0,.28.1.456.3.184-.144.324-.252.42-.324.104-.072.188-.124.252-.156.072-.032.14-.048.204-.048.064-.008.148-.012.252-.012.088-.008.168-.004.24.012.08.016.164.032.252.048l.42.108Zm5.494,3.6c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Zm6.114,1.668c-.024.248-.108.476-.252.684-.136.2-.276.404-.42.612-.088.072-.216.132-.384.18-.16.056-.32.1-.48.132s-.3.056-.42.072c-.112.016-.16.024-.144.024-.08,0-.184-.016-.312-.048-.12-.024-.24-.052-.36-.084-.112-.024-.208-.052-.288-.084-.072-.024-.104-.036-.096-.036-.072-.008-.164-.032-.276-.072-.112-.048-.22-.1-.324-.156-.096-.064-.18-.128-.252-.192-.08-.072-.12-.14-.12-.204s.016-.128.048-.192c.032-.072.076-.136.132-.192.056-.064.112-.112.168-.144.064-.04.128-.06.192-.06l.828.312c.152.048.3.084.444.108.152.016.3.024.444.024.136,0,.256-.024.36-.072.112-.056.196-.12.252-.192l.18-.36c-.016-.144-.076-.256-.18-.336-.096-.08-.22-.148-.372-.204-.144-.056-.3-.108-.468-.156s-.324-.112-.468-.192l-.516-.324c-.168-.216-.256-.548-.264-.996.048-.28.168-.504.36-.672.008-.008.06-.044.156-.108.096-.072.244-.172.444-.3.032,0,.132-.008.3-.024.176-.016.416-.04.72-.072.136,0,.468.096.996.288.104.104.156.248.156.432c0,.144-.036.268-.108.372-.064.096-.16.144-.288.144-.136,0-.288-.032-.456-.096-.16-.072-.312-.108-.456-.108-.2,0-.384.02-.552.06-.16.032-.24.112-.24.24c0,.184.08.296.24.336c1.224.272,1.916.824,2.076,1.656Zm10.878-.036c.144.096.216.212.216.348c0,.072-.02.148-.06.228-.04.072-.092.14-.156.204-.064.056-.132.104-.204.144s-.144.06-.216.06c-.064-.024-.14-.064-.228-.12-.088-.064-.176-.132-.264-.204-.088-.08-.172-.168-.252-.264-.072-.096-.128-.192-.168-.288l-.084.204c-.152.288-.392.56-.72.816-.4.072-.632.108-.696.108-.152,0-.336-.024-.552-.072l-.66-.468c-.288-.272-.432-.644-.432-1.116c0-.168.024-.352.072-.552.056-.208.132-.416.228-.624.104-.208.228-.412.372-.612s.312-.38.504-.54c.232-.088.456-.16.672-.216.216-.064.38-.104.492-.12.152-.168.332-.252.54-.252.12,0,.224.06.312.18.096.112.176.256.24.432.072.176.128.372.168.588.04.208.068.408.084.6l.156.636c.048.2.124.372.228.516.112.144.248.272.408.384Zm-1.824-1.332c-.016-.008-.076-.26-.18-.756-.04,0-.1,0-.18,0s-.176.024-.288.072c-.104.04-.22.116-.348.228-.12.104-.236.264-.348.48-.168.312-.252.624-.252.936.136.264.348.472.636.624.088-.024.16-.052.216-.084.064-.032.12-.076.168-.132s.092-.124.132-.204c.048-.088.1-.196.156-.324.104-.184.176-.344.216-.48.048-.144.072-.264.072-.36Zm7.018,1.416v.096c0,.048,0,.136,0,.264.008.12-.004.244-.036.372-.024.128-.076.244-.156.348-.08.096-.2.144-.36.144-.312,0-.496-.124-.552-.372.008-.048.012-.1.012-.156c0-.064,0-.132,0-.204c0-.032,0-.148,0-.348c0-.208-.008-.432-.024-.672-.008-.24-.032-.464-.072-.672-.04-.216-.1-.352-.18-.408-.184-.128-.348-.192-.492-.192-.192,0-.356.06-.492.18-.128.112-.236.336-.324.672-.008.112-.016.24-.024.384-.008.136-.02.292-.036.468c0,.136.004.288.012.456.008.16.02.344.036.552c0,.152-.06.28-.18.384-.12.096-.256.144-.408.144-.12,0-.216-.032-.288-.096s-.128-.148-.168-.252c-.032-.104-.056-.216-.072-.336-.008-.12-.012-.24-.012-.36c0-.088.004-.176.012-.264.008-.096.02-.192.036-.288l.096-1.152.096-.576c-.016-.096-.048-.2-.096-.312s-.072-.2-.072-.264c0-.136.052-.26.156-.372.112-.112.248-.168.408-.168.112,0,.196.024.252.072.056.04.148.144.276.312.16-.072.288-.116.384-.132.096-.024.208-.036.336-.036.416,0,.78.1,1.092.3.32.192.52.516.6.972.024.168.044.308.06.42.024.112.044.22.06.324s.032.216.048.336c.016.112.04.256.072.432Zm5.72-4.536c-.024.072-.036.212-.036.42c0,.12,0,.272,0,.456.008.184.012.336.012.456c0,.112,0,.212,0,.3s-.008.16-.024.216c.008.032.012.068.012.108s0,.084,0,.132c0,.112-.008.256-.024.432-.016.168-.024.284-.024.348c0,.016,0,.032,0,.048.008.008.012.02.012.036-.072.432-.12.824-.144,1.176-.016.344-.044.64-.084.888-.032.248-.092.44-.18.576-.08.128-.22.192-.42.192-.168,0-.316-.04-.444-.12v-.084c-.24.104-.56.156-.96.156-.264,0-.508-.048-.732-.144-.216-.096-.404-.228-.564-.396-.16-.176-.284-.38-.372-.612s-.132-.484-.132-.756c0-.152.016-.3.048-.444.04-.152.088-.292.144-.42.056-.136.116-.256.18-.36.072-.112.14-.204.204-.276.16-.176.392-.336.696-.48s.628-.216.972-.216c.232,0,.468.044.708.132c0-.12.004-.264.012-.432.016-.168.032-.364.048-.588l-.048-.816c0-.04-.004-.072-.012-.096c0-.032,0-.064,0-.096c0-.264.032-.464.096-.6.072-.136.212-.204.42-.204.128,0,.228.016.3.048.08.032.14.088.18.168.048.072.08.18.096.324.016.136.036.312.06.528ZM191.798,56c-.16-.112-.356-.168-.588-.168-.168,0-.312.012-.432.036-.112.024-.208.068-.288.132-.08.056-.148.136-.204.24-.056.096-.112.216-.168.36-.048.136-.072.264-.072.384c0,.256.088.456.264.6.184.144.404.216.66.216.224,0,.44-.08.648-.24.072-.328.12-.556.144-.684.032-.136.048-.252.048-.348c0-.088-.004-.168-.012-.24-.008-.08-.012-.148-.012-.204c0-.016,0-.028,0-.036.008-.016.012-.032.012-.048Zm12.149.54v.072c-.008.128-.024.252-.048.372-.016.12-.052.24-.108.36l-.24.516c-.064.088-.164.184-.3.288s-.284.2-.444.288-.32.164-.48.228c-.16.056-.292.084-.396.084h-.12c-.04,0-.096.008-.168.024-.064.008-.132.02-.204.036-.064.016-.124.032-.18.048s-.096.024-.12.024c0,.12-.004.2-.012.24c0,.04-.004.096-.012.168c0,.08-.004.208-.012.384c0,.176,0,.464,0,.864c0,.112-.012.244-.036.396s-.056.332-.096.54c-.104.088-.24.132-.408.132-.16,0-.28-.036-.36-.108s-.136-.16-.168-.264c-.024-.104-.036-.208-.036-.312.008-.096.012-.176.012-.24c0-.152.008-.276.024-.372.016-.088.024-.212.024-.372c0-.088-.004-.184-.012-.288c0-.096,0-.204,0-.324c0-.184.004-.356.012-.516.016-.16.032-.316.048-.468-.032-.16-.048-.436-.048-.828c0-.352.02-.64.06-.864-.048-.256-.084-.476-.108-.66-.016-.192-.024-.344-.024-.456c0-.184.044-.32.132-.408s.236-.132.444-.132c.144,0,.256.028.336.084l.12.144c.144-.08.32-.144.528-.192.208-.056.428-.084.66-.084.544,0,.964.132,1.26.396.304.256.464.656.48,1.2Zm-1.116.3c.024-.128.036-.236.036-.324c0-.144-.052-.264-.156-.36-.096-.104-.248-.156-.456-.156h-.12c-.16,0-.264-.008-.312-.024-.2.024-.42.144-.66.36c0,.016.004.064.012.144s.012.192.012.336c0,.184-.012.34-.036.468s-.036.244-.036.348c0,.04,0,.084,0,.132s.012.072.036.072.068-.004.132-.012c.064-.016.128-.032.192-.048.064-.024.124-.04.18-.048.064-.016.104-.024.12-.024.048,0,.104-.012.168-.036.072-.024.14-.048.204-.072.072-.024.132-.048.18-.072.056-.024.096-.036.12-.036.192-.152.32-.368.384-.648Zm6.754,1.68c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Zm5.995,2.748c-.104.072-.272.144-.504.216-.232.064-.472.12-.72.168l-.492-.096c-.072-.024-.192-.08-.36-.168-.16-.088-.324-.22-.492-.396-.168-.184-.316-.416-.444-.696-.128-.288-.192-.636-.192-1.044c0-.144.032-.312.096-.504.072-.2.176-.384.312-.552.136-.176.304-.324.504-.444.208-.12.448-.18.72-.18.544,0,1.036.176,1.476.528.384.528.576,1.112.576,1.752c0,.472-.16.944-.48,1.416Zm-.588-1.704c-.04-.312-.14-.556-.3-.732-.152-.184-.348-.276-.588-.276-.16,0-.312.08-.456.24-.136.152-.204.376-.204.672c0,.12.016.248.048.384.032.128.084.248.156.36.072.104.164.192.276.264.112.064.248.096.408.096.256,0,.432-.076.528-.228.096-.16.144-.356.144-.588c0-.032-.004-.06-.012-.084c0-.032,0-.068,0-.108Zm6.682-.456v.072c-.008.128-.024.252-.048.372-.016.12-.052.24-.108.36l-.24.516c-.064.088-.164.184-.3.288s-.284.2-.444.288-.32.164-.48.228c-.16.056-.292.084-.396.084h-.12c-.04,0-.096.008-.168.024-.064.008-.132.02-.204.036-.064.016-.124.032-.18.048s-.096.024-.12.024c0,.12-.004.2-.012.24c0,.04-.004.096-.012.168c0,.08-.004.208-.012.384c0,.176,0,.464,0,.864c0,.112-.012.244-.036.396s-.056.332-.096.54c-.104.088-.24.132-.408.132-.16,0-.28-.036-.36-.108s-.136-.16-.168-.264c-.024-.104-.036-.208-.036-.312.008-.096.012-.176.012-.24c0-.152.008-.276.024-.372.016-.088.024-.212.024-.372c0-.088-.004-.184-.012-.288c0-.096,0-.204,0-.324c0-.184.004-.356.012-.516.016-.16.032-.316.048-.468-.032-.16-.048-.436-.048-.828c0-.352.02-.64.06-.864-.048-.256-.084-.476-.108-.66-.016-.192-.024-.344-.024-.456c0-.184.044-.32.132-.408s.236-.132.444-.132c.144,0,.256.028.336.084l.12.144c.144-.08.32-.144.528-.192.208-.056.428-.084.66-.084.544,0,.964.132,1.26.396.304.256.464.656.48,1.2Zm-1.116.3c.024-.128.036-.236.036-.324c0-.144-.052-.264-.156-.36-.096-.104-.248-.156-.456-.156h-.12c-.16,0-.264-.008-.312-.024-.2.024-.42.144-.66.36c0,.016.004.064.012.144s.012.192.012.336c0,.184-.012.34-.036.468s-.036.244-.036.348c0,.04,0,.084,0,.132s.012.072.036.072.068-.004.132-.012c.064-.016.128-.032.192-.048.064-.024.124-.04.18-.048.064-.016.104-.024.12-.024.048,0,.104-.012.168-.036.072-.024.14-.048.204-.072.072-.024.132-.048.18-.072.056-.024.096-.036.12-.036.192-.152.32-.368.384-.648Zm4.451-4.152c-.016.2-.064.428-.144.684-.072.248-.124.452-.156.612v.144c0,.112-.008.232-.024.36s-.032.252-.048.372c-.016.112-.036.212-.06.3-.016.088-.024.148-.024.18-.008.04-.012.136-.012.288s0,.356,0,.612v.144c0,.16-.008.3-.024.42s-.036.228-.06.324l.108.9c.032.088.14.22.324.396-.04.144-.144.276-.312.396-.168.112-.34.168-.516.168-.24,0-.424-.112-.552-.336-.12-.232-.18-.616-.18-1.152c0-.088.004-.164.012-.228.016-.064.024-.144.024-.24c0-.192-.024-.432-.072-.72.04-.088.068-.2.084-.336.024-.136.04-.264.048-.384.008-.128.012-.236.012-.324s0-.124,0-.108c0,.008.008-.048.024-.168.024-.12.048-.26.072-.42.024-.168.044-.34.06-.516.024-.176.036-.316.036-.42v-.096l.204-1.008c.104-.176.284-.264.54-.264.28,0,.492.14.636.42Zm5.925,5.832c-.256.256-.544.472-.864.648-.32.184-.644.276-.972.276-.296,0-.676-.048-1.14-.144-.16-.104-.32-.228-.48-.372-.16-.152-.304-.316-.432-.492-.128-.184-.232-.38-.312-.588-.08-.216-.12-.436-.12-.66c0-.064.004-.148.012-.252.008-.112.016-.22.024-.324.016-.112.028-.208.036-.288s.012-.12.012-.12c.16-.256.328-.508.504-.756.184-.256.44-.48.768-.672.52-.112.896-.168,1.128-.168.12,0,.224.008.312.024.088.008.172.032.252.072.088.032.172.084.252.156.088.072.188.164.3.276.128.136.228.228.3.276.08.048.12.092.12.132c0,.736-.228,1.236-.684,1.5-.2.072-.46.152-.78.24-.32.08-.756.156-1.308.228.112.304.26.532.444.684s.392.228.624.228c.344,0,.776-.204,1.296-.612.08-.072.18-.108.3-.108.128,0,.24.048.336.144.104.096.156.216.156.36c0,.104-.028.208-.084.312Zm-1.356-2.568c-.152-.248-.332-.372-.54-.372-.088,0-.184.012-.288.036s-.212.06-.324.108c-.104.04-.204.092-.3.156-.088.064-.16.14-.216.228l-.12.36c.272-.024.512-.044.72-.06s.388-.04.54-.072.272-.076.36-.132.144-.14.168-.252Z",
                  fill: "#ff8a2a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M72.6936,103.091c.3266.446.9524.542,1.3978.215l7.2576-5.3218c.4454-.3266.5417-.9524.215-1.3978-.3266-.4454-.9524-.5416-1.3977-.215L73.715,101.102l-4.7309-6.451c-.3266-.4453-.9524-.5416-1.3977-.215s-.5417.9524-.2151,1.3978l5.3223,7.2572Zm2.1734-2.355c.1196-.539-.2204-1.073-.7596-1.1926-.5392-.1197-1.0733.2204-1.1929.7596l1.9525.433Zm-.923-4.4309c-.1541.5303.151,1.0852.6813,1.2393.5304.1541,1.0852-.1509,1.2393-.6813l-1.9206-.558Zm3.1473-3.2595c.1834-.521-.0903-1.092-.6112-1.2754s-1.092.0903-1.2754.6112l1.8866.6642Zm-.4121-4.5137c-.2116.5102.0305,1.0953.5406,1.3068s1.0952-.0305,1.3068-.5406l-1.8474-.7662Zm3.4839-2.8901c.2396-.4976.0306-1.0953-.467-1.3349-.4976-.2397-1.0952-.0306-1.3349.467l1.8019.8679Zm.094-4.5301c-.2682.4828-.0942,1.0916.3886,1.3598s1.0916.0942,1.3598-.3886l-1.7484-.9712Zm3.7977-2.468c.2972-.4655.1608-1.0838-.3047-1.381s-1.0838-.1609-1.381.3046l1.6857,1.0764Zm.6463-4.4826c-.3267.4453-.2306,1.0711.2147,1.3979.4452.3267,1.0711.2306,1.3978-.2147l-1.6125-1.1832Zm4.0831-1.955c.3564-.4219.3033-1.0528-.1186-1.4092-.4218-.3564-1.0528-.3034-1.4092.1185l1.5278,1.2907Zm1.2514-4.3515c-.3858.3952-.3783,1.0283.0168,1.4142s1.0282.3783,1.4141-.0168l-1.4309-1.3974Zm4.3217-1.3492c.4145-.365.4546-.9969.0897-1.4114-.365-.4145-.9969-.4547-1.4114-.0897l1.3217,1.5011Zm1.8915-4.1161c-.4417.3316-.5309.9584-.1994,1.4001s.9585.5309,1.4001.1993l-1.2007-1.5994Zm4.6212-.7687c.465-.2991.598-.9179.299-1.3822s-.918-.5982-1.382-.299l1.083,1.6812Zm2.741-3.9735c-.483.2684-.656.8772-.388,1.3599s.877.6564,1.36.388l-.972-1.7479Zm4.819-.2292c.5-.2361.713-.8322.477-1.3315-.236-.4992-.832-.7126-1.332-.4765l.855,1.808Zm3.234-3.5785c-.513.2026-.766.7832-.563,1.2971.202.5138.783.7662,1.297.5636l-.734-1.8607Zm4.813.408c.527-.1678.817-.7303.649-1.2565-.167-.5262-.73-.8167-1.256-.6489l.607,1.9054Zm3.684-3.1175c-.536.1323-.864.6742-.732,1.2104.133.5362.675.8637,1.211.7314l-.479-1.9418Zm4.711,1.0475c.544-.0958.908-.6145.812-1.1584s-.615-.9071-1.159-.8112l.347,1.9696Zm4.071-2.5931c-.549.0582-.947.5506-.889,1.0998s.551.9473,1.1.889l-.211-1.9888Zm4.515,1.6882c.552-.0181.985-.4802.967-1.0322-.019-.552-.481-.9848-1.033-.9667l.066,1.9989Zm4.417-1.9606c-.552-.0299-1.023.3929-1.053.9443s.393,1.0228.945,1.0527l.108-1.997ZM73.5,102.5c.9884.152.9884.152.9884.152s-.0001,0-.0001,0s0,0,0,0s0,.001,0,0c0,0,.0001,0,.0001,0c.0001-.001.0004-.002.0007-.005.0007-.004.0018-.011.0034-.021.0032-.019.0082-.05.0151-.091.0139-.082.0355-.206.0658-.369.0607-.326.156-.81.2936-1.43l-1.9525-.433c-.1429.643-.2428,1.15-.3075,1.498-.0323.174-.0558.308-.0713.4-.0078.046-.0137.082-.0176.106-.002.013-.0035.022-.0046.029-.0005.003-.001.006-.0013.008-.0001.001-.0002.002-.0004.003c0,0,0,0-.0001,0c0,.001,0,.001,0,.001s0,0-.0001,0c0,0,0,0,.9884.152Zm2.3646-5.6369c.3337-1.1483.7388-2.4317,1.2267-3.8175l-1.8866-.6642c-.5011,1.4234-.9174,2.7424-1.2607,3.9237l1.9206.558Zm2.662-7.565c.4895-1.1802,1.0333-2.4039,1.6365-3.6563l-1.8019-.8679c-.6203,1.2878-1.1792,2.5456-1.682,3.758l1.8474.7662Zm3.4789-7.2152c.6324-1.1384,1.3143-2.2882,2.0493-3.4392l-1.6857-1.0764c-.7581,1.1872-1.4608,2.3722-2.112,3.5444l1.7484.9712Zm4.3081-6.7386c.7748-1.0559,1.5974-2.1046,2.4706-3.1382l-1.5278-1.2907c-.9039,1.07-1.7547,2.1546-2.5553,3.2457l1.6125,1.1832Zm5.1529-6.0923c.9158-.9378,1.8787-1.8555,2.8908-2.7466l-1.3217-1.5011c-1.0511.9254-2.0503,1.8778-3,2.8503l1.4309,1.3974Zm5.983-5.2633c.5278-.3962,1.0673-.7851,1.6187-1.1658l-1.1364-1.6458c-.5734.396-1.1343.8002-1.683,1.2122l1.2007,1.5994Zm1.6187-1.1658c.6013-.4152,1.2018-.8158,1.8018-1.2023l-1.083-1.6812c-.6177.3979-1.2362.8104-1.8552,1.2377l1.1364,1.6458Zm5.5148-3.4279c1.293-.7192,2.577-1.3765,3.847-1.9771l-.855-1.808c-1.308.619-2.632,1.2963-3.964,2.0372l.972,1.7479Zm7.815-3.6949c1.386-.5464,2.749-1.0282,4.079-1.4527l-.607-1.9054c-1.372.4375-2.776.9342-4.206,1.4974l.734,1.8607Zm8.242-2.6284c1.468-.3621,2.882-.6564,4.232-.8943l-.347-1.9696c-1.392.2454-2.851.5488-4.364.9221l.479,1.9418Zm8.514-1.4986c1.58-.1674,3.023-.2586,4.304-.3006l-.066-1.9989c-1.326.0435-2.818.1378-4.449.3107l.211,1.9888Zm8.613-.2642c.685.0372,1.213.0833,1.568.1197.177.0181.31.0338.398.0448.044.0055.076.0097.096.0125.011.0014.018.0024.022.003.002.0003.004.0005.004.0006.001.0001.001.0001.001.0001s0,0,0,0s0-.0001-.001-.0001c0,0,0,0,0,0s0,0,.145-.9895.145-.9894.145-.9895s0,0-.001,0c0,0,0,0,0,0c0-.0001-.001-.0001-.001-.0002-.001-.0001-.002-.0003-.003-.0004-.002-.0004-.005-.0008-.009-.0014-.008-.001-.019-.0025-.033-.0044-.027-.0037-.066-.0089-.117-.0153-.102-.0127-.25-.0301-.442-.0498-.385-.0394-.945-.0881-1.664-.1271l-.108,1.997Z",
                  fill: "#ff8a2a"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M304.19,136v-7.224h1.12v1.176h.056c.084-.187.177-.359.28-.518.112-.168.243-.313.392-.434.159-.121.341-.215.546-.28.205-.075.448-.112.728-.112.476,0,.915.117,1.316.35.401.224.7.597.896,1.12h.028c.131-.392.373-.733.728-1.022.364-.299.854-.448,1.47-.448.737,0,1.311.243,1.722.728.42.476.63,1.153.63,2.03v4.634h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.653-.49-1.204-.49c-.224,0-.439.028-.644.084-.196.056-.373.14-.532.252s-.285.257-.378.434c-.093.168-.14.369-.14.602v5.012h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.644-.49-1.176-.49c-.224,0-.439.028-.644.084s-.387.14-.546.252-.289.257-.392.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm14.939.168c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM324.096,136v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm10.903.798c0,.747-.294,1.293-.882,1.638-.579.355-1.452.532-2.618.532-1.13,0-1.942-.154-2.436-.462-.495-.308-.742-.747-.742-1.316c0-.392.102-.7.308-.924.205-.215.485-.373.84-.476v-.154c-.43-.205-.644-.541-.644-1.008c0-.364.116-.639.35-.826.233-.196.532-.341.896-.434v-.056c-.43-.205-.766-.499-1.008-.882-.234-.383-.35-.826-.35-1.33c0-.364.065-.7.196-1.008.13-.308.312-.569.546-.784.242-.224.527-.397.854-.518.336-.121.709-.182,1.12-.182.513,0,.97.093,1.372.28v-.126c0-.28.065-.509.196-.686.13-.187.345-.28.644-.28h1.078v.98h-1.372v.462c.261.224.462.495.602.812.149.308.224.658.224,1.05c0,.364-.066.7-.196,1.008-.131.308-.318.574-.56.798-.234.215-.518.383-.854.504s-.71.182-1.12.182c-.234,0-.467-.023-.7-.07-.243.065-.462.163-.658.294-.196.121-.294.294-.294.518c0,.215.102.359.308.434.205.075.471.112.798.112h1.54c.896,0,1.544.173,1.946.518.41.336.616.803.616,1.4Zm-1.05.084c0-.289-.112-.523-.336-.7-.215-.168-.602-.252-1.162-.252h-2.408c-.448.205-.672.532-.672.98c0,.317.116.588.35.812.242.224.648.336,1.218.336h1.036c.625,0,1.11-.098,1.456-.294.345-.196.518-.49.518-.882Zm-2.506-4.186c.476,0,.854-.112,1.134-.336.28-.233.42-.588.42-1.064v-.392c0-.476-.14-.826-.42-1.05-.28-.233-.658-.35-1.134-.35s-.854.117-1.134.35c-.28.224-.42.574-.42,1.05v.392c0,.476.14.831.42,1.064.28.224.658.336,1.134.336Zm7.496,3.472c-.494,0-.942-.089-1.344-.266-.392-.177-.732-.429-1.022-.756-.28-.336-.499-.733-.658-1.19-.149-.467-.224-.989-.224-1.568c0-.569.075-1.087.224-1.554.159-.467.378-.863.658-1.19.29-.336.63-.593,1.022-.77.402-.177.85-.266,1.344-.266.486,0,.92.089,1.302.266.383.177.71.425.98.742.271.308.476.677.616,1.106.15.429.224.901.224,1.414v.532h-5.194v.336c0,.308.047.597.14.868.103.261.243.49.42.686.187.196.411.35.672.462.271.112.574.168.91.168.458,0,.854-.107,1.19-.322.346-.215.612-.523.798-.924l.798.574c-.233.495-.597.896-1.092,1.204-.494.299-1.082.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.471.252-.658.448-.177.196-.317.429-.42.7-.102.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.177-1.157-.532-1.54-.345-.392-.807-.588-1.386-.588Zm12.896,5.278h-.056c-.438.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.676-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.13-.467-.196-.989-.196-1.568s.066-1.101.196-1.568c.14-.467.336-.863.588-1.19.262-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.934.112,1.288.336.364.215.64.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.234-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.368-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.634,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.864.588,1.498.588Zm10.613.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm7.045.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.562,0c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm9.149-5.46h-1.176v-.98h1.176v-1.456c0-.504.131-.91.392-1.218.262-.308.658-.462,1.19-.462h1.092v.98h-1.554v2.156h1.554v.98h-1.554v6.244h-1.12v-6.244ZM383.049,136v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.606,0-1.082.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.803.168c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm5.104.826v-7.224h1.12v1.176h.056c.084-.187.177-.359.28-.518.112-.168.242-.313.392-.434.158-.121.34-.215.546-.28.205-.075.448-.112.728-.112.476,0,.914.117,1.316.35.401.224.7.597.896,1.12h.028c.13-.392.373-.733.728-1.022.364-.299.854-.448,1.47-.448.737,0,1.311.243,1.722.728.42.476.63,1.153.63,2.03v4.634h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.654-.49-1.204-.49c-.224,0-.439.028-.644.084-.196.056-.374.14-.532.252-.159.112-.285.257-.378.434-.094.168-.14.369-.14.602v5.012h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.644-.49-1.176-.49c-.224,0-.439.028-.644.084-.206.056-.388.14-.546.252-.159.112-.29.257-.392.434-.094.168-.14.369-.14.602v5.012h-1.12Zm17.127,0c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm2.556-7.224h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L423.605,136h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L418.929,136h-1.358l-1.932-7.224Zm14.164,7.392c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56ZM308.81,154.824h-.056c-.439.896-1.143,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.299-.285.392-.462.103-.187.154-.397.154-.63v-2.688c0-.196-.051-.378-.154-.546-.093-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm10.613.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.045.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.242,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm8.562,0c-.42,0-.724-.112-.91-.336-.178-.224-.29-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.766,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.71-.406-1.288-.406c-.439,0-.808.098-1.106.294-.29.196-.532.457-.728.784l-.672-.63c.196-.392.508-.723.938-.994.429-.28.97-.42,1.624-.42.877,0,1.558.215,2.044.644.485.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.536-.033.77-.098.233-.065.434-.159.602-.28s.298-.261.392-.42c.093-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.116.093-1.414.28-.29.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm7.618.952c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm7.369,0c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM348.278,156c-.392,0-.69-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.094-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.482.168c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602ZM366.971,156c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294ZM369.2,156v-7.224h1.12v1.176h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12Zm12.577-1.176h-.056c-.439.896-1.144,1.344-2.114,1.344-.448,0-.854-.089-1.218-.266s-.677-.429-.938-.756c-.252-.327-.448-.723-.588-1.19-.131-.467-.196-.989-.196-1.568s.065-1.101.196-1.568c.14-.467.336-.863.588-1.19.261-.327.574-.579.938-.756s.77-.266,1.218-.266c.504,0,.933.112,1.288.336.364.215.639.551.826,1.008h.056v-4.312h1.12v10.36h-1.12v-1.176Zm-1.862.336c.252,0,.49-.033.714-.098.233-.065.434-.159.602-.28.168-.131.298-.285.392-.462.102-.187.154-.397.154-.63v-2.688c0-.196-.052-.378-.154-.546-.094-.177-.224-.327-.392-.448s-.369-.215-.602-.28c-.224-.075-.462-.112-.714-.112-.635,0-1.134.201-1.498.602-.364.392-.546.91-.546,1.554v1.232c0,.644.182,1.167.546,1.568.364.392.863.588,1.498.588Zm13.921.84c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm6.639.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm3.746,0c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm5.355.168c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm4.279-6.398h1.092l.77,3.122.77,3.164h.028l.882-3.164.91-3.122h.994l.938,3.122.896,3.164h.028l.742-3.164.784-3.122h1.05L418.601,156h-1.386l-1.008-3.472-.63-2.198h-.028l-.616,2.198L413.925,156h-1.358l-1.932-7.224Zm13.645,7.392c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm12.413-7.392h1.106l-3.234,8.904c-.084.215-.168.392-.252.532-.084.149-.187.266-.308.35-.122.084-.276.145-.462.182-.178.037-.397.056-.658.056h-.574v-.98h1.134l.546-1.54-2.702-7.504h1.12l1.736,4.914.336,1.176h.07l.392-1.176l1.75-4.914Zm5.196,7.392c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm9.556-.35h-.056c-.075.168-.168.336-.28.504-.103.159-.234.303-.392.434-.159.121-.35.219-.574.294s-.486.112-.784.112c-.747,0-1.34-.238-1.778-.714-.439-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.55,1.946,1.652,1.946.224,0,.438-.028.644-.084.214-.056.401-.14.56-.252.168-.112.298-.252.392-.42.102-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM305.786,176c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.988.168c-.486,0-.929-.089-1.33-.266-.402-.177-.747-.429-1.036-.756-.28-.336-.5-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554.158-.467.378-.863.658-1.19.289-.336.634-.593,1.036-.77.401-.177.844-.266,1.33-.266.485,0,.924.089,1.316.266.401.177.746.434,1.036.77.289.327.513.723.672,1.19.158.467.238.985.238,1.554c0,.579-.08,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.29.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.606,0,1.101-.187,1.484-.56.382-.373.574-.943.574-1.708v-1.036c0-.765-.192-1.335-.574-1.708-.383-.373-.878-.56-1.484-.56-.607,0-1.102.187-1.484.56-.383.373-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708.382.373.877.56,1.484.56Zm14.502,1.624c0,.747-.294,1.293-.882,1.638-.579.355-1.451.532-2.618.532-1.129,0-1.941-.154-2.436-.462s-.742-.747-.742-1.316c0-.392.103-.7.308-.924.205-.215.485-.373.84-.476v-.154c-.429-.205-.644-.541-.644-1.008c0-.364.117-.639.35-.826.233-.196.532-.341.896-.434v-.056c-.429-.205-.765-.499-1.008-.882-.233-.383-.35-.826-.35-1.33c0-.364.065-.7.196-1.008s.313-.569.546-.784c.243-.224.527-.397.854-.518.336-.121.709-.182,1.12-.182.513,0,.971.093,1.372.28v-.126c0-.28.065-.509.196-.686.131-.187.345-.28.644-.28h1.078v.98h-1.372v.462c.261.224.462.495.602.812.149.308.224.658.224,1.05c0,.364-.065.7-.196,1.008s-.317.574-.56.798c-.233.215-.518.383-.854.504s-.709.182-1.12.182c-.233,0-.467-.023-.7-.07-.243.065-.462.163-.658.294-.196.121-.294.294-.294.518c0,.215.103.359.308.434s.471.112.798.112h1.54c.896,0,1.545.173,1.946.518.411.336.616.803.616,1.4Zm-1.05.084c0-.289-.112-.523-.336-.7-.215-.168-.602-.252-1.162-.252h-2.408c-.448.205-.672.532-.672.98c0,.317.117.588.35.812.243.224.649.336,1.218.336h1.036c.625,0,1.111-.098,1.456-.294s.518-.49.518-.882Zm-2.506-4.186c.476,0,.854-.112,1.134-.336.28-.233.42-.588.42-1.064v-.392c0-.476-.14-.826-.42-1.05-.28-.233-.658-.35-1.134-.35s-.854.117-1.134.35c-.28.224-.42.574-.42,1.05v.392c0,.476.14.831.42,1.064.28.224.658.336,1.134.336Zm7.497,3.472c-.495,0-.943-.089-1.344-.266-.392-.177-.733-.429-1.022-.756-.28-.336-.5-.733-.658-1.19-.15-.467-.224-.989-.224-1.568c0-.569.074-1.087.224-1.554.158-.467.378-.863.658-1.19.289-.336.63-.593,1.022-.77.401-.177.849-.266,1.344-.266.485,0,.919.089,1.302.266.382.177.709.425.98.742.27.308.476.677.616,1.106.149.429.224.901.224,1.414v.532h-5.194v.336c0,.308.046.597.14.868.102.261.242.49.42.686.186.196.41.35.672.462.27.112.574.168.91.168.457,0,.854-.107,1.19-.322.345-.215.611-.523.798-.924l.798.574c-.234.495-.598.896-1.092,1.204-.495.299-1.083.448-1.764.448Zm0-6.622c-.308,0-.588.056-.84.168-.252.103-.472.252-.658.448-.178.196-.318.429-.42.7-.103.261-.154.551-.154.868v.098h3.99v-.154c0-.644-.178-1.157-.532-1.54-.346-.392-.808-.588-1.386-.588ZM336.78,176c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.243,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm7.181-8.918c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182s.415.061.518.182c.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm3.5,7.224v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm10.127.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm5.212-9.086c-.242,0-.42-.056-.532-.168-.102-.121-.154-.275-.154-.462v-.182c0-.187.052-.336.154-.448.112-.121.29-.182.532-.182.243,0,.416.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.102.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm9.59,8.022c0,.747-.294,1.293-.882,1.638-.578.355-1.451.532-2.618.532-1.129,0-1.941-.154-2.436-.462-.494-.308-.742-.747-.742-1.316c0-.392.103-.7.308-.924.206-.215.486-.373.84-.476v-.154c-.429-.205-.644-.541-.644-1.008c0-.364.117-.639.35-.826.234-.196.532-.341.896-.434v-.056c-.429-.205-.765-.499-1.008-.882-.233-.383-.35-.826-.35-1.33c0-.364.066-.7.196-1.008.131-.308.313-.569.546-.784.243-.224.528-.397.854-.518.336-.121.71-.182,1.12-.182.514,0,.971.093,1.372.28v-.126c0-.28.066-.509.196-.686.131-.187.346-.28.644-.28h1.078v.98h-1.372v.462c.262.224.462.495.602.812.15.308.224.658.224,1.05c0,.364-.065.7-.196,1.008-.13.308-.317.574-.56.798-.233.215-.518.383-.854.504s-.709.182-1.12.182c-.233,0-.466-.023-.7-.07-.242.065-.462.163-.658.294-.196.121-.294.294-.294.518c0,.215.103.359.308.434.206.075.472.112.798.112h1.54c.896,0,1.545.173,1.946.518.411.336.616.803.616,1.4Zm-1.05.084c0-.289-.112-.523-.336-.7-.214-.168-.602-.252-1.162-.252h-2.408c-.448.205-.672.532-.672.98c0,.317.117.588.35.812.243.224.649.336,1.218.336h1.036c.626,0,1.111-.098,1.456-.294.346-.196.518-.49.518-.882Zm-2.506-4.186c.476,0,.854-.112,1.134-.336.28-.233.42-.588.42-1.064v-.392c0-.476-.14-.826-.42-1.05-.28-.233-.658-.35-1.134-.35s-.854.117-1.134.35c-.28.224-.42.574-.42,1.05v.392c0,.476.14.831.42,1.064.28.224.658.336,1.134.336Zm4.863-7.056h1.12v4.312h.056c.177-.411.424-.737.742-.98.326-.243.76-.364,1.302-.364.746,0,1.334.243,1.764.728.438.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.444.028-.658.084-.206.056-.392.14-.56.252s-.304.257-.406.434c-.094.168-.14.369-.14.602v5.012h-1.12v-10.36ZM382.13,176c-.392,0-.691-.107-.896-.322-.196-.224-.294-.513-.294-.868v-5.054h-1.19v-.98h.672c.242,0,.406-.047.49-.14.093-.103.14-.275.14-.518v-1.344h1.008v2.002h1.582v.98h-1.582v5.264h1.47v.98h-1.4Zm5.482.168c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm8.353-6.412h-1.176v-.98h1.176v-1.456c0-.504.13-.91.392-1.218.261-.308.658-.462,1.19-.462h1.092v.98h-1.554v2.156h1.554v.98h-1.554v6.244h-1.12v-6.244ZM400.112,176v-7.224h1.12v1.33h.07c.131-.345.364-.653.7-.924s.798-.406,1.386-.406h.434v1.12h-.658c-.607,0-1.083.117-1.428.35-.336.224-.504.509-.504.854v4.9h-1.12Zm7.802.168c-.485,0-.929-.089-1.33-.266s-.747-.429-1.036-.756c-.28-.336-.499-.733-.658-1.19-.159-.467-.238-.989-.238-1.568c0-.569.079-1.087.238-1.554s.378-.863.658-1.19c.289-.336.635-.593,1.036-.77s.845-.266,1.33-.266.924.089,1.316.266c.401.177.747.434,1.036.77.289.327.513.723.672,1.19s.238.985.238,1.554c0,.579-.079,1.101-.238,1.568-.159.457-.383.854-.672,1.19-.289.327-.635.579-1.036.756-.392.177-.831.266-1.316.266Zm0-.994c.607,0,1.101-.187,1.484-.56s.574-.943.574-1.708v-1.036c0-.765-.191-1.335-.574-1.708s-.877-.56-1.484-.56-1.101.187-1.484.56-.574.943-.574,1.708v1.036c0,.765.191,1.335.574,1.708s.877.56,1.484.56Zm5.104.826v-7.224h1.12v1.176h.056c.084-.187.177-.359.28-.518.112-.168.243-.313.392-.434.159-.121.341-.215.546-.28.205-.075.448-.112.728-.112.476,0,.915.117,1.316.35.401.224.7.597.896,1.12h.028c.131-.392.373-.733.728-1.022.364-.299.854-.448,1.47-.448.737,0,1.311.243,1.722.728.42.476.63,1.153.63,2.03v4.634h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.653-.49-1.204-.49c-.224,0-.439.028-.644.084-.196.056-.373.14-.532.252s-.285.257-.378.434c-.093.168-.14.369-.14.602v5.012h-1.12v-4.438c0-.644-.126-1.129-.378-1.456s-.644-.49-1.176-.49c-.224,0-.439.028-.644.084s-.387.14-.546.252-.289.257-.392.434c-.093.168-.14.369-.14.602v5.012h-1.12ZM305.786,196l-2.534-7.224h1.12l1.26,3.584.784,2.464h.07l.784-2.464l1.288-3.584h1.078L307.088,196h-1.302Zm5.855-8.918c-.243,0-.42-.056-.532-.168-.103-.121-.154-.275-.154-.462v-.182c0-.187.051-.336.154-.448.112-.121.289-.182.532-.182.242,0,.415.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.103.112-.276.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm5.67,7.392c-.672,0-1.237-.126-1.694-.378-.448-.261-.836-.607-1.162-1.036l.798-.644c.28.355.592.63.938.826.345.187.746.28,1.204.28.476,0,.844-.103,1.106-.308.27-.205.406-.495.406-.868c0-.28-.094-.518-.28-.714-.178-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.528-.233-.742-.392-.206-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.13-.271.308-.495.532-.672.233-.177.508-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.696-.28-1.162-.28-.467,0-.822.103-1.064.308-.234.196-.35.467-.35.812c0,.355.116.611.35.77.242.159.588.275,1.036.35l.56.084c.802.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.13.602-1.96.602Zm9.104-1.344h-.056c-.075.168-.168.336-.28.504-.103.159-.233.303-.392.434-.159.121-.35.219-.574.294s-.485.112-.784.112c-.747,0-1.339-.238-1.778-.714-.439-.485-.658-1.167-.658-2.044v-4.634h1.12v4.438c0,1.297.551,1.946,1.652,1.946.224,0,.439-.028.644-.084.215-.056.401-.14.56-.252.168-.112.299-.252.392-.42.103-.177.154-.387.154-.63v-4.998h1.12v7.224h-1.12v-1.176ZM334.61,196c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm6.638.784c-.392,0-.69-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm11.183,0c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.158.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.362-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.248-1.204.742-1.568.504-.364,1.284-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.438,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.43-.28.971-.42,1.624-.42.878,0,1.559.215,2.044.644.486.429.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098.234-.065.434-.159.602-.28s.299-.261.392-.42c.094-.159.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.262.196.612.294,1.05.294Zm5.449.784v-7.224h1.12v1.176h.056c.177-.411.425-.737.742-.98.327-.243.761-.364,1.302-.364.747,0,1.335.243,1.764.728.439.476.658,1.153.658,2.03v4.634h-1.12v-4.438c0-1.297-.546-1.946-1.638-1.946-.224,0-.443.028-.658.084-.205.056-.392.14-.56.252s-.303.257-.406.434c-.093.168-.14.369-.14.602v5.012h-1.12Zm13.207,0c-.42,0-.723-.112-.91-.336-.177-.224-.289-.504-.336-.84h-.07c-.159.448-.42.784-.784,1.008s-.798.336-1.302.336c-.765,0-1.363-.196-1.792-.588-.42-.392-.63-.924-.63-1.596c0-.681.247-1.204.742-1.568.504-.364,1.283-.546,2.338-.546h1.428v-.714c0-.513-.14-.905-.42-1.176s-.709-.406-1.288-.406c-.439,0-.807.098-1.106.294-.289.196-.532.457-.728.784l-.672-.63c.196-.392.509-.723.938-.994.429-.28.971-.42,1.624-.42.877,0,1.559.215,2.044.644s.728,1.027.728,1.792v3.976h.826v.98h-.63Zm-3.22-.784c.28,0,.537-.033.77-.098s.434-.159.602-.28.299-.261.392-.42.14-.331.14-.518v-1.19h-1.484c-.644,0-1.115.093-1.414.28-.289.187-.434.457-.434.812v.294c0,.355.126.63.378.826.261.196.611.294,1.05.294Zm6.639.784c-.392,0-.691-.107-.896-.322-.196-.224-.294-.504-.294-.84v-9.198h1.12v9.38h1.064v.98h-.994Zm6.939-7.224h1.106l-3.234,8.904c-.084.215-.168.392-.252.532-.084.149-.186.266-.308.35-.121.084-.275.145-.462.182-.177.037-.396.056-.658.056h-.574v-.98h1.134l.546-1.54-2.702-7.504h1.12l1.736,4.914.336,1.176h.07l.392-1.176l1.75-4.914Zm4.65,7.392c-.672,0-1.237-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.345.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.369-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.065-.663.196-.924.131-.271.308-.495.532-.672.233-.177.509-.308.826-.392.317-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.401.205.751.49,1.05.854l-.742.672c-.159-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28s-.821.103-1.064.308c-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Zm5.212-9.086c-.242,0-.42-.056-.532-.168-.102-.121-.154-.275-.154-.462v-.182c0-.187.052-.336.154-.448.112-.121.29-.182.532-.182.243,0,.416.061.518.182.112.112.168.261.168.448v.182c0,.187-.056.341-.168.462-.102.112-.275.168-.518.168Zm-.56,1.694h1.12v7.224h-1.12v-7.224Zm5.67,7.392c-.672,0-1.236-.126-1.694-.378-.448-.261-.835-.607-1.162-1.036l.798-.644c.28.355.593.63.938.826.346.187.747.28,1.204.28.476,0,.845-.103,1.106-.308.271-.205.406-.495.406-.868c0-.28-.093-.518-.28-.714-.177-.205-.504-.345-.98-.42l-.574-.084c-.336-.047-.644-.117-.924-.21-.28-.103-.527-.233-.742-.392-.205-.168-.368-.373-.49-.616-.112-.243-.168-.532-.168-.868c0-.355.066-.663.196-.924.131-.271.308-.495.532-.672.234-.177.509-.308.826-.392.318-.093.658-.14,1.022-.14.588,0,1.078.103,1.47.308.402.205.752.49,1.05.854l-.742.672c-.158-.224-.392-.425-.7-.602-.308-.187-.695-.28-1.162-.28-.466,0-.821.103-1.064.308-.233.196-.35.467-.35.812c0,.355.117.611.35.77.243.159.588.275,1.036.35l.56.084c.803.121,1.372.355,1.708.7.336.336.504.779.504,1.33c0,.7-.238,1.251-.714,1.652s-1.129.602-1.96.602Z",
                  fill: "#fff"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M304.64,97.04h6.46c.573,0,1.087.0867,1.54.26.467.1733.86.4133,1.18.72s.56.6867.72,1.14c.173.44.26.927.26,1.46s-.073.987-.22,1.36c-.133.36-.32.66-.56.9-.227.24-.493.42-.8.54-.293.12-.6.187-.92.2v.12c.307,0,.633.06.98.18.36.12.687.313.98.58.307.253.56.587.76,1c.2.4.3.9.3,1.5c0,.56-.093,1.087-.28,1.58-.173.48-.42.9-.74,1.26s-.7.647-1.14.86c-.44.2-.92.3-1.44.3h-7.08v-13.96Zm2.64,11.72h3.68c.507,0,.9-.127,1.18-.38.28-.267.42-.647.42-1.14v-.68c0-.493-.14-.873-.42-1.14s-.673-.4-1.18-.4h-3.68v3.74Zm0-5.9h3.26c.48,0,.853-.127,1.12-.38.267-.267.4-.633.4-1.1v-.62c0-.467-.133-.8267-.4-1.08-.267-.2667-.64-.4-1.12-.4h-3.26v3.58Zm11.742-3.82c-.534,0-.92-.12-1.16-.36-.227-.24-.34-.5467-.34-.92v-.4c0-.3733.113-.68.34-.92.24-.24.626-.36,1.16-.36.52,0,.9.12,1.14.36s.36.5467.36.92v.4c0,.3733-.12.68-.36.92s-.62.36-1.14.36Zm-1.28,1.52h2.56v10.44h-2.56v-10.44ZM325.509,111l-3.48-10.44h2.52l1.46,4.5l1.02,3.72h.14l1.02-3.72l1.42-4.5h2.44l-3.5,10.44h-3.04Zm15.753,0c-.56,0-1.007-.16-1.34-.48-.32-.333-.52-.773-.6-1.32h-.12c-.174.68-.527,1.193-1.06,1.54-.534.333-1.194.5-1.98.5-1.067,0-1.887-.28-2.46-.84-.574-.56-.86-1.307-.86-2.24c0-1.08.386-1.88,1.16-2.4.773-.533,1.873-.8,3.3-.8h1.78v-.76c0-.587-.154-1.04-.46-1.36-.307-.32-.8-.48-1.48-.48-.6,0-1.087.133-1.46.4-.36.253-.667.56-.92.92l-1.52-1.36c.386-.6.9-1.08,1.54-1.44.64-.373,1.486-.56,2.54-.56c1.413,0,2.486.32,3.22.96.733.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.573,0,1.06-.127,1.46-.38s.6-.627.6-1.12v-1.38h-1.64c-1.334,0-2,.427-2,1.28v.34c0,.427.133.747.4.96.28.2.673.3,1.18.3Zm7.731,1.62v-10.44h2.56v2.16h.1c.067-.28.167-.547.3-.8.147-.267.334-.5.56-.7.227-.2.494-.36.8-.48.32-.12.687-.18,1.1-.18h.56v2.42h-.8c-.866,0-1.52.127-1.96.38s-.66.667-.66,1.24v6.4h-2.56Zm9.132-11.96c-.533,0-.92-.12-1.16-.36-.227-.24-.34-.5467-.34-.92v-.4c0-.3733.113-.68.34-.92.24-.24.627-.36,1.16-.36.52,0,.9.12,1.14.36s.36.5467.36.92v.4c0,.3733-.12.68-.36.92s-.62.36-1.14.36Zm-1.28,1.52h2.56v10.44h-2.56v-10.44ZM365.812,111c-.56,0-1.006-.16-1.34-.48-.32-.333-.52-.773-.6-1.32h-.12c-.173.68-.526,1.193-1.06,1.54-.533.333-1.193.5-1.98.5-1.066,0-1.886-.28-2.46-.84-.573-.56-.86-1.307-.86-2.24c0-1.08.387-1.88,1.16-2.4.774-.533,1.874-.8,3.3-.8h1.78v-.76c0-.587-.153-1.04-.46-1.36-.306-.32-.8-.48-1.48-.48-.6,0-1.086.133-1.46.4-.36.253-.666.56-.92.92l-1.52-1.36c.387-.6.9-1.08,1.54-1.44.64-.373,1.487-.56,2.54-.56c1.414,0,2.487.32,3.22.96.734.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.574,0,1.06-.127,1.46-.38s.6-.627.6-1.12v-1.38h-1.64c-1.333,0-2,.427-2,1.28v.34c0,.427.134.747.4.96.28.2.674.3,1.18.3ZM372.486,111c-.88,0-1.553-.227-2.02-.68-.453-.467-.68-1.127-.68-1.98v-5.74h-1.54v-2.04h.8c.387,0,.647-.087.78-.26.147-.187.22-.46.22-.82v-1.78h2.3v2.86h2.14v2.04h-2.14v6.36h1.98v2.04h-1.84Zm8.362.24c-.773,0-1.466-.127-2.08-.38-.6-.267-1.113-.633-1.54-1.1-.413-.48-.733-1.053-.96-1.72-.226-.68-.34-1.44-.34-2.28c0-.827.107-1.573.32-2.24.227-.667.547-1.233.96-1.7.414-.48.92-.847,1.52-1.1.6-.267,1.28-.4,2.04-.4.814,0,1.52.14,2.12.42s1.094.66,1.48,1.14c.387.48.674,1.04.86,1.68.2.627.3,1.3.3,2.02v.84h-6.94v.26c0,.76.214,1.373.64,1.84.427.453,1.06.68,1.9.68.64,0,1.16-.133,1.56-.4.414-.267.78-.607,1.1-1.02l1.38,1.54c-.426.6-1.013,1.073-1.76,1.42-.733.333-1.586.5-2.56.5Zm-.04-9c-.68,0-1.22.227-1.62.68s-.6,1.04-.6,1.76v.16h4.28v-.18c0-.72-.18-1.3-.54-1.74-.346-.453-.853-.68-1.52-.68ZM395.067,111c-.88,0-1.526-.22-1.94-.66-.413-.44-.62-1.06-.62-1.86v-12.28h2.56v12.76h1.38v2.04h-1.38Zm10.999,0c-.56,0-1.006-.16-1.34-.48-.32-.333-.52-.773-.6-1.32h-.12c-.173.68-.526,1.193-1.06,1.54-.533.333-1.193.5-1.98.5-1.066,0-1.886-.28-2.46-.84-.573-.56-.86-1.307-.86-2.24c0-1.08.387-1.88,1.16-2.4.774-.533,1.874-.8,3.3-.8h1.78v-.76c0-.587-.153-1.04-.46-1.36-.306-.32-.8-.48-1.48-.48-.6,0-1.086.133-1.46.4-.36.253-.666.56-.92.92l-1.52-1.36c.387-.6.9-1.08,1.54-1.44.64-.373,1.487-.56,2.54-.56c1.414,0,2.487.32,3.22.96.734.64,1.1,1.56,1.1,2.76v4.92h1.04v2.04h-1.42Zm-4.24-1.62c.574,0,1.06-.127,1.46-.38s.6-.627.6-1.12v-1.38h-1.64c-1.333,0-2,.427-2,1.28v.34c0,.427.134.747.4.96.28.2.674.3,1.18.3Zm13.976-8.82h2.4l-4.2,12.3c-.133.373-.287.693-.46.96-.16.28-.353.507-.58.68s-.5.3-.82.38-.693.12-1.12.12h-1.54v-2.04h1.88l.48-1.46-3.74-10.94h2.54l1.82,5.52.68,2.64h.12l.72-2.64l1.82-5.52Zm8.171,10.68c-.773,0-1.466-.127-2.08-.38-.6-.267-1.113-.633-1.54-1.1-.413-.48-.733-1.053-.96-1.72-.226-.68-.34-1.44-.34-2.28c0-.827.107-1.573.32-2.24.227-.667.547-1.233.96-1.7.414-.48.92-.847,1.52-1.1.6-.267,1.28-.4,2.04-.4.814,0,1.52.14,2.12.42s1.094.66,1.48,1.14c.387.48.674,1.04.86,1.68.2.627.3,1.3.3,2.02v.84h-6.94v.26c0,.76.214,1.373.64,1.84.427.453,1.06.68,1.9.68.64,0,1.16-.133,1.56-.4.414-.267.78-.607,1.1-1.02l1.38,1.54c-.426.6-1.013,1.073-1.76,1.42-.733.333-1.586.5-2.56.5Zm-.04-9c-.68,0-1.22.227-1.62.68s-.6,1.04-.6,1.76v.16h4.28v-.18c0-.72-.18-1.3-.54-1.74-.346-.453-.853-.68-1.52-.68Zm6.973,8.76v-10.44h2.56v2.16h.1c.066-.28.166-.547.3-.8.146-.267.333-.5.56-.7.226-.2.493-.36.8-.48.32-.12.686-.18,1.1-.18h.56v2.42h-.8c-.867,0-1.52.127-1.96.38s-.66.667-.66,1.24v6.4h-2.56Z",
                  fill: "#0c9bed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M314.5,56h-46.5v54.5",
                  fill: "none",
                  stroke: "url(#eWMaDkTemOR262-stroke)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(256.5 277.5)", fill: "#fff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: "3.5", transform: "translate(267.5 277.5)", fill: "#fff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  width: "7",
                  height: "7",
                  rx: "3.5",
                  ry: "3.5",
                  transform: "translate(242 274)",
                  fill: "#0c9bed"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "eWMaDkTemOR266", children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "513", height: "291", rx: "0", ry: "0", fill: "#fff" }) })
        ] })
      ]
    }
  );
};
export {
  BivariateGreetings
};

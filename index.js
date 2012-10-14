// Generated by CoffeeScript 1.3.3
(function() {
  var $, addToEnv, bling, parseTag, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  $ = require("component-jquery");

  _ = require("component-underscore");

  parseTag = function(str, defaultTag) {
    var id, klass, rest, tag, _ref, _ref1, _ref2;
    if (__indexOf.call(str, "#") >= 0) {
      _ref = str.split("#"), tag = _ref[0], rest = _ref[1];
      if (!tag.length) {
        tag = defaultTag;
      }
      _ref1 = rest.split("."), id = _ref1[0], klass = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
    } else if (__indexOf.call(str, ".") >= 0) {
      id = false;
      _ref2 = str.split("."), tag = _ref2[0], klass = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
      if (!tag.length) {
        tag = defaultTag;
      }
    } else {
      tag = str;
      id = false;
      klass = false;
    }
    return {
      tagName: tag,
      "class": klass,
      id: id
    };
  };

  addToEnv = function(env, key, val) {
    if (!(env[key] != null)) {
      env[key] = $();
    }
    return env[key] = env[key].add(val);
  };

  bling = function(str, options) {
    var $tag, appendTo, elAttrs, env, i, k, klass, part, parts, rootTag, tag, tags, v, _i, _j, _len, _len1, _ref, _ref1;
    if (options == null) {
      options = {};
    }
    if (_.isFunction(options)) {
      options = {
        onCreate: options
      };
    }
    options.onCreate || (options.onCreate = function() {});
    options.appendTo || (options.appendTo = false);
    options.defaultTag || (options.defaultTag = "div");
    elAttrs = {};
    for (k in options) {
      v = options[k];
      if (k !== "appendTo" && k !== "onCreate" && k !== "defaultTag") {
        elAttrs[k] = v;
      }
    }
    env = {};
    tags = [];
    appendTo = options.appendTo;
    rootTag = false;
    if (_.isString(appendTo)) {
      appendTo = $(appendTo);
    }
    parts = str.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split(' ');
    for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
      part = parts[i];
      if (!(part !== ",")) {
        continue;
      }
      tag = parseTag(part, options.defaultTag);
      tags.push($tag = $("<" + tag.tagName + "/>", elAttrs));
      if (appendTo) {
        $tag.appendTo(appendTo);
      } else if (tags.length > 1) {
        rootTag.after($tag);
      }
      addToEnv(env, tag.tagName, $tag);
      if (tag["class"]) {
        $tag.addClass(tag["class"].join(" "));
        _ref = tag["class"];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          klass = _ref[_j];
          addToEnv(env, klass, $tag);
        }
      }
      if (tag.id) {
        $tag.attr({
          id: tag.id
        });
        addToEnv(env, tag.id, $tag);
      }
      if (!rootTag) {
        rootTag = $tag;
      }
      if ((parts[i + 1] != null) && parts[i + 1] === ",") {
        continue;
      }
      appendTo = $tag;
    }
    if ((_ref1 = options.onCreate) != null) {
      _ref1.apply(env, tags);
    }
    return rootTag;
  };

  module.exports = bling;

}).call(this);

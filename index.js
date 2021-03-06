// Generated by CoffeeScript 1.6.2
(function() {
  var addToEnv, bling, parseTag,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  if (typeof _ === "undefined" || _ === null) {
    _ = require("underscore");
  }

  parseTag = function(str, defaultTag) {
    var bindTo, i, id, k, klass, rest, tag, _i, _len, _ref, _ref1, _ref2;

    bindTo = {
      id: false,
      "class": [],
      tag: false
    };
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
    if (id[0] === "@") {
      bindTo.id = true;
      id = id.slice(1);
    }
    if (tag[0] === "@") {
      bindTo.tag = true;
      tag = tag.slice(1);
    }
    for (i = _i = 0, _len = klass.length; _i < _len; i = ++_i) {
      k = klass[i];
      if (k[0] === "@") {
        klass[i] = k.slice(1);
        bindTo["class"].push(klass[i]);
      }
    }
    return {
      tagName: tag,
      "class": klass,
      id: id,
      bindTo: bindTo
    };
  };

  addToEnv = function(env, key, val) {
    if (env[key] == null) {
      env[key] = $();
    }
    return env[key] = env[key].add(val);
  };

  bling = function(str, options, onCreate) {
    var $tag, appendTo, depth, elAttrs, env, i, k, klass, part, parts, rootTag, tag, tags, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

    if (options == null) {
      options = {};
    }
    if (_.isFunction(options)) {
      options = {
        onCreate: options
      };
    }
    if (_.isFunction(onCreate)) {
      options.onCreate = onCreate;
    }
    options.onCreate || (options.onCreate = function() {});
    options.appendTo || (options.appendTo = false);
    options.defaultTag || (options.defaultTag = "div");
    options.self || (options.self = {});
    elAttrs = {};
    for (k in options) {
      v = options[k];
      if (k !== "appendTo" && k !== "onCreate" && k !== "defaultTag" && k !== "self") {
        elAttrs[k] = v;
      }
    }
    env = {};
    tags = [];
    appendTo = options.appendTo;
    rootTag = false;
    depth = 0;
    if (_.isString(appendTo)) {
      appendTo = $(appendTo);
    }
    parts = str.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split(' ');
    for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
      part = parts[i];
      if (!(part !== ",")) {
        continue;
      }
      tag = parseTag(part.trim(), options.defaultTag);
      tags.push($tag = $("<" + tag.tagName + "/>", elAttrs));
      if (appendTo) {
        $tag.appendTo(appendTo);
      } else if (depth === 0) {
        if (!rootTag) {
          rootTag = $tag;
        } else {
          rootTag = rootTag.add($tag);
        }
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
      if (tag.bindTo.id) {
        options.self["$" + tag.id] = $tag;
      }
      _ref1 = tag.bindTo["class"];
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        k = _ref1[_k];
        options.self["$" + k] = $tag;
      }
      if (tag.bindTo.tag) {
        options.self["$" + tag.tagName] = $tag;
      }
      if ((parts[i + 1] != null) && parts[i + 1] === ",") {
        continue;
      }
      appendTo = $tag;
      depth++;
    }
    env._ = options.self;
    if ((_ref2 = options.onCreate) != null) {
      _ref2.apply(env, tags);
    }
    return rootTag;
  };

  bling.version = "0.0.6";

  module.exports = bling;

}).call(this);

// Generated by CoffeeScript 1.3.3
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  String.prototype.$tags = function(options) {
    var $tag, appendTo, env, i, parseTag, part, parts, tag, tags, _i, _len, _ref;
    if (options == null) {
      options = {
        appendTo: false,
        onCreate: (function() {}),
        defaultTag: "div"
      };
    }
    parseTag = function(str) {
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
    env = {};
    tags = [];
    appendTo = options.appendTo || $("body");
    parts = this.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split(' ');
    for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
      part = parts[i];
      if (!(part !== ",")) {
        continue;
      }
      tag = parseTag(part);
      tags.push($tag = $("<" + tag.tagName + "/>").appendTo(appendTo));
      if (tag.id) {
        $tag.attr({
          id: tag.id
        });
      }
      if (tag["class"]) {
        $tag.addClass(tag["class"].join(" "));
      }
      if (env[tag.tagName] != null) {
        if (_.isArray(env[tag.tagName])) {
          env[tag.tagName].push($tag);
        } else {
          env[tag.tagName] = [env[tag.tagName], $tag];
        }
      } else {
        env[tag.tagName] = $tag;
      }
      if ((parts[i + 1] != null) && parts[i + 1] === ",") {
        continue;
      }
      appendTo = $tag;
    }
    if ((_ref = options.onCreate) != null) {
      _ref.apply(env, tags);
    }
    return tags;
  };

}).call(this);
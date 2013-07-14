//# sourceURL=populist/loader.js
(function(entries, sources) {
  var modules = {};
  var hasOwn = modules.hasOwnProperty;
  var global = Function("return this")();
  var doc = global.document;
  var head = doc.documentElement.firstChild;

  function internalRequire(id) {
    var module = getModule(id);
    if (module && !hasOwn.call(module, "exports")) {
      module(function(rid) {
        return internalRequire(absolutize(id, rid));
      }, module.exports = {}, module);
    }
    return module.exports;
  }

  function getModule(id) {
    if (!hasOwn.call(modules, id)) {
      if (hasOwn.call(sources, id)) {
        var name = "module$" + Math.random().toString(36).slice(2);
        var script = doc.createElement("script");
        var code = "function " + name + "(require,exports,module){" +
          sources[id] + "\n}\n//# sourceURL=" + id + ".js\n";
        script.setAttribute("type", "text/javascript");
        script.setAttribute("encoding", "utf8");
        script.appendChild(doc.createTextNode(code));
        head.appendChild(script);
        modules[id] = global[name];
      } else {
        throw new Error("Missing module: " + id);
      }
    }
    return modules[id];
  }

  var pathNormExp = /\/(\.?|[^\/]+\/\.\.)\//;
  function absolutize(id, rid) {
    if (rid.charAt(0) === ".") {
      rid = "/" + id + "/../" + rid;
      while (rid != (id = rid.replace(pathNormExp, "/")))
        rid = id;
      rid = rid.replace(/^\//, "");
    }
    return rid;
  }

  for (var id in entries) {
    if (hasOwn.call(entries, id)) {
      var exports = internalRequire(id);
      var globalName = entries[id];
      if (globalName) {
        global[globalName] = exports;
      }
    }
  }
})
_ = require "underscore"

parseTag = (str, defaultTag) ->
    bindTo = {id: false, class: [], tag: false}

    if "#" in str
        [tag, rest] = str.split "#"
        
        if not tag.length
            tag = defaultTag
        
        [id, klass...] = rest.split "."
    else if "." in str
        id = false
        
        [tag, klass...] = str.split "."
        
        if not tag.length 
            tag = defaultTag                
    else
        tag = str
        id = false
        klass = false

    if id[0] is "@"
        bindTo.id = true 
        id = id[1..-1]

    if tag[0] is "@"
        bindTo.tag = true
        tag = tag[1..-1]

    for k,i in klass 
        if k[0] is "@" 
            klass[i] = k[1..-1]
            bindTo.class.push klass[i]

    return tagName: tag, class: klass, id: id, bindTo: bindTo
    
addToEnv = (env, key, val) ->
    if not env[key]?
        env[key] = $()
        
    env[key] = env[key].add val

bling = (str, options = {}, onCreate) ->
    if _.isFunction options
        options = onCreate: options
    if _.isFunction onCreate
        options.onCreate = onCreate

    options.onCreate or= ->
    options.appendTo or= false
    options.defaultTag or= "div"
    options.self or= {}

    elAttrs = {}
    for k, v of options when k not in ["appendTo", "onCreate", "defaultTag", "self"]
        elAttrs[k] = v
        
    env = {}
    tags = []
    appendTo = options.appendTo
    rootTag = false
    if _.isString appendTo then appendTo = $ appendTo
    
    parts = str.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split ' '
    for part,i in parts when part isnt ","
        tag = parseTag part.trim(), options.defaultTag
        
        tags.push $tag = $("<#{tag.tagName}/>", elAttrs)

        if appendTo
            $tag.appendTo appendTo
        else if tags.length > 1
            rootTag.after $tag
            
        addToEnv env, tag.tagName, $tag
        
        if tag.class
            $tag.addClass tag.class.join " "
            addToEnv(env, klass, $tag) for klass in tag.class
           
        if tag.id
            $tag.attr id: tag.id
            addToEnv env, tag.id, $tag
        
        if tag.bindTo.id
            options.self["$"+tag.id] = $tag
        for k in tag.bindTo.class
            options.self["$"+k] = $tag
        if tag.bindTo.tag
            options.self["$"+tag.tagName] = $tag

        if not rootTag
            rootTag = $tag
                
        continue if parts[i+1]? and parts[i+1] is ","

        appendTo = $tag

    env._ = options.self
    options.onCreate?.apply env, tags
    rootTag

module.exports = bling

$ = require "jquery"
_ = require "underscore"

parseTag = (str, defaultTag) ->
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

    return tagName: tag, class: klass, id: id
    
addToEnv = (env, key, val) ->
    if not env[key]?
        env[key] = $()
        
    env[key] = env[key].add val

bling = (str, options = {}) ->
    if _.isFunction options
        options = onCreate: options
        
    options.onCreate or= ->
    options.appendTo or= false
    options.defaultTag or= "div"

    elAttrs = {}
    for k, v of options when k not in ["appendTo", "onCreate", "defaultTag"]
        elAttrs[k] = v
        
    env = {}
    tags = []
    appendTo = options.appendTo
    rootTag = false
    if _.isString appendTo then appendTo = $ appendTo
    
    parts = str.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split ' '
    for part,i in parts when part isnt ","
        tag = parseTag part, options.defaultTag
        
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
            
        if not rootTag
            rootTag = $tag
                
        continue if parts[i+1]? and parts[i+1] is ","

        appendTo = $tag


    options.onCreate?.apply env, tags
    rootTag

module.exports = bling

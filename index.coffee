String.prototype.$tags = (options = {appendTo: false, onCreate: (->), defaultTag: "div"}) ->
    parseTag = (str) ->
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
    
    env = {}
    tags = []
    appendTo = options.appendTo or $("body")
    parts = @.replace(/\,/g, ' , ').replace(/\s+/g, ' ').split ' '
    for part,i in parts when part isnt ","
        tag = parseTag part
        tags.push $tag = $("<#{tag.tagName}/>").appendTo appendTo
        if tag.id then $tag.attr id: tag.id
        if tag.class then $tag.addClass tag.class.join " "

        if env[tag.tagName]?
            if _.isArray env[tag.tagName]
                env[tag.tagName].push $tag
            else
                env[tag.tagName] = [env[tag.tagName], $tag]
        else
            env[tag.tagName] = $tag
            
        continue if parts[i+1]? and parts[i+1] is ","

        appendTo = $tag


    options.onCreate?.apply env, tags
    tags    
 

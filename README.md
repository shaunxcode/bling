	$$$$$$$\  $$\       $$$$$$\ $$\   $$\  $$$$$$\  
	$$  __$$\ $$ |      \_$$  _|$$$\  $$ |$$  __$$\ 
	$$ |  $$ |$$ |        $$ |  $$$$\ $$ |$$ /  \__|
	$$$$$$$\ |$$ |        $$ |  $$ $$\$$ |$$ |$$$$\ 
	$$  __$$\ $$ |        $$ |  $$ \$$$$ |$$ |\_$$ |
	$$ |  $$ |$$ |        $$ |  $$ |\$$$ |$$ |  $$ |
	$$$$$$$  |$$$$$$$$\ $$$$$$\ $$ | \$$ |\$$$$$$  |
	\_______/ \________|\______|\__|  \__| \______/ 


bling provides a simple hack for creating html fragments. I wouldn't call it a template system but it takes the same bus to work. The motivation was tiring of either:

* programatically creating dom structures and maintaining handles to them when often it was just for further appending or setting a single property. (meaning polluting my view object un-necessarily)
* using something like handlebars or mustache and then having to write jquery selectors for the parts I cared about anyway. 

Bling solves this by providing a simple syntax (similar to css selectors) for defining the fragments and than accepts a callback which is called with an environment (this) which already has handles to all of the created tags - grouped by tag name, class name, and ID. Note that if there is more than one you are dealing with a jquery collection and will need to use .eq(n) to grab the specific item you are looking for. In practice this has never been an issue if you use meaningful class/id names. 


##Syntax
Class and id can be added - if there is an id it must come first. 

```bling "div#someId.someClass1.someClass2"``` => ```<div id="someId" class="someClass1 someClass2"></div>```

There is an implied hierarchy unless a comma follows a tag. e.g. 

```bling "a b c"``` => ```<a><b><c></c></b></a>```

```bling "a b, c"``` => ```<a><b></b><c></c></a>```

If no tag name is specified it defaults to "div" unless **defaultTag** is provided as an option.

```bling ".person .age, .height, .weight"``` => 

	<div class="person">
		<div class="age"></div>
		<div class="height"></div>
		<div class="weight"></div>
	</div>

##Argument Arities
```bling tagString, [{appendTo, onCreate, defaultTag, [all valid jquery config options e.g. class, on, text etc.]}]```

```bling tagString, onCreate```

``bling tagString, {options}, onCreate```

Useful when you just want a detached fragment you are going to append somewhere else subsequently. 

##Options
**appendTo**: the jquery obj/selector to which the tags should start being appended to. Defaults to false which facilitates allowing returning jquery obj containing created tags.

**onCreate**: callback which is called once all tags have been created. Defaults to no-op.

**defaultTag**: if you do not specify a tag name and only the id or class this is the tag that will be used. Defaults to "div".

**self**: this is what any element/id/classes prefixed with @ will have a ref assigned to so an external object may capture a handle to them w/o manually assigning inside the onCreate callback. If self is passed in it will be assigned to _ in the environment applied to the onCreate callback. This just aleviates the "self = this" pattern which is often utilized before a callback inside of a view which utilizes something like bling. Bling follows the convention of prefixing the variable named with $ so if you have bling "@div .@classname", me: view. You will have view.$div and view.$classname respectively.

#onCreate
It is applied with an environment giving access to the tags by name, class and id. It is called with arguments in positional order of tag creation. e.g. if you call it with "div p span" it will be called with 3 arguments. 
If there are more than one of the same element or classname created they will be joined into a single jquery selector so to access just one of them .eq(n) must be used.

##Examples
	class view
		render: ->
			@$el = bling "ul li@.name, li@.age, @.weight", self: @, ->
				@weight.text @_.model.weight

			@$name.text "willard"
			@$age.text(23).on click: -> alert "stuff about age"


	bling "div#name.x.y label, input, button, button"
	    appendTo: "body"
		onCreate: (wrapper, label, input, ok, cancel) -> 
			@button.eq(1).on click: => alert "you done been clicked"
			label.text "hah:"
			ok.text("ok").on click: => alert "ok"
			cancel.text("cancel")
			
	$("body").append bling "ul li, li, li"
	    onCreate: (list, item1, item2, item3) ->
			list.css border: "1px solid #333"
			item1.text "1"
			item2.text "2"
			item3.text "3"
			item3.append bling "button#okButton.ok, button.cancel", ->
			    #by id
			    @okButton.css color: "red"
			    #by classname
				@ok.text("OK").on click: -> alert "some text"
				#by tag name
				@button.eq(1).text("CANCEL").on click: -> console.log "yo dawg"​​​​

Real world example of using it to quickly define a bootstrap layout

	bling ".container-fluid.workspace .row-fluid .span2.toolbox, .span5.editor, .span5.output"
		appendTo: "body"
		onCreate: ->
        	@toolbox.text "toolbox"
			@editor.text "editor"
			@output.text "output"​​​​​​​​​​​​​​​​​​​
        
##Dependencies
underscore.js, jquery.js

##Deviants
For those who would like to pretend they are writing smalltalk

	String.prototype.$tags = (options) -> bling @, options

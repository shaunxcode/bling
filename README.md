bling
=====
Provides simple $tags method to string prototype. Yes this is a hack, but one which is useful for rapid prototyping. 

##Concept
Cut out the templating and subsequent jquery binding and at the same time avoid the grossness that is markup.
String#$tags may be called either with a single callback or an options hash containing info about where to append, creation callback and the default tag. Either way it returns the primary/root element generated so that you may append/insert it like a normal jquery wrapped html chunk.

##Syntax
Close to css selectors. 

Class and id can be added - if there is an id it must come first. 

"div#someId.someClass1.someClass2" => ```<div id="someId" class="someClass1 someClass2"></div>```

Implied hierarchy unless a comma follows a tag. e.g. 

"a b c" => ```<a><b><c></a></b></c>```

"a b, c" => ```<a><b></b><c></c></a>```

".person .age, .height, .weight" => 

	<div class="person">
		<div class="age"></div>
		<div class="height"></div>
		<div class="weight"></div>
	</div>


##Options
**appendTo**: the jquery obj to which the tags should start being appended to. Defaults to "body"

**onCreate**: callback which is called once all tags have been created. It is passed an environment giving access to the tags by name on the "this" of the callback. If you have more than one instance of a tag it will be an array - otherwise it will be the jquery obj. Defaults to a no-op.

**defaultTag**: if you do not specify a tag name and only the id or class this is the tag that will be used. Defaults to "div".


##Examples
	"div#name.x.y label, input, button, button".$tags 
	    appendTo: "body"
		onCreate: (wrapper, label, input, ok, cancel) -> 
			@button[1].on click: => alert "you done been clicked"
			label.text "hah:"
			ok.text("ok").on click: => alert "ok"
			cancel.text("cancel")
			
	$("body").append "ul li, li, li".$tags 
	    onCreate: (list, item1, item2, item3) ->
			list.css border: "1px solid #333"
			item1.text "1"
			item2.text "2"
			item3.text "3"
			item3.append "button, button".$tags -> 
				@button[0].text("OK").on click: -> alert "some text"
				@button[1].text("CANCEL").on click: -> console.log "yo dawg"​​​​

Real world example of using it to quickly define a bootstrap layout

	".workspace.container-fluid .row-fluid .span2.toolbox, .span5.editor, .span5.output".$tags 
		appendTo: "body"
		onCreate: (w,r, toolbox, editor, output) ->
        	toolbox.text "toolbox"
			editor.text "editor"
			output.text "output"​​​​​​​​​​​​​​​​​​​
        
##Dependencies
underscore.js, jquery.js



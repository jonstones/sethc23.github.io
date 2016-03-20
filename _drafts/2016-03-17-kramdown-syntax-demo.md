---
title: Kramdown Cheat Sheet
layout: post
comments: true
---

## Table of Contents:
1. [Paragraphs](#paragraphs)
2. [Block quotes](#block-quotes)
3. [Code blocks](#code-items)
4. [List items](#list-items)
5. [Definition Lists](#definition-lists)
6. [Tables](#tables)
7. [HTML elements](#html-elements)
8. [Links and Images](#links-and-images)
9. [Inline attributes](#inline-attributes)
10. [Footnotes](#footnotes)


- - -


## 1. Paragraphs
A simple paragraph with an ID attribute.
{: #para-one}

## 2. Block quotes
 
> A blockquote with a title
{:title="The blockquote title"}
{: #myid}
 > A nice blockquote
{: .css_class1 .css_class2}
> >Nested blockquotes are
> >also possible.
>
> ## Headers work too
> This is the outer quote again.
* {:.cls} This item has the class "cls"

## 3. Code Blocks

a) 

This is a sample code block.

    Continued here.

b) 

~~~~~~
This is also a code block.
~~~
Ending lines must have at least as
many tildes as the starting line.
~~~~~~~~~~~~
 
c)

~~~ ruby
def what?
  42
end
~~~

d)

{:.ruby}
    Some code her


## 4. List Items
 
1.  This is a list item

    > with a blockquote

    # And a header

2.  Followed by another item

## 5. Definition Lists

a)
 
term
: definition
: another definition

another term
and another term
: and a definition for the term

b)
 
term

: definition
: definition

c)
 
This *is* a term

: This will be a para

  > a blockquote

  # A header
 
## 6. Tables

a)

| Header1 | Header2 | Header3 |
|:--------|:-------:|--------:|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|----
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|=====
| Foot1   | Foot2   | Foot3
{: rules="groups"}

b)

|-----------------+------------+-----------------+----------------|
| Default aligned |Left aligned| Center aligned  | Right aligned  |
|-----------------|:-----------|:---------------:|---------------:|
| First body part |Second cell | Third cell      | fourth cell    |
| Second line     |foo         | **strong**      | baz            |
| Third line      |quux        | baz             | bar            |
|-----------------+------------+-----------------+----------------|
| Second body     |            |                 |                |
| 2 line          |            |                 |                |
|=================+============+=================+================|
| Footer row      |            |                 |                |
|-----------------+------------+-----------------+----------------|


## 7. HTML elements

<div style="float: right">
Something that stays right and is not wrapped in a para.
</div>

{::options parse_block_html="true" /}

<div>
This is wrapped in a para.
</div>
<p>
This can contain only *span* level elements.
</p>

## 8. Links and images

[referenced-link-with-attributes]: https://s-media-cache-ak0.pinimg.com/736x/36/1f/a2/361fa2246dc78579fca544e3b6c12c1c.jpg
{:height="36px" width="36px"}

|Result|Code|
|---
| <http://kramdown.gettalong.org/syntax.html>, <example@example.com>, or a [referenced link](http://kramdown.gettalong.org) to the kramdown syntax page |`<http://kramdown.gettalong.org/syntax.html>, <example@example.com>, or a [referenced link](http://kramdown.gettalong.org) to the kramdown syntax page` |
| ----
| links to documents elements such as the [Table of Contents](#table-of-contents) | `links to documents elements* such as the [Table of Contents](#table-of-contents)` |
| ----
|here is an inline image with size attributes ![smiley](https://s-media-cache-ak0.pinimg.com/736x/36/1f/a2/361fa2246dc78579fca544e3b6c12c1c.jpg){:height="36px" width="36px"}|`here is an inline image with size attributes ![smiley](https://s-media-cache-ak0.pinimg.com/736x/36/1f/a2/361fa2246dc78579fca544e3b6c12c1c.jpg){:height="36px" width="36px"}`|
| ----
|  better practice may be to create a reference... | `[referenced-link-with-attributes]: https://s-media-cache-ak0.pinimg.com/736x/36/1f/a2/361fa2246dc78579fca544e3b6c12c1c.jpg {:height="36px" width="36px"}` |
| ...and later using the defined reference: ![referenced-link-with-attributes] | `and later using the defined reference: ![referenced-link-with-attributes]`  |
{: rules="groups"}
\* requires using kramdown settings: {'auto_ids' : true, 'auto_id_prefix': ''}

## 9 Inline attributes
 
|Result|Code|
|---
|This is <span style="color: red">written in red</span>.|`This is <span style="color: red">written in red</span>.`|
| ----
|Use backticks to markup code, e.g. `` `code` ``.|```Use backticks to markup code, e.g. `` `code` `` ``` |
| ----
| This is *red*{: style="color: red"}. | `This is *red*{: style="color: red"}.`|
| ----
| This *is*{:.underline} some `code`{:#id}{:.class}. | ```This *is*{:.underline} some `code`{:#id}{:.class}.``` |
{: rules="groups"}


## 10. Footnotes

 This is some text.[^1]. Other text.[^footnote].

[^1]: Some *crazy* footnote definition.

[^footnote]:
    > Blockquotes can be in a footnote.

        as well as code blocks

    or, naturally, simple paragraphs.

[^other-note]:       no code block here (spaces are stripped away)

[^codeblock-note]:
        this is now a code block (8 spaces indentation)



---

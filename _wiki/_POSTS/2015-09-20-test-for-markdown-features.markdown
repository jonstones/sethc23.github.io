---
title: Test Markdown Features
layout: post
---


## Testing
Is there any space between here and the above header?


#### no_intra_emphasis
emphasis _here_ and no_emphasis_here

#### tables
| a | b | c
|---|---|---
| 1 | 2 | 3

#### autolink
whatismyip.com

www.dairyqueen.com

http://yesman.com

http://www.sanspaper.com

#### strikethrough
this is ~~good~~ bad

#### superscript
this is the 2^(nd) time

#### underline
This is _underlined_ but this is still *italic*.

#### highlight
This is ==highlighted==

#### footnotes
For this comment[^1]
[^1]: Here is a footnote.

#### Prettify
>>  local t = _tbl.table_invert(tbl_in)
>>  local cnt = 1
>>  for k,v in pairs(t) do
>>  if v == _var then return cnt
>>  else cnt = cnt + 1 end
>>  end

<code> local t = _tbl.table_invert(tbl_in) local cnt = 1 for k,v in pairs(t) do if v == _var then return cnt else cnt = cnt + 1 end end </code>


#### with_toc_data
[Does this bring you back to the top?](#Testing)


Features by Redcarpet; hosted @ Git Pages
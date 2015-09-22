---
title: pgSQL f(x) z_string_matching
layout: post
---

## UPDATE LINK IN COMMENTS

> `z_string_matching(  qry_a text, qry_b text, with_permutations text  )`

The input querys A and B must provide the aliases (a_str, a_idx),(b_str, b_idx), respectively.

For each a_str, this function finds the best matching b_str,
    and returns (a_str, a_idx, jaro_score, b_str, b_idx, other_matching).
"other_matching" provides the b_idx for other b_str having the same highest score.
Avoid using "pllua_" as an a prefix for any alias within either qry_a or qry_b.

"with_permutations" will make this function further consider all permutations of b_str
    as split by any of the dividing character segment(s).
    To consider permutations of b_str "one_two_three" (e.g., "two_one_three", etc...)
        provide "_" or "_;" as the value for "with_permutations".
    A ";" marks a break point between split characters.
    For a single space, " ;" must be at beginning if at all.
    For a single emi-colon, ";;" must be at the end if at all.
    Default value for "with_permutations" is " ;-;_;/;\\;|;&;;"

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
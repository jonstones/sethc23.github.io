---
title: Custom pgSQL Functions -- string_matching
layout: post
tags: pgxz-function function-definition work-in-progress
---


## **string_matching(*qry_a*, *qry_b*, *params_as_json*)**

</br>

#### _Methodology_:


> For each `a_str`, this function finds the best matching `b_str`. This function utilizes the [Jaro-Winkler algorithm](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance), and provides additional fine-tuning paramitization for segmenting, sorting, partial matching, and ranking of all permutations therein.



#### _Query Strings_: 

This function returns a number between 0 and 1 quantifying the similarity between the results of two *postgreSQL* search queries.  The input queries `qry_a` and `qry_b` must designate the aliases (`a_str`, `a_idx`) and (`b_str`, `b_idx`), respectively. 

#### For example, these tables:



```PLpgSQL
DROP TABLE IF EXISTS z_string_test_1;
CREATE TABLE z_string_test_1 AS (
    SELECT
        ARRAY['MARTHA','DWAYNE','DIXON'] a_str,
        ARRAY[1,2,3] a_idx,
        ARRAY['DUANE','MARHTA','DICKSONX'] b_str,
        ARRAY[2,3,4] b_idx
);

DROP TABLE IF EXISTS z_string_test_2;
CREATE TABLE z_string_test_2 AS (
    SELECT
        UNNEST(a_str) a_str,
        UNNEST(a_idx) a_idx,
        UNNEST(b_str) b_str,
        UNNEST(b_idx) b_idx
    FROM z_string_test_1
);
```

#### queried as:



```PLpgSQL
SELECT * FROM z_string_matching(
    'SELECT a_str a_str,a_idx a_idx FROM z_string_test_2',
    'SELECT b_str b_str,b_idx b_idx FROM z_string_test_2',
    'false'
)

SELECT * FROM z_string_matching(
    'SELECT UNNEST(a_str) a_str,UNNEST(a_idx) a_idx FROM z_string_test_1',
    'SELECT UNNEST(b_str) b_str,UNNEST(b_idx) b_idx FROM z_string_test_1',
    ''
)
```

<br>

#### each produces the [generally accepted results](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance):

<br>

| # | a_idx | a_str | jaro_score | b_str | b_idx | other_matches |
|---
| 0 | 1 | MARTHA | 0.9444 | MARHTA | 3 | {} |
| 1 | 2 | DWAYNE | 0.8222 | DUANE | 2 | {} |
| 2 | 3 | DIXON | 0.7667 | DICKSONX | 4 | {} |


-  -  -

  
Of further note:  

1. the Jaro-Winkler algorithm values first letter(s) matches >> last letter matches
2. `jaro_score` equals 0.0 where any string evaluated has a length less than 4 
3. `other_matches` is the index (i.e., `b_idx`) of the other `b_str` matches having the same best jaro score
4. avoid using **"pllua_"** as a prefix for any alias relating to `qry_a` or `qry_b`

- - -

#### _Parameter String_:

The `params_as_json` argument is either:

- (a) the case-insensitive string **"false"**, or,
- (b) a one dimensional JSON string.

If a JSON string, it may comprise any combination of the below *Parameter List*.

Some general points:

- all keys and values of `params_as_json` are strings enclosed with double quotes (and not two single quotes)
- all boolean values are case insensitive


*PARAMETERS*:

<br>

> _**`first_match_only`**_: Upon finding a `b_str` match for a particular `a_str` given the input criteria, stop further processing re: `a_str` and return the first-matched `b_str`.  This option often works well in conjunction with minimal iterative steps and high-score conditions to quickly extract the easy matches and minimize the number of future, more arduous, steps.

- ==[x] implement==
- ==[ ] finish note==

<br>

> _**`a_cols_as_prefix`**_[^1],
> _**`a_cols_as_suffix`**_[^1]: Each of these parameters is a string split by a semi-colon and made into a list that defines additional return columns in `qry_a`.  The *prefix* and *suffix* parameters define what set of strings, and in what order, will be concatenated with the base return column (i.e., `a_str`). The parameters `div_str` and `concat_str` (described next) define how the string set will be split and joined, respectively, and then compared.

- ==[x] implement==
- ==[ ] finish note==

<br>

> _**`concat_str`**_: This parameter defines what character set is used to combine string parts, if applicable.

- **Default: `" "`**

- ==[x] implement==
- ==[ ] finish note==

<br>

<br>

> _**`div_str`**_:  This parameter defines what characters are used to split strings into segments, and is used by default to normalize string before comparison (see `a_str_mod` for more detail). This parameter, used in conjunction with `a_str_mod`, can operate as a regular expression substitute.[^2] A semicolon (==";"==) marks a break point between segments of characters used to split a string (**"splitting segment"** hereinafter).

- Multiple criteria of any non-zero length may constitute a splitting segment.
- All splitting segment space(s) (e.g., =="   ;  ; ;"==) must be at the beginning of `div_str`.
- Only single semi-colons can currently be used as splitting segments (e.g., ==";;"==), and it must be put at the end of `div_str`.
- **Default: ==" ;-;_;/;\\;|;&;;;"==**

<br>

- ==[X] implement==
- ==[ ] finish note==

<br>

See [String Manipulation examples](#string-manipulation-examples).

<br>

> _**`a_str_mod`**_[^1]: this parameter designates an additional option for evaluating variations of the query input `a_str`. 

Available options:

- =="norm"== *or* ==""== *or* (*undesignated*) (**Default**): By default, `a_str` and `b_str` are split by all splitting characters defined by `div_str` and then concatenated with the value of `concat_str`.  This step effectively normalizes strings and usually allows for more consistent scoring.
- =="none"== *or* =="false"==:  These case-insensitive options disable the normalization step.
- =="iter"==: With this option, this function splits each `a_str` by `div_str` and evaluates each segment therein. For example, where `a_str` equals "one-two-three", this function will attempt to return the best match for all cases where `a_str` equals "one", "two", or "three" (assuming `div_str` is =="-"== or includes =="-;"==).
- =="perm"==: Here, the function splits each `a_str` by `div_str` and evaluates all permutations of segment arrangements.  For example, where `a_str` equals "one-two-three", this function will attempt to return the best match for cases where `a_str` equals "two-one-three", "three-one-two", etc... (assuming `div_str` is =="-"== or includes =="-;"==).

<br>

- ==[X] implement==
- ==[ ] finish note==

<br>

See [String Permutation examples](#string-permutation-examples).

<br>

> _**`a_str_condition`**_[^1]: This parameter provides a mechanism for limiting the results of the input queries (e.g., `qry_a`) when the input queries return, that is, the result that this function then scores.

- ==[x] implement==
- ==[ ] finish note==

<br>

> _**`a_idx_condition`**_ : When `iter_a_str_perms` equals **"true"**, this condition is handy to minimize the iterations of `a_str` that are compared with every `b_str` result.

- ==[x] implement==
- ==[ ] finish note==

<br>

> _**`update_cond`**_:  This allows for fine-tuning when and what results are returned.

- ==[x] implement==
- ==[ ] finish note==

<br>


<br>

#### _String Manipulation Examples_:

- ==[ ] implement==
- ==[ ] finish note==

<br>

#### _String Permutation Examples_:

- ==[ ] implement==
- ==[ ] finish note==

<br>

#### _Reference to Related Functions_:

- **string_matching_mgr**

    - ==[ ] implement==
    - ==[ ] finish note==


#### _Add this webpage to pgSQL function comments_:

- ==[ ] implement==



<br>

[^1]: This description relating to `qry_a` applies similarly to `qry_b`.

[^2]: Lua regular expression [patterns](http://www.lua.org/manual/5.1/manual.html#5.4.1) are somewhat uncommon, and therefore, were not natively integrated.  For example, (1) "or" logic does not exist (or did not exist when developing), (2) matching patterns cannot be quantified (e.g., "{n,}"), and (3) there is no mechanism to capture the n-th string match where n>9.

- - -

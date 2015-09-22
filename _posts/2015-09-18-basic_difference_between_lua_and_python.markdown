---
title: How Lua compares with Object-Oriented languages like Python
layout: post
comments: true
---
#### [The essence of Lua](http://www.lua.org/pil/16.html):

>> **A table in Lua is an object in more than one sense. Like objects, tables have a state. Like objects, tables have an identity (a selfness) that is independent of their values; specifically, two objects (tables) with the same value are different objects, whereas an object can have different values at different times, but it is always the same object.**

More than convenience?

```lua
function Account.withdraw (self, v)
    	self.balance = self.balance - v
    end
a.withdraw(a, 100.00)
```

```lua
function Account:withdraw (v)
    	self.balance = self.balance - v
    end
a:withdraw(100.00)
```
---

#### Tables are [*class objects with metadata*](http://www.lua.org/pil/16.1.html):

```lua
a,b = {},{}

b.test = "passes objects"
a = setmetatable(a, {__index = b})
print(a.test)          -->  "passes objects"

b[2] = "forwards"
print(a[2])            -->  "forwards"

a["3"] = "NOT backwards"
print(b["3"])          -->  nil
```

>> After that[ assignment with `setmetatable`], `a` looks up in `b` for any operation that it does not have. To see `b` as the class of object `a` is not much more than a change in terminology.

---

#### A Benefit

For example, an object invoking this class:

```lua
function Account:new (o)
    o = o or {}   			-- create object if user does not provide one
    setmetatable(o, self)  	-- i.e., setmetatable(object, add_a_class)
    self.__index = self
    return o
end
```

also [inherits *other _methods_* from that class](http://www.lua.org/pil/16.2.html), i.e.,

```lua
b = Account:new()
print(b.balance)    --> 0
```
---

####  A Cost

[Multiple inheritance](http://www.lua.org/pil/16.3.html) can increase access-overhead, but, tricks like below short-circuit access points and keep costs low:

```lua
setmetatable(c, {__index = function (t, k)
    local v = search(k, arg)
    t[k] = v       -- save for next access
    return v
end})
```
---
#### [Benchmarks](http://lua-users.org/wiki/ObjectBenchmarkTests)

After direct access, [no-self-style implementations](http://www.lua.org/pil/16.4.html) are fastest:

```lua
function newAccount (initialBalance)

    local self = {balance = initialBalance}

    local withdraw = function (v)
                        self.balance = self.balance - v
                     end

    local deposit = function (v)
                        self.balance = self.balance + v
                    end

    local getBalance = function () return self.balance end

    return {
    	withdraw = withdraw,
    	deposit = deposit,
    	getBalance = getBalance
    }
end
```

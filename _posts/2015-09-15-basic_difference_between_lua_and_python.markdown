---
title: Basic Difference Between Lua and Python
layout: post
---
## [The essence of Lua](http://www.lua.org/pil/16.html): How it compares with Object-Oriented languages like Python.

> **A table in Lua is an object in more than one sense. Like objects, tables have a state. Like objects, tables have an identity (a selfness) that is independent of their values; specifically, two objects (tables) with the same value are different objects, whereas an object can have different values at different times, but it is always the same object.**

##### More than convenience?

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


#### I. Bridging the gap -- tables are [class objects with metadata](http://www.lua.org/pil/16.1.html):

```lua
setmetatable(a, {__index = b})
```

> After that, `a` looks up in `b` for any operation that it does not have. To see `b` as the class of object `a` is not much more than a change in terminology.


#### II. Benefits of Metadata

For example, an object invoking this class:
```lua
function Account:new (o)
    o = o or {}   			-- create object if user does not provide one
    setmetatable(o, self)  	-- i.e., setmetatable(object, add_a_class)
    self.__index = self
    return o
end
```
also [inherits other methods from that class](http://www.lua.org/pil/16.2.html), i.e.,

```lua
b = Account:new()
print(b.balance)    --> 0
```


####  III. No Free Lunch

But, tricks like this can obviate the extra access overhead, i.e., [multiple inheritance](http://www.lua.org/pil/16.3.html), by short-circuiting access points:

```lua
setmetatable(c, {__index = function (t, k)
    local v = search(k, arg)
    t[k] = v       -- save for next access
    return v
end})
```

#### [IV. Benchmarks](http://lua-users.org/wiki/ObjectBenchmarkTests)

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

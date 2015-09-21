---
layout: post
title:  "Getting Started with Git Pages"
date:   2015-09-15 20:00:19
categories: git gitpages
---

## Installing Framework

First, see Jekyll [installation pages](http://jekyllrb.com/docs/installation/) for latest dependecies,
but, latest ruby developer install could be sufficient.

Then,
{% highlight bash %}
sudo gem install github-pages
sudo gem install bundler

# and for maintaining framework:
bundle update
{% endhighlight %}

## Create User Page

First, follow these [5 steps](https://pages.github.com/)

Then, from within the user repo directory:

{% highlight bash %}
github-pages br master > Gemfile
sudo bundle install

jekyll new ./tmp
mv tmp/* ./
mv tmp/.* ./ > /dev/null 2>&1
rmdir tmp

git add -- .
git commit -m 'generated default jekyll site'
{% endhighlight %}

This user page (sethc23) further includes [these changes](http://pastebin.com/35HpR8Fa) to the default jekyll site.


## Create Project Pages

Assuming:

> 	project location (_dir) = /home/user/projectA
> 	branch for publication --> master
> 	and, "On branch master nothing to commit, working directory clean"

The following should integrate a project page within a github user's page:

{% highlight bash %}
cd _dir
git checkout master

r_name=`git remote -v | \
    grep ^github | head -n 1 | \
    cut -f2 | sed -r 's/\.git\s.*$//g' | \
    cut -d/ -f2`
r_user=`git config --get github.user`
r_email=`git config --get user.email`
r_info=`echo https://api.github.com/repos/$r_user/$r_name | xargs curl -s --`
# not so easy to pipe output into variable but this should work!
assign() {  eval "$1=\$(cat; echo .); $1=\${$1%.}";}
assign r_description < <(echo $r_info | python -mjson.tool | \
    grep -Po --color=never '"description":.*?[^\\]",' | \
    grep -Po '([\"])(\\?.)*?\1' | tail -n 1 | \
    sed -r 's/^.//;s/.$//')

# create package config
github-pages br master > Gemfile

# create project config file
echo "title: "$r_name > _config.yml
echo "email: "r_email >> _config.yml
echo "description: "$r_description >> _config.yml
echo "baseurl: "$r_name >> _config.yml
echo "url: http://"$r_name".github.io" >> _config.yml
echo "github_username: "r_user >> _config.yml
echo "markdown: kramdown" >> _config.yml

# store config files elsewhere temporarily
tmp_dir="tmp_"$r_name
mkdir $tmp_dir
mv _config.yml $tmp_dir/
mv Gemfile $tmp_dir/
mv $tmp_dir /tmp/

# make github pages project template
git checkout -b gh-pages
rm -fr ./*
mkdir tmp
mv .git* ./tmp
rm -fr ./.*
mv /tmp/.git* ./
rmdir tmp
git add .
git commit -m "cleaned slate for web page(s)"
jekyll new .
mv /tmp/$tmp_dir/* ./
rmdir $tmp_dir
git add .
git commit -m "adding default jekyll content"
{% endhighlight %}


Locally host content with:
{% highlight bash %}
sudo bundle install
bundle exec jekyll serve --baseurl '' --port 4000
{% endhighlight %}
and preview at: [http://localhost:4000](http://localhost:4000)

Before final push/publication:
{% highlight bash %}
github-pages health-check
{% endhighlight %}

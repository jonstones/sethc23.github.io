

cd $BD/blog

sudo bundle update github-pages
sudo bundle install
sv_ctl stop jupyter
kill_by jupyter
bundle exec jekyll serve --baseurl '' --port 8901



# Project pages

# fork me link

<a href="http://github.com/mojombo"><img style="position: absolute; top: 0; right: 0; border: 0;" src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>

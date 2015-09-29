jQuery.githubCommit = function (username, repository, sha, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/git/commits/' + sha + '?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?', callback)
}

jQuery.githubRepoGetBranch = function (username, repository, branch, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/branches/' + branch + '?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?', callback)
}

jQuery.githubRepoBranchList = function (username, repository, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/branches' + '?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?', callback)
}

jQuery.githubRepo = function (username, repository, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?', callback)
}

jQuery.githubUser = function (username, callback) {
    //jQuery.getJSON('https://api.github.com/users/' + username + '/repos?sort=updated&type=owner&callback=?', callback)
    jQuery.getJSON('https://api.github.com/users/'+username+'/repos?sort=updated&access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?',callback)
}

jQuery.fn.loadRepositories = function (username) {
    this.html("<span>Querying GitHub for " + username + "'s repositories...</span>");

    var target = this;
    $.githubUser(username, function (data) {
        var repos = data.data;
        var list = $('<div id="all-repos" class="repos">');
        target.empty().append(list);

        $(repos).each(function () {
            if (this.name != (username.toLowerCase() + '.github.com')) {
                var repo_name = this.name;
                var r_list = $('<div class="post-list-item repo_info branches">');
                var _row = '<h2>';
                _row = _row + '<a href="' + (this.homepage ? this.homepage : this.html_url) + '">' + this.name + '</a>';
                _row = _row + '<em> ' + (this.language ? ('(' + this.language + ')') : '') + '</em>';
                _row = _row + '</h2>';
                _row = _row + '<p>' + this.description + '</p>';

                $.githubRepo(username, repo_name, function (more_data) {
                    var repoinfo = more_data.data;
                    if ( repoinfo.private==false && repoinfo.fork==false && repoinfo.name!='sethc23.github.io' ) {
                        r_list.append(_row);

                        $.githubRepoBranchList(username, repo_name, function (branch_list) {
                            var branches = branch_list.data;

                            var tbl_list = $('<table class="commit-table" id="repo_info" style="width:100%">');
                            var tbl_body = $('<tbody>');
                            tbl_body.append('<tr><th class="col-branch">Branch</th><th class="col-message">Message</th><th class="col-date">Date</th><th class="col-sha">Commit</th></th>')
                            $(branches).each(function () {
                                var b = this;
                                var tbl_row = $('<tr>');
                                var tbl_col = $('<th>');

                                $.githubCommit(username, repo_name, b.commit.sha, function (commit_info) {
                                    tbl_row.append('<th><div class="commit-branch">' + b.name + '</div></th>');
                                    var c = commit_info.data;
                                    tbl_row.append('<th><div class="commit-message">' + c.message + '</div></th>');
                                    var d = new Date(c.author.date);
                                    tbl_row.append('<th><div class="commit-date">' + d.toISOString().replace(/T/, ' ').replace(/\..+/, '') + '</div></th>');
                                    tbl_row.append('<th><div class="commit-sha"><a href="' + c.url + '">'+ c.sha.substring(0,7) + '</a></div></th>');

                                });

                                tbl_body.append(tbl_row);
                            });
                            tbl_list.append(tbl_body)
                            r_list.append(tbl_list);
                        });

                        list.append(r_list);

                    }
                });

            }
        });
      });
};
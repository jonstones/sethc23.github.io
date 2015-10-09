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



jQuery.fn.getRepositories = function (username) {
    
    //this.html("<span>Querying GitHub for " + username + "'s repositories...</span>");

    var target = this;

    $.githubUser(username, function (data) {
        var repos = data.data;
        var list = $('<div id="all-hidden-repos" class="repos">');
        target.empty().append(list);

        $(repos).each(function () {
            //if (this.name != (username.toLowerCase() + '.github.com')) {
                var repo_name = this.name;
                var r_list = $('<div class="post-list-item">');

                var _row = '<h2>';
                _row = _row + '<a href="' + (this.homepage ? this.homepage : this.html_url) + '">' + this.name + '</a>';
                _row = _row + '<em> ' + (this.language ? ('(' + this.language + ')') : '') + '</em>';
                _row = _row + '</h2>';
                _row = _row + '<p>' + this.description + '</p>';

                $.githubRepo(username, repo_name, function (moreData) {
                    var repoinfo = moreData.data;
                    if ( repoinfo.private==false && repoinfo.fork==false && repoinfo.name!='sethc23.github.io' ) {
                        r_list.append(_row);
                        var r_list_branches = $('');

                        $.githubRepoBranchList(username, repo_name, function (branchList) {
                            var branches = branchList.data;
                            var tbl_list = $('<table class="commit-table" id="repo_info" style="width:100%">');
                            var tbl_body = $('<tbody>');
                            tbl_body.append('<tr><th class="col-branch">Branch</th><th class="col-message">Message</th><th class="col-date">Date</th><th class="col-sha">Commit</th></th>');
                            $(branches).each(function () {
                                var b = this;
                                var tbl_row = $('<tr>');

                                $.githubCommit(username, repo_name, b.commit.sha, function (commit_info) {
                                    tbl_row.append('<th><div class="commit-branch">' + b.name + '</div></th>');
                                    var c = commit_info.data;
                                    tbl_row.append('<th><div class="commit-message">' + c.message + '</div></th>');
                                    var d = new Date(c.author.date);
                                    tbl_row.append('<th><div class="commit-date">' + d.toISOString().replace(/T/, ' ').replace(/\..+/, '') + '</div></th>');
                                    tbl_row.append('<th><div class="commit-sha"><a href="' + c.html_url + '">'+ c.sha.substring(0,7) + '</a></div></th>');
                                });
                                tbl_body.append( tbl_row );
                            });
                            tbl_list.append(tbl_body);
                            r_list.append(tbl_list);
                        });
                        list.append(r_list);
                        if (repo_name==repos[repos.length - 1].name) {
                            list.append('<div id="hidden_content_end"/>');
                        }
                    }
                });
            //}
        });
    });
};

jQuery.fn.sortRepositories = function (_from,_to) {

    function getData(from_selector) {
        //return $.ajax({
        //    //url : 'http://10.0.1.52:28901/pages/4tmp.html',
        //    url : 'http://10.0.1.52:28901/static/html/tmp_git_info.html',
        //    type: 'GET'
        //});
        return $(from_selector).toArray();
    }

    function sortFunction(a,b){
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateB > dateA ? 1 : -1;
    };

    function handleData(rows /* , textStatus, jqXHR */ ) {
        //var x = $.parseHTML(data);
        //console.log(JSON.stringify(x));
        //var rows=data.getElementsByClassName('post-list-item');

        var all_branch_rows = [];
        var most_recent_branch_commits = [];
        for (var i = 0; i < rows.length; i++) {
            var r = {};
            var _this = rows[i];
            r.id=i;
            var header = _this.getElementsByTagName('h2')[0];
            var header_link = header.getElementsByTagName('a')[0];
            r.repo_text = header_link.text;
            r.repo_datatype = header.getElementsByTagName('em')[0].innerText;
            r.repo_link = header_link.href;
            r.repo_description = _this.getElementsByTagName('p')[0].innerText;

            branches = _this.getElementsByTagName('tr');
            r.branch_cnt = branches.length - 1;
            var this_repo_branch_rows = [];
            for (var j = 1; j < branches.length; j++) {
                var _this = branches[j].getElementsByTagName('div');
                r.branch=_this[0].innerText;
                r.message=_this[1].innerText;
                r.date_text=_this[2].innerText;
		        r.date=new Date(r.date_text);
                var commit_link = _this[3].getElementsByTagName('a')[0];
                r.commit_text=commit_link.text;
                r.commit_link=commit_link.href;
                var r_copy =JSON.parse(JSON.stringify(r));
                this_repo_branch_rows.push(r_copy);
            }
            this_repo_branch_rows.sort(sortFunction);

            // Deep copy of sorted branches
            for (var j = 0; j < this_repo_branch_rows.length; j++) {

                var new_copy = this_repo_branch_rows[j];
                new_copy.id = all_branch_rows.length;
                var r_copy = JSON.parse(JSON.stringify(new_copy));

                all_branch_rows.push(r_copy);
                if ( j==0 ) {
                    most_recent_branch_commits.push(r_copy);
                }

            }

        }
        most_recent_branch_commits.sort(sortFunction);
        for (var i = 0; i < most_recent_branch_commits.length; i++) {

            var _this = most_recent_branch_commits[i];
            var next_branch_rows = all_branch_rows.slice(_this.id, _this.id + _this.branch_cnt);

            // Make Row
            var _row = '<div class="post-list-item">';

            // Row Header
            _row += '<h2><a href="'+_this.repo_link+'">'+_this.repo_text+'</a><em>'+_this.repo_datatype+'</em></h2>';
            // Row Description
            _row += '<p>'+_this.repo_description+'</p>';

            // Make Table/Body
            _row += '<table class="commit-table" id="repo_info" style="width:100%"><tbody>';

            // Table Header Row
            _row += '<tr><th class="col-branch">BRANCH</th><th class="col-message">MESSAGE</th><th class="col-date">DATE</th><th class="col-sha">COMMIT</th></tr>';

            for (var j = 0; j < next_branch_rows.length; j++) {

                var _this = next_branch_rows[j];

                // Start Branch Row
                var branch_row = "";
                branch_row += '<tr>';

                // Branch Row Columns
                branch_row += '<th><div class="commit-branch">'+_this.branch+'</div></th>';
                branch_row += '<th><div class="commit-message">'+_this.message+'</div></th>';
                branch_row += '<th><div class="commit-date">'+_this.date_text+'</div></th>';
                branch_row += '<th><div class="commit-sha"><a href="'+_this.commit_link+'">'+_this.commit_text+'</a></div></th>';

                // End Branch Row
                branch_row += '</tr>';

                _row += branch_row;

            }

            // Close Table/Body && Row
            _row += '</tbody></table>';
            _row += '</div>';

            sorted_output.append(_row);

        }

        // Close div {id="all-repos"}
        //sorted_output.append('</div>');

    }

    //var d=getData(_from);

    var t = document.getElementById("all-hidden-repos");
    var rows = t.getElementsByClassName('post-list-item');

    var target = $(_to);
    var sorted_output = $('<div id="all-visible-repos" class="repos">');
    target.empty().append(sorted_output);

    console.log(rows);
    handleData(rows);

    console.log(document.documentElement.innerHTML);

};
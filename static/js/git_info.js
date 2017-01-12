jQuery.githubCommit = function (token, username, repository, sha, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/git/commits/' + sha + '?access_token='+token+'&callback=?', callback)
}

jQuery.githubRepoGetBranch = function (token, username, repository, branch, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/branches/' + branch + '?access_token='+token+'&callback=?', callback)
}

jQuery.githubRepoBranchList = function (token, username, repository, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '/branches' + '?access_token='+token+'&callback=?', callback)
}

jQuery.githubRepo = function (token, username, repository, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '?access_token='+token+'&callback=?', callback)
}

jQuery.githubUser = function (token, username, callback) {
    jQuery.getJSON('https://api.github.com/users/'+username+'/repos?sort=updated&access_token='+token+'&callback=?',callback)
}


jQuery.fn.getRepoInfo = function (token, username, target) {

    $.githubUser(token, username, function (data) {
        var repos = data.data;
        var list = $('<div id="all-hidden-repos" class="repos">');
        target.empty().append(list);

        $(repos).each(function () {
            if (this.name != (username.toLowerCase() + '.github.com')) {
                var repo_name = this.name;

                var r_list = $('<div class="post-list-item">');

                var _row = '<h2>';
                _row = _row + '<a href="' + (this.homepage ? this.homepage : this.html_url) + '">' + this.name + '</a>';
                _row = _row + '<em>' + (this.language ? this.language : '') + '</em>';
                _row = _row + '</h2>';
                if(this.description === null){
                    _row = _row + '<p>(no description)</p>';
                } else {
                    _row = _row + '<p>' + this.description + '</p>';
                }

                $.githubRepo(token, username, repo_name, function (moreData) {
                    var repoinfo = moreData.data;
                    if (repoinfo.private == false
                        && repoinfo.fork == false
                    //&& repoinfo.name!='sethc23.github.io'
                    ) {
                        r_list.append(_row);
                        var r_list_branches = $('');

                        $.githubRepoBranchList(token, username, repo_name, function (branchList) {
                            var branches = branchList.data;
                            var tbl_list = $('<table class="commit-table" id="repo_info" style="width:100%">');
                            var tbl_body = $('<tbody>');
                            tbl_body.append('<tr><th class="col-branch">Branch</th><th class="col-message">Message</th><th class="col-date">Date</th><th class="col-sha">Commit</th></th>');

                            $(branches).each(function () {
                                var b = this;
                                var tbl_row = $('<tr>');

                                $.githubCommit(token, username, repo_name, b.commit.sha, function (commit_info) {
                                    tbl_row.append('<th><div class="commit-branch">' + b.name + '</div></th>');
                                    var c = commit_info.data;
                                    tbl_row.append('<th><div class="commit-message">' + c.message + '</div></th>');
                                    var d = new Date(c.author.date);
                                    tbl_row.append('<th><div class="commit-date">' + d.toISOString().replace(/T/, ' ').replace(/\..+/, '') + '</div></th>');
                                    tbl_row.append('<th><div class="commit-sha"><a href="' + c.html_url + '">' + c.sha.substring(0, 7) + '</a></div></th>');
                                });
                                tbl_body.append(tbl_row);
                            });

                            tbl_list.append(tbl_body);
                            r_list.append(tbl_list);
                        });
                        list.append(r_list);
                    }
                });
                list.append('<div id="hidden_content_end"/>');
            }
        });
    })

}


jQuery.fn.simpleCipher = function (codeType, msg) {

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";
    var key = "09876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";

    function simple_encode(message)
        // Given  : message is the string to be encoded using the key
        // Returns: the coded version of message using the substitution key
        {
            var coded, i, ch, index;
            coded = "";
            for (i = 0; i < message.length; i++) {        // for as many letters as there are
                ch = message.charAt(i);                   //   access the letter in the message
                index = alphabet.indexOf(ch);             //   find its position in alphabet
                if (index == -1) {                        //   if it's not a letter,
                    coded = coded + ch;                   //     then leave it as is & add
                }                                         //   otherwise,
                else {                                    //     find the corresponding
                    coded = coded + key.charAt(index);    //     letter in the key & add
                }
            }
            return coded;
        }
    function simple_decode(message)
        // Given  : message is the string to be decoded using the key
        // Returns: the decoded version of message using the substitution key
        {
            var coded, i, ch, index;
            coded = "";
            for (i = 0; i < message.length; i++) {             // for as many letters as there are
                ch = message.charAt(i);                        //   access the letter in the message
                index = key.indexOf(ch);                       //   find its position in key
                if (index == -1) {                             //   if it's not a letter,
                    coded = coded + ch;                        //     then leave it as is & add
                }                                              //   otherwise,
                else {                                         //     find the corresponding
                    coded = coded + alphabet.charAt(index);    //     letter in the alphabet & add
                }
            }
            return coded;
        }

    if (codeType=="encode") {
        return simple_encode(msg)
    } else if (codeType=="decode") {
        return simple_decode(msg)
    } else {
        return msg
    };
}

jQuery.fn.firstGetLimitedRepoToken = function (username, target) {

    var token = "";
    // var _url = "http://alloworigin.com/get?url=" + encodeURIComponent("http://pastebin.com/raw.php?i=N1Gskkpk") + "&callback=?&tor=1";

    // $.getJSON(_url, function (data) {
    //     data.data
    // }).always(function (d) {
    //     token = d.contents;
    // });


    var token = $.fn.simpleCipher("decode",
                                  "khjFBigJIGiDjDFffCkCfEifCGhGGKCJCHiGFEDF");

    // console.log("firstGet");
    // console.log(token);

    $.fn.getRepoInfo(token, username, target);

    // var cnt = 0;
    // while (token == "" && cnt < 1) {

    //     function _wait(x) {
    //         cnt += 1;
    //         setTimeout(re_check, x)
    //     }

    //     function re_check(x) {

    //         if (document.readyState != "complete" || token.length == 0) {
    //             setTimeout(re_check, x)
    //         } else {
    //             //console.log("have token? " + token);
    //             //console.log("have username? " + username);
    //             //console.log("have target? " + target);
    //             $.fn.getRepoInfo(token, username, target);

    //         }
    //     }
    //     _wait(2000);
    // }

}

jQuery.fn.getRepositories = function (username) {

    var target = this;
    var token = $.fn.firstGetLimitedRepoToken(username,target);

}

jQuery.fn.sortRepositories = function (from_selector) {

    function sortFunction(a,b){
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateB > dateA ? 1 : -1;
    };

    function handleData(rows /* , textStatus, jqXHR */ ) {
        var all_branch_rows = [];
        var most_recent_branch_commits = [];
        for (var i = 0; i < rows.length; i++) {
            var r = {};
            var _this_repo = rows[i];
            r.id = i;
            var header = _this_repo.getElementsByTagName('h2')[0];
            var header_link = header.getElementsByTagName('a')[0];
            r.repo_text = header_link.text;

            r.repo_datatype = header.getElementsByTagName('em')[0];
            if ( r.repo_datatype ) {
                r.repo_datatype = r.repo_datatype.innerText;
            }
            r.repo_link = header_link.href;
            r.repo_description = _this_repo.getElementsByTagName('p')[0];
            if ( r.repo_description ) {
                r.repo_description = r.repo_description.innerText;
            }

            branches = _this_repo.getElementsByTagName('tr');
            r.branch_cnt = branches.length - 1;

            var this_repo_branch_rows = [];
            for (var j = 1; j < branches.length; j++) {

                var _this_branch = branches[j].getElementsByTagName('div');

                r.branch=_this_branch[0].innerText;
                r.message=_this_branch[1].innerText;
                r.date_text=_this_branch[2].innerText;
                r.date=new Date(r.date_text);
                var commit_link = _this_branch[3].getElementsByTagName('a')[0];
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

            var _this_repo = most_recent_branch_commits[i];
            var next_branch_rows = all_branch_rows.slice(_this_repo.id, _this_repo.id + _this_repo.branch_cnt);

            // Make Row
            var _row = '<div class="post-list-item">';

            // Row Header
            _row += '<h2><a href="'+_this_repo.repo_link+'">'+_this_repo.repo_text+'</a> (<em>'+_this_repo.repo_datatype+'</em>)</h2>';
            // Row Description
            _row += '<ul><p>'+_this_repo.repo_description+'</p></ul>';

            // Make Table/Body
            _row += '<table class="commit-table" id="repo_info" style="width:100%"><tbody>';

            // Table Header Row
            _row += '<tr><th class="col-branch">BRANCH</th><th class="col-message">MESSAGE</th><th class="col-date">DATE</th><th class="col-sha">COMMIT</th></tr>';

            for (var j = 0; j < next_branch_rows.length; j++) {

                var _this_branch = next_branch_rows[j];

                // Start Branch Row
                var branch_row = "";
                branch_row += '<tr>';

                // Branch Row Columns
                branch_row += '<th><div class="commit-branch">'+_this_branch.branch+'</div></th>';
                branch_row += '<th><div class="commit-message">'+_this_branch.message+'</div></th>';
                branch_row += '<th><div class="commit-date">'+_this_branch.date_text+'</div></th>';
                branch_row += '<th><div class="commit-sha"><a href="'+_this_branch.commit_link+'">'+_this_branch.commit_text+'</a></div></th>';

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

    var hidden_content = document.getElementById("all-hidden-repos");
    var rows = hidden_content.getElementsByClassName('post-list-item');

    var target = this;
    var sorted_output = $('<div id="all-visible-repos" class="repos">');
    target.empty().append(sorted_output);

    handleData(rows);

};

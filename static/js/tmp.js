
//$(document).ready(function() {
//
//    run_func();
//
//});

function run_func() {

    var target = this;
    var sorted_output = $('<div id="all-repos" class="repos">');
    target.empty().append(sorted_output);

    function getData() {
        return $.ajax({
            url : 'http://10.0.1.52:28901/pages/4tmp.html',
            type: 'GET'
        });
    }

    function sortFunction(a,b){
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateB > dateA ? 1 : -1;
    };

    function handleData(data /* , textStatus, jqXHR */ ) {
        //alert(data);

        var x = $.parseHTML(data);
        var rows=x[1].getElementsByClassName('post-list-item');

        var all_branch_rows = [];
        var most_recent_branch_commits = [];
        for (var i = 0; i < rows.length; i++) {
            var r = {};
            var _this = rows[i];
            r.id=i;
            var header = _this.getElementsByTagName('h2')[0];
            var header_link = header.getElementsByTagName('a')[0];
            r.repo_text = header_link.text;
            r.repo_datatype = header.getElementsByTagName('em')[0].text;
            r.repo_link = header_link.href;
            r.repo_description = _this.getElementsByTagName('p')[0];

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
            var this_r_copy =JSON.parse(JSON.stringify(this_repo_branch_rows));
            most_recent_branch_commits.push(this_r_copy[0])
            all_branch_rows.push(this_r_copy);
        }
        most_recent_branch_commits.sort(sortFunction);
        for (var i = 0; i < most_recent_branch_commits.length; i++) {

            var _this = most_recent_branch_commits[i];
            var this_start = _this.id;
            var next_branch_rows = all_branch_rows.slice(this_start, this_start + _this.branch_cnt);

            // Make Row
            sorted_output.append('<div class="post-list-item">');

            // Row Header
            sorted_output.append('<h2><a href="'+_this.repo_link+'">'+_this.repo_text+'</a><em> '+_this.repo_datatype+'</em></h2>');
            // Row Description
            sorted_output.append('<p>'+_this.repo_description+'</p>');

            // Make Table/Body
            sorted_output.append('<table class="commit-table" id="repo_info" style="width:100%"><tbody>');

            // Table Header Row
            sorted_output.append('<tr><th class="col-branch">Branch</th><th class="col-message">Message</th><th class="col-date">Date</th><th class="col-sha">Commit</th></tr>');

            for (var j = 0; j < next_branch_rows.length; j++) {

                var _this = next_branch_rows[j];

                // Start Branch Row
                sorted_output.append('<tr>');

                // Branch Row Columns
                sorted_output.append('<th><div class="commit-branch">'+_this.branch+'</div></th>');
                sorted_output.append('<th><div class="commit-message">'+_this.message+'</div></th>');
                sorted_output.append('<th><div class="commit-date">'+_this.date_text+'</div></th>');
                sorted_output.append('<th><div class="commit-sha"><a href="'+_this.commit_link+'">'+_this.commit_text+'</a></div></th>');

                // End Branch Row
                sorted_output.append('</tr>');

            }

            // Close Table/Body && Row
            sorted_output.append('</tbody></table>');
            sorted_output.append('</div>');

        }

        // Close div {id="all-repos"}
        sorted_output.append('</div>');
        a=0;






    }

    getData().done(handleData);


}

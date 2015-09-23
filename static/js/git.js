jQuery.githubRepo = function (username, repository, callback) {
    jQuery.getJSON('https://api.github.com/repos/' + username + '/' + repository + '?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?', callback)
}

jQuery.githubUser = function (username, callback) {
    //jQuery.getJSON('https://api.github.com/users/' + username + '/repos?sort=updated&type=owner&callback=?', callback)
    jQuery.getJSON('https://api.github.com/users/'+username+'/repos?access_token=c4370b1ef682786444882c2de012d2e512f74e3c&callback=?',callback)
}

jQuery.fn.loadRepositories = function (username) {
    this.html("<span>Querying GitHub for " + username + "'s repositories...</span>");

    var target = this;
    $.githubUser(username, function (data) {
        var repos = data.data; // JSON Parsing
        //sortByName(repos);

        var list = $('<dl/>');

        target.empty().append(list);

        $(repos).each(function () {       
            if (this.name != (username.toLowerCase() + '.github.com')) {

                var tmp = '<dt><a href="' + (this.homepage ? this.homepage : this.html_url) + '">' + this.name + '</a> <em>' + (this.language ? ('(' + this.language + ')') : '') + '</em></dt>'

                //var new_list = $('<dl/>');
                //target.empty().append(new_list);
                $.githubRepo(username, this.name, function (more_data) {
                    var repoinfo = more_data.data;
                    if ( repoinfo.private==false && repoinfo.fork==false ) {
                        list.append(tmp);
                        
                    	list.append('<dt>' + repoinfo.name + ' -- ' + repoinfo.size  + ' -- ' + repoinfo.private  + ' -- ' + repoinfo.fork + '</dt>');
                    list.append('<dd></dd>');
                                        
                        }
				list.append('<dd>' + this.description + '</dd>');
                });
                //$.extend(list,new_list);

                
            }
        });
      });
};
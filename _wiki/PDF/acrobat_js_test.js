function display_error(x){
    app.alert({
    cMsg: "Error! Try again! " + x,
    cTitle: "Acme Testing Service"
    });
}

function get_page_words(){
    try {
     
        var pgNum = this.pageNum; 
        var wordNum = this.getPageNumWords(pgNum);
        var wordList="";
        for (var i = 0; i < wordNum; i++)
            wordList += (this.getPageNthWord({
                nPage: pgNum,
                nWord: i,
                bStrip: false
            }) + " ");
        return wordList;
     
    } catch (e) { display_error(e); }
}

function get_bounds(obj_type, page_num){
    try {
        // options: "Art", "Bleed", "Crop", "Media", "Trim"
        return this.getPageBox(obj_type, page_num);
     
    } catch (e) { display_error(e); }
}

function get_metadata(){

    var meta_data = "METADATA:";
    meta_data += " python python2 python 2.7 python 2.7.9 python3 python 3.4";
    meta_data += " pip virtualenv virtual environment argparse argh argcomplete subprocess cython C++ gevent";
    meta_data += " jellyfish Levenshtein Distance Damerau-Levenshtein Distance Jaro Distance Jaro-Winkler Distance longest common subsequence lcs";
    meta_data += " re regular expression ipython pandas numpy jupyter ipdb pdb shapely fiona geopandas matplotlib xlwt xlrd";
    meta_data += " sqlalchemy psycopg2";
    meta_data += " sql mysql PostgreSQL PostgreSQL 9.3 PostgreSQL 9.4 PostgreSQL 9.5 triggers functions";
    meta_data += " postgres pgsql psql sqllite sqllite3 PostGIS gis geospatial information system pllua plluau plpython plpythonu";
    meta_data += " plpgsql embedded framework postfix supervisor supervisord Nginx openresty Lua luarocks";
    meta_data += " behave PyHamcrest Gherkin-based BDD gherkin Behavior-driven development Behavior driven development";
    meta_data += " agile agile methods agile development debug debugging interactive debugging";
    meta_data += " unit test unit-testing testing framework";
    meta_data += " Selenium chromedriver firefox safari chromium phantomjs ghostdriver headless browser mechanize";
    meta_data += " urllib urllib3 beautiful soup beautifulsoup bs4 poster requests";
    meta_data += " Django wsgi gunicorn uwsgi rest rest framework tastypie sencha phonegap html javascript jquery pastebin";
    meta_data += " google gmail oauth oauth2 dd-wrt aws amazon ec2 boto geeklets cron crons cronjob launchctl";
    meta_data += " Celery ElasticSearch kibana log aggregation Redis RabbitMQ amqp websockets web sockets";
    meta_data += " Syslog-ng rsyslog logging logger logrotate log rotate";
    meta_data += " profiling memory profiler line-profiler line profiler linux emacs unix ubuntu kali";
    meta_data += " cpulimit cpu limiter dyndns iptables expect autoexpect diff cdiff sdiff kdiff3 beyond compare";
    meta_data += " geoip libmproxy mitmproxy mitm proxy man in the middle proxy squid3 tinyproxy openssl openssh openvpn vpn";
    meta_data += " ssh rsa ssl ssl authentication sshfs iterm2 x11 xterm putty chrome remote desktop teamviwer team viewer";
    meta_data += " window surface pro 3 macbook pro mbp mac mac os x OSX OS X BSD applescript appscript adobe acrobat cs3 cs4 cs6 growl pycharm pgadmin3 qgis";
    meta_data += " wingide sublime text 3 zerobrane haroopad onenote mou";
    meta_data += " git github githook githooks jekyll wordpress markdown gfm markdown gfm";
    meta_data += " craigslist seamless yelp permutations combinations";
    meta_data += " android custom roms liquid smooth jellybean kitkat motorola razr xt926";
    meta_data += " samsung galaxy note 4 tasker locale sshdroid";
    meta_data += " scikit learn machine learning neural networks";

    return meta_data

}
function get_page_num(){
    return this.pageNum;
}
function set_page_num(pg_num){
    this.pageNum=pg_num;
}
function goto_page_num(pg_num){
    this.pageNum=pg_num;
}

function new_page(pg_num, nWidth, nHeight){
    this.newPage(pg_num, nWidth, nHeight);
}

function make_annotation(pg_num, _name, _type, _rect, _content){
    var new_note = this.addAnnot({
            name: _name,
            page: pg_num,
            type: _type,
            rect: _rect,
            author: this.author,
            strokeColor: color.transparent,
            fillColor: color.transparent,
            // textColor: color.black,
            // textSize: 0.1,
            // contents: _content,
            opacity: 1,
            print: true
    });
    var spans = new Array(); 
    spans[0] = new Object(); 
    spans[0].text = _content;
    spans[0].textColor = color.black;
    spans[0].textSize = 5;

    // Now give the rich field a rich value 
    new_note.richContents = spans;

    return new_note;

}



// CLOSE EXISTING WINDOWS

// OPEN RESUME_NEW.pdf
// var n = app.openDoc({
//      cPath: '/Users/admin/Desktop/resume_new.pdf',
//      bUseConv: true
// });

// SAVE AS resume.pdf
// this.saveAs('/Users/admin/Desktop/resume.pdf');







// text
// button
// combobox
// listbox
// checkbox
// radiobutton
// signature

var inch = 72;

// Position a rectangle (.5 inch, .5 inch) 
// Returns { bottom-left x,y; top-right x,y}
var aRect = this.get_bounds( "Crop",0 );
var nWidth = aRect[2] - aRect[0];
var nHeight = aRect[1] - aRect[3];
// {nHeight}; // 792
// {nWidth}; // 612

// metadata width
aRect[0] += .5*inch;
aRect[2] -= .5*inch;
// metadata height
aRect[1] = aRect[3] + 0.3*inch;
aRect[3] = aRect[3] + 1.5*inch;

// // aRect = {36,57.599999999999994,576,36};


var new_pg_num = 1;
goto_page_num(new_pg_num - 1);
this.deletePages({nStart: new_pg_num});
//NEED TO REMOVE BACKGROUND
new_page(new_pg_num, nWidth, nHeight);
goto_page_num(new_pg_num);
var meta_data = get_metadata();

// var _name = "meta_data";
// var pg_num = new_pg_num;
// var _type = "FreeText";
// var _rect = aRect;
// var _content = meta_data;

var new_note = make_annotation(new_pg_num, "meta_data", "FreeText", aRect, meta_data);

// Go back to first page
goto_page_num(new_pg_num - 1);
// Create background from last page
// Delete last page
// Save

// this.flattenPages({
//     nStart:new_pg_num, // start of inclusive range
//     n_end:new_pg_num,
//     nNonPrint: // Non-printing annotations are: flattened [0], left as is [1], removed [2]
// });


// var f = this.addField("test_box", "text", 0, aRect )
// f.textColor = color.blue; 
// f.fillColor = color.ltGray;
// f.textSize = 28;


// // this.removeField("test_box");
// var f = this.addField("test_box", "text", 0, aRect )
// f.multiline = false;
// f.strokeColor = color.transparent;
// f.richText = true;
// // f.textColor = // color.transparent NOT ALLOWED
// f.fillColor = color.transparent;
// f.opacity = 0.0;
// f.value = meta_data;
// f.textSize = 0.01;
// f.display = display.visible;

// var spans = new Array();
// spans[0] = new Object();
// spans[0].text = meta_data;
// spans[0].textColor = color.blue; 
// spans[0].textSize = 0.01;

// f.richValue = spans;

// this.flattenPages()



// var f = this.getField("myText"); var aRect = f.rect;
// f.multiline = true;
// var height = aRect[1]-aRect[3]; aRect[3] -= 2* height;
// f.rect = aRect;
// Get bounding rectangle
// Make it multiline
// Calculate height
// Triple the height of the text field // and make it so

// LIST ALL PROPERTIES OF FIELD ( I.E., DUPLICATE )
// f = this.getField("myField"); for ( var i in f ) {
// }
// try {
// if ( typeof f[i] != "function" ) // Do not list field methods
// console.println( i + ":" + f[i] )
// } catch(e) {} // An exception occurs when we get a property that
// // does not apply to this field type.


// var page_bounds = get_page_bounds();
// page_bounds;
// get_bounds("Crop", 0);

// var d = this.dataObjects;
// d.length;

// 494 words without background
// 910 words with background

// var wordList = get_page_words();
// wordList;


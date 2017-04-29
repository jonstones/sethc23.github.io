# Socat Notes

### Socat

##### Forwarding Internal Logs

(A) below reads a file (source) into a unix socket (target); 

- `u` means only read target and only write source; 
- `lmuser` means log messages as 'user' facility in mixed way b/t sterr and syslog;
- `nonblock` really only applies to opening file but still important;
- `ignoreeof` (EOF=end of file) means the connection will stay open without continuous updates;
- `shut-null` means the source will cue the target of an EOF condition;
- `seek-end` true means the file read start at the current location as opposed to the beginning;
- `crnl` standardizes line terminations;
- `null-eof` means the target is sensitive to a source's EOF condition.

    (A) 
    
        sudo socat -d -d -lmuser -u \
        FILE:/var/log/syslog/syslog-ng.log,nonblock=1,ignoreeof,seek-end=1,shut-null \
        UNIX:/var/sockets/syslog-ng.sock,crnl,ignoreeof,null-eof

    Note:  (A) will fail if the socket (/var/sockets/syslog-ng.sock) does not exist, which is only true when an active process is listening on that channel.

    the syslog-ng daemon should be active and listening.
    or:

        sudo socat -d -d unix-listen:/var/sockets/syslog-ng.sock,reuseaddr -

    Test with:  

        syslog -s -l error -k Message "test msg"

## Debug Utils:

	nc serverip 1234
	
	/t2
	echo 'check error-to-tcp' | socat - UNIX-CLIENT:/var/sockets/ngx_error.sock
	echo 'check access-to-tcp' | socat - UNIX-CLIENT:/var/sockets/ngx_access.sock
	echo 'check logger-to-tcp' | socat - UNIX-CLIENT:/var/sockets/ngx_logger.sock
	
	echo 'just log message will be passed'
	
	syslog -s -l error -k Message "msg to syslog"

#### Working Socket Tests:

From mbp2 to ubuntu

	[mbp2]		socat -v -u - TCP:192.168.3.55:12204
	[ubuntu]	socat -v tcp-l:12205,fork exec:'/bin/cat'

	[mbp2]		socat -v -u UNIX:/var/run/mbp2_relay.sock -
	
Not Sure:

    socat -d -d -d -d -v -U -,ignoreeof,shut-null unix:/var/sockets/web_socket_relay.sock,ignoreeof,forever,null-eof
    
Not Working:
	
    socat -v -u - UNIX:/var/run/asl_input
	
	socat -v -u UNIX:/dev/klog
	socat -v -u UNIX:/dev/klog
	socat -v -u UNIX-CONNECT:/var/run/syslog -
	
	socat -v -u SOCKET-DATAGRAM:/var/sockets/ngx_access_out.sock -

    
	socat -v -u UNIX-CONNECT:/var/run/syslog -
	socat -v -u UNIX-CLIENT:/var/run/syslog -
	socat -v UNIX-CONNECT:/dev/klog -
	socat -v UNIX-CONNECT:/var/run/syslog -
	socat -v PIPE:/dev/klog -
	sudo socat -v -u PIPE:/dev/klog -
	sudo socat -v -u PIPE:/dev/klog,fork exec:'/bin/cat'
	socat -v -u SOCKET-DATAGRAM:/var/run/syslog -
	socat -v -u SOCKET-LISTEN:/var/run/syslog -
	
	socat -v tcp-l:12205,fork UNIX:/var/sockets/ngx_logger.sock
	
	sudo socat -t100 -x -v UNIX-LISTEN:/var/run/syslog,mode=777,reuseaddr,fork UNIX-CONNECT:/var/run/syslog.original
    
    socat -u TCP-LISTEN:localhost:2866/ClipToOneNote,reuseaddr,fork OPEN:/tmp/onenote.clipper,creat,append
    
    socat -u udp-recv:1234 -
    socat -d -d TCP4-RECVFROM:2866,so-broadcast,so-timestamp,ip-pktinfo,ip-recverr,ip-recvopts,ip-recvtos,ip-recvttl!!- SYSTEM:'export; sleep 1' |grep SOCAT
    
    socat -d -d - tcp:localhost2866/ClipToOneNote,crnl

#### Changes to Make


	sudo socat TCP-LISTEN:80 -
	socat TCP-LISTEN:12204 -
	
	echo 'check logger-to-tcp' | sudo socat - TCP-LISTEN:80
	
	nc log.aporodelivery.com 1234
	
	socat -v tcp-l:12204,fork exec:'/bin/cat'
	socat -v tcp-l:192.168.3.55:12405,fork exec:'/bin/cat'
	
	echo 'check tcp-to-ngx' | socat - UNIX-CLIENT:"/69.22.228.27:12204"
	socat - UNIX-CLIENT:"/69.22.228.27:12204"
	socat - UNIX-CLIENT:192.168.3.52:12204

    sudo socat -t100 -v -u UNIX-RECVFROM:/var/run/syslog,mode=666,reuseaddr,fork UNIX-SENDTO:/var/run/syslog.original,fork -
	
	http://linux.die.net/man/1/nc

#FAILED CONFIGURATION #1:

## Logging Config @ MBP2

### NGINX:

##### nginx.conf
    
    error_log                       syslog:server=unix:/var/sockets/ngx_error_out.sock info;

### SYSLOG-NG:

##### osx logs:

    source:                         /var/log/syslog/syslog-ng.log
    destination:                    /var/sockets/osx_syslog_sock

##### nginx logs:

    source:                         /var/sockets/ngx_error_out.sock
    source:                         /var/sockets/ngx_access_out.sock
    source:                         /var/sockets/ngx_logger_out.sock
    destination:                    /var/sockets/osx_ngx_sock

### SOCAT:

##### Forward osx_syslog_sock to Ubuntu:

    socat -d -d -lmlocal2 UNIX-LISTEN:/var/sockets/osx_syslog_sock,fork,forever TCP4:192.168.3.55:12205,ignoreeof &
    
##### Forward osx_ngx_sock to Ubuntu:

    socat -d -d -lmlocal2 UNIX-LISTEN:/var/sockets/osx_ngx_sock,fork,forever TCP4:192.168.3.55:12205,ignoreeof &

## Logging Config @ UBUNTU

### NGINX:

##### nginx.conf
    
    error_log                       syslog:server=unix:/var/sockets/ngx_error.sock info;

##### run_json_decoder.conf

    access_log                      syslog:server=unix:/var/sockets/ngx_access.sock info;
    logger_out                      syslog:server=unix:/var/sockets/ngx_logger.sock info;

### SYSLOG-NG:

##### nginx logs:

    source:                         /var/sockets/ngx_error.sock
    source:                         /var/sockets/ngx_access.sock
    source:                         /var/sockets/ngx_logger.sock
    destination:                    /var/log/syslog.log

### Misc.

	ssh mb_remote -p 9091 -L 9081:localhost:5900 -N &
	ssh S5_remote -p 9095 -L 9085:localhost:5900 -N &
	ssh mbp2_remote -p 9092 -L 9082:localhost:5900 -N &
	
	mkdir -p /Volumes/mb; sshfs mb:/ /Volumes/mb -ovolname=mb
	
	socat - UNIX-LISTEN:/var/sockets/ngx_logger_out.sock

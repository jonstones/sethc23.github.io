#### Connect two netcats to each other:
    ```bash
    mkfifo backpipe
    nc localhost 55545 0backpipe
    ```
#### Telnet with readline and a history:
    ```bash
    socat -d -d READLINE,history=$HOME/.http_history \
        TCP4:www.domain.org:www,crnl
    ```
#### Talk to your modem in raw mode:
    ```bash
    socat - /dev/ttyS0,raw,echo=0,crnl
    ```
#### Simulate tail -f:
    ```bash
    socat -u /var/log/messages,seek-end=0,ignoreeof -
    ```
#### Give a random interactive program, such as nslookup, a history:
    ```bash
    socat readline,history=.nslookup_hist exec:"nslookup",pty,ctty,setsid,echo=0
    ```
#### Use your modem with a non-persistent history:
    ```bash
    socat readline /dev/ttyS0,raw,echo=0,crlf,nonblock
    ```
#### Use your modem with a persistent history:
    ```bash
    socat READLINE,history:/tmp/serial.cmds \
        OPEN:/dev/ttyS0,ispeed=9600,ospeed=9600,crnl,raw,sane,echo=false
    ```
#### To dos (as in tofrodos):
    ```bash
    socat -u - -,crlf
    ```
#### From dos (as in tofrodos):
    ```bash
    socat -u -,cr -
    ```
#### Run sendmail daemon with your favorite network options:
    ```bash
    # Warning: using this wrong may result in becoming an open relay!
    socat TCP-LISTEN:25,fork,ip-ttl=4,ip-tos=7,tcp-maxseg=576 EXEC:"/usr/sbin/sendmail -bs",nofork
    ```
#### Send a mail using chat (from ppp package):
    ```bash
    socat -d -d system:'/usr/sbin/chat "220 " "HELO loopback" "250 " "MAIL FROM: &lt;root@localhost&gt;" "250 " "RCPT TO: root" "250 " "DATA" "354 " "test'$(echo -e "\r.")'" "250 " "QUIT"',pty,echo=0,cr tcp:localhost:25,crlf,nodelay
    ```
#### Connect remote X :1 to local X :0:
    ```bash
    socat exec:'ssh root@troas socat unix-l\:/tmp/.X11-unix/X1 -' unix:/tmp/.X11-unix/X0
    # Note the escaping of the colon in the remote command.
    ```
#### Sending a file - Server sending the file:
    ```bash
    server$ socat -u FILE:test.dat TCP-LISTEN:9876,reuseaddr
    client$ socat -u TCP:127.0.0.1:9876 OPEN:out.dat,creat
    ```
#### Sending a file - Server receiving the file:
    ```bash
    server$ socat -u TCP-LISTEN:9876,reuseaddr OPEN:out.txt,creat
    client$ socat -u FILE:test.txt TCP:127.0.0.1:9876
    ```
#### Be a syslog server:
    ```bash
    socat -u UDP4-LISTEN:5140,reuseaddr,fork OPEN:/tmp/syslog.msg,creat,append
    # I can't figure out how to put a newline after each message...
    ```
#### Send syslog messages to screen:
    ```bash
    socat -t0 -T0 -u UDP4-LISTEN:514,reuseaddr,fork -
    ```
#### To get time from time server:
    ```bash
    socat TCP:time.nist.gov:13 -
    ```
#### Really sick - use socat as a VPN solution:
    ```bash
    socat -d -d  \
        TUN:192.168.99.2/24,up \
        SYSTEM:"ssh root@remote-server socat -d -d  - 'TUN:192.168.99.1/24,up'"
    # This must be run as a user that can modify tap/tun devices on both sides of the tunnel.
    ```
#### Use a remote modem
    ```bash
    # On the side with the modem
    socat /dev/ttyS0,raw,echo=0 tcp4-listen:3334
    # On the side where you want the modem transferred
    socat PTY,link=$HOME/vmodem0,raw,echo=0 TCP:servername:3334
    # You can now access remote /dev/ttyS0 through local $HOME/vmodem0
    ```
#### Use a remote modem over SSH
    ```bash
    socat PTY,link=$HOME/vmodem0,waitslave \
        EXEC:"ssh root@remote-server socat - /dev/ttyS0"
    # You can now access remote /dev/ttyS0 through local $HOME/vmodem0.
    # Remove waitslave to keep alive after local client disconnect.
    ```
#### Using OpenSSL over UDP
    ```bash
    # This uses a chaining method I believe to be only available in socat2.
    # On the listening side:
    socat2 - "OPENSSL-SERVER,cert=client.pem,cafile=server.crt|UDP4-LISTEN:4430,fork"
    # On the connecting side:
    socat2 exec:ls "OPENSSL-CLIENT,cert=server.pem,cafile=client.crt|UDP4:localhost:4430"
    # OpenSSL Tunnel
    # First, generate certificates and distribute them to either side:

    FILENAME=server
    openssl genrsa -out $FILENAME.key 1024
    openssl req -new -key $FILENAME.key -x509 -days 3653 -out $FILENAME.crt
    cat $FILENAME.key $FILENAME.crt >$FILENAME.pem
    chmod 600 $FILENAME.key $FILENAME.pem

    FILENAME=client
    openssl genrsa -out $FILENAME.key 1024
    openssl req -new -key $FILENAME.key -x509 -days 3653 -out $FILENAME.crt
    cat $FILENAME.key $FILENAME.crt >$FILENAME.pem
    chmod 600 $FILENAME.key $FILENAME.pem

    # On the listening side:
    socat openssl-listen:4433,reuseaddr,cert=server.pem,cafile=client.crt tcp-connect:localhost
    # On the connecting side:
    socat - openssl-connect:server.domain.org:4433,cert=client.pem,cafile=server.crt
    ```
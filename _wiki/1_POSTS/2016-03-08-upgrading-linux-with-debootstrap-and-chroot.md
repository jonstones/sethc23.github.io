# Upgrading Linux 
(Ubuntu via Kali in this case)

## Best Case:
```bash
do-release-upgrade
do-release-upgrade -d  // dev version
```

## Other Cases:

1. Format and Partition Hard Disk using your favorite tool, i.e., `gparted`

    - make first partition with:

        a) `fat32` format

        b) `boot` and `esp` flags

    - use `ext4` for linux partition
    - include an extra partition for persistence later

2. Bootstrap the OS
	  ```bash
    ap_install binutils debootstrap
    mount /dev/hda1 /mnt

    /usr/sbin/debootstrap --arch $ARCH $RELEASE $MNT $URL_SRC
    ```
	- where:
		- $ARCH, e.g., amd64
		- $RELEASE, e.g., wily
		- $MNT, e.g., /mnt
		- $URL_SRC, e.g., http://archive.ubuntu.com/ubuntu

3. Prepare to chroot
    
  a. `sysctl kernel.hostname=NEW_HOSTNAME`
    
  b. Plan on copying fstab to target disk and using blkid to identify target disk UUID that will replace fstab source disk UUID
    
  c. Consider copying network info before rebooting:

      - /mnt/etc/network/interfaces
      - /mnt/etc/hosts
      - /mnt/etc/resolv.conf

4. Chroot into target disk/OS

  ```bash
  mount -t proc none /mnt2/proc; \
  mount -o bind /dev /mnt2/dev; \
  LANG= chroot /mnt2 /bin/bash

  passwd
  dpkg-reconfigure --default-priority passwd  // create a user and switch shadow password on
  ```

5. Installing Packages

	- Basics:
		- apt-get update
		- openssh-server
		- ubuntu-standard
		- linux-image-$ARCH

	- Perhaps copy "some" from existing system:
		- `dpkg --get-selections | grep "install" | cut -f1`
		- [one list of transferred packages](http://pastebin.com/ej2p0Mt3)
	
    - Maybe set some environment vars
    	```bash
        locale-gen en_US.UTF-8
        echo 'LANG="en_US.UTF-8"' >> /etc/environment
        echo 'LANGUAGE="en_US:en"' >> /etc/environment
        ```

5. Gracefully end chroot
    ```bash
    exit
    cd /

    for i in /mnt/proc /mnt/dev /mnt
    do umount $i; done

    ```




([Primary Source](https://help.ubuntu.com/community/Installation/OverSSH))
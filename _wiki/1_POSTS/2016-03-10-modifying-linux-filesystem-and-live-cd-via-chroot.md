
```bash
ap_install debootstrap gparted squashfs-tools genisoimage
# consider using `schroot`
```

### Download [Latest Release](https://www.kali.org/downloads/)


### Obtain file system and prepare workspace
```bash
mkdir ~/livecdtmp
mv kali-linux-light-2016.1-amd64.iso ~/livecdtmp
cd ~/livecdtmp
```

### Mount the Desktop .iso and Extract Contents
```bash
mkdir mnt
sudo mount -o loop kali-linux-light-2016.1-amd64.iso mnt

mkdir extract-cd
sudo rsync --exclude=/live/filesystem.squashfs -a mnt/ extract-cd
```
Either A):
```bash
sudo unsquashfs mnt/live/filesystem.squashfs
sudo mv squashfs-root edit
sudo cp /etc/resolv.conf edit/etc/
```
Or B):

```bash
mkdir squashfs
mkdir edit
sudo modprobe squashfs
sudo mount -t squashfs -o loop mnt/(live|casper)/filesystem.squashfs squashfs/
sudo cp -a squashfs/* edit
sudo cp /etc/resolv.conf /etc/hosts edit/etc/
```

### Chroot into File System
```bash
sudo mount --bind /dev/ edit/dev
sudo chroot edit

mount -t proc none /proc/
mount -t sysfs none /sys/
mount -t devpts none /dev/pts
export HOME=/root
export LC_ALL=C
dbus-uuidgen > /var/lib/dbus/machine-id
dpkg-divert --local --rename --add /sbin/initctl   //not sure what this does...
ln -s /bin/true /sbin/initctl
```

# Customize Image ..
### SSH and Environment
```bash
apt-get update
passwd
ssh-keygen -t rsa -b 4096
systemctl enable sshd
apt-get install git
cd root/
git clone https://github.com/kelleyk/livessh.git
git clone https://github.com/sethc23/shared_scripts.git --origin github ./.scripts
git clone https://github.com/sethc23/SERVER0.git
./SERVER0/local_config/setup_env
source .bashrc
./livessh/customize.d/10-openssh
./livessh/customize.d/60-fstab-entries
cd /etc/ssh/
ln -s /root/SERVER0/local_config/sshd_config
```
### Remove Packages
```bash
dpkg-query -W --showformat='${Package}\n' | less  # list all packages
apt-get remove --purge libreoffice-* 
apt-get remove --purge `dpkg-query -W --showformat='${Package}\n' | grep language-pack | egrep -v '\-en'`
apt-get remove --purge gnome-games*
```
### Update Sources and Packages

for more `apt-get` sources, 
  see this [sources generator](https://repogen.simplylinux.ch/index.php)

### Prepare to Leave Chroot
```bash
ap_clean
rm -rf /tmp/* ~/.bash_history
rm /var/lib/dbus/machine-id
rm /etc/resolv.conf
rm /sbin/initctl
dpkg-divert --rename --remove /sbin/initctl
#### Clean older/non-used kernels...
dpkg -l 'linux-*' | sed '/^ii/!d;/'"$(uname -r | sed "s/\(.*\)-\([^0-9]\+\)/\1/")"'/d;s/^[^ ]* [^ ]* \([^ ]*\).*/\1/;/[0-9]/!d' | xargs sudo apt-get -y purge
umount /proc || umount -lf /proc
umount /sys || umount -lf /sys
umount /dev/pts  || umount -lf /dev/pts
exit
sudo umount edit/dev || umount -lf edit/dev
```
### Create new filesystem
```bash
sudo rm extract-cd/live/filesystem.squashfs
sudo mksquashfs edit extract-cd/live/filesystem.squashfs
```

### Update the filesystem.size file, which is needed by the installer:
```bash
sudo su
printf $(du -sx --block-size=1 edit | cut -f1) > extract-cd/live/filesystem.size
exit
```
### Set an Image Name
```bash
export IMAGE_NAME="kali-light-2016.1-amd64_SSH.iso"
sudo echo $IMAGE_NAME > extract-cd/README.diskdefines
```

### Remove old md5sum.txt and calculate new md5 sums
```bash
cd extract-cd
sudo rm md5sum.txt
sudo -s 
(find -type f -print0 | xargs -0 md5sum | \
grep -v isolinux/boot.cat | tee md5sum.txt)
```
### Create the ISO image
```bash
sudo mkisofs -D -r -V "$IMAGE_NAME" -cache-inodes -J -l -b isolinux/isolinux.bin -c isolinux/boot.cat -no-emul-boot -boot-load-size 4 -boot-info-table -o ../kali-linux-light-2016.1-amd64.iso .
```

## Create USB Drive
```bash
sudo mount -t vfat /dev/sdb1 /mnt -o uid=1000,gid=1000,umask=022

wget http://webativo.com/uploads/files/usb-pack_efi.zip
unzip usb-pack_efi.zip
rsync -auv usb-pack_efi/ /mnt
```
### Expected Directory Structure
![Expected Directory Structure](http://webativo.com/galeria/1328201735/210.jpg)

### Install Grub2 on USB
```bash
sudo grub-install --removable --boot-directory=/mnt/boot --efi-directory=/mnt/EFI/BOOT /dev/sdb
```
### Copy File System
```bash
mkdir -p /mnt/{iso,usb}
mount -o loop kali-light-2016.1-amd64_SSH.iso /mnt/iso
mount /dev/sdb2 /mnt/usb
cp -a /mnt/iso/* /mnt/usb
sync
umount /mnt/iso
```
# Bluetooth


## Tools
hidd --search
hcitool scan
hciconfig scan
bt-device -l
btscanner


hcitool cc <target-bdaddr>;
hcitool auth <target-bdaddr>

bluez set to manually installed.

stored_device_info=$(cat /data/misc/bluedroid/bt_config.conf)
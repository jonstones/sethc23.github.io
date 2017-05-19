---


#### Identify location of script

Generally,

```bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
```

If symlinked,

```bash
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
```

### ZSH and Oh-My-Zsh (OMZ)
- [zsh guide](http://zsh.sourceforge.net/Guide/zshguide06.html)

#### Plugins

- autojump (installed via apt-get/macports)

- OSX

    ![](https://raw.githubusercontent.com/sethc23/sethc23.github.io/master/_wiki/Linux_Unix/osx_zsh.jpg)

- [Z (mod)](https://github.com/rupa/z) @  [Github](https://raw.githubusercontent.com/rupa/z/master/README)




- - -
- [1unix linux ref.pdf](Linux_Unix/1unix_linux_ref.pdf)
- [BashStartupFiles1.png](Linux_Unix/BashStartupFiles1.png)
- [cliclick.png](Linux_Unix/cliclick.png)
- [Emacs Command Summary.pdf](Linux_Unix/Emacs_Command_Summary.pdf)
- [linux commands.pdf](Linux_Unix/linux_commands.pdf)
- [Linux Manual.pdf](Linux_Unix/Linux_Manual.pdf)
- [Log Aggregation and Tools.md](Linux_Unix/Log_Aggregation_and_Tools.md)
- [manual.pdf](Linux_Unix/manual.pdf)
- [regex-cheatsheet.pdf](Linux_Unix/regex-cheatsheet.pdf)
- [UNIX 101  Basic UNIX.pdf](Linux_Unix/UNIX_101__Basic_UNIX.pdf)
- [Unix Crontab.pdf](Linux_Unix/Unix_Crontab.pdf)
- [Useful Code.rtf](Linux_Unix/Useful_Code.rtf)
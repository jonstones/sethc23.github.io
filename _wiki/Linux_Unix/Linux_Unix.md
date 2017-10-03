----


# Command Line & the 'shell'

### General Resources
- a comprehensive guide to command line [(link)](https://github.com/jlevy/the-art-of-command-line)
- a currated list of shells, terminals, and related tools [(link)](https://github.com/k4m4/terminals-are-sexy)
- a decent cheatsheet [(link)](https://github.com/Idnan/bash-guide)

### Useful Modules
- Help and examples from command line: [Howdoi](https://github.com/gleitz/howdoi) [ untested ]
	- requires py27-pbr if installing via Macports (2017.05.24)
	- see [ExplainShell.com](https://explainshell.com/) for a similar (but web-based) info resource
- Simply-formatted dynamic loading and sharing of aliases [(link)](https://github.com/sebglazebrook/aliases) [ untested ]
- Improved shell history management [(link)](https://github.com/dvorka/hstr) [ untested ]
	- install:

		```bash
		sudo add-apt-repository ppa:ultradvorka/ppa
		sudo apt-get update
		sudo apt-get install hh
		hh --show-configuration >> ~/.bashrc
		```
- [tmux](https://wiki.archlinux.org/index.php/tmux): a shell multiplexer
	- re: tmux status bar, see these tmux config samples:
		- [sample #1](https://gist.github.com/spicycode/1229612)
		- [sample #2](https://gist.github.com/v-yarotsky/2157908)
	- see [wemux](https://github.com/zolrath/wemux) for multi-user multiplexing


## See also:
- [Shell Types](Shells/Shells.md) (e.g., bash, zsh, etc...)
- [Shell Scripting](Shells/Scripting.md)


- - -
- [1unix linux ref.pdf](Linux_Unix/1unix_linux_ref.pdf)
- [BashStartupFiles1.png](Linux_Unix/BashStartupFiles1.png)
- [cliclick.png](Linux_Unix/cliclick.png)
- [linux commands.pdf](Linux_Unix/linux_commands.pdf)
- [Linux Manual.pdf](Linux_Unix/Linux_Manual.pdf)
- [Log Aggregation and Tools.md](Linux_Unix/Log_Aggregation_and_Tools.md)
- [manual.pdf](Linux_Unix/manual.pdf)
- [regex-cheatsheet.pdf](Linux_Unix/regex-cheatsheet.pdf)
- [UNIX 101  Basic UNIX.pdf](Linux_Unix/UNIX_101__Basic_UNIX.pdf)
- [Unix Crontab.pdf](Linux_Unix/Unix_Crontab.pdf)
- [Useful Code.rtf](Linux_Unix/Useful_Code.rtf)
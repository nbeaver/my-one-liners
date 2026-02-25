const cmdInfo = [
  {
    "componentCommands": [
        "head"
    ],
    "description": "Create a file of given size (10 megabyte) full of ASCII NULs.",
    "invocation": "head --bytes=10MB /dev/zero > ./bigfile",
    "links": [
      "https://www.gnu.org/software/coreutils/manual/html_node/head-invocation.html",
      "https://ostechnix.com/create-files-certain-size-linux/",
      "https://www.baeldung.com/linux/create-file-of-given-size#using-the-head-and-tail-commands"
    ],
    "shell" : "bash",
    "uuid": "00e7daf1-0ec4-49b7-b704-ab4ddbcda771"
  },
  {
    "componentCommands": [
        "texdoc"
    ],
    "description": "List all matching documentation files for 'siunitx'",
    "invocation": "texdoc --list --showall siunitx",
    "exampleOutput": " 1 /usr/share/texlive/texmf-dist/doc/latex/siunitx/siunitx.pdf\n   = Package documentation\n 2 /usr/share/texlive/texmf-dist/doc/latex/siunitx/README.md\n   = Readme\nEnter number of file to view, RET to view 1, anything else to skip:\n",
    "links": [
      "https://commandmasters.com/commands/texdoc-common/",
      "https://tex.stackexchange.com/questions/646669/how-to-get-texdoc-to-return-a-particular-document",
    ],
    "shell" : "bash",
    "uuid": "6f1c574e-9500-4656-88e0-77755721a1d7"
  },
  {
    "componentCommands": [
        "xclip"
    ],
    "description": "Save copied image to file.",
    "invocation": "xclip -selection clipboard -target image/png -out > out.png",
    "links": [
      "http://unix.stackexchange.com/questions/145131/copy-image-from-clipboard-to-file",
      "http://ubuntuforums.org/showthread.php?t=1335075"
    ],
    "shell" : "bash",
    "uuid": "5a413ea5-d4f0-46d9-b7c8-b7170a74b847"
  },
  {
    "componentCommands": [
        "do",
        "done",
        "for",
        "mkdir",
        "pdfimages"
    ],
    "description": "For each file ending with '.pdf' in the current directory, extract the images from the pdf file into a new directory with the name of the file stripped of '.pdf'.",
    "invocation": "for f in *.pdf; do dir=\"${f%.*}\"; mkdir -p \"$dir\" && pdfimages -png -j \"$f\" \"$dir/$dir\"; done",
    "shell" : "bash",
    "uuid": "6c0081a3-5c10-4cdf-826b-1bd778ae8ef0"
  },
  {
    "componentCommands": [
        "getconf"
    ],
    "description": "Display the word size of the kernel, e.g. 32-bit or 64-bit.",
    "invocation": "getconf LONG_BIT",
    "exampleOutput": "64\n",
    "links": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/10137880/need-help-32-bit-64-bit-check-for-linux",
       "http://superuser.com/questions/412024/is-my-system-64-bit",
       "http://lists.us.dell.com/pipermail/linux-poweredge/2011-February/044344.html"
    ],
    "shell" : "bash",
    "uuid": "fe1bd5ee-ae26-4abd-85a6-09be801f9f2b"
  },
  {
    "componentCommands": [
        "gzip"
    ],
    "description": "Compress a file using gzip without removing the original file.",
    "invocation": "gzip < file > file.gz",
    "links": [
      "https://lists.gnu.org/archive/html/info-gnu/2013-06/msg00003.html",
      "https://unix.stackexchange.com/questions/46786/how-to-tell-gzip-to-keep-original-file",
      "https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=240539"
    ],
    "shell" : "bash",
    "uuid": "b70da7de-745f-4774-93eb-6eb034ccbd57"
  },
  {
    "componentCommands": [
        "nproc"
    ],
    "description": "Returns the number of processors / CPU cores available on this machine.",
    "invocation": "nproc",
    "exampleOutput": "4\n",
    "links": [
       "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line",
       "http://stackoverflow.com/questions/13875081/difference-between-nproc-and-ulimit"
    ],
    "shell" : "bash",
    "uuid": "d67df423-d4c2-4a24-b83c-c494f94bdb75"
  },
  {
    "componentCommands": [
        "awk",
        "grep",
        "lscpu"
    ],
    "description": "Display name of hardware's CPU architecture, e.g. x86_64 for 64-bit Intel processors and i686 for 32-bit Intel processors.",
    "invocation": "lscpu | grep '^Architecture:' | awk '{print $2}'",
    "exampleOutput": "x86_64\n",
    "links": [
      "https://stackoverflow.com/questions/7066625/how-to-find-the-linux-processor-chip-architecture/22100700",
      "http://www.cyberciti.biz/faq/lscpu-command-find-out-cpu-architecture-information/"
    ],
    "shell" : "bash",
    "uuid": "101630e8-efc4-4566-bbc8-78e6ac76120f"
  },
  {
    "componentCommands": [
        "readlink",
        "xargs",
        "basename"
    ],
    "description": "Get driver names for all network interfaces.",
    "invocation": "readlink /sys/class/net/*/device/driver | xargs -L 1 basename",
    "exampleOutput": "e1000e\niwlwifi\n",
    "shell" : "bash",
    "uuid": "80a480e5-8898-462c-910b-2bede6507e19"
  },
  {
    "componentCommands": [
        "find"
    ],
    "description": "Find files in your home directory that you don't own.",
    "invocation": "find $HOME ! -user $USER",
    "shell" : "bash",
    "uuid": "2b0656bc-9ea5-466b-8734-dcc1570be067"
  },
  {
    "componentCommands": [
        "espeak",
        "ping",
        "sed"
    ],
    "description": "Generates audible voice that says 'ping' every time it gets an ICMP ECHO_RESPONSE, sent in intervals of 2 seconds.",
    "invocation": "ping -i 2 localhost | sed --unbuffered 's/.*/ping/' | espeak",
    "links": [
      "http://ftp.arl.mil/mike/ping.html"
    ],
    "shell" : "bash",
    "uuid": "07248c2f-4809-4b19-9ff0-6fa8e554b8f6"
  },
  {
    "componentCommands": [
      "jobs",
      "kill"
    ],
    "description": "Kill stopped jobs. Bash-specific because of `jobs -p' to list process IDs.",
    "invocation": "kill $(jobs -ps)",
    "links": [
      "http://serverfault.com/questions/240155/how-can-i-kill-all-stopped-jobs",
      "http://superuser.com/a/228926/219809",
      "http://ubuntuforums.org/showthread.php?t=1954090&s=c408c62db23afe753dfcfd40f1a86e32&p=11825162#post11825162"
    ],
    "shell": "bash",
    "uuid": "dbadb0c9-5590-46af-b846-095c44a66e2c"
  },
  {
    "componentCommands": [
      "mkdir",
      "unzip"
    ],
    "description": "Make a new empty directory and unzip a ZIP archive into that directory.",
    "invocation": "mkdir output; unzip my-zip-file.zip -d output",
    "shell": "bash",
    "uuid": "ea0ee52c-0dc4-44df-8a4d-2db6bf83634e"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find executables under current directory. Does not follow symbolic links.",
    "invocation": "find . -type f -executable -print",
    "links": [
      "http://stackoverflow.com/questions/4458120/unix-find-search-for-executable-files",
      "http://serverfault.com/questions/381034/find-executables",
      "http://unix.stackexchange.com/questions/166674/how-do-i-search-for-every-file-with-executable-permission-x-in-my-system",
      "http://lists.gnu.org/archive/html/bug-findutils/2005-12/msg00058.html"
    ],
    "shell": "bash",
    "uuid": "c2172098-7e38-43ff-9ab7-30c964f80861"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find non-executable files recursively.",
    "invocation": "find . -type f \\! -executable -print",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "echo",
      "parallel",
      "sleep"
    ],
    "description": "Run three different `sleep` commands in parallel.",
    "invocation": "parallel -j 3 -- \"sleep 2; echo '1st'\" \"sleep 1; echo '2nd'\" \"echo '3rd'\"",
    "shell": "bash",
    "uuid": "a54b30ce-e62a-41b8-800c-c5f21c999bd6"
  },
  {
    "componentCommands": [
      "curl"
    ],
    "description": "Show external IP address using http://ifconfig.me website.",
    "invocation": "curl --proto https ifconfig.me",
    "links": [
      "http://askubuntu.com/questions/95910/command-for-determining-my-public-ip",
      "http://unix.stackexchange.com/questions/22615/how-can-i-get-my-external-ip-address-in-bash"
    ],
    "shell": "bash",
    "uuid": "9cb1510d-eca5-404f-94fc-e5113bdbbc54"
  },
  {
    "componentCommands": [
      "cp"
    ],
    "description": "Make a copy of a symbolic link (symlink).",
    "invocation": "cp --no-dereference mylink mylink-copy",
    "links": [
      "https://superuser.com/questions/138587/how-to-copy-symbolic-links",
      "https://unix.stackexchange.com/questions/56084/how-do-i-copy-a-symbolic-link",
      "https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html#index-_002d_002dno_002ddereference"
    ],
    "shell": "bash",
    "uuid": "8be325fc-1d76-46f1-8e13-514882230cbd"
  },
  {
    "componentCommands": [
      "du",
      "sort"
    ],
    "description": "See directories taking up the most space in user's home directory. Human-readable size (e.g. 8M for 8 megabytes).",
    "invocation": "du --human --max-depth=1 $HOME | sort --reverse --human-numeric-sort",
    "shell": "bash",
    "uuid": "64c52fa6-cdde-4e8b-9671-1b74978cdc2c"
  },
  {
    "componentCommands": [
      "safecopy"
    ],
    "description": "Copy a disc (such as a CD or DVD) to a disk image (ISO), re-reading or skipping bad sectors instead of failing when an input/output error is encountered. This makes an iso from the /dev/dvd device file.",
    "invocation": "safecopy /dev/dvd disc.iso",
    "links": [
      "https://askubuntu.com/questions/138152/software-to-copy-a-scratched-cd-dvd-blueray-to-an-iso-file"
    ],
    "shell": "bash",
    "uuid": "7761f0b2-8e5f-4b63-8360-7af0a8c16576"
  },
  {
    "componentCommands": [
      "uname"
    ],
    "description": "Determine which architecture the Linux kernel is configured for; may not be the same as the actual CPU architecture. For example, an Intel i686 kernel can run on an Intel x86_64 processor, but its RAM will be limited unless the kernel has PAE is enabled. Short flag is `-m'.",
    "exampleOutput": "x86_64\n",
    "invocation": "uname --machine",
    "links": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/2565282/difference-between-machine-hardware-and-hardware-platform",
      "https://www.ibm.com/developerworks/community/blogs/58e72888-6340-46ac-b488-d31aa4058e9c/entry/know_about_your_linux_system_using_uname_command77?lang=en"
    ],
    "shell": "bash",
    "uuid": "f69252a3-a58b-48bc-9fd2-89e9e5d29f94"
  },
  {
    "componentCommands": [
      "ps"
    ],
    "description": "Show information about parent process.",
    "exampleOutput": "UID          PID    PPID  C STIME TTY          TIME CMD\nusernam+  157147    3627  0 11:23 ?        00:00:00 /usr/bin/xterm\n",
    "invocation": "ps -p $PPID",
    "shell": "bash",
    "uuid": "fdcc1f87-af46-4834-9ce2-b1ac27a3f070"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Recursively find text files ending in '.txt' that contain the DOS carriage return (octal 015, hexadecimal x0D). Uses ANSI-C single quotes instead of a literal carriage return character.",
    "invocation": "grep --binary --recursive --files-with-matches $'\\r' --include='*.txt'",
    "links": [
      "https://unix.stackexchange.com/questions/79702/how-to-test-whether-the-file-is-crlf-or-lf-without-modyfing-it",
      "http://unix.stackexchange.com/a/79713",
      "http://vsingleton.blogspot.com/2009/03/grep-using-octal-patterns-and-avoid.html"
    ],
    "shell": "bash",
    "uuid": "fd1ea283-a1ec-4997-9806-464a5a715624"
  },
  {
    "componentCommands": [
      "pwd",
      "tr",
      "xsel"
    ],
    "description": "Copy working directory to clipboard.",
    "invocation": "pwd | tr -d '\\n' | xsel -b",
    "links": [
      "http://www.commandlinefu.com/commands/view/9766/copy-currentworking-directory-to-clipboard"
    ],
    "shell": "bash",
    "uuid": "6f5fdd18-b781-4b22-8b7f-7ad3066b912a"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all directory paths matching '*doc*' in `/usr/share`, except the paths under `/usr/share/doc`. This can help find documentation that is in an unusual place.",
    "invocation": "find '/usr/share' -path '/usr/share/doc' -prune -o -type d -name '*doc*'",
    "links": [
      "https://stackoverflow.com/questions/1489277/how-to-use-prune-option-of-find-in-sh",
      "https://stackoverflow.com/questions/4210042/exclude-directory-from-find-command",
      "http://www.theunixschool.com/2012/07/find-command-15-examples-to-exclude.html",
      "http://www.liamdelahunty.com/tips/linux_find_exclude_multiple_directories.php"
    ],
    "shell": "bash",
    "uuid": "0e72bbcc-c43e-446c-bb83-ac0f00a4076b"
  },
  {
    "componentCommands": [
      "aoss",
      "siggen"
    ],
    "description": "Interactive audio signal / tone / sound generator with various waveforms, including sine, triangle, square, and sawtooth (stereo mode).",
    "invocation": "aoss siggen -2",
    "links": [
      "https://inconsolation.wordpress.com/2015/01/18/siggen-much-to-see-much-to-hear/",
      "https://stackoverflow.com/questions/5109038/linux-sine-wave-audio-generator",
      "https://unix.stackexchange.com/questions/245897/audio-tone-sine-generator-with-frequency-gauge"
    ],
    "shell": "bash",
    "uuid": "3f6a786a-9a20-43c6-acb9-1b782757e78f"
  },
  {
    "componentCommands": [
      "cd",
      "mktemp",
      "mogrify",
      "rmdir",
      "unzip",
      "zip"
    ],
    "description": "Resize all the images in an OpenDocument (ODT) file to 10% of their former size. Stores location of tempfile in $dir shell variable, which is not entirely safe.",
    "invocation": "dir=\"$(mktemp -d --tmpdir=.)\" && unzip -q file.odt -d \"$dir\" && cd \"$dir\" && mogrify -resize 10x10% Pictures/* && zip -qrm ../resized.odt * && cd .. && rmdir \"$dir\"",
    "shell": "bash",
    "uuid": "361f2d3b-beeb-4a29-bcf6-070edaec63a9"
  },
  {
    "componentCommands": [
      "mv"
    ],
    "description": "Move all files in the current directory to the parent directory, including hidden files (dotfiles). Preserves inodes. Excludes the current directory and parent directory and includes filenames starting with two dots.",
    "invocation": "mv -- * .[!.] .??* ../",
    "links": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren",
      "https://askubuntu.com/questions/259383/how-can-i-get-mv-or-the-wildcard-to-move-hidden-files/259386"
    ],
    "shell": "bash",
    "uuid": "510c302e-fb2b-4a2a-898f-b98ba0326453"
  },
  {
    "componentCommands": [
      "find",
      "mv"
    ],
    "description": "Move all files and folders in the current directory to the parent directory, including hidden files and folders (dotfiles). Preserves inodes.",
    "invocation": "find . -mindepth 1 -maxdepth 1 -exec mv -t ../ -- '{}' \\+",
    "links": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren"
    ],
    "shell": "bash",
    "uuid": "19e51b80-ceb4-4a9a-a5f8-fd8e8bf8101d"
  },
  {
    "componentCommands": [
      "date"
    ],
    "description": "Show the date and time in a different timezone without changing the system time zone. Example is for Buenos Aires, Argentina.",
    "exampleOutput": "Thu Jan  1 00:00:00 ART 1970\n",
    "invocation": "TZ=America/Argentina/Buenos_Aires date",
    "links": [
      "https://unix.stackexchange.com/questions/48101/how-can-i-have-date-output-the-time-from-a-different-timezone",
      "http://www.cyberciti.biz/tips/date-command-set-tz-environment-variable.html",
      "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
    ],
    "shell": "bash",
    "uuid": "e47766a1-e332-4cd3-9e42-573d0bcd09de"
  },
  {
    "componentCommands": [
      "grep",
      "less"
    ],
    "description": "Highlight non-ASCII characters (e.g. Unicode) in a text file and give the line number they are on.",
    "invocation": "grep --line-number --perl-regexp '[^[:ascii:]]' --color=always /usr/share/dict/words | less --RAW-CONTROL-CHARS",
    "links": [
      "http://lists.gnu.org/archive/html/bug-gnu-utils/2006-03/msg00000.html",
      "https://groups.google.com/forum/#!topic/comp.unix.programmer/Auge3Bz4iCA",
      "https://stackoverflow.com/questions/3001177/how-do-i-grep-for-all-non-ascii-characters-in-unix",
      "http://superuser.com/questions/417305/how-can-i-identify-non-ascii-characters-from-the-shell"
    ],
    "shell": "bash",
    "uuid": "7b93628a-938d-4227-a88c-9d697f55fac4"
  },
  {
    "componentCommands": [
      "find",
      "wc"
    ],
    "description": "Count number of files in this directory and all subdirectories on current filesystem. Works even if filenames contain newlines.",
    "invocation": "find . -xdev -type f -printf '.' | wc -c",
    "links": [
      "http://stackoverflow.com/questions/27942749/return-number-of-files-in-a-directory-to-a-variable-in-a-shell-scrtpt",
      "http://askubuntu.com/questions/711293/how-to-count-the-total-number-of-files-folders-on-a-system",
      "http://superuser.com/questions/689293/is-there-anything-faster-than-find-wc-l-to-count-files-in-a-directory",
      "http://stackoverflow.com/questions/9157138/recursively-counting-files-in-a-linux-directory",
      "http://www.commandlinefu.com/commands/view/4/count-files-beneath-current-directory-including-subfolders"
    ],
    "shell": "bash",
    "uuid": "40cbcc05-dedf-417c-ad0b-ce5f252ed141"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find broken symbolic links (symlinks) in current directory and below. ",
    "invocation": "find . -xtype l",
    "links": [
      "https://unix.stackexchange.com/questions/34248/how-can-i-find-broken-symlinks",
      "https://serverfault.com/questions/295929/how-do-i-find-and-report-on-broken-symbolic-links-automatically",
      "http://www.commandlinefu.com/commands/view/10742/find-broken-symlinks"
    ],
    "shell": "bash",
    "uuid": "d1963f6a-dd27-48f5-8663-8ebe6ff5dae8"
  },
  {
    "componentCommands": [
      "getconf"
    ],
    "description": "Returns the number of processors / CPU cores available on this machine.",
    "exampleOutput": "4\n",
    "invocation": "getconf _NPROCESSORS_ONLN",
    "links": [
      "http://stackoverflow.com/questions/4586405/get-number-of-cpus-in-linux-using-c",
      "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line"
    ],
    "shell": "bash",
    "uuid": "df4be8b4-833e-4e48-af1a-e03916833409"
  },
  {
    "componentCommands": [
      "chsh",
      "which"
    ],
    "description": "Change the default shell of the current user to zsh.",
    "invocation": "chsh --shell $(which zsh) $USER",
    "links": [
      "https://wiki.archlinux.org/index.php/Zsh#Making_Zsh_your_default_shell"
    ],
    "shell": "bash",
    "uuid": "7a49c243-47f7-4a5a-a42a-87357d134b0d"
  },
  {
    "componentCommands": [
      "ls"
    ],
    "description": "List hidden files and folders (dotfiles). Uses bash globbing.",
    "invocation": "ls --directory -- .[^.]*",
    "links": [
      "http://www.gnu.org/software/coreutils/faq/coreutils-faq.html#ls-_002da-_002a-does-not-list-dot-files",
      "http://stackoverflow.com/a/699071/1608986",
      "http://stackoverflow.com/a/2550243/1608986"
    ],
    "shell": "bash",
    "uuid": "924d5f3a-512b-4c0e-8219-6a47002d9014"
  },
  {
    "componentCommands": [
      "xset"
    ],
    "description": "Turn off the monitor; make the display go dark; blank the screen until the mouse is moved or a key is pressed.",
    "invocation": "xset dpms force standby",
    "links": [
      "http://magnatecha.com/turn-off-display-from-linux-command-line/",
      "http://superuser.com/a/66923/219809",
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://tldp.org/HOWTO/Battery-Powered/methods.html#XF86",
      "https://wiki.archlinux.org/index.php/Display_Power_Management_Signaling#Modifying_DPMS_and_screensaver_settings_using_xset"
    ],
    "shell": "bash",
    "uuid": "5b791952-7792-4ca5-bb38-cf622f3cdc8a"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Make home directory private from all other users.",
    "invocation": "chmod g-rwx,o-rwx $HOME",
    "links": [
      "https://askubuntu.com/questions/46501/why-can-other-users-see-the-files-in-my-home-folder",
      "https://superuser.com/questions/303910/ubuntu-default-access-mode-permissions-for-users-home-dir-home-user",
      "https://unix.stackexchange.com/questions/95897/permissions-755-on-home-user"
    ],
    "shell": "bash",
    "uuid": "2d031b99-6945-45bd-be31-71382d661d73"
  },
  {
    "componentCommands": [
      "apt-file"
    ],
    "description": "Find all packages in apt repositories that match the pattern '/fftw3.h$', even if the package is not installed. Should return result 'libfftw3-dev'.",
    "exampleOutput": "libfftw3-dev: /usr/include/fftw3.h\nlibmkl-dev: /usr/include/mkl/fftw/fftw3.h\n",
    "invocation": "apt-file -x search '/fftw3.h$'",
    "shell": "bash",
    "uuid": "efd177f4-51e5-40cc-8c16-2720cb06d94e"
  },
  {
    "componentCommands": [
      "stat"
    ],
    "description": "Show the time when `updatedb' was run to update the database for the `locate' command.",
    "exampleOutput": "2026-02-16 07:53:13.870631441 -0500\n",
    "invocation": "stat --format %y /var/lib/plocate/plocate.db",
    "shell": "bash",
    "uuid": "308423e6-95a4-4001-9e76-501ad79b2e93"
  },
  {
    "componentCommands": [
      "sudo", "iwlist"
    ],
    "description": "List wireless access points",
    "invocation": "sudo iwlist scanning",
    "links": [
      "https://hewlettpackard.github.io/wireless-tools/Tools"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files with 'cool' somewhere in the filename",
    "invocation": "find . -name  '*cool*'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files with 'cool'/'COOL'/'CoOl' somewhere in the filename (case insensitive).",
    "invocation": "find . -iname  '*cool*'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files ending in .html in current directory and subdirectories",
    "invocation": "find . -name '*.html'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find vim swap files (e.g. .swp, .swo, .example.txt.swp):",
    "invocation": "find . -type f -name '*.sw?'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find files with spaces in the filename.",
    "invocation": "find . -name '* *'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files with world-readable, writable, and executable permissions.",
    "invocation": "find . -perm -a+rwx",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find directories that are world-writable.",
    "invocation": "find . -type d -perm -a+w",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find directories that aren't permissions 0775 (drwxr-xr-x).",
    "invocation": "find . -type d \\! -perm 0775",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find files or directories that are not writable in the current directory.",
    "invocation": "find . \\! -writable",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find files or directories that are not writable in the current directory. Not compliant with POSIX-standard `find` command.",
    "invocation": "find . -not -writable",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find", "chmod"
    ],
    "description": "Find files or directories that are not writable and make them writable again.",
    "invocation": "find . \\! -writable -exec chmod --changes +w '{}' \\+",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files with world-readable (777) permissions, but skip symbolic links.",
    "invocation": "find . -not -type l -perm 777",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find", "sort"
    ],
    "description": "Find directories and sort by permissions type.",
    "invocation": "find . -type d -printf '%m %p\\n' | sort",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "ls"
    ],
    "description": "Print permissions of the /var/log directory.",
    "exampleOutput": "drwxr-xr-x 23 root root 4096 May 23 08:18 /var/log\n",
    "invocation": "ls -ld /var/log",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "stat"
    ],
    "description": "Print permissions of the /var/log directory.",
    "exampleOutput": "  File: ‘/var/log’\n  Size: 4096      \tBlocks: 8          IO Block: 4096   directory\nDevice: 801h/2049d\tInode: 30416373    Links: 23\nAccess: (0755/drwxr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2016-05-23 09:59:45.411033488 -0500\nModify: 2016-05-23 08:18:12.333311420 -0500\nChange: 2016-05-23 08:18:12.333311420 -0500\n Birth: -",
    "invocation": "stat /var/log",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "stat"
    ],
    "description": "Print permisisons in octal.",
    "invocation": "stat --format='%a %n' -- *",
    "links": [
      "https://askubuntu.com/questions/152001/how-can-i-get-octal-file-permissions-from-command-line"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "stat"
    ],
    "description": "Print permissions in octal, but also include the human-readable permissions.",
    "invocation": "stat --format='%a %A %n' -- *",
    "links": [
      "https://askubuntu.com/questions/152001/how-can-i-get-octal-file-permissions-from-command-line"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Show human-readable and octal permissions of files recursively.",
    "invocation": "find . -type f -printf \"%m %M %f\\n\"",
    "links": [
      "https://unix.stackexchange.com/questions/126040/convert-the-permissions-in-ls-l-output-to-octal"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find"
    ],
    "description": "Find all files over a certain size (500MB in this case.)",
    "invocation": "find . -size +500M",
    "links": [
      "https://superuser.com/questions/204564/how-can-i-find-files-that-are-bigger-smaller-than-x-bytes",
      "https://unix.stackexchange.com/questions/638335/find-command-size-behavior"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find", "sort", "head"
    ],
    "description": "Find smallest text files.",
    "invocation": "find . -name '*.txt' -printf '%s %f\\n' | sort -n | head",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "rename"
    ],
    "description": "Replace spaces with underscores for all filenames in current directory.",
    "invocation": "rename 'y/ /_/' -- *",
    "links": [
      "https://www.commandlinefu.com/commands/view/2518/replace-spaces-in-filenames-with-underscores"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "rename"
    ],
    "description": "Replace colons with dashes for filenames in current directory.",
    "invocation": "rename 's/:/-/g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find", "rename"
    ],
    "description": "Replace colons with dashes recursively.",
    "invocation": "find . -name \"*:*\" -exec rename 's/:/-/g' {} \\+",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find", "rename"
    ],
    "description": "Remove colons from filenames recursively.",
    "invocation": "find . -name '*:*' -exec rename -n 's/://g' '{}' \\+",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "rename"
    ],
    "description": "Remove non-ASCII characters from filenames.",
    "invocation": "rename 's/[^\\x00-\\x7F]//g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "rename"
    ],
    "description": "Replace non-ASCII characters in filenames with underscores ('_').",
    "invocation": "rename 's/[^\\x00-\\x7F]/_/g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "rename"
    ],
    "description": "Rename all .jpeg files to .jpg.",
    "invocation": "rename 's/.jpeg/.jpg/' -- *.jpeg",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "mv"
    ],
    "description": "Quick file rename using bash brace expansion.",
    "invocation": "mv file.{txt,csv}",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "cp"
    ],
    "description": "Make a backup copy of a file with '.old' appended using bash brace expansion.",
    "invocation": "cp myfile.txt{,.old}",
    "links": [
      "http://www.shell-fu.org/lister.php?id=46"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Grepping the system dictionary for words starting with 's' and containing 'm' and 'b'; this is how samba was named:",
    "invocation": "grep -i '^s.*m.*b' /usr/share/dict/words",
    "links": [
      "http://www.rxn.com/services/faq/smb/samba.history.txt"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Grep all three-letter words without vowels, e.g. 'brr', 'nth', Mrs'.",
    "invocation": "grep -E -i \"^[^aeiouy']{3}$\" /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Grep all words without vowels.",
    "invocation": "grep -iv '[aeiouy]' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Grep words that can be spelled with hexadecimal alone, like 0xDEADBEEF.",
    "invocation": "grep -E -i \"^[a-fA-F]+$\" /usr/share/dict/words",
    "links": [
      "https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values",
      "http://www.urbandictionary.com/define.php?term=0xDEADBEEF",
      "https://stackoverflow.com/questions/5907614/0xdeadbeef-vs-null"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Grep for words that end in \"gry\"",
    "exampleOutput": "angry\ndemagogry\nhungry\n",
    "invocation": "grep -i '.*gry$' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "getconf"
    ],
    "description": "Print maximum path length.",
    "exampleOutput": "4096\n",
    "invocation": "getconf PATH_MAX /",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "echo"
    ],
    "description": "Print operating system type (OS identifier). Available in bash but not POSIX standard.",
    "exampleOutput": "linux-gnu\n",
    "invocation": "echo \"$OSTYPE\"",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "uname"
    ],
    "description": "Print operating system kernel name (OS identifier).",
    "exampleOutput": "Linux\n",
    "invocation": "uname --kernel-name",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "uname"
    ],
    "description": "Print operating system name (OS identifier). GNU-only extension.",
    "exampleOutput": "GNU/Linux\n",
    "invocation": "uname -o",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "compgen"
    ],
    "description": "List all signals.",
    "invocation": "compgen -A signal",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "git"
    ],
    "description": "Do a soft reset (undo) of last commit.",
    "invocation": "git reset --soft HEAD~1",
    "shell": "bash",
    "links" : [
      "https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git",
      "https://git-scm.com/docs/git-reset#_examples",
      "https://stackoverflow.com/questions/5203535/practical-uses-of-git-reset-soft",
      "https://stackoverflow.com/questions/24568936/what-is-difference-between-git-reset-hard-head1-and-git-reset-soft-head"
    ]
  }
]

var highlightedElement = null;
function copyText(event) {
  navigator.clipboard.writeText(this.innerText);
  if (highlightedElement !== null) {
    highlightedElement.style.background = "";
  }
  this.style.background = "yellow";
  highlightedElement = this;
  //console.log(this.innerText);
}

function matchCommand(match, candidate) {
  if (match == '') {
    // If the input is blank, we want to match anything.
    return true;
  }
  if (candidate.includes(match)) {
    //console.log(`"${candidate}" includes "${match}"`);
    return true;
  } else {
    //console.log(`"${candidate}" does not include "${match}"`);
    return false;
  }
}

function matchDescription(match, candidate, caseSensitive) {
  if (match == '') {
    // If the input is blank, we want to match anything.
    return true;
  }
  if (caseSensitive === true) {
    if (candidate.includes(match)) {
      //console.log(`"${candidate}" includes "${match}"`);
      return true;
    } else {
      //console.log(`"${candidate}" does not include "${match}"`);
      return false;
    }
  } else {
    // Don't match case.
    if (candidate.toLowerCase().includes(match.toLowerCase())) {
      //console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return true;
    } else {
      //console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return false;
    }
  }
}

function matchExampleOutput(match, candidate, caseSensitive) {
  if (match == '') {
    // If the input is blank, we want to match anything.
    return true;
  } else if (candidate === undefined) {
    // If the field isn't available, we don't want to match.
    return false;
  }
  if (caseSensitive === true) {
    if (candidate.includes(match)) {
      //console.log(`"${candidate}" includes "${match}"`);
      return true;
    } else {
      //console.log(`"${candidate}" does not include "${match}"`);
      return false;
    }
  } else {
    // Don't match case.
    if (candidate.toLowerCase().includes(match.toLowerCase())) {
      //console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return true;
    } else {
      //console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return false;
    }
  }
}

function matchComponentCommands(match, candidate) {
  if (match.size === 0) {
    // If the input is blank, we want to match anything.
    return true;
  } else if (match.isSubsetOf(candidate)) {
    return true;
  } else {
    return false;
  }
}

function matchLinks(match, candidate) {
    // If the input is blank, we want to match anything.
  if (match === '') {
    return true
  } else if (candidate === undefined) {
    // If the field isn't available, we don't want to match.
    return false;
  }
  for (const link of candidate) {
    if (link.includes(match)) {
      return true;
    }
  }
  // None of the links match.
  return false;
}

function noWhiteSpace(arrayIn) {
  var array = [];
  for (let val of arrayIn) {
    if (val.trim() !== '') {
      array.push(val)
    }
  }
  return array;
}

const elem = {};
function updateSearch() {
  var strings = {
    'invocation' : elem.command.value,
    'description' : elem.description.value,
    'componentCommands' : elem.componentCommands.value,
    'exampleOutput' : elem.exampleOutput.value,
    'links' : elem.links.value,
  }
  var componentCommandsList = noWhiteSpace(strings.componentCommands.split(' '));
  const search = {
    'invocation' : strings.invocation,
    'description' : strings.description.trim(),
    'componentCommands' : new Set(componentCommandsList),
    'exampleOutput' : strings.exampleOutput,
    'links' : strings.links,
  }
  const caseSensitive = {
    'description': elem.descriptionCaseSensitive.checked,
    'exampleOutput': elem.exampleOutputCaseSensitive.checked,
  }

  var showField = {
    'invocation' : true,
    'description' : elem.toggleDescription.checked,
    'exampleOutput' : elem.toggleExampleOutput.checked,
    'links' : elem.toggleLinks.checked,
  }
  var innerHTML = "";
  const allBlank = Object.keys(strings).every(function(x){ return strings[x] === '' });
  if (allBlank) {
    // Input is blank, don't need to do anything.
    elem.output.innerHTML = innerHTML;
    return true;
  }
  var tree = document.createDocumentFragment();
  // Actually match the search text.
  for (let info of cmdInfo) {
    var match = {
      'invocation' : matchCommand(search.invocation, info.invocation),
      'description' : matchDescription(search.description, info.description, caseSensitive.description),
      'componentCommands': matchComponentCommands(search.componentCommands, new Set(info.componentCommands)),
      'exampleOutput': matchExampleOutput(search.exampleOutput, info.exampleOutput, caseSensitive.exampleOutput),
      'links': matchLinks(search.links, info.links),
    }
    var allMatch = Object.keys(match).every(function(x){ return match[x] === true });
  // https://stackoverflow.com/questions/17117712/how-to-know-if-all-javascript-object-values-are-true
    if (allMatch) {
      // https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
      var div = document.createElement("div");
      div.classList.add("singleCmd");
      if (showField['invocation'] === true) {
        var codeDiv = document.createElement("div");
        codeDiv.classList.add("copyOnClick");
        codeDiv.addEventListener("click", copyText);
        var code = document.createElement("code");
        var codeText = document.createTextNode(info.invocation);
        code.appendChild(codeText);
        codeDiv.appendChild(code);
        div.appendChild(codeDiv);
      }
      if (showField['exampleOutput'] === true && info.exampleOutput !== undefined) {
        var pre = document.createElement("pre");
        var samp = document.createElement("samp");
        var sampText = document.createTextNode(info.exampleOutput);
        samp.appendChild(sampText);
        pre.appendChild(samp);
        div.appendChild(pre);
      }
      if (showField['description'] === true) {
        var descriptionDiv = document.createElement("div");
        var description = document.createTextNode(info.description);
        descriptionDiv.appendChild(description);
        div.appendChild(descriptionDiv);
      }
      if (showField['links'] === true && info.links !== undefined) {
        var links = document.createElement("div");
        for (let link of info.links) {
          var thisLink = document.createElement("div");
          var thisAnchor = document.createElement("a");
          thisAnchor.setAttribute("href", link)
          var linkText = document.createTextNode(link);
          thisAnchor.appendChild(linkText);
          thisLink.appendChild(thisAnchor);
          links.appendChild(thisLink);
        }
        div.appendChild(links)
      }
      tree.appendChild(div);
    }
  }
  elem.output.replaceChildren(tree);
  return true;
}
function handleKeyUp(event) {
  // Update search results.
  updateSearch();
}
function handleChange(event) {
  // Update search results.
  updateSearch();
}

function validate(cmdInfo) {
  // Validate data.
  const mandatoryKeys = [
    "componentCommands",
    "description",
    "invocation",
    "shell",
  ];
  const optionalKeys = [
    "exampleOutput",
    "links",
    "uuid",
  ];
  const allKeys = mandatoryKeys.concat(optionalKeys);
  const keyType = {
    "componentCommands": "object",
    "description": "string",
    "invocation": "string",
    "shell": "string",
    "exampleOutput": "string",
    "links": "object",
    "uuid": "string",
  }
  const arrayType = {
    "componentCommands": "string",
    "links": "string",
  }
  var invocations = new Set([]);
  var uuids = new Set([]);
  for (let i = 0; i < cmdInfo.length; i++) {
    var info = cmdInfo[i]
    for (let key of allKeys) {
      var val = info[key];
      console.assert(val !== '',   "#%i: %s = %o", i, key, val)
      console.assert(val !== null, "#%i: %s = %o", i, key, val)
      if (val !== undefined) {
        console.assert(typeof val === keyType[key], "#%i: typeof %s = %s != %s", i, key, typeof val, keyType[key])
        if (key in arrayType) {
          // Check each value in the array.
          console.assert(Array.isArray(val), "#%i: %s : Array.isArray(%o) === false", i, key, val)
          console.assert(val.length !== 0, "#%i: %s : %s.length === 0", i, key, key)
          for (let arrayVal of val) {
            console.assert(arrayVal !== '',   "#%i: %o in %s", i, arrayVal, key)
            console.assert(arrayVal !== null, "#%i: %o in %s", i, arrayVal, key)
            console.assert(typeof arrayVal === arrayType[key], "#%i: typeof %o = %s != %s in %s", i, arrayVal, typeof arrayVal, arrayType[key], key)
          }
        }
      }
    }
    for (let key of mandatoryKeys) {
      var val = info[key];
      console.assert(val !== undefined, "#%i: %s = %o", i, key, val)
    }
    for (let key in info) {
      if (mandatoryKeys.includes(key) || optionalKeys.includes(key)) {
        continue;
      } else {
        // Important for e.g. catching misspellings of fields.
        console.error(`#${i}: unknown key '${key}'`);
      }
    }
    if (invocations.has(info.invocation)) {
      console.warn(`Duplicate invocation: ${info.invocation}`);
    } else {
      invocations.add(info.invocation);
    }
    if (uuids.has(info.uuid)) {
      console.warn(`Duplicate UUID: ${info.uuid}`);
    } else if (info.uuid !== undefined) {
      uuids.add(info.uuid);
    }
  }
}

function initialize() {
  // Look for necessary HTML elements.
  for (let el of document.getElementsByClassName("search")) {
    elem[el.id] = el
  }
  // Register event handlers.
  elem.command.onkeyup = handleKeyUp;
  elem.description.onkeyup = handleKeyUp;
  elem.componentCommands.onkeyup = handleKeyUp;
  elem.exampleOutput.onkeyup = handleKeyUp;
  elem.links.onkeyup = handleKeyUp;
  elem.exampleOutputCaseSensitive.onchange = handleChange;
  elem.toggleExampleOutput.onchange = handleChange;
  elem.toggleLinks.onchange = handleChange;
  elem.descriptionCaseSensitive.onchange = handleChange;
  elem.toggleDescription.onchange = handleChange;
  validate(cmdInfo);
  // Update output.
  updateSearch();
}
window.onload = initialize;

const cmdInfo = [
  {
    "component-commands": [
        "head"
    ],
    "description": "Create a file of given size (10 megabyte) full of ASCII NULs.",
    "invocation": "head --bytes=10MB /dev/zero > ./bigfile",
    "relevant-urls": [
      "https://www.gnu.org/software/coreutils/manual/html_node/head-invocation.html",
      "https://ostechnix.com/create-files-certain-size-linux/",
      "https://www.baeldung.com/linux/create-file-of-given-size#using-the-head-and-tail-commands"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "texdoc"
    ],
    "description": "List all matching documentation files for 'siunitx'",
    "invocation": "texdoc --list --showall siunitx",
    "example-output": " 1 /usr/share/texlive/texmf-dist/doc/latex/siunitx/siunitx.pdf\n   = Package documentation\n 2 /usr/share/texlive/texmf-dist/doc/latex/siunitx/README.md\n   = Readme\nEnter number of file to view, RET to view 1, anything else to skip:\n",
    "relevant-urls": [
      "https://commandmasters.com/commands/texdoc-common/",
      "https://tex.stackexchange.com/questions/646669/how-to-get-texdoc-to-return-a-particular-document",
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "xclip"
    ],
    "description": "Save copied image to file.",
    "invocation": "xclip -selection clipboard -target image/png -out > out.png",
    "relevant-urls": [
      "http://unix.stackexchange.com/questions/145131/copy-image-from-clipboard-to-file",
      "http://ubuntuforums.org/showthread.php?t=1335075"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "do",
        "done",
        "for",
        "mkdir",
        "pdfimages"
    ],
    "description": "For each file ending with '.pdf' in the current directory, extract the images from the pdf file into a new directory with the name of the file stripped of '.pdf'.",
    "invocation": "for f in *.pdf; do dir=\"${f%.*}\"; mkdir -p \"$dir\" && pdfimages -png -j \"$f\" \"$dir/$dir\"; done",
    "shell" : "bash",
  },
  {
    "component-commands": [
        "getconf"
    ],
    "description": "Display the word size of the kernel, e.g. 32-bit or 64-bit.",
    "invocation": "getconf LONG_BIT",
    "example-output": "64\n",
    "relevant-urls": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/10137880/need-help-32-bit-64-bit-check-for-linux",
       "http://superuser.com/questions/412024/is-my-system-64-bit",
       "http://lists.us.dell.com/pipermail/linux-poweredge/2011-February/044344.html"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "gzip"
    ],
    "description": "Compress a file using gzip without removing the original file.",
    "invocation": "gzip < file > file.gz",
    "relevant-urls": [
      "https://lists.gnu.org/archive/html/info-gnu/2013-06/msg00003.html",
      "https://unix.stackexchange.com/questions/46786/how-to-tell-gzip-to-keep-original-file",
      "https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=240539"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "nproc"
    ],
    "description": "Returns the number of processors / CPU cores available on this machine.",
    "invocation": "nproc",
    "example-output": "4\n",
    "relevant-urls": [
       "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line",
       "http://stackoverflow.com/questions/13875081/difference-between-nproc-and-ulimit"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "awk",
        "grep",
        "lscpu"
    ],
    "description": "Display name of hardware's CPU architecture, e.g. x86_64 for 64-bit Intel processors and i686 for 32-bit Intel processors.",
    "invocation": "lscpu | grep '^Architecture:' | awk '{print $2}'",
    "example-output": "x86_64\n",
    "relevant-urls": [
      "https://stackoverflow.com/questions/7066625/how-to-find-the-linux-processor-chip-architecture/22100700",
      "http://www.cyberciti.biz/faq/lscpu-command-find-out-cpu-architecture-information/"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
        "readlink",
        "xargs",
        "basename"
    ],
    "description": "Get driver names for all network interfaces.",
    "invocation": "readlink /sys/class/net/*/device/driver | xargs -L 1 basename",
    "example-output": "e1000e\niwlwifi\n",
    "shell" : "bash"
  },
  {
    "component-commands": [
        "find"
    ],
    "description": "Find files in your home directory that you don't own.",
    "invocation": "find $HOME ! -user $USER",
    "shell" : "bash"
  },
  {
    "component-commands": [
        "espeak",
        "ping",
        "sed"
    ],
    "description": "Generates audible voice that says 'ping' every time it gets an ICMP ECHO_RESPONSE, sent in intervals of 2 seconds.",
    "invocation": "ping -i 2 localhost | sed --unbuffered 's/.*/ping/' | espeak",
    "relevant-urls": [
      "http://ftp.arl.mil/mike/ping.html"
    ],
    "shell" : "bash"
  },
  {
    "component-commands": [
      "jobs",
      "kill"
    ],
    "description": "Kill stopped jobs. Bash-specific because of `jobs -p' to list process IDs.",
    "invocation": "kill $(jobs -ps)",
    "relevant-urls": [
      "http://serverfault.com/questions/240155/how-can-i-kill-all-stopped-jobs",
      "http://superuser.com/a/228926/219809",
      "http://ubuntuforums.org/showthread.php?t=1954090&s=c408c62db23afe753dfcfd40f1a86e32&p=11825162#post11825162"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "mkdir",
      "unzip"
    ],
    "description": "Make a new empty directory and unzip a ZIP archive into the same directory.",
    "invocation": "mkdir output; unzip my-zip-file.zip -d output",
    "shell": "bash"
  },
  {
    "component-commands": [
      "find"
    ],
    "description": "Find executables under current directory. Does not follow symbolic links.",
    "invocation": "find . -type f -executable -print",
    "relevant-urls": [
      "http://stackoverflow.com/questions/4458120/unix-find-search-for-executable-files",
      "http://serverfault.com/questions/381034/find-executables",
      "http://unix.stackexchange.com/questions/166674/how-do-i-search-for-every-file-with-executable-permission-x-in-my-system",
      "http://lists.gnu.org/archive/html/bug-findutils/2005-12/msg00058.html"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "echo",
      "parallel",
      "sleep"
    ],
    "description": "Run three different `sleep` commands in parallel.",
    "invocation": "parallel -j 3 -- \"sleep 2; echo '1st'\" \"sleep 1; echo '2nd'\" \"echo '3rd'\"",
    "shell": "bash"
  },
  {
    "component-commands": [
      "curl"
    ],
    "description": "Show external IP address using http://ifconfig.me website.",
    "invocation": "curl --proto https ifconfig.me",
    "relevant-urls": [
      "http://askubuntu.com/questions/95910/command-for-determining-my-public-ip",
      "http://unix.stackexchange.com/questions/22615/how-can-i-get-my-external-ip-address-in-bash"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "cp"
    ],
    "description": "Make a copy of a symbolic link (symlink).",
    "invocation": "cp --no-dereference mylink mylink-copy",
    "relevant-urls": [
      "https://superuser.com/questions/138587/how-to-copy-symbolic-links",
      "https://unix.stackexchange.com/questions/56084/how-do-i-copy-a-symbolic-link",
      "https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html#index-_002d_002dno_002ddereference"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "du",
      "sort"
    ],
    "description": "See directories taking up the most space in user's home directory. Human-readable size (e.g. 8M for 8 megabytes).",
    "invocation": "du --human --max-depth=1 $HOME | sort --reverse --human-numeric-sort",
    "shell": "bash"
  },
  {
    "component-commands": [
      "safecopy"
    ],
    "description": "Copy a disc (such as a CD or DVD) to a disk image (ISO), re-reading or skipping bad sectors instead of failing when an input/output error is encountered. This makes an iso from the /dev/dvd device file.",
    "invocation": "safecopy /dev/dvd disc.iso",
    "relevant-urls": [
      "https://askubuntu.com/questions/138152/software-to-copy-a-scratched-cd-dvd-blueray-to-an-iso-file"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "uname"
    ],
    "description": "Determine which architecture the Linux kernel is configured for; may not be the same as the actual CPU architecture. For example, an Intel i686 kernel can run on an Intel x86_64 processor, but its RAM will be limited unless the kernel has PAE is enabled. Short flag is `-m'.",
    "example-output": "x86_64\n",
    "invocation": "uname --machine",
    "relevant-urls": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/2565282/difference-between-machine-hardware-and-hardware-platform",
      "https://www.ibm.com/developerworks/community/blogs/58e72888-6340-46ac-b488-d31aa4058e9c/entry/know_about_your_linux_system_using_uname_command77?lang=en"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "ps"
    ],
    "description": "Show information about parent process.",
    "example-output": "UID          PID    PPID  C STIME TTY          TIME CMD\nusernam+  157147    3627  0 11:23 ?        00:00:00 /usr/bin/xterm\n",
    "invocation": "ps -p $PPID",
    "shell": "bash"
  },
  {
    "component-commands": [
      "grep"
    ],
    "description": "Recursively find text files ending in '.txt' that contain the DOS carriage return (octal 015, hexadecimal x0D). Uses ANSI-C single quotes instead of a literal carriage return character.",
    "invocation": "grep --binary --recursive --files-with-matches $'\\r' --include='*.txt'",
    "relevant-urls": [
      "https://unix.stackexchange.com/questions/79702/how-to-test-whether-the-file-is-crlf-or-lf-without-modyfing-it",
      "http://unix.stackexchange.com/a/79713",
      "http://vsingleton.blogspot.com/2009/03/grep-using-octal-patterns-and-avoid.html"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "pwd",
      "tr",
      "xsel"
    ],
    "description": "Copy working directory to clipboard.",
    "invocation": "pwd | tr -d '\\n' | xsel -b",
    "relevant-urls": [
      "http://www.commandlinefu.com/commands/view/9766/copy-currentworking-directory-to-clipboard"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "find"
    ],
    "description": "Find all directory paths matching '*doc*' in `/usr/share`, except the paths under `/usr/share/doc`. This can help find documentation that is in an unusual place.",
    "invocation": "find '/usr/share' -path '/usr/share/doc' -prune -o -type d -name '*doc*'",
    "relevant-urls": [
      "https://stackoverflow.com/questions/1489277/how-to-use-prune-option-of-find-in-sh",
      "https://stackoverflow.com/questions/4210042/exclude-directory-from-find-command",
      "http://www.theunixschool.com/2012/07/find-command-15-examples-to-exclude.html",
      "http://www.liamdelahunty.com/tips/linux_find_exclude_multiple_directories.php"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "aoss",
      "siggen"
    ],
    "description": "Interactive audio signal / tone / sound generator with various waveforms, including sine, triangle, square, and sawtooth (stereo mode).",
    "invocation": "aoss siggen -2",
    "relevant-urls": [
      "https://inconsolation.wordpress.com/2015/01/18/siggen-much-to-see-much-to-hear/",
      "https://stackoverflow.com/questions/5109038/linux-sine-wave-audio-generator",
      "https://unix.stackexchange.com/questions/245897/audio-tone-sine-generator-with-frequency-gauge"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "cd",
      "mktemp",
      "mogrify",
      "rmdir",
      "unzip",
      "zip"
    ],
    "description": "Resize all the images in an OpenDocument (ODT) file to 10% of their former size. Stores location of tempfile in $dir shell variable, which is not entirely safe.",
    "invocation": "dir=\"$(mktemp -d --tmpdir=.)\" && unzip -q file.odt -d \"$dir\" && cd \"$dir\" && mogrify -resize 10x10% Pictures/* && zip -qrm ../resized.odt * && cd .. && rmdir \"$dir\"",
    "shell": "bash"
  },
  {
    "component-commands": [
      "mv"
    ],
    "description": "Move all files in the current directory to the parent directory, including hidden files (dotfiles). Preserves inodes. Excludes the current directory and parent directory and includes filenames starting with two dots.",
    "invocation": "mv -- * .[!.] .??* ../",
    "relevant-urls": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren",
      "https://askubuntu.com/questions/259383/how-can-i-get-mv-or-the-wildcard-to-move-hidden-files/259386"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "find",
      "mv"
    ],
    "description": "Move all files and folders in the current directory to the parent directory, including hidden files and folders (dotfiles). Preserves inodes.",
    "invocation": "find . -mindepth 1 -maxdepth 1 -exec mv -t ../ -- '{}' \\+",
    "relevant-urls": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "date"
    ],
    "description": "Show the date and time in a different timezone without changing the system time zone. Example is for Buenos Aires, Argentina.",
    "example-output": "Thu Jan  1 00:00:00 ART 1970\n",
    "invocation": "TZ=America/Argentina/Buenos_Aires date",
    "relevant-urls": [
      "https://unix.stackexchange.com/questions/48101/how-can-i-have-date-output-the-time-from-a-different-timezone",
      "http://www.cyberciti.biz/tips/date-command-set-tz-environment-variable.html",
      "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "grep",
      "less"
    ],
    "description": "Highlight non-ASCII characters (e.g. Unicode) in a text file and give the line number they are on.",
    "invocation": "grep --line-number --perl-regexp '[^[:ascii:]]' --color=always /usr/share/dict/words | less --RAW-CONTROL-CHARS",
    "relevant-urls": [
      "http://lists.gnu.org/archive/html/bug-gnu-utils/2006-03/msg00000.html",
      "https://groups.google.com/forum/#!topic/comp.unix.programmer/Auge3Bz4iCA",
      "https://stackoverflow.com/questions/3001177/how-do-i-grep-for-all-non-ascii-characters-in-unix",
      "http://superuser.com/questions/417305/how-can-i-identify-non-ascii-characters-from-the-shell"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "find",
      "wc"
    ],
    "description": "Count number of files in this directory and all subdirectories on current filesystem. Works even if filenames contain newlines.",
    "invocation": "find . -xdev -type f -printf '.' | wc -c",
    "relevant-urls": [
      "http://stackoverflow.com/questions/27942749/return-number-of-files-in-a-directory-to-a-variable-in-a-shell-scrtpt",
      "http://askubuntu.com/questions/711293/how-to-count-the-total-number-of-files-folders-on-a-system",
      "http://superuser.com/questions/689293/is-there-anything-faster-than-find-wc-l-to-count-files-in-a-directory",
      "http://stackoverflow.com/questions/9157138/recursively-counting-files-in-a-linux-directory",
      "http://www.commandlinefu.com/commands/view/4/count-files-beneath-current-directory-including-subfolders"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "find"
    ],
    "description": "Find broken symbolic links (symlinks) in current directory and below. ",
    "invocation": "find . -xtype l",
    "relevant-urls": [
      "https://unix.stackexchange.com/questions/34248/how-can-i-find-broken-symlinks",
      "https://serverfault.com/questions/295929/how-do-i-find-and-report-on-broken-symbolic-links-automatically",
      "http://www.commandlinefu.com/commands/view/10742/find-broken-symlinks"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "getconf"
    ],
    "description": "Returns the number of processors / CPU cores available on this machine.",
    "example-output": "4\n",
    "invocation": "getconf _NPROCESSORS_ONLN",
    "relevant-urls": [
      "http://stackoverflow.com/questions/4586405/get-number-of-cpus-in-linux-using-c",
      "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "chsh",
      "which"
    ],
    "description": "Change the default shell of the current user to zsh.",
    "invocation": "chsh --shell $(which zsh) $USER",
    "relevant-urls": [
      "https://wiki.archlinux.org/index.php/Zsh#Making_Zsh_your_default_shell"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "ls"
    ],
    "description": "List hidden files and folders (dotfiles). Uses bash globbing.",
    "invocation": "ls --directory -- .[^.]*",
    "relevant-urls": [
      "http://www.gnu.org/software/coreutils/faq/coreutils-faq.html#ls-_002da-_002a-does-not-list-dot-files",
      "http://stackoverflow.com/a/699071/1608986",
      "http://stackoverflow.com/a/2550243/1608986"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "xset"
    ],
    "description": "Turn off the monitor; make the display go dark; blank the screen until the mouse is moved or a key is pressed.",
    "invocation": "xset dpms force standby",
    "relevant-urls": [
      "http://magnatecha.com/turn-off-display-from-linux-command-line/",
      "http://superuser.com/a/66923/219809",
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://tldp.org/HOWTO/Battery-Powered/methods.html#XF86",
      "https://wiki.archlinux.org/index.php/Display_Power_Management_Signaling#Modifying_DPMS_and_screensaver_settings_using_xset"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "chmod"
    ],
    "description": "Make home directory private from all other users.",
    "invocation": "chmod g-rwx,o-rwx $HOME",
    "relevant-urls": [
      "https://askubuntu.com/questions/46501/why-can-other-users-see-the-files-in-my-home-folder",
      "https://superuser.com/questions/303910/ubuntu-default-access-mode-permissions-for-users-home-dir-home-user",
      "https://unix.stackexchange.com/questions/95897/permissions-755-on-home-user"
    ],
    "shell": "bash"
  },
  {
    "component-commands": [
      "apt-file"
    ],
    "description": "Find all packages in apt repositories that match the pattern '/fftw3.h$', even if the package is not installed. Should return result 'libfftw3-dev'.",
    "example-output": "libfftw3-dev: /usr/include/fftw3.h\nlibmkl-dev: /usr/include/mkl/fftw/fftw3.h\n",
    "invocation": "apt-file -x search '/fftw3.h$'",
    "shell": "bash"
  },
  {
    "component-commands": [
      "stat"
    ],
    "description": "Show the time when `updatedb' was run to update the database for the `locate' command.",
    "example-output": "2026-02-16 07:53:13.870631441 -0500\n",
    "invocation": "stat --format %y /var/lib/plocate/plocate.db",
    "shell": "bash"
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
const elem = {};
function updateSearch() {
  var searchCommand = elem.searchCommand.value;
  console.log(`searchCommand  = "${searchCommand}"`);
  var searchDescription = elem.searchDescription.value;
  console.log(`searchDescription  = "${searchDescription}"`);
  const descriptionCaseSensitive = elem.descriptionCaseSensitive.checked;

  var innerHTML = "";
  if (searchCommand === '' && searchDescription === '') {
    // Input is blank, don't need to do anything.
    elem.outputElem.innerHTML = innerHTML;
    return true;
  }
  // Actually match the search text.
  for (let info of cmdInfo) {
    if (
      matchCommand(searchCommand, info.invocation) &&
      matchDescription(searchDescription, info.description, descriptionCaseSensitive)
    ) {
        innerHTML += "<div class=\"copyOnClick\"><code>" + info.invocation + "</code></div>";
    }
  }
  elem.outputElem.innerHTML = innerHTML;
  var elems = document.getElementsByClassName("copyOnClick");
  for (var i=0; i<elems.length; i++) {
    elems[i].addEventListener("click", copyText);
  }
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
function initialize() {
  // Look for necessary HTML elements.
  elem.searchCommand = document.getElementById("searchCommand");
  if (elem.searchCommand == null) {
    console.log("Error: Could not get ID: " + "searchCommand");
    return false;
  }
  elem.searchDescription = document.getElementById("searchDescription");
  if (elem.searchDescription == null) {
    console.log("Error: Could not get ID: " + "searchDescription");
    return false;
  }
  elem.descriptionCaseSensitive = document.getElementById("descriptionCaseSensitive");
  if (elem.descriptionCaseSensitive == null) {
    console.log("Error: Could not get ID: " + "descriptionCaseSensitive");
    return false;
  }
  elem.outputElem = document.getElementById("output");
  if (elem.outputElem == null) {
    console.log("Error: Could not get ID: " + "output");
    return false;
  }
  // Register event handlers.
  elem.searchCommand.onkeyup = handleKeyUp;
  elem.searchDescription.onkeyup = handleKeyUp;
  elem.descriptionCaseSensitive.onchange = handleChange;
  // Validate data.
  const mandatory_keys = [
    "component-commands",
    "description",
    "invocation",
    "shell",
  ]
  const optional_keys = [
    "example-output",
    "relevant-urls",
  ]
  var i = 0;
  for (let info of cmdInfo) {
    i++;
    for (let key of mandatory_keys) {
      var val = info[key];
      if (val === '') {
        console.error(`#${i}: ${key} = ''`);
      } else if (val === null) {
        console.error(`#${i}: ${key} = null`);
      } else if (val === []) {
        console.error(`#${i}: ${key} = []`);
      } else if (val === undefined) {
        console.error(`#${i}: ${key} = undefined`);
      }
    }
    for (let key of optional_keys) {
      var val = info[key];
      if (val === '') {
        console.error(`#${i}: ${key} = ''`);
      } else if (val === null) {
        console.error(`#${i}: ${key} = null`);
      } else if (val === []) {
        console.error(`#${i}: ${key} = []`);
      }
    }
    for (let key in info) {
      if (mandatory_keys.includes(key) || optional_keys.includes(key)) {
        continue;
      } else {
        // Important for e.g. catching misspellings of fields.
        console.error(`#${i}: unknown key '${key}'`);
      }
    }
  }
  // Update output.
  updateSearch();
}
window.onload = initialize;

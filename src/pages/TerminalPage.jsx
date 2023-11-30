import React from 'react';
import chalk from 'chalk';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import '../css/terminal.css';
import 'xterm/css/xterm.css';

export default function TerminalPage() {
    React.useEffect(() => {
        const terminalEl = document.querySelector('.terminal');
        const terminal = new Terminal();
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());
        terminal.open(terminalEl);
        fitAddon.fit();

        terminal.prompt = function () {
            terminal.write('\r\n> ');
            terminal.options.cursorBlink = true;
        };

        let ctrlDown = false

        const handleControlDown = (event) => {
            if (event.code === "ControlLeft") {
                ctrlDown = true
            }
        };
        window.addEventListener('keydown', handleControlDown);

        const handleControlUp = (event) => {
            if (event.code === "ControlLeft") {
                ctrlDown = true
            }
        };
        window.addEventListener('keyup', handleControlUp);

        let cmd = ''

        const executeCommand = (command) => {
            terminal.write("\n\r")
            if (command === "ls") {
                terminal.write(`Sadly, this isn't a VPS or VM, but if you would like a high-performance one for cheap, I would check out ${chalk.underline('https://falconhosting.co.uk')} 😉`)
            } else {
                terminal.write("Command not found, please type \"help\" for help.")
            }
            console.log(command)
        }

        terminal.onKey(key => {
            const char = key.domEvent.key;
            if (char === "Enter") {
                executeCommand(cmd)
                cmd = ''
                terminal.prompt()
            } else if (char === "Backspace") {
                if (terminal._core.buffer.x > 2) {
                    cmd = cmd.substring(0, cmd.length - 1);
                    terminal.write("\b \b");
                }
            } else if (char === "Escape") {
                return;
            } else if (char === "c") {
                if (ctrlDown === true) {
                    cmd = ''
                    terminal.prompt()
                } else {
                    cmd += char;
                    terminal.write(char);
                }
            } else {
                cmd += char;
                terminal.write(char);
            }
        });

        // Set the terminal element to fullscreen
        terminalEl.style.width = '100%';
        terminalEl.style.height = '100%';

        // Handle window resize to maintain fullscreen
        const handleWindowResize = () => {
            fitAddon.fit();
        };
        window.addEventListener('resize', handleWindowResize);

        const frames = ["⢀⠀", "⡀⠀", "⠄⠀", "⢂⠀", "⡂⠀", "⠅⠀", "⢃⠀", "⡃⠀", "⠍⠀", "⢋⠀", "⡋⠀", "⠍⠁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⢈⠩", "⡀⢙", "⠄⡙", "⢂⠩", "⡂⢘", "⠅⡘", "⢃⠨", "⡃⢐", "⠍⡐", "⢋⠠", "⡋⢀", "⠍⡁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⠈⠩", "⠀⢙", "⠀⡙", "⠀⠩", "⠀⢘", "⠀⡘", "⠀⠨", "⠀⢐", "⠀⡐", "⠀⠠", "⠀⢀", "⠀⡀"];

        let index = 0;

        const loadingInterval = setInterval(async () => {
            const frame = frames[index];
            terminal.write('\x1b[2K\r')
            terminal.write(`${frame} Loading JMGCoding Terminal...`);
            index = (index + 1) % frames.length;
        }, 80);

        setTimeout(() => {
            clearInterval(loadingInterval);
            terminal.reset();

            function writeAsciiArt(art) {
                const lines = art.split('\n');
                lines.forEach((line) => {
                    terminal.write(line + '\r\n'); // Use \r\n for line breaks
                });
            }

            const asciiArt = `
         _ __  __  _____  _____          _ _                                  
        | |  \\/  |/ ____|/ ____|        | (_)                                 
        | | \\  / | |  __| |     ___   __| |_ _ __   __ _   ___ ___  _ __ ___  
    _   | | |\\/| | | |_ | |    / _ \\ / _\` | | '_ \\ / _\` | / __/ _ \\| '_ \` _ \\ 
   | |__| | |  | | |__| | |___| (_) | (_| | | | | | (_| || (_| (_) | | | | | |
    \\____/|_|  |_|\\_____|\\_____\\___/ \\__,_|_|_| |_|\\__, (_)___\\___/|_| |_| |_|
                                                    __/ |                     
                                                   |___/  
`;

            writeAsciiArt(asciiArt);
            terminal.write("Hello, and welcome to the JMGCoding.com Terminal. Here, you can explore my projects and experiences, and also run useful and fun commands!\n\n")
            terminal.prompt();
        }, 3000)

        return () => {
            terminal.dispose();
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener('keydown', handleControlDown);
            window.removeEventListener('keyup', handleControlUp);
            clearInterval(loadingInterval);
        }
    }, [])

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <div className="terminal" style={{ width: '100%', height: '100%' }}></div>
        </div>
    )
}
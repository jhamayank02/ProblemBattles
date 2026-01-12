const bashConfig = ["/bin/sh", "-c"];

export const commands = {
    python: function (code: string, input: string) {
        // const runCommand = `timeout 1s echo '${code}' > code.py && python3 code.py`;
        const runCommand = `echo '${code}' > code.py && echo '${input}' > input.txt && python3 code.py < input.txt`;
        return ["/bin/sh", "-c", runCommand];
    },
    cpp: function (code: string, input: string) {
        const runCommand = `mkdir app && cd app && echo '${code}' > code.cpp && echo '${input}' > input.txt && g++ code.cpp -o run && ./run < input.txt`;
        return [...bashConfig, runCommand];
    }
}
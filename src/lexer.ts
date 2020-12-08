import * as vscode from 'vscode';

const tasks = {
    "end": ["value"],
    "mov": ["classical_pointer", "value"],
    "cmp": ["value"],
    "jmp": ["label"],
    "je":  ["label"],
    "jn": ["label"],
    "jg": ["label"],
    "jge": ["label"],
    "jl": ["label"],
    "jle": ["label"],
    "add": ["classical_pointer", "value"],
    "sub": ["classical_pointer", "value"],
    "mul": ["classical_pointer", "value"],
    "div": ["classical_pointer", "value"],
    "h": ["quantum_pointer"],
    "m": ["quantum_pointer"],
    "x": ["quantum_pointer"],
    "y": ["quantum_pointer"],
    "z": ["quantum_pointer"]
};

enum LineType {
    UNDEFINED = -1,
    ARGUMENT,
    LABEL,
    TASK
}

enum CharType {
    UNKNOWN = -1,
    LOW_CHARACTER,
    UP_CHARACTER,
    NUMBER
}

function getType(char: string): CharType {
    if(char){
        if(char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0)) return CharType.NUMBER;
        if(char.charCodeAt(0) >= 'a'.charCodeAt(0) && char.charCodeAt(0) <= 'z'.charCodeAt(0)) return CharType.LOW_CHARACTER;
        if(char.charCodeAt(0) >= 'A'.charCodeAt(0) && char.charCodeAt(0) <= 'Z'.charCodeAt(0)) return CharType.UP_CHARACTER;
    }
    return CharType.UNKNOWN;
}

export function getDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
    // Closed diagnostics
    const diagnostics = [] as vscode.Diagnostic[];
    console.log('asd');

    // Row
    let i = -1;
    // For each character in text
    while(i < document.lineCount)  {
        i++;

        // Checks if line is empty or whitespace only
        if(document.lineAt(i).isEmptyOrWhitespace) i++;

        // Line buffer and type
        const line = Array.from(document.lineAt(i).text);
        const lineType = LineType.UNDEFINED;

        // Column
        let j = -1;
        while(line[j] != '\n'
        && line[j] != '\0') {
            j++;
            
            // Checks if it's whitespace
            if(line[j] === ' ') j++;

            // Detects operation
            if(getType(line[j]) === CharType.LOW_CHARACTER) {
                const start = new vscode.Position(i, j);
                while(getType(line[j]) === CharType.LOW_CHARACTER) j++;
                const range = new vscode.Range(start, new vscode.Position(i, j));
                if(!Object.keys(tasks).includes(document.getText(range))) {
                    diagnostics.push({
                        code: '',
                        message: `Unknown task call.`,
                        range,
                        severity: vscode.DiagnosticSeverity.Error,
                        source: '',
                        // relatedInformation: [
                        // 	new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
                        // ]
                    });
                }
            }
        }
    }
    return diagnostics;
}

export interface Token {
    type: string;
    text: string;
    value: string;
    offset: number;
    lineBreaks: number;
    line: number;
    col: number;
}

export class Parser {
    private lexer = require('./lexer.js');
    private  tokens: Token[] = [];

    constructor() {

    }

    public parse(source: string) {
        this.lexer.reset(source);
        this.tokens = Array.from(this.lexer); // Get all the tokens 
    }
}




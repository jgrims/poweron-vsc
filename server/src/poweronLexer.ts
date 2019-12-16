/**
 *   Lexer for PowerOn specfiles.
 */

 export class Token {
    constructor(public name: string, public value: string, public position: number, public line: number) {}
 }

 enum operators {
    '+'=  'PLUS',
    '-'=  'MINUS',
    '*'=  'MULTIPLY',
    '.'=  'PERIOD',
    '\\'= 'BACKSLASH',
    ':'=  'COLON',
    '%'=  'PERCENT',
    '|'=  'PIPE',
    '!'=  'EXCLAMATION',
    '?'=  'QUESTION',
    '#'=  'POUND',
    '&'=  'AMPERSAND',
    ';'=  'SEMI',
    ','=  'COMMA',
    '('=  'L_PAREN',
    ')'=  'R_PAREN',
    '<'=  'L_ANG',
    '>'=  'R_ANG',
    '{'=  'L_BRACE',
    '}'=  'R_BRACE',
    '['=  'L_BRACKET',
    ']'=  'R_BRACKET',
    '='=  'EQUALS'
}

export class PowerOnLexer {

    private currentPosition: number;
    private inputBuffer: string;
    private inputLength: number;
    private currentLine: number;

    


    constructor(input: string) {
        this.inputBuffer = input;
        this.inputLength = input.length;
        this.currentPosition = 0;
        this.currentLine = 0;
    }

    public reset(input: string) {
        this.inputBuffer = input;
        this.inputLength = input.length;
        this.currentPosition = 0;
        this.currentLine = 0;
    }
    
    public getAllTokens() {
        let tokens: Token[] = [];
        while (true) {
            let token:Token | null = this.getNextToken();
            if (token) { tokens.push(token); break; }
        }
    }

    public getNextToken() {

        // Set this.Position to the beginning of the next token or return null if at end of input.
        while (this.isNotAToken(this.inputBuffer.charAt(this.currentPosition))) {
            this.currentPosition++;
            if (this.currentPosition >= this.inputLength) { return null;}
        }

        // Get the token at the current position.
        let thisChar = this.inputBuffer.charAt(this.currentPosition);

        // Handle comments.
        if (thisChar === '[') { 
            let commentStart = this.currentPosition;
            return new Token( 'COMMENT', this.processComment(), commentStart, this.currentLine );
        }

        // Handle string literals.
        if (thisChar === "'" || thisChar === '"') {
            // Get the whole quoted string.
            let startPos = this.currentPosition;
            let endPos = this.inputBuffer.indexOf(thisChar, this.currentPosition+1);
            if (endPos === -1) {
                // Did not find the matching quote.
                this.currentPosition = this.inputLength;
                return new Token( 'STRING_LITERAL', this.inputBuffer.substr(startPos), startPos, this.currentLine );
            } else {
                // Found the matching quote.
                this.currentPosition = endPos+1;
                let token = new Token( 'STRING_LITERAL', this.inputBuffer.substr(startPos, endPos - startPos), startPos, this.currentLine );
                return token;
            }
        }

        // Handle numeric literals.
        if (thisChar >= '0' && thisChar <= '9') {
            let startPos = this.currentPosition;
            while (thisChar >= '0' && thisChar <= '9') {
                this.currentPosition++;
                thisChar = this.inputBuffer.charAt(this.currentPosition);
            }
            // We're now at the end of the numeric literal.
            return new Token( 'NUMERIC_LITERAL', this.inputBuffer.substr(startPos, this.currentPosition - startPos), startPos, this.currentLine );
        }

        // Handle operators.
        if (this.isOperator(thisChar)) {
            this.currentPosition++;
            return new Token( operators[thisChar], thisChar, this.currentPosition-1, this.currentLine );
        }

        // Handle everything else, which is either a keyword or identifier.
        let startPos = this.currentPosition;
        while (!this.isNotAToken(thisChar) && !this.isOperator(thisChar)) {
            this.currentPosition++;
            thisChar = this.inputBuffer.charAt(this.currentPosition);
        }
        return new Token( 'IDENTIFIER', this.inputBuffer.substr(startPos, this.currentPosition-startPos), startPos, this.currentLine );
    }

    /**
     * Detrermine if the character at the current position
     * is not part of a token.
     */  
    private isNotAToken(char: any): boolean {
        switch (char) {
            case ' ': 
            case '\t': 
            case '\r': 
            case '\n': 
                return true;
        }
        return false;
    }

    /**
     * Process comment blocks.
     */
    private processComment(): string {

        let nestLevel = 0; //For nested comments
        let startPos = this.currentPosition;

        this.currentPosition++;
        while (nestLevel >= 0 && this.currentPosition < this.inputLength) {
            switch (this.inputBuffer.charAt(this.currentPosition)) {
                case '[': { nestLevel++; break; }
                case ']': { nestLevel--; break; }
                case '\r': { this.currentLine++; break; }
                case '\n': { this.currentLine++; break; }
            }
            this.currentPosition++;
        }

        return this.inputBuffer.substring(startPos, this.currentPosition-1);
    }

    private isOperator(char: string): char is keyof typeof operators {
        return char in operators;
    }

}
/**
 *   Lexer for PowerOn specfiles.
 */

 class Token {
    constructor(public name: string, public value: string, public position: number) {}
 }

export default class PowerOnLexer {

    private currentPosition: number;
    private inputBuffer: string;
    private inputLength: number;

    constructor(input: string) {
        this.inputBuffer = input;
        this.inputLength = input.length;
        this.currentPosition = 0;
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
            return new Token( 'COMMENT', this.processComment(), commentStart );
        }

        // Handle string literals.
        if (thisChar === "'" || thisChar === '"') {
            // Get the whole quoted string.
            let startPos = this.currentPosition;
            let endPos = this.inputBuffer.indexOf(thisChar, this.currentPosition+1);
            if (endPos === -1) {
                // Did not find the matching quote.
                this.currentPosition = this.inputLength;
                return new Token( 'STRING_LITERAL', this.inputBuffer.substr(startPos), startPos );
            } else {
                // Found the matching quote.
                this.currentPosition = endPos++;
                return new Token( 'STRING_LITERAL', this.inputBuffer.substr(startPos, endPos), startPos );
            }
        }

        // Handle numeric literals.

        // Handle operators.

        // Handle everything else, which is either a keyword or identifier.

        return null;
    }

    /**
     * Detrermine if the character at the current position
     * is not part of a token.
     */  
    private isNotAToken(char: any): boolean {
        return ' \t\r\n'.indexOf(char) === -1;
    }

    /**
     * Process comment blocks.
     */
    private processComment(): string {

        let nestLevel = 0; //For nested comments
        let startPos = this.currentPosition;

        this.currentPosition++;
        while (nestLevel >= 0 && this.currentPosition < this.inputLength) {
            if (this.inputBuffer.charAt(this.currentPosition) === '[') { nestLevel++; }
            if (this.inputBuffer.charAt(this.currentPosition) === ']') { nestLevel--; }
            this.currentPosition++;
        }

        return this.inputBuffer.substring(startPos, this.currentPosition-1);
    }

}
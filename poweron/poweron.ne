@{%

/*
A simple lexer for PowerOn specfiles.
*/
const moo = require('moo')

const commentStart = '[';
const commentEnd = ']';
const keywords = [];

let lexer = moo.states({
    default: {
        whitespace:  /[ \t]+/,
        commentStart: { match: commentStart, push: comment },
        number:  /0|[1-9][0-9]*/,
        string:  /"(?:\\["\\]|[^\n"\\])*"/,
        newline:  { match: /\n/, lineBreaks: true },
        equals: '='
        logical-op: ['<>', '>', '<', '>=', '<=', 'AND', 'OR', 'NOT'],
        arithmetic-op: ['+', '-', '*', '/'],
        lparen: '(',
        rparen: ')',
        colon: ':',
        identifier: { match: /[a-zA-Z0-9]+/, type: moo.keywords({
            keywords: keywords
        })}
    },
    comment:  {
        commentEnd: { match: commentEnd, pop: true },
        nestedComment: { match: commentStart, push: comment },
        commentText: { match: /[^\[\]]/, lineBreaks: true }
    }

  });
  // End of lexer

%}

@lexer lexer

# PowerOn divisions
div-target -> "TARGET"i _ "=" _ %identifier
div-select -> "SELECT"i _ exp-boolean:? _ "END"i

# Expressions
exp-boolean -> %identifier _ %op-logical _ %op-logical:*

# Base token types
comment -> %comment {% id %}
number -> %number {% id %}
string -> %string {% id %}
op-arithmetic -> %arithmetic-op {% id %}
op-logical -> %logical-op {% id %}
lparen -> %lparen {% id %}
rparen -> %rparen {% id %}
colon -> %colon {% id %}
identifier -> %identifier {% id %}
keyword -> %keyword {% id %}
equals -> %equals {% id %}





# Toss the whitespace in the bin
_ -> null | %whitespace | %newline {% function(d) { return null; } %}
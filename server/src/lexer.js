/*
A simple lexer for PowerOn specfiles.
*/
const moo = require('moo');
const keywords = require('./keywords');

let caseInsensitiveKeywords = defs => {
    const keywords = moo.keywords(defs)
    return value => keywords(value.toLowerCase())
  }

let lexer = moo.states({
    default: {
        whitespace:  { match: /\s+/, lineBreaks: true },
        commentstart: { match: /[\[]/, push: 'comment' },
        commentend: { match: /[\]]/ },
        number:  { match: /0|[1-9][0-9]*/ },
        string:  { match: /(?:"(?:[^\n"])*?")|(?:\'(?:[^\n\'])*?\')/ },
        logicalop: ['=', '<>', '>', '<', '>=', '<=', 'AND', 'OR', 'NOT'],
        arithmeticop: ['+', '-', '*', '/'],
        hash: '#',
        percent: '%',
        comma: ',',
        lparen: '(',
        rparen: ')',
        colon: ':',
        ampersand: '@',
        dollar: '$',
        dot: '.',
        identifier: { match: /[a-zA-Z0-9]+/, type: caseInsensitiveKeywords({
            kwDataType: keywords.dataTypes,
            kwArray: 'array',
            kwDivision: keywords.divisions,
            kwFunction: keywords.functions,
            keyword: keywords.keywords,
            kwProgrammingTerm: keywords.terms,
            kwRecordType: keywords.recordTypes
        })}
    },
    comment:  {
        commentend: { match: /[\]]/, pop: true },
        commentstart: { match: /[\[]/, push: 'comment' },
        commenttext: { match: /[^\[\]]+/, lineBreaks: true }
    }
});

module.exports = lexer;
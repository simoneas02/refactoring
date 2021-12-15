const invoices = require('./data/invoices.json')
const plays = require('./data/plays.json')

import { statement, htmlStatement } from './statement.js'

statement(invoices, plays)
htmlStatement(invoices, plays)

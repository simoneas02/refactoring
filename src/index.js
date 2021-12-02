const invoices = require('./data/invoices.json')
const plays = require('./data/plays.json')

import { statement } from './statement.js'

statement(invoices, plays)

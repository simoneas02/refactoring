const invoices = require('./data/invoices.json')
const plays = require('./data/plays.json')

import { htmlStatement } from './statement.js'

htmlStatement(invoices, plays)

const invoices = require('./data/invoices.json')
const plays = require('./data/plays.json')

import { statment } from './01/statment.js'

statment(invoices, plays)

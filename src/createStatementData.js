export const createStatementData = (invoice, plays) => {
  const playFor = aPerformance => plays[aPerformance.playID]

  const volumeCreditsFor = aPerformance => {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)

    if ('comedy' === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  const totalAmount = invoice =>
    invoice.performances.reduce(
      (total, aPerformance) => total + aPerformance.amount,
      0
    )

  const totalVolumeCredits = invoice =>
    invoice.performances.reduce(
      (total, aPerformance) => total + aPerformance.volumeCredits,
      0
    )

  const enrichPerformance = aPerformance => {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    )
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = volumeCreditsFor(result)

    return result
  }

  const result = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)

  return result
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break

      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break

      default:
        throw new Error(`unknown type: ${this.play.type}`)
    }
    return result
  }
}

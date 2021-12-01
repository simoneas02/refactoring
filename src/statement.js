export const statement = (invoice, plays) => {
  const playFor = aPerformance => plays[aPerformance.playID]

  const amountFor = invoice => {
    let result = 0
    switch (invoice.play.type) {
      case 'tragedy':
        result = 40000
        if (invoice.audience > 30) {
          result += 1000 * (invoice.audience - 30)
        }
        break

      case 'comedy':
        result = 30000
        if (invoice.audience > 20) {
          result += 10000 + 500 * (invoice.audience - 20)
        }
        result += 300 * invoice.audience
        break

      default:
        throw new Error(`unknown type: ${invoice.play.type}`)
    }
    return result
  }

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
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)

    return result
  }

  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)

  return renderPlainText(statementData, plays)
}

const renderPlainText = data => {
  let result = `Statement for ${data.customer}\n`

  const usd = aNumber =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)

  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`

  result += `You earned ${data.totalVolumeCredits} credits\n`

  console.log(result)

  const adaptResultToHTML = (document.getElementById('app').innerHTML = `
  <div>
    <h1>Refactoring 01</h1>
    <p>
      ${result}
    </p>
  </div>
  `)

  return adaptResultToHTML
}

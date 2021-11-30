export const statement = (invoice, plays) => {
  const playFor = aPerformance => plays[aPerformance.playID]

  const enrichPerformance = aPerformance => {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)

    return result
  }

  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)

  return renderPlainText(statementData, plays)
}

const renderPlainText = (data, plays) => {
  let result = `Statement for ${data.customer}\n`

  const usd = aNumber =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)

  const amountFor = aPerformance => {
    let result = 0
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break

      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break

      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`)
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

  const totalAmount = () => {
    let result = 0
    for (let perf of data.performances) {
      result += amountFor(perf)
    }
    return result
  }

  const totalVolumeCredits = () => {
    let result = 0
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf)
    }

    return result
  }

  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`
  }

  result += `Amount owed is ${usd(totalAmount())}\n`

  result += `You earned ${totalVolumeCredits()} credits\n`

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

export const statement = (invoice, plays) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  const formatter = aNumber =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber)

  const playFor = aPerformance => plays[aPerformance.playID]

  const amountFor = aPerformance => {
    let result = 0
    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`)
    }
    return result
  }

  const volumeCreditsFor = aPerformance => {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)

    if ('comedy' === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf)

    result += `${playFor(perf).name}: ${formatter(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`

    totalAmount += amountFor(perf)
  }

  result += `Amount owed is ${formatter(totalAmount / 100)}\n`

  result += `You earned ${volumeCredits} credits\n`

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

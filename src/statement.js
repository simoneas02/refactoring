export const statement = (invoice, plays) => {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format

  function amountFor(perf, play) {
    let thisAmount = 0
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30)
        }
        break

      case 'comedy':
        thisAmount = 30000
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20)
        }
        thisAmount += 300 * perf.audience
        break

      default:
        throw new Error(`unknown type: ${play.type}`)
    }
    return thisAmount
  }

  for (let perf of invoice.performances) {
    const play = plays[perf.playID]

    let thisAmount = amountFor(perf, play)

    volumeCredits += Math.max(perf.audience - 30, 0)

    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5)

    result += `${play.name}: ${formatter(thisAmount / 100)} (${
      perf.audience
    } seats)\n`

    totalAmount += thisAmount
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

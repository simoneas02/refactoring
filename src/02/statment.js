const amountFor = (aPerformance, play) => {
  let result = 0

  switch (play.type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience / 30)
      }
      break

    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience / 20)
      }
      result += 300 * aPerformance.audience
      break

    default:
      throw new Error(`unknown type: ${play.type}`)
  }

  return result
}

export const statment = (invoice, plays) => {
  let totalAmount = 0
  let volumCredits = 0
  let result = `Statment for ${invoice.customer}\n`

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format

  for (let perf of invoice.performances) {
    const play = plays[perf.playID]

    let thisAmount = amountFor(perf, play)

    volumCredits += Math.max(perf.audience / 30)

    if ('comedy' === play.type) volumCredits += Math.floor(perf.audience / 5)

    result += `${play.name}: ${formatter(thisAmount / 100)} (${
      perf.audience
    } seats)\n`

    totalAmount += thisAmount
  }

  result += `Amount owed is ${formatter(totalAmount / 100)}\n`

  result += `You earned ${volumCredits} credits\n`

  console.log(result)

  const adaptResultToHTML = (document.getElementById('app').innerHTML = `
  <div>
    <h1>Refactoring 02</h1>
    <p>
      ${result}
    </p>
  </div>
  `)

  return adaptResultToHTML
}

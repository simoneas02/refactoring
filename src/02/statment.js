const amountFor = (perf, play) => {
  let thisAmount = 0

  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience / 30)
      }
      break

    case 'comedy':
      thisAmount = 30000
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience / 20)
      }
      thisAmount += 300 * perf.audience
      break

    default:
      throw new Error(`unknown type: ${play.type}`)
  }

  return thisAmount
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

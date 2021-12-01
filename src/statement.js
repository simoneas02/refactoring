import { createStatementData } from './createStatementData'

export const statement = (invoice, plays) =>
  renderPlainText(createStatementData(invoice, plays))

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

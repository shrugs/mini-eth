const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const accounts = require('./accounts.json')


const main = async () => {
  const me = (await web3.eth.getAccounts())[0]
  console.log('Distributing ether....')
  for (const acc of accounts) {
    console.log(`${acc}...`)
    await web3.eth.sendTransaction({
      from: me,
      to: acc,
      value: '1000000000000000000000000',
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

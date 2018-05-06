const web3Utils = require('web3-utils')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const PoWArtifact = require('./artifacts/ProofOfWork.json')

const deployContract = async (artifact) => {
  const me = (await web3.eth.getAccounts())[0]
  const Contract = new web3.eth.Contract(
    artifact.abi,
    {
      data: artifact.bytecode
    }
  )
  const deployer = Contract.deploy()
  const gas = await deployer.estimateGas()
  return deployer.send({
    gas,
    from: me
  })
}

const main = async () => {
  const me = (await web3.eth.getAccounts())[0]
  console.log('me:', me)
  const pow = await deployContract(PoWArtifact)
  console.log(`Proof of Work: ${pow._address}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

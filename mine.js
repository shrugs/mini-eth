const web3Utils = require('web3-utils')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

const PoWArtifact = require('./artifacts/ProofOfWork.json')

const isNonceValid = (difficulty, challengeNumber, sender, nonce) => {
  const digest = web3Utils.soliditySha3(
    {t: 'bytes32', v: challengeNumber},
    {t: 'address', v: sender},
    {t: 'uint256', v: nonce},
  )

  return {
    valid: web3Utils.toBN(digest).lt(web3Utils.toBN(difficulty)),
    digest,
  }
}

const generateNonce = () => web3Utils.toBN(web3Utils.randomHex(32))

let didRequestExit = false
const main = async () => {
  const me = (await web3.eth.getAccounts())[0]
  const pow = new web3.eth.Contract(
    PoWArtifact.abi,
    process.argv[2],
    {
      data: PoWArtifact.bytecode
    }
  )

  let maxTries = 0
  while (true) {
    if (didRequestExit) { break }

    const difficulty = await pow.methods.difficulty().call()
    const challengeNumber = await pow.methods.challengeNumber().call()
    let validNonce
    let validDigest
    // the primary mining loop
    let count = 0
    while (true) {
      // @TODO (wait for tap or some sort of signal)
      // generate a random nonce
      count++
      const nonce = generateNonce()
      // check to see if it's valid
      const {
        valid,
        digest
      } = isNonceValid(
        difficulty,
        challengeNumber,
        me,
        nonce
      )
      if (valid) {
        validNonce = nonce
        validDigest = digest
        break
      }
    }

    console.log()
    console.log(`Got a valid nonce! Took ${count} tries.`)
    console.log()
    if (count > maxTries) { maxTries = count }
    // lights and shit

    // loading submission ....
    try {
      await pow.methods.mine(validNonce, validDigest).call({ from: me })
    } catch (error) {
      console.error(error)
    }

    console.log('done!')
    // done!

    // next person steps up and we continue looping...
  }

  console.log('max tries', maxTries)
}

const gracefulExit = async () => {
  if (didRequestExit) {
    process.exit(1)
  }
  didRequestExit = true
}

process.on('SIGINT', gracefulExit)
process.on('SIGTERM', gracefulExit)

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })


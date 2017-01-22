const IpfsAmorphApi = require('./')
const chai = require('chai')
const Amorph = require('amorph')
const chaiAsPromised = require('chai-as-promised')
const chaiAmorph = require('chai-amorph')

chai.use(chaiAmorph)
chai.use(chaiAsPromised)
chai.should()

describe('IpfsAmorphApi', () => {
  let ipfsAmorphApi
  const file = new Amorph('hello world', 'ascii')
  let multihash
  let worldMultihash

  it('should instantiate', () => {
    ipfsAmorphApi = new IpfsAmorphApi({
      host: 'ipfs.infura.io',
      port: '5001',
      protocol: 'https'
    })
  })

  describe('addFile', () => {
    it('should upload file', () => {
      return ipfsAmorphApi.addFile(file).then((_multihash) => {
        multihash = _multihash
      })
    })
    it('multihash should be instance of Amorph', () => {
      multihash.should.be.instanceOf(Amorph)
    })
  })

  describe('getFile', () => {
    it('should get file as "hello world"', () => {
      return ipfsAmorphApi.getFile(multihash).should.eventually.amorphTo('ascii').equal('hello world')
    })
  })

})

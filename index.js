const IpfsApi = require('ipfs-api')
const Amorph = require('amorph')
const Q = require('q')
const amorphBase58Plugin = require('amorph-base58')
const amorphBufferPlugin = require('amorph-buffer')
const arguguard = require('arguguard')

Amorph.loadPlugin(amorphBase58Plugin)
Amorph.loadPlugin(amorphBufferPlugin)
Amorph.ready()

function IpfsAmorphApi(ipfsApiOptions) {
  arguguard('IpfsAmorphApi(ipfsApiOptions)', [Object], arguments)
  this.api = IpfsApi(ipfsApiOptions)
}

IpfsAmorphApi.prototype.defer = function defer() {
  arguguard('IpfsAmorphApi.defer()', [], arguments)
  return Q.defer()
}


IpfsAmorphApi.prototype.addFile = function addFile(file) {
  arguguard('ipfsAmorphApi.addFile(file)', [Amorph], arguments)
  return this.api.add(file.to('buffer')).then((results) => {
    return new Amorph(results[0].hash, 'base58')
  })
}

IpfsAmorphApi.prototype.getFile = function getFile(multihash) {
  arguguard('ipfsAmorphApi.getFile(multihash)', [Amorph], arguments)
  const deferred = this.defer()
  this.api.get(multihash.to('base58')).then((readable) => {
    readable.on('readable', () => {
      const result = readable.read()
      if (!result) {
        return
      }

      const data = []

      result.content.on('data', (_data) => {
        data.push(..._data)
      })
      result.content.on('end', () => {
        deferred.resolve(new Amorph(data, 'array'))
      })
    })
  })
  return deferred.promise
}

module.exports = IpfsAmorphApi

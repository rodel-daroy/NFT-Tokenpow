class TokenPowSimpleArt extends Jig {
  init (name, author, description, emoji, image,txtid, assetIds, owner) {
    this.metadata = {
      name,
      author,
	    description,
	    emoji,
      image,
      txtid,
	    assetIds
    }
    this.name = name;
    this.owner = owner;
  }
  send(to) {
    this.owner = to;
  }
}

TokenPowSimpleArt.interactive = false;
TokenPowSimpleArt.presets = {}
TokenPowSimpleArt.presets.main = {}

TokenPowSimpleArt.presets.main.location = '990809925e4c05bac1a3a84cf877db2d9db3542fe9ff44fe9e604714f3e54c69_o1'
TokenPowSimpleArt.presets.main.origin = '990809925e4c05bac1a3a84cf877db2d9db3542fe9ff44fe9e604714f3e54c69_o1'
TokenPowSimpleArt.presets.main.nonce = 1
TokenPowSimpleArt.presets.main.owner = '16X4WkYKpU3uofvR5wQeLRWkT4RcoDuDVX'
TokenPowSimpleArt.presets.main.satoshis = 0

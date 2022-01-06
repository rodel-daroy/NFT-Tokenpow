//84e20d29a122c6c3ad3776cc16c049d196fa28f9447b0745053d2b9ea9c0ff11_o1
class RelayNFT extends Jig {

  init(owner, no) {
    const minting = caller === this.constructor;
    if (!minting) throw new Error('Must create using mint()');
    this.sender = caller && caller.owner ? caller.owner : null;
    if (no) {
      this.no = no;
    }
    if (owner) this.owner = owner;
  }

  static mint(owner) {
    const metadata = this.metadata || {};
    if (this.max && this.total >= this.max) {
      throw new Error('max supply exceeded');
    }

    this.total++;
    if (metadata.numbered) {
      return new this(owner, this.total);
    }
    return new this(owner);
  }

  send(to) {
    this.sender = this.owner;
    this.owner = to;
  }

}

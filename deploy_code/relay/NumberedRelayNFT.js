//3ee7ca18aa0a7df5ae949c2eaa9dff34cbb18db214ebb8cc0db2ae5c457aec7c_o1
class NumberedRelayNFT extends RelayNFT {

    init(no, owner) {
      const minting = caller === this.constructor;
      if (!minting) throw new Error('Must create using mint()');
      this.sender = caller && caller.owner ? caller.owner : null;
      this.no = no;
      if (owner) this.owner = owner;
    }

    static mint(no, owner) {
      return new this(no, owner);
    }

    send(to) {
      this.sender = this.owner;
      this.owner = to;
    }

  }

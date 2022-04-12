import Connector from "@deficonnect/core";
import { IWalletConnectOptions, IPushServerOptions } from "@deficonnect/types";
import * as cryptoLib from "@deficonnect/iso-crypto";

class WalletConnect extends Connector {
  constructor(connectorOpts: IWalletConnectOptions, pushServerOpts?: IPushServerOptions) {
    super({
      cryptoLib,
      connectorOpts,
      pushServerOpts,
    });
  }
}

export default WalletConnect;

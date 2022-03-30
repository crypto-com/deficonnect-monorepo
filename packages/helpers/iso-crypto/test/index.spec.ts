import "mocha";
import { expect } from "chai";

import { IJsonRpcRequest, IEncryptionPayload } from "@deficonnect/types";
import { convertHexToArrayBuffer } from "@deficonnect/utils";

import * as IsoCrypto from "../src";

const TEST_JSON_RPC_REQUEST: IJsonRpcRequest = {
  id: 1,
  jsonrpc: "2.1",
  method: "dc_test",
  params: [],
  session: {
    chainId: "1",
    account: "0x9bc0583D5ade235737a956A0f561267C656567d5",
    chainType: "eth",
  },
};


const TEST_KEY = "9a3b8454a01a3a78d059b4dfd3672f9ca3c789ea852bf39b406c21c72c7b3bca";
const TEST_IV = "81413061def750d1a8f857d98d66584d";
const TEST_ENCRYPTION_PAYLOAD: IEncryptionPayload = {
  data:
    "fb62875ddd9717fba965d0fcb2fe57d72052ed085dbabde6392b3bbafcb63fd47154e1b331202528a2c0a96da2eeddc9b99dd3c8d83249fed7d3f6ceeef775f514a23432a199d25483106c22d7e2b539c9eafea50b319e77512d8aad7fb1bd27f4d51374a021c85825b6d285b5683cb1570d3f3bc176eb2375a37268ec4dff5df36b825a6197a4513ffb2777f7d08b00c87b7dd4efc34dbb2db7b738635bb774",
  hmac: "9dde91e978a797b78523df684e33931e45a3108bc7df446c64792b120631ed3f",
  iv: "81413061def750d1a8f857d98d66584d",
};

describe("IsoCrypto", () => {
  it("encrypt successfully", async () => {
    const request = TEST_JSON_RPC_REQUEST;
    const key = convertHexToArrayBuffer(TEST_KEY);
    const iv = convertHexToArrayBuffer(TEST_IV);
    const result = await IsoCrypto.encrypt(request, key, iv);
    expect(!!result).to.be.true;
    if (!result) return;
    expect(result.data).to.eql(TEST_ENCRYPTION_PAYLOAD.data);
    expect(result.hmac).to.eql(TEST_ENCRYPTION_PAYLOAD.hmac);
    expect(result.iv).to.eql(TEST_ENCRYPTION_PAYLOAD.iv);
  });

  it("decrypt successfully", async () => {
    const payload = TEST_ENCRYPTION_PAYLOAD;
    const key = convertHexToArrayBuffer(TEST_KEY);
    const result = await IsoCrypto.decrypt(payload, key);
    expect(!!result).to.be.true;
    if (!result) return;
    expect((result as IJsonRpcRequest).id).to.eql(TEST_JSON_RPC_REQUEST.id);
    expect((result as IJsonRpcRequest).jsonrpc).to.eql(TEST_JSON_RPC_REQUEST.jsonrpc);
    expect((result as IJsonRpcRequest).method).to.eql(TEST_JSON_RPC_REQUEST.method);
    expect((result as IJsonRpcRequest).params).to.eql(TEST_JSON_RPC_REQUEST.params);
  });
});

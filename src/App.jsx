import { useState } from "react";
import { isConnected, getAddress } from "@stellar/freighter-api";
import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  Address,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import "./App.css";

const CONTRACT_ID =
  "CB47RKMUX54G7UCXN5ROVTX3CMTBP4GNYHJFBHH37FPMJMPK7GL3DYTS";

const RPC_URL = "https://soroban-testnet.stellar.org";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Not Connected");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [contractStatus, setContractStatus] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      setStatus("Connecting...");

      const connection = await isConnected();

      if (!connection) {
        setStatus("Not Connected");
        setError(
          "Freighter wallet is not installed or not available."
        );
        return;
      }

      const wallet = await getAddress();

      if (wallet.error) {
        setStatus("Not Connected");
        setError(wallet.error);
        return;
      }

      if (wallet.address) {
        setAddress(wallet.address);
        setStatus("Connected");
      } else {
        setStatus("Not Connected");
        setError("Could not get wallet address.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Not Connected");
      setError(err.message || "Wallet connection failed.");
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    setStatus("Not Connected");
    setError("");
    setResult("");
    setContractStatus("");
  };

  const sayHello = async () => {
    try {
      setError("");
      setResult("");
      setContractStatus("");

      if (!address) {
        setError("Please connect your Freighter wallet first.");
        return;
      }

      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      setContractStatus("Calling contract...");

      const server = new rpc.Server(RPC_URL);

      const account = await server.getAccount(address);

      const contract = new Contract(CONTRACT_ID);

      const operation = contract.call(
        "hello",
        nativeToScVal(name.trim(), { type: "string" })
      );

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const simulated = await server.simulateTransaction(transaction);

      if (rpc.Api.isSimulationError(simulated)) {
        throw new Error(simulated.error);
      }

      if (!simulated.result) {
        throw new Error("Contract simulation did not return a result.");
      }

      const returnValue = simulated.result.retval;

      const values = returnValue
        .value()
        .map((item) => item.value());

      const greeting = values[0];
      const returnedName = values[1];

      setResult(`${greeting} ${returnedName}`);
      setContractStatus("Contract call successful!");
    } catch (err) {
      console.error(err);
      setContractStatus("");
      setError(
        err.message || "Failed to call the Stellar smart contract."
      );
    }
  };

  return (
    <div className="app">
      <h1>⭐ Stellar Yellow Belt</h1>

      <h2>Wallet Connection Demo</h2>

      <div className="wallet-buttons">
        <button onClick={connectWallet}>
          Connect Wallet
        </button>

        <button onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>

      <h3>Status</h3>
      <p>{status}</p>

      <h3>Wallet Address</h3>
      <p>
        {address || "No wallet connected."}
      </p>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <hr />

      <h2>Hello Contract</h2>

      <p>
        Contract ID:
      </p>

      <p className="contract-id">
        {CONTRACT_ID}
      </p>

      <label>
        Enter your name:
      </label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />

      <button onClick={sayHello}>
        Say Hello
      </button>

      {contractStatus && (
        <p>{contractStatus}</p>
      )}

      {result && (
        <div className="result">
          <h3>Result</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
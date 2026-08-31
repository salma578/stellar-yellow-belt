import { useState } from "react";
import {
  isConnected,
  getAddress,
  isAllowed,
  setAllowed,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import "./App.css";

const CONTRACT_ID =
  "CAHD6Y7CRSWAP7QEKOIORPAIBMBPQHL7F4ZGQKOUVS4MD2EZ7JPCMCPK";
const RPC_URL = "https://soroban-testnet.stellar.org";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Not Connected");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [achievement, setAchievement] = useState("");
  const [result, setResult] = useState("");
  const [contractStatus, setContractStatus] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      setStatus("Connecting...");

      const walletConnected = await isConnected();
      if (!walletConnected) {
        setStatus("Not Connected");
        setError("Freighter wallet is not installed or not available.");
        return;
      }

      const wallet = await getAddress();
      if (wallet.error) {
        setStatus("Not Connected");
        setError(wallet.error);
        return;
      }

      const allowed = await isAllowed();
      if (allowed.error) {
        throw new Error(allowed.error);
      }

      if (!allowed.isAllowed) {
        const permission = await setAllowed();
        if (permission.error || !permission.isAllowed) {
          throw new Error(permission.error || "Freighter permission request was denied.");
        }
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

  const awardBadge = async () => {
    try {
      setError("");
      setResult("");
      setContractStatus("");

      if (!address) {
        setError("Please connect your Freighter wallet first.");
        return;
      }

      if (!name.trim()) {
        setError("Please enter a recipient name.");
        return;
      }

      if (!achievement.trim()) {
        setError("Please enter an achievement description.");
        return;
      }

      setContractStatus("Preparing signed contract transaction...");

      const server = new rpc.Server(RPC_URL);
      const account = await server.getAccount(address);
      const contract = new Contract(CONTRACT_ID);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            "award_badge",
            nativeToScVal(name.trim(), { type: "string" }),
            nativeToScVal(achievement.trim(), { type: "string" })
          )
        )
        .setTimeout(30)
        .build();

      const simulated = await server.simulateTransaction(transaction);
      if (rpc.Api.isSimulationError(simulated)) {
        throw new Error(simulated.error || "Contract simulation failed.");
      }

      const assembled = rpc.assembleTransaction(transaction, simulated).build();
      const signedResponse = await signTransaction(assembled.toXDR(), {
        networkPassphrase: Networks.TESTNET,
        address,
      });

      if (signedResponse.error) {
        throw new Error(signedResponse.error.message || "Signing was rejected.");
      }

      const signedTransaction = TransactionBuilder.fromXDR(
        signedResponse.signedTxXdr,
        Networks.TESTNET
      );

      const payload = await server.sendTransaction(signedTransaction);
      if (payload.status === "ERROR") {
        throw new Error(payload.errorResult?.resultMessage || "Transaction failed on the network.");
      }

      setContractStatus("Badge issued successfully!");
      setResult(
        `Stellar Yellow Belt • ${name.trim()} • ${achievement.trim()} • verified`
      );
    } catch (err) {
      console.error(err);
      setContractStatus("");
      setError(err.message || "Failed to call the Stellar smart contract.");
    }
  };

  return (
    <div className="app">
      <h1>⭐ Stellar Yellow Belt</h1>

      <h2>Freighter wallet demo</h2>

      <div className="wallet-buttons">
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={disconnectWallet}>Disconnect</button>
      </div>

      <h3>Status</h3>
      <p>{status}</p>

      <h3>Wallet Address</h3>
      <p>{address || "No wallet connected."}</p>

      {error && <p className="error">{error}</p>}

      <hr />

      <h2>Yellow Belt Contract</h2>
      <p>Contract ID:</p>
      <p className="contract-id">{CONTRACT_ID}</p>

      <label>Recipient name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter recipient name"
      />

      <label>Achievement:</label>
      <input
        type="text"
        value={achievement}
        onChange={(e) => setAchievement(e.target.value)}
        placeholder="Finished the Stellar Yellow Belt project"
      />

      <button onClick={awardBadge}>Award Badge</button>

      {contractStatus && <p>{contractStatus}</p>}

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
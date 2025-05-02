import React, { useState, useEffect } from "react";

const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<"add" | "withdraw">("add");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBalance(5000);
      setLoading(false);
    }, 1000);
  }, []);

  const openModal = (type: "add" | "withdraw") => {
    setTransactionType(type);
    setAmount("");
    setError("");
    setShowModal(true);
  };

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (transactionType === "withdraw" && numAmount > balance) {
      setError("Not enough balance!");
      return;
    }

    if (transactionType === "add") {
      setBalance((prev) => prev + numAmount);
    } else {
      setBalance((prev) => prev - numAmount);
    }

    setShowModal(false);
  };

  return (
   
    <div className="h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
      <div className="bg-gradient-to-br from-[#020816] via-[#0a1a3c] to-[#11224e] text-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Wallet</h1>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl mb-6 border border-white/10 text-center shadow-inner shadow-white/20">
          {loading ? (
            <p className="text-gray-400 text-lg">Loading...</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-3xl font-semibold mt-2">₹ {balance.toLocaleString()}</p>
            </>
          )}
        </div>

        <button
          onClick={() => openModal("add")}
          disabled={loading}
          className={`w-full py-3 mb-4 rounded-xl font-semibold transition ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#3b82f6] hover:bg-[#2563eb]"
          }`}
        >
          Add Money
        </button>

        <button
          onClick={() => openModal("withdraw")}
          disabled={loading}
          className={`w-full py-3 mb-2 rounded-xl font-semibold transition ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#3b82f6] hover:bg-[#2563eb]"
          }`}
        >
          Withdraw Money
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#0f172a] p-8 rounded-2xl w-96 border border-[#334155]">
            <h2 className="text-2xl font-semibold mb-6 capitalize text-white">{transactionType} Money</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 mb-2 rounded-xl bg-[#1e293b] text-white placeholder-gray-400 focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-[#1e293b] text-white hover:bg-[#334155] rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTransaction}
                disabled={!amount || !!error}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  !amount || !!error
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#3b82f6] hover:bg-[#2563eb]"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;

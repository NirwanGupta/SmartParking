import { useState } from "react";
import { IndianRupee, CreditCard, Landmark, QrCode, Wallet2 } from "lucide-react";
import toast from "react-hot-toast";

const WalletPage = () => {
  const [balance, setBalance] = useState(450);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddMoney = () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (!selectedMethod) {
      toast.error("Please choose a payment method.");
      return;
    }

    setBalance(prev => prev + amt);
    toast.success(`₹${amt} added via ${selectedMethod}`);
    setAmount("");
    setSelectedMethod("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 bg-base-100 shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Choose One Payment Method</h2>

      {/* Wallet Balance Display */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-gray-500">Current Wallet Balance</p>
          <h2 className="text-3xl font-bold text-primary flex items-center gap-1">
            <IndianRupee className="w-5 h-5" />
            {balance}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <label className="text-sm font-medium mb-1">Add Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="input input-bordered w-32"
            placeholder="e.g. 500"
          />
        </div>
      </div>

      {/* Credit/Debit */}
      <div className={`border rounded-md p-4 mb-4 ${selectedMethod === "Card" && "border-primary"}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="Card"
            checked={selectedMethod === "Card"}
            onChange={e => setSelectedMethod(e.target.value)}
            className="radio radio-primary"
          />
          <span className="font-semibold text-lg">Credit / Debit Card</span>
        </label>
      </div>

      {/* UPI */}
      <div className={`border rounded-md p-4 mb-6 ${selectedMethod === "UPI" && "border-primary"}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="UPI"
            checked={selectedMethod === "UPI"}
            onChange={e => setSelectedMethod(e.target.value)}
            className="radio radio-primary"
          />
          <span className="font-semibold text-lg">UPI</span>
        </label>
      </div>

      {/* Confirm Button */}
      <button className="btn btn-primary w-full" onClick={handleAddMoney}>
        Confirm and Add Money
      </button>
    </div>
  );
};

export default WalletPage;

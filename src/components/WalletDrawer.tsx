import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Lock, CheckCircle2, PlusCircle, ShieldAlert } from 'lucide-react';

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, onClose }) => {
  const { walletBalance, reservedAmount, transactions, topUpWallet } = useApp();
  const [customAmount, setCustomAmount] = useState<string>('');

  if (!isOpen) return null;

  const handleTopUp = (amt: number) => {
    topUpWallet(amt);
    setCustomAmount('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(customAmount);
    if (val > 0) {
      handleTopUp(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">YatriSync Escrow Wallet</h3>
              <p className="text-xs text-slate-300">Simulated Transport Prototype Balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card Section */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Balance</span>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ₹{walletBalance.toFixed(2)}
              </span>
            </div>

            {/* Escrow Reserved Breakdown */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Reserved in Pooling Escrow:</span>
              </div>
              <span className="font-mono font-semibold text-amber-700 tabular-nums">
                ₹{reservedAmount.toFixed(2)}
              </span>
            </div>

            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
              <strong>Escrow Guarantee (FR-07):</strong> Fare is only <em>reserved</em> during passenger pooling. Funds are captured only after the transport operator assigns and approves the bus. If the pool does not reach 20 seats or is cancelled, reserved funds are immediately released.
            </div>
          </div>

          {/* Quick Top-up buttons */}
          <div>
            <span className="text-xs font-semibold text-slate-600 block mb-2">Simulate Instant Top-Up</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleTopUp(100)}
                className="py-2 text-xs font-semibold font-mono text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
              >
                +₹100
              </button>
              <button
                onClick={() => handleTopUp(200)}
                className="py-2 text-xs font-semibold font-mono text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
              >
                +₹200
              </button>
              <button
                onClick={() => handleTopUp(500)}
                className="py-2 text-xs font-semibold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-1"
              >
                +₹500
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="mt-2 flex gap-2">
              <input
                type="number"
                min="10"
                placeholder="Custom amount (₹)"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Transaction Ledger</h4>
            <span className="text-[11px] text-slate-500 font-mono">{transactions.length} Records</span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No transactions recorded yet.</div>
          ) : (
            <div className="space-y-2">
              {transactions.map(txn => {
                const isCredit = txn.type === 'TOPUP' || txn.type === 'FARE_REFUND';
                return (
                  <div
                    key={txn.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600'
                          : txn.type === 'FARE_RESERVE'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                        {isCredit ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{txn.description}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                          <span>{txn.timestamp}</span>
                          <span>·</span>
                          <span>{txn.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-mono font-bold ${
                        isCredit ? 'text-emerald-700' : 'text-slate-800'
                      }`}>
                        {isCredit ? '+' : '-'}₹{txn.amount}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        bal: ₹{txn.balanceAfter}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

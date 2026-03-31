"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const WALLET = "2dNawExkXURUxWzceSChdM2rX1yq4n7rosUz6ws3RVNM";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = WALLET;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 flex flex-col items-center gap-4 p-6 device-shell max-w-sm w-full mx-4"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 te-button text-[9px] px-2 py-1"
        >
          ESC
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="text-[11px] font-pixel text-[#F5F0EB] tracking-wider uppercase">
            Buy us a coffee
          </div>
          <div className="text-[9px] font-mono text-[#5A5550] mt-1">
            Send USDC on Solana
          </div>
        </div>

        {/* QR Code */}
        <div className="te-inset p-3">
          <div className="p-2 bg-[#0D0E0C] rounded">
            <QRCodeSVG
              value={`solana:${WALLET}`}
              size={180}
              bgColor="#0D0E0C"
              fgColor="#8A8480"
              level="M"
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* Solana + USDC label */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 te-inset text-[#9945FF]">
            SOLANA
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 te-inset text-[#2775CA]">
            USDC
          </span>
        </div>

        {/* Wallet address */}
        <div className="w-full">
          <div className="te-label mb-1">Wallet Address</div>
          <div className="flex items-center gap-1">
            <code className="flex-1 text-[9px] font-mono text-[#8A8480] te-inset px-2 py-1.5 truncate select-all">
              {WALLET}
            </code>
            <button
              onClick={handleCopy}
              className="te-button text-[9px]"
            >
              {copied ? "OK!" : "COPY"}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-[8px] font-mono text-[#5A5550] text-center leading-relaxed">
          Only send USDC on the Solana network to this address.
          <br />
          Other tokens or networks will be lost.
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface Props {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  setSelectedIndex: (i: number) => void;
  title: string;
}

export default function ZoomedImageModal({
  images,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
  setSelectedIndex,
  title,
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          flexShrink: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {images.length > 1 && (
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              {selectedIndex + 1} / {images.length}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "50%",
              width: 38,
              height: 38,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      <div
        onClick={onClose}
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          cursor: "zoom-out",
        }}
      >
        <Image
          src={images[selectedIndex]}
          alt={title}
          fill
          style={{ objectFit: "contain" }}
          sizes="100vw"
          priority
          quality={100}
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(0,0,0,0.55)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoIosArrowBack size={26} />
            </button>
            <button
              aria-label="Next"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "rgba(0,0,0,0.55)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoIosArrowForward size={26} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
            padding: "12px 20px",
            overflowX: "auto",
            flexShrink: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              style={{
                position: "relative",
                flexShrink: 0,
                width: i === selectedIndex ? 68 : 52,
                height: i === selectedIndex ? 68 : 52,
                borderRadius: 8,
                overflow: "hidden",
                border: i === selectedIndex ? "2px solid #fff" : "2px solid rgba(255,255,255,0.2)",
                opacity: i === selectedIndex ? 1 : 0.5,
                cursor: "pointer",
                padding: 0,
                background: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                style={{ objectFit: "cover" }}
                sizes="68px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

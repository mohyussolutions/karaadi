const FeeLoading = () => (
  <div className="p-4 bg-white border rounded-2xl shadow-sm space-y-3 my-4 animate-pulse">
    <style jsx>{`
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #0c55e8ff;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }
      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>

    <div className="flex justify-center">
      <div className="loader" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
  </div>
);

export default FeeLoading;

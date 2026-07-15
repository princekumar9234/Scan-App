import React, { useRef } from "react";

const Camera = () => {
  const videoRef = useRef(null);

  const cameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Camera Access Denied:", error.message);
      alert("Please allow camera permission.");
    }
  };

  return (
    <div>
      <button
        onClick={cameraAccess}
        className="bg-emerald-400 text-lg font-bold text-black py-3 px-6 rounded"
      >
        Open Camera
      </button>

      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default Camera;

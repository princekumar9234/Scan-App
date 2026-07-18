import React, { useState } from "react";
import HomeNav from "./HomeNav";
import { ScanLine } from "lucide-react";
const HomePage = () => {
  const [text, setText] = useState("");

  const handleBarCodeNumber = (e) => {
    e.preventDefault();
    setText("");
    // console.log(text)
  };

  return (
    <div>
      <HomeNav />
      <div>
        <div>
          <form
            className="flex items-center mt-5 justify-between m-4 gap-3"
            onSubmit={(e) => {
              handleBarCodeNumber(e);
            }}
          >
            <input
              onChange={(e) => {
                setText(e.target.value);
              }}
              type="text"
              value={text}
              placeholder="Enter or Scan Barcode Number"
              className="w-[80%] border rounded-xl  py-3 md:m-5 px-4 focus:outline-none"
            />
            <button className="flex bg-white text-black cursor-pointer md:mr-7 rounded-xl py-3 font-bold md:py-2 gap-2 px-2 md:px-15 md:gap-3 md:text-3xl items-center ">
              <ScanLine /> Scan
            </button>
          </form>
        </div>
        <div className="flex  flex-wrap fixed items-center text-center md:text-2xl gap-2 md:gap-5 w-full font-bold">
              <div className="text-blue-400 border w-[23%] md:ml-8 md:py-5 rounded ml-3 px-2 py-3">
                <h2 >Total scans </h2>
                <p>210</p>
              </div>
              <div className="border text-green-400 w-[21%] md:py-5 rounded  px-2 py-3">
                <h2 >Healthy </h2>
                <p>210</p>
              </div>
              <div className="border rounded w-[21%] md:py-5 text-orange-400 px-2 py-3">
                <h2 >Moderate </h2>
                <p>210</p>
              </div>
              <div className="border rounded w-[23%] md:py-5 text-red-400 px-2  py-3">
                <h2 >Unhealthy</h2>
                <p>210</p>
              </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

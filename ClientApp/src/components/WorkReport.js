import React from "react";
import "./ImageSlider.css";
import ImageSlider from "./ImageSlider";
import { SliderData } from "./SliderData";

const WorkReport = () => {
   return (
        <>
            <div className="slider-container">
                <h1>Hello!</h1>
                <ImageSlider slides={SliderData}/>
            </div>
        </>
   );
}

export default WorkReport;
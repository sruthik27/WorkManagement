import React, {useState, useEffect} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./WorkReport.css"



function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}


const WorkReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/db/getimages')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
      };

    return (
      <>
        <div className='report-grid'>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: '130px' }}>
            {data.map((item, index) => (
              <div key={index}>
                <h2>{item.workname}</h2>
                <Slider {...settings}>
                  {item.links.map((link, i) => (
                    <div key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                      <img src={link} alt="" style={{height: '250px', objectFit: 'cover' }} />
                      </a>
                    </div>
                  ))}
                </Slider>
              </div>
            ))}
          </div>
        </div>
      </>
    );
}

export default WorkReport;
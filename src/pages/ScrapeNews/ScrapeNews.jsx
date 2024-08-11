import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ScrapeNews.css";

const ScrapeNews = ({ topi, maxw }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const newsRef = useRef([]);
  const apiKey = "15ba7096556b11b6ec2883f057667497"; // Your ScraperAPI key
  const baseUrl = "https://krishijagran.com"; // Base URL of the site
  const url = `${baseUrl}/feeds`; // Full URL to be scraped

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.scraperapi.com?api_key=${apiKey}&url=${url}`
        );
        const htmlString = response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const items = Array.from(doc.querySelectorAll(".n-f-item"));

        const newsData = items.map((item) => {
          const relativeLink = item.querySelector("h2 a").getAttribute("href");
          const fullLink = `${baseUrl}${relativeLink}`;

          const imgElement = item.querySelector("img");
          let imageSrc = "path/to/fallback-image.jpg";

          if (imgElement) {
            const dataSrc = imgElement.getAttribute("data-src");
            imageSrc = dataSrc ? dataSrc : imgElement.src;

            if (!imageSrc.startsWith("http")) {
              imageSrc = `${baseUrl}${imageSrc}`;
            }
          }

          return {
            title: item.querySelector("h2 a").innerText,
            link: fullLink,
            date: item.querySelector("small").innerText,
            imageSrc: imageSrc,
            imageAlt: imgElement ? imgElement.alt : "Image not available",
          };
        });

        setNewsItems(newsData);
      } catch (error) {
        console.error("Error fetching and parsing data", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched or error occurs
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = newsRef.current.indexOf(entry.target);
          if (index !== -1) {
            setVisibleItems((prevVisibleItems) => [
              ...prevVisibleItems,
              index,
            ]);
          }
        }
      });
    });

    newsRef.current.forEach((item) => observer.observe(item));

    return () => {
      newsRef.current.forEach((item) => observer.unobserve(item));
    };
  }, [newsItems]);

  return (
    <div style={{width:'100vw',height:'100vh' , display:'flex',justifyContent:'center',alignItems:'center'}}>

    
    <div
      className="news-container"
      style={{
        position: "absolute",
        top: `${topi}`,
        width: maxw ? maxw : "90vw", // Use maxw if provided, otherwise use 90vw
      }}
    >
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <>
          <h1
            style={{
              textAlign: "center",
              fontSize: "2.5em",
              background: "linear-gradient(to right, #28a745, #85e085)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              padding: "10px 20px",
              borderRadius: "8px",
              margin: "5vh",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "1px",
            }}
          >
            Recent Agricultural News
          </h1>

          {newsItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => (newsRef.current[index] = el)}
              className={`news-card ${
                visibleItems.includes(index)
                  ? index % 2 === 0
                    ? "slide-in-left"
                    : "slide-in-right"
                  : ""
              }`}
            >
              <div className="news-info">
                <h2>
                  <a
                    href={item.link}
                    className="news-title"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                </h2>
                <small className="news-date">{item.date}</small>
              </div>
              <div className="news-image">
                <a
                  href={item.link}
                  title={item.title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    height="130"
                    width="110"
                  />
                </a>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
    </div>
  );
};

export default ScrapeNews;

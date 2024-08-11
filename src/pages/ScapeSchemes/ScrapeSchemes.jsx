import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScrapeSchemes.css'; // Import the CSS file

const ScrapeSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const apiKey = '15ba7096556b11b6ec2883f057667497'; // Your ScraperAPI key
    const baseUrl = 'https://agriwelfare.gov.in/en/Major'; // Base URL of the site
    const url = `${baseUrl}/schemes`; // Full URL to be scraped

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://api.scraperapi.com?api_key=${apiKey}&url=${url}`);
                const htmlString = response.data;

                console.log(htmlString); // Check the HTML content

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const rows = Array.from(doc.querySelectorAll('tbody tr')); // Select all rows in the table

                const schemesData = rows.map(row => {
                    const columns = row.querySelectorAll('td');

                    if (columns.length < 4) {
                        console.log('Skipping row with insufficient columns:', columns);
                        return null; // Skip rows with less than expected columns
                    }

                    const name = columns[1]?.innerText || 'N/A'; // Scheme name
                    const date = columns[2]?.innerText || 'N/A'; // Date
                    const pdfLink = columns[3]?.querySelector('a[href$=".pdf"]')?.getAttribute('href') || '#'; // PDF link

                    const otherLinks = Array.from(columns[3].querySelectorAll('a')).filter(anchor => !anchor.href.endsWith('.pdf')).map(anchor => ({
                        href: anchor.getAttribute('href'),
                        text: anchor.innerText
                    }));

                    return {
                        name,
                        date,
                        pdfLink: pdfLink.startsWith('http') ? pdfLink : `${baseUrl}${pdfLink}`,
                        otherLinks
                    };
                }).filter(Boolean); // Filter out any null values

                setSchemes(schemesData);
            } catch (error) {
                console.error('Error fetching and parsing data', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched or error occurs
            }
        };

        fetchData();
    }, []);

    return (
        <div className="schemes-container">
            {loading ? (
                <div className="loading-indicator">Loading...</div>
            ) : (
                <>
                    <h1 style={{textAlign:'center'}}>Government Schemes For Farmers</h1>
                    {schemes.map((scheme, index) => (
                        <div key={index} className="scheme-item">
                            <h3>{scheme.name}</h3>
                            <p>Date: {scheme.date}</p>
                            {scheme.otherLinks.length > 0 && (
                                <div>
                                    {scheme.otherLinks.map((link, idx) => (
                                        <div key={idx}>
                                            <a
                                                href={link.href.startsWith('http') ? link.href : `${baseUrl}${link.href}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Click Here For More Details
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ScrapeSchemes;

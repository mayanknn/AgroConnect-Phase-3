import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScrapeCropRates = () => {
    const [tableData, setTableData] = useState([]);
    const apiKey = '15ba7096556b11b6ec2883f057667497'; // Your ScraperAPI key
    const url = 'https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2003184'; // URL to be scraped

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://api.scraperapi.com?api_key=${apiKey}&url=${url}`);
                const htmlString = response.data;
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                // Selecting all table rows
                const rows = Array.from(doc.querySelectorAll('table tr'));

                // Extracting data from rows and removing the last two columns
                const table = rows.map(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText.trim());
                    return cells.slice(0, -2); // Remove last two columns
                });

                setTableData(table.slice(0, 30)); // Limit to first 30 rows
            } catch (error) {
                console.error('Error fetching and parsing data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{  fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', position: 'absolute', top: '20vh', width: '70%', overflow: 'scroll', height: '90vh' }}>
            <h2 style={{ textAlign: 'center', color: '#333', fontWeight: '700', marginBottom: '20px' }}>Crop Market Rates</h2>
            <table width="100%" style={{
                borderCollapse: 'collapse',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                overflow: 'hidden',
                borderRadius: '10px',
            }}>
                <thead>
                    <tr>
                        {tableData[0] && tableData[0].map((header, index) => (
                            <th key={index} style={{
                                padding: '10px',
                                backgroundColor: '#007f4f',
                                color: '#fff',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #005735',
                            }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} style={{
                            borderBottom: '1px solid #ddd',
                            backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : '#fff',
                            transition: 'background-color 0.3s ease',
                        }}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={{
                                    padding: '10px',
                                    color: '#555',
                                }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScrapeCropRates;

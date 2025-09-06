import React, { useState, useEffect } from "react";
import "./App.css"

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch using async/await
  const fetchDataAsync = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCoins(data);
      setFilteredCoins(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch using .then
  const fetchDataThen = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
        setFilteredCoins(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  // Initially fetch data
  useEffect(() => {
    fetchDataAsync();
    // Or use fetchDataThen() to test .then
  }, []);

  // Handle search
  const handleSearch = () => {
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  // Handle sort by market cap
  const sortByMarketCap = () => {
    const sorted = [...filteredCoins].sort((a, b) => b.market_cap - a.market_cap);
    setFilteredCoins(sorted);
  };

  // Handle sort by 24h price change percentage
  const sortByChange = () => {
    const sorted = [...filteredCoins].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    setFilteredCoins(sorted);
  };

  return (
    <div className="dashboard">
  <h1>Crypto Dashboard</h1>
  <div className="controls">
    <input
      type="text"
      placeholder="Search by name or symbol"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button onClick={sortByMarketCap}>Sort By Mkt Cap</button>
    <button onClick={sortByChange}>Sort By 24h %</button>
  </div>

<table className="crypto-table">
    <thead>
      <tr>
        <th>Coin</th>
        <th>Symbol</th>
        <th>Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
      </tr>
    </thead>
    <tbody>
      {filteredCoins.map((coin) => (
        <tr key={coin.id}>
          <td className="coin-info">
            <img src={coin.image} alt={coin.name} />
            <span>{coin.name}</span>
          </td>
          <td>{coin.symbol.toUpperCase()}</td>
          <td>${coin.current_price.toLocaleString()}</td>
          <td>${coin.market_cap.toLocaleString()}</td>
          <td className={coin.price_change_percentage_24h > 0 ? "green" : "red"}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default App;
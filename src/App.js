import "./App.css";
import React from "react";


let socket = new WebSocket("wss://api.exchange.bitcoin.com/api/2/ws");

function App() {
  const [state, setstate] = React.useState({});
  const [last, setLast] = React.useState(null)
  const [low, setLow] = React.useState(null)
  const [high, setHigh] = React.useState(null)


  const ID_LIST = "list";
  const TICKER = "ticker";
  let red = "#fa4d4d";
  let green = "#4ef28f";

  socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.method === TICKER) {
      let symbol = data.params.symbol;

      let colorBid = state[symbol]
        ? Number(state[symbol].bid) < Number(data.params.bid)
          ? green
          : red
        : "";
      let colorAsk = state[symbol]
        ? Number(state[symbol].ask) < Number(data.params.ask)
          ? green
          : red
        : "";
      let params = data.params;

      setstate({
        ...state,
        [symbol]: { ...params, colorBid: colorBid, colorAsk: colorAsk },
      });
    } else {
      if (data.id === ID_LIST) {
        data.result.forEach((pair) => {
          socket.send(
            `{"method": "subscribeTicker","params":{"symbol":"${pair.id}"},"id":"${pair.id}"}}`
          );
        });
      }
    }
  };
  
  socket.onopen = () => {
    socket.send(`{"method" : "getSymbols", "id": "list"}`);
  };

  let arrValutes = Object.values(state);

  const lastChange = () => {
    setLast(!last)
    setHigh(null)
    setLow(null)
  }
  // const lowChange = () => {
  //   setLow(!low)
  //   setLast(null)
  //   setHigh(null)
  // }
  // const highChange = () => {
  //   setHigh(!high)
  //   setLow(null)
  //   setLast(null)
  // }

  if(last) {
    arrValutes = arrValutes.sort((prev, next) => prev.last - next.last);
  }
  if(!last) {
    arrValutes = arrValutes.sort((prev, next) => next.last - prev.last);
  }
  // if(low) {
  //   arrValutes = arrValutes.sort((prev, next) => prev.low - next.low);
  // }
  // if(!low) {
  //   arrValutes = arrValutes.sort((prev, next) => next.low - prev.low);
  // }
  // if(high) {
  //   arrValutes = arrValutes.sort((prev, next) => prev.high - next.high);
  // }
  // if(!high) {
  //   arrValutes = arrValutes.sort((prev, next) => next.high - prev.high);
  // }

 

  return (
    <div className="App">
      <div className="Tablet">
        <table>
          <tr className="tableTitle">
            <td>Ticker</td>
            <td>Bid</td>
            <td>Ask</td>
            <td>High</td>
            <td>Low</td>
            <td onClick={lastChange}>Last</td>
          </tr>
        </table>
        <hr />
        {arrValutes.map((item) => (
          <table key={item.symbol}>
            <tr className="table">
              <td>{item.symbol}</td>
              <td
                className="transition"
                style={{ background: item.colorBid ? item.colorBid : "" }}
              >
                {item.bid}
              </td>
              <td
                className="transition"
                style={{ background: item.colorAsk ? item.colorAsk : "" }}
              >
                {item.ask}
              </td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.last}</td>
            </tr>
          </table>
        ))}
      </div>
    </div>
  );
}

export default App;

import React from 'react'

let socket = new WebSocket("wss://api.exchange.bitcoin.com/api/2/ws");


function Tablet(props) {
    const [valutesTricker, setValutesTricker] = React.useState([])
    
    let arrCountryValutes = []

    
    socket.onmessage = function(event) {
        setValutesTricker(JSON.parse(event.data));
    };
    
    socket.onopen = function(e) {
        props.valutes.result && props.valutes.result.forEach(element => {
                socket.send(`{"method": "subscribeTicker", "params": {"symbol": "${element.id}"} , "id": "${element.id}"}`);
            });
        
    };
    arrCountryValutes.push(valutesTricker)
    console.log(arrCountryValutes)

    return (
        <div>
            hello
        </div>
    )
}

export default Tablet

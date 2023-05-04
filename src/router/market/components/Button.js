import axios from "axios";

export function entireSearch({setMarketInfoList}) {
    const callMarket = async() => {
        await axios.post("http://localhost:3000/market", null, { params: { pages }}) // 처음에는 4줄
        .then((response) => {
            if(response.status === 200){

                let marketInfo = response.data.marketInfoList;
                let imageInfo = response.data.imageList;
                console.log("마켓정보 >> ", marketInfo);
                console.log("이미지정보 >> ",imageInfo);
                let addMarketInfoList = wrapperTo2Arrays(marketInfo, imageInfo);
                setMarketInfoList([...addMarketInfoList]);
            }
        })
    }
    return <button onClick={callMarket}>전체</button>
}
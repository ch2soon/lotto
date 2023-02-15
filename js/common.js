const getLottoFlag = false;
let NegativeNumber = [];
let lottoList = [];
if(getLottoFlag) {
    let drwNo = 1000;
    const url = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo="+drwNo;
    const getData = (url) => fetch(url);
    getData(url).then(resp => {
        const respJson = resp.json();
        // console.log("resp", resp, respJson);
        return respJson;
    }).then(data => {
        if(data.returnValue == "success") {
            console.log("data", data);
        } else {
            console.log("data error");
        }
    }).catch(excResp => {
        console.log("catch", excResp);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    negativeNumberExt();
    document.querySelector(".extraction_btn").addEventListener('click', function() {
        lottoList = [];
        lottoExt();
    });
})
// 제외수 추출 로직 작성
const negativeNumberExt = () => {
    // NegativeNumber.push(1,2);          // 추출된 제외수 배열로 등록
}
const lottoExt = () => {
    let cnt = parseInt(document.querySelector(".extraction_cnt").value);
    for(z=0; z<cnt; z++) {
        let lotto = [];
        while(lotto.length < 6) {
            let num = Math.floor(Math.random() * 45) + 1;
            if(lotto.indexOf(num) < 0 && NegativeNumber.indexOf(num) < 0) {
                lotto.push(num);
            }
        }
        lotto.sort(function(a,b) {
            return a - b;
        });
        lottoList.push(lotto);
    }
    let lottoStr = '';
    if(lottoList.length > 0) {
        lottoStr += '<ul>';
        lottoList.forEach((data) => {
            lottoStr += '<li>'+data+'</li>';
        });
        lottoStr += '</ul>';
    }
    document.querySelector(".extraction_area").innerHTML = lottoStr;
}
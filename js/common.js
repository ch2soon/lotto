const getLottoFlag = false;
let NegativeNumber = [];
let NegativeManualNumber = [];
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
    negativeNumberExt();            // 추출 제외수 초기화
    NegativeManualNumberExt();      // 메뉴얼 제외수 초기화
    document.querySelector(".negative_manual").addEventListener('keyup', function() {
        NegativeManualNumberExt();
    });
    document.querySelector(".extraction_btn").addEventListener('click', function() {
        lottoList = [];
        lottoExt();
    });
});
const negativeNumberExt = () => {
    // NegativeNumber.push(1,2);          // 추출된 제외수 배열로 등록
}
const NegativeManualNumberExt = () => {    
    NegativeManualNumber = [];
    let tnn = document.querySelector(".negative_manual").value.trim();
    if(tnn !== "") {
        let nn = tnn.split(",");
        if(nn.length > 10) {
            alert("제외수는 10건까지 등록할 수 있습니다.");
            document.querySelector(".negative_manual").value = document.querySelector(".negative_manual").value.slice(0, -1);
        } else {
            nn.forEach((data) => {
                if(data.trim() !== "" && parseInt(data) <= 45) NegativeManualNumber.push(parseInt(data));
            });
        }
    }
}
const lottoExt = () => {
    let cnt = parseInt(document.querySelector(".extraction_cnt").value);
    for(z=0; z<cnt; z++) {
        let lotto = [];
        // console.log(NegativeManualNumber);
        // console.log(NegativeNumber);
        while(lotto.length < 6) {
            let num = Math.floor(Math.random() * 45) + 1;
            if(lotto.indexOf(num) < 0 && NegativeNumber.indexOf(num) < 0 && NegativeManualNumber.indexOf(num) < 0) {
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
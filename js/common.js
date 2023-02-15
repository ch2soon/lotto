const getLottoNumber = false;
let lottoList = [];
if(getLottoNumber) {
    const url = "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=100";
    const getData = (url) => {
        return fetch(url);
    };
    getData(url).then(data => data.json()).then(result => console.log(result));
    // $.ajax({
    //     type : "get",
    //     url : "https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=100",
    //     success : function(res){
    //         console.log(res);
    //     },
    //     error : function(XMLHttpRequest, textStatus, errorThrown) {
    //         console.log("error : " + textStatus)
    //     }
    // });
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector(".extraction_btn").addEventListener('click', function() {
        lottoList = [];
        lottoExt();
    });
})
const lottoExt = () => {
    let cnt = parseInt(document.querySelector(".extraction_cnt").value);
    for(z=0; z<cnt; z++) {
        let lotto = [];
        for(let i=0; i<6; i++) {
            let num = Math.floor(Math.random() * 44) + 1;
            for(let j of lotto) {
                while(num == lotto[j]) {
                    num = Math.floor(Math.random() * 44) + 1;
                }
            }
            lotto.push(num);
        }
        lotto.sort(function(a,b) {
            return a - b;
        });
        lottoList.push(lotto);
    }
    let lottoStr = '';
    if(lottoList.length > 0) {
        lottoStr += '<ul>';
        lottoList.forEach((data, index) => {
            lottoStr += '<li>'+data+'</li>';
        });
        lottoStr += '</ul>';
    }
    document.querySelector(".extraction_area").innerHTML = lottoStr;
}
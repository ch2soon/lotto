let lottoArr = [];
let lottoList = [];
let NegativeNumber = [];
let NegativeManualNumber = [];
document.addEventListener('DOMContentLoaded', () => {
    const getLottoFlag = false;             // Lotto API 실행여부
    readTextFile("/data/lottoList.txt");    // lottoArr 배열에 txt파일내용 치환(txt형식 - no1|no2|no3|no4|no5|no6|추첨일|보너스no|회차)
    if(getLottoFlag) {
        let drwNo = 4;
        getAPILottoNumber(drwNo);
    }
    negativeNumberExt();            // 추출 제외수 초기화
    NegativeManualNumberExt();      // 메뉴얼 제외수 초기화
    document.querySelector('.negative_manual').addEventListener('keyup', function() {
        NegativeManualNumberExt();
    });
    document.querySelector('.extraction_btn').addEventListener('click', function() {
        lottoList = [];
        lottoExt();
    });
});
const negativeNumberExt = () => {
    // NegativeNumber.push(1,2);          // 추출된 제외수 배열로 등록
}
const NegativeManualNumberExt = () => {    
    NegativeManualNumber = [];
    let tnn = document.querySelector('.negative_manual').value.trim();
    if(!isCommaNumber(tnn)) negativeManualRollback();
    if(tnn !== '') {
        let nn = tnn.split(',');
        if(nn.length > 10) {
            alert('제외수는 10건까지 등록할 수 있습니다.');
            negativeManualRollback();
        } else {
            nn.forEach((data) => {
                if(data.trim() !== '' && parseInt(data) <= 45) NegativeManualNumber.push(parseInt(data));
            });
        }
    }
}
const negativeManualRollback = () => {
    return document.querySelector('.negative_manual').value = document.querySelector('.negative_manual').value.slice(0, -1);
}
const lottoExt = () => {
    let cnt = parseInt(document.querySelector('.extraction_cnt').value);
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
    document.querySelector('.extraction_area').innerHTML = lottoStr;
}
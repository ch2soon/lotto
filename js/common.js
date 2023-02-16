const decimalArr = [2,3,5,7,11,13,17,19,23,29,31,37,41,43];     // 4개초과 출현 안함
const compositeNumberArr = [1,4,8,10,14,16,20,22,25,26,28,32,34,35,38,40,44];       // 4개초과 출현 안함
const sosabhap = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45];       // 1~3개 포함
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
                (data.trim() !== '' && parseInt(data) <= 45 ? NegativeManualNumber.push(parseInt(data)) : null);
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
            (lotto.indexOf(num) < 0 && NegativeNumber.indexOf(num) < 0 && NegativeManualNumber.indexOf(num) < 0 ? lotto.push(num) : null);
        }
        lotto.sort(function(a,b) {
            return a - b;
        });
        lottoList.push(lotto);
    }
    let lottoStr = '';
    if(lottoList.length > 0) {
        lottoStr += '<ul>';
        lottoList.forEach((res) => {
            console.log(res);
            let data = '';
            res.forEach((tnum, tidx) => {                
                let suType = '';
                if(decimalArr.indexOf(tnum) > -1) suType = 'dec';
                if(compositeNumberArr.indexOf(tnum) > -1) suType = 'com';
                if(sosabhap.indexOf(tnum) > -1) suType = 'sos';
                // data += (tidx > 0 ? ',' : '');
                data += '<span';
                if(suType.trim() != '') data += ' class="'+suType+'"';
                data += '>'+tnum+'</span>';
            });
            lottoStr += '<li>'+data+'</li>';
        });
        lottoStr += '</ul>';
    }
    document.querySelector('.extraction_area').innerHTML = lottoStr;
}
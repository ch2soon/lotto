const decimalArr = [2,3,5,7,11,13,17,19,23,29,31,37,41,43];     // 4개초과 출현 안함
const compositeNumberArr = [1,4,8,10,14,16,20,22,25,26,28,32,34,35,38,40,44];       // 4개초과 출현 안함
const sosabhap = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45];       // 1~3개 포함
let lottoArr = [];
let lottoList = [];
let NegativeNumber = [];
let NegativeManualNumber = [];
document.addEventListener('DOMContentLoaded', () => {
    const isGetLocalLotto = false;          // data/저장된 로또번호 읽어오기 여부
    (isGetLocalLotto) ? readTextFile("/data/lottoList.txt") : null;    // lottoArr 배열에 txt파일내용 치환(txt형식 - no1|no2|no3|no4|no5|no6|추첨일|보너스no|회차)
    negativeNumberExt();            // 추출 제외수 초기화
    NegativeManualNumberExt();      // 메뉴얼 제외수 초기화
    document.querySelector('.negative_manual').addEventListener('keyup', () => {
        NegativeManualNumberExt();
    });
    document.querySelector('.extraction_btn').addEventListener('click', () => {
        lottoList = [];
        lottoExt();
    });
    const getApiModal = document.getElementById('getApiModal');
    getApiModal.addEventListener('show.bs.modal', () => {
        const modalBody = getApiModal.querySelectorAll('.modal-body tbody')[0];
        mbStr = '<tr><td colspan="4" style="text-align:center;">확인 할 회차번호를 입력 후 전송버튼을 클릭하세요.</td></tr>';
        modalBody.innerHTML = mbStr;
    });
    const drwNo = document.querySelector('.drwNo');
    drwNo.addEventListener('keyup', () => {
        let tnn = drwNo.value.trim();
        (!isNumber(tnn)) ? drwNo.value = drwNo.value.slice(0, -1) : null;
    });
    document.querySelector('.getNumber').addEventListener('click', () => {
        let drwNo = document.querySelector('.drwNo').value.trim();
        (drwNo === '') ? alert('확인 할 회차번호를 입력해 주세요.') : getAPILottoNumber(drwNo);
    });
});
const negativeNumberExt = () => {
    // NegativeNumber.push(1,2);          // 추출된 제외수 배열로 등록
}
const NegativeManualNumberExt = () => {    
    NegativeManualNumber = [];
    let tnn = document.querySelector('.negative_manual').value.trim();
    (!isCommaNumber(tnn)) ? negativeManualRollback() : null;
    if(tnn !== '') {
        let nn = tnn.split(',');
        if(nn.length > 10) {
            alert('제외수는 10건까지 등록할 수 있습니다.');
            negativeManualRollback();
        } else {
            nn.forEach((data) => {
                (data.trim() !== '' && parseInt(data) <= 45) ? NegativeManualNumber.push(parseInt(data)) : null;
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
            (lotto.indexOf(num) < 0 && NegativeNumber.indexOf(num) < 0 && NegativeManualNumber.indexOf(num) < 0) ? lotto.push(num) : null;
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
            let data = '';
            res.forEach((tnum, tidx) => {                
                let suType = '';
                (decimalArr.indexOf(tnum) > -1) ? suType = 'dec' : null;
                (compositeNumberArr.indexOf(tnum) > -1) ? suType = 'com' : null;
                (sosabhap.indexOf(tnum) > -1) ? suType = 'sos' : null;
                // data += (tidx > 0 ? ',' : '');
                data += '<span';
                (suType.trim() != '') ? data += ' class="'+suType+'"' : null;
                data += '>'+tnum+'</span>';
            });
            lottoStr += '<li>'+data+'</li>';
        });
        lottoStr += '</ul>';
    }
    document.querySelector('.extraction_area').innerHTML = lottoStr;
}
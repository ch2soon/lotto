const decimalArr = [2,3,5,7,11,13,17,19,23,29,31,37,41,43];
const compositeNumberArr = [1,4,8,10,14,16,20,22,25,26,28,32,34,35,38,40,44];
const sosabhap = [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45];
const pass = 'MTIzNA==';
const lottoListFilePath = 'L2RhdGEvbG90dG9MaXN0LnR4dA==';
let lottoArr = [];
let lottoList = [];
let negativeNumber = [];
let negativeManualNumber = [];
let includeManualNumber = [];
document.addEventListener('DOMContentLoaded', () => {
    const isGetLocalLotto = true;          // data/저장된 로또번호 읽어오기 여부
    (isGetLocalLotto) ? readTextFile(atob(lottoListFilePath), 10) : null;
    const extCount = document.querySelectorAll('.ext-count');
    extCount.forEach((data) => {
        data.addEventListener('click', () => {
            const extCountCheckVal = document.querySelector('.ext-count:checked').value;
            readTextFile(atob(lottoListFilePath), parseInt(extCountCheckVal));
        });
    });
    negativeManualNumberExt();      // 메뉴얼 제외수 초기화
    includeManualNumberExt();      // 메뉴얼 포함수 초기화
    document.querySelector('.negative_manual').addEventListener('keyup', () => {
        negativeManualNumberExt();
    });
    document.querySelector('.include_manual').addEventListener('keyup', () => {
        includeManualNumberExt();
    });
    document.querySelector('.extraction_btn').addEventListener('click', () => {
        lottoList = [];
        lottoExt();
    });
    let myModal = new bootstrap.Modal(document.getElementById('getApiModal'), {
        backdrop: "static",
        keyboard: false,
        focus : false
    });
    document.querySelector('.getAPILottoNumber').addEventListener('click', () => {
        const modalBody = getApiModal.querySelectorAll('.modal-body tbody')[0];
        let input = prompt('비밀번호', '비밀번호를 입력해주세요!');
        let flag = true;
        let msg = ''
        isNaN(input) ? (
            flag = false,
            msg = '정상적인 비밀번호를 입력해주세요.'
        ) : (
            btoa(input) === pass ? (
                document.querySelector('.drwNo').value = '',
                mbStr = '<tr><td colspan="4" style="text-align:center;">확인 할 회차번호를 입력 후 전송버튼을 클릭하세요.</td></tr>',
                modalBody.innerHTML = mbStr,
                myModal.show()
            ) : (
                flag = false,
                msg = (input === null) ? '비밀번호 입력이 취소되었습니다.' : '잘못된 비밀번호입니다.'
            )
        );
        !flag ? (
            alert(msg),
            myModal.hide()
        ) : null;
    });
    const numberInfoModal = document.getElementById('numberInfoModal');
    numberInfoModal.addEventListener('show.bs.modal', (e) => {
        let type = e.relatedTarget.getAttribute('data-type');
        const modalSizeClass = document.querySelector('#numberInfoModal .modal-dialog');
        type === 'setNum' ? (
            modalSizeClass.classList.remove('modal-md'),
            modalSizeClass.classList.add('modal-lg')
        ) : (
            modalSizeClass.classList.remove('modal-lg'),
            modalSizeClass.classList.add('modal-md')
        );
        let str = '';
        let titleStr = '';
        let titleStrs = '';
        let dataNum = '';
        (type === 'getNum' || type === 'setNum') ? (
            type === 'setNum' ? (
                titleStr = '최근 출현회차',
                dataNum = e.relatedTarget.getAttribute('data-set-num'),
                mode = 'set'
            ) : type === 'getNum' ? (
                titleStr = '당첨번호',
                dataNum = e.relatedTarget.getAttribute('data-get-num'),
                mode = 'get'
            ) : '',
            titleStrs = titleStr + ' 정보',
            str = setDataNum(mode, dataNum, titleStr)
        ) : (
            type === 'dec' ? (
                titleStrs = '소수',
                str = '<p><4개초과 출현할 확률 낮음></p>',
                str += '<p>'+decimalArr.toString()+'</p>'
            ) : type === 'com' ? (
                titleStrs = '반복수',
                str = '<p><4개초과 출현할 확률 낮음></p>',
                str += '<p>'+compositeNumberArr.toString()+'</p>'
            ) : type === 'sos' ? (
                titleStrs = '3의 배수',
                str = '<p><1~3개 포함 추천></p>',
                str += '<p>'+sosabhap.toString()+'</p>'
            ) : '',
            titleStrs += ' 목록'
        );
        const numberInfoTitle = document.querySelectorAll('#numberInfoModal .modal-title')[0];
        numberInfoTitle.innerText = titleStrs;
        const numberInfoBody = document.querySelectorAll('#numberInfoModal .modal-body')[0];
        numberInfoBody.innerHTML = str;
    });
    const drwNo = document.querySelector('.drwNo');
    drwNo.addEventListener('keyup', (e) => {
        if(e.keyCode === 13) document.querySelector('.getNumber').click();
        let tnn = drwNo.value.trim();
        (!isNumber(tnn)) ? drwNo.value = drwNo.value.slice(0, -1) : null;
    });
    document.querySelector('.getNumber').addEventListener('click', () => {
        let drwNo = document.querySelector('.drwNo').value.trim();
        (drwNo === '') ? alert('확인 할 회차번호를 입력해 주세요.') : getAPILottoNumber(drwNo);
    });
    const toggleButton = document.querySelector('.toggle_button');
    const toggleOption = document.querySelector('.toggle_option');
    toggleButton.addEventListener('click', () => {
        toggleOption.getAttribute('class').indexOf('show') > -1 ? (
            toggleOption.classList.remove('show'),
            toggleOption.classList.add('hide'),
            toggleButton.classList.remove('bi-chevron-double-up'),
            toggleButton.classList.add('bi-chevron-double-down')
        ) : (
            toggleOption.classList.remove('hide'),
            toggleOption.classList.add('show'),
            toggleButton.classList.remove('bi-chevron-double-down'),
            toggleButton.classList.add('bi-chevron-double-up')
        );
    });
    const resets = document.querySelectorAll('.reset');
    resets.forEach( (data) => data.addEventListener('click', () => {
        let inputName = data.getAttribute("data-input-name");
        inputName === 'include_manual' ? includeManualNumber = [] : null;
        inputName === 'negative_manual' ? negativeManualNumber = [] : null;
        document.querySelector('.'+inputName).value = '';
    }));
});
/**
 * 사용자 제외수 - 설정값이 나오면 번호 재추출
 */
const negativeManualNumberExt = () => {    
    negativeManualNumber = [];
    let tnn = document.querySelector('.negative_manual').value.trim();
    (!isCommaNumber(tnn)) ? negativeManualRollback() : null;
    if(tnn !== '') {
        let nn = tnn.split(',');
        nn.length > 20 ? (
            alert('제외수는 20건까지 등록할 수 있습니다.'),
            negativeManualRollback()
        ) : (
            nn.forEach((data) => {
                (data.trim() !== '' && parseInt(data) <= 45) ? negativeManualNumber.push(parseInt(data)) : null;
            })
        );
    }
}
/**
 * 포함수 - 로또번호 전체 배열에 포함수 강제 추가
 */
const includeManualNumberExt = () => {    
    includeManualNumber = [];
    let tnn = document.querySelector('.include_manual').value.trim();
    (!isCommaNumber(tnn)) ? includeManualRollback() : null;
    if(tnn !== '') {
        let nn = tnn.split(',');
        nn.forEach((data) => {
            (data.trim() !== '' && parseInt(data) <= 45) ? includeManualNumber.push(parseInt(data)) : null;
        });
    }
}
const negativeManualRollback = () => {
    return document.querySelector('.negative_manual').value = document.querySelector('.negative_manual').value.slice(0, -1);
}
const includeManualRollback = () => {
    return document.querySelector('.include_manual').value = document.querySelector('.include_manual').value.slice(0, -1);
}
/**
 * 로또번호 추출
 */
const lottoExt = () => {
    let cnt = parseInt(document.querySelector('.extraction_cnt').value);
    for(z=0; z<cnt; z++) {
        let lotto = [];
        let incLotto = [];
        // 고정수가 6건 미만이면 lotto배열에 복사, 6건보다 많으면 고정수중 랜덤으로 6건 뽑아 출력
        includeManualNumber.length > 0 ? includeManualNumber.length <= 6 ? lotto = [...includeManualNumber] : lotto = setRandomNumber('inc', incLotto) : null;
        // 고정수가 6건 미만일때 1~45중 랜덤수 뽑아 lotto배열에 저장
        includeManualNumber.length <= 6 ? lotto = setRandomNumber('def', lotto) : null;
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
            let attrData = '';
            res.forEach((tnum,index) => {                
                let suType = '';
                (decimalArr.indexOf(tnum) > -1) ? suType = 'dec' : null;
                (compositeNumberArr.indexOf(tnum) > -1) ? suType = 'com' : null;
                (sosabhap.indexOf(tnum) > -1) ? suType = 'sos' : null;
                data += '<span';
                (suType.trim() != '') ? data += ' class="'+suType+'"' : null;
                data += '>'+tnum+'</span>';
                (index > 0) ? attrData += ',' : '';
                attrData += tnum;
            });
            lottoStr += '<li class="cp" data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="setNum" data-set-num="'+attrData+'">'+data+'</li>';
        });
        lottoStr += '</ul>';
    }
    lottoStr += '<div class="number-color-info">';
    lottoStr += '<ul>';
    lottoStr += '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="dec"><i class="bi bi-circle-fill" style="color:#ca520c;"></i> 소수</li>';
    lottoStr += '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="com"><i class="bi bi-circle-fill" style="color:#9d3eaa;"></i> 반복수</li>';
    lottoStr += '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="sos"><i class="bi bi-circle-fill" style="color:#439cbe;"></i> 3의 배수</li>';
    lottoStr += '</ul>';
    lottoStr += '</div>';
    document.querySelector('.extraction_area').innerHTML = lottoStr;
}
/**
 * 고정수/랜덤 뽑기 함수화
 * @param {고정수/랜덤} mode 
 * @param {array} arr 
 * @returns 
 */
const setRandomNumber = (mode, arr) => {
    while(arr.length < 6) {
        let num = 0;
        mode === 'inc' ? (
            num = includeManualNumber[Math.floor(Math.random() * includeManualNumber.length)],
            (arr.indexOf(num) < 0) ? arr.push(num) : null
        ) : (
            num = Math.floor(Math.random() * 45) + 1,
            (arr.indexOf(num) < 0 && negativeNumber.indexOf(num) < 0 && negativeManualNumber.indexOf(num) < 0) ? arr.push(num) : null
        );
    }
    return arr;
}
/**
 * 지난 당첨번호/추출번호의 정보를 레이어에 출력
 * @param {당첨/추출 여부} mode 
 * @param {해당 번호} data 
 * @param {레이어 타이틀} title 
 * @returns String
 */
const setDataNum = (mode, data, title='번호') => {
    let viewCnt = parseInt(document.querySelector('.ext-count:checked').value);
    let checkDataArr = lottoArr.slice(0,viewCnt);
    let str = '';
    let decimalArrText = [];
    let compositeNumberArrText = [];
    let sosabhapText = [];
    let checkRoundArr = [];
    let checkRoundObj = {};
    let tempData = data.split(',');
    if(tempData.length > 0) {
        tempData.forEach((res,index) => {
            checkRoundObj = { no:tempData[index], round:null }
            decimalArr.indexOf(parseInt(res)) > -1 ? decimalArrText.push(res) : null;
            compositeNumberArr.indexOf(parseInt(res)) > -1 ? compositeNumberArrText.push(res) : null;
            sosabhap.indexOf(parseInt(res)) > -1 ? sosabhapText.push(res) : null;
            let chkSetData = '';
            checkDataArr.forEach((chkData) => {
                let checkTempArr = [chkData.round.toString(), chkData.no1.toString(), chkData.no2.toString(), chkData.no3.toString(), chkData.no4.toString(), chkData.no5.toString(), chkData.no6.toString()];                
                if(checkTempArr.indexOf(res.toString()) > -1) {
                    chkSetData.trim() !== '' ? chkSetData = chkSetData+',' : null;
                    chkSetData = chkSetData + checkTempArr[0];
                }
            });
            checkRoundObj.round = chkSetData;
            checkRoundArr.push(checkRoundObj);
        });
    }
    str += '<div class="row">';
    str += '<div class="col-sm-6">';
    str += '<div class="card">';
    str += '<div class="card-body">';
    str += '<h5 class="card-title">'+title+'</h5>';
    str += '<p class="card-text">';
    str += data;
    str += '</p>';
    str += '</div>';
    if(mode === 'set') {
        str += '<ul class="list-group list-group-flush">';
        checkRoundArr.forEach((getData) => {
            str += '<li class="list-group-item">';
            str += '<div>'+getData.no+'</div> : ';
            str += '<span>';
            str += getData.round.trim() === '' ? '-' : getData.round;
            str += '</span>';
            str += '</li>';
        });
        str += '</ul>';
    }
    str += '</div>';
    str += '</div>';
    str += '<div class="col-sm-6">';
    str += '<div class="card">';
    str += '<div class="card-body">';
    str += '<h5 class="card-title">참고수 정보</h5>';
    str += '<p class="card-text">';
    decimalArrText.length > 0 ? str += '소수('+decimalArrText.length+') : ' + decimalArrText.toString() + '<br>' : null;
    compositeNumberArrText.length > 0 ? str += '반복수('+compositeNumberArrText.length+') : ' + compositeNumberArrText.toString() + '<br>' : null;
    sosabhapText.length > 0 ? str += '3의 배수('+sosabhapText.length+') : ' + sosabhapText.toString() : null;
    str += '</p>';
    str += '</div>';
    str += '</div>';
    str += '</div>';
    str += '</div>';
    return str;
}
const decimalArr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
const compositeNumberArr = [1, 4, 8, 10, 14, 16, 20, 22, 25, 26, 28, 32, 34, 35, 38, 40, 44];
const sosabhap = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45];
const sos5abhap = [5, 10, 15, 20, 25, 30, 35, 40, 45];
const pass = 'MTIzNA==';
const lottoArr = readTextFile(atob('L2RhdGEvbG90dG9MaXN0LnR4dA=='));
let lottoList = [];
let negativeNumber = [];
let negativeManualNumber = [];
let includeManualNumber = [];
document.addEventListener('DOMContentLoaded', () => {
    drawNoteTemplateFile();
    drawTextFile();
    draw26WeekNumber();
    const extCount = document.querySelectorAll('.ext-count');
    extCount.forEach(data => {
        data.addEventListener('click', () => {
            const extCountCheckVal = document.querySelector('.ext-count:checked').value;
            drawTextFile(parseInt(extCountCheckVal));
        });
    });
    negativeManualNumberExt(); // 메뉴얼 제외수 초기화
    includeManualNumberExt(); // 메뉴얼 포함수 초기화
    document.querySelector('.negative-manual').addEventListener('keyup', () => {
        negativeManualNumberExt();
    });
    document.querySelector('.include-manual').addEventListener('keyup', () => {
        includeManualNumberExt();
    });
    document.querySelector('.extraction-btn').addEventListener('click', () => {
        lottoList = [];
        lottoExt();
    });
    let myModal = new bootstrap.Modal(document.getElementById('getApiModal'), {
        backdrop: 'static',
        keyboard: false,
        focus: false
    });
    document.querySelector('.getAPILottoNumber').addEventListener('click', () => {
        const modalBody = getApiModal.querySelectorAll('.modal-body tbody')[0];
        let input = prompt('비밀번호', '비밀번호를 입력해주세요!');
        let flag = true;
        let msg = '';
        isNaN(input)
            ? ((flag = false), (msg = '정상적인 비밀번호를 입력해주세요.'))
            : btoa(input) === pass
            ? ((document.querySelector('.drwNo').value = ''),
              (mbStr = '<tr><td colspan="4" style="text-align:center;">확인 할 회차번호를 입력 후 전송버튼을 클릭하세요.</td></tr>'),
              (modalBody.innerHTML = mbStr),
              myModal.show())
            : ((flag = false), (msg = input === null ? '비밀번호 입력이 취소되었습니다.' : '잘못된 비밀번호입니다.'));
        !flag ? (alert(msg), myModal.hide()) : null;
    });
    const numberInfoModal = document.getElementById('numberInfoModal');
    numberInfoModal.addEventListener('show.bs.modal', e => {
        let type = e.relatedTarget.getAttribute('data-type');
        const modalSizeClass = document.querySelector('#numberInfoModal .modal-dialog');
        type === 'setNum' || type === 'getNum'
            ? (modalSizeClass.classList.remove('modal-md'), modalSizeClass.classList.add('modal-lg'))
            : (modalSizeClass.classList.remove('modal-lg'), modalSizeClass.classList.add('modal-md'));
        let str = '';
        let titleStr = '';
        let titleStrs = '';
        let dataNum = '';
        let dataRound = null;
        type === 'getNum' || type === 'setNum'
            ? (type === 'setNum'
                  ? ((titleStr = '최근 출현회차'), (dataNum = e.relatedTarget.getAttribute('data-set-num')), (mode = 'set'))
                  : type === 'getNum'
                  ? ((titleStr = '당첨번호'),
                    (dataNum = e.relatedTarget.getAttribute('data-get-num')),
                    (dataRound = e.relatedTarget.getAttribute('data-round')),
                    (mode = 'get'))
                  : '',
              (titleStrs = titleStr + ' 정보'),
              (str = setDataNum(mode, dataNum, titleStr, dataRound)))
            : (type === 'dec'
                  ? ((titleStrs = '소수'), (str = '<p><4개초과 출현할 확률 낮음></p>'), (str += '<p>' + decimalArr.toString() + '</p>'))
                  : type === 'com'
                  ? ((titleStrs = '반복수'),
                    (str = '<p><4개초과 출현할 확률 낮음></p>'),
                    (str += '<p>' + compositeNumberArr.toString() + '</p>'))
                  : type === 'sos'
                  ? ((titleStrs = '3의 배수'), (str = '<p><1~3개 포함 추천></p>'), (str += '<p>' + sosabhap.toString() + '</p>'))
                  : type === 'sos5'
                  ? ((titleStrs = '5의 배수'), (str = '<p><0~2개 포함 추천></p>'), (str += '<p>' + sos5abhap.toString() + '</p>'))
                  : '',
              (titleStrs += ' 목록'));
        const numberInfoTitle = document.querySelectorAll('#numberInfoModal .modal-title')[0];
        numberInfoTitle.innerText = titleStrs;
        const numberInfoBody = document.querySelectorAll('#numberInfoModal .modal-body')[0];
        numberInfoBody.innerHTML = str;
    });
    const drwNo = document.querySelector('.drwNo');
    drwNo.addEventListener('keyup', e => {
        if (e.keyCode === 13) document.querySelector('.getNumber').click();
        let tnn = drwNo.value.trim();
        !isNumber(tnn) ? (drwNo.value = drwNo.value.slice(0, -1)) : null;
    });
    document.querySelector('.getNumber').addEventListener('click', () => {
        let drwNo = document.querySelector('.drwNo').value.trim();
        drwNo === '' ? alert('확인 할 회차번호를 입력해 주세요.') : getAPILottoNumber(drwNo);
    });
    const toggleButton = document.querySelector('.toggle-button');
    const toggleOption = document.querySelector('.toggle-option');
    toggleButton.addEventListener('click', () => {
        toggleOption.getAttribute('class').indexOf('show') > -1
            ? (toggleOption.classList.remove('show'),
              toggleOption.classList.add('hide'),
              toggleButton.classList.remove('bi-chevron-double-up'),
              toggleButton.classList.add('bi-chevron-double-down'))
            : (toggleOption.classList.remove('hide'),
              toggleOption.classList.add('show'),
              toggleButton.classList.remove('bi-chevron-double-down'),
              toggleButton.classList.add('bi-chevron-double-up'));
    });
    const resets = document.querySelectorAll('.reset');
    resets.forEach(data =>
        data.addEventListener('click', () => {
            let inputName = data.getAttribute('data-input-name');
            inputName === 'include-manual' ? (includeManualNumber = []) : null;
            inputName === 'negative-manual' ? (negativeManualNumber = []) : null;
            document.querySelector('.' + inputName).value = '';
        })
    );
    const autoNegative = document.querySelector('.auto-negative');
    autoNegative.addEventListener('click', () => {
        let lastWinNumber = lottoArr[0];
        let recomNegativeNumber = recomNegativeNumberType1(lastWinNumber);
        document.querySelector('.negative-manual').value = recomNegativeNumber.toString();
        negativeManualNumberExt();
    });
});
/**
 * 사용자 제외수 - 설정값이 나오면 번호 재추출
 */
const negativeManualNumberExt = () => {
    negativeManualNumber = [];
    let tnn = document.querySelector('.negative-manual').value.trim();
    !isCommaNumber(tnn) ? negativeManualRollback() : null;
    if (tnn !== '') {
        let nn = tnn.split(',');
        nn.length > 20
            ? (alert('제외수는 20건까지 등록할 수 있습니다.'), negativeManualRollback())
            : nn.forEach(data => {
                  data.trim() !== '' && parseInt(data) <= 45 ? negativeManualNumber.push(parseInt(data)) : null;
              });
    }
};
/**
 * 포함수 - 로또번호 전체 배열에 포함수 강제 추가
 */
const includeManualNumberExt = () => {
    includeManualNumber = [];
    let tnn = document.querySelector('.include-manual').value.trim();
    !isCommaNumber(tnn) ? includeManualRollback() : null;
    if (tnn !== '') {
        let nn = tnn.split(',');
        nn.forEach(data => {
            data.trim() !== '' && parseInt(data) <= 45 ? includeManualNumber.push(parseInt(data)) : null;
        });
    }
};
const negativeManualRollback = () => {
    return (document.querySelector('.negative-manual').value = document.querySelector('.negative-manual').value.slice(0, -1));
};
const includeManualRollback = () => {
    return (document.querySelector('.include-manual').value = document.querySelector('.include-manual').value.slice(0, -1));
};
/**
 * 로또번호 추출
 */
const lottoExt = () => {
    let cnt = parseInt(document.querySelector('.extraction-cnt').value);
    let include_mode = document.querySelector('.include-manual-area > select').value.split("_");
    for (z = 0; z < cnt; z++) {
        let lotto = [];
        let incLotto = [];
        if(include_mode[0] === "or") {
            let extr_cnt = 0;
            typeof include_mode[1] === "undefined" || includeManualNumber.length <= parseInt(include_mode[1])
                ? extr_cnt = (Math.floor(Math.random() * includeManualNumber.length)) + 1
                : extr_cnt = parseInt(include_mode[1]);
            while (lotto.length < extr_cnt) {
                let num = includeManualNumber[Math.floor(Math.random() * includeManualNumber.length)];
                lotto.indexOf(num) < 0 ? lotto.push(num) : null;
            }
        } else {
            // 고정수가 6건 미만이면 lotto배열에 복사, 6건보다 많으면 고정수중 랜덤으로 6건 뽑아 출력
            includeManualNumber.length > 0
                ? includeManualNumber.length <= 6
                    ? (lotto = [...includeManualNumber])
                    : (lotto = setRandomNumber('inc', incLotto))
                : null;
            // 고정수가 6건 미만일때 1~45중 랜덤수 뽑아 lotto배열에 저장
        }
        lotto.length <= 6 ? (lotto = setRandomNumber('def', lotto)) : null;
        lotto.sort((a, b) => {
            return a - b;
        });
        lottoList.push(lotto);
    }
    let lottoStr = '';
    if (lottoList.length > 0) {
        lottoStr += '<ul>';
        lottoList.forEach(res => {
            let data = '';
            let attrData = '';
            let acArr = [];
            res.forEach((tnum, index) => {
                let suType = '';
                decimalArr.indexOf(tnum) > -1 ? (suType = 'dec') : null;
                compositeNumberArr.indexOf(tnum) > -1 ? (suType = 'com') : null;
                sosabhap.indexOf(tnum) > -1 ? (suType = 'sos') : null;
                sos5abhap.indexOf(tnum) > -1 ? (suType = 'sos5') : null;
                data += '<span';
                suType.trim() != '' ? (data += ' class="' + suType + '"') : null;
                data += '>' + tnum + '</span>';
                index > 0 ? (attrData += ',') : '';
                attrData += tnum;
                acArr.push(tnum);
            });
            lottoStr +=
                '<li class="cp" data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="setNum" data-set-num="' +
                attrData +
                '">' +
                data +
                '<span class="mw80 font08">(' +
                getACValue(acArr) +
                ',' +
                getLastNumSum(acArr) +
                ',' +
                getTotalSum(acArr) +
                ')</span>' +
                '</li>';
        });
        lottoStr += '</ul>';
    }
    lottoStr += '<div class="number-color-info">';
    lottoStr += '<ul>';
    lottoStr +=
        '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="dec"><i class="bi bi-circle-fill dec"></i> 소수</li>';
    lottoStr +=
        '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="com"><i class="bi bi-circle-fill com"></i> 반복수</li>';
    lottoStr +=
        '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="sos"><i class="bi bi-circle-fill sos"></i> 3의 배수</li>';
    lottoStr +=
        '<li data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="sos5"><i class="bi bi-circle-fill sos5"></i> 5의 배수</li>';
    lottoStr += '</ul>';
    lottoStr += '</div>';
    document.querySelector('.extraction-area').innerHTML = lottoStr;
};
/**
 * 고정수/랜덤 뽑기 함수화
 * @param {고정수/랜덤} mode
 * @param {array} arr
 * @returns array
 */
const setRandomNumber = (mode, arr) => {
    while (arr.length < 6) {
        let num = 0;
        mode === 'inc'
            ? ((num = includeManualNumber[Math.floor(Math.random() * includeManualNumber.length)]),
              arr.indexOf(num) < 0 ? arr.push(num) : null)
            : ((num = Math.floor(Math.random() * 45) + 1),
              arr.indexOf(num) < 0 && negativeNumber.indexOf(num) < 0 && negativeManualNumber.indexOf(num) < 0 ? arr.push(num) : null);
    }
    return arr;
};
/**
 * 1~45번중 26주간(약6개월) 번호별 당첨횟수 표시
 */
const draw26WeekNumber = () => {
    let count = 26;
    let week26Str = '';
    let agoWin = [];
    let arrData = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ];
    lottoArr.forEach((data, index) => {
        if (index >= count) return false;
        else {
            if(index < 3) {
                let objAgo = {
                    round : data.round,
                    no1 : parseInt(data.no1),
                    no2 : parseInt(data.no2),
                    no3 : parseInt(data.no3),
                    no4 : parseInt(data.no4),
                    no5 : parseInt(data.no5),
                    no6 : parseInt(data.no6)
                }
                agoWin.push(objAgo);            
            }
            let acArr = [
                parseInt(data.no1),
                parseInt(data.no2),
                parseInt(data.no3),
                parseInt(data.no4),
                parseInt(data.no5),
                parseInt(data.no6)
            ];
            acArr.forEach(thisData => {
                arrData[thisData-1] = arrData[thisData-1] + 1;
            });
        }
    });
    week26Str += '<tr>';
    arrData.forEach((data, index) => {
        let agoCheck = '';
        let winNumber = index + 1;
        let winNumberAgoFlag = false;
        let numberColorFlag = false;
        agoWin.forEach((agoData, agoIndex) => {
            if(winNumber === agoData['no1'] || winNumber === agoData['no2'] || winNumber === agoData['no3'] || winNumber === agoData['no4'] || winNumber === agoData['no5'] || winNumber === agoData['no6']) {
                if(agoCheck !== "") agoCheck += ',';
                agoCheck += agoIndex+1;
                winNumberAgoFlag = true;
            }
        });
        winNumberAgoFlag ? winNumber += '<span style="font-size:xx-small;margin-left:4px;">'+agoCheck+'주전</span>' : '';
        index % 4 === 0 ? week26Str += '</tr><tr>' : '';
        data === 0
            ? (data = '<span class="win-num0-color">' + data + '</span>', numberColorFlag = true)
            : '';
        data === 3
            ? (data = '<span class="win-num3-color">' + data + '</span>', numberColorFlag = true)
            : '';
        data === 4
            ? (data = '<span class="win-num4-color">' + data + '</span>', numberColorFlag = true)
            : '';
        (!numberColorFlag) ? data = '<span>' + data + '</span>' : '';
        week26Str += '<td>'+winNumber+'</td>';
        week26Str += '<td>'+data+'</td>';
    });
    week26Str += '</tr>';
    const week26Body = document.querySelectorAll('#week26Modal tbody')[0];
    week26Body.innerHTML = week26Str;
};
/**
 * 분석공식문서 그리기
 */
const drawNoteTemplateFile = () => {
    fetch('/template/note.json')
        .then(response => response.json())
        .then(json => {
            let noteStr = '';
            json.forEach((data, index) => {
                noteStr += '<p class="section-mark">' + (parseInt(index) + 1) + '. ' + data.title + '</p>';
                data.content.trim() !== '' ? (noteStr += '<p>' + data.content.replaceAll('\r\n', '<br>') + '</p>') : '';
                data.img1_path.trim() !== ''
                    ? ((noteStr += '<div class="note-img"><img src="' + data.img1_path + '">'),
                      data.img1_description.trim() !== '' ? (noteStr += '<span>' + data.img1_description + '</span>') : '',
                      (noteStr += '</div>'))
                    : '';
                data.img2_path.trim() !== ''
                    ? ((noteStr += '<div class="note-img"><img src="' + data.img2_path + '">'),
                      data.img2_description.trim() !== '' ? (noteStr += '<span>' + data.img2_description + '</span>') : '',
                      (noteStr += '</div>'))
                    : '';
                data.comment.trim() !== '' ? (noteStr += '<p>' + data.comment.replaceAll('\r\n', '<br>') + '</p>') : '';
            });
            document.querySelector('.note').innerHTML = noteStr;
        });
};
/**
 * 이전 당첨 정보 그리기
 * @param {int} count
 */
const drawTextFile = (count = 10) => {
    let str = '';
    lottoArr.forEach((data, index) => {
        if (index >= count) return false;
        else {
            let acArr = [
                parseInt(data.no1),
                parseInt(data.no2),
                parseInt(data.no3),
                parseInt(data.no4),
                parseInt(data.no5),
                parseInt(data.no6)
            ];
            let dataNum = data.no1 + ',' + data.no2 + ',' + data.no3 + ',' + data.no4 + ',' + data.no5 + ',' + data.no6;
            str += '<tr>';
            str += '<td class="tCenter">' + data.round + '</td>';
            str +=
                '<td class="tCenter cp" data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="getNum" data-get-num="' +
                dataNum +
                '" data-round="' +
                data.round +
                '">';
            str += dataNum;
            str += '<span class="font08">(' + getACValue(acArr) + ',' + getLastNumSum(acArr) + ',' + getTotalSum(acArr) + ')</span>';
            str += '</td>';
            str += '<td class="tCenter">' + data.bonusNo + '</td>';
            str += '<td class="tCenter">' + data.date + '</td>';
            str += '</tr>';
        }
    });
    const extractionBody = document.querySelectorAll('.before-number-area tbody')[0];
    extractionBody.innerHTML = str;
};
/**
 * 지난 당첨번호/추출번호의 정보를 레이어에 출력
 * @param {당첨/추출 여부} mode
 * @param {해당 번호} data
 * @param {레이어 타이틀} title
 * @returns String
 */
const setDataNum = (mode, data, title = '번호', dataRound = null) => {
    // console.log('Arr', lottoArr);
    // console.log('data', data);
    // console.log('dataRound', dataRound);
    let acArr = new Array();
    let setPastRecomNegativeNumber = null;
    if (dataRound) {
        let findRound = dataRound - 1;
        let wkRes = lottoArr.find(({ round }) => parseInt(round) === parseInt(findRound));
        setPastRecomNegativeNumber = recomNegativeNumberType1(wkRes);
    }
    let viewCnt = parseInt(document.querySelector('.ext-count:checked').value);
    let checkDataArr = lottoArr.slice(0, viewCnt);
    let str = '';
    let decimalArrText = [];
    let compositeNumberArrText = [];
    let sosabhapText = [];
    let sos5abhapText = [];
    let checkRoundArr = [];
    let checkRoundObj = {};
    let tempData = data.split(',');
    if (tempData.length > 0) {
        tempData.forEach((res, index) => {
            acArr.push(parseInt(res));
            checkRoundObj = { no: tempData[index], round: null };
            decimalArr.indexOf(parseInt(res)) > -1 ? decimalArrText.push(res) : null;
            compositeNumberArr.indexOf(parseInt(res)) > -1 ? compositeNumberArrText.push(res) : null;
            sosabhap.indexOf(parseInt(res)) > -1 ? sosabhapText.push(res) : null;
            sos5abhap.indexOf(parseInt(res)) > -1 ? sos5abhapText.push(res) : null;
            let chkSetData = '';
            checkDataArr.forEach(chkData => {
                let checkTempArr = [
                    chkData.round.toString(),
                    chkData.no1.toString(),
                    chkData.no2.toString(),
                    chkData.no3.toString(),
                    chkData.no4.toString(),
                    chkData.no5.toString(),
                    chkData.no6.toString()
                ];
                if (checkTempArr.indexOf(res.toString()) > -1) {
                    chkSetData.trim() !== '' ? (chkSetData = chkSetData + ',') : null;
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
    str += '<h5 class="card-title">' + title + '</h5>';
    str += '<p class="card-text">';
    str += data;
    if (setPastRecomNegativeNumber) str += '<br><br>자동제외수 : ' + setPastRecomNegativeNumber;
    str += '</p>';
    str += '</div>';
    if (mode === 'set') {
        str += '<ul class="list-group list-group-flush">';
        checkRoundArr.forEach(getData => {
            str += '<li class="list-group-item">';
            str += '<div>' + getData.no + '</div> : ';
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
    str += '<ul>';
    decimalArrText.length > 0 ? (str += '<li>소수(' + decimalArrText.length + ') : ' + decimalArrText.toString() + '</li>') : null;
    compositeNumberArrText.length > 0
        ? (str += '<li>반복수(' + compositeNumberArrText.length + ') : ' + compositeNumberArrText.toString() + '</li>')
        : null;
    sosabhapText.length > 0 ? (str += '<li>3의 배수(' + sosabhapText.length + ') : ' + sosabhapText.toString() + '</li>') : null;
    sos5abhapText.length > 0 ? (str += '<li>5의 배수(' + sos5abhapText.length + ') : ' + sos5abhapText.toString() + '</li>') : null;
    str += '<li>AC값 : ' + getACValue(acArr) + '</li>';
    str += '<li>끝수의 총합 : ' + getLastNumSum(acArr) + '</li>';
    str += '<li>총합 : ' + getTotalSum(acArr) + '</li>';
    str += '</ul>';
    str += '</p>';
    str += '</div>';
    str += '</div>';
    str += '</div>';
    str += '</div>';
    return str;
};

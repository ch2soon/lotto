/**
 * 문자열에서 콤마 제거
 * @param {String} str
 * @returns string
 */
const deleteCommas = str => {
    return str.replace(/,/g, '');
};
/**
 * 숫자에 3자리마다 콤마 넣기
 * @param {int} num
 * @returns string
 */
const numberWithCommas = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 * 숫자인지 확인
 * @param {data} val
 * @returns boolean
 */
const isNumber = val => {
    let pattern = /^[0-9]*$/;
    return pattern.test(val);
};
/**
 * 숫자와 콤마인지 확인
 * @param {data} val
 * @returns boolean
 */
const isCommaNumber = val => {
    let pattern = /^[0-9,]*$/;
    return pattern.test(val);
};
/**
 * 숫자만 입력
 * @param {data} str
 * @returns string
 */
const onlyNumber = str => {
    return str.replace(/[^0-9.]/g, '').replace(/(\.*)\./g, '$1');
};
/**
 * 휴대폰 번호 대시/하이픈 추가
 * @param {int} str
 * @returns string
 */
const phoneWithHyphen = str => {
    return str === null ? null : str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
};
/**
 * 휴대폰 번호 형식 체크
 * @param {data} str
 * @returns boolean
 */
const checkPhoneNumber = str => {
    const check = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/;
    //하이픈 입력 받으려면 /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/
    return check.test(str);
};
/**
 * 6개월전 날짜
 * @returns string
 */
const month6AgoDate = () => {    
    let d = new Date();
    let monthOfYear = d.getMonth();
    d.setMonth(monthOfYear - 6);
    let rtn = d.format("yyyy-MM-dd");
    return rtn;
}
/**
 * Example!!
 * 2011년 09월 11일 오후 03시 45분 42초
 * console.log(new Date().format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초"));
 * 2011-09-11
 * console.log(new Date().format("yyyy-MM-dd"));
 * '11 09.11
 * console.log(new Date().format("'yy MM.dd"));
 * 2011-09-11 일요일
 * console.log(new Date().format("yyyy-MM-dd E"));
 * 현재년도 : 2011
 * console.log("현재년도 : " + new Date().format("yyyy"));
 * @param {date.format} f
 * @returns date
 */
Date.prototype.format = function (f) {
    if (!this.valueOf()) return ' ';
    let weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    let d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, $1 => {
        switch ($1) {
            case 'yyyy':
                return d.getFullYear();
            case 'yy':
                return (d.getFullYear() % 1000).zf(2);
            case 'MM':
                return (d.getMonth() + 1).zf(2);
            case 'dd':
                return d.getDate().zf(2);
            case 'E':
                return weekName[d.getDay()];
            case 'HH':
                return d.getHours().zf(2);
            case 'hh':
                return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case 'mm':
                return d.getMinutes().zf(2);
            case 'ss':
                return d.getSeconds().zf(2);
            case 'a/p':
                return d.getHours() < 12 ? '오전' : '오후';
            default:
                return $1;
        }
    });
};
String.prototype.string = function (len) {
    let s = '',
        i = 0;
    while (i++ < len) {
        s += this;
    }
    return s;
};
String.prototype.zf = function (len) {
    return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
    return this.toString().zf(len);
};
/**
 * 배열 중복제거
 * @param {array} arrData 
 * @returns 
 */
const setDeduplication = (arrData) => {
    let setArr = arrData.reduce((ac, v) => ac.includes(v) ? ac : [...ac, v], []);
    return setArr;
};
/**
 * 로컬 파일 읽어오기
 * getLottoArr 배열에 txt파일내용 치환(txt형식 - no1|no2|no3|no4|no5|no6|추첨일|보너스no|회차)
 * @param {파일경로} file
 * @param {출력할 리스트 수} count
 * @returns array
 */
const readTextFile = file => {
    let getLottoArr = [];
    let rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                let preantArr = allText.split('\n');
                preantArr.forEach(prtData => {
                    let childArr = prtData.split('|');
                    if (childArr[0].trim() !== '') {
                        let lottoObj = {
                            no1: childArr[0],
                            no2: childArr[1],
                            no3: childArr[2],
                            no4: childArr[3],
                            no5: childArr[4],
                            no6: childArr[5],
                            date: childArr[6],
                            bonusNo: childArr[7],
                            round: childArr[8].replace('\r', '')
                        };
                        getLottoArr.push(lottoObj);
                    }
                });
                getLottoArr.sort((a, b) => parseInt(b.round) - parseInt(a.round)); // 내림차순 정렬
            }
        }
    };
    rawFile.send(null);
    return getLottoArr;
};
/**
 * API로 로또번호 가져오기 - drwNo:회차
 * @param {가져올 회차번호} drwNo
 */
const getAPILottoNumber = drwNo => {
    try {
        const url = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=' + drwNo;
        const headers = new Headers({
            // 'access-control-allow-origin': '*'
            /*"Content-Type": "application/json"*/
        });
        const getData = url => fetch(url, { headers });
        getData(url)
            .then(resp => {
                if (resp.ok) return resp.json();
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                if (data.returnValue == 'success') {
                    let str = '';
                    str += '<tr>';
                    str += '<td>' + data.drwNo + '</td>';
                    str += '<td>';
                    str +=
                        data.drwtNo1 +
                        ',' +
                        data.drwtNo2 +
                        ',' +
                        data.drwtNo3 +
                        ',' +
                        data.drwtNo4 +
                        ',' +
                        data.drwtNo5 +
                        ',' +
                        data.drwtNo6;
                    str += '</td>';
                    str += '<td>' + data.bnusNo + '</td>';
                    str += '<td>' + data.drwNoDate + '</td>';
                    str += '</tr>';
                    const modalBody = getApiModal.querySelectorAll('.modal-body tbody')[0];
                    modalBody.innerHTML = str;
                } else {
                    alert('정상적인 회차번호가 아닙니다.\n다시 입력해 주세요.');
                    document.querySelector('.drwNo').value = '';
                    document.querySelector('.drwNo').focus();
                }
            })
            .catch(excResp => {
                console.log('catch', excResp);
            });
    } catch {
        console.log('error');
    }
};
/**
 * 추천 제외수 생성 형식 1
 * @param {array} arr
 * @returns array
 */
const recomNegativeNumberType1 = arr => {
    let recomNegativeNumber = [];
    // S : 4주간 2번이상 또는 10주간 4번이상은 재출현할 확율은 낮다
    let recent10WList = [];
    let recent4WList = [];
    let cnt = 0;
    parseInt(arr.round) === parseInt(lottoArr[0].round)
        ? lottoArr.forEach((data, index) => {
              index < 10
                  ? (recent10WList.push(data.no1),
                    recent10WList.push(data.no2),
                    recent10WList.push(data.no3),
                    recent10WList.push(data.no4),
                    recent10WList.push(data.no5),
                    recent10WList.push(data.no6))
                  : null;
              index < 4
                  ? (recent4WList.push(data.no1),
                    recent4WList.push(data.no2),
                    recent4WList.push(data.no3),
                    recent4WList.push(data.no4),
                    recent4WList.push(data.no5),
                    recent4WList.push(data.no6))
                  : null;
          })
        : // 이전 회차 산출된 제외수 확인
          lottoArr.forEach(data => {
              if (parseInt(data.round) <= parseInt(arr.round)) {
                  cnt < 10
                      ? (recent10WList.push(data.no1),
                        recent10WList.push(data.no2),
                        recent10WList.push(data.no3),
                        recent10WList.push(data.no4),
                        recent10WList.push(data.no5),
                        recent10WList.push(data.no6),
                        cnt++)
                      : null;
                  cnt < 4
                      ? (recent4WList.push(data.no1),
                        recent4WList.push(data.no2),
                        recent4WList.push(data.no3),
                        recent4WList.push(data.no4),
                        recent4WList.push(data.no5),
                        recent4WList.push(data.no6))
                      : // cnt++
                        null;
              }
          });
    const result4w = recent4WList.reduce((accu, curr) => {
        if ((accu[curr] || 0) + 1 > 2) recomNegativeNumber.push(parseInt(curr));
        accu[curr] = (accu[curr] || 0) + 1;
        return accu;
    }, {});
    const result10w = recent10WList.reduce((accu, curr) => {
        if ((accu[curr] || 0) + 1 >= 4) recomNegativeNumber.push(parseInt(curr));
        accu[curr] = (accu[curr] || 0) + 1;
        return accu;
    }, {});
    // console.log(result4w);
    // console.log(result10w);
    // E : 4주간 2번이상 또는 10주간 4번이상은 재출현할 확율은 낮다
    recomNegativeNumber.push(parseInt(arr.bonusNo));
    recomNegativeNumber.push(parseInt(arr.no4) + 1);
    recomNegativeNumber.push(parseInt(arr.no2));
    recomNegativeNumber.push(parseInt(arr.no2) + 1);
    recomNegativeNumber.push(parseInt(arr.no3));
    recomNegativeNumber.push(parseInt(arr.no1) + 2);
    recomNegativeNumber.push(parseInt(arr.no5) - 1);
    recomNegativeNumber.push(Math.abs(parseInt(arr.bonusNo) - parseInt(arr.no6)));
    recomNegativeNumber.push(parseInt(arr.no5) - parseInt(arr.no3));
    recomNegativeNumber.sort((a, b) => {
        return a - b;
    });
    return [...new Set(recomNegativeNumber)];
};
/**
 * AC값 추출 공식 : 묶음수-(개수-1)
 * @param {비교배열} arr
 * @returns int
 */
const getACValue = arr => {
    let varArr = new Array();
    arr.forEach((data, index) => {
        arr.forEach((sdata, sindex) => {
            index != sindex && index < sindex ? varArr.push(Number(sdata) - Number(data)) : null;
        });
    });
    let setArr = varArr.filter((v, i) => varArr.indexOf(v) === i);
    let ac = setArr.length - (arr.length - 1);
    return ac;
};
/**
 * 배열 총합
 * @param {비교배열} arr
 * @returns int
 */
const getTotalSum = arr => {
    const total = arr.reduce(function add(sum, currValue) {
        return sum + currValue;
    }, 0);
    return total;
};
/**
 * 배열 끝수 총합
 * @param {비교배열} arr
 * @returns int
 */
const getLastNumSum = tarr => {
    let arr = new Array();
    tarr.forEach(data => {
        arr.push(calculate(data));
    });
    const total = arr.reduce(function add(sum, currValue) {
        return sum + currValue;
    }, 0);
    return total;
};
/**
 * 일의자리수 구하기
 * @param {int} num
 * @returns int
 */
const calculate = num => {
    let result;
    num < 10 ? (result = num) : null;
    let str = String(num);
    for (let i = 1; i < str.length + 1; i = i * 10) {
        num >= 10 * i ? (result = ((num % 10) * i - (num % i)) / i) : 0;
        return result;
    }
};

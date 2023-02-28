// 문자열에서 콤마 제거
const deleteCommas = (str) => {
    return str.replace(/,/g, "");
}
// 숫자에 콤마 넣기
const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// 숫자인지 확인
const isNumber = (val) => {
    let pattern = /^[0-9]*$/;
    return pattern.test(val);
}
// 숫자와 콤마인지 확인
const isCommaNumber = (val) => {
    let pattern = /^[0-9,]*$/;
    return pattern.test(val);
}
// 숫자만 입력
const onlyNumber = (str) => {
    return str.replace(/[^0-9.]/g, "").replace(/(\.*)\./g, "$1");
}
// 휴대폰 번호 대시/하이픈 추가
const phoneWithHyphen = (str) => {
    return str === null
    ? null
    : str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
}
// 휴대폰 번호 입력 체크
const checkPhoneNumber = (str) => {
    const check = /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/;
    //하이픈 입력 받으려면 /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/
    return check.test(str);
}
/* Example!!
//2011년 09월 11일 오후 03시 45분 42초
console.log(new Date().format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초")); 
//2011-09-11
console.log(new Date().format("yyyy-MM-dd")); 
//'11 09.11
console.log(new Date().format("'yy MM.dd")); 
//2011-09-11 일요일
console.log(new Date().format("yyyy-MM-dd E")); 
//현재년도 : 2011
console.log("현재년도 : " + new Date().format("yyyy"));
*/
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " "; 
    let weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let d = this;     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, ($1) => {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
}; 
String.prototype.string = function(len){let s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
// 로컬 파일 읽어오기
const readTextFile = (file, count=10) => {
    lottoArr = [];
    let rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                let preantArr = allText.split('\n');
                preantArr.forEach((prtData) => {
                    let childArr = prtData.split('|');
                    if(childArr[0].trim() !== "") {
                        let lottoObj = {
                            'no1':childArr[0],
                            'no2':childArr[1],
                            'no3':childArr[2],
                            'no4':childArr[3],
                            'no5':childArr[4],
                            'no6':childArr[5],
                            'date':childArr[6],
                            'bonusNo':childArr[7],
                            'round':childArr[8].replace('\r','')
                        }
                        lottoArr.push(lottoObj);
                    }
                });
                lottoArr.sort((a, b) => parseInt(b.round) - parseInt(a.round));     // 내림차순 정렬
                let i=0;
                let str = '';
                lottoArr.forEach((data) => {
                    if(i >= count) return false;
                    else {
                        let dataNum = data.no1+','+data.no2+','+data.no3+','+data.no4+','+data.no5+','+data.no6;
                        str += '<tr>';
                        str += '<td class="tCenter">'+data.round+'</td>';
                        str += '<td class="tCenter cp" data-bs-toggle="modal" data-bs-target="#numberInfoModal" data-type="getNum" data-get-num="'+dataNum+'">';
                        str += dataNum;
                        str += '</td>';
                        str += '<td class="tCenter">'+data.bonusNo+'</td>';
                        str += '<td class="tCenter">'+data.date+'</td>';
                        str += '</tr>';
                    }
                    i++;
                });
                const extractionBody = document.querySelectorAll('.before_number_area tbody')[0];
                extractionBody.innerHTML = str;
            }
        }
    }
    rawFile.send(null);
}
// API로 로또번호 가져오기 - drwNo:회차
const getAPILottoNumber = (drwNo) => {
    try {
        const url = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo='+drwNo;
        const headers = new Headers({ /*'Content-Type': 'text/xml'*/ });
        const getData = (url) => fetch(url, { headers });
        getData(url).then(resp => {
            if(resp.ok) return resp.json();
            // console.log('resp', resp, respJson);
            throw new Error('Network response was not ok.');
        }).then(data => {
            if(data.returnValue == 'success') {
                let str = '';
                str += '<tr>';
                str += '<td>'+data.drwNo+'</td>';
                str += '<td>';
                str += data.drwtNo1+','+data.drwtNo2+','+data.drwtNo3+','+data.drwtNo4+','+data.drwtNo5+','+data.drwtNo6;
                str += '</td>';
                str += '<td>'+data.bnusNo+'</td>';
                str += '<td>'+data.drwNoDate+'</td>';
                str += '</tr>';
                const modalBody = getApiModal.querySelectorAll('.modal-body tbody')[0];
                modalBody.innerHTML = str;
            } else {   
                alert('정상적인 회차번호가 아닙니다.\n다시 입력해 주세요.');
                document.querySelector('.drwNo').value = '';
                document.querySelector('.drwNo').focus();
            }
        }).catch(excResp => {
            console.log('catch', excResp);
        });
    } catch {
        console.log('error');
    }
}
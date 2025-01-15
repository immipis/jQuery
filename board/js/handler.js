

init();

// 최초 셋팅
function init() {

    document.getElementById('resetBtn')
        .addEventListener('click', function (e) {
            document.querySelector('input[name="keyword"]').value = '';
            getBoard();
        });

    document.getElementById('initBtn')
        .addEventListener('click', formInit);

    $('#searchBtn').on('click', search)
    $('#saveBtn').on('click', save)
    $('#delBtn').on('click', del)
    getBoard();
}
// 초기화
function formInit() {
    let insertList = document.querySelectorAll('#info input');
    insertList.forEach(el => el.value = '');

}
function getBoard() {
    $.ajax('http://192.168.0.11:8099/boardList')
        .done(result => {
            addBoard(result)
        })
        .fail(err => console.log(err))
}

function addBoard(bd) {
    $('#empList tbody').empty()
    $(bd).each((e, v) => {
        let trTag = $('<tr/>')
        $(trTag).on('click', e => {
            boardInfos(e.currentTarget.children[0].innerText)
        })
        $(['boardNo', 'boardTitle', 'boardWriter', 'boardRegdate']).each((q, w) => {
            $('#empList tbody').append(trTag.append(`<td>${v[w]}</td>`))
        })
    })
}

function search() {
    $.ajax(`http://192.168.0.11:8099/boardList?${$('#search').val()}=${$('input[name=keyword]').val()}`)
        .done(result => {
            addBoard(result)
        })
        .fail(err => console.log(err))
}

function obj() {
    let obj = {}
    $('#info input').each((e, v) => {
        obj[v.name] = v.value
    })
    return obj
}

function save() {
    let boardInfo = obj()
    if (boardInfo.boardNo == '') {
        $.ajax('http://192.168.0.11:8099/boardInsert', {
            type: 'post',
            data: boardInfo
        })
            .done(result => {
                boardInfos(result.boardNo)
                getBoard();
            })
            .fail(err => console.log(err))
    }
    else if (boardInfo.boardNo != '') {
        $.ajax('http://192.168.0.11:8099/boardUpdate', {
            type: 'post',
            contentType: "application/json",
            data: JSON.stringify(boardInfo)
        })
            .done(result => {
                getBoard();
            })
            .fail(err => console.log(err))
    }

}

function boardInfos(bno) {
    $.ajax(`http://192.168.0.11:8099/boardInfo?boardNo=${bno}`)
        .done(result => {
            $(result).each((e, v) => {
                $(Object.keys(v)).each((q, w) => {
                    $(`#info input[name=${w}]`).val(v[w])
                })
            })
        })
        .fail(err => console.log(err))
}

function del() {
    let boardInfo = obj()
    if (boardInfo.boardNo == '') {
        alert("등록되지 않은 게시판은 삭제할수 없습니다")
        return;
    }
    $.ajax(`http://192.168.0.11:8099/boardDelete?boardNo=${boardInfo.boardNo}`)
        .done(result => {
            alert(`${boardInfo.boardNo}게시판 삭제완료`)
            $('#info input').val('')
            getBoard();
        })
        .fail(err => console.log(err))
}
// 전체조회
init();

function init() {
  // 각 태그의 이벤트 처리
  $('#initBtn').on('click', initForm)
  $('#insertBtn').on('click', insertUser)
  $('#updateBtn').on('click', updateUser)
  $('#delBtn').on('click', delUser)

  // 데이터 초기화
  getUserList();
}

function getUserList() {
  $('#list tbody').empty()
  // 서버가 가지고 있는 회원 데이터 전체 조회
  $.ajax('http://192.168.0.11:8099/userList')
    .done(result => {
      addTbody(result)
    })
    .fail(err => console.log(err))
}

function addTbody(list) {

  $.each(list, (i, v) => {
    if (v.id != null) {
      let trTag = $('<tr/>')
      $(trTag).on('click', e => {
        userInfo(e.currentTarget.children[1].innerText)
      })
      let tdTag = $('<td/>')
      tdTag.text(v.no)
      trTag.append(tdTag)

      tdTag = $('<td/>')
      tdTag.text(v.id)
      trTag.append(tdTag)

      tdTag = $('<td/>')
      tdTag.text(v.name)
      trTag.append(tdTag)

      tdTag = $('<td/>')
      let str = ["년", "월", "일"]
      let date = '';
      if(v.joinDate == undefined){
        tdTag.text("날짜가 없음")
      }
      else{
        $.each(v.joinDate.slice(0, 10).split("-"), (e, v) => {
          date += `${v + str[e]} `
        })
        tdTag.text(date)
      }
      trTag.append(tdTag)

      $('#list tbody').append(trTag)
    }
  })
}

function userInfo(id) {
  $.ajax(`http://192.168.0.11:8099/userInfo?id=${id}`)
    .done(result => {
      infoForm(result)
    })
    .fail(err => console.log(err))
}

function infoForm(info) {
  let infoList = $(`#info input,select`);
  $(infoList).each((e, v) => {
    v.value = v.name == 'joinDate' ? info[v.name].slice(0, 10) : info[v.name]
  })
}

function initForm() {
  let infoList = $(`#info input,select`);
  $(infoList).each((e, v) => {
    v.value = '';
  })
}

function insertUser() {
  if ($(`#info input[name='no']`)[0].value != '') {
    alert('등록할수 없습니다')
    initForm()
    return;
  }
  let insertUserInfo = {};
  $(`#info input,select`).each((e, v) => {
    insertUserInfo[v.name] = v.value;
  })
  $.ajax(`http://192.168.0.11:8099/userInsert`, {
    type: 'post',
    data: insertUserInfo
  })
    .done(result => {
      infoForm(result)
      getUserList();
    })
    .fail(err => console.log(err))
}

function updateUser() {
  let a = $(`#info input[name='no']`)[0].value
  if (a == '') {
    alert('수정 할 수 없습니다')
    initForm()
    return;
  }
  let insertUserInfo = {};
  $(`#info input,select`).each((e, v) => {
    insertUserInfo[v.name] = v.value;
  })
  
  $.ajax(`http://192.168.0.11:8099/userUpdate`, {
    type: 'post',
    contentType: "application/json",
    data: JSON.stringify(insertUserInfo)
  })
    .done(result => {
      initForm()
      getUserList();
    })
    .fail(err => console.log(err))
}

function delUser() {
  let a = $(`#info input[name='no']`)[0].value
  let b = $(`#info input[name='id']`)[0].value
  if (a == '') {
    alert('삭제 할 수 없습니다')
    initForm()
    return;
  }
  $.ajax(`http://192.168.0.11:8099/userDelete?id=${b}`)
    .done(result => {
      initForm()
      getUserList();
    })
    .fail(err => console.log(err))
}
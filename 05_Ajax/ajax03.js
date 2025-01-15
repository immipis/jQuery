init();

function init() {
  $('#init').on('click', initForm)
  $('#insert').on('click', insertEmp)
  $('#update').on('click', updateEmp)
  $('#del').on('click', delEmp)

  findAllEmpList();
}

function findAllEmpList() {
  initForm()
  $.ajax('http://192.168.0.11:8099/empList')
    .done(result => {
      addTbody(result)
    })
    .fail(err => console.log(err))
}

function addTbody(list) {
  $('#empList tbody').empty()
  $(list).each((e, v) => {
    let trTag = $('<tr/>')
    $(trTag).on('click', e => {
      empInfo(e.currentTarget.children[0].innerText)
    })
    $(['employeeId', 'lastName', 'jobId']).each((q, w) => {
      $('#empList tbody').append(trTag.append(`<td>${v[w]}</td>`))
    })
  })
}

function empInfo(id) {
  $.ajax(`http://192.168.0.11:8099/empInfo?employeeId=${id}`)
    .done(result => {
      $(result).each((e, v) => {
        $(Object.keys(v)).each((q, w) => {
          $(`#empInfo input[name=${w}]`).val(v[w])
        })
      })
    })
    .fail(err => console.log(err))
}

function initForm() {
  $('#empInfo input').val('');
}

function empInfoM() {
  let obj = {}
  $('#empInfo input').each((e, v) => obj[v.name] = v.value)
  return obj;
}

function insertEmp() {
  let data = empInfoM()
  if (data.employeeId != '') {
    alert('등록 할 수 없습니다')
    return;
  }
  $.ajax('http://192.168.0.11:8099/empInsert', {
    type: 'post',
    data: data
  })
    .done(result => {
      empInfo(result.employeeId)
      findAllEmpList()
    })
    .fail(err => console.log(err))
}

function updateEmp() {
  let data = empInfoM()
  if (data.employeeId == '') {
    alert('수정 할 수 없습니다')
    return;
  }
  $.ajax('http://192.168.0.11:8099/empUpdate', {
    type: 'post',
    contentType: "application/json",
    data: JSON.stringify(data)
  })
    .done(result => {
      findAllEmpList()
    })
    .fail(err => console.log(err))
}

function delEmp() {
  let data = empInfoM()
  if (data.employeeId == '') {
    alert('삭제 할 수 없습니다')
    return;
  }
  $.ajax(`http://192.168.0.11:8099/empDelete?employeeId=${data.employeeId}`)
    .done(result => findAllEmpList())
    .fail(err => console.log(err))
}
$().ready(() => {
  const server = 'http://localhost:3000';
  const $searchStudent = $('#searchStudent');
  const $main = $('main');
  const $table = $('.table');
  let checkGender;
  $main.css(('margin-top'), $('.navbar').outerHeight());
  $searchStudent.hide();

  const mkThead = `<thead class="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">NAME</th>
                            <th scope="col">AGE</th>
                            <th scope="col">GENDER</th>
                            <th scope="col">ID</th>
                            <th scope="col">SUBJECTS</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>`;

  // all functions
  function renderSubjects(subjectsArray, button) {
    let subjects = '';
    // show subjects as a button or no
    if (button) {
      subjectsArray.forEach((subject) => {
        subjects += `<button type = "button" id="${subject}" class ="btn btn-outline-info" >${subject}</button>   `;
      });
      return subjects;
    } else {
      subjectsArray.forEach((subject, index) => {
        if (index !== subjectsArray.length - 1) {
          if (subject !== '') {
            subjects += `${subject},`;
          }
        } else {
          if (subject !== '') {
            subjects += `${subject}`;
          }
        }
      });
      return subjects;
    }
  }

  function mkTbody(student, index) {
    return $(`<tr id="${student._id}">
                <th scope="row">${index}</th>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td>${student._id}</td>
                <td>${renderSubjects(student.subjects, 'button')}</td>
                <td><button id="${student._id}" type="button" class="btn btn-outline-primary editbtn" data-toggle="modal" data-target="#studentmodal">EDIT</button>   <button id="${student._id}" type="button" class="btn btn-outline-danger deletebtn">DELETE</button></td>
              </tr>`);
  }

  function mkModalBody(tittle) {
    $('.modal-content').empty().append(`
              <div class="modal-header">
          <h5 class="modal-title" id="studentForm">${tittle} STUDENT</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <input type="text" id="name" class="form-control" placeholder="Name" required>
            <input type="number" id="age" class="form-control" placeholder="Age" required>
            <div id="gendersContainer">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="male" value="male">
                <label class="form-check-label" for="male">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="female" value="female">
                <label class="form-check-label" for="female">Female</label>
              </div>
            </div>
            <input type="text" id="street" class="form-control" placeholder="Street" required>
            <input type="text" id="city" class="form-control" placeholder="City" required>
            <input type="text" id="postal" class="form-control" placeholder="Postal" required>
            <input type="text" id="subjects" class="form-control" placeholder="subjects" required>
            <div class="form-group row">
              <div class="col-sm-10 form-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary">Save</button>
              </div>
            </div>
          </form>
          <div class="modal-footer">
          </div>
        </div>`);
  }

  function loadError(message) {
    $table
      .empty()
      .append(`<div class="alert alert-danger" role="alert">
                ${message}
                </div>`);
  }

  function loadFreshData() {
    $.ajax(`${server}/api/students`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        if (!data.error) {
          $table.empty().append(mkThead);
          data.forEach((student, index) => {
            $table.append(mkTbody(student, index));
          });
        } else {
          loadError(data.error);
        }
      })
      .fail((data) => {
        loadError(data.error);
      });
  }

  // delete student
  function deleteStudent(id) {
    $.ajax(`${server}/api/student/${id}`, {
        method: 'DELETE',
        contentType: 'application/json',
      })
      .done((data) => {
        if (!data.error) {
          loadFreshData(server);
        } else {
          loadError(data.error);
        }
      })
      .fail((data) => {
        loadError(data.error);
      });
  }

  function fillModalEdit(studentId) {
    $('.form-footer button:nth-child(2)').attr('id', studentId).addClass('save');
    $.ajax(`${server}/api/student/${studentId}`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        if (!data.error) {
          $('#name').val(data.name);
          $('#age').val(data.age);
          $('#street').val(data.address.street);
          $('#city').val(data.address.city);
          $(`#${data.gender}`).removeAttr('checked').attr('checked', 'checked');
          checkGender = data.gender;
          $('#postal').val(data.address.postal);
          $('#subjects').val(renderSubjects(data.subjects));
        } else {
          loadError(data.error);
        }
      })
      .fail((data) => {
        loadError(data.error);
      });
  }

  function createEditStudent(method, studentId) {
    let ajaxCall = `${server}/api/student/${studentId}`;
    if (!studentId) {
      ajaxCall = `${server}/api/student`;

    }
    const name = $('#name').val();
    const age = $('#age').val();
    const street = $('#street').val();
    const city = $('#city').val();
    const gender = checkGender;
    const postal = $('#postal').val();
    const subjects = $('#subjects').val().split(',');
    //  control if the fields are empty
    if ((name && age && street && city && postal && gender && subjects) === '') {
      $('.modal-footer').empty().append(`<div class="alert alert-danger" role="alert">
                      All field must be filled!
                    </div>`);
    } else {
      $.ajax(ajaxCall, {
          method: method,
          contentType: 'application/json',
          data: JSON.stringify({
            name: name,
            age: age,
            gender: gender,
            street: street,
            postal: postal,
            city: city,
            subjects: subjects
          }),
        })
        .done((data) => {
          if (!data.error) {
            $('.modal').modal('toggle');
            loadFreshData(server);
          } else {
            loadError(data.error);
          }

        })
        .fail((data) => {
          loadError(data.error);
        });
    }
  }

  // shows an ajax search with one or more data
  function ajaxSearchData(toSearch, path) {
    $.ajax(`${server}/api/${path}/${toSearch}`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        if (!data.error) {
          if (data.length === undefined) {
            $table
              .empty()
              .append(mkThead)
              .append(mkTbody(data, 0));
          } else {
            $table.empty().append(mkThead);
            data.forEach((student, index) => {
              $table.append(mkTbody(student, index));
            });
          }
        } else {
          loadError(data.error);
        }
      })
      .fail((data) => {
        loadError(data.responseJSON.error);
      });
  }

  function editGender(gender) {
    if (gender === 'male') {
      $('#female').removeAttr('checked')
      $('#male').attr('checked', 'checked');
    } else if (gender === 'female') {
      $('#male').removeAttr('checked')
      $('#female').attr('checked', 'checked');
    }
    $('#gendersContainer .alert').remove();
    $('#gendersContainer').append(`<div class="alert alert-dark" role="alert">
                                        ${gender} Student.
                                      </div>`);
  }
  // search one student by id
  function findStudent() {
    const seachData = $('#studentId').val();
    $('#studentId').val('');
    $searchStudent.hide('slow');
    // check if is a number
    const check = Number.isInteger(seachData / 1);
    if (check) {
      ajaxSearchData(seachData, 'searchNumbers');
    } else if (seachData.length === 24) {
      ajaxSearchData(seachData, 'student');
    } else {
      ajaxSearchData(seachData, 'searchText');
    }

  }
  //Web start
  // load students list
  loadFreshData(server);
  // keyup for search bar
  $('#studentId').keyup(() => {
    if ($('#studentId').val() === '') {
      $searchStudent.hide('slow');
    } else {
      $searchStudent.show('slow');
    }
  });
  // click event with CONTROL FLOW
  $('body').click((event) => {
    event.preventDefault();
    const { target } = event;
    const clickId = target.getAttribute('id');
    if (clickId !== null) {
      const clickClass = target.getAttribute('class');
      if (clickClass.match('btn-outline-info')) {
        ajaxSearchData(clickId, 'searchText');
      } else if (clickClass.match('form-check-input')) {
        checkGender = target.getAttribute('value');
        editGender(checkGender);
      } else if (clickClass.match('editbtn')) {
        mkModalBody('EDIT');
        fillModalEdit(clickId);
      } else if (clickClass.match('deletebtn')) {
        deleteStudent(clickId);
      } else if (clickId.match('createStudent')) {
        mkModalBody('CREATE');
        $('.form-footer button:nth-child(2)').attr('id', 'create');
      } else if (clickId.match('searchStudent')) {
        findStudent();
      } else if (clickId.match('showStudents')) {
        loadFreshData(server);
      } else if (clickClass.match('save')) {
        createEditStudent('PUT', clickId);
      } else if (clickId.match('create')) {
        createEditStudent('POST');
      }
    }
  });
});
